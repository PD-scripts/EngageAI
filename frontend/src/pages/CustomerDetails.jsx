import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const CustomerDetails = () => {
  const { id } = useParams();

  // State Management
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch customer details and their orders
  useEffect(() => {
    const fetchCustomerDetails = async () => {
      setLoading(true);
      try {
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

    if (id) {
      fetchCustomerDetails();
    }
  }, [id]);

  if (loading) {
    return (
      <div className="p-12 text-center text-slate-500 font-medium">
        Loading customer details...
      </div>
    );
  }

  if (error || !data) {
    return (
      <div className="space-y-6">
        <Link to="/customers" className="inline-flex items-center text-sm font-medium text-primary hover:underline">
          &larr; Back to Customers
        </Link>
        <div className="bg-red-50 text-red-700 p-4 rounded-lg border border-red-200">
          {error || "Customer profile not found."}
        </div>
      </div>
    );
  }

  const { customer, orders } = data;

  return (
    <div className="space-y-8">
      {/* Back link */}
      <div>
        <Link
          to="/customers"
          className="inline-flex items-center text-sm font-medium text-primary hover:text-blue-700 transition-colors"
        >
          &larr; Back to Customers
        </Link>
      </div>

      {/* Main Grid: Left Profile Card, Right Extra Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Profile Details Card */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-border shadow-sm p-6 space-y-6">
          <div className="flex items-start justify-between border-b border-border pb-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-800">{customer.Name}</h2>
              <p className="text-slate-500 text-sm mt-1">ID: {customer.CustomerID}</p>
            </div>
            <span className={`px-3 py-1 text-sm font-semibold rounded-full ${
              customer.CustomerType === 'VIP' ? 'bg-purple-100 text-purple-700' :
              customer.CustomerType === 'Regular' ? 'bg-blue-100 text-blue-700' :
              customer.CustomerType === 'New' ? 'bg-green-100 text-green-700' :
              'bg-slate-100 text-slate-700'
            }`}>
              {customer.CustomerType}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-sm">
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Email Address</p>
              <p className="text-slate-700 font-medium mt-1">{customer.Email}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Phone Number</p>
              <p className="text-slate-700 font-medium mt-1">{customer.Phone}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">City</p>
              <p className="text-slate-700 font-medium mt-1">{customer.City}</p>
            </div>
            <div>
              <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Days Since Last Purchase</p>
              <p className="text-slate-700 font-medium mt-1">{customer.LastPurchaseDays} days</p>
            </div>
          </div>
        </div>

        {/* Highlight Metrics Card */}
        <div className="bg-white rounded-xl border border-border shadow-sm p-6 flex flex-col justify-between">
          <h3 className="text-lg font-semibold text-slate-800 border-b border-border pb-3">Financial Performance</h3>
          
          <div className="py-4 space-y-4">
            <div>
              <p className="text-sm font-medium text-slate-500">Total Spend (LTV)</p>
              <p className="text-3xl font-bold text-slate-800 mt-1">₹{Number(customer.TotalSpend).toLocaleString()}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-slate-500">Total Completed Orders</p>
              <p className="text-2xl font-bold text-slate-800 mt-1">{customer.TotalOrders}</p>
            </div>
          </div>

          <div className="text-xs text-slate-400 bg-slate-50 p-2.5 rounded-lg border border-border">
            Values are sourced from integrated Excel sheets.
          </div>
        </div>
      </div>

      {/* Customer Orders Table */}
      <div className="space-y-4">
        <div>
          <h3 className="text-xl font-bold text-slate-800">Customer Orders</h3>
          <p className="text-slate-500 text-sm mt-1">Complete purchase log for this shopper.</p>
        </div>

        <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
          {orders.length === 0 ? (
            <div className="p-8 text-center text-slate-500 text-sm">
              No orders found for this customer.
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse text-sm">
                <thead>
                  <tr className="bg-slate-50 text-slate-500 border-b border-border text-xs font-semibold uppercase tracking-wider">
                    <th className="px-6 py-4">Order ID</th>
                    <th className="px-6 py-4">Product Name</th>
                    <th className="px-6 py-4 text-right">Amount</th>
                    <th className="px-6 py-4">Status</th>
                    <th className="px-6 py-4">Order Date</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border text-slate-700">
                  {orders.map((order) => (
                    <tr key={order.OrderID} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-6 py-4 font-mono font-semibold text-slate-900">{order.OrderID}</td>
                      <td className="px-6 py-4">{order.ProductName}</td>
                      <td className="px-6 py-4 text-right font-medium">₹{Number(order.Amount).toLocaleString()}</td>
                      <td className="px-6 py-4">
                        <span className={`px-2.5 py-1 text-xs font-semibold rounded-full ${
                          order.Status === 'Completed' ? 'bg-green-100 text-green-700' :
                          order.Status === 'Shipped' ? 'bg-blue-100 text-blue-700' :
                          order.Status === 'Pending' ? 'bg-yellow-100 text-yellow-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {order.Status}
                        </span>
                      </td>
                      <td className="px-6 py-4">{order.OrderDate}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CustomerDetails;
