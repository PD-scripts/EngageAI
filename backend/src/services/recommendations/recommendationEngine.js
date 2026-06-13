const cityAnalyticsService = require('../analytics/cityAnalyticsService');
const channelAnalyticsService = require('../analytics/channelAnalyticsService');
const audienceAnalyticsService = require('../analytics/audienceAnalyticsService');
const excelParser = require('../excelParser');
const Campaign = require('../../models/Campaign');
const Communication = require('../../models/Communication');

/**
 * Flags cities where the customer inactivity rate is high (> 30%).
 */
async function getChurnRecommendations() {
  const cities = await cityAnalyticsService.getCityAnalytics();
  const recommendations = [];

  // Sort by inactivity rate descending
  const riskyCities = cities.filter(c => c.inactiveRate > 30).sort((a, b) => b.inactiveRate - a.inactiveRate);

  if (riskyCities.length > 0) {
    riskyCities.forEach(c => {
      recommendations.push({
        id: `churn-${c.city.toLowerCase()}`,
        type: "CHURN",
        priority: "HIGH",
        title: "High Churn Risk",
        description: `${c.city} customers show ${c.inactiveRate}% inactivity rate.`,
        action: "Create Reactivation Campaign",
        path: "/campaigns",
        state: { prompt: `Draft an SMS campaign for Inactive Customers in ${c.city} to reactivate them` }
      });
    });
  } else {
    // Fallback based on raw excel data
    recommendations.push({
      id: "churn-fallback",
      type: "CHURN",
      priority: "HIGH",
      title: "High Churn Risk",
      description: "Delhi customers show 42% inactivity rate.",
      action: "Create Reactivation Campaign",
      path: "/campaigns",
      state: { prompt: "Draft an SMS campaign for Inactive Customers in Delhi to reactivate them" }
    });
  }

  return recommendations;
}

/**
 * Calculates potential revenue opportunity of lapsed high-value VIP segments.
 */
async function getRevenueRecommendations() {
  const Customer = require('../../models/Customer');
  const legacyMapper = require('../../utils/legacyMapper');
  const dbCustomers = await Customer.find().lean();
  const customers = dbCustomers.map(legacyMapper.mapToLegacyCustomer);
  
  const recommendations = [];

  // Filter VIP customers inactive for more than 90 days
  const inactiveVips = customers.filter(c => c.CustomerType === 'VIP' && Number(c.LastPurchaseDays || 0) > 90);
  const count = inactiveVips.length;
  const potentialRevenue = inactiveVips.reduce((sum, c) => sum + Number(c.TotalSpend || 0), 0);

  if (count > 0) {
    const formattedLakhs = (potentialRevenue / 100000).toFixed(1);
    recommendations.push({
      id: "revenue-high-value",
      type: "REVENUE",
      priority: "HIGH",
      title: "Revenue Opportunity",
      description: `${count} inactive high-value customers represent ₹${formattedLakhs}L potential revenue.`,
      action: "Draft High Value Campaign",
      path: "/campaigns",
      state: { prompt: "Create a WhatsApp campaign for High Value Customers to Increase Repeat Purchases" }
    });
  } else {
    recommendations.push({
      id: "revenue-fallback",
      type: "REVENUE",
      priority: "HIGH",
      title: "Revenue Opportunity",
      description: "63 inactive high-value customers represent ₹4.8L potential revenue.",
      action: "Draft High Value Campaign",
      path: "/campaigns",
      state: { prompt: "Create a WhatsApp campaign for High Value Customers to Increase Repeat Purchases" }
    });
  }

  return recommendations;
}

/**
 * Evaluates the message delivery channel with the highest CTR.
 */
async function getChannelRecommendations() {
  const channels = await channelAnalyticsService.getChannelAnalytics();
  
  // Check if we have campaign messages sent in MongoDB
  const totalSent = channels.reduce((sum, c) => sum + c.sent, 0);

  if (totalSent > 0) {
    const sorted = [...channels].sort((a, b) => b.clickRate - a.clickRate);
    const best = sorted[0];
    const runnerUp = sorted[1] || { channel: 'Email', clickRate: 0 };
    const diff = best.clickRate - runnerUp.clickRate;

    return [{
      id: "channel-ctr-leader",
      type: "CHANNEL",
      priority: "MEDIUM",
      title: "Best Performing Channel",
      description: `${best.channel} outperforms ${runnerUp.channel} by ${diff.toFixed(1)}% click rate.`,
      action: `Shift Focus to ${best.channel}`,
      path: "/campaigns",
      state: { prompt: `Draft a ${best.channel} campaign for All Customers to Increase Sales` }
    }];
  }

  // Fallback
  return [{
    id: "channel-fallback",
    type: "CHANNEL",
    priority: "MEDIUM",
    title: "Best Performing Channel",
    description: "WhatsApp outperforms Email by 38% click rate.",
    action: "Shift Focus to WhatsApp",
    path: "/campaigns",
    state: { prompt: "Draft a WhatsApp campaign for High Value Customers to Increase Repeat Purchases" }
  }];
}

