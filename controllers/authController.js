const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');

// 🌟 Configure the Email Sender
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// 1. Customer Registration
exports.registerCustomer = async (req, res) => {
  try {
    const { full_name, email, password, phone } = req.body; 

    const userExists = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ msg: "Email is already registered" });
    }

    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    const newUser = await db.query(`
      INSERT INTO users (full_name, email, password_hash, role, phone) 
      VALUES ($1, $2, $3, 'customer', $4) 
      RETURNING user_id, full_name, email, role, phone
    `, [full_name, email, password_hash, phone]);

    const token = jwt.sign(
      { user_id: newUser.rows[0].user_id, role: newUser.rows[0].role },
      process.env.JWT_SECRET || 'sweet_cart_secret_key',
      { expiresIn: '7d' } 
    );

    res.status(201).json({
      msg: "Registration successful!",
      token,
      user: newUser.rows[0]
    });

  } catch (err) {
    console.error("❌ REGISTRATION ERROR:", err.message);
    res.status(500).json({ msg: "Server Error: Could not register user" });
  }
};

// 2. Customer Login
exports.loginCustomer = async (req, res) => {
  try {
    const { email, password } = req.body;

    const result = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    if (result.rows.length === 0) {
      return res.status(400).json({ msg: "Invalid email or password" });
    }

    const user = result.rows[0];

    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid email or password" });
    }

    const token = jwt.sign(
      { user_id: user.user_id, role: user.role },
      process.env.JWT_SECRET || 'sweet_cart_secret_key',
      { expiresIn: '7d' }
    );

    res.json({
      msg: "Login successful!",
      token,
      user: {
        user_id: user.user_id,
        full_name: user.full_name,
        email: user.email,
        role: user.role,
        phone: user.phone 
      }
    });

  } catch (err) {
    console.error("❌ LOGIN ERROR:", err.message);
    res.status(500).json({ msg: "Server Error: Could not log in" });
  }
};

// 3. Update User Profile
exports.updateProfile = async (req, res) => {
  try {
    const { user_id, full_name, email, phone } = req.body;
    
    const result = await db.query(
      "UPDATE users SET full_name = $1, email = $2, phone = $3 WHERE user_id = $4 RETURNING user_id, full_name, email, phone, role",
      [full_name, email, phone, user_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ msg: "User not found" });
    }

    res.json({ msg: "Profile updated successfully!", user: result.rows[0] });
  } catch (err) {
    console.error("❌ UPDATE PROFILE ERROR:", err.message);
    res.status(500).json({ msg: "Server Error: Could not update profile" });
  }
};

// 4. Delete User Account
exports.deleteAccount = async (req, res) => {
  try {
    const user_id = req.params.id || req.body.user_id;

    if (!user_id) {
      return res.status(400).json({ msg: "User ID is required to delete account" });
    }

    const result = await db.query(
      "DELETE FROM users WHERE user_id = $1 RETURNING user_id", 
      [user_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ msg: "User not found or already deleted" });
    }

    res.json({ msg: "Account permanently deleted" });
  } catch (err) {
    console.error("❌ DELETE ACCOUNT ERROR:", err.message);
    res.status(500).json({ msg: "Server Error: Could not delete account" });
  }
};

