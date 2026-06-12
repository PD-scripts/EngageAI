const Customer = require('../../models/Customer');
const healthScoreService = require('./healthScoreService');

/**
 * Generates customer health score recommendations based on live MongoDB data.
 * Consumed by the Recommendation Engine.
 * 
 * @returns {Promise<Array<object>>}
 */
async function generateHealthRecommendations() {
  const recommendations = [];

  try {
    const customers = await Customer.find().lean();
    
    // Calculate counts of At Risk and Champion customers
    let atRiskCount = 0;
    let championCount = 0;

    customers.forEach(c => {
      const category = healthScoreService.getHealthCategory(c.healthScore || 0);
      if (category === 'At Risk') {
        atRiskCount++;
      } else if (category === 'Champion') {
        championCount++;
      }
    });

    // Condition 1: At Risk (Health Score < 40)
    if (atRiskCount > 0) {
      recommendations.push({
        id: "health-at-risk-retention",
        type: "HEALTH_AT_RISK",
        priority: "HIGH",
        title: "Customer Retention Opportunity",
        description: `${atRiskCount} customers are currently classified as At Risk.`,
        action: "Launch a Win-Back Coffee Campaign",
        path: "/campaigns",
        state: { 
          prompt: `Create a campaign for Inactive/At-Risk Customers to Win-Back Coffee purchases with a special discount code` 
        }
      });
    }

    // Condition 2: Champion (Health Score > 90)
    if (championCount > 0) {
      recommendations.push({
        id: "health-champion-loyalty",
        type: "HEALTH_CHAMPION",
        priority: "MEDIUM",
        title: "Champion Customer Opportunity",
        description: `${championCount} customers are highly engaged and loyal.`,
        action: "Launch VIP Loyalty Rewards Campaign",
        path: "/campaigns",
        state: { 
          prompt: `Create a premium campaign targeting Champion Customers to reward their loyalty with exclusive coffee beans preview` 
        }
      });
    }

  } catch (error) {
    console.error('[Health Recommendation Service] Failed to compile health recommendations:', error.message);
  }

  return recommendations;
}

module.exports = {
  generateHealthRecommendations
};
