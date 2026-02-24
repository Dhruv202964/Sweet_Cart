require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./config/db');

const app = express();

// ==========================================
// 1. MIDDLEWARE
// ==========================================
app.use(cors());
app.use(express.json());

// 🛡️ IMPORTANT: Serve the uploads folder so images are visible on the frontend
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ==========================================
// 2. ROUTERS (Modular Architecture)
// ==========================================

// 🔐 Auth Routes (Handles both Admin & Customer Login/Register)
app.use('/api/auth', require('./routes/authRoutes'));

// 🛍️ Product Routes (Handles Admin CRUD & Public Storefront)
app.use('/api/products', require('./routes/productRoutes')); 

// 📦 Order Routes (Handles Admin Logistics & Customer Checkout)
app.use('/api/orders', require('./routes/orderRoutes'));

// ==========================================
// 3. DIRECT ROUTES (Staff & Messages)
// ==========================================
const staffController = require('./controllers/staffController');
const messageController = require('./controllers/messageController');

app.get('/api/staff', staffController.getAllStaff);
app.post('/api/staff/add', staffController.createStaff);

app.get('/api/messages', messageController.getAllMessages);
app.delete('/api/messages/:id', messageController.deleteMessage);

// ==========================================
// 4. START SERVER
// ==========================================
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📂 Uploads served at: http://localhost:${PORT}/uploads`);
});