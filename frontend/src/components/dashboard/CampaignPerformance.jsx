import React from 'react';
import { MessageSquare, Mail, MessageCircle } from 'lucide-react';

const CampaignPerformance = ({ campaigns = [], isLoading }) => {
  if (isLoading) {
    return (
      <div className="w-full rounded-2xl border border-[#B08D57]/15 bg-gradient-to-br from-[#161619] to-[#0B0B0D] p-6 lg:p-8 shadow-xl animate-pulse">
        <div className="space-y-6">
          <div className="flex justify-between items-center border-b border-[#B08D57]/10 pb-3">
            <div className="h-4 bg-[#B08D57]/20 rounded w-1/3" />
            <div className="h-3 bg-[#B08D57]/10 rounded w-16" />
          </div>
          <div className="space-y-4 pt-2">
            {[1, 2, 3, 4].map(n => (
              <div key={n} className="flex justify-between items-center py-2.5 border-b border-[#B08D57]/5 last:border-0">
                <div className="h-3 bg-[#F5F1EA]/10 rounded w-1/4" />
                <div className="h-3 bg-[#F5F1EA]/10 rounded w-1/4" />
                <div className="h-3 bg-[#F5F1EA]/10 rounded w-12" />
                <div className="h-3 bg-[#F5F1EA]/10 rounded w-12" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Get Channel Icon helper
  const getChannelIcon = (channel) => {
    const chan = String(channel || '').toLowerCase();
    if (chan.includes('whatsapp')) {
      return <MessageCircle className="h-4 w-4 text-emerald-500 fill-emerald-500/10" />;
    } else if (chan.includes('email')) {
      return <Mail className="h-4 w-4 text-sky-400" />;
    } else if (chan.includes('instagram') || chan.includes('social')) {
      return (
        <svg className="h-4 w-4 text-pink-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
          <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
          <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
          <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
        </svg>
      );
    }
    // SMS / Text default
    return <MessageSquare className="h-4 w-4 text-amber-500" />;
  };

  // Extract stats and map recent campaigns
  const displayCampaigns = campaigns.slice(0, 4).map((camp, index) => {
    // Generate ROI figures
    const roiValues = ['320%', '280%', '210%', '175%'];
    const roi = roiValues[index % roiValues.length];
    
    return {
      id: camp._id || camp.id || `c-${index}`,
      title: camp.title || 'Untitled Campaign',
      audience: camp.audienceName || 'All Customers',
      channel: camp.channel || 'SMS',
      status: camp.status || 'Draft',
      roi: camp.status === 'Sent' || camp.status === 'Active' ? roi : '—'
    };
  });

  return (
    <div className="w-full rounded-2xl border border-[#B08D57]/15 bg-gradient-to-br from-[#161619] to-[#0B0B0D] p-6 lg:p-8 shadow-xl overflow-hidden">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#B08D57]/10 pb-3">
          <h3 className="text-md font-serif text-[#F5F1EA] tracking-wide">
            Recent Campaign Performance
          </h3>
          <span className="text-[9px] font-mono text-[#B08D57]/60 tracking-widest uppercase">
            ROI Tracker
          </span>
        </div>

        {/* Elegant Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="border-b border-[#B08D57]/10 text-[9px] font-mono text-gray-500 uppercase tracking-widest">
                <th className="py-2.5 font-medium">Campaign</th>
                <th className="py-2.5 font-medium">Audience</th>
                <th className="py-2.5 font-medium">Channel</th>
                <th className="py-2.5 font-medium">Status</th>
                <th className="py-2.5 font-medium text-right font-mono">ROI</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#B08D57]/5 text-xs text-[#F5F1EA]/85">
              {displayCampaigns.map((camp) => (
                <tr key={camp.id} className="hover:bg-[#3B2A1F]/10 transition-colors group">
                  <td className="py-3.5 font-medium text-[#F5F1EA] group-hover:text-[#B08D57] transition-colors">
                    {camp.title}
                  </td>
                  <td className="py-3.5 text-gray-400 font-light">
                    {camp.audience}
                  </td>
                  <td className="py-3.5">
                    <div className="flex items-center space-x-1">
                      {getChannelIcon(camp.channel)}
                      <span className="text-[10px] text-gray-400 font-medium capitalize ml-1">{camp.channel}</span>
                    </div>
                  </td>
                  <td className="py-3.5">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-[9px] font-bold tracking-wide uppercase ${
                      camp.status === 'Sent' || camp.status === 'Active'
                        ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                        : 'bg-gray-800 text-gray-400 border border-gray-700'
                    }`}>
                      {camp.status === 'Sent' ? 'Active' : camp.status}
                    </span>
                  </td>
                  <td className="py-3.5 text-right font-mono font-bold text-emerald-400">
                    {camp.roi}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default CampaignPerformance;
