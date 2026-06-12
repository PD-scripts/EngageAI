const Customer = require('../../models/Customer');
const Communication = require('../../models/Communication');

/**
 * Calculates the health score (0-100) of a customer document.
 * Handles async queries to the Communication collection for engagement scoring.
 * 
 * @param {object} customer - Customer document
 * @returns {Promise<number>} finalScore
 */
async function calculateHealthScore(customer) {
  if (!customer) return 0;

  // Factor 1: Recency (Weight: 40%)
  let recencyScore = 0;
  const lastPurchaseDays = Number(customer.lastPurchaseDays || 0);
  if (lastPurchaseDays <= 7) {
    recencyScore = 40;
  } else if (lastPurchaseDays <= 30) {
    recencyScore = 30;
  } else if (lastPurchaseDays <= 60) {
    recencyScore = 20;
  } else if (lastPurchaseDays <= 90) {
    recencyScore = 10;
  } else {
    recencyScore = 0;
  }

  // Factor 2: Frequency (Weight: 25%)
  let frequencyScore = 0;
  const totalOrders = Number(customer.totalOrders || 0);
  if (totalOrders >= 20) {
    frequencyScore = 25;
  } else if (totalOrders >= 10) {
    frequencyScore = 18;
  } else if (totalOrders >= 5) {
    frequencyScore = 12;
  } else if (totalOrders >= 1) {
    frequencyScore = 5;
  } else {
    frequencyScore = 0;
  }

  // Factor 3: Monetary Value (Weight: 25%)
  let monetaryScore = 0;
  const totalSpend = Number(customer.totalSpend || 0);
  if (totalSpend >= 50000) {
    monetaryScore = 25;
  } else if (totalSpend >= 25000) {
    monetaryScore = 18;
  } else if (totalSpend >= 10000) {
    monetaryScore = 12;
  } else if (totalSpend >= 5000) {
    monetaryScore = 6;
  } else {
    monetaryScore = 2; // below 5000
  }

  // Factor 4: Campaign Engagement (Weight: 10%)
  let engagementScore = 0;
  const comms = await Communication.find({ customerId: customer.customerId }).lean();

  if (comms && comms.length > 0) {
    const clickedCount = comms.filter(c => c.clickedAt || c.status === 'CLICKED' || c.status === 'PURCHASED').length;
    const openedCount = comms.filter(c => c.openedAt || c.status === 'OPENED').length;

    if (clickedCount >= 1) {
      engagementScore = 10;
    } else if (openedCount >= 1 || comms.some(c => c.openedAt || c.status === 'OPENED' || c.status === 'CLICKED' || c.status === 'PURCHASED')) {
      engagementScore = 5;
    } else {
      engagementScore = 0;
    }
  }

  const finalScore = recencyScore + frequencyScore + monetaryScore + engagementScore;
  return Math.min(100, Math.max(0, finalScore));
}

/**
 * Calculates, updates, and persists the health score of a single customer by CustomerID.
 * 
 * @param {string} customerId
 * @returns {Promise<number>} updated health score
 */
async function updateCustomerHealthScore(customerId) {
  const customer = await Customer.findOne({ customerId });
  if (!customer) return 0;

  const newScore = await calculateHealthScore(customer);
  customer.healthScore = newScore;
  await customer.save();

  return newScore;
}

/**
 * Resolves category for a health score.
 * 
 * @param {number} score
 * @returns {string} Category
 */
function getHealthCategory(score) {
  const s = Number(score) || 0;
  if (s >= 90) return 'Champion';
  if (s >= 70) return 'Healthy';
  if (s >= 40) return 'Needs Attention';
  return 'At Risk';
}

/**
 * Calculates average health score across all customers.
 * @returns {Promise<number>}
 */
async function getAverageHealthScore() {
  const customers = await Customer.find().lean();
  if (customers.length === 0) return 0;
  const sum = customers.reduce((acc, c) => acc + (c.healthScore || 0), 0);
  return Math.round(sum / customers.length);
}

/**
 * Returns At Risk customers (Score < 40).
 * @returns {Promise<Array<object>>}
 */
async function getAtRiskCustomers() {
  return Customer.find({ healthScore: { $lt: 40 } }).lean();
}

/**
 * Returns Champion customers (Score >= 90).
 * @returns {Promise<Array<object>>}
 */
async function getChampionCustomers() {
  return Customer.find({ healthScore: { $gte: 90 } }).lean();
}

/**
 * Returns Healthy customers (Score >= 70 and < 90).
 * @returns {Promise<Array<object>>}
 */
async function getHealthyCustomers() {
  return Customer.find({ healthScore: { $gte: 70, $lt: 90 } }).lean();
}

module.exports = {
  calculateHealthScore,
  updateCustomerHealthScore,
  getHealthCategory,
  getAverageHealthScore,
  getAtRiskCustomers,
  getChampionCustomers,
  getHealthyCustomers
};
