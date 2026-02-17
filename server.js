require('dotenv').config();
const express = require('express');
const cors = require('cors');
const db = require('./config/db');

// Import Controllers
const authController = require('./controllers/authController');
const productController = require('./controllers/productController');
const orderController = require('./controllers/orderController');
const staffController = require('./controllers/staffController');     // <--- NEW
const messageController = require('./controllers/messageController'); // <--- NEW

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// --- ROUTES ---

// 1. Authentication Routes
app.post('/api/auth/register', authController.register);
app.post('/api/auth/login', authController.login);

// 2. Product Routes (Inventory)
app.get('/api/products', productController.getAllProducts);
app.post('/api/products/add', productController.addProduct);

// 3. Order Routes
app.get('/api/orders', orderController.getAllOrders);
app.get('/api/orders/stats', orderController.getDashboardStats);
app.get('/api/orders/analytics', orderController.getSalesByArea); // Analytics Graph
app.post('/api/orders/assign', orderController.assignRider);
app.get('/api/orders/:id', orderController.getOrderItems);

// 4. Staff / HR Routes (NEW)
app.get('/api/staff', staffController.getAllStaff);
app.post('/api/staff/add', staffController.createStaff);

// 5. Customer Messages Routes (NEW)
app.get('/api/messages', messageController.getAllMessages);
app.delete('/api/messages/:id', messageController.deleteMessage);


// Start Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});