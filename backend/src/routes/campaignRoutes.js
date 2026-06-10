const express = require('express');
const router = express.Router();
const campaignController = require('../controllers/campaignController');

// Map Campaign Builder endpoints
router.get('/audiences', campaignController.getAudiences);
router.post('/generate', campaignController.generateCampaign);
router.post('/', campaignController.saveCampaign);
router.get('/', campaignController.getCampaigns);

module.exports = router;
