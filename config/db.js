const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Required for cloud databases!
  }
});

// 🌟 NEW: Test the connection when the server starts and print a message!
pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ Failed to connect to Database:', err.message);
  } else {
    console.log('✅ Successfully connected to PostgreSQL Cloud Database!');
  }
});

module.exports = pool;