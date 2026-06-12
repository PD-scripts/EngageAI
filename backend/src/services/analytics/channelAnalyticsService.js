const Communication = require('../../models/Communication');

/**
 * Calculates open, click, and purchase rates grouped by channel (WhatsApp, Email, SMS).
 * @returns {Promise<Array<object>>}
 */
async function getChannelAnalytics() {
  const channels = ['WhatsApp', 'Email', 'SMS'];
  const results = [];

  for (const channel of channels) {
    const sent = await Communication.countDocuments({ channel });
    const delivered = await Communication.countDocuments({ channel, deliveredAt: { $ne: null } });
    const opened = await Communication.countDocuments({ channel, openedAt: { $ne: null } });
    const clicked = await Communication.countDocuments({ channel, clickedAt: { $ne: null } });
    const purchased = await Communication.countDocuments({ channel, purchasedAt: { $ne: null } });

    // Calculate rates relative to sent count, or 0 if sent is 0.
    const openRate = sent > 0 ? Math.round((opened / sent) * 100 * 10) / 10 : 0;
    const clickRate = sent > 0 ? Math.round((clicked / sent) * 100 * 10) / 10 : 0;
    const purchaseRate = sent > 0 ? Math.round((purchased / sent) * 100 * 10) / 10 : 0;

    results.push({
      channel,
      sent,
      delivered,
      opened,
      clicked,
      purchased,
      openRate,
      clickRate,
      purchaseRate
    });
  }

  return results;
}

module.exports = {
  getChannelAnalytics
};
