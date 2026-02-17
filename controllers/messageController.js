const db = require('../config/db');

// 1. Get All Messages
exports.getAllMessages = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM contact_messages ORDER BY created_at DESC');
    res.json(result.rows);
  } catch (err) {
    res.status(500).send('Server Error');
  }
};

// 2. Delete a Message (Clean up)
exports.deleteMessage = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM contact_messages WHERE id = $1', [id]);
    res.json({ message: "Deleted successfully" });
  } catch (err) {
    res.status(500).send('Server Error');
  }
};