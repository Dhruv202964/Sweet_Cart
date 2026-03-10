const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// The endpoints the React frontend will call:
router.post('/register', authController.registerCustomer);
router.post('/login', authController.loginCustomer);
router.put('/update', authController.updateProfile);

module.exports = router;