const express = require('express');
const router = express.Router();
const sliderController = require('../controllers/sliderController');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// 1. Ensure 'uploads' folder exists
const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// 2. Multer Configuration for Slider Banners
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'uploads/'); 
  },
  filename: (req, file, cb) => {
    // Adds "slider_" prefix so you know what the file is in your uploads folder!
    cb(null, 'slider_' + Date.now() + path.extname(file.originalname));
  }
});

const upload = multer({ storage: storage });

// ==========================================
// 🎢 SLIDER ROUTES
// ==========================================
router.get('/', sliderController.getAllSliders); // Fetch all
router.post('/', upload.single('image'), sliderController.addSlider); // Upload new
router.delete('/:id', sliderController.deleteSlider); // Delete
router.patch('/:id/toggle', sliderController.toggleSliderStatus); // Turn on/off

// 🚀 NEW: Update Route for Edit Mode
router.put('/:id', upload.single('image'), sliderController.updateSlider); 

module.exports = router;