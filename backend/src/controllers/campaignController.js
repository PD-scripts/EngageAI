const fs = require('fs');
const path = require('path');
const excelParser = require('../services/excelParser');
const queryEngine = require('../services/queryEngine');
const campaignAiService = require('../services/campaignAiService');

const CAMPAIGNS_FILE = path.join(__dirname, '../data/campaigns.json');

const AUDIENCES_MAP = {
  'High Value Customers': [{ field: 'TotalSpend', operator: '>', value: 10000 }],
  'Delhi Customers': [{ field: 'City', operator: '=', value: 'Delhi' }],
  'Inactive Customers': [{ field: 'LastPurchaseDays', operator: '>', value: 90 }],
  'Frequent Buyers': [{ field: 'TotalOrders', operator: '>', value: 5 }],
  'All Customers': []
};

function initCampaignsStore() {
  const dir = path.dirname(CAMPAIGNS_FILE);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  if (!fs.existsSync(CAMPAIGNS_FILE)) {
    fs.writeFileSync(CAMPAIGNS_FILE, JSON.stringify([], null, 2), 'utf-8');
  }
}

function readCampaigns() {
  initCampaignsStore();
  try {
    const data = fs.readFileSync(CAMPAIGNS_FILE, 'utf-8');
    return JSON.parse(data);
  } catch (error) {
    console.error('Error reading campaigns.json:', error);
    return [];
  }
}

function writeCampaigns(campaigns) {
  initCampaignsStore();
  try {
    fs.writeFileSync(CAMPAIGNS_FILE, JSON.stringify(campaigns, null, 2), 'utf-8');
  } catch (error) {
    console.error('Error writing campaigns.json:', error);
  }
}

function calculateAudienceSummary(audienceName) {
  const customers = excelParser.getCustomers();
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

    // 1. Extract campaign metadata parameters using Groq
    const parsedParams = await campaignAiService.parseCampaignPrompt(prompt);
    const { audienceName, channel, goal } = parsedParams;

    // 2. Fetch audience dynamic statistics (Security: no PII leaked)
    const summary = calculateAudienceSummary(audienceName);

    // 3. Generate campaign strategies, messaging and score
    const campaignContent = await campaignAiService.generateCampaign({
      audienceName,
      audienceSize: summary.totalCustomers,
      channel,
      goal,
      audienceSummary: summary
    });

    // 4. Combine into final response
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

    const campaigns = readCampaigns();

    const newCampaign = {
      id: `campaign_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`,
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
      createdAt: new Date().toISOString(),
      
      // Future-proofing placeholders
      sent: 0,
      delivered: 0,
      opened: 0,
      clicked: 0,
      purchased: 0
    };

    campaigns.push(newCampaign);
    writeCampaigns(campaigns);

    res.status(201).json(newCampaign);
  } catch (error) {
    console.error('Error saving campaign:', error);
    res.status(500).json({ error: "Internal Server Error saving campaign" });
  }
}

/**
 * GET /api/campaigns
 * Lists all campaigns.
 */
function getCampaigns(req, res) {
  try {
    const campaigns = readCampaigns();
    const sorted = [...campaigns].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    res.json(sorted);
  } catch (error) {
    console.error('Error getting campaigns:', error);
    res.status(500).json({ error: "Internal Server Error fetching campaigns" });
  }
}

/**
 * GET /api/campaigns/audiences
 * Returns the list of standard segments populated with dynamic sizes.
 */
function getAudiences(req, res) {
  try {
    const customers = excelParser.getCustomers();
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

module.exports = {
  generateCampaign,
  saveCampaign,
  getCampaigns,
  getAudiences
};
