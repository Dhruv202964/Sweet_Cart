const db = require('../config/db');

// 1. Get All Orders (🚀 UPGRADED: Now pulls audio_message for the Admin Badge!)
exports.getAllOrders = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        o.order_id, o.total_amount, o.status, o.payment_status, o.created_at,
        o.customer_name, o.phone, o.flat_house, o.landmark, o.state, o.pincode, 
        o.delivery_area, o.delivery_city AS city, o.delivery_address, u.email,
        o.audio_message, /* 🎙️ THIS POWERS THE VOICE GIFT BADGE IN ADMIN! */
        (SELECT COALESCE(SUM(quantity), 0) FROM order_items WHERE order_id = o.order_id) AS item_count
      FROM orders o
      LEFT JOIN users u ON o.customer_id = u.user_id
      WHERE NOT EXISTS (
        SELECT 1 FROM order_items oi WHERE oi.order_id = o.order_id AND oi.is_custom_box = true
      )
      ORDER BY o.order_id DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error("❌ GET ERROR:", err.message);
    res.status(500).json({ msg: "Server Error: Could not fetch orders" });
  }
};

// 2. Get Dashboard Stats
exports.getDashboardStats = async (req, res) => {
  try {
    const revenueResult = await db.query("SELECT COALESCE(SUM(total_amount), 0) AS total_revenue FROM orders WHERE status = 'Delivered'");
    
    const monthlyRevenueResult = await db.query(`
      SELECT COALESCE(SUM(total_amount), 0) AS monthly_revenue 
      FROM orders 
      WHERE status = 'Delivered' 
      AND EXTRACT(MONTH FROM created_at) = EXTRACT(MONTH FROM CURRENT_DATE)
      AND EXTRACT(YEAR FROM created_at) = EXTRACT(YEAR FROM CURRENT_DATE)
    `);

    const todayRevenueResult = await db.query("SELECT COALESCE(SUM(total_amount), 0) AS today_revenue FROM orders WHERE status = 'Delivered' AND DATE(updated_at) = CURRENT_DATE");
    const todayDeliveredResult = await db.query("SELECT COUNT(*) AS today_delivered FROM orders WHERE status = 'Delivered' AND DATE(updated_at) = CURRENT_DATE");
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

// 3. Get Sales Analytics
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
    const result = await db.query("UPDATE orders SET status = $1, updated_at = CURRENT_TIMESTAMP WHERE order_id = $2 RETURNING *", [status, id]);
    
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
      SELECT 
        oi.quantity, 
        oi.price_at_time, 
        oi.weight_selected, 
        oi.is_custom_box, 
        oi.custom_box_selections,
        COALESCE(p.name, 'Premium Custom Box') AS product_name, 
        p.image_url, 
        COALESCE(p.unit, 'box') AS unit
      FROM order_items oi
      LEFT JOIN products p ON oi.product_id = p.product_id
      WHERE oi.order_id = $1
    `, [id]); 
    res.json(result.rows);
  } catch (err) {
    console.error("❌ ORDER ITEMS ERROR:", err.message);
    res.status(500).json({ msg: "Server Error: Could not fetch order items" });
  }
};
 
// 7. Track Order
exports.trackOrder = async (req, res) => {
  try {
    const { order_id, email } = req.query;

    let query = `
      SELECT 
        o.order_id, o.status, o.payment_status, o.created_at, o.customer_name, o.total_amount, 
        o.delivery_address, o.flat_house, o.landmark, o.delivery_city, o.state, o.pincode, o.phone,
        (
          SELECT json_agg(json_build_object(
            'name', COALESCE(p.name, 'Premium Custom Box'), 
            'quantity', oi.quantity, 
            'price', oi.price_at_time,
            'weight_selected', oi.weight_selected,
            'is_custom_box', oi.is_custom_box,
            'custom_box_selections', oi.custom_box_selections
          ))
          FROM order_items oi 
          LEFT JOIN products p ON oi.product_id = p.product_id 
          WHERE oi.order_id = o.order_id
        ) as items
      FROM orders o
      WHERE 1=1
    `;
    const values = [];

    if (order_id) {
      values.push(order_id);
      query += ` AND o.order_id = $${values.length}`;
    } else if (email) {
      values.push(email);
      query += ` AND o.email = $${values.length}`;
    } else {
      return res.status(400).json({ msg: "Please provide an Order ID or Email." });
    }

    query += ` ORDER BY o.created_at DESC LIMIT 5`; 

    const result = await db.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ msg: "No orders found for this information." });
    }

    res.json(result.rows);
  } catch (err) {
    console.error("❌ TRACK ORDER ERROR:", err.message);
    res.status(500).json({ msg: "Server Error: Could not track order" });
  }
};

// 8. Customer Checkout (🚀 UPGRADED: Handles the Audio String perfectly!)
exports.placeOrder = async (req, res) => {
  const client = await db.connect(); 
  try {
    const { 
      customer_id, firstName, lastName, email, mobile, 
      address, area, landmark, state, city, pincode, 
      cartItems, total_amount,
      audio_message // 🎙️ EXTRACTS AUDIO FROM FRONTEND
    } = req.body;
    
    await client.query('BEGIN');

    const customer_name = `${firstName} ${lastName}`;
    const full_address = `${address}, ${landmark}`;

    // 🎙️ INSERTS AUDIO INTO DATABASE
    const orderResult = await client.query(`
      INSERT INTO orders (
        customer_id, customer_name, email, phone, 
        delivery_address, flat_house, landmark, delivery_area, delivery_city, state, pincode, 
        total_amount, status, payment_status, audio_message
      ) 
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, 'Pending', 'Pending Payment', $13) 
      RETURNING order_id
    `, [
      customer_id || null, customer_name, email, mobile, 
      full_address, address, landmark, area, city, state, pincode, 
      total_amount, audio_message || null // 🎙️ FALLBACK TO NULL IF NO AUDIO
    ]);

    const newOrderId = orderResult.rows[0].order_id;

    for (let item of cartItems) {
      // If it's a custom box (99999), save null so we don't break the database FK!
      const p_id = item.product_id === 99999 ? null : item.product_id;

      await client.query(`
        INSERT INTO order_items (
          order_id, product_id, quantity, price_at_time, 
          weight_selected, is_custom_box, custom_box_selections
        ) 
        VALUES ($1, $2, $3, $4, $5, $6, $7)
      `, [
        newOrderId, 
        p_id, 
        item.quantity, 
        item.price,
        item.weight_selected || '1KG',
        item.is_custom_box || false,
        item.custom_box_selections || null
      ]);
      
      // Only reduce stock if it's a real product
      if (p_id !== null) {
        await client.query(`
          UPDATE products 
          SET stock_quantity = stock_quantity - $1 
          WHERE product_id = $2
        `, [item.quantity, p_id]);
      }
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

// 9. DELETE ORDER
exports.deleteOrder = async (req, res) => {
  const client = await db.connect();
  try {
    const { id } = req.params;
    await client.query('BEGIN');
    await client.query('DELETE FROM order_items WHERE order_id = $1', [id]);
    const result = await client.query('DELETE FROM orders WHERE order_id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: "Order not found in database." });
    }
    await client.query('COMMIT');
    res.json({ msg: `Order #${id} completely deleted! 🗑️` });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error("❌ DELETE ERROR:", err.message);
    res.status(500).json({ error: "Database constraint error. Could not delete." });
  } finally {
    client.release();
  }
};

