const Communication = require('../../models/Communication');
const mongoose = require('mongoose');

/**
 * Calculates detailed metrics for a specific campaign.
 * @param {string|mongoose.Types.ObjectId} campaignId 
 * @returns {Promise<object>}
 */
async function getCampaignAnalytics(campaignId) {
  const queryCampaignId = typeof campaignId === 'string' 
    ? mongoose.Types.ObjectId.createFromHexString(campaignId) 
    : campaignId;

  const sent = await Communication.countDocuments({ campaignId: queryCampaignId });
  const failed = await Communication.countDocuments({ campaignId: queryCampaignId, status: 'FAILED' });
  const delivered = await Communication.countDocuments({ campaignId: queryCampaignId, deliveredAt: { $ne: null } });
  const opened = await Communication.countDocuments({ campaignId: queryCampaignId, openedAt: { $ne: null } });
  const clicked = await Communication.countDocuments({ campaignId: queryCampaignId, clickedAt: { $ne: null } });
  const purchased = await Communication.countDocuments({ campaignId: queryCampaignId, purchasedAt: { $ne: null } });

  const deliveryRate = sent > 0 ? Math.round((delivered / sent) * 100 * 10) / 10 : 0;
  const openRate = delivered > 0 ? Math.round((opened / delivered) * 100 * 10) / 10 : 0;
  const clickRate = opened > 0 ? Math.round((clicked / opened) * 100 * 10) / 10 : 0;
  const purchaseRate = clicked > 0 ? Math.round((purchased / clicked) * 100 * 10) / 10 : 0;

  return {
    campaignId: queryCampaignId.toString(),
    sent,
    delivered,
    failed,
    opened,
    clicked,
    purchased,
    deliveryRate,
    openRate,
    clickRate,
    purchaseRate
  };
}

module.exports = {
  getCampaignAnalytics
};
