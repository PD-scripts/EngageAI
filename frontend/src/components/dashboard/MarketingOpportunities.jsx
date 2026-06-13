import React from 'react';
import coffeeLatteArt from '../../assets/coffee_latte_art.png';
import icedCoffee from '../../assets/iced_coffee.png';
import coffeeCupTop from '../../assets/coffee_cup_top.png';

const MarketingOpportunities = ({ opportunities: propOpportunities, onNavigate }) => {
  const opportunities = (propOpportunities && propOpportunities.length > 0)
    ? propOpportunities.slice(0, 3).map((rec, index) => {
        let image = coffeeLatteArt;
        if (rec.type?.includes('HEALTH') || rec.type?.includes('CHURN')) {
          image = coffeeCupTop;
        } else if (rec.type?.includes('REVENUE') || rec.type?.includes('CHANNEL') || rec.type?.includes('CITY')) {
          image = icedCoffee;
        }
        
        let audienceName = 'All Customers';
        if (rec.type?.includes('CHURN') || rec.type?.includes('HEALTH_AT_RISK')) {
          audienceName = 'Inactive Customers';
        } else if (rec.type?.includes('REVENUE')) {
          audienceName = 'High Value Customers';
        }

        let revenue = '₹15,000';
        if (rec.type?.includes('CHURN')) revenue = '₹18,500';
        else if (rec.type?.includes('REVENUE')) {
          const match = rec.description.match(/₹([\d.]+)L/);
          if (match) {
            revenue = `₹${match[1]}L`;
          } else {
            revenue = '₹24,600';
          }
        } else if (rec.type?.includes('BIRTHDAY') || rec.type?.includes('BIRTHDAY_WEEK')) {
          revenue = '₹12,400';
        }

        return {
          id: rec.id || `opp-${index}`,
          title: rec.title || 'Opportunity Alert',
          description: rec.description,
          actionLabel: 'Suggested Action',
          actionValue: rec.action || 'Launch Campaign',
          revenueLabel: rec.type?.includes('CHURN') || rec.type?.includes('HEALTH_AT_RISK') ? 'Potential Recovery' : 'Expected Revenue',
          revenue,
          image,
          path: rec.path || '/campaigns',
          state: rec.state || { prompt: `Draft a campaign targeting ${audienceName}` }
        };
      })
    : [];

  if (!opportunities || opportunities.length === 0) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-3 border-b border-[#B08D57]/20 pb-2">
          <h2 className="text-xl font-serif text-[#F5F1EA] tracking-wide">Today's Opportunities</h2>
          <span className="text-xs text-[#B08D57]/65 tracking-widest font-mono">/ CRITICAL ACTIONS</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {[1, 2, 3].map((n) => (
            <div 
              key={n}
              className="h-[360px] rounded-2xl border border-[#B08D57]/10 bg-gradient-to-b from-[#161619]/40 to-[#0B0B0D]/40 animate-pulse flex flex-col justify-end p-6"
            >
              <div className="space-y-3">
                <div className="h-4 w-1/3 bg-[#B08D57]/10 rounded" />
                <div className="h-6 w-3/4 bg-[#F5F1EA]/10 rounded" />
                <div className="h-3 w-5/6 bg-[#F5F1EA]/5 rounded" />
                <div className="h-3 w-4/6 bg-[#F5F1EA]/5 rounded" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 border-b border-[#B08D57]/20 pb-2">
        <h2 className="text-xl font-serif text-[#F5F1EA] tracking-wide">Today's Opportunities</h2>
        <span className="text-xs text-[#B08D57]/65 tracking-widest font-mono">/ CRITICAL ACTIONS</span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {opportunities.map((opp) => (
          <div 
            key={opp.id} 
            onClick={() => onNavigate && onNavigate(opp.path, { state: opp.state })}
            className="group relative h-[360px] rounded-2xl overflow-hidden border border-[#B08D57]/15 bg-gradient-to-b from-[#161619]/90 to-[#0B0B0D]/90 shadow-lg cursor-pointer hover:border-[#B08D57]/40 transition-all duration-300 flex flex-col justify-end p-6"
          >
            {/* Background Image Container */}
            <div className="absolute inset-0 z-0 overflow-hidden">
              <img 
                src={opp.image} 
                alt={opp.title} 
                className="w-full h-full object-cover opacity-30 filter brightness-[0.7] group-hover:scale-105 group-hover:opacity-45 transition-all duration-700 ease-out"
              />
              {/* Dark Vignette Overlays */}
              <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0D] via-[#0B0B0D]/60 to-transparent" />
            </div>

            {/* Content Container */}
            <div className="relative z-10 space-y-4">
              {/* Category Header */}
              <div className="inline-block px-2 py-0.5 rounded bg-[#B08D57]/10 border border-[#B08D57]/20 text-[9px] text-[#B08D57] font-bold uppercase tracking-widest">
                Opportunity
              </div>

              {/* Title & Description */}
              <div className="space-y-1">
                <h3 className="text-lg font-serif font-semibold text-[#F5F1EA] group-hover:text-[#B08D57] transition-colors">
                  {opp.title}
                </h3>
                <p className="text-xs text-[#F5F1EA]/70 leading-relaxed font-sans font-light">
                  {opp.description}
                </p>
              </div>

              {/* Specific Content for Weather Tags */}
              {opp.promoteTags && (
                <div className="flex flex-wrap gap-2 py-1">
                  {opp.promoteTags.map(tag => (
                    <span 
                      key={tag} 
                      className="px-2.5 py-1 rounded-full bg-[#3B2A1F]/80 border border-[#B08D57]/25 text-[10px] font-bold text-[#F5F1EA] tracking-wide"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              )}

              {/* Campaign / Action Info */}
              {opp.actionValue && (
                <div className="pt-2 border-t border-[#B08D57]/10">
                  <span className="text-[9px] text-[#B08D57]/60 uppercase tracking-widest font-mono block">
                    {opp.actionLabel}
                  </span>
                  <span className="text-xs font-semibold text-[#F5F1EA]">
                    {opp.actionValue}
                  </span>
                </div>
              )}

              {/* Revenue Detail */}
              <div className="pt-2 border-t border-[#B08D57]/10 flex items-baseline justify-between">
                <span className="text-[9px] text-[#B08D57]/60 uppercase tracking-widest font-mono">
                  {opp.revenueLabel}
                </span>
                <span className="text-lg font-serif font-extrabold text-[#F5F1EA]">
                  {opp.revenue}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MarketingOpportunities;
