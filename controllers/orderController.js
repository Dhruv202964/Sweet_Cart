const db = require('../config/db');

// 1. Get All Orders (For Admin Dashboard)
exports.getAllOrders = async (req, res) => {
  try {
    // FIX: Updated query to COUNT() items
    const result = await db.query(`
      SELECT 
        o.order_id, 
        u.email AS customer_name, 
        o.total_amount, 
        o.status, 
        o.delivery_address, 
        d.rider_id,
        COUNT(oi.item_id) AS total_items -- <--- NEW: Counts items in the order
      FROM orders o
      JOIN users u ON o.customer_id = u.user_id
      LEFT JOIN deliveries d ON o.order_id = d.order_id
      LEFT JOIN order_items oi ON o.order_id = oi.order_id -- <--- Connect to items table
      GROUP BY o.order_id, u.email, d.rider_id, d.delivery_id -- <--- Required for counting
      ORDER BY o.created_at DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};  

// 2. Assign Rider (For Logistics)
exports.assignRider = async (req, res) => {
  try {
    const { order_id, rider_id } = req.body;
    
    // Create delivery entry
    await db.query(
      'INSERT INTO deliveries (order_id, rider_id, status) VALUES ($1, $2, $3)',
      [order_id, rider_id, 'assigned']
    );

    // Update order status
    await db.query(
      'UPDATE orders SET status = $1 WHERE order_id = $2',
      ['out_for_delivery', order_id]
    );

    res.json({ message: 'Rider Assigned Successfully' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// 3. Get Order Items (THE MISSING PIECE!)
exports.getOrderItems = async (req, res) => {
  try {
    const { id } = req.params;
    const query = `
      SELECT oi.quantity, p.name, p.price, p.image_url 
      FROM order_items oi 
      JOIN products p ON oi.product_id = p.product_id 
      WHERE oi.order_id = $1
    `;
    const result = await db.query(query, [id]);
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};  

// 4. Get Dashboard Stats (For the Home Screen)
exports.getDashboardStats = async (req, res) => {
  try {
    // Run 3 queries in parallel to get the stats
    const totalOrders = await db.query('SELECT COUNT(*) FROM orders');
    const totalRevenue = await db.query('SELECT SUM(total_amount) FROM orders');
    const pendingOrders = await db.query("SELECT COUNT(*) FROM orders WHERE status = 'pending'");

    res.json({
      total_orders: totalOrders.rows[0].count,
      total_revenue: totalRevenue.rows[0].sum || 0, // Returns 0 if no orders exist
      pending_deliveries: pendingOrders.rows[0].count
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};