const queryEngine = require('../services/queryEngine');
const Customer = require('../models/Customer');
const legacyMapper = require('../utils/legacyMapper');

// Whitelists for validation
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
  'IsFirstTimeBuyer',
  'healthScore',
  'HealthScore'
];

const ALLOWED_OPERATORS = ['=', '>', '<', '>=', '<='];

/**
 * POST /api/query
 * Executes a dynamic filter on the shopper database.
 */
async function executeQuery(req, res) {
  try {
    const { conditions } = req.body;

    // Validate body structure
    if (!conditions) {
      return res.status(400).json({ error: "Missing 'conditions' array in request body" });
    }

    if (!Array.isArray(conditions)) {
      return res.status(400).json({ error: "Conditions must be a JSON array" });
    }

    // Validate each condition item
    for (const cond of conditions) {
      const { field, operator, value } = cond;

      // Validate required properties
      if (field === undefined || operator === undefined || value === undefined) {
        return res.status(400).json({ error: "Each condition must contain 'field', 'operator', and 'value'" });
      }

      // Check field whitelist
      if (!ALLOWED_FIELDS.includes(field)) {
        return res.status(400).json({ error: "Invalid field" });
      }

      // Check operator whitelist
      if (!ALLOWED_OPERATORS.includes(operator)) {
        return res.status(400).json({ error: "Invalid operator" });
      }
    }

    // Get live customers from MongoDB and map to legacy format
    const dbCustomers = await Customer.find().lean();
    const customers = dbCustomers.map(legacyMapper.mapToLegacyCustomer);

    // Execute query
    const results = queryEngine.applyFilters(customers, conditions);

    // Send response
    res.json({
      count: results.length,
      customers: results
    });
  } catch (error) {
    console.error('Error executing query:', error);
    res.status(500).json({ error: "Internal Server Error processing query" });
  }
}

module.exports = {
  executeQuery
};
