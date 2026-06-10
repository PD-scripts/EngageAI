const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');

// Define order endpoints
router.get('/', orderController.getOrders);

module.exports = router;
