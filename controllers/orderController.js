const db = require('../config/db');

// 1. Get ALL Orders (For Admin Dashboard)
exports.getAllOrders = async (req, res) => {
  try {
    // We join with 'users' to get the Customer Name
    // We join with 'deliveries' to see if a Rider is assigned
    const query = `
      SELECT 
        o.order_id, 
        u.full_name as customer_name, 
        o.total_amount, 
        o.status, 
        o.delivery_address, 
        o.created_at,
        d.rider_id -- Will be NULL if no rider assigned yet
      FROM orders o
      JOIN users u ON o.customer_id = u.user_id
      LEFT JOIN deliveries d ON o.order_id = d.order_id
      ORDER BY o.created_at DESC
    `;
    
    const result = await db.query(query);
    res.json(result.rows);

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// 2. Assign Rider to Order (We will use this later)
exports.assignRider = async (req, res) => {
  const { order_id, rider_id } = req.body;
  
  try {
    // 1. Update Order Status
    await db.query("UPDATE orders SET status = 'out_for_delivery' WHERE order_id = $1", [order_id]);

    // 2. Create/Update Delivery Record
    // (Upsert logic: If delivery exists, update rider. If not, insert.)
    const checkDelivery = await db.query("SELECT * FROM deliveries WHERE order_id = $1", [order_id]);
    
    if (checkDelivery.rows.length > 0) {
        await db.query("UPDATE deliveries SET rider_id = $1, status = 'assigned' WHERE order_id = $2", [rider_id, order_id]);
    } else {
        await db.query("INSERT INTO deliveries (order_id, rider_id, status) VALUES ($1, $2, 'assigned')", [order_id, rider_id]);
    }

    res.json({ message: "Rider Assigned Successfully" });

  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};