require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./config/db');

const app = express();

// 1. Middleware
app.use(cors());
app.use(express.json());
// 🛡️ IMPORTANT: Serve the uploads folder so images are visible on the frontend
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// 2. --- ROUTES ---

// Auth Routes (Direct)
const authController = require('./controllers/authController');
app.post('/api/auth/register', authController.register);
app.post('/api/auth/login', authController.login);

// Dedicated Route Files (Better for File Uploads)
app.use('/api/products', require('./routes/productRoutes')); // <--- THE FIX
app.use('/api/orders', require('./routes/orderRoutes'));

// Staff & Message Routes (Direct for now)
const staffController = require('./controllers/staffController');
const messageController = require('./controllers/messageController');
app.get('/api/staff', staffController.getAllStaff);
app.post('/api/staff/add', staffController.createStaff);
app.get('/api/messages', messageController.getAllMessages);
app.delete('/api/messages/:id', messageController.deleteMessage);

// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📂 Uploads served at: http://localhost:${PORT}/uploads`);
});