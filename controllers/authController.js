const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// 1. REGISTER USER
exports.register = async (req, res) => {
  const { full_name, email, password, phone, role } = req.body;

  try {
    // Check if user exists
    const userCheck = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ message: 'User already exists!' });
    }

    // Hash Password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Insert User
    const newUser = await db.query(
      'INSERT INTO users (full_name, email, password_hash, role, phone) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [full_name, email, hashedPassword, role || 'customer', phone]
    );

    // Generate Token
    const token = jwt.sign({ id: newUser.rows[0].user_id, role: newUser.rows[0].role }, 'secret123', { expiresIn: '1h' });

    res.json({ token, user: newUser.rows[0] });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// 2. LOGIN USER (The New Part)
exports.login = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user exists
    const user = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (user.rows.length === 0) {
      return res.status(400).json({ message: 'Invalid Credentials' });
    }

    // Check Password (Compare typed password with hashed password in DB)
    const validPassword = await bcrypt.compare(password, user.rows[0].password_hash);
    if (!validPassword) {
      return res.status(400).json({ message: 'Invalid Password' });
    }

    // Generate Token
    const token = jwt.sign(
      { id: user.rows[0].user_id, role: user.rows[0].role }, 
      'secret123', 
      { expiresIn: '1h' }
    );

    res.json({ token, user: user.rows[0] });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};