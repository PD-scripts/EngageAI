const Customer = require('../../models/Customer');
const Order = require('../../models/Order');

/**
 * Re-calculates and updates all purchase-related metrics for a customer.
 * Reused for future stages and manual orders.
 * 
 * @param {string} customerId - The unique ID of the customer (e.g. 'C1001')
 * @returns {Promise<object|null>} The updated customer document
 */
async function updateCustomerMetrics(customerId) {
  const customer = await Customer.findOne({ customerId });
  if (!customer) return null;

  // Retrieve all orders for this customer (excluding cancelled ones for spend aggregates)
  const allOrders = await Order.find({ customerId });
  const validOrders = allOrders.filter(o => o.status !== 'Cancelled');

  // 1. Calculate Total Spend
  const totalSpend = validOrders.reduce((sum, o) => sum + Number(o.amount || 0), 0);

  // 2. Calculate Total Orders
  const totalOrders = validOrders.length;

  // 3. Find Last Purchase Date
  let lastPurchaseDate = null;
  let lastPurchaseDays = 0;

  if (validOrders.length > 0) {
    // Sort descending by order date
    const sorted = [...validOrders].sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
    lastPurchaseDate = sorted[0].orderDate;

    // 4. Calculate Last Purchase Days
    const diffTime = Math.abs(new Date() - new Date(lastPurchaseDate));
    lastPurchaseDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
  } else {
    // Fallback if no valid purchases
    lastPurchaseDays = customer.lastPurchaseDays || 90;
  }

  // 5. Calculate Favorite Product
  let favoriteProduct = customer.favoriteProduct || '';
  if (validOrders.length > 0) {
    const productCounts = {};
    validOrders.forEach(o => {
      if (o.productName) {
        productCounts[o.productName] = (productCounts[o.productName] || 0) + 1;
      }
    });

    let maxCount = 0;
    for (const prod in productCounts) {
      if (productCounts[prod] > maxCount) {
        maxCount = productCounts[prod];
        favoriteProduct = prod;
      }
    }
  }

  // 6. Calculate Customer Type
  let customerType = 'Regular';
  if (totalSpend >= 25000) {
    customerType = 'VIP';
  } else if (totalSpend >= 10000) {
    customerType = 'High Value';
  }

  // Save updated properties in Customer document
  customer.totalSpend = totalSpend;
  customer.totalOrders = totalOrders;
  if (lastPurchaseDate) customer.lastPurchaseDate = lastPurchaseDate;
  customer.lastPurchaseDays = lastPurchaseDays;
  customer.favoriteProduct = favoriteProduct;
  customer.customerType = customerType;

  // Calculate and assign the Customer's Health Score
  const healthScoreService = require('../health/healthScoreService');
  customer.healthScore = await healthScoreService.calculateHealthScore(customer);

  await customer.save();
  return customer;
}

/**
 * Creates a new order and synchronizes the metrics of the corresponding customer.
 * 
 * @param {object} orderData - Object containing order details
 * @returns {Promise<object>} The newly created Order document
 */
async function createOrder(orderData) {
  const { orderId, customerId, productName, amount, status, orderDate } = orderData;
  if (!orderId || !customerId || !productName || amount === undefined) {
    throw new Error('Missing required order parameters');
  }

  // 1. Create and Save Order
  const newOrder = new Order({
    orderId,
    customerId,
    productName,
    amount,
    status: status || 'Completed',
    orderDate: orderDate ? new Date(orderDate) : new Date()
  });
  await newOrder.save();

  // 2. Update Customer Spend and Order counts
  await updateCustomerMetrics(customerId);

  return newOrder;
}

module.exports = {
  updateCustomerMetrics,
  createOrder
};
