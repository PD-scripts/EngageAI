import React, { useState } from 'react';
import axios from 'axios';

import { API_BASE_URL } from '../config/api';

const DEFAULT_JSON = `{
  "conditions": [
    {
      "field": "City",
      "operator": "=",
      "value": "Delhi"
    }
  ]
}`;

const QueryTester = () => {
  const [jsonInput, setJsonInput] = useState(DEFAULT_JSON);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [results, setResults] = useState(null);

  const handleRunQuery = async () => {
    setLoading(true);
    setError(null);
    setResults(null);

    // 1. Client-side JSON Syntax validation
    let parsedPayload;
    try {
      parsedPayload = JSON.parse(jsonInput);
    } catch (err) {
      setError("Invalid JSON: Please check your syntax (e.g. missing commas or quotes).");
      setLoading(false);
      return;
    }

    // 2. Perform API Call
    try {
      const response = await axios.post(`${API_BASE_URL}/query`, parsedPayload);
      setResults(response.data);
    } catch (err) {
      console.error('Query execution error:', err);
      if (err.response && err.response.data && err.response.data.error) {
        // Backend validation errors (e.g., "Invalid field", "Invalid operator")
        setError(err.response.data.error);
      } else {
        setError("Failed to reach server. Please make sure the backend is running.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Query Tester</h2>
        <p className="text-slate-500 mt-1">
          Temporary developer sandbox to verify and test the Dynamic Query Engine.
        </p>
      </div>

      {/* Main Grid: Left JSON Editor, Right Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* JSON Editor Panel */}
        <div className="lg:col-span-5 bg-white p-6 rounded-xl border border-border shadow-sm flex flex-col space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-slate-800">Filter Conditions (JSON)</h3>
            <p className="text-xs text-slate-400 mt-0.5">Edit query JSON payload below.</p>
          </div>

          <textarea
            value={jsonInput}
            onChange={(e) => setJsonInput(e.target.value)}
            rows={12}
            className="w-full p-4 font-mono text-sm border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all resize-y text-slate-700"
          />

          <button
            onClick={handleRunQuery}
            disabled={loading}
            className="w-full py-2.5 bg-primary text-white font-medium rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Running Query...' : 'Run Query'}
          </button>
        </div>

        {/* Query Results Panel */}
        <div className="lg:col-span-7 bg-white p-6 rounded-xl border border-border shadow-sm flex flex-col space-y-4 min-h-[400px]">
          <div>
            <h3 className="text-lg font-semibold text-slate-800">Query Results</h3>
            <p className="text-xs text-slate-400 mt-0.5">Matching shoppers matching conditions will list below.</p>
          </div>

          {/* Loading State */}
          {loading && (
            <div className="flex-1 flex items-center justify-center text-slate-500 font-medium py-12">
              Running query...
            </div>
          )}

          {/* Error Alert */}
          {error && (
            <div className="bg-red-50 text-red-700 p-4 rounded-lg border border-red-200 text-sm font-semibold">
              Error: {error}
            </div>
          )}

          {/* Prompt/Guide State */}
          {!loading && !error && !results && (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-400 py-12 text-center">
              <svg className="w-12 h-12 mb-3 text-slate-300" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M10 21h7a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v11m0 5l4.879-4.879m0 0a3 3 0 104.243-4.242 3 3 0 00-4.243 4.242z" />
              </svg>
              <p className="text-sm">Click "Run Query" to evaluate target filters.</p>
            </div>
          )}

          {/* Results Display */}
          {!loading && !error && results && (
            <div className="flex-1 flex flex-col space-y-4">
              <div className="flex items-center justify-between bg-slate-50 px-4 py-3 rounded-lg border border-border">
                <span className="text-sm font-medium text-slate-500">Total Matches</span>
                <span className="text-lg font-bold text-slate-800">{results.count} shoppers</span>
              </div>

              {results.customers.length === 0 ? (
                <div className="text-slate-500 text-sm text-center py-12 bg-slate-50/50 rounded-lg border border-dashed border-border">
                  No customers matched the query conditions.
                </div>
              ) : (
                <div className="overflow-x-auto border border-border rounded-lg">
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-slate-50 text-slate-500 border-b border-border font-semibold uppercase tracking-wider">
                        <th className="px-4 py-3">Name</th>
                        <th className="px-4 py-3">Email</th>
                        <th className="px-4 py-3">City</th>
                        <th className="px-4 py-3 text-right">Spend</th>
                        <th className="px-4 py-3 text-right">Orders</th>
                        <th className="px-4 py-3">Type</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border text-slate-700">
                      {results.customers.map((c) => (
                        <tr key={c.CustomerID} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-4 py-3 font-semibold text-slate-900">{c.Name}</td>
                          <td className="px-4 py-3 truncate max-w-[150px]">{c.Email}</td>
                          <td className="px-4 py-3">{c.City}</td>
                          <td className="px-4 py-3 text-right font-medium">₹{Number(c.TotalSpend).toLocaleString()}</td>
                          <td className="px-4 py-3 text-right">{c.TotalOrders}</td>
                          <td className="px-4 py-3">
                            <span className={`px-2 py-0.5 text-[10px] font-bold rounded-full ${
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
          )}

        </div>

      </div>
    </div>
  );
};

export default QueryTester;
