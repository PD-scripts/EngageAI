const weatherRecommendationService = require('../services/weather/weatherRecommendationService');

/**
 * GET /api/weather/recommendations
 * Generates and returns weather-based marketing recommendations sorted by priority.
 */
async function getRecommendations(req, res) {
  try {
    const list = await weatherRecommendationService.getWeatherRecommendations();
    res.json({
      success: true,
      recommendations: list
    });
  } catch (error) {
    console.error('[Weather Controller] Error fetching recommendations:', error.message);
    res.status(500).json({
      success: false,
      error: 'Weather intelligence currently unavailable.'
    });
  }
}

module.exports = {
  getRecommendations
};
