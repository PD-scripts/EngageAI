import React from 'react';
import { Send, CheckCircle2 } from 'lucide-react';

const CampaignLeaderboard = ({ leaderboard }) => {
  const formatCurrency = (val) => {
    if (!val) return '₹0';
    return `₹${val.toLocaleString('en-IN')}`;
  };

  return (
    <div className="w-full rounded-2xl border border-[#B08D57]/15 bg-gradient-to-br from-[#161619] to-[#0B0B0D] p-6 lg:p-8 shadow-xl h-full flex flex-col justify-between">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#B08D57]/10 pb-3">
          <h3 className="text-md font-serif text-[#F5F1EA] tracking-wide">
            Top Performing Campaigns
          </h3>
          <span className="text-[9px] font-mono text-[#B08D57]/60 tracking-widest uppercase">
            Sorted by ROI
          </span>
        </div>

        {/* Table Container */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs text-[#F5F1EA]/85">
            <thead>
              <tr className="border-b border-[#B08D57]/10 text-[#B08D57]/60 text-[9.5px] font-mono uppercase tracking-widest">
                <th className="pb-3 font-semibold pr-4">Campaign</th>
                <th className="pb-3 font-semibold pr-4">Audience</th>
                <th className="pb-3 font-semibold pr-4">Channel</th>
                <th className="pb-3 font-semibold text-right pr-4">Revenue</th>
                <th className="pb-3 font-semibold text-right pr-4">ROI</th>
                <th className="pb-3 font-semibold text-center">Status</th>
              </tr>
            </thead>
            <tbody>
              {leaderboard && leaderboard.length > 0 ? (
                leaderboard.map((camp, idx) => (
                  <tr 
                    key={camp.id || idx}
                    className="border-b border-[#B08D57]/5 hover:bg-[#B08D57]/5 transition-colors duration-200"
                  >
                    <td className="py-3.5 font-medium pr-4 max-w-[130px] lg:max-w-[180px] truncate">
                      {camp.title || camp.campaignName}
                    </td>
                    <td className="py-3.5 text-gray-400 pr-4">
                      {camp.audienceName}
                    </td>
                    <td className="py-3.5 pr-4">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[9px] font-mono bg-[#0B0B0D] border border-[#B08D57]/20 text-[#B08D57]/80">
                        {camp.channel}
                      </span>
                    </td>
                    <td className="py-3.5 text-right font-semibold font-mono pr-4">
                      {formatCurrency(camp.revenueGenerated)}
                    </td>
                    <td className="py-3.5 text-right pr-4">
                      <span className="font-mono font-bold text-emerald-400">
                        {camp.roi ? `${camp.roi.toFixed(2)}x` : '0.00x'}
                      </span>
                    </td>
                    <td className="py-3.5 text-center">
                      <span className={`inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full text-[9px] font-bold ${
                        camp.status === 'Sent' 
                          ? 'bg-emerald-950/80 text-emerald-400 border border-emerald-900/50' 
                          : 'bg-zinc-800 text-zinc-400 border border-zinc-700/50'
                      }`}>
                        {camp.status === 'Sent' ? (
                          <>
                            <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400" />
                            <span>Sent</span>
                          </>
                        ) : (
                          <>
                            <Send className="w-2.5 h-2.5 text-zinc-400" />
                            <span>Draft</span>
                          </>
                        )}
                      </span>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center py-6 text-gray-500 font-medium">
                    No active campaign data found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CampaignLeaderboard;
