const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// ==========================================================
// 🚀 STATIC ROUTES (MUST BE AT THE TOP!)
// ==========================================================
router.get('/', orderController.getAllOrders);
router.get('/stats', orderController.getDashboardStats);
router.get('/analytics', orderController.getSalesByArea);
router.get('/track', orderController.trackOrder); 
router.get('/custom-boxes', orderController.getCustomBoxOrders);
router.get('/pending-approvals', orderController.getPendingApprovals); 

// 🎙️ THE MISSING ROUTE! THE PUBLIC VOICE GIFT ENDPOINT
router.get('/gift/:id', orderController.getVoiceGift);

router.post('/assign', orderController.assignRider);
router.post('/checkout', orderController.placeOrder);

// ==========================================================
// 🧩 DYNAMIC ROUTES (Anything with /:id MUST BE AT THE BOTTOM)
// ==========================================================
router.get('/:id', orderController.getOrderItems);
router.get('/:id/payment-status', orderController.checkPaymentStatus);
router.put('/:id/status', orderController.updateOrderStatus);
router.put('/:id/approve-payment', orderController.approvePayment);
router.post('/:id/cancel-unpaid', orderController.cancelUnpaidOrder);
router.delete('/:id', orderController.deleteOrder);

module.exports = router;