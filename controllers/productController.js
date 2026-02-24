const db = require('../config/db');

// ==========================================
// 🛡️ ADMIN PANEL ENDPOINTS
// ==========================================

// 1. Get All Products (Admin View - shows out of stock too)
exports.getAllProducts = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT p.*, c.name as category_name 
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.category_id
      ORDER BY p.created_at DESC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error("❌ GET ERROR:", err.message);
    res.status(500).json({ msg: "Database error" });
  }
};

// 2. Add New Product
exports.addProduct = async (req, res) => {
  try {
    const { name, category, price, stock, description, unit } = req.body;
    const image_url = req.file ? `/uploads/${req.file.filename}` : '';

    const query = `
      INSERT INTO products (name, category_id, price, stock_quantity, description, image_url, unit) 
      VALUES ($1, $2, $3, $4, $5, $6, $7) 
      RETURNING *`;
    
    const values = [name, parseInt(category), price, stock, description, image_url, unit];
    const result = await db.query(query, values);
    res.json(result.rows[0]);
  } catch (err) {
    console.error("❌ POST ERROR:", err.message);
    res.status(500).json({ msg: "Failed to add product" });
  }
};

// 3. Update Product (Handles Image Update and Unit)
exports.updateProduct = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, category, price, stock, description, unit } = req.body;
    
    // Use new file if uploaded, otherwise COALESCE keeps the old database value
    const image_url = req.file ? `/uploads/${req.file.filename}` : null;

    const query = `
      UPDATE products 
      SET name = $1, category_id = $2, price = $3, stock_quantity = $4, 
          description = $5, unit = $6,
          image_url = COALESCE($7, image_url)
      WHERE product_id = $8 RETURNING *`;
    
    const values = [name, parseInt(category), price, stock, description, unit, image_url, id];
    const result = await db.query(query, values);

    if (result.rows.length === 0) {
      return res.status(404).json({ msg: "Product not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error("❌ PUT ERROR:", err.message);
    res.status(500).json({ msg: "Update failed" });
  }
};

// 4. Update Stock Only
exports.updateStock = async (req, res) => {
  try {
    const { id } = req.params;
    const { stock } = req.body;
    const result = await db.query("UPDATE products SET stock_quantity = $1 WHERE product_id = $2 RETURNING *", [stock, id]);
    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).json({ msg: "Stock update failed" });
  }
};

// 5. Delete Product
exports.deleteProduct = async (req, res) => {
  try {
    const { id } = req.params;
    await db.query("DELETE FROM products WHERE product_id = $1", [id]);
    res.json({ msg: "Product deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Delete failed" });
  }
};


// ==========================================
// 🛒 CUSTOMER STOREFRONT ENDPOINTS (PUBLIC)
// ==========================================

// 6. Get Public Products (Storefront View - only shows IN STOCK items)
exports.getPublicProducts = async (req, res) => {
  try {
    const result = await db.query(`
      SELECT 
        p.product_id, p.name, p.description, p.price, 
        p.stock_quantity, p.unit, p.image_url, 
        c.name AS category_name 
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.category_id
      WHERE p.stock_quantity > 0
      ORDER BY c.name ASC, p.name ASC
    `);
    res.json(result.rows);
  } catch (err) {
    console.error("❌ PUBLIC PRODUCTS ERROR:", err.message);
    res.status(500).json({ msg: "Server Error: Could not fetch public products" });
  }
};

// 7. Get Single Product Details (For Product Page)
exports.getProductDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await db.query(`
      SELECT 
        p.product_id, p.name, p.description, p.price, 
        p.stock_quantity, p.unit, p.image_url, 
        c.name AS category_name 
      FROM products p
      LEFT JOIN categories c ON p.category_id = c.category_id
      WHERE p.product_id = $1
    `, [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ msg: "Product not found" });
    }
    res.json(result.rows[0]);
  } catch (err) {
    console.error("❌ PRODUCT DETAILS ERROR:", err.message);
    res.status(500).json({ msg: "Server Error: Could not fetch product details" });
  }
};