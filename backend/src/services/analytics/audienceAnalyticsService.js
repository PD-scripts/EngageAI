const Campaign = require('../../models/Campaign');
const Communication = require('../../models/Communication');

/**
 * Calculates metrics grouped by target audience segments.
 * @returns {Promise<Array<object>>}
 */
async function getAudienceAnalytics() {
  const campaigns = await Campaign.find();
  const audienceMap = {};

  for (const campaign of campaigns) {
    const audienceName = campaign.audienceName || 'All Customers';
    
    if (!audienceMap[audienceName]) {
      audienceMap[audienceName] = {
        audienceName,
        campaigns: 0,
        sent: 0,
        opened: 0,
        clicked: 0,
        purchased: 0
      };
    }

    // Accumulate campaign count
    audienceMap[audienceName].campaigns += 1;

    // Get live communications stats from MongoDB for this campaign
    const sent = await Communication.countDocuments({ campaignId: campaign._id });
    const opened = await Communication.countDocuments({ campaignId: campaign._id, openedAt: { $ne: null } });
    const clicked = await Communication.countDocuments({ campaignId: campaign._id, clickedAt: { $ne: null } });
    const purchased = await Communication.countDocuments({ campaignId: campaign._id, purchasedAt: { $ne: null } });

    audienceMap[audienceName].sent += sent;
    audienceMap[audienceName].opened += opened;
    audienceMap[audienceName].clicked += clicked;
    audienceMap[audienceName].purchased += purchased;
  }

  // Convert map to array
  return Object.values(audienceMap);
}

module.exports = {
  getAudienceAnalytics
};
