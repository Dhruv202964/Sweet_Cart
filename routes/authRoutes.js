const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// The endpoints the React frontend will call:
router.post('/register', authController.registerCustomer);
router.post('/login', authController.loginCustomer);
router.put('/update', authController.updateProfile);

// 🌟 The endpoint to permanently delete an account
router.delete('/delete/:id', authController.deleteAccount);

// 🌟 NEW: The Email OTP & Password Reset Endpoints!
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);

module.exports = router;