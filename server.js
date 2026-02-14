const express = require('express');
const cors = require('cors');
const db = require('./config/db');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/products', require('./routes/productRoutes'));
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/rider', require('./routes/riderRoutes'));
app.use('/api/orders', require('./routes/orderRoutes'));

// Test Route
app.get('/', (req, res) => {
  res.json({ message: 'Welcome to the Sweet_Cart API 🍬' });
});

// Database Check
app.get('/test-db', async (req, res) => {
  try {
    const result = await db.query('SELECT NOW()');
    res.json({ 
      message: 'Database Connected Successfully!', 
      server_time: result.rows[0].now 
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// 3. Test Users Table
app.get('/test-users', async (req, res) => {
  try {
    // This query asks the DB "Do you have a table named users?"
    const result = await db.query("SELECT * FROM users");
    res.json({ 
      message: 'Table users exists!', 
      count: result.rowCount,
      data: result.rows 
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: err.message });
  }
});

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});