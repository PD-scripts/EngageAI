const recommendationEngine = require('../services/recommendations/recommendationEngine');

/**
 * GET /api/recommendations
 * Generates dynamic recommendations based on real analytics data and Excel records.
 */
async function getRecommendations(req, res) {
  try {
    const list = await recommendationEngine.generateRecommendations();
    
    // Fetch count of birthdays in the next 30 days
    const birthdayService = require('../services/recommendations/birthdayRecommendationService');
    const upcomingList = await birthdayService.getUpcomingBirthdays30Days();
    const upcomingCount = upcomingList.length;

    res.json({
      success: true,
      recommendations: list,
      upcomingBirthdays30Days: upcomingCount
    });
  } catch (error) {
    console.error('[Recommendation Controller] Error generating recommendations:', error);
    res.status(500).json({
      success: false,
      error: "Internal Server Error generating dynamic recommendations"
    });
  }
}

module.exports = {
  getRecommendations
};
