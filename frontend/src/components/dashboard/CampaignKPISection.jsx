import React from 'react';
import { Award, Zap, DollarSign, BarChart3 } from 'lucide-react';

const CampaignKPISection = ({ kpis }) => {
  const { bestCampaign, bestCampaignROI, bestChannel, revenueGenerated, averageROI } = kpis || {};

  const formatCurrency = (val) => {
    if (!val) return '₹0';
    if (val >= 100000) {
      return `₹${(val / 100000).toFixed(2)}L`;
    }
    return `₹${val.toLocaleString('en-IN')}`;
  };

  const kpiData = [
    {
      title: 'Best Campaign',
      value: bestCampaign || 'N/A',
      subtext: bestCampaignROI ? `${bestCampaignROI.toFixed(1)}x ROI` : 'N/A',
      icon: <Award className="w-5 h-5 text-[#B08D57]" />,
      glowColor: 'rgba(176, 141, 87, 0.15)'
    },
    {
      title: 'Best Channel',
      value: bestChannel || 'N/A',
      subtext: 'Highest conversion rate',
      icon: <Zap className="w-5 h-5 text-emerald-500" />,
      glowColor: 'rgba(16, 185, 129, 0.1)'
    },
    {
      title: 'Total Revenue Generated',
      value: formatCurrency(revenueGenerated),
      subtext: 'Across all campaigns',
      icon: <DollarSign className="w-5 h-5 text-amber-500" />,
      glowColor: 'rgba(245, 158, 11, 0.1)'
    },
    {
      title: 'Average Campaign ROI',
      value: averageROI ? `${averageROI.toFixed(2)}x` : '0.0x',
      subtext: 'Average return multipliers',
      icon: <BarChart3 className="w-5 h-5 text-indigo-400" />,
      glowColor: 'rgba(99, 102, 241, 0.1)'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {kpiData.map((kpi, idx) => (
        <div 
          key={idx}
          className="relative w-full rounded-2xl border border-[#B08D57]/15 bg-gradient-to-br from-[#161619] to-[#0B0B0D] p-5 shadow-xl overflow-hidden hover:border-[#B08D57]/30 transition-all duration-300 group"
        >
          {/* Subtle Radial Glow */}
          <div 
            className="absolute -top-10 -right-10 w-24 h-24 rounded-full blur-2xl transition-all duration-500 group-hover:scale-125 pointer-events-none"
            style={{ backgroundColor: kpi.glowColor }}
          />

          <div className="flex items-start justify-between">
            <div className="space-y-1.5 flex-1">
              <span className="text-[9px] font-mono text-[#B08D57]/60 tracking-widest uppercase block">
                {kpi.title}
              </span>
              <h3 className="text-lg lg:text-xl font-serif text-[#F5F1EA] tracking-tight truncate max-w-[180px] lg:max-w-none mt-1 group-hover:text-white transition-colors">
                {kpi.value}
              </h3>
              <span className="text-xs text-[#F5F1EA]/60 font-sans block pt-0.5">
                {kpi.subtext}
              </span>
            </div>
            <div className="p-2.5 rounded-lg bg-[#0B0B0D] border border-[#B08D57]/10 group-hover:border-[#B08D57]/30 transition-all flex-shrink-0">
              {kpi.icon}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default CampaignKPISection;
