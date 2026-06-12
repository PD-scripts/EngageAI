import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Search, 
  SlidersHorizontal, 
  ChevronDown, 
  ChevronUp, 
  User, 
  ArrowUpDown, 
  Mail, 
  MapPin, 
  ExternalLink 
} from 'lucide-react';

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
  const [limit] = useState(10);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCustomers, setTotalCustomers] = useState(0);

  // Sorting
  const [sortField, setSortField] = useState('TotalSpend');
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc' or 'desc'

  // Row Expansion
  const [expandedRow, setExpandedRow] = useState(null);

  // Fetch customers on filter change
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
        
        let loadedCustomers = response.data.customers || [];
        
        // Sorting local logic
        if (sortField) {
          loadedCustomers.sort((a, b) => {
            let valA = a[sortField];
            let valB = b[sortField];
            
            // Numeric casting
            if (['TotalSpend', 'TotalOrders', 'LastPurchaseDays'].includes(sortField)) {
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

        setCustomers(loadedCustomers);
        setTotalPages(response.data.totalPages || 1);
        setTotalCustomers(response.data.totalCustomers || 0);
        setError(null);
      } catch (err) {
        console.error('Error fetching customers:', err);
        setError('Failed to load customers. Please make sure the backend is running.');
      } finally {
        setLoading(false);
      }
    };

    const delayDebounceFn = setTimeout(() => {
      fetchCustomers();
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [page, search, city, limit, sortField, sortOrder]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleCityChange = (e) => {
    setCity(e.target.value);
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

  const toggleExpandRow = (customerId, e) => {
    e.stopPropagation();
    setExpandedRow(expandedRow === customerId ? null : customerId);
  };

  const getHealthBadge = (days) => {
    const d = Number(days) || 0;
    if (d <= 30) return { label: 'Active', style: 'bg-success/10 text-success border-success/20' };
    if (d <= 90) return { label: 'Stale', style: 'bg-warning/10 text-warning border-warning/20' };
    return { label: 'At Risk', style: 'bg-danger/10 text-danger border-danger/20' };
  };

  const renderPageNumbers = () => {
    const pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => setPage(i)}
          className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all ${
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
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-text-main tracking-tight">Customer Database</h2>
          <p className="text-text-muted mt-0.5 text-xs font-medium">
            Manage your profiles, track spending metrics, and examine segment health values.
          </p>
        </div>
        <div className="text-xs font-bold text-text-muted bg-white border border-border px-3 py-2 rounded-xl">
          Total Shoppers: <span className="text-primary">{totalCustomers}</span>
        </div>
      </div>

      {/* Filters Area */}
      <div className="flex flex-col sm:flex-row gap-4 items-center justify-between bg-white p-4 rounded-xl border border-border shadow-xs">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
          <input
            type="text"
            placeholder="Search shoppers by name or email..."
            value={search}
            onChange={handleSearchChange}
            className="w-full pl-9 pr-4 py-2 text-xs border border-border rounded-lg bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-text-main"
          />
        </div>

        {/* Filter Dropdown */}
        <div className="flex items-center space-x-3 w-full sm:w-auto">
          <SlidersHorizontal className="h-4 w-4 text-text-muted" />
          <select
            value={city}
            onChange={handleCityChange}
            className="w-full sm:w-48 px-3 py-2 text-xs border border-border rounded-lg bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-text-main font-semibold cursor-pointer"
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

      {/* Error alert */}
      {error && (
        <div className="bg-danger/5 text-danger p-4 rounded-xl border border-danger/10 text-xs font-bold">
          {error}
        </div>
      )}

      {/* Data Table */}
      <div className="bg-white rounded-2xl border border-border shadow-xs overflow-hidden">
        {loading ? (
          <div className="p-16 text-center text-xs text-text-muted font-bold">
            Querying customer indexes...
          </div>
        ) : customers.length === 0 ? (
          <div className="p-16 text-center text-xs text-text-muted font-bold">
            No shopper profiles matched your filters.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/70 text-text-muted border-b border-border text-[10px] font-bold uppercase tracking-wider sticky top-0 bg-white">
                  <th className="px-6 py-4">Name</th>
                  <th className="px-6 py-4">Location</th>
                  <th className="px-6 py-4 cursor-pointer hover:text-text-main" onClick={() => toggleSort('TotalSpend')}>
                    <div className="flex items-center space-x-1 justify-end">
                      <span>Total Spend</span>
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </th>
                  <th className="px-6 py-4 cursor-pointer hover:text-text-main" onClick={() => toggleSort('TotalOrders')}>
                    <div className="flex items-center space-x-1 justify-end">
                      <span>Total Orders</span>
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </th>
                  <th className="px-6 py-4 cursor-pointer hover:text-text-main" onClick={() => toggleSort('LastPurchaseDays')}>
                    <div className="flex items-center space-x-1 justify-end">
                      <span>Recency</span>
                      <ArrowUpDown className="h-3 w-3" />
                    </div>
                  </th>
                  <th className="px-6 py-4">Status Badges</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-xs text-text-main font-semibold">
                {customers.map((c) => {
                  const health = getHealthBadge(c.LastPurchaseDays);
                  const isExpanded = expandedRow === c.CustomerID;
                  return (
                    <React.Fragment key={c.CustomerID}>
                      <tr 
                        onClick={() => navigate(`/customers/${c.CustomerID}`)}
                        className={`hover:bg-slate-50/50 cursor-pointer transition-colors duration-200 ${
                          isExpanded ? 'bg-slate-50/30' : ''
                        }`}
                      >
                        {/* Name and avatar */}
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-3">
                            <div className="h-8 w-8 rounded-full bg-primary/5 text-primary flex items-center justify-center font-bold">
                              {c.Name.charAt(0)}
                            </div>
                            <div>
                              <div className="text-text-main font-bold">{c.Name}</div>
                              <div className="text-[10px] text-text-muted font-semibold">{c.Email}</div>
                            </div>
                          </div>
                        </td>

                        {/* Location */}
                        <td className="px-6 py-4">
                          <div className="flex items-center space-x-1 text-text-muted">
                            <MapPin className="h-3 w-3 text-text-muted" />
                            <span>{c.City}</span>
                          </div>
                        </td>

                        {/* LTV Spend */}
                        <td className="px-6 py-4 text-right text-text-main font-bold">
                          ₹{Number(c.TotalSpend).toLocaleString()}
                        </td>

                        {/* Orders count */}
                        <td className="px-6 py-4 text-right text-text-muted">
                          {c.TotalOrders}
                        </td>

                        {/* Recency */}
                        <td className="px-6 py-4 text-right text-text-muted">
                          {c.LastPurchaseDays}d ago
                        </td>

                        {/* Badges */}
                        <td className="px-6 py-4">
                          <div className="flex items-center gap-2">
                            {/* Type Badge */}
                            <span className={`px-2 py-0.5 text-[9px] font-black rounded-full uppercase border ${
                              c.CustomerType === 'VIP' ? 'bg-primary/10 text-primary border-primary/20' :
                              c.CustomerType === 'Regular' ? 'bg-slate-100 text-slate-700 border-slate-200' :
                              'bg-success/10 text-success border-success/20'
                            }`}>
                              {c.CustomerType}
                            </span>
                            {/* Health Badge */}
                            <span className={`px-2 py-0.5 text-[9px] font-black rounded-full uppercase border ${health.style}`}>
                              {health.label}
                            </span>
                          </div>
                        </td>

                        {/* Expansion trigger */}
                        <td className="px-6 py-4 text-center">
                          <button
                            onClick={(e) => toggleExpandRow(c.CustomerID, e)}
                            className="p-1 text-text-muted hover:text-primary hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
                          >
                            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                          </button>
                        </td>
                      </tr>

                      {/* Row Expansion Render */}
                      <AnimatePresence>
                        {isExpanded && (
                          <tr>
                            <td colSpan={7} className="px-6 py-0 bg-slate-50/40">
                              <motion.div
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                transition={{ duration: 0.2 }}
                                className="overflow-hidden py-4 border-t border-b border-dashed border-border"
                              >
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 items-center px-4">
                                  <div className="space-y-1">
                                    <h4 className="text-[10px] text-text-muted uppercase font-bold tracking-widest">Contact Phone</h4>
                                    <p className="text-xs text-text-main font-bold">{c.Phone || 'N/A'}</p>
                                  </div>
                                  <div className="space-y-1">
                                    <h4 className="text-[10px] text-text-muted uppercase font-bold tracking-widest">Buyer Segment Index</h4>
                                    <p className="text-xs text-text-main font-bold">
                                      {c.CustomerType === 'VIP' ? 'High-Tier Loyalty Target' : 'Standard Campaign Target'}
                                    </p>
                                  </div>
                                  <div className="text-right">
                                    <button
                                      onClick={() => navigate(`/customers/${c.CustomerID}`)}
                                      className="inline-flex items-center space-x-1 px-3 py-1.5 bg-white border border-border hover:border-primary rounded-lg text-[10px] font-bold text-text-main transition-colors cursor-pointer shadow-xs"
                                    >
                                      <span>View Full Profile</span>
                                      <ExternalLink className="h-3 w-3" />
                                    </button>
                                  </div>
                                </div>
                              </motion.div>
                            </td>
                          </tr>
                        )}
                      </AnimatePresence>
                    </React.Fragment>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Pagination panel */}
      {!loading && customers.length > 0 && (
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

export default Customers;
