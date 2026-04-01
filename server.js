require('dotenv').config();
const express = require('express');
const cors = require('cors');
const path = require('path');
const db = require('./config/db');

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ==========================================
// 📈 ANALYTICS ENGINE (Auto-Track Visitors)
// ==========================================
app.use(async (req, res, next) => {
    // 🔥 THE FIX: Tell the analytics to IGNORE the 10-second background radar!
    const isPollingOrders = req.path === '/api/orders' && req.method === 'GET';
    const isPollingCustomers = req.path.startsWith('/api/admin/customers') && req.method === 'GET';

    // Only track if it's a real API request AND it's not our silent radar
    if (req.path.startsWith('/api') && !isPollingOrders && !isPollingCustomers) {
        try {
            await db.query(`
                INSERT INTO daily_stats (stat_date, total_visitors)
                VALUES (CURRENT_DATE, 1)
                ON CONFLICT (stat_date) 
                DO UPDATE SET total_visitors = daily_stats.total_visitors + 1
            `);
        } catch (err) {
            // This will now stay quiet because it's not being spammed every 10 seconds!
            console.log("Analytics error ignored");
        }
    }
    next();
});

// ==========================================
// 2. ROUTERS
// ==========================================
app.use('/api/auth', require('./routes/authRoutes'));
app.use('/api/products', require('./routes/productRoutes')); 
app.use('/api/orders', require('./routes/orderRoutes'));
app.use('/api/admin', require('./routes/adminRoutes'));
app.use('/api/addresses', require('./routes/addressRoutes')); // New address routes

// ==========================================
// 3. DIRECT ROUTES (Messages)
// ==========================================
const messageController = require('./controllers/messageController');
app.get('/api/messages', messageController.getAllMessages);
app.delete('/api/messages/:id', messageController.deleteMessage);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📂 Analytics Active: Tracking daily stats (Radar ignored)...`);
});