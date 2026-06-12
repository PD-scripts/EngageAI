import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Search, ShoppingBag, MapPin, Calendar, ArrowUpDown } from 'lucide-react';

const API_BASE_URL = 'http://localhost:5000/api';

const Orders = () => {
  // State Management
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Filter and Pagination State
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);

  // Sorting
  const [sortField, setSortField] = useState('OrderDate');
  const [sortOrder, setSortOrder] = useState('desc');

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
        
        let loadedOrders = response.data.orders || [];

        // Apply sort locally
        if (sortField) {
          loadedOrders.sort((a, b) => {
            let valA = a[sortField];
            let valB = b[sortField];
            
            if (sortField === 'Amount') {
              valA = Number(valA) || 0;
              valB = Number(valB) || 0;
            } else {
              valA = String(valA).toLowerCase();
              valB = String(valB).toLowerCase();
            }

            if (valA < valB) return sortOrder === 'asc' ? -1 : 1;
            if (valA > valB) return sortOrder === 'asc' ? 1 : -1;
            return 0;
          });
        }

        setOrders(loadedOrders);
        setTotalPages(response.data.totalPages || 1);
        setError(null);
      } catch (err) {
        console.error('Error fetching orders:', err);
        setError('Failed to load orders. Please make sure the backend is running.');
      } finally {
        setLoading(false);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchOrders();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [page, search, limit, sortField, sortOrder]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const toggleSort = (field) => {
    if (sortField === field) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortOrder('desc');
    }
    setPage(1);
  };

  const renderPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => setPage(i)}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-colors ${
            page === i
              ? 'bg-primary text-white shadow-xs'
              : 'bg-white text-text-muted hover:bg-slate-50 border border-border'
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
        <h2 className="text-2xl font-bold text-text-main tracking-tight">Order Journal</h2>
        <p className="text-text-muted mt-0.5 text-xs font-medium">
          Monitor transactional histories and fulfillment details across global checkouts.
        </p>
      </div>

      {/* Search Bar */}
      <div className="flex bg-white p-4 rounded-xl border border-border shadow-xs">
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
          <input
            type="text"
            placeholder="Search orders by Product Name or Order ID..."
            value={search}
            onChange={handleSearchChange}
            className="w-full pl-9 pr-4 py-2 text-xs border border-border rounded-lg bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-text-main"
          />
        </div>
      </div>

      {/* Error State */}
      {error && (
        <div className="bg-danger/5 text-danger p-4 rounded-xl border border-danger/10 text-xs font-bold">
          {error}
        </div>
      )}

      {/* Orders Table */}
      <div className="bg-white rounded-2xl border border-border shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-16 text-center text-xs text-text-muted font-bold">
            Cataloging transactions ledger...
          </div>
        ) : orders.length === 0 ? (
          <div className="p-16 text-center text-xs text-text-muted font-bold">
            No shopper invoices matched your filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70 text-text-muted border-b border-border text-[10px] font-bold uppercase tracking-wider">
                  <th className="px-6 py-4">Order Ref ID</th>
                  <th className="px-6 py-4">Customer Account</th>
                  <th className="px-6 py-4">Product Catalog Name</th>
                  <th className="px-6 py-4 text-right cursor-pointer hover:text-text-main" onClick={() => toggleSort('Amount')}>
                    <div className="flex items-center space-x-1 justify-end">
                      <span>Checkout Amount</span>
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </th>
                  <th className="px-6 py-4">Fulfillment</th>
                  <th className="px-6 py-4 cursor-pointer hover:text-text-main" onClick={() => toggleSort('OrderDate')}>
                    <div className="flex items-center space-x-1">
                      <span>Invoice Date</span>
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-xs text-text-main font-semibold">
                {orders.map((o) => (
                  <tr key={o.OrderID} className="hover:bg-slate-50/50 transition-colors duration-150">
                    <td className="px-6 py-4 font-mono font-bold text-text-main">{o.OrderID}</td>
                    <td className="px-6 py-4 font-mono text-text-muted">{o.CustomerID}</td>
                    <td className="px-6 py-4 flex items-center space-x-2">
                      <div className="p-1.5 bg-primary/5 text-primary rounded-lg">
                        <ShoppingBag className="h-3.5 w-3.5" />
                      </div>
                      <span className="font-bold text-text-main">{o.ProductName}</span>
                    </td>
                    <td className="px-6 py-4 text-right font-bold text-text-main">
                      ₹{Number(o.Amount).toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-0.5 text-[9px] font-black rounded-full uppercase border ${
                        o.Status === 'Completed' ? 'bg-success/10 text-success border-success/20' :
                        o.Status === 'Shipped' ? 'bg-primary/10 text-primary border-primary/20' :
                        'bg-warning/10 text-warning border-warning/20'
                      }`}>
                        {o.Status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-text-muted">{o.OrderDate}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination Controls */}
      {!loading && orders.length > 0 && (
        <div className="flex items-center justify-between bg-white p-4 rounded-xl border border-border shadow-xs">
          <button
            onClick={() => setPage(p => Math.max(p - 1, 1))}
            disabled={page === 1}
            className="px-4 py-2 text-xs font-semibold border border-border rounded-lg hover:bg-slate-50 disabled:opacity-50 transition-colors cursor-pointer"
          >
            Previous
          </button>

          <div className="flex gap-2">
            {renderPageNumbers()}
          </div>

          <button
            onClick={() => setPage(p => Math.min(p + 1, totalPages))}
            disabled={page === totalPages}
            className="px-4 py-2 text-xs font-semibold border border-border rounded-lg hover:bg-slate-50 disabled:opacity-50 transition-colors cursor-pointer"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default Orders;
