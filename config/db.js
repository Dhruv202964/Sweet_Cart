const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'sweet_cart_db', // <--- Make sure this matches exactly
  password: 'admin123',      // <--- Make sure this is 'admin123'
  port: 5432,
});

pool.connect()
  .then(() => console.log('✅ Connected to Sweet_Cart Database'))
  .catch(err => console.error('❌ Database Connection Error:', err.message));

module.exports = pool;