const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// 1. GET /api/orders (View All Orders)
router.get('/', orderController.getAllOrders);

// 2. GET /api/orders/stats (Get Dashboard Numbers)
router.get('/stats', orderController.getDashboardStats);

// 3. GET /api/orders/analytics (Sales Graph) 
router.get('/analytics', orderController.getSalesByArea);

// 4. POST /api/orders/assign (Assign Rider)
router.post('/assign', orderController.assignRider);

// 5. GET /api/orders/:id (View Order Details/Items)
router.get('/:id', orderController.getOrderItems);

// 👇 NEW ROUTES ADDED BELOW 👇

// 6. PUT /api/orders/:id/status (Update Status: Pending -> Delivered)
// *Required for the Dropdown in your new Orders table*
router.put('/:id/status', orderController.updateOrderStatus);

// 7. DELETE /api/orders/:id (Delete Order)
// *Required for the Trash Button*
router.delete('/:id', orderController.deleteOrder);

module.exports = router;