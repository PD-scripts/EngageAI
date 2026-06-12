/**
 * Maps a camelCase customer document from MongoDB to the legacy capitalized Excel structure.
 * 
 * @param {object} c - The plain MongoDB customer object
 * @returns {object}
 */
function mapToLegacyCustomer(c) {
  if (!c) return null;
  return {
    CustomerID: c.customerId,
    Name: c.name,
    Email: c.email,
    Phone: c.phone,
    City: c.city,
    TotalSpend: c.totalSpend,
    TotalOrders: c.totalOrders,
    LastPurchaseDays: c.lastPurchaseDays,
    CustomerType: c.customerType,
    DateOfBirth: c.dateOfBirth,
    favoriteProduct: c.favoriteProduct,
    healthScore: c.healthScore,
    HealthScore: c.healthScore,
    createdAt: c.createdAt,
    updatedAt: c.updatedAt
  };
}

/**
 * Maps a camelCase order document from MongoDB to the legacy capitalized Excel structure.
 * 
 * @param {object} o - The plain MongoDB order object
 * @returns {object}
 */
function mapToLegacyOrder(o) {
  if (!o) return null;
  return {
    OrderID: o.orderId,
    CustomerID: o.customerId,
    ProductName: o.productName,
    Amount: o.amount,
    Status: o.status,
    OrderDate: o.orderDate instanceof Date ? o.orderDate.toISOString().split('T')[0] : o.orderDate,
    createdAt: o.createdAt,
    updatedAt: o.updatedAt
  };
}

module.exports = {
  mapToLegacyCustomer,
  mapToLegacyOrder
};
