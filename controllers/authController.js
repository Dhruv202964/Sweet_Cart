const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer'); // 🌟 NEW: Email Engine Import

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

    // 🌟 ADDED 'phone' to the RETURNING clause so React gets it instantly!
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
        phone: user.phone // 🌟 ADDED 'phone' here so MyAccount.jsx can see it!
      }
    });

  } catch (err) {
    console.error("❌ LOGIN ERROR:", err.message);
    res.status(500).json({ msg: "Server Error: Could not log in" });
  }
};

// 🌟 3. NEW: Update User Profile
exports.updateProfile = async (req, res) => {
  try {
    const { user_id, full_name, email, phone } = req.body;
    
    // Update the user in the database
    const result = await db.query(
      "UPDATE users SET full_name = $1, email = $2, phone = $3 WHERE user_id = $4 RETURNING user_id, full_name, email, phone, role",
      [full_name, email, phone, user_id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Send back the updated user data so the React Context updates!
    res.json({ msg: "Profile updated successfully!", user: result.rows[0] });
  } catch (err) {
    console.error("❌ UPDATE PROFILE ERROR:", err.message);
    res.status(500).json({ msg: "Server Error: Could not update profile" });
  }
};

// 🌟 4. NEW: Delete User Account
exports.deleteAccount = async (req, res) => {
  try {
    // Getting user_id from either the URL parameter or the request body
    const user_id = req.params.id || req.body.user_id;

    if (!user_id) {
      return res.status(400).json({ msg: "User ID is required to delete account" });
    }

    // Delete the user from the database
    // Because of ON DELETE CASCADE, this will also wipe their addresses, etc.
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

// 🌟 5. Send OTP for Password Reset
exports.forgotPassword = async (req, res) => {
  try {
      const { email } = req.body;
      const userCheck = await db.query("SELECT * FROM users WHERE email = $1", [email]);

      if (userCheck.rows.length === 0) {
          return res.status(404).json({ msg: "If that email exists, an OTP has been sent." }); // Security best practice!
      }

      // Generate a 6-digit OTP
      const otp = Math.floor(100000 + Math.random() * 900000).toString();
      // Set expiry for 10 minutes from now
      const expiry = new Date(Date.now() + 10 * 60000);

      // Save OTP to database
      await db.query(
          "UPDATE users SET reset_otp = $1, reset_otp_expiry = $2 WHERE email = $3",
          [otp, expiry, email]
      );

      // Send the email
      const mailOptions = {
          from: process.env.EMAIL_USER,
          to: email,
          subject: 'SweetCart - Password Reset OTP',
          html: `
              <div style="font-family: Arial, sans-serif; text-align: center; padding: 20px;">
                  <h2 style="color: #d97706;">SweetCart Security</h2>
                  <p>Your password reset code is:</p>
                  <h1 style="font-size: 40px; letter-spacing: 5px; color: #111827;">${otp}</h1>
                  <p style="color: #6b7280; font-size: 12px;">This code expires in 10 minutes. Do not share it with anyone.</p>
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

// 🌟 6. Verify OTP & Reset Password
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