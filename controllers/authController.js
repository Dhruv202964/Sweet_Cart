const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

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