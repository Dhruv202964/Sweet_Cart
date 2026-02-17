const db = require('../config/db');

// 1. Get All Products (Sorted by ID so they stay in order)
exports.getAllProducts = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM products ORDER BY product_id ASC');
    res.json(result.rows);
  } catch (err) {
    console.error("❌ Error fetching products:", err.message);
    res.status(500).send('Server Error');
  }
};

// 2. Add New Product (Smart Version - Fixes the crash!)
exports.addProduct = async (req, res) => {
  const { name, category, price, stock_quantity, image_url } = req.body;

  // A. Validation: Check if important fields are missing
  if (!name || !price || !stock_quantity) {
     return res.status(400).json({ error: "Please fill Name, Price, and Stock!" });
  }

  // B. SMART FIX: If image_url is empty, use this default gray image
  const finalImage = (image_url && image_url.trim() !== "") 
      ? image_url 
      : "https://placehold.co/400?text=No+Image"; 

  try {
    const newProduct = await db.query(
      'INSERT INTO products (name, category, price, stock_quantity, image_url) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, category, price, stock_quantity, finalImage]
    );
    
    console.log("✅ Product Added:", newProduct.rows[0].name); 
    res.json(newProduct.rows[0]);
  } catch (err) {
    console.error("❌ Database Error:", err.message); // This prints the error in your terminal
    res.status(500).send('Server Error');
  }
};