// 10. Check Payment Status
exports.checkPaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query("SELECT payment_status, status FROM orders WHERE order_id = $1", [id]);
    if (result.rows.length === 0) return res.status(404).json({ msg: "Order not found" });
    res.json({ payment_status: result.rows[0].payment_status, status: result.rows[0].status });
  } catch (err) {
    console.error("❌ PAYMENT CHECK ERROR:", err.message);
    res.status(500).json({ msg: "Server Error: Could not check payment status" });
  }
};

// 11. ADMIN APPROVE PAYMENT
exports.approvePayment = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("UPDATE orders SET payment_status = 'Paid', status = 'Pending' WHERE order_id = $1", [id]);
    res.json({ msg: "Payment officially approved by Admin!" });
  } catch (err) {
    console.error("❌ APPROVE PAYMENT ERROR:", err.message);
    res.status(500).json({ msg: "Server Error: Could not approve payment" });
  }
};

// 12. GHOST ORDER DELETION
exports.cancelUnpaidOrder = async (req, res) => {
  const client = await db.connect();
  try {
    const { id } = req.params;
    await client.query('BEGIN');
    
    await client.query("DELETE FROM order_items WHERE order_id = $1", [id]);
    await client.query("DELETE FROM orders WHERE order_id = $1 AND payment_status = 'Pending Payment'", [id]);
    
    await client.query('COMMIT');
    res.json({ msg: "Ghost order permanently deleted." });
  } catch (err) {
    await client.query('ROLLBACK');
    console.error("❌ GHOST ORDER DELETE ERROR:", err.message);
    res.status(500).json({ msg: "Server Error: Could not delete order" });
  } finally {
    client.release();
  }
};

// 13. GET PENDING PAYMENT APPROVALS
exports.getPendingApprovals = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        o.order_id, o.customer_name, o.phone, o.total_amount, o.created_at,
        (
          SELECT json_agg(json_build_object(
            'name', COALESCE(p.name, 'Premium Custom Box'), 
            'quantity', oi.quantity,
            'weight_selected', oi.weight_selected,
            'is_custom_box', oi.is_custom_box
          ))
          FROM order_items oi 
          LEFT JOIN products p ON oi.product_id = p.product_id 
          WHERE oi.order_id = o.order_id
        ) as items
      FROM orders o
      WHERE o.payment_status = 'Pending Payment' 
      AND o.status NOT IN ('Cancelled', 'Cancelled by User', 'Cancelled by Admin')
      ORDER BY o.created_at ASC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error("❌ PENDING APPROVALS ERROR:", err.message);
    res.status(500).json({ msg: "Server Error: Could not fetch pending approvals" });
  }
};

// 14. ADMIN: GET CUSTOM BOX PACKING QUEUE
exports.getCustomBoxOrders = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        o.order_id, o.customer_name, o.phone, o.delivery_address, o.status, o.created_at,
        oi.weight_selected AS box_size, oi.custom_box_selections AS packing_list
      FROM orders o
      JOIN order_items oi ON o.order_id = oi.order_id
      WHERE oi.is_custom_box = true
      AND o.payment_status != 'Pending Payment' 
      ORDER BY o.created_at DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error("❌ CUSTOM BOX QUEUE ERROR:", err.message);
    res.status(500).json({ msg: "Server Error: Could not fetch custom boxes" });
  }
};

// 15. PUBLIC 🎁 GET VOICE GIFT BY ORDER ID
exports.getVoiceGift = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(
      "SELECT customer_name, audio_message FROM orders WHERE order_id = $1", 
      [id]
    );
    
    if (result.rows.length === 0 || !result.rows[0].audio_message) {
      return res.status(404).json({ msg: "No voice gift found for this order." });
    }
    
    res.json({ 
      sender: result.rows[0].customer_name, 
      audio: result.rows[0].audio_message 
    });
  } catch (err) {
    console.error("❌ VOICE GIFT ERROR:", err.message);
    res.status(500).json({ msg: "Server Error: Could not load voice gift." });
  }
};