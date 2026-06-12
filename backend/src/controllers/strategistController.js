const analyticsSummaryService = require('../services/ai/analyticsSummaryService');
const strategistService = require('../services/ai/strategistService');

/**
 * POST /api/strategist/analyze
 * Generates marketing insights and recommendations based on aggregated database summaries.
 */
async function analyzeBusiness(req, res) {
  try {
    const { query } = req.body;

    // 1. Gather aggregated metrics (No customer records exposed to AI)
    const summary = await analyticsSummaryService.getAnalyticsSummary();

    // 2. Fetch business recommendations from Groq
    const insights = await strategistService.generateBusinessInsights(query, summary);

    res.json(insights);
  } catch (error) {
    console.error('[Strategist Controller] Failed to analyze business metrics:', error.message);
    res.status(500).json({ error: 'Unable to generate recommendations. Please try again.' });
  }
}

module.exports = {
  analyzeBusiness
};
