import React from 'react';

const CustomerHealth = ({ customers = [] }) => {
  // Compute counts
  let champion = 0;
  let healthy = 0;
  let attention = 0;
  let atRisk = 0;

  customers.forEach(c => {
    const score = Number(c.healthScore || c.HealthScore || 0);
    if (score >= 90) champion++;
    else if (score >= 70) healthy++;
    else if (score >= 40) attention++;
    else atRisk++;
  });

  const total = customers.length || 1;
  const categories = [
    { name: 'Champion Customers', count: champion, color: 'bg-[#B08D57]' },
    { name: 'Healthy Customers', count: healthy, color: 'bg-emerald-600' },
    { name: 'Needs Attention', count: attention, color: 'bg-amber-600' },
    { name: 'At Risk Customers', count: atRisk, color: 'bg-rose-700' }
  ];

  return (
    <div className="w-full rounded-2xl border border-[#B08D57]/15 bg-gradient-to-br from-[#161619] to-[#0B0B0D] p-6 lg:p-8 shadow-xl">
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center space-x-3 border-b border-[#B08D57]/10 pb-3">
          <h3 className="text-md font-serif text-[#F5F1EA] tracking-wide">
            Customer Health Segmentations
          </h3>
          <span className="text-[9px] font-mono text-[#B08D57]/60 tracking-widest uppercase">
            Live Health Index
          </span>
        </div>

        {/* Progress Bars */}
        <div className="space-y-5">
          {categories.map((cat) => {
            const pct = Math.round((cat.count / total) * 100);
            return (
              <div key={cat.name} className="space-y-1.5 group">
                <div className="flex justify-between items-baseline text-xs">
                  <span className="text-[#F5F1EA]/85 font-medium tracking-wide">
                    {cat.name}
                  </span>
                  <div className="flex items-baseline space-x-1.5 font-mono">
                    <span className="text-[#F5F1EA] font-semibold">{cat.count}</span>
                    <span className="text-gray-500 text-[10px]">({pct}%)</span>
                  </div>
                </div>

                {/* Progress Bar Track */}
                <div className="h-1.5 w-full bg-[#0B0B0D]/90 rounded-full overflow-hidden border border-[#B08D57]/5">
                  <div 
                    className={`h-full ${cat.color} rounded-full transition-all duration-1000 ease-out`}
                    style={{ width: `${pct}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default CustomerHealth;
