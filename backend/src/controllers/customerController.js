const Customer = require('../models/Customer');
const Order = require('../models/Order');
const importService = require('../services/customerSync/importService');
const legacyMapper = require('../utils/legacyMapper');
const path = require('path');

/**
 * GET /api/customers
 * Supports query parameters:
 *  - page: page number (default: 1)
 *  - limit: page size limit (default: 10)
 *  - search: searches across Name, Email, CustomerID, City (case-insensitive)
 *  - city: filters by city name (case-insensitive exact match)
 */
async function getCustomers(req, res) {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const search = req.query.search ? req.query.search.trim() : '';
    const city = req.query.city ? req.query.city.trim() : '';

    const query = {};

    // Apply City filter
    if (city && city.toLowerCase() !== 'all' && city.toLowerCase() !== 'all cities') {
      query.city = { $regex: new RegExp('^' + city + '$', 'i') };
    }

    // Apply Search filter across multiple fields
    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { name: searchRegex },
        { email: searchRegex },
        { customerId: searchRegex },
        { city: searchRegex }
      ];
    }

    const totalCustomers = await Customer.countDocuments(query);
    const totalPages = Math.ceil(totalCustomers / limit) || 1;
    const currentPage = Math.min(page, totalPages);
    const startIndex = (currentPage - 1) * limit;

    const customers = await Customer.find(query)
      .skip(startIndex)
      .limit(limit)
      .lean();

    // Map MongoDB documents back to legacy format for frontend visual support
    const paginatedCustomers = customers.map(legacyMapper.mapToLegacyCustomer);

    res.json({
      customers: paginatedCustomers,
      totalPages,
      currentPage,
      totalCustomers
    });
  } catch (error) {
    console.error('Error in getCustomers controller:', error);
    res.status(500).json({ message: "Internal Server Error fetching customers" });
  }
}

/**
 * GET /api/customers/:id
 * Retrieves a customer profile and all their associated orders.
 */
async function getCustomerById(req, res) {
  try {
    const { id } = req.params;
    const customer = await Customer.findOne({ customerId: id }).lean();

    if (!customer) {
      return res.status(404).json({ message: `Customer with ID ${id} not found` });
    }

    const orders = await Order.find({ customerId: id }).lean();

    // Map to legacy format for UI support
    const legacyCustomer = legacyMapper.mapToLegacyCustomer(customer);
    const legacyOrders = orders.map(legacyMapper.mapToLegacyOrder);

    res.json({
      customer: legacyCustomer,
      orders: legacyOrders
    });
  } catch (error) {
    console.error(`Error in getCustomerById controller for ID ${req.params.id}:`, error);
    res.status(500).json({ message: "Internal Server Error fetching customer details" });
  }
}

/**
 * POST /api/customers/import
 * Imports customers and orders from Excel sheet into MongoDB.
 */
async function importCustomers(req, res) {
  try {
    const defaultExcelPath = path.resolve(__dirname, '../../data/Xeno_CRM_Dummy_Data.xlsx');
    const filePath = req.body.filePath || defaultExcelPath;

    const summary = await importService.importCustomersFromExcel(filePath);
    
    // Auto import/sync orders as well to keep operational database fully cohesive
    await importService.importOrdersFromExcel(filePath);

    res.json(summary);
  } catch (error) {
    console.error('[Customer Controller] Excel import failed:', error.message);
    res.status(500).json({ error: `Failed to import customers: ${error.message}` });
  }
}

/**
 * GET /api/customers/stats
 * Retrieves total number of customers and new customers added today.
 */
async function getCustomerStats(req, res) {
  try {
    const startOfToday = new Date();
    startOfToday.setHours(0, 0, 0, 0);

    const totalCustomers = await Customer.countDocuments();
    const newCustomersToday = await Customer.countDocuments({
      source: 'ingestion',
      createdAt: { $gte: startOfToday }
    });

    res.json({
      totalCustomers,
      newCustomersToday
    });
  } catch (error) {
    console.error('Error in getCustomerStats controller:', error);
    res.status(500).json({ message: "Internal Server Error fetching customer stats" });
  }
}

module.exports = {
  getCustomers,
  getCustomerById,
  importCustomers,
  getCustomerStats
};

