const db = require('../config/db');
const bcrypt = require('bcryptjs');

// 1. Get All Staff
exports.getAllStaff = async (req, res) => {
  try {
    // We added 'full_name' to the select query
    const result = await db.query("SELECT user_id, full_name, email, position, phone, role FROM users WHERE role IN ('admin', 'manager', 'staff')");
    res.json(result.rows);
  } catch (err) {
    console.error("❌ Error fetching staff:", err.message);
    res.status(500).send('Server Error');
  }
};

// 2. Create New Staff (Manual Name Entry)
exports.createStaff = async (req, res) => {
  const { name, email, password, role, phone } = req.body;

  // Validation
  if (!name || !email || !password || !role) {
    return res.status(400).json({ error: "Please fill Name, Email, Password, and Role!" });
  }

  try {
    // Check if User Exists
    const userExist = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    if (userExist.rows.length > 0) {
      return res.status(400).json({ error: "User already exists!" });
    }

    // Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert into Database
    const newUser = await db.query(
      "INSERT INTO users (full_name, email, password_hash, role, position, phone) VALUES ($1, $2, $3, $4, $4, $5) RETURNING user_id, email, role",
      [name, email, hashedPassword, role, phone]
    );

    console.log("✅ New Staff Created:", newUser.rows[0]);
    res.json(newUser.rows[0]);

  } catch (err) {
    console.error("❌ Database Error:", err.message);
    res.status(500).json({ error: err.message });
  }
};