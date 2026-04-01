const { Pool } = require('pg');
require('dotenv').config();

// 🧠 THE SENIOR DEV TRICK: Automatically detect if we are Local or Cloud!
const dbUrl = process.env.DATABASE_URL || '';
const isLocal = dbUrl.includes('localhost');

const pool = new Pool({
  connectionString: dbUrl,
  // Automatically turn ON SSL for Neon, turn OFF SSL for your laptop!
  ssl: isLocal ? false : { rejectUnauthorized: false },
  // Give your laptop more connections, but protect Neon's free tier
  max: isLocal ? 20 : 10, 
  idleTimeoutMillis: 30000, 
  connectionTimeoutMillis: 15000, 
});

pool.query('SELECT NOW()', (err, res) => {
  if (err) {
    console.error('❌ Failed to connect to Database:', err.message);
  } else {
    console.log(`✅ Successfully connected to ${isLocal ? 'LOCAL (Laptop)' : 'CLOUD (Neon)'} PostgreSQL Database!`);
  }
});

module.exports = pool;