const campaignDraftService = require('../services/aiCampaignAgent/campaignDraftService');

/**
 * POST /api/ai-strategist/generate-campaign
 * Generates a campaign draft based on a specific recommendation.
 */
async function generateCampaignFromRecommendation(req, res) {
  try {
    const { recommendation } = req.body;
    
    if (!recommendation) {
      return res.status(400).json({ error: "Missing required field: 'recommendation'" });
    }
    
    const draft = await campaignDraftService.createAndSaveDraft(recommendation);
    
    res.status(201).json({
      success: true,
      message: "Campaign draft generated successfully",
      draft
    });
  } catch (error) {
    console.error('[AI Strategist Controller] Campaign draft generation failed:', error.message);
    res.status(500).json({ error: error.message || "Internal Server Error during draft generation" });
  }
}

/**
 * GET /api/ai-strategist/drafts
 * Fetches all generated campaign drafts.
 */
async function getCampaignDrafts(req, res) {
  try {
    const drafts = await campaignDraftService.getDrafts();
    res.json(drafts);
  } catch (error) {
    console.error('[AI Strategist Controller] Fetching drafts failed:', error.message);
    res.status(500).json({ error: "Internal Server Error fetching drafts" });
  }
}

module.exports = {
  generateCampaignFromRecommendation,
  getCampaignDrafts
};
