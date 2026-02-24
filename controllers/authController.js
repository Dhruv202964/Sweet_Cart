const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 1. Customer Registration
exports.registerCustomer = async (req, res) => {
  try {
    // She will send these exact fields from her React form
    const { full_name, email, password, phone } = req.body; 

    // Step A: Check if the customer already exists
    const userExists = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    if (userExists.rows.length > 0) {
      return res.status(400).json({ msg: "Email is already registered" });
    }

    // Step B: Hash the password for security
    const salt = await bcrypt.genSalt(10);
    const password_hash = await bcrypt.hash(password, salt);

    // Step C: Insert into database (Hardcoding the role as 'customer')
    const newUser = await db.query(`
      INSERT INTO users (full_name, email, password_hash, role, phone) 
      VALUES ($1, $2, $3, 'customer', $4) 
      RETURNING user_id, full_name, email, role
    `, [full_name, email, password_hash, phone]);

    // Step D: Generate the Login Token (Keeps them logged in for 7 days)
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

    // Step A: Find the user
    const result = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    if (result.rows.length === 0) {
      return res.status(400).json({ msg: "Invalid email or password" });
    }

    const user = result.rows[0];

    // Step B: Check the password
    const isMatch = await bcrypt.compare(password, user.password_hash);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid email or password" });
    }

    // Step C: Generate Token
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
        role: user.role
      }
    });

  } catch (err) {
    console.error("❌ LOGIN ERROR:", err.message);
    res.status(500).json({ msg: "Server Error: Could not log in" });
  }
};