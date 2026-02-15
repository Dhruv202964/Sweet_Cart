const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// 1. GET /api/orders (View All)
router.get('/', orderController.getAllOrders);

// 2. GET /api/orders/stats (Get Dashboard Numbers) <--- NEW! MUST BE ABOVE /:id
router.get('/stats', orderController.getDashboardStats);

// 3. POST /api/orders/assign (Assign Rider)
router.post('/assign', orderController.assignRider);

// 4. GET /api/orders/:id (View Items)
router.get('/:id', orderController.getOrderItems);

module.exports = router;