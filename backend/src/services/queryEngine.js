/**
 * Dynamic Query Engine Service for AudiencePilot
 */

/**
 * Checks if a customer matches a single condition.
 * Performs type-aware comparisons (numeric vs string).
 * 
 * @param {Object} customer - The customer record to check.
 * @param {Object} condition - The condition object { field, operator, value }.
 * @returns {boolean} - True if the customer matches the condition, false otherwise.
 */
function matchCondition(customer, condition) {
  const { field, operator, value } = condition;
  
  // Guard clause if field does not exist on customer object
  if (!(field in customer)) {
    return false;
  }

  const numericFields = ['TotalSpend', 'TotalOrders', 'LastPurchaseDays', 'healthScore', 'HealthScore'];
  const isNumeric = numericFields.includes(field);

  if (isNumeric) {
    const cVal = Number(customer[field]);
    const condVal = Number(value);

    // If conversion results in NaN, we cannot match numeric filters
    if (isNaN(cVal) || isNaN(condVal)) {
      return false;
    }

    switch (operator) {
      case '=':
        return cVal === condVal;
      case '>':
        return cVal > condVal;
      case '<':
        return cVal < condVal;
      case '>=':
        return cVal >= condVal;
      case '<=':
        return cVal <= condVal;
      default:
        return false;
    }
  } else {
    // String comparisons (case-insensitive)
    const cVal = String(customer[field] || '').trim().toLowerCase();
    const condVal = String(value || '').trim().toLowerCase();

    switch (operator) {
      case '=':
        return cVal === condVal;
      case '>':
        return cVal > condVal;
      case '<':
        return cVal < condVal;
      case '>=':
        return cVal >= condVal;
      case '<=':
        return cVal <= condVal;
      default:
        return false;
    }
  }
}

/**
 * Filters a list of customers based on a set of conditions using AND logic.
 * 
 * @param {Array} customers - The cached list of customers.
 * @param {Array} conditions - The array of filter conditions.
 * @returns {Array} - The list of matching customers.
 */
function applyFilters(customers, conditions) {
  // If no conditions are supplied, return all customers
  if (!conditions || !Array.isArray(conditions) || conditions.length === 0) {
    return customers;
  }

  // Filter list (customer must match ALL conditions)
  return customers.filter(customer => 
    conditions.every(condition => matchCondition(customer, condition))
  );
}

module.exports = {
  applyFilters
};
