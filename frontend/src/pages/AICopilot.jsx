import React, { useState } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const SUGGESTIONS = [
  'Find customers from Delhi',
  'Find customers spending more than 10000',
  'Find customers inactive for more than 90 days',
  'Find customers with more than 5 orders'
];

const AICopilot = () => {
  // State management
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [queryData, setQueryData] = useState(null);

  const handleChipClick = (suggestion) => {
    setPrompt(suggestion);
    setError(null);
  };

  const handleGenerateAudience = async () => {
    if (!prompt.trim()) {
      setError("Please describe the target audience segment first.");
      return;
    }

    setLoading(true);
    setError(null);
    setQueryData(null);

    try {
      const response = await axios.post(`${API_BASE_URL}/ai/audience-builder`, {
        prompt: prompt.trim()
      });
      setQueryData(response.data);
    } catch (err) {
      console.error('Error generating audience:', err);
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError("Unable to understand audience request. Please ensure backend is running.");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800">AI Audience Builder</h2>
        <p className="text-slate-500 mt-1">Describe the audience you want to target.</p>
      </div>

      {/* Input and Prompt Builder Section */}
      <div className="bg-white p-6 rounded-xl border border-border shadow-sm space-y-4">
        {/* Prompt Input Textarea */}
        <div className="space-y-2">
          <label className="text-sm font-semibold text-slate-700">Audience Request</label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Find customers from Delhi spending more than 10000..."
            rows={4}
            className="w-full p-4 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm text-slate-700 transition-all resize-none"
          />
        </div>

        {/* Suggestion Chips */}
        <div className="space-y-2">
          <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider">Suggested Queries</p>
          <div className="flex flex-wrap gap-2">
            {SUGGESTIONS.map((suggestion, idx) => (
              <button
                key={idx}
                onClick={() => handleChipClick(suggestion)}
                className="px-3 py-1.5 text-xs font-medium text-slate-600 bg-slate-50 border border-border rounded-full hover:bg-blue-50 hover:text-primary hover:border-primary/30 transition-all"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>

        {/* Submit Action Button */}
        <div>
          <button
            onClick={handleGenerateAudience}
            disabled={loading}
            className="w-full sm:w-auto px-6 py-2.5 bg-primary text-white font-medium text-sm rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            {loading ? 'Analyzing audience...' : 'Generate Audience'}
          </button>
        </div>
      </div>

      {/* Error Banners */}
      {error && (
        <div className="bg-red-50 text-red-700 p-4 rounded-lg border border-red-200 text-sm font-medium">
          Error: {error}
        </div>
      )}

      {/* Results Display */}
      {loading && (
        <div className="p-12 text-center text-slate-500 font-medium">
          Analyzing audience...
        </div>
      )}

      {!loading && queryData && (
        <div className="space-y-6">
          {/* Detected Filter Conditions Panel */}
          <div className="bg-white p-6 rounded-xl border border-border shadow-sm space-y-4">
            <div>
              <h3 className="text-lg font-bold text-slate-800">Detected Conditions</h3>
              <p className="text-xs text-slate-400 mt-0.5">Parsed rules executed on customer record values.</p>
            </div>
            
            <div className="flex flex-wrap gap-3">
              {queryData.query?.conditions?.map((cond, idx) => (
                <div 
                  key={idx} 
                  className="flex items-center space-x-1.5 bg-blue-50 text-primary border border-primary/20 px-3 py-1.5 rounded-lg text-sm font-semibold"
                >
                  <span>{cond.field}</span>
                  <span className="font-mono text-xs px-1 bg-white border border-primary/10 rounded">{cond.operator}</span>
                  <span>{cond.value}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Matched Customer Table Section */}
          <div className="space-y-4">
            <div>
              <h3 className="text-xl font-bold text-slate-800">Matched Customers: {queryData.count}</h3>
            </div>

            <div className="bg-white rounded-xl border border-border shadow-sm overflow-hidden">
              {queryData.customers.length === 0 ? (
                <div className="p-12 text-center text-slate-500 text-sm font-medium">
                  No customers matched the generated conditions.
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse text-sm">
                    <thead>
                      <tr className="bg-slate-50 text-slate-500 border-b border-border text-xs font-semibold uppercase tracking-wider">
                        <th className="px-6 py-4">Name</th>
                        <th className="px-6 py-4">Email</th>
                        <th className="px-6 py-4">City</th>
                        <th className="px-6 py-4 text-right">Total Spend</th>
                        <th className="px-6 py-4 text-right">Total Orders</th>
                        <th className="px-6 py-4">Customer Type</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-border text-slate-700">
                      {queryData.customers.map((c) => (
                        <tr key={c.CustomerID} className="hover:bg-slate-50/50 transition-colors">
                          <td className="px-6 py-4 font-semibold text-slate-900">{c.Name}</td>
                          <td className="px-6 py-4">{c.Email}</td>
                          <td className="px-6 py-4">{c.City}</td>
                          <td className="px-6 py-4 text-right font-medium">₹{Number(c.TotalSpend).toLocaleString()}</td>
                          <td className="px-6 py-4 text-right">{c.TotalOrders}</td>
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
          </div>
        </div>
      )}
    </div>
  );
};

export default AICopilot;
