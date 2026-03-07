const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// 1. Ensure 'uploads' folder exists
const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// 2. Multer Configuration for Images
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); 
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// 🌟 NEW: Configure Multer to accept multiple different image fields!
const cpUpload = upload.fields([
  { name: 'image', maxCount: 1 },       // The main display image
  { name: 'gallery', maxCount: 4 }      // Up to 4 gallery slider images
]);

// ==========================================
// 🛒 CUSTOMER ROUTES (Must go BEFORE /:id)
// ==========================================
router.get('/public', productController.getPublicProducts);
router.get('/public/:id', productController.getProductDetails);

// ==========================================
// 🛡️ ADMIN ROUTES 
// ==========================================
// GET All Products
router.get('/', productController.getAllProducts);

// POST New Product (🌟 Updated to accept multiple images)
router.post('/', cpUpload, productController.addProduct);

// PUT Update Product (🌟 Updated to accept multiple images)
router.put('/:id', cpUpload, productController.updateProduct);

// PATCH Update Stock Only (For Smart Delete)
router.patch('/:id/stock', productController.updateStock);

// DELETE Product (Entire Item)
router.delete('/:id', productController.deleteProduct);

module.exports = router;