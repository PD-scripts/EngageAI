const express = require('express');
const router = express.Router();
const queryController = require('../controllers/queryController');

// Map query endpoint
router.post('/', queryController.executeQuery);

module.exports = router;
