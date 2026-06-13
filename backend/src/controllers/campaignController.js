const mongoose = require('mongoose');
const excelParser = require('../services/excelParser');
const queryEngine = require('../services/queryEngine');
const campaignAiService = require('../services/campaignAiService');
const Campaign = require('../models/Campaign');
const communicationService = require('../services/communicationService');
const axios = require('axios');
const campaignAnalyticsService = require('../services/campaignAnalytics/campaignAnalyticsService');

const AUDIENCES_MAP = {
  'High Value Customers': [{ field: 'TotalSpend', operator: '>', value: 10000 }],
  'Delhi Customers': [{ field: 'City', operator: '=', value: 'Delhi' }],
  'Mumbai Customers': [{ field: 'City', operator: '=', value: 'Mumbai' }],
  'Pune Customers': [{ field: 'City', operator: '=', value: 'Pune' }],
  'Hyderabad Customers': [{ field: 'City', operator: '=', value: 'Hyderabad' }],
  'Inactive Customers': [{ field: 'LastPurchaseDays', operator: '>', value: 90 }],
  'Frequent Buyers': [{ field: 'TotalOrders', operator: '>', value: 5 }],
  'All Customers': []
};

async function calculateAudienceSummary(audienceName) {
  const Customer = require('../models/Customer');
  const legacyMapper = require('../utils/legacyMapper');
  const dbCustomers = await Customer.find().lean();
  const customers = dbCustomers.map(legacyMapper.mapToLegacyCustomer);
  
  const conditions = AUDIENCES_MAP[audienceName] || [];
  const filtered = queryEngine.applyFilters(customers, conditions);

  const totalCustomers = filtered.length;
  let averageSpend = 0;
  let averageOrders = 0;
  let topCity = 'N/A';

  if (totalCustomers > 0) {
    const totalSpendSum = filtered.reduce((sum, c) => sum + Number(c.TotalSpend || 0), 0);
    averageSpend = Math.round(totalSpendSum / totalCustomers);

    const totalOrdersSum = filtered.reduce((sum, c) => sum + Number(c.TotalOrders || 0), 0);
    averageOrders = Math.round((totalOrdersSum / totalCustomers) * 10) / 10;

    const cityCounts = {};
    filtered.forEach(c => {
      if (c.City) {
        cityCounts[c.City] = (cityCounts[c.City] || 0) + 1;
      }
    });

    let maxCount = 0;
    for (const city in cityCounts) {
      if (cityCounts[city] > maxCount) {
        maxCount = cityCounts[city];
        topCity = city;
      }
    }
  }

  // Fallback to the parsed audience city name if no users match but it has a specific city segment
  if (topCity === 'N/A') {
    if (audienceName.includes('Mumbai')) topCity = 'Mumbai';
    else if (audienceName.includes('Delhi')) topCity = 'Delhi';
    else if (audienceName.includes('Pune')) topCity = 'Pune';
    else if (audienceName.includes('Hyderabad')) topCity = 'Hyderabad';
  }

  return {
    totalCustomers,
    averageSpend,
    averageOrders,
    topCity
  };
}

/**
 * POST /api/campaigns/generate
 * Extracts parameters and generates copy from a natural language prompt.
 */
async function generateCampaign(req, res) {
  try {
    const { prompt } = req.body;

    if (!prompt || typeof prompt !== 'string' || prompt.trim() === '') {
      return res.status(400).json({ error: "Missing 'prompt' string in request body" });
    }

    const parsedParams = await campaignAiService.parseCampaignPrompt(prompt);
    const { audienceName, channel, goal } = parsedParams;

    const summary = await calculateAudienceSummary(audienceName);

    const campaignContent = await campaignAiService.generateCampaign({
      audienceName,
      audienceSize: summary.totalCustomers,
      channel,
      goal,
      audienceSummary: summary
    });

    res.json({
      audienceName,
      audienceSize: summary.totalCustomers,
      channel,
      goal,
      ...campaignContent
    });
  } catch (error) {
    console.error('Error generating campaign from prompt:', error.message);
    res.status(500).json({ error: "Internal Server Error generating campaign" });
  }
}

