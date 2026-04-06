const db = require('../config/db');

// 🌟 1. Add a New Address (SMART FUNNEL)
exports.addAddress = async (req, res) => {
  try {
    const { 
        user_id, address_type, full_name, phone, 
        flat_house, area_street, landmark, city, state, pincode, 
        street_address // Catching the old field from MyAccount
    } = req.body;

    // 🧠 THE SMART FALLBACK LOGIC
    // If flat_house exists (Checkout), use it. If not, use street_address (MyAccount). 
    // If area_street is missing, provide a safe fallback so the NOT NULL constraint doesn't crash.
    const final_flat_house = flat_house || street_address || 'Address provided';
    const final_area_street = area_street || '-';
    const final_landmark = landmark || '';

    const result = await db.query(
      `INSERT INTO saved_addresses (user_id, address_type, full_name, phone, flat_house, area_street, landmark, city, state, pincode) 
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) 
       RETURNING *`,
      [
          user_id, 
          address_type || 'Other', 
          full_name, 
          phone, 
          final_flat_house, 
          final_area_street, 
          final_landmark, 
          city, 
          state, 
          pincode
      ]
    );

    res.status(201).json({ msg: "Address saved successfully!", address: result.rows[0] });
  } catch (err) {
    console.error("❌ ADD ADDRESS ERROR:", err.message);
    res.status(500).json({ msg: "Server Error: Could not save address" });
  }
};

// 🌟 2. Fetch User Addresses
exports.getUserAddresses = async (req, res) => {
  try {
    const { user_id } = req.params;
    const result = await db.query("SELECT * FROM saved_addresses WHERE user_id = $1 ORDER BY created_at DESC", [user_id]);
    res.json(result.rows);
  } catch (err) {
    console.error("❌ FETCH ADDRESSES ERROR:", err.message);
    res.status(500).json({ msg: "Server Error: Could not fetch addresses" });
  }
};

// 🌟 3. Delete an Address
exports.deleteAddress = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM saved_addresses WHERE id = $1", [id]);
    res.json({ msg: "Address deleted successfully" });
  } catch (err) {
    console.error("❌ DELETE ADDRESS ERROR:", err.message);
    res.status(500).json({ msg: "Server Error: Could not delete address" });
  }
};

// 🌟 4. Update an Address
exports.updateAddress = async (req, res) => {
  try {
    const { id } = req.params;
    const { address_type, full_name, phone, flat_house, area_street, landmark, city, state, pincode } = req.body;

    const result = await db.query(
      `UPDATE saved_addresses 
       SET address_type = $1, full_name = $2, phone = $3, flat_house = $4, area_street = $5, landmark = $6, city = $7, state = $8, pincode = $9
       WHERE id = $10 RETURNING *`,
      [address_type, full_name, phone, flat_house, area_street, landmark, city, state, pincode, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ msg: "Address not found" });
    }

    res.json({ msg: "Address updated successfully", address: result.rows[0] });
  } catch (err) {
    console.error("❌ UPDATE ADDRESS ERROR:", err.message);
    res.status(500).json({ msg: "Server Error: Could not update address" });
  }
};