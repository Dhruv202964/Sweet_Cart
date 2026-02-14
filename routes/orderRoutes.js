const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// GET /api/orders (View All)
router.get('/', orderController.getAllOrders);

// POST /api/orders/assign (Assign Rider)
router.post('/assign', orderController.assignRider);

module.exports = router;