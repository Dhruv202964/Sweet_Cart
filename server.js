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
// This tiny function runs every time the site is accessed to count visitors for "Today"
app.use(async (req, res, next) => {
    // Only track if it's a real page request, not just a CSS/Image file
    if (req.path.startsWith('/api')) {
        try {
            await db.query(`
                INSERT INTO daily_stats (stat_date, total_visitors)
                VALUES (CURRENT_DATE, 1)
                ON CONFLICT (stat_date) 
                DO UPDATE SET total_visitors = daily_stats.total_visitors + 1
            `);
        } catch (err) {
            // Silently fail so it doesn't break the app if DB is busy
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

// ==========================================
// 3. DIRECT ROUTES (Messages)
// ==========================================
const messageController = require('./controllers/messageController');
app.get('/api/messages', messageController.getAllMessages);
app.delete('/api/messages/:id', messageController.deleteMessage);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`📂 Analytics Active: Tracking daily stats...`);
});