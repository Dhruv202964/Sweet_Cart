const express = require('express');
const router = express.Router();
const addressController = require('../controllers/addressController');

// Routes mapped to our controller functions
router.post('/add', addressController.addAddress);
router.get('/:user_id', addressController.getUserAddresses);
router.delete('/:id', addressController.deleteAddress);

module.exports = router;