const excelParser = require('../services/excelParser');

/**
 * GET /api/customers
 * Supports query parameters:
 *  - page: page number (default: 1)
 *  - limit: page size limit (default: 10)
 *  - search: searches across Name and Email (case-insensitive)
 *  - city: filters by city name (case-insensitive exact match)
 */
function getCustomers(req, res) {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const search = req.query.search ? req.query.search.trim().toLowerCase() : '';
    const city = req.query.city ? req.query.city.trim().toLowerCase() : '';

    let customers = excelParser.getCustomers();

    // 1. Apply Search Filter (Searches across all fields)
    if (search) {
      customers = customers.filter(c => 
        Object.values(c).some(val => 
          val !== undefined && val !== null && String(val).toLowerCase().includes(search)
        )
      );
    }

    // 2. Apply City Filter
    if (city && city !== 'all' && city !== 'all cities') {
      customers = customers.filter(c => 
        c.City && c.City.toLowerCase() === city
      );
    }

    // 3. Pagination calculation
    const totalCustomers = customers.length;
    const totalPages = Math.ceil(totalCustomers / limit) || 1;
    const currentPage = Math.min(page, totalPages);
    const startIndex = (currentPage - 1) * limit;
    const endIndex = startIndex + limit;

    const paginatedCustomers = customers.slice(startIndex, endIndex);

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
function getCustomerById(req, res) {
  try {
    const { id } = req.params;
    const customer = excelParser.getCustomerById(id);

    if (!customer) {
      return res.status(404).json({ message: `Customer with ID ${id} not found` });
    }

    const orders = excelParser.getOrdersByCustomerId(id);

    res.json({
      customer,
      orders
    });
  } catch (error) {
    console.error(`Error in getCustomerById controller for ID ${req.params.id}:`, error);
    res.status(500).json({ message: "Internal Server Error fetching customer details" });
  }
}

module.exports = {
  getCustomers,
  getCustomerById
};
