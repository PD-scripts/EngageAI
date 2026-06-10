import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const Customers = () => {
  const navigate = useNavigate();

  // State Management
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter and Pagination State
  const [search, setSearch] = useState('');
  const [city, setCity] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(10); // 10 customers per page
  const [totalPages, setTotalPages] = useState(1);

  // Fetch customers on dependency change
  useEffect(() => {
    const fetchCustomers = async () => {
      setLoading(true);
      try {
        const response = await axios.get(`${API_BASE_URL}/customers`, {
          params: {
            page,
            limit,
            search,
            city
          }
        });
        setCustomers(response.data.customers || []);
        setTotalPages(response.data.totalPages || 1);
        setError(null);
      } catch (err) {
        console.error('Error fetching customers:', err);
        setError('Failed to load customers. Please make sure the backend is running.');
      } finally {
        setLoading(false);
      }
    };

    // Debounce search input to avoid spamming requests
    const delayDebounceFn = setTimeout(() => {
      fetchCustomers();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [page, search, city, limit]);

  // Handler functions
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1); // Reset to first page on search
  };

  const handleCityChange = (e) => {
    setCity(e.target.value);
    setPage(1); // Reset to first page on filter change
  };

  const handleRowClick = (customerId) => {
    navigate(`/customers/${customerId}`);
  };

  // Generate array of page numbers to render
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
        <h2 className="text-2xl font-bold text-slate-800">Customers</h2>
        <p className="text-slate-500 mt-1">View and manage shopper profiles imported from standard databases.</p>
      </div>

      {/* Filters and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-4 justify-between items-center bg-white p-4 rounded-xl border border-border shadow-sm">
        {/* Search Input */}
        <div className="w-full sm:w-80 relative">
          <input
            type="text"
            placeholder="Search customers (any field)..."
            value={search}
            onChange={handleSearchChange}
            className="w-full pl-4 pr-10 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all"
          />
        </div>

        {/* City Filter Dropdown */}
        <div className="w-full sm:w-48">
          <select
            value={city}
            onChange={handleCityChange}
            className="w-full px-3 py-2 text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all text-slate-700"
          >
            <option value="">All Cities</option>
            <option value="Delhi">Delhi</option>
            <option value="Mumbai">Mumbai</option>
            <option value="Bangalore">Bangalore</option>
            <option value="Pune">Pune</option>
            <option value="Hyderabad">Hyderabad</option>
          </select>
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
            Loading customers...
          </div>
        ) : customers.length === 0 ? (
          <div className="p-12 text-center text-slate-500 font-medium">
            No shopper profiles match the query filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50 text-slate-500 border-b border-border text-xs font-semibold uppercase tracking-wider">
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Email</th>
                  <th className="px-6 py-4">City</th>
                  <th className="px-6 py-4 text-right">Total Spend</th>
                  <th className="px-6 py-4 text-right">Total Orders</th>
                  <th className="px-6 py-4 text-right font-medium">Last Purchase</th>
                  <th className="px-6 py-4">Customer Type</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-sm text-slate-700">
                {customers.map((c) => (
                  <tr
                    key={c.CustomerID}
                    onClick={() => handleRowClick(c.CustomerID)}
                    className="hover:bg-slate-50/80 cursor-pointer transition-colors"
                  >
                    <td className="px-6 py-4 font-medium text-slate-900">{c.Name}</td>
                    <td className="px-6 py-4">{c.Email}</td>
                    <td className="px-6 py-4">{c.City}</td>
                    <td className="px-6 py-4 text-right font-medium">₹{Number(c.TotalSpend).toLocaleString()}</td>
                    <td className="px-6 py-4 text-right">{c.TotalOrders}</td>
                    <td className="px-6 py-4 text-right">{c.LastPurchaseDays} days ago</td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                        c.CustomerType === 'VIP' ? 'bg-purple-100 text-purple-700' :
                        c.CustomerType === 'Regular' ? 'bg-blue-100 text-blue-700' :
                        c.CustomerType === 'New' ? 'bg-green-100 text-green-700' :
                        'bg-slate-100 text-slate-700'
                      }`}>
                        {c.CustomerType}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {!loading && customers.length > 0 && (
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

export default Customers;
