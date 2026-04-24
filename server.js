require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const { Pool } = require('pg');

const app = express();

// ==========================================
// 1. DATABASE CONNECTION (Supabase Pooler)
// ==========================================
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false } 
});

pool.connect((err, client, release) => {
  if (err) {
    return console.error('❌ Database connection error:', err.stack);
  }
  console.log('✅ Successfully connected to CLOUD (Supabase)');
  release();
});

// ==========================================
// 2. CORS & SECURITY WHITELIST
// ==========================================
// Here is your exact Vercel link allowing data to flow!
const allowedOrigins = [
  'http://localhost:5173', 
  'https://sweetcart-theta.vercel.app' 
];

app.use(cors({
  origin: function (origin, callback) {
    if (!origin) return callback(null, true);
    if (allowedOrigins.indexOf(origin) === -1) {
      return callback(new Error('CORS blocked this request'), false);
    }
    return callback(null, true);
  },
  credentials: true, 
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization']
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ==========================================
// 3. HOME ROUTE (Proof of Life)
// ==========================================
app.get('/', (req, res) => {
  res.json({ 
    status: "Success", 
    message: "SweetCart API is live and smelling like fresh Farsan!",
    database: "Connected to Supabase"
  });
});

// ==========================================
// 4. ROUTERS
// ==========================================
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes')); 
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/addresses', require('./routes/addressRoutes')); 
app.use('/api/sliders', require('./routes/sliderRoutes'));

// ==========================================
// 5. 404 ERROR HANDLING
// ==========================================
app.use((req, res) => {
  res.status(404).json({ msg: `Backend route not found: ${req.originalUrl}` });
});

// ==========================================
// 6. SERVER START
// ==========================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});