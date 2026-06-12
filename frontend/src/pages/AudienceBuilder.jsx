import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, HelpCircle, ArrowRight, UserCheck, CheckCircle2, RefreshCw } from 'lucide-react';

const API_BASE_URL = 'http://localhost:5000/api';

const SUGGESTIONS = [
  'Find customers inactive for 90 days',
  'Find high value customers from Mumbai',
  'Find customers spending more than 10000',
  'Find customers with more than 5 orders',
  'Find customers from Delhi who spent more than 8000'
];

const AudienceBuilder = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // State Management
  const [prompt, setPrompt] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [queryData, setQueryData] = useState(null);

  // Check if routed from dashboard with pre-filled prompt
  useEffect(() => {
    if (location.state?.prompt) {
      setPrompt(location.state.prompt);
      // Automatically run the query for the user
      triggerGenerateAudience(location.state.prompt);
    }
  }, [location]);

  const handleChipClick = (suggestion) => {
    setPrompt(suggestion);
    setError(null);
  };

  const triggerGenerateAudience = async (targetPrompt) => {
    setLoading(true);
    setError(null);
    setQueryData(null);

    try {
      const response = await axios.post(`${API_BASE_URL}/ai/audience-builder`, {
        prompt: targetPrompt
      });
      setQueryData(response.data);
    } catch (err) {
      console.error('Error generating audience:', err);
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError("Unable to understand audience request. Please ensure the backend is running.");
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = () => {
    if (!prompt.trim()) {
      setError("Please describe the target audience segment first.");
      return;
    }
    triggerGenerateAudience(prompt.trim());
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-16">
      
      {/* Centered AI Prompter Header */}
      <div className="text-center space-y-2 max-w-2xl mx-auto">
        <div className="inline-flex items-center space-x-1.5 bg-primary/10 text-primary border border-primary/20 px-3.5 py-1.5 rounded-full text-xs font-black uppercase tracking-widest">
          <Sparkles className="h-3.5 w-3.5 ai-glow text-primary" />
          <span>Core AI Engine</span>
        </div>
        <h2 className="text-3xl font-black text-text-main tracking-tight">AI Audience Constructor</h2>
        <p className="text-text-muted text-xs font-medium">
          Express the shopper group you wish to target using natural language instructions. ENGAGEAI compiles raw queries instantly.
        </p>
      </div>

      {/* Prompter Container */}
      <div className="bg-white p-6 rounded-2xl border border-border shadow-xs space-y-6">
        
        {/* prompt textarea */}
        <div className="space-y-2">
          <label className="text-xs font-bold text-text-muted uppercase tracking-wider block">Describe Segment Target</label>
          <div className="relative">
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="E.g., Find VIP customers from Mumbai with total spend greater than 10000..."
              rows={3}
              className="w-full p-4 pr-12 border border-border rounded-xl bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-sm text-text-main font-semibold leading-relaxed transition-all resize-none shadow-inner"
            />
            <button
              onClick={handleSubmit}
              disabled={loading}
              className="absolute right-3.5 bottom-3.5 p-2 bg-primary hover:bg-primary/95 text-white rounded-lg transition-colors cursor-pointer shadow-xs disabled:opacity-50"
            >
              {loading ? (
                <RefreshCw className="h-4.5 w-4.5 animate-spin" />
              ) : (
                <ArrowRight className="h-4.5 w-4.5" />
              )}
            </button>
          </div>
        </div>

        {/* suggestion chips */}
        <div className="space-y-2.5">
          <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Suggested Targets</p>
          <div className="flex flex-wrap gap-2">
            {SUGGESTIONS.map((suggestion, idx) => (
              <button
                key={idx}
                onClick={() => handleChipClick(suggestion)}
                className="px-3.5 py-2 text-xs font-semibold text-text-muted bg-slate-50 border border-border rounded-full hover:bg-slate-100 hover:text-text-main transition-all cursor-pointer"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>

      </div>

      {/* Error alert */}
      {error && (
        <motion.div 
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-danger/5 text-danger p-4 rounded-xl border border-danger/10 text-xs font-bold"
        >
          {error}
        </motion.div>
      )}

      {/* Loading Skeletons */}
      {loading && (
        <div className="space-y-6">
          <div className="h-24 bg-white border border-border rounded-2xl animate-pulse" />
          <div className="h-64 bg-white border border-border rounded-2xl animate-pulse" />
        </div>
      )}

      {/* Results View */}
      <AnimatePresence>
        {!loading && queryData && (
          <motion.div 
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="space-y-6"
          >
            
            {/* Detected Conditions banner */}
            <div className="bg-white p-6 rounded-2xl border border-border shadow-xs space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-text-main uppercase tracking-wider">Detected Conditions</h3>
                  <p className="text-[10px] text-text-muted font-semibold mt-0.5">Filter matrices extracted by Groq Llama compiler.</p>
                </div>
                
                <span className="flex items-center space-x-1.5 text-xs font-bold text-success bg-success/5 px-3 py-1 rounded-full border border-success/10">
                  <CheckCircle2 className="h-4 w-4" />
                  <span>Validated Payload</span>
                </span>
              </div>

              <div className="flex flex-wrap gap-3">
                {queryData.query?.conditions?.map((cond, idx) => (
                  <div 
                    key={idx} 
                    className="flex items-center space-x-1.5 bg-slate-50 text-text-main border border-border px-3 py-1.5 rounded-lg text-xs font-bold"
                  >
                    <span className="text-primary font-black">{cond.field}</span>
                    <span className="font-mono text-[10px] px-1 bg-white border border-border rounded">{cond.operator}</span>
                    <span>{cond.value}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Matched Shoppers list */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-text-main tracking-tight">
                  Matched Customer Audience Segment (<span className="text-primary">{queryData.count}</span>)
                </h3>
                
                {queryData.count > 0 && (
                  <button
                    onClick={() => navigate('/campaigns', { 
                      state: { 
                        prefilledAudience: queryData.query?.conditions?.length > 0 ? queryData.query.conditions : [],
                        prefilledSize: queryData.count,
                        prompt: `Write a WhatsApp campaign for this audience to Increase Repeat Purchases`
                      } 
                    })}
                    className="px-3.5 py-1.5 bg-primary hover:bg-primary/95 text-white text-xs font-semibold rounded-lg shadow-xs transition-all flex items-center space-x-1 cursor-pointer"
                  >
                    <span>Draft Campaign for Segment</span>
                    <ArrowRight className="h-3.5 w-3.5" />
                  </button>
                )}
              </div>

              <div className="bg-white rounded-2xl border border-border shadow-xs overflow-hidden">
                {queryData.customers.length === 0 ? (
                  <div className="p-12 text-center text-xs text-text-muted font-bold">
                    No customers met the requested query parameters.
                  </div>
                ) : (
                  <div className="overflow-x-auto">
                    <table className="w-full text-left border-collapse text-xs">
                      <thead>
                        <tr className="bg-slate-50/70 text-text-muted border-b border-border font-bold uppercase tracking-wider">
                          <th className="px-6 py-4">Name</th>
                          <th className="px-6 py-4">Email</th>
                          <th className="px-6 py-4">Location</th>
                          <th className="px-6 py-4 text-right">Lifetime Spend</th>
                          <th className="px-6 py-4 text-right">Orders</th>
                          <th className="px-6 py-4">Tier Group</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border text-text-main font-semibold">
                        {queryData.customers.slice(0, 10).map((c) => (
                          <tr key={c.CustomerID} className="hover:bg-slate-50/50 transition-colors duration-150">
                            <td className="px-6 py-4 flex items-center space-x-2.5">
                              <div className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold text-[10px]">
                                {c.Name.charAt(0)}
                              </div>
                              <span className="font-bold text-text-main">{c.Name}</span>
                            </td>
                            <td className="px-6 py-4 text-text-muted">{c.Email}</td>
                            <td className="px-6 py-4 text-text-muted">{c.City}</td>
                            <td className="px-6 py-4 text-right font-bold text-text-main">₹{Number(c.TotalSpend).toLocaleString()}</td>
                            <td className="px-6 py-4 text-right text-text-muted">{c.TotalOrders}</td>
                            <td className="px-6 py-4">
                              <span className={`px-2 py-0.5 text-[9px] font-black rounded-full uppercase border ${
                                c.CustomerType === 'VIP' ? 'bg-primary/10 text-primary border-primary/20' :
                                c.CustomerType === 'Regular' ? 'bg-slate-100 text-slate-700 border-slate-200' :
                                'bg-success/10 text-success border-success/20'
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
                {queryData.customers.length > 10 && (
                  <p className="text-[10px] text-text-muted text-center py-3 border-t border-border font-bold bg-slate-50/20">
                    Showing top 10 matching shopper records.
                  </p>
                )}
              </div>
            </div>

          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
};

export default AudienceBuilder;
