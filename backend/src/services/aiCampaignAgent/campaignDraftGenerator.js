const recommendationParser = require('./recommendationParser');

/**
 * Maps raw recommendation strings into fully structured drafts ready to pre-populate form fields.
 * @param {string} recommendationText - The recommendation text to analyze.
 * @returns {object} The structured campaign draft object.
 */
function generateDraft(recommendationText) {
  const parsed = recommendationParser.parseRecommendation(recommendationText);
  const { type, city } = parsed;
  
  let campaignName = 'AI Marketing Campaign';
  let audience = 'All Customers';
  let channel = 'Email';
  let message = 'Hello! Check out our latest coffee updates.';
  let expectedRevenue = 5000;
  
  if (type === 'Birthday') {
    campaignName = 'Birthday Rewards Campaign';
    audience = 'Birthday Customers';
    channel = 'WhatsApp';
    message = 'Happy Birthday! Enjoy a complimentary coffee on us.';
    expectedRevenue = 12000;
  } else if (type === 'Weather') {
    campaignName = city ? `${city} Cold Brew Promotion` : 'Cold Brew Promotion';
    audience = city ? `${city} Customers` : 'Delhi Customers';
    channel = 'WhatsApp';
    message = '39°C today ☀️ Cool down with our Signature Cold Brew.';
    expectedRevenue = 18000;
  } else if (type === 'Reactivation') {
    campaignName = city ? `${city} Win Back Campaign` : 'Win Back Campaign';
    audience = city ? `Inactive ${city} Customers` : 'Inactive Customers';
    channel = 'SMS';
    message = 'We miss you ☕ Enjoy 15% off on your next coffee visit.';
    expectedRevenue = 4500;
  }
  
  return {
    campaignName,
    campaignType: type,
    audience,
    channel,
    message,
    expectedRevenue,
    recommendationSource: recommendationText,
    generatedBy: 'AI_STRATEGIST'
  };
}

module.exports = {
  generateDraft
};