// 🌟 5. Send OTP for Password Reset (UPDATED: 2 Mins + Premium Template)
exports.forgotPassword = async (req, res) => {
  try {
      const { email } = req.body;
      const userCheck = await db.query("SELECT * FROM users WHERE email = $1", [email]);

      if (userCheck.rows.length === 0) {
          return res.status(404).json({ msg: "If that email exists, an OTP has been sent." }); 
      }

      // Generate a 6-digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      
      // 🌟 UPDATED: Set expiry for EXACTLY 2 minutes from now
      const expiry = new Date(Date.now() + 2 * 60000);

      // Save OTP to database
      await db.query(
          "UPDATE users SET reset_otp = $1, reset_otp_expiry = $2 WHERE email = $3",
          [otp, expiry, email]
      );

      // 🌟 UPDATED: Premium Dashboard Email Template
      const mailOptions = {
          from: process.env.EMAIL_USER,
          to: email,
          subject: 'SweetCart - Your Verification Code', 
          html: `
              <!DOCTYPE html>
              <html>
              <head>
                  <meta charset="UTF-8">
                  <meta name="viewport" content="width=device-width, initial-scale=1.0">
                  <title>SweetCart Verification</title>
              </head>
              <body style="margin: 0; padding: 0; font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; background-color: #f3f4f6;">
                  <table border="0" cellpadding="0" cellspacing="0" width="100%" style="padding: 40px 0;">
                      <tr>
                          <td align="center">
                              <table border="0" cellpadding="0" cellspacing="0" width="100%" style="max-width: 500px; background-color: #ffffff; border-radius: 8px; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
                                  <tr>
                                      <td align="center" style="padding: 30px 0 20px 0; border-bottom: 2px solid #f3f4f6;">
                                          <h1 style="margin: 0; color: #d97706; font-size: 28px; font-weight: 900; letter-spacing: 1px;">SweetCart</h1>
                                      </td>
                                  </tr>
                                  <tr>
                                      <td style="padding: 30px 40px; text-align: center;">
                                          <h2 style="margin: 0 0 15px 0; color: #1f2937; font-size: 20px;">Password Reset Request</h2>
                                          <p style="margin: 0 0 25px 0; color: #4b5563; font-size: 15px; line-height: 1.5;">
                                              We received a request to reset your SweetCart password. Enter the following verification code to continue:
                                          </p>
                                          
                                          <div style="background-color: #fffbeb; border: 2px dashed #f59e0b; border-radius: 8px; padding: 20px; margin-bottom: 25px;">
                                              <h1 style="margin: 0; font-size: 42px; font-weight: 700; color: #d97706; letter-spacing: 10px;">${otp}</h1>
                                          </div>
                                          
                                          <p style="margin: 0 0 20px 0; color: #ef4444; font-size: 14px; font-weight: 600;">
                                              ⏱️ This code expires in exactly 2 minutes.
                                          </p>
                                          <p style="margin: 0; color: #6b7280; font-size: 13px; line-height: 1.5;">
                                              If you didn't request this change, please ignore this email to keep your account secure.
                                          </p>
                                      </td>
                                  </tr>
                                  <tr>
                                      <td align="center" style="padding: 20px 40px; background-color: #f9fafb; border-bottom-left-radius: 8px; border-bottom-right-radius: 8px;">
                                          <p style="margin: 0; color: #9ca3af; font-size: 12px;">
                                              &copy; 2026 Team 404 ERROR. All rights reserved.<br>
                                              SweetCart Ecosystem
                                          </p>
                                      </td>
                                  </tr>
                              </table>
                          </td>
                      </tr>
                  </table>
              </body>
              </html>
          `
      };

      await transporter.sendMail(mailOptions);
      res.json({ msg: "OTP sent successfully!" });

  } catch (err) {
      console.error("❌ FORGOT PASSWORD ERROR:", err.message);
      res.status(500).json({ msg: "Server Error: Could not send OTP." });
  }
};

// 6. Verify OTP & Reset Password
exports.resetPassword = async (req, res) => {
  try {
      const { email, otp, newPassword } = req.body;

      const userCheck = await db.query("SELECT * FROM users WHERE email = $1", [email]);
      if (userCheck.rows.length === 0) return res.status(400).json({ msg: "Invalid request." });

      const user = userCheck.rows[0];

      // Check if OTP matches and is not expired
      if (user.reset_otp !== otp) {
          return res.status(400).json({ msg: "Invalid OTP code." });
      }

      if (new Date() > new Date(user.reset_otp_expiry)) {
          return res.status(400).json({ msg: "OTP has expired. Please request a new one." });
      }

      // Hash the new password
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(newPassword, salt);

      // Update password and wipe the OTP data
      await db.query(
          "UPDATE users SET password_hash = $1, reset_otp = NULL, reset_otp_expiry = NULL WHERE email = $2",
          [hashedPassword, email]
      );

      res.json({ msg: "Password successfully reset! You can now log in." });

  } catch (err) {
      console.error("❌ RESET PASSWORD ERROR:", err.message);
      res.status(500).json({ msg: "Server Error: Could not reset password." });
  }
};