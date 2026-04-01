const db = require('../config/db');

// 1. SAVE A NEW ADDRESS
exports.addAddress = async (req, res) => {
    try {
        const { user_id, flat_house, delivery_area, delivery_city, delivery_state, pincode, landmark } = req.body;
        
        const newAddress = await db.query(
            `INSERT INTO user_addresses 
            (user_id, flat_house, delivery_area, delivery_city, delivery_state, pincode, landmark) 
            VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
            [user_id, flat_house, delivery_area, delivery_city, delivery_state, pincode, landmark]
        );
        
        res.json(newAddress.rows[0]);
    } catch (err) {
        console.error("Address Save Error:", err.message);
        res.status(500).json({ msg: "Server error while saving address" });
    }
};

// 2. GET ALL ADDRESSES FOR A USER
exports.getUserAddresses = async (req, res) => {
    try {
        const { user_id } = req.params;
        const addresses = await db.query(
            "SELECT * FROM user_addresses WHERE user_id = $1 ORDER BY created_at DESC",
            [user_id]
        );
        res.json(addresses.rows);
    } catch (err) {
        console.error("Fetch Addresses Error:", err.message);
        res.status(500).send("Server Error");
    }
};

// 3. DELETE AN ADDRESS
exports.deleteAddress = async (req, res) => {
    try {
        const { id } = req.params;
        await db.query("DELETE FROM user_addresses WHERE address_id = $1", [id]);
        res.json({ msg: "Address successfully deleted" });
    } catch (err) {
        console.error("Delete Address Error:", err.message);
        res.status(500).send("Server Error");
    }
};