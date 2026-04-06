const express = require('express');
const router = express.Router();
const addressController = require('../controllers/addressController');

// The exact routes React is looking for
router.post('/add', addressController.addAddress);
router.get('/:user_id', addressController.getUserAddresses);
router.delete('/delete/:id', addressController.deleteAddress);

// 🌟 NEW: The missing update route to fix the Bug Catcher error!
router.put('/update/:id', addressController.updateAddress);

module.exports = router;