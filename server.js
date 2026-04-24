require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');

const app = express();

// ==========================================
// 1. WIDE OPEN CORS (Local Development)
// ==========================================
app.use(cors()); 
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ==========================================
// 2. ROUTERS (These will use your db.js behind the scenes!)
// ==========================================
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes')); 
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/addresses', require('./routes/addressRoutes')); 
app.use('/api/sliders', require('./routes/sliderRoutes'));

// ==========================================
// 3. ERROR HANDLING
// ==========================================
app.use((req, res) => {
  res.status(404).json({ msg: `Backend route not found: ${req.originalUrl}` });
});

// ==========================================
// 4. START SERVER
// ==========================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Local Server running on port ${PORT}`);
});