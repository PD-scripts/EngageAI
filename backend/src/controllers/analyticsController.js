const mongoose = require('mongoose');
const Campaign = require('../models/Campaign');
const Communication = require('../models/Communication');
const excelParser = require('../services/excelParser');

const campaignAnalyticsService = require('../services/analytics/campaignAnalyticsService');
const audienceAnalyticsService = require('../services/analytics/audienceAnalyticsService');
const channelAnalyticsService = require('../services/analytics/channelAnalyticsService');
const cityAnalyticsService = require('../services/analytics/cityAnalyticsService');
const customerAnalyticsService = require('../services/analytics/customerAnalyticsService');

/**
 * GET /api/analytics/overview
 */
async function getOverview(req, res) {
  try {
    const Customer = require('../models/Customer');
    const legacyMapper = require('../utils/legacyMapper');
    const dbCustomers = await Customer.find().lean();
    const customers = dbCustomers.map(legacyMapper.mapToLegacyCustomer);
    
    const totalCustomers = customers.length;
    
    const totalRevenue = Math.round(customers.reduce((sum, c) => sum + Number(c.TotalSpend || 0), 0));
    const totalCampaigns = await Campaign.countDocuments();

    // Rates calculation across all messaging events in MongoDB
    const sent = await Communication.countDocuments();
    const delivered = await Communication.countDocuments({ deliveredAt: { $ne: null } });
    const opened = await Communication.countDocuments({ openedAt: { $ne: null } });
    const clicked = await Communication.countDocuments({ clickedAt: { $ne: null } });
    const purchased = await Communication.countDocuments({ purchasedAt: { $ne: null } });

    const deliveryRate = sent > 0 ? Math.round((delivered / sent) * 100 * 10) / 10 : 0;
    const openRate = delivered > 0 ? Math.round((opened / delivered) * 100 * 10) / 10 : 0;
    const clickRate = opened > 0 ? Math.round((clicked / opened) * 100 * 10) / 10 : 0;
    const purchaseRate = clicked > 0 ? Math.round((purchased / clicked) * 100 * 10) / 10 : 0;

    res.json({
      totalCustomers,
      totalCampaigns,
      totalRevenue,
      deliveryRate,
      openRate,
      clickRate,
      purchaseRate
    });
  } catch (error) {
    console.error('[Analytics Controller] Error compiling overview stats:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

/**
 * GET /api/analytics/campaigns
 */
async function getCampaignsAnalytics(req, res) {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ 
        error: "MongoDB connection is offline. Please ensure your IP is whitelisted in MongoDB Atlas Network Access." 
      });
    }

    const campaigns = await Campaign.find().sort({ createdAt: -1 }).lean();

    // Use MongoDB aggregation to fetch stats for all campaigns in a single query (preventing N+1 queries)
    const Communication = require('../models/Communication');
    const stats = await Communication.aggregate([
      {
        $group: {
          _id: '$campaignId',
          sent: { $sum: 1 },
          failed: {
            $sum: {
              $cond: [{ $eq: ['$status', 'FAILED'] }, 1, 0]
            }
          },
          delivered: {
            $sum: {
              $cond: [{ $ne: ['$deliveredAt', null] }, 1, 0]
            }
          },
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
      const deliveryRate = s.sent > 0 ? Math.round((s.delivered / s.sent) * 100 * 10) / 10 : 0;
      const openRate = s.delivered > 0 ? Math.round((s.opened / s.delivered) * 100 * 10) / 10 : 0;
      const clickRate = s.opened > 0 ? Math.round((s.clicked / s.opened) * 100 * 10) / 10 : 0;
      const purchaseRate = s.clicked > 0 ? Math.round((s.purchased / s.clicked) * 100 * 10) / 10 : 0;

      statsMap[s._id.toString()] = {
        sent: s.sent,
        delivered: s.delivered,
        failed: s.failed,
        opened: s.opened,
        clicked: s.clicked,
        purchased: s.purchased,
        deliveryRate,
        openRate,
        clickRate,
        purchaseRate
      };
    });

    const results = campaigns.map(c => {
      const cId = c._id.toString();
      const campaignStats = statsMap[cId] || {
        sent: 0,
        delivered: 0,
        failed: 0,
        opened: 0,
        clicked: 0,
        purchased: 0,
        deliveryRate: 0,
        openRate: 0,
        clickRate: 0,
        purchaseRate: 0
      };
      return {
        id: cId,
        title: c.title,
        audienceName: c.audienceName,
        channel: c.channel,
        status: c.status,
        createdAt: c.createdAt,
        ...campaignStats
      };
    });

    res.json(results);
  } catch (error) {
    console.error('[Analytics Controller] Error compiling campaigns list:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

/**
 * GET /api/analytics/audiences
 */
async function getAudiencesAnalytics(req, res) {
  try {
    const data = await audienceAnalyticsService.getAudienceAnalytics();
    res.json(data);
  } catch (error) {
    console.error('[Analytics Controller] Error compiling audience stats:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

/**
 * GET /api/analytics/channels
 */
async function getChannelsAnalytics(req, res) {
  try {
    const data = await channelAnalyticsService.getChannelAnalytics();
    res.json(data);
  } catch (error) {
    console.error('[Analytics Controller] Error compiling channel stats:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

/**
 * GET /api/analytics/cities
 */
async function getCitiesAnalytics(req, res) {
  try {
    const data = await cityAnalyticsService.getCityAnalytics();
    res.json(data);
  } catch (error) {
    console.error('[Analytics Controller] Error compiling city stats:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

/**
 * GET /api/analytics/customers
 */
async function getCustomersAnalytics(req, res) {
  try {
    const data = await customerAnalyticsService.getCustomerAnalytics();
    res.json(data);
  } catch (error) {
    console.error('[Analytics Controller] Error compiling customer rankings:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
}

module.exports = {
  getOverview,
  getCampaignsAnalytics,
  getAudiencesAnalytics,
  getChannelsAnalytics,
  getCitiesAnalytics,
  getCustomersAnalytics
};
