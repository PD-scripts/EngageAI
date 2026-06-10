import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const Orders = () => {
  // State Management
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter and Pagination State
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(10); // 10 orders per page
  const [totalPages, setTotalPages] = useState(1);

  // Fetch orders from API
  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_BASE_URL}/orders`, {
          params: {
            page,
            limit,
            search
          }
        });
        setOrders(response.data.orders || []);
        setTotalPages(response.data.totalPages || 1);
        setError(null);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Failed to load orders. Please make sure the backend is running.');
      } finally {
        setLoading(false);
      }
    };

    // Debounce search inputs
    const delayDebounceFn = setTimeout(() => {
      fetchOrders();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [page, search, limit]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1); // Reset to first page when query changes
  };

  // Generate page buttons
  const renderPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => setPage(i)}
          className={`px-3 py-1 text-sm font-medium rounded-md transition-colors ${
            page === i
              ? 'bg-primary text-white'
              : 'bg-white text-slate-700 hover:bg-slate-50 border border-border'
          }`}
        >
          {i}
        </button>
      );
    }
    return pages;
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Orders</h2>
        <p className="text-slate-500 mt-1">Track and manage global shopper orders across all sales channels.</p>
      </div>

      {/* Search Bar */}
      <div className="flex bg-white p-4 rounded-xl border border-border shadow-sm">
        <div className="w-full sm:w-80 relative">
          <input
            type="text"
            placeholder="Search orders (any field)..."
            value={search}
            onChange={handleSearchChange}
            className="w-full pl-4 pr-10 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg border border-red-200">
          {error}
        </div>
      )}

      {/* Table Section */}
      <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-500 font-medium">
            Loading orders...
          </div>
        ) : orders.length === 0 ? (
          <div className="p-12 text-center text-slate-500 font-medium">
            No orders match the search criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50 text-slate-500 border-b border-border text-xs font-semibold uppercase tracking-wider">
                  <th className="px-6 py-4">Order ID</th>
                  <th className="px-6 py-4">Customer ID</th>
                  <th className="px-6 py-4">Product Name</th>
                  <th className="px-6 py-4 text-right">Amount</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Order Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-slate-700">
                {orders.map((o) => (
                  <tr key={o.OrderID} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4 font-mono font-semibold text-slate-900">{o.OrderID}</td>
                    <td className="px-6 py-4 font-mono">{o.CustomerID}</td>
                    <td className="px-6 py-4">{o.ProductName}</td>
                    <td className="px-6 py-4 text-right font-medium">₹{Number(o.Amount).toLocaleString()}</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                        o.Status === 'Completed' ? 'bg-green-100 text-green-700' :
                        o.Status === 'Shipped' ? 'bg-blue-100 text-blue-700' :
                        o.Status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {o.Status}
                      </span>
                    </td>
                    <td className="px-6 py-4">{o.OrderDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {!loading && orders.length > 0 && (
        <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-border shadow-sm">
          {/* Previous Page */}
          <button
            onClick={() => setPage(p => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="px-4 py-2 text-sm font-medium border border-border rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-white transition-colors"
          >
            Previous
          </button>

          {/* Page Number Buttons */}
          <div className="flex gap-2">
            {renderPageNumbers()}
          </div>

          {/* Next Page */}
          <button
            onClick={() => setPage(p => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
            className="px-4 py-2 text-sm font-medium border border-border rounded-lg hover:bg-slate-50 disabled:opacity-50 disabled:hover:bg-white transition-colors"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Orders;
