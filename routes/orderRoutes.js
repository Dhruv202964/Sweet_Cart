const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// --- GET Routes ---
router.get('/', orderController.getAllOrders);
router.get('/stats', orderController.getDashboardStats);
router.get('/analytics', orderController.getSalesByArea); 
router.get('/:id', orderController.getOrderItems);

// --- POST / PUT Routes ---
router.post('/assign', orderController.assignRider);
router.put('/:id/status', orderController.updateOrderStatus);
router.post('/checkout', orderController.placeOrder);

module.exports = router;