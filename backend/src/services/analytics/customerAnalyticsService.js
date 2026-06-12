const Customer = require('../../models/Customer');
const legacyMapper = require('../../utils/legacyMapper');

/**
 * Calculates top customer performance and risk rankings.
 * Excludes sensitive contact details (email, phone, etc.).
 * Queries live data from MongoDB.
 * @returns {Promise<object>}
 */
async function getCustomerAnalytics() {
  const dbCustomers = await Customer.find().lean();
  const customers = dbCustomers.map(legacyMapper.mapToLegacyCustomer);

  // Strip sensitive columns (Email, Phone) and return safe objects
  const sanitizedCustomers = customers.map(c => ({
    customerId: c.CustomerID,
    name: c.Name,
    city: c.City,
    totalSpend: Number(c.TotalSpend || 0),
    totalOrders: Number(c.TotalOrders || 0),
    lastPurchaseDays: Number(c.LastPurchaseDays || 0),
    customerType: c.CustomerType
  }));

  // 1. Highest Spenders (Top 10 by totalSpend)
  const highestSpenders = [...sanitizedCustomers]
    .sort((a, b) => b.totalSpend - a.totalSpend)
    .slice(0, 10);

  // 2. Most Active Customers (Top 10 by totalOrders)
  const mostActiveCustomers = [...sanitizedCustomers]
    .sort((a, b) => b.totalOrders - a.totalOrders)
    .slice(0, 10);

  // 3. Customers At Risk (LastPurchaseDays > 90, Top 10 sorted descending)
  const atRiskCustomers = [...sanitizedCustomers]
    .filter(c => c.lastPurchaseDays > 90)
    .sort((a, b) => b.lastPurchaseDays - a.lastPurchaseDays)
    .slice(0, 10);

  // 4. Top Customers (Overall Top 10 by LTV - spend * orders)
  const topCustomers = [...sanitizedCustomers]
    .sort((a, b) => (b.totalSpend * b.totalOrders) - (a.totalSpend * a.totalOrders))
    .slice(0, 10);

  return {
    topCustomers,
    highestSpenders,
    mostActiveCustomers,
    atRiskCustomers
  };
}

module.exports = {
  getCustomerAnalytics
};