/**
 * POST /api/campaigns
 * Saves a campaign draft.
 */
async function saveCampaign(req, res) {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ 
        error: "MongoDB connection is offline. Please ensure your IP is whitelisted in MongoDB Atlas Network Access." 
      });
    }

    const {
      audienceName,
      audienceSize,
      channel,
      goal,
      strategy,
      recommendedOffer,
      title,
      subject,
      message,
      cta,
      aiReasoning,
      qualityScore,
      strengths,
      improvements
    } = req.body;

    if (!audienceName || !channel || !goal || !title || !message) {
      return res.status(400).json({ error: "Missing required fields to save campaign" });
    }

    const campaignIdStr = new mongoose.Types.ObjectId();
    const newCampaign = new Campaign({
      _id: campaignIdStr,
      campaignId: campaignIdStr.toString(),
      campaignName: title,
      audienceName,
      audienceSize: Number(audienceSize) || 0,
      channel,
      goal,
      strategy: strategy || '',
      recommendedOffer: recommendedOffer || '',
      title,
      subject: subject || '',
      message,
      cta: cta || '',
      aiReasoning: aiReasoning || '',
      qualityScore: Number(qualityScore) || 75,
      strengths: Array.isArray(strengths) ? strengths : [],
      improvements: Array.isArray(improvements) ? improvements : [],
      status: 'Draft',
      
      sent: 0,
      delivered: 0,
      failed: 0,
      opened: 0,
      clicked: 0,
      purchased: 0,
      purchases: 0,
      revenueGenerated: 0,
      campaignCost: 0,
      openRate: 0,
      clickRate: 0,
      conversionRate: 0,
      roi: 0
    });

    await newCampaign.save();

    res.status(201).json(newCampaign);
  } catch (error) {
    console.error('Error saving campaign to MongoDB:', error);
    res.status(500).json({ error: "Internal Server Error saving campaign" });
  }
}

/**
 * GET /api/campaigns
 * Lists all campaigns.
 */
async function getCampaigns(req, res) {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ 
        error: "MongoDB connection is offline. Please ensure your IP is whitelisted in MongoDB Atlas Network Access." 
      });
    }

    const campaigns = await Campaign.find().sort({ createdAt: -1 });
    res.json(campaigns);
  } catch (error) {
    console.error('Error getting campaigns from MongoDB:', error);
    res.status(500).json({ error: "Internal Server Error fetching campaigns" });
  }
}

/**
 * GET /api/campaigns/audiences
 * Returns the list of standard segments populated with dynamic sizes.
 */
async function getAudiences(req, res) {
  try {
    const Customer = require('../models/Customer');
    const legacyMapper = require('../utils/legacyMapper');
    const dbCustomers = await Customer.find().lean();
    const customers = dbCustomers.map(legacyMapper.mapToLegacyCustomer);
    
    const audiences = Object.keys(AUDIENCES_MAP).map(name => {
      const conditions = AUDIENCES_MAP[name];
      const filtered = queryEngine.applyFilters(customers, conditions);
      return {
        name,
        size: filtered.length
      };
    });
    res.json(audiences);
  } catch (error) {
    console.error('Error fetching audiences list:', error);
    res.status(500).json({ error: "Internal Server Error fetching audiences list" });
  }
}

