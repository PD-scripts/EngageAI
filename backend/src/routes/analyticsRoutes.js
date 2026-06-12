const express = require('express');
const router = express.Router();
const analyticsController = require('../controllers/analyticsController');

router.get('/overview', analyticsController.getOverview);
router.get('/campaigns', analyticsController.getCampaignsAnalytics);
router.get('/audiences', analyticsController.getAudiencesAnalytics);
router.get('/channels', analyticsController.getChannelsAnalytics);
router.get('/cities', analyticsController.getCitiesAnalytics);
router.get('/customers', analyticsController.getCustomersAnalytics);

module.exports = router;
