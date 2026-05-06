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

// 🌟 5. Send OTP for Password Reset (Premium Enterprise Template)
exports.forgotPassword = async (req, res) => {
  try {
      const { email } = req.body;
      const userCheck = await db.query("SELECT * FROM users WHERE email = $1", [email]);

      if (userCheck.rows.length === 0) {
          return res.status(404).json({ msg: "If that email exists, an OTP has been sent." }); 
      }

      // Generate a 6-digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      
      // Set expiry for EXACTLY 2 minutes from now
      const expiry = new Date(Date.now() + 2 * 60000);

      // Save OTP to database
      await db.query(
          "UPDATE users SET reset_otp = $1, reset_otp_expiry = $2 WHERE email = $3",
          [otp, expiry, email]
      );

      // 🌟 The Premium SweetCart OTP Email Template
      const mailOptions = {
          from: process.env.EMAIL_USER,
          to: email,
          subject: 'SweetCart - Your Secure Verification Code', 
          html: `
          <div style="font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #FFFDF8; border: 1px solid #EAEAEA; border-radius: 16px; overflow: hidden; box-shadow: 0 10px 25px rgba(0,0,0,0.05);">
              
              <!-- Header with Brand Gradient -->
              <div style="background: linear-gradient(135deg, #F59E0B 0%, #D97706 100%); padding: 40px 30px; text-align: center;">
                  <h1 style="color: #FFFFFF; margin: 0; font-size: 32px; font-weight: 900; letter-spacing: 1px;">SweetCart</h1>
                  <p style="color: #FFFDE7; margin: 10px 0 0 0; font-size: 16px; font-weight: 500;">Premium Sweets & Snacks</p>
              </div>

              <!-- Main Body -->
              <div style="padding: 40px 40px 30px; background-color: #FFFFFF; text-align: center;">
                  <h2 style="color: #1F2937; font-size: 24px; font-weight: 800; margin-top: 0; margin-bottom: 20px;">Secure Password Reset</h2>
                  
                  <p style="color: #4B5563; font-size: 16px; line-height: 1.6; margin-bottom: 30px;">
                      We received a request to reset your SweetCart password. Enter the secure verification code below to authorize this change:
                  </p>

                  <!-- The Highlighted OTP Box -->
                  <div style="background-color: #FFFBEB; border: 2px dashed #F59E0B; border-radius: 12px; padding: 25px; margin: 0 auto 30px; max-width: 300px;">
                      <h1 style="margin: 0; font-size: 48px; font-weight: 900; color: #D97706; letter-spacing: 12px; text-align: center;">${otp}</h1>
                  </div>

                  <p style="color: #EF4444; font-size: 15px; font-weight: 700; margin-bottom: 25px;">
                      ⏱️ This code expires in exactly 2 minutes.
                  </p>

                  <p style="color: #9CA3AF; font-size: 13px; line-height: 1.5; border-top: 1px solid #F3F4F6; padding-top: 25px;">
                      If you didn't request a password reset, you can safely ignore this email. Your SweetCart account remains completely secure.
                  </p>
              </div>

              <!-- Footer -->
              <div style="background-color: #1F2937; padding: 25px; text-align: center;">
                  <p style="color: #9CA3AF; font-size: 12px; margin: 0; line-height: 1.6;">
                      &copy; ${new Date().getFullYear()} SweetCart Enterprise. All rights reserved.<br>
                      Engineered and secured by <strong>Team 404 ERROR</strong>.
                  </p>
              </div>
          </div>
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