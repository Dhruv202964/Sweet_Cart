const db = require('../config/db');

// 1. Get All Orders
exports.getAllOrders = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        o.order_id, 
        o.total_amount, 
        o.status, 
        o.created_at,
        o.delivery_area, 
        o.delivery_city AS city, 
        o.delivery_address,
        u.full_name AS customer_name, 
        u.email,
        (SELECT COALESCE(SUM(quantity), 0) FROM order_items WHERE order_id = o.order_id) AS item_count
      FROM orders o
      LEFT JOIN users u ON o.customer_id = u.user_id
      ORDER BY o.created_at DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error("❌ GET ERROR:", err.message);
    res.status(500).json({ msg: "Server Error: Could not fetch orders" });
  }
};

// 2. Get Dashboard Stats (NOW WITH MONTHLY & DAILY METRICS)
exports.getDashboardStats = async (req, res) => {
  try {
    // 1. All-Time Total
    const revenueResult = await db.query("SELECT COALESCE(SUM(total_amount), 0) AS total_revenue FROM orders WHERE status = 'Delivered'");
    
    // 2. 📅 THIS MONTH'S PROFIT
    const monthlyRevenueResult = await db.query(`
      SELECT COALESCE(SUM(total_amount), 0) AS monthly_revenue 
      FROM orders 
      WHERE status = 'Delivered' 
      AND EXTRACT(MONTH FROM created_at) = EXTRACT(MONTH FROM CURRENT_DATE)
      AND EXTRACT(YEAR FROM created_at) = EXTRACT(YEAR FROM CURRENT_DATE)
    `);

    // 3. Today's Profit
    const todayRevenueResult = await db.query("SELECT COALESCE(SUM(total_amount), 0) AS today_revenue FROM orders WHERE status = 'Delivered' AND DATE(created_at) = CURRENT_DATE");
    
    // 4. Delivered Today
    const todayDeliveredResult = await db.query("SELECT COUNT(*) AS today_delivered FROM orders WHERE status = 'Delivered' AND DATE(created_at) = CURRENT_DATE");
    
    // 5. Pending & Cancellations
    const pendingResult = await db.query("SELECT COUNT(*) AS pending_count FROM orders WHERE status IN ('Pending', 'Packed', 'Out for Delivery')");
    const cancelledResult = await db.query("SELECT COUNT(*) AS cancelled_count FROM orders WHERE status = 'Cancelled'");

    res.json({
      total_revenue: parseFloat(revenueResult.rows[0].total_revenue),
      monthly_revenue: parseFloat(monthlyRevenueResult.rows[0].monthly_revenue),
      today_revenue: parseFloat(todayRevenueResult.rows[0].today_revenue),
      today_delivered: parseInt(todayDeliveredResult.rows[0].today_delivered),
      pending_orders: parseInt(pendingResult.rows[0].pending_count),
      cancelled_orders: parseInt(cancelledResult.rows[0].cancelled_count)
    });
  } catch (err) {
    console.error("❌ STATS ERROR:", err.message);
    res.status(500).json({ msg: "Server Error: Could not fetch stats" });
  }
};

// 3. Get Sales Analytics (For Chart)
exports.getSalesByArea = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT delivery_city AS city, delivery_area AS area, SUM(total_amount) AS revenue 
      FROM orders 
      WHERE status = 'Delivered'
      GROUP BY delivery_city, delivery_area
      ORDER BY revenue DESC
    `);
    res.json(result.rows || []);
  } catch (err) {
    console.error("❌ ANALYTICS ERROR:", err.message);
    res.status(500).json({ msg: "Failed to fetch analytics data" });
  }
};

// 4. Assign Rider
exports.assignRider = async (req, res) => {
  try {
    const { order_id, rider_id } = req.body;
    const result = await db.query("UPDATE orders SET rider_id = $1, status = 'Out for Delivery' WHERE order_id = $2 RETURNING *", [rider_id, order_id]);
    
    if (result.rows.length === 0) return res.status(404).json({ msg: "Order not found" });
    res.json({ msg: "Rider assigned", order: result.rows[0] });
  } catch (err) {
    console.error("❌ ASSIGN ERROR:", err.message);
    res.status(500).json({ msg: "Server Error: Could not assign rider" });
  }
};

// 5. Update Order Status
exports.updateOrderStatus = async (req, res) => {
  try {
    const { id } = req.params; 
    const { status } = req.body;
    const result = await db.query("UPDATE orders SET status = $1 WHERE order_id = $2 RETURNING *", [status, id]);
    
    if (result.rows.length === 0) return res.status(404).json({ msg: "Order not found" });
    res.json({ msg: "Status updated successfully", order: result.rows[0] });
  } catch (err) {
    console.error("❌ STATUS UPDATE ERROR:", err.message);
    res.status(500).json({ msg: "Server Error: Could not update status" });
  }
};

// 6. Get Specific Order Items
exports.getOrderItems = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(`
      SELECT oi.quantity, oi.price_at_time, p.name AS product_name, p.image_url, p.unit
      FROM order_items oi
      JOIN products p ON oi.product_id = p.product_id
      WHERE oi.order_id = $1
    `);
    res.json(result.rows);
  } catch (err) {
    console.error("❌ ORDER ITEMS ERROR:", err.message);
    res.status(500).json({ msg: "Server Error: Could not fetch order items" });
  }
};

// 7. Customer Checkout (Place New Order)
exports.placeOrder = async (req, res) => {
  const client = await db.connect(); 
  try {
    const { customer_id, cartItems, total_amount, delivery_address, delivery_area, delivery_city } = req.body;
    await client.query('BEGIN');

    const orderResult = await client.query(`
      INSERT INTO orders (customer_id, total_amount, status, delivery_address, delivery_area, delivery_city) 
      VALUES ($1, $2, 'Pending', $3, $4, $5) 
      RETURNING order_id
    `, [customer_id, total_amount, delivery_address, delivery_area, delivery_city]);

    const newOrderId = orderResult.rows[0].order_id;

    for (let item of cartItems) {
      await client.query(`
        INSERT INTO order_items (order_id, product_id, quantity, price_at_time) 
        VALUES ($1, $2, $3, $4)
      `, [newOrderId, item.product_id, item.quantity, item.price]);
      
      await client.query(`
        UPDATE products 
        SET stock_quantity = stock_quantity - $1 
        WHERE product_id = $2
      `, [item.quantity, item.product_id]);
    }

    await client.query('COMMIT');
    res.status(201).json({ msg: "Order placed successfully!", order_id: newOrderId });

  } catch (err) {
    await client.query('ROLLBACK');
    console.error("❌ CHECKOUT ERROR:", err.message);
    res.status(500).json({ msg: "Server Error: Could not process checkout" });
  } finally {
    client.release();
  }
};