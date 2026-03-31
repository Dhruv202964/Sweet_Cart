const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    rejectUnauthorized: false // Required for cloud databases!
  },
  // 🔥 NEON STABILITY ARMOR 🔥
  max: 10, // Don't overwhelm Neon with too many connections at once
  idleTimeoutMillis: 30000, // Close idle connections after 30 seconds to free up space
  connectionTimeoutMillis: 5000, // Return a clean error if Neon is sleeping, instead of crashing
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