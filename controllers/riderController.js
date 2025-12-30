const db = require('../config/db');

// 1. Get My Deliveries (For the Rider)
exports.getMyDeliveries = async (req, res) => {
  const { rider_id } = req.params; // We will pass rider_id in the URL for now

  try {
    const result = await db.query(
      `SELECT d.delivery_id, o.order_id, o.delivery_address, o.total_amount, d.status 
       FROM deliveries d
       JOIN orders o ON d.order_id = o.order_id
       WHERE d.rider_id = $1`,
      [rider_id]
    );
    
    if (result.rows.length === 0) {
      return res.json({ message: "No deliveries assigned yet." });
    }

    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};

// 2. Update Delivery Status (e.g., "Delivered")
exports.updateStatus = async (req, res) => {
  const { delivery_id, status } = req.body;

  try {
    const result = await db.query(
      'UPDATE deliveries SET status = $1, delivered_at = NOW() WHERE delivery_id = $2 RETURNING *',
      [status, delivery_id]
    );

    res.json({ message: "Status Updated!", delivery: result.rows[0] });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
};