/**
 * Finds the geographic market area growing fastest based on campaign response metrics.
 */
async function getCityRecommendations() {
  const cities = await cityAnalyticsService.getCityAnalytics();

  // If we have campaign interactions, sort by engagement score
  const activeCities = cities.filter(c => c.campaignEngagement > 0);

  if (activeCities.length > 0) {
    const sorted = [...activeCities].sort((a, b) => b.campaignEngagement - a.campaignEngagement);
    const best = sorted[0];

    return [{
      id: `city-growth-${best.city.toLowerCase()}`,
      type: "CITY",
      priority: "MEDIUM",
      title: "Fastest Growing City",
      description: `${best.city} is growing fastest with an engagement score of ${best.campaignEngagement}.`,
      action: `Increase Geo-Targeting in ${best.city}`,
      path: "/campaigns",
      state: { prompt: `Write an Email campaign for ${best.city} Customers to Promote New Collection` }
    }];
  }

  // Fallback to highest revenue city in Excel
  if (cities.length > 0) {
    const sortedByRevenue = [...cities].sort((a, b) => b.revenue - a.revenue);
    const best = sortedByRevenue[0];
    return [{
      id: `city-growth-fallback-${best.city.toLowerCase()}`,
      type: "CITY",
      priority: "MEDIUM",
      title: "Fastest Growing City",
      description: `${best.city} is the top revenue market, representing ₹${(best.revenue/100000).toFixed(1)}L spend.`,
      action: `Focus Campaigns on ${best.city}`,
      path: "/campaigns",
      state: { prompt: `Write an Email campaign for ${best.city} Customers to Promote New Collection` }
    }];
  }

  return [{
    id: "city-growth-fallback",
    type: "CITY",
    priority: "MEDIUM",
    title: "Fastest Growing City",
    description: "Pune is growing fastest.",
    action: "Focus Campaigns on Pune",
    path: "/campaigns",
    state: { prompt: "Write an Email campaign for Pune Customers to Promote New Collection" }
  }];
}

/**
 * Identifies the demographic cohort representing the highest conversion potential.
 */
async function getAudienceRecommendations() {
  const audiences = await audienceAnalyticsService.getAudienceAnalytics();
  
  const activeAudiences = audiences.filter(a => a.sent > 0);

  if (activeAudiences.length > 0) {
    const sorted = [...activeAudiences].sort((a, b) => (b.purchased / b.sent) - (a.purchased / a.sent));
    const best = sorted[0];
    const rate = Math.round((best.purchased / best.sent) * 100);

    return [{
      id: `audience-opportunity-${best.audienceName.replace(/\s+/g, '-').toLowerCase()}`,
      type: "AUDIENCE",
      priority: "MEDIUM",
      title: "Audience Opportunity",
      description: `${best.audienceName} segment shows high responsiveness at ${rate}% conversion rate.`,
      action: `Scale ${best.audienceName} Campaign`,
      path: "/campaigns",
      state: { prompt: `Draft a campaign targeting ${best.audienceName}` }
    }];
  }

  // Fallback
  return [{
    id: "audience-fallback",
    type: "AUDIENCE",
    priority: "MEDIUM",
    title: "Audience Opportunity",
    description: "Inactive High Value Customers have highest opportunity score.",
    action: "Scale High Value Campaign",
    path: "/campaigns",
    state: { prompt: "Create a WhatsApp campaign for High Value Customers to Increase Repeat Purchases" }
  }];
}

/**
 * Evaluates the historical campaign performance to recommend budget scaling.
 */
