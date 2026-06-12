const express = require('express');
const router = express.Router();
const backupController = require('../controllers/backupController');

// GET /api/backups/customers
router.get('/customers', backupController.exportCustomers);

// GET /api/backups/orders
router.get('/orders', backupController.exportOrders);

module.exports = router;
