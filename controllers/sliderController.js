const db = require('../config/db');

// 1. GET ALL SLIDERS
exports.getAllSliders = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM hero_sliders ORDER BY id ASC');
    res.json(result.rows);
  } catch (err) {
    console.error("Slider Fetch Error:", err);
    res.status(500).json({ msg: "Server error fetching sliders" });
  }
};

// 2. ADD NEW SLIDER
exports.addSlider = async (req, res) => {
  try {
    // 🚀 NEW: Catch the button text and link!
    const { title, subtitle, cta_text, cta_link } = req.body;
    
    const image_url = req.file ? `http://localhost:5000/uploads/${req.file.filename}` : null;

    if (!image_url) {
      return res.status(400).json({ msg: "A banner image is required!" });
    }

    // 🚀 NEW: Save them to the database!
    const result = await db.query(
      'INSERT INTO hero_sliders (image_url, title, subtitle, cta_text, cta_link) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [image_url, title, subtitle, cta_text || 'Shop Now', cta_link || '/menu']
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error("Slider Add Error:", err);
    res.status(500).json({ msg: "Server error adding slider" });
  }
};

// 3. DELETE SLIDER
exports.deleteSlider = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query('DELETE FROM hero_sliders WHERE id = $1', [id]);
    res.json({ msg: "Slider deleted successfully" });
  } catch (err) {
    console.error("Slider Delete Error:", err);
    res.status(500).json({ msg: "Server error deleting slider" });
  }
};

// 4. TOGGLE SLIDER ON/OFF
exports.toggleSliderStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { is_active } = req.body;
    await db.query('UPDATE hero_sliders SET is_active = $1 WHERE id = $2', [is_active, id]);
    res.json({ msg: "Slider status updated" });
  } catch (err) {
    console.error("Slider Toggle Error:", err);
    res.status(500).json({ msg: "Server error updating slider status" });
  }
};

// 5. UPDATE SLIDER (EDIT MODE)
exports.updateSlider = async (req, res) => {
  try {
    const { id } = req.params;
    const { title, subtitle, cta_text, cta_link } = req.body;
    
    let query;
    let params;

    // If the Admin uploaded a NEW image during the edit
    if (req.file) {
      const image_url = `http://localhost:5000/uploads/${req.file.filename}`;
      query = 'UPDATE hero_sliders SET image_url = $1, title = $2, subtitle = $3, cta_text = $4, cta_link = $5 WHERE id = $6';
      params = [image_url, title, subtitle, cta_text, cta_link, id];
    } else {
      // If the Admin ONLY changed the text and kept the old image
      query = 'UPDATE hero_sliders SET title = $1, subtitle = $2, cta_text = $3, cta_link = $4 WHERE id = $5';
      params = [title, subtitle, cta_text, cta_link, id];
    }

    await db.query(query, params);
    res.json({ msg: "Banner updated successfully!" });
  } catch (err) {
    console.error("Slider Update Error:", err);
    res.status(500).json({ msg: "Server error updating slider" });
  }
};