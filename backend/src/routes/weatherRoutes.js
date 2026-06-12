const express = require('express');
const router = express.Router();
const weatherController = require('../controllers/weatherController');

// GET /api/weather/recommendations
router.get('/recommendations', weatherController.getRecommendations);

module.exports = router;
