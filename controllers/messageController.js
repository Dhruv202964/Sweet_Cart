const db = require('../config/db');

// 🚀 1. Create a New Message (THE MISSING ENGINE!)
exports.createMessage = async (req, res) => {
  try {
    const { customer_name, email, subject, message } = req.body;
    
    // Insert into your PostgreSQL table
    await db.query(
      'INSERT INTO contact_messages (customer_name, email, subject, message) VALUES ($1, $2, $3, $4)',
      [customer_name, email, subject, message]
    );
    
    res.status(201).json({ msg: "Message saved successfully!" });
  } catch (err) {
    console.error("Error saving message:", err);
    res.status(500).json({ msg: "Server Error" });
  }
};

// 2. Get All Messages (For Admin Inbox)
exports.getAllMessages = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM contact_messages ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
};

// 3. Delete a Message (Clean up)
exports.deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM contact_messages WHERE id = $1', [id]);
    res.json({ msg: "Deleted successfully" });
  } catch (err) {
    res.status(500).json({ msg: "Server Error" });
  }
};