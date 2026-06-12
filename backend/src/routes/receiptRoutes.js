const express = require('express');
const router = express.Router();
const receiptController = require('../controllers/receiptController');

// Map webhook callback URL
router.post('/', receiptController.handleReceipt);

module.exports = router;
