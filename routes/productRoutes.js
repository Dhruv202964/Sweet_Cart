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

// 3. --- ROUTES ---

// GET All Products
router.get('/', productController.getAllProducts);

// POST New Product
router.post('/', upload.single('image'), productController.addProduct);

// PUT Update Product (Full Edit)
router.put('/:id', upload.single('image'), productController.updateProduct);

// PATCH Update Stock Only (For Smart Delete)
router.patch('/:id/stock', productController.updateStock);

// DELETE Product (Entire Item)
router.delete('/:id', productController.deleteProduct);

module.exports = router;