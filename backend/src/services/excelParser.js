const { readExcelSheet } = require('../utils/excelReader');

// In-memory cache variables
let customersCache = [];
let ordersCache = [];

/**
 * Initializes and loads the Excel workbook data.
 * This runs once at server startup.
 */
function init() {
  try {
    customersCache = readExcelSheet('Customers');
    ordersCache = readExcelSheet('Orders');
    console.log(`[Excel Service] Loaded ${customersCache.length} customers and ${ordersCache.length} orders into memory.`);
  } catch (error) {
    console.error('[Excel Service] Failed to parse Excel file:', error.message);
  }
}

// Load data into cache immediately when the module is required
init();

/**
 * Returns all cached customers.
 */
function getCustomers() {
  return customersCache;
}

/**
 * Returns a specific customer by ID.
 */
function getCustomerById(id) {
  if (!id) return null;
  return customersCache.find(c => String(c.CustomerID).toLowerCase() === String(id).toLowerCase()) || null;
}

/**
 * Returns all cached orders.
 */
function getOrders() {
  return ordersCache;
}

/**
 * Returns all orders belonging to a specific customer ID.
 */
function getOrdersByCustomerId(customerId) {
  if (!customerId) return [];
  return ordersCache.filter(o => String(o.CustomerID).toLowerCase() === String(customerId).toLowerCase());
}

module.exports = {
  getCustomers,
  getCustomerById,
  getOrders,
  getOrdersByCustomerId,
  init
};
