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

// 🌟 NEW: Placed safely ABOVE the /:id routes!
router.get('/pending-approvals', orderController.getPendingApprovals); 

router.post('/assign', orderController.assignRider);
router.post('/checkout', orderController.placeOrder);


// ==========================================================
// 🧩 DYNAMIC ROUTES (Anything with /:id MUST BE AT THE BOTTOM)
// ==========================================================
// --- GET ---
router.get('/:id', orderController.getOrderItems);
router.get('/:id/payment-status', orderController.checkPaymentStatus);

// --- PUT / POST ---
router.put('/:id/status', orderController.updateOrderStatus);

// 🌟 NEW: Admin Approval & Auto-Cancel Routes
router.put('/:id/approve-payment', orderController.approvePayment);
router.post('/:id/cancel-unpaid', orderController.cancelUnpaidOrder);

// --- DELETE ---
router.delete('/:id', orderController.deleteOrder);

module.exports = router;