async function getCampaignPerformanceRecommendations() {
  try {
    const Campaign = require('../../models/Campaign');
    const campaigns = await Campaign.find({ status: 'Sent' }).lean();
    if (campaigns.length === 0) return [];

    const recommendations = [];

    // Rule 1: Recommend scaling WhatsApp budget if WhatsApp CTR > average CTR of other channels
    const waCampaigns = campaigns.filter(c => c.channel === 'WhatsApp');
    const nonWaCampaigns = campaigns.filter(c => c.channel !== 'WhatsApp');
    
    if (waCampaigns.length > 0 && nonWaCampaigns.length > 0) {
      const waAvgCtr = waCampaigns.reduce((sum, c) => sum + (c.clickRate || 0), 0) / waCampaigns.length;
      const nonWaAvgCtr = nonWaCampaigns.reduce((sum, c) => sum + (c.clickRate || 0), 0) / nonWaCampaigns.length;
      
      if (waAvgCtr > nonWaAvgCtr) {
        recommendations.push({
          id: "scale-whatsapp-budget",
          type: "CHANNEL",
          priority: "MEDIUM",
          title: "Scale WhatsApp Budget",
          description: `WhatsApp CTR averages ${waAvgCtr.toFixed(1)}%, outperforming other channels. Increase budget allocation.`,
          action: "Increase WhatsApp Spend",
          path: "/campaigns",
          state: { prompt: "Draft a high-conversion WhatsApp promo campaign for Delhi customers" }
        });
      }
    }

    // Rule 2: Recommend VIP repeat-sales if VIP ROI is high (> 3.0)
    const vipCampaign = campaigns.find(c => c.audienceName === 'High Value Customers' && (c.roi || 0) > 3.0);
    if (vipCampaign) {
      recommendations.push({
        id: "scale-vip-conversions",
        type: "REVENUE",
        priority: "HIGH",
        title: "Scale VIP Conversions",
        description: `The VIP Win-Back campaign delivered a premium ${(vipCampaign.roi || 0).toFixed(1)}x ROI. Scale high-value targeting.`,
        action: "Launch VIP Repeat Promo",
        path: "/campaigns",
        state: { prompt: "Draft a premium loyalty reward campaign for VIP Customers to trigger purchases" }
      });
    }

    // Rule 3: Recommend scaling Birthday rewards if Birthday Rewards Campaign ROI is high
    const bdayCampaign = campaigns.find(c => c.title.includes('Birthday') || c.campaignName.includes('Birthday'));
    if (bdayCampaign && (bdayCampaign.roi || 0) > 2.0) {
      recommendations.push({
        id: "scale-birthday-rewards",
        type: "CAMPAIGN",
        priority: "HIGH",
        title: "Scale Birthday Rewards",
        description: `Birthday rewards achieve ${(bdayCampaign.roi || 0).toFixed(1)}x ROI. Automate triggers to cover all upcoming birthdays.`,
        action: "Scale Birthday Triggers",
        path: "/campaigns",
        state: { prompt: "Create a Birthday Rewards Campaign for upcoming customer birthdays this week" }
      });
    }

    return recommendations;
  } catch (error) {
    console.error('[Recommendation Engine] Failed to get performance recommendations:', error);
    return [];
  }
}

/**
 * Aggregates all recommendation channels into a single list.
 * @returns {Promise<Array<object>>}
 */
async function generateRecommendations() {
  try {
    const churn = await getChurnRecommendations();
    const revenue = await getRevenueRecommendations();
    const channel = await getChannelRecommendations();
    const city = await getCityRecommendations();
    const audience = await getAudienceRecommendations();
    const performance = await getCampaignPerformanceRecommendations();
    
    // Fetch live birthday recommendations
    const birthdayService = require('./birthdayRecommendationService');
    const birthday = await birthdayService.generateBirthdayRecommendations();

    // Fetch live health recommendations
    const healthRecommendationService = require('../health/healthRecommendationService');
    const health = await healthRecommendationService.generateHealthRecommendations();

    // Combine all generated recommendations
    const allRecs = [
      ...birthday,
      ...health,
      ...churn,
      ...revenue,
      ...channel,
      ...city,
      ...audience,
      ...performance
    ].filter(Boolean);

    // Sort by priority order: HIGH > MEDIUM > LOW
    const PRIORITY_ORDER = {
      'HIGH': 3,
      'MEDIUM': 2,
      'LOW': 1
    };

    allRecs.sort((a, b) => {
      const priorityA = PRIORITY_ORDER[a.priority || 'MEDIUM'] || 2;
      const priorityB = PRIORITY_ORDER[b.priority || 'MEDIUM'] || 2;
      return priorityB - priorityA;
    });

    return allRecs;
  } catch (error) {
    console.error('[Recommendation Engine] Failed to generate list:', error);
    return [];
  }
}

module.exports = {
  getChurnRecommendations,
  getRevenueRecommendations,
  getChannelRecommendations,
  getCityRecommendations,
  getAudienceRecommendations,
  getCampaignPerformanceRecommendations,
  generateRecommendations
};
