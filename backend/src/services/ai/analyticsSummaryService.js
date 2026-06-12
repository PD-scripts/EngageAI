const cityAnalyticsService = require('../analytics/cityAnalyticsService');
const channelAnalyticsService = require('../analytics/channelAnalyticsService');
const Communication = require('../../models/Communication');
const Customer = require('../../models/Customer');
const legacyMapper = require('../../utils/legacyMapper');
const birthdayService = require('../recommendations/birthdayRecommendationService');

/**
 * Gathers individual service analytics and compiles them into a single clean summary object.
 * Strictly calculates aggregates without exposing raw database records.
 * Queries live data from MongoDB.
 * @returns {Promise<object>}
 */
async function getAnalyticsSummary() {
  try {
    const customers = await Customer.find().lean();
    const legacyCustomers = customers.map(legacyMapper.mapToLegacyCustomer);
    
    const totalCustomers = legacyCustomers.length;
    const totalRevenue = Math.round(legacyCustomers.reduce((sum, c) => sum + Number(c.TotalSpend || 0), 0));

    const cities = await cityAnalyticsService.getCityAnalytics();
    const channels = await channelAnalyticsService.getChannelAnalytics();

    // 1. Determine key city details with absolute numbers
    let topCity = 'N/A';
    let topCityCustomers = 0;
    let topCityRevenue = 0;

    let highestRevenueCity = 'N/A';
    let highestRevenueCityRevenue = 0;

    let mostInactiveCity = 'N/A';
    let mostInactiveCityCustomers = 0;
    let mostInactiveCityInactiveCount = 0;

    if (cities && cities.length > 0) {
      // Top City (Max customers)
      const sortedByCustomers = [...cities].sort((a, b) => b.customers - a.customers);
      const tc = sortedByCustomers[0];
      topCity = tc?.city || 'N/A';
      topCityCustomers = tc?.customers || 0;
      topCityRevenue = tc?.revenue || 0;

      // Highest Revenue City
      const sortedByRevenue = [...cities].sort((a, b) => b.revenue - a.revenue);
      const hrc = sortedByRevenue[0];
      highestRevenueCity = hrc?.city || 'N/A';
      highestRevenueCityRevenue = hrc?.revenue || 0;

      // Most Inactive City
      const sortedByInactivity = [...cities].sort((a, b) => b.inactiveRate - a.inactiveRate);
      const mic = sortedByInactivity[0];
      mostInactiveCity = mic?.city || 'N/A';
      mostInactiveCityCustomers = mic?.customers || 0;
      mostInactiveCityInactiveCount = mic ? Math.round(mic.customers * (mic.inactiveRate / 100)) : 0;
    }

    // 2. Determine best channel details with absolute numbers
    let bestChannel = 'N/A';
    let bestChannelSent = 0;
    let bestChannelPurchased = 0;

    if (channels && channels.length > 0) {
      const sortedByPurchaseRate = [...channels].sort((a, b) => b.purchaseRate - a.purchaseRate);
      const bc = sortedByPurchaseRate[0];
      bestChannel = bc?.channel || 'N/A';
      bestChannelSent = bc?.sent || 0;
      bestChannelPurchased = bc?.purchased || 0;
    }

    // 3. Absolute messaging counters across all communications in MongoDB
    const sent = await Communication.countDocuments();
    const delivered = await Communication.countDocuments({ deliveredAt: { $ne: null } });
    const opened = await Communication.countDocuments({ openedAt: { $ne: null } });
    const clicked = await Communication.countDocuments({ clickedAt: { $ne: null } });
    const purchased = await Communication.countDocuments({ purchasedAt: { $ne: null } });
    const failed = await Communication.countDocuments({ status: 'FAILED' });

    // 4. Safety security metrics: compute upcoming birthdays, inactive customers, and average LTV spend
    const upcomingBdaysList = await birthdayService.getUpcomingBirthdays30Days();
    const upcomingBirthdays = upcomingBdaysList.length;
    const inactiveCustomersCount = customers.filter(c => Number(c.lastPurchaseDays || 0) > 90).length;
    const averageSpend = totalCustomers > 0 ? Math.round(totalRevenue / totalCustomers) : 0;

    // 5. Health score metrics
    const healthScoreService = require('../health/healthScoreService');
    const totalScoreSum = customers.reduce((sum, c) => sum + (c.healthScore || 0), 0);
    const averageHealthScore = customers.length > 0 ? Math.round(totalScoreSum / customers.length) : 0;
    
    let atRiskCustomers = 0;
    let championCustomers = 0;
    
    customers.forEach(c => {
      const category = healthScoreService.getHealthCategory(c.healthScore || 0);
      if (category === 'At Risk') {
        atRiskCustomers++;
      } else if (category === 'Champion') {
        championCustomers++;
      }
    });

    return {
      totalCustomers,
      totalRevenue,
      
      topCity,
      topCityCustomers,
      topCityRevenue,
      
      highestRevenueCity,
      highestRevenueCityRevenue,
      
      mostInactiveCity,
      mostInactiveCityCustomers,
      mostInactiveCityInactiveCount,
      
      bestChannel,
      bestChannelSent,
      bestChannelPurchased,

      totalMessagesSent: sent,
      totalMessagesDelivered: delivered,
      totalMessagesOpened: opened,
      totalMessagesClicked: clicked,
      totalMessagesPurchased: purchased,
      totalMessagesFailed: failed,

      // Export security-compliant aggregates for AI strategist
      upcomingBirthdays,
      inactiveCustomers: inactiveCustomersCount,
      averageSpend,

      // Health Score Aggregates
      averageHealthScore,
      atRiskCustomers,
      championCustomers
    };
  } catch (error) {
    console.error('[Analytics Summary Service] Failed to compile aggregates:', error);
    return {
      totalCustomers: 0,
      totalRevenue: 0,
      topCity: 'N/A',
      topCityCustomers: 0,
      topCityRevenue: 0,
      highestRevenueCity: 'N/A',
      highestRevenueCityRevenue: 0,
      mostInactiveCity: 'N/A',
      mostInactiveCityCustomers: 0,
      mostInactiveCityInactiveCount: 0,
      bestChannel: 'N/A',
      bestChannelSent: 0,
      bestChannelPurchased: 0,
      totalMessagesSent: 0,
      totalMessagesDelivered: 0,
      totalMessagesOpened: 0,
      totalMessagesClicked: 0,
      totalMessagesPurchased: 0,
      totalMessagesFailed: 0,
      upcomingBirthdays: 0,
      inactiveCustomers: 0,
      averageSpend: 0,
      averageHealthScore: 0,
      atRiskCustomers: 0,
      championCustomers: 0
    };
  }
}

module.exports = {
  getAnalyticsSummary
};