async function sendCampaign(req, res) {
  try {
    const { id } = req.params;

    // 1. Fetch Campaign
    const campaign = await Campaign.findById(id);
    if (!campaign) {
      return res.status(404).json({ error: `Campaign draft with ID ${id} not found.` });
    }

    // 2. Fetch Audience Segment
    const audienceName = campaign.audienceName;
    const conditions = AUDIENCES_MAP[audienceName] || [];
    const Customer = require('../models/Customer');
    const legacyMapper = require('../utils/legacyMapper');
    const dbCustomers = await Customer.find().lean();
    const customers = dbCustomers.map(legacyMapper.mapToLegacyCustomer);
    const filteredCustomers = queryEngine.applyFilters(customers, conditions);

    if (filteredCustomers.length === 0) {
      return res.status(400).json({ error: `No active customers found in audience segment: ${audienceName}` });
    }

    // 3. Update Campaign status to 'Sent' in MongoDB and initialize stats
    campaign.status = 'Sent';
    campaign.campaignId = campaign._id.toString();
    campaign.campaignName = campaign.title;
    campaign.sent = filteredCustomers.length;
    campaign.delivered = 0;
    campaign.failed = 0;
    campaign.opened = 0;
    campaign.clicked = 0;
    campaign.purchased = 0;
    campaign.purchases = 0;
    campaign.revenueGenerated = 0;
    
    // Estimate campaign cost dynamically
    let costPerMessage = 0.5;
    if (campaign.channel.toLowerCase().includes('whatsapp')) costPerMessage = 2.0;
    else if (campaign.channel.toLowerCase().includes('sms')) costPerMessage = 1.0;
    else if (campaign.channel.toLowerCase().includes('social')) costPerMessage = 1.5;
    
    campaign.campaignCost = Math.round(filteredCustomers.length * costPerMessage);
    campaign.openRate = 0;
    campaign.clickRate = 0;
    campaign.conversionRate = 0;
    campaign.roi = 0;
    await campaign.save();

    // 3.5. Create CampaignAudience record in MongoDB
    const CampaignAudience = require('../models/CampaignAudience');
    const audienceDoc = new CampaignAudience({
      campaignId: campaign._id,
      audienceName: audienceName,
      customerIds: filteredCustomers.map(c => c.CustomerID),
      audienceSize: filteredCustomers.length
    });
    await audienceDoc.save();

    // 4. Create communication records in MongoDB
    const Communication = require('../models/Communication');
    const commDocs = filteredCustomers.map(customer => ({
      campaignId: campaign._id,
      customerId: customer.CustomerID,
      channel: campaign.channel,
      status: 'SENT',
      sentAt: new Date()
    }));

    const savedComms = await Communication.insertMany(commDocs);

    // 5. Fire Axios calls to Channel Service in the background
    const channelServiceUrl = process.env.CHANNEL_SERVICE_URL || 'http://localhost:5000/channel/send';
    
    const sendPromises = savedComms.map(comm => {
      return axios.post(channelServiceUrl, {
        communicationId: comm._id.toString(),
        campaignId: comm.campaignId.toString(),
        customerId: comm.customerId,
        channel: comm.channel,
        message: campaign.message
      }).catch(err => {
        console.error(`[CRM] Failed to trigger Channel Service for comm ${comm._id}:`, err.message);
      });
    });

    // Don't block HTTP response waiting for channel service
    Promise.all(sendPromises).then(() => {
      console.log(`[CRM] Dispatched ${savedComms.length} messages to Channel Service successfully.`);
    });

    res.json({
      success: true,
      message: `Dispatched campaign to ${savedComms.length} recipients.`,
      sentCount: savedComms.length
    });

  } catch (error) {
    console.error('Error launching campaign send workflow:', error);
    res.status(500).json({ error: "Internal Server Error sending campaign" });
  }
}

