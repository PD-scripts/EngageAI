const CampaignDraft = require('../../models/CampaignDraft');
const campaignDraftGenerator = require('./campaignDraftGenerator');

/**
 * Service to orchestrate campaign draft creation, persistence, and queries.
 */
async function createAndSaveDraft(recommendationText) {
  if (!recommendationText) {
    throw new Error('Recommendation text is required to generate a campaign draft.');
  }

  console.log(`[Campaign Agent Service] Generating draft for: "${recommendationText}"`);
  
  const draftData = campaignDraftGenerator.generateDraft(recommendationText);
  const draft = new CampaignDraft(draftData);
  
  await draft.save();
  console.log(`[Campaign Agent Service] Saved draft successfully: ID ${draft._id}`);
  return draft;
}

async function getDrafts() {
  return await CampaignDraft.find().sort({ createdAt: -1 });
}

module.exports = {
  createAndSaveDraft,
  getDrafts
};
