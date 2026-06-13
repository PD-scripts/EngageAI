const express = require('express');
const router = express.Router();
const controller = require('../controllers/aiStrategistController');

// POST /api/ai-strategist/generate-campaign
router.post('/generate-campaign', controller.generateCampaignFromRecommendation);

// GET /api/ai-strategist/drafts
router.get('/drafts', controller.getCampaignDrafts);

module.exports = router;