async function getCampaignStatsEndpoint(req, res) {
  try {
    const { id } = req.params;
    const Communication = require('../models/Communication');
    
    const campaignId = mongoose.Types.ObjectId.createFromHexString(id);

    const sent = await Communication.countDocuments({ campaignId });
    const failed = await Communication.countDocuments({ campaignId, status: 'FAILED' });
    const delivered = await Communication.countDocuments({ campaignId, deliveredAt: { $ne: null } });
    const opened = await Communication.countDocuments({ campaignId, openedAt: { $ne: null } });
    const clicked = await Communication.countDocuments({ campaignId, clickedAt: { $ne: null } });
    const purchased = await Communication.countDocuments({ campaignId, purchasedAt: { $ne: null } });

    const stats = {
      sent,
      failed,
      delivered,
      opened,
      clicked,
      purchased
    };

    const comms = await Communication.find({ campaignId });
    const events = [];

    const Customer = require('../models/Customer');
    
    for (const c of comms) {
      // Resolve shopper name from MongoDB
      const shopper = await Customer.findOne({ customerId: c.customerId }).lean();
      const shopperName = shopper ? shopper.name : `Shopper #${c.customerId}`;

      // Push events for each timestamp that exists
      if (c.sentAt) {
        events.push({
          id: `${c._id}-sent`,
          text: `Campaign message was successfully SENT to ${shopperName} via ${c.channel}.`,
          timestamp: c.sentAt,
          type: 'SENT'
        });
      }
      if (c.failedAt) {
        events.push({
          id: `${c._id}-failed`,
          text: `Delivery FAILED for shopper ${shopperName}. Gateway rejected connection.`,
          timestamp: c.failedAt,
          type: 'FAILED'
        });
      }
      if (c.deliveredAt) {
        events.push({
          id: `${c._id}-delivered`,
          text: `Message DELIVERED to shopper ${shopperName}'s terminal.`,
          timestamp: c.deliveredAt,
          type: 'DELIVERED'
        });
      }
      if (c.openedAt) {
        events.push({
          id: `${c._id}-opened`,
          text: `Message OPENED by shopper ${shopperName}.`,
          timestamp: c.openedAt,
          type: 'OPENED'
        });
      }
      if (c.clickedAt) {
        events.push({
          id: `${c._id}-clicked`,
          text: `Shopper ${shopperName} CLICKED CTA product link.`,
          timestamp: c.clickedAt,
          type: 'CLICKED'
        });
      }
      if (c.purchasedAt) {
        events.push({
          id: `${c._id}-purchased`,
          text: `🎉 Shopper ${shopperName} completed PURCHASE checkout!`,
          timestamp: c.purchasedAt,
          type: 'PURCHASED'
        });
      }
    }

    const feed = events.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));

    res.json({
      stats,
      feed
    });
  } catch (error) {
    console.error('Error fetching campaign stats:', error);
    res.status(500).json({ error: "Internal Server Error fetching campaign stats" });
  }
}

async function getCampaignAnalytics(req, res) {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.status(503).json({ 
        error: "MongoDB connection is offline. Please ensure your IP is whitelisted in MongoDB Atlas Network Access." 
      });
    }

    const campaigns = await Campaign.find().sort({ createdAt: -1 }).lean();

    const bestCampaignObj = campaignAnalyticsService.getBestCampaign(campaigns);
    const bestCampaignName = bestCampaignObj ? bestCampaignObj.title : 'N/A';
    const bestCampaignROI = bestCampaignObj ? bestCampaignObj.roi : 0;

    const bestChannel = campaignAnalyticsService.getBestChannel(campaigns);
    const totalRevenueGenerated = campaigns.reduce((sum, c) => sum + (c.revenueGenerated || 0), 0);
    const averageROI = campaignAnalyticsService.getAverageROI(campaigns);

    const leaderboard = campaignAnalyticsService.getCampaignLeaderboard(campaigns);
    const insights = campaignAnalyticsService.generateCampaignInsights(campaigns);

    res.json({
      kpis: {
        bestCampaign: bestCampaignName,
        bestCampaignROI: bestCampaignROI,
        bestChannel: bestChannel,
        revenueGenerated: totalRevenueGenerated,
        averageROI: averageROI
      },
      leaderboard,
      insights,
      campaigns
    });
  } catch (error) {
    console.error('Error fetching campaign analytics:', error);
    res.status(500).json({ error: "Internal Server Error fetching campaign analytics" });
  }
}

module.exports = {
  generateCampaign,
  saveCampaign,
  getCampaigns,
  getAudiences,
  sendCampaign,
  getCampaignStatsEndpoint,
  getCampaignAnalytics
};

