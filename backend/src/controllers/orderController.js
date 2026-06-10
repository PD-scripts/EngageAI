const excelParser = require('../services/excelParser');

/**
 * GET /api/orders
 * Supports query parameters:
 *  - page: page number (default: 1)
 *  - limit: page size limit (default: 10)
 *  - search: searches across ProductName (case-insensitive)
 */
function getOrders(req, res) {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const search = req.query.search ? req.query.search.trim().toLowerCase() : '';

    let orders = excelParser.getOrders();

    // 1. Apply Search Filter (Searches across all fields)
    if (search) {
      orders = orders.filter(o => 
        Object.values(o).some(val => 
          val !== undefined && val !== null && String(val).toLowerCase().includes(search)
        )
      );
    }

    // 2. Pagination calculation
    const totalOrders = orders.length;
    const totalPages = Math.ceil(totalOrders / limit) || 1;
    const currentPage = Math.min(page, totalPages);
    const startIndex = (currentPage - 1) * limit;
    const endIndex = startIndex + limit;

    const paginatedOrders = orders.slice(startIndex, endIndex);

    res.json({
      orders: paginatedOrders,
      totalPages,
      currentPage,
      totalOrders // extra convenience parameter
    });
  } catch (error) {
    console.error('Error in getOrders controller:', error);
    res.status(500).json({ message: "Internal Server Error fetching orders" });
  }
}

module.exports = {
  getOrders
};
