const express = require('express');
const router = express.Router();
const db = require('../config/db'); 

// 📊 GET: Fetch Registered Customers 
router.get('/customers', async (req, res) => {
    try {
        const registeredUsers = await db.query(`
            SELECT full_name as name, email, phone, created_at, role 
            FROM users 
            ORDER BY created_at DESC
        `);

        res.json({
            success: true,
            data: {
                registeredCount: registeredUsers.rowCount,
                registeredList: registeredUsers.rows,
                guestCount: 0,
                guestList: [],
                totalCustomers: registeredUsers.rowCount
            }
        });
    } catch (err) {
        console.error("CRM Fetch Error:", err);
        res.status(500).json({ success: false, msg: "Server Error" });
    }
});

// 📅 GET: Fetch Historical Stats by Date (The Time Machine!)
router.get('/stats-by-date', async (req, res) => {
    const { date } = req.query; // Expecting YYYY-MM-DD
    try {
        const stats = await db.query(`
            SELECT * FROM daily_stats WHERE stat_date = $1
        `, [date]);

        if (stats.rows.length > 0) {
            res.json({ success: true, data: stats.rows[0] });
        } else {
            // If no record exists for that day, return zeros instead of an error
            res.json({ 
                success: true, 
                data: { total_orders: 0, total_revenue: 0, total_visitors: 0, stat_date: date } 
            });
        }
    } catch (err) {
        console.error("Stats Fetch Error:", err);
        res.status(500).json({ success: false, msg: "Error fetching historical data" });
    }
});

module.exports = router;