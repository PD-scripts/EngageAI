import React, { useState, useEffect } from 'react';
import CampaignKPISection from './CampaignKPISection';
import CampaignLeaderboard from './CampaignLeaderboard';
import CampaignFunnel from './CampaignFunnel';
import { BarChart3, RefreshCw } from 'lucide-react';

const CampaignAnalyticsHub = ({ analyticsData, onRefresh, isLoading }) => {
  const { kpis, leaderboard, insights, campaigns = [] } = analyticsData || {};
  const [selectedCampaignId, setSelectedCampaignId] = useState('');

  // Auto-select the first campaign when campaigns load
  useEffect(() => {
    if (campaigns && campaigns.length > 0) {
      // Find the first sent campaign or fall back to the first campaign
      const firstSent = campaigns.find(c => c.status === 'Sent');
      if (firstSent) {
        setSelectedCampaignId(firstSent.id || firstSent._id?.toString());
      } else {
        setSelectedCampaignId(campaigns[0].id || campaigns[0]._id?.toString());
      }
    }
  }, [campaigns]);

  const selectedCampaign = campaigns.find(c => (c.id || c._id?.toString()) === selectedCampaignId);

  return (
    <div className="w-full space-y-8 py-6">
      {/* Title Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-[#B08D57]/10 pb-4">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-[#B08D57]/10 border border-[#B08D57]/20">
            <BarChart3 className="w-5 h-5 text-[#B08D57]" />
          </div>
          <div>
            <h2 className="text-xl font-serif text-[#F5F1EA] tracking-wide">
              Campaign Performance & Intelligence Hub
            </h2>
            <p className="text-xs text-gray-400 font-sans mt-0.5">
              Evaluate real-time channel ROI, conversion funnels, and AI budget recommendations.
            </p>
          </div>
        </div>

        <button
          onClick={onRefresh}
          disabled={isLoading}
          className="inline-flex items-center justify-center space-x-2 bg-gradient-to-r from-[#B08D57]/90 to-[#8C6D3F]/90 text-[#F5F1EA] hover:from-[#B08D57] hover:to-[#8C6D3F] border border-[#B08D57]/45 px-4 py-2 rounded-xl text-xs font-medium transition-all shadow-md active:scale-95 disabled:opacity-50 flex-shrink-0 cursor-pointer"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
          <span>{isLoading ? 'Syncing...' : 'Sync Analytics'}</span>
        </button>
      </div>

      {/* KPI Section */}
      <CampaignKPISection kpis={kpis} />

      {/* Main Grid: Leaderboard & Funnel */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left: Leaderboard */}
        <div className="lg:col-span-7">
          <CampaignLeaderboard leaderboard={leaderboard} />
        </div>

        {/* Right: Funnel Selector & Funnel */}
        <div className="lg:col-span-5 flex flex-col space-y-6">
          <div className="w-full bg-[#161619] border border-[#B08D57]/15 rounded-2xl p-4 flex items-center justify-between shadow-xl">
            <span className="text-[10px] font-mono text-[#B08D57]/80 uppercase tracking-widest font-bold">
              Select Funnel View
            </span>
            <select
              value={selectedCampaignId}
              onChange={(e) => setSelectedCampaignId(e.target.value)}
              className="bg-[#0B0B0D] border border-[#B08D57]/30 text-[#F5F1EA] text-xs rounded-lg px-3 py-1.5 focus:outline-none focus:border-[#B08D57] max-w-[200px] truncate cursor-pointer font-medium"
            >
              {campaigns && campaigns.length > 0 ? (
                campaigns.map((c) => (
                  <option key={c.id || c._id?.toString()} value={c.id || c._id?.toString()}>
                    {c.title || c.campaignName}
                  </option>
                ))
              ) : (
                <option value="">No campaigns available</option>
              )}
            </select>
          </div>

          <CampaignFunnel campaign={selectedCampaign} />
        </div>
      </div>
    </div>
  );
};

export default CampaignAnalyticsHub;
