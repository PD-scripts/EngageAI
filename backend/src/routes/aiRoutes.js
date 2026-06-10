const express = require('express');
const router = express.Router();
const aiController = require('../controllers/aiController');

// Map AI Audience Builder query trigger
router.post('/audience-builder', aiController.buildAudience);

module.exports = router;
