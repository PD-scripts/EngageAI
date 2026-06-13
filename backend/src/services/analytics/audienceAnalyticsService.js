const Campaign = require('../../models/Campaign');
const Communication = require('../../models/Communication');

/**
 * Calculates metrics grouped by target audience segments.
 * @returns {Promise<Array<object>>}
 */
async function getAudienceAnalytics() {
  const campaigns = await Campaign.find().lean();
  const audienceMap = {};

  // Fetch campaign communications stats in a single aggregation query to prevent N+1 queries
  const stats = await Communication.aggregate([
    {
      $group: {
        _id: '$campaignId',
        sent: { $sum: 1 },
        opened: {
          $sum: {
            $cond: [{ $ne: ['$openedAt', null] }, 1, 0]
          }
        },
        clicked: {
          $sum: {
            $cond: [{ $ne: ['$clickedAt', null] }, 1, 0]
          }
        },
        purchased: {
          $sum: {
            $cond: [{ $ne: ['$purchasedAt', null] }, 1, 0]
          }
        }
      }
    }
  ]);

  const statsMap = {};
  stats.forEach(s => {
    statsMap[s._id.toString()] = {
      sent: s.sent,
      opened: s.opened,
      clicked: s.clicked,
      purchased: s.purchased
    };
  });

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

    const s = statsMap[campaign._id.toString()] || {
      sent: 0,
      opened: 0,
      clicked: 0,
      purchased: 0
    };

    audienceMap[audienceName].sent += s.sent;
    audienceMap[audienceName].opened += s.opened;
    audienceMap[audienceName].clicked += s.clicked;
    audienceMap[audienceName].purchased += s.purchased;
  }

  // Convert map to array
  return Object.values(audienceMap);
}

module.exports = {
  getAudienceAnalytics
};
