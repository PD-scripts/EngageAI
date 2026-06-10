import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const API_BASE_URL = 'http://localhost:5000/api';

const Dashboard = () => {
  const [campaigns, setCampaigns] = useState([]);
  const [audiences, setAudiences] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [campRes, audRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/campaigns`),
          axios.get(`${API_BASE_URL}/campaigns/audiences`)
        ]);
        setCampaigns(campRes.data);
        setAudiences(audRes.data);
      } catch (err) {
        console.error('Error fetching dashboard stats:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Compute live statistics
  const totalCampaigns = campaigns.length;
  
  // Find "All Customers" size from audiences list, or fallback to 200
  const allCustObj = audiences.find(a => a.name === 'All Customers');
  const totalCustomers = allCustObj ? allCustObj.size : 200;

  // Aggregate stats
  const vipCustObj = audiences.find(a => a.name === 'High Value Customers');
  const vipCount = vipCustObj ? vipCustObj.size : 71;

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Header Panel */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-border pb-5">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">Workspace Overview</h2>
          <p className="text-slate-500 mt-1">Review live audience metrics, recent AI drafts, and strategic marketing performance.</p>
        </div>
        <div className="mt-4 md:mt-0">
          <Link
            to="/campaigns"
            className="px-5 py-2.5 bg-primary hover:bg-blue-700 text-white font-semibold text-sm rounded-lg shadow-sm transition duration-150 flex items-center space-x-2 w-max"
          >
            <span>✨ Create New Campaign</span>
          </Link>
        </div>
      </div>

      {/* Grid of Key Performance Indicators (KPIs) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* KPI 1 */}
        <div className="bg-white p-6 rounded-2xl border border-border shadow-sm flex items-center justify-between hover:shadow-md transition-all duration-200">
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">Total Active Shoppers</span>
            <h3 className="text-3xl font-extrabold text-slate-800">{loading ? '...' : totalCustomers.toLocaleString()}</h3>
            <div className="flex items-center space-x-1 text-emerald-600 text-xs font-bold bg-emerald-50 px-2 py-0.5 rounded-full w-max">
              <span>↑ 8.2%</span>
              <span className="text-slate-400 font-normal">vs last month</span>
            </div>
          </div>
          <div className="p-4 bg-blue-50 text-primary rounded-xl text-2xl font-bold">👥</div>
        </div>

        {/* KPI 2 */}
        <div className="bg-white p-6 rounded-2xl border border-border shadow-sm flex items-center justify-between hover:shadow-md transition-all duration-200">
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">AI Strategy Drafts</span>
            <h3 className="text-3xl font-extrabold text-slate-800">{loading ? '...' : totalCampaigns}</h3>
            <div className="flex items-center space-x-1 text-slate-500 text-xs font-bold bg-slate-100 px-2 py-0.5 rounded-full w-max">
              <span>Saved in MongoDB</span>
            </div>
          </div>
          <div className="p-4 bg-purple-50 text-purple-600 rounded-xl text-2xl font-bold">📋</div>
        </div>

        {/* KPI 3 */}
        <div className="bg-white p-6 rounded-2xl border border-border shadow-sm flex items-center justify-between hover:shadow-md transition-all duration-200">
          <div className="space-y-2">
            <span className="text-xs font-bold text-slate-400 uppercase tracking-wider">VIP Cohort Segment</span>
            <h3 className="text-3xl font-extrabold text-slate-800">{loading ? '...' : vipCount}</h3>
            <div className="flex items-center space-x-1 text-indigo-600 text-xs font-bold bg-indigo-50 px-2 py-0.5 rounded-full w-max">
              <span>₹10K+ Spend Limit</span>
            </div>
          </div>
          <div className="p-4 bg-emerald-50 text-emerald-600 rounded-xl text-2xl font-bold">👑</div>
        </div>
      </div>

      {/* Main Content Splits */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Left Column (2/3 width): Recent Campaigns list */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-6 rounded-2xl border border-border shadow-sm space-y-4">
            <div className="flex items-center justify-between border-b border-border pb-3">
              <div>
                <h3 className="text-lg font-bold text-slate-800">Recent Strategy Drafts</h3>
                <p className="text-xs text-slate-400 mt-0.5">The latest campaigns created by the AI strategists.</p>
              </div>
              <Link to="/campaigns" className="text-xs font-bold text-primary hover:underline">
                View Workspace →
              </Link>
            </div>

            {loading ? (
              <div className="text-center py-10 text-slate-400 text-sm">
                Loading campaigns...
              </div>
            ) : campaigns.length === 0 ? (
              <div className="text-center py-12 text-slate-400 text-sm space-y-2">
                <div className="text-4xl">🤖</div>
                <p className="font-semibold text-slate-600">No campaigns generated yet</p>
                <p className="text-xs max-w-xs mx-auto text-slate-400">
                  Head over to the Campaign Builder to write your first prompt request.
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {campaigns.slice(0, 3).map((camp) => (
                  <div key={camp.id} className="p-4 rounded-xl border border-border hover:border-primary/20 hover:bg-slate-50/20 transition-all flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                    <div className="space-y-1">
                      <h4 className="font-bold text-slate-800 text-sm">{camp.title}</h4>
                      <div className="flex flex-wrap gap-2 items-center text-xs">
                        <span className="text-slate-500 font-semibold">{camp.audienceName}</span>
                        <span className="text-slate-300">•</span>
                        <span className="text-slate-400">{camp.goal}</span>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3.5">
                      <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${
                        camp.channel === 'WhatsApp' ? 'bg-emerald-100 text-emerald-800' :
                        camp.channel === 'Email' ? 'bg-blue-100 text-blue-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {camp.channel}
                      </span>
                      <span className={`px-2 py-0.5 text-xs font-black rounded-lg border ${
                        camp.qualityScore >= 80 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                        'bg-amber-50 text-amber-700 border-amber-200'
                      }`}>
                        Score: {camp.qualityScore}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Right Column (1/3 width): AI Assistant Quick Advice & Checklist */}
        <div className="lg:col-span-1 space-y-6">
          
          {/* Quick strategy advice card */}
          <div className="bg-gradient-to-br from-indigo-900 to-blue-950 p-6 rounded-2xl text-white shadow-md space-y-4">
            <div className="flex items-center space-x-2">
              <span className="text-xl">💡</span>
              <h3 className="text-sm font-bold uppercase tracking-wider opacity-90">Strategist Recommendation</h3>
            </div>
            
            <p className="text-xs text-indigo-200 leading-relaxed font-medium">
              We identified that the <strong className="text-white">High Value Customers</strong> cohort represents over 35% of total shopper spends but only 10% of total users. Prioritize WhatsApp reward loyalty campaigns to maximize repeat order frequencies.
            </p>

            <div className="border-t border-white/10 pt-4 flex justify-between items-center text-xs font-bold">
              <span className="text-indigo-300">Audience Impact</span>
              <span className="text-emerald-400">High Return</span>
            </div>
          </div>

          {/* Marketing checklist */}
          <div className="bg-white p-6 rounded-2xl border border-border shadow-sm space-y-4">
            <h3 className="text-md font-bold text-slate-800 border-b border-border pb-2 flex items-center space-x-2">
              <span>📋</span>
              <span>Marketing Best Practices</span>
            </h3>
            
            <ul className="space-y-3 text-xs text-slate-600 font-medium">
              <li className="flex items-start space-x-2">
                <span className="text-emerald-500">✔</span>
                <span>Keep WhatsApp messages under 250 characters with conversational tone.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-emerald-500">✔</span>
                <span>Use urgent call-to-actions (e.g. valid for 48h) for inactive customer reactivations.</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-emerald-500">✔</span>
                <span>Run detailed professional copy templates with clean offers for Email channels.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
