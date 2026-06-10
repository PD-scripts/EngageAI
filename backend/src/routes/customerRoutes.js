const express = require('express');
const router = express.Router();
const customerController = require('../controllers/customerController');

// Define customer endpoints
router.get('/', customerController.getCustomers);
router.get('/:id', customerController.getCustomerById);

module.exports = router;
