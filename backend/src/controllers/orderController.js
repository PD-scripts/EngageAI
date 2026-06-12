const Order = require('../models/Order');
const legacyMapper = require('../utils/legacyMapper');

/**
 * GET /api/orders
 * Supports query parameters:
 *  - page: page number (default: 1)
 *  - limit: page size limit (default: 10)
 *  - search: searches across productName, customerId, orderId (case-insensitive)
 */
async function getOrders(req, res) {
  try {
    const page = parseInt(req.query.page, 10) || 1;
    const limit = parseInt(req.query.limit, 10) || 10;
    const search = req.query.search ? req.query.search.trim() : '';

    const query = {};

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { productName: searchRegex },
        { customerId: searchRegex },
        { orderId: searchRegex }
      ];
    }

    const totalOrders = await Order.countDocuments(query);
    const totalPages = Math.ceil(totalOrders / limit) || 1;
    const currentPage = Math.min(page, totalPages);
    const startIndex = (currentPage - 1) * limit;

    const orders = await Order.find(query)
      .skip(startIndex)
      .limit(limit)
      .lean();

    // Map to legacy columns expected by frontend
    const legacyOrders = orders.map(legacyMapper.mapToLegacyOrder);

    res.json({
      orders: legacyOrders,
      totalPages,
      currentPage,
      totalOrders
    });
  } catch (error) {
    console.error('Error in getOrders controller:', error);
    res.status(500).json({ message: "Internal Server Error fetching orders" });
  }
}

module.exports = {
  getOrders
};
