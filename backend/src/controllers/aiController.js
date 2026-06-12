const aiService = require('../services/aiService');
const queryEngine = require('../services/queryEngine');
const excelParser = require('../services/excelParser');

// Allowed schema whitelists for strict validation of AI output
const ALLOWED_FIELDS = [
  'CustomerID',
  'Name',
  'Email',
  'Phone',
  'City',
  'TotalSpend',
  'TotalOrders',
  'LastPurchaseDays',
  'CustomerType',
  'healthScore',
  'HealthScore'
];

const ALLOWED_OPERATORS = ['=', '>', '<', '>=', '<='];

/**
 * POST /api/ai/audience-builder
 * Translates a natural language search query into structured customer listings.
 */
async function buildAudience(req, res) {
  try {
    const { prompt } = req.body;

    if (!prompt || typeof prompt !== 'string' || prompt.trim() === '') {
      return res.status(400).json({ error: "Missing 'prompt' string in request body" });
    }

    let queryJson;
    try {
      // 1. Invoke Groq AI Parser
      queryJson = await aiService.parseAudiencePrompt(prompt);
    } catch (error) {
      console.error('[AI Controller] AI processing error:', error.message);
      return res.status(400).json({ error: "Unable to understand audience request" });
    }

    // 2. Validate query structure and elements
    if (!queryJson || !Array.isArray(queryJson.conditions)) {
      console.error('[AI Controller] Invalid conditions object structure returned:', queryJson);
      return res.status(400).json({ error: "Unable to understand audience request" });
    }

    // Validate fields and operators
    for (const cond of queryJson.conditions) {
      const { field, operator, value } = cond;

      if (field === undefined || operator === undefined || value === undefined) {
        console.error('[AI Controller] Missing core fields in condition:', cond);
        return res.status(400).json({ error: "Unable to understand audience request" });
      }

      if (!ALLOWED_FIELDS.includes(field)) {
        console.error('[AI Controller] AI generated an invalid field name:', field);
        return res.status(400).json({ error: "Unable to understand audience request" });
      }

      if (!ALLOWED_OPERATORS.includes(operator)) {
        console.error('[AI Controller] AI generated an invalid operator:', operator);
        return res.status(400).json({ error: "Unable to understand audience request" });
      }
    }

    // 3. Get shoppers from MongoDB
    const Customer = require('../models/Customer');
    const legacyMapper = require('../utils/legacyMapper');
    const dbCustomers = await Customer.find().lean();
    const customers = dbCustomers.map(legacyMapper.mapToLegacyCustomer);

    // 4. Run Stage 3 Dynamic Query Engine locally
    const filteredCustomers = queryEngine.applyFilters(customers, queryJson.conditions);

    // 5. Send matching query schema and results
    res.json({
      query: {
        conditions: queryJson.conditions
      },
      count: filteredCustomers.length,
      customers: filteredCustomers
    });

  } catch (error) {
    console.error('[AI Controller] Unexpected error:', error);
    res.status(500).json({ error: "Internal Server Error compiling audience" });
  }
}

module.exports = {
  buildAudience
};
