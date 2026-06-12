import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  ArrowLeft, 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Calendar, 
  Coffee, 
  TrendingUp, 
  ShoppingBag, 
  Clock, 
  Activity
} from 'lucide-react';

const API_BASE_URL = 'http://localhost:5000/api';

const CustomerDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchCustomerDetails = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`${API_BASE_URL}/customers/${id}`);
        setData(response.data);
        setError(null);
      } catch (err) {
        console.error('Error fetching customer details:', err);
        setError('Failed to load customer profile details.');
      } finally {
        setLoading(false);
      }
    };

    fetchCustomerDetails();
  }, [id]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-sm font-bold text-text-muted">Loading shopper profile...</div>
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="space-y-4">
        <button 
          onClick={() => navigate('/customers')}
          className="inline-flex items-center space-x-2 text-xs font-bold text-primary hover:underline cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Database</span>
        </button>
        <div className="bg-danger/5 text-danger p-4 rounded-xl border border-danger/10 text-xs font-bold">
          {error || 'Shopper profile not found.'}
        </div>
      </div>
    );
  }

  const { customer, orders } = data;
  const score = Number(customer.healthScore || customer.HealthScore || 0);

  // Health categories and style helper
  const getHealthCategory = (val) => {
    if (val >= 90) return { label: 'Champion', style: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' };
    if (val >= 70) return { label: 'Healthy', style: 'bg-blue-500/10 text-blue-500 border-blue-500/20' };
    if (val >= 40) return { label: 'Needs Attention', style: 'bg-amber-500/10 text-amber-500 border-amber-500/20' };
    return { label: 'At Risk', style: 'bg-rose-500/10 text-rose-500 border-rose-500/20' };
  };

  const health = getHealthCategory(score);

  return (
    <div className="space-y-8">
      {/* Back button */}
      <div>
        <button 
          onClick={() => navigate('/customers')}
          className="inline-flex items-center space-x-2 px-4 py-2 bg-white hover:bg-slate-50 border border-border text-xs font-bold text-text-main rounded-xl shadow-2xs transition-all cursor-pointer"
        >
          <ArrowLeft className="h-4 w-4" />
          <span>Back to Database</span>
        </button>
      </div>

      {/* Main Grid: Info card and Health score */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Customer Basic Info Card */}
        <div className="bg-white p-6 rounded-2xl border border-border shadow-2xs space-y-6 lg:col-span-2">
          <div className="flex items-center space-x-4 border-b border-border pb-6">
            <div className="h-16 w-16 rounded-full bg-primary/5 text-primary flex items-center justify-center text-2xl font-black">
              {customer.Name ? customer.Name.charAt(0) : '?'}
            </div>
            <div>
              <h2 className="text-xl font-bold text-text-main">{customer.Name}</h2>
              <p className="text-xs text-text-muted font-semibold mt-0.5">Customer ID: {customer.CustomerID}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Email */}
            <div className="flex items-start space-x-3">
              <Mail className="h-4 w-4 text-text-muted mt-0.5" />
              <div>
                <h4 className="text-[10px] text-text-muted uppercase font-bold tracking-widest">Email Address</h4>
                <p className="text-xs text-text-main font-bold mt-0.5">{customer.Email || 'N/A'}</p>
              </div>
            </div>

            {/* Phone */}
            <div className="flex items-start space-x-3">
              <Phone className="h-4 w-4 text-text-muted mt-0.5" />
              <div>
                <h4 className="text-[10px] text-text-muted uppercase font-bold tracking-widest">Phone Number</h4>
                <p className="text-xs text-text-main font-bold mt-0.5">{customer.Phone || 'N/A'}</p>
              </div>
            </div>

            {/* City */}
            <div className="flex items-start space-x-3">
              <MapPin className="h-4 w-4 text-text-muted mt-0.5" />
              <div>
                <h4 className="text-[10px] text-text-muted uppercase font-bold tracking-widest">City Location</h4>
                <p className="text-xs text-text-main font-bold mt-0.5">{customer.City || 'N/A'}</p>
              </div>
            </div>

            {/* Date of Birth */}
            <div className="flex items-start space-x-3">
              <Calendar className="h-4 w-4 text-text-muted mt-0.5" />
              <div>
                <h4 className="text-[10px] text-text-muted uppercase font-bold tracking-widest">Date of Birth</h4>
                <p className="text-xs text-text-main font-bold mt-0.5">
                  {customer.DateOfBirth ? new Date(customer.DateOfBirth).toLocaleDateString(undefined, {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  }) : 'N/A'}
                </p>
              </div>
            </div>

            {/* Favorite product */}
            <div className="flex items-start space-x-3">
              <Coffee className="h-4 w-4 text-text-muted mt-0.5" />
              <div>
                <h4 className="text-[10px] text-text-muted uppercase font-bold tracking-widest">Favorite Coffee Product</h4>
                <p className="text-xs text-text-main font-bold mt-0.5">{customer.favoriteProduct || 'N/A'}</p>
              </div>
            </div>

            {/* Customer Type Segment */}
            <div className="flex items-start space-x-3">
              <TrendingUp className="h-4 w-4 text-text-muted mt-0.5" />
              <div>
                <h4 className="text-[10px] text-text-muted uppercase font-bold tracking-widest">Customer Tier Segment</h4>
                <span className={`inline-block mt-1.5 px-2 py-0.5 text-[9px] font-black rounded-full uppercase border ${
                  customer.CustomerType === 'VIP' ? 'bg-primary/10 text-primary border-primary/20' :
                  customer.CustomerType === 'Regular' ? 'bg-slate-100 text-slate-700 border-slate-200' :
                  'bg-success/10 text-success border-success/20'
                }`}>
                  {customer.CustomerType || 'Regular'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Customer Health Score Dashboard Panel */}
        <div className="bg-white p-6 rounded-2xl border border-border shadow-2xs flex flex-col justify-between space-y-6">
          <div>
            <h3 className="text-sm font-bold text-text-main tracking-tight flex items-center space-x-2">
              <Activity className="h-4 w-4 text-[#8B7355]" />
              <span>Customer Health Score</span>
            </h3>
            <div className="w-10 h-[2px] bg-[#8B7355] mt-1.5" />
            <p className="text-[11px] text-text-muted font-semibold mt-2.5">
              Calculated dynamically from recency, frequency, spend value, and communication click-rates.
            </p>
          </div>

          {/* Large display score circle */}
          <div className="flex flex-col items-center justify-center py-4">
            <div className="text-5xl font-black text-text-main font-serif relative">
              <span>{score}</span>
              <span className="text-lg text-text-muted font-sans font-semibold"> / 100</span>
            </div>
            
            {/* Category badge */}
            <div className="mt-4">
              <span className={`px-4 py-1.5 text-xs font-black rounded-full border ${health.style}`}>
                {health.label}
              </span>
            </div>
          </div>

          <div className="border-t border-border pt-4 text-center">
            <p className="text-[10px] text-text-muted font-bold tracking-widest uppercase">Health Status</p>
            <p className="text-xs text-text-main font-semibold mt-1">
              {score >= 90 ? 'High-value advocate with perfect café engagement.' :
               score >= 70 ? 'Cohesive and regular customer relationship.' :
               score >= 40 ? 'Slightly lapsed relationship. Requires attention.' :
               'Lapsed shopper. High risk of immediate churn.'}
            </p>
          </div>
        </div>
      </div>

      {/* KPI Stats Box */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Total Spend */}
        <div className="bg-white p-5 rounded-xl border border-border shadow-2xs flex items-center space-x-4">
          <div className="p-3 rounded-lg bg-emerald-500/5 text-emerald-500">
            <ShoppingBag className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-[10px] text-text-muted uppercase font-bold tracking-widest">Total Spend (LTV)</h4>
            <p className="text-lg font-bold text-text-main mt-0.5">₹{Number(customer.TotalSpend).toLocaleString()}</p>
          </div>
        </div>

        {/* Total Orders */}
        <div className="bg-white p-5 rounded-xl border border-border shadow-2xs flex items-center space-x-4">
          <div className="p-3 rounded-lg bg-primary/5 text-primary">
            <ShoppingBag className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-[10px] text-text-muted uppercase font-bold tracking-widest">Total Orders</h4>
            <p className="text-lg font-bold text-text-main mt-0.5">{customer.TotalOrders} Orders</p>
          </div>
        </div>

        {/* Recency */}
        <div className="bg-white p-5 rounded-xl border border-border shadow-2xs flex items-center space-x-4">
          <div className="p-3 rounded-lg bg-amber-500/5 text-amber-500">
            <Clock className="h-5 w-5" />
          </div>
          <div>
            <h4 className="text-[10px] text-text-muted uppercase font-bold tracking-widest">Recency Score</h4>
            <p className="text-lg font-bold text-text-main mt-0.5">{customer.LastPurchaseDays} days ago</p>
          </div>
        </div>
      </div>

      {/* Order History Table */}
      <div className="bg-white rounded-2xl border border-border shadow-2xs overflow-hidden">
        <div className="p-5 border-b border-border bg-slate-50/50">
          <h3 className="text-xs font-black text-text-muted uppercase tracking-widest">Order History log</h3>
        </div>

        {orders.length === 0 ? (
          <div className="p-12 text-center text-xs text-text-muted font-bold">
            No logged orders found for this customer profile.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="bg-slate-50/40 text-text-muted border-b border-border text-[10px] font-bold uppercase tracking-wider">
                  <th className="px-6 py-3.5">Order ID</th>
                  <th className="px-6 py-3.5">Product Name</th>
                  <th className="px-6 py-3.5 text-right">Amount</th>
                  <th className="px-6 py-3.5">Order Date</th>
                  <th className="px-6 py-3.5 text-center">Status</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-xs text-text-main font-semibold">
                {orders.map((o) => (
                  <tr key={o.OrderID} className="hover:bg-slate-50/30">
                    <td className="px-6 py-4 font-bold text-text-muted">#{o.OrderID}</td>
                    <td className="px-6 py-4 font-bold">{o.ProductName}</td>
                    <td className="px-6 py-4 text-right font-bold">₹{Number(o.Amount).toLocaleString()}</td>
                    <td className="px-6 py-4 text-text-muted">
                      {new Date(o.OrderDate).toLocaleDateString(undefined, {
                        year: 'numeric',
                        month: 'short',
                        day: 'numeric'
                      })}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2.5 py-0.5 text-[9px] font-black rounded-full border ${
                        o.Status === 'Completed' ? 'bg-success/5 text-success border-success/15' :
                        o.Status === 'Cancelled' ? 'bg-danger/5 text-danger border-danger/15' :
                        'bg-warning/5 text-warning border-warning/15'
                      }`}>
                        {o.Status}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default CustomerDetails;
