const Customer = require('../../models/Customer');
const Communication = require('../../models/Communication');
const legacyMapper = require('../../utils/legacyMapper');

/**
 * Calculates aggregated performance and database insights per city.
 * Queries live data from MongoDB.
 * @returns {Promise<Array<object>>}
 */
async function getCityAnalytics() {
  const dbCustomers = await Customer.find().lean();
  const customers = dbCustomers.map(legacyMapper.mapToLegacyCustomer);
  const communications = await Communication.find();

  // 1. Group Excel customer data by city
  const cityData = {};
  const customerCityMap = {}; // Map to easily resolve customer ID -> city

  customers.forEach(customer => {
    const city = customer.City || 'Unknown';
    customerCityMap[customer.CustomerID] = city;

    if (!cityData[city]) {
      cityData[city] = {
        city,
        customers: 0,
        totalSpend: 0,
        inactiveCustomers: 0,
        sent: 0,
        opened: 0,
        clicked: 0,
        purchased: 0
      };
    }

    const data = cityData[city];
    data.customers += 1;
    data.totalSpend += Number(customer.TotalSpend || 0);
    
    if (Number(customer.LastPurchaseDays || 0) > 90) {
      data.inactiveCustomers += 1;
    }
  });

  // 2. Map communications to their corresponding customer's city
  communications.forEach(comm => {
    const city = customerCityMap[comm.customerId];
    if (city && cityData[city]) {
      const data = cityData[city];
      data.sent += 1;
      if (comm.status !== 'FAILED') {
        if (comm.openedAt || ['OPENED', 'CLICKED', 'PURCHASED'].includes(comm.status)) data.opened += 1;
        if (comm.clickedAt || ['CLICKED', 'PURCHASED'].includes(comm.status)) data.clicked += 1;
        if (comm.purchasedAt || comm.status === 'PURCHASED') data.purchased += 1;
      }
    }
  });

  // 3. Form final aggregated results (no raw customer logs)
  const results = Object.values(cityData).map(data => {
    const revenue = Math.round(data.totalSpend);
    const averageSpend = data.customers > 0 ? Math.round(data.totalSpend / data.customers) : 0;
    const inactiveRate = data.customers > 0 ? Math.round((data.inactiveCustomers / data.customers) * 100 * 10) / 10 : 0;
    
    // Engagement rate = (opened + clicked + purchased) / (sent || 1) * 100
    const engagementScore = data.sent > 0 
      ? Math.round(((data.opened + data.clicked + data.purchased) / (data.sent * 3)) * 100 * 10) / 10 
      : 0;

    return {
      city: data.city,
      customers: data.customers,
      revenue,
      averageSpend,
      inactiveRate,
      campaignEngagement: engagementScore
    };
  });

  return results;
}

module.exports = {
  getCityAnalytics
};
