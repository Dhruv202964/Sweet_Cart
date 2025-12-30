const express = require('express');
const router = express.Router();
const riderController = require('../controllers/riderController');

// GET /api/rider/my-deliveries/:rider_id
router.get('/my-deliveries/:rider_id', riderController.getMyDeliveries);

// PUT /api/rider/update-status
router.put('/update-status', riderController.updateStatus);

module.exports = router;