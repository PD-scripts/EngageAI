import React from 'react';
import { Users, MailCheck, Eye, ShieldAlert, ShoppingBag } from 'lucide-react';

const CampaignFunnel = ({ campaign }) => {
  if (!campaign) {
    return (
      <div className="w-full rounded-2xl border border-[#B08D57]/15 bg-gradient-to-br from-[#161619] to-[#0B0B0D] p-6 lg:p-8 shadow-xl flex items-center justify-center min-h-[350px]">
        <p className="text-gray-500 text-sm font-medium">Select a campaign to view the conversion funnel.</p>
      </div>
    );
  }

  const sent = campaign.sent || 0;
  const delivered = campaign.delivered || 0;
  const opened = campaign.opened || 0;
  const clicked = campaign.clicked || 0;
  const purchased = campaign.purchases !== undefined ? campaign.purchases : (campaign.purchased || 0);
  const revenue = campaign.revenueGenerated || 0;

  // Rates calculations
  const deliveryRate = sent > 0 ? (delivered / sent) * 100 : 0;
  const openRate = delivered > 0 ? (opened / delivered) * 100 : 0;
  const clickRate = opened > 0 ? (clicked / opened) * 100 : 0;
  const purchaseRate = clicked > 0 ? (purchased / clicked) * 100 : 0;

  const stages = [
    {
      label: 'Audience Sent',
      value: sent.toLocaleString('en-IN'),
      pct: 100,
      icon: <Users className="w-4 h-4 text-[#B08D57]" />,
      barColor: 'bg-[#B08D57]'
    },
    {
      label: 'Delivered',
      value: delivered.toLocaleString('en-IN'),
      pct: sent > 0 ? (delivered / sent) * 100 : 0,
      transitionLabel: `${deliveryRate.toFixed(1)}% delivery`,
      icon: <MailCheck className="w-4 h-4 text-emerald-500" />,
      barColor: 'bg-emerald-600'
    },
    {
      label: 'Opened',
      value: opened.toLocaleString('en-IN'),
      pct: sent > 0 ? (opened / sent) * 100 : 0,
      transitionLabel: `${openRate.toFixed(1)}% open rate`,
      icon: <Eye className="w-4 h-4 text-teal-400" />,
      barColor: 'bg-teal-500'
    },
    {
      label: 'Clicked',
      value: clicked.toLocaleString('en-IN'),
      pct: sent > 0 ? (clicked / sent) * 100 : 0,
      transitionLabel: `${clickRate.toFixed(1)}% click rate (CTR)`,
      icon: <ShieldAlert className="w-4 h-4 text-amber-500" />,
      barColor: 'bg-amber-500'
    },
    {
      label: 'Purchased',
      value: purchased.toLocaleString('en-IN'),
      pct: sent > 0 ? (purchased / sent) * 100 : 0,
      transitionLabel: `${purchaseRate.toFixed(1)}% conversion`,
      icon: <ShoppingBag className="w-4 h-4 text-rose-500" />,
      barColor: 'bg-rose-500'
    }
  ];

  return (
    <div className="w-full rounded-2xl border border-[#B08D57]/15 bg-gradient-to-br from-[#161619] to-[#0B0B0D] p-6 lg:p-8 shadow-xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between border-b border-[#B08D57]/10 pb-3 gap-2">
          <div>
            <h3 className="text-md font-serif text-[#F5F1EA] tracking-wide">
              Conversion Funnel
            </h3>
            <span className="text-[10px] text-gray-400 font-sans block pt-0.5 max-w-[200px] truncate">
              {campaign.title || campaign.campaignName}
            </span>
          </div>
          <div className="flex items-center space-x-2 font-mono text-[9px] text-[#B08D57]/80">
            <span className="px-2 py-0.5 bg-[#0B0B0D] border border-[#B08D57]/20 rounded-md">
              ROI: {campaign.roi ? `${campaign.roi.toFixed(2)}x` : '0.00x'}
            </span>
            <span className="px-2 py-0.5 bg-[#0B0B0D] border border-[#B08D57]/20 rounded-md text-emerald-400">
              Revenue: ₹{revenue.toLocaleString('en-IN')}
            </span>
          </div>
        </div>

        {/* Funnel Layout */}
        <div className="space-y-3 pt-2">
          {stages.map((stage, idx) => {
            const widthPct = Math.max(stage.pct, 4); // Minimum width for visibility
            return (
              <div key={idx} className="space-y-2">
                {/* Transition conversion percentage pill */}
                {idx > 0 && (
                  <div className="flex justify-center -my-1">
                    <span className="text-[9px] font-mono font-bold bg-[#0B0B0D] border border-[#B08D57]/15 px-2.5 py-0.5 rounded-full text-[#B08D57] shadow-lg">
                      {stage.transitionLabel}
                    </span>
                  </div>
                )}

                {/* Stage Row */}
                <div className="flex items-center space-x-4">
                  {/* Left Metadata */}
                  <div className="w-28 sm:w-32 flex-shrink-0 flex items-center space-x-2">
                    <div className="p-1.5 rounded-md bg-[#0B0B0D] border border-[#B08D57]/10 flex-shrink-0">
                      {stage.icon}
                    </div>
                    <span className="text-xs text-[#F5F1EA]/85 font-medium tracking-wide truncate">
                      {stage.label}
                    </span>
                  </div>

                  {/* Horizontal Bar Visualizer */}
                  <div className="flex-1 h-8 bg-[#0B0B0D] rounded-lg overflow-hidden border border-[#B08D57]/5 flex items-center relative group">
                    <div 
                      className={`h-full ${stage.barColor} opacity-75 group-hover:opacity-90 rounded-r-md transition-all duration-1000 ease-out`}
                      style={{ width: `${widthPct}%` }}
                    />
                    <div className="absolute left-3 flex items-center space-x-2 pointer-events-none z-10">
                      <span className="font-mono text-xs font-bold text-[#F5F1EA]">
                        {stage.value}
                      </span>
                      {idx > 0 && (
                        <span className="text-[9.5px] font-mono text-gray-400">
                          ({stage.pct.toFixed(1)}%)
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CampaignFunnel;
