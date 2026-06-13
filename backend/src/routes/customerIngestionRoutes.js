const express = require('express');
const router = express.Router();
const controller = require('../controllers/customerIngestionController');

// POST /api/ingestion/customer
router.post('/customer', controller.ingestSingleCustomer);

// POST /api/ingestion/generate
router.post('/generate', controller.bulkGenerate);

module.exports = router;
