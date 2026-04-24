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
  ssl: { rejectUnauthorized: false } // Required for Supabase/Render
});

pool.connect((err, client, release) => {
  if (err) {
    return console.error('❌ Database connection error:', err.stack);
  }
  console.log('✅ Successfully connected to CLOUD (Supabase)');
  release();
});

// ==========================================
// 2. CORS & MIDDLEWARE
// ==========================================
// Allows your local VS Code AND your live Vercel link to talk to the brain
const allowedOrigins = [
  'http://localhost:5173', 
  'https://sweet-cart-client.vercel.app', // Update this with your actual Vercel URL
  'https://sweet-cart-admin.vercel.app'    // Update this with your Admin Vercel URL later
];

// Remove the allowedOrigins array and the function
// Use this one line to allow EVERYTHING for the presentation
app.use(cors({
  origin: true, // This automatically allows whatever URL hits it
  credentials: true
}));

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ==========================================
// 3. THE "FACULTY-FRIENDLY" HOME ROUTE
// ==========================================
app.get('/', (req, res) => {
  res.json({ 
    status: "Success", 
    message: "SweetCart API is live and smelling like fresh Farsan!",
    database: "Connected to Supabase"
  });
});

// ==========================================
// 4. ROUTERS (Integrated from your snippet)
// ==========================================
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes')); 
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/addresses', require('./routes/addressRoutes')); 
app.use('/api/sliders', require('./routes/sliderRoutes'));

// ==========================================
// 5. ERROR HANDLING (404 Catch-all)
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