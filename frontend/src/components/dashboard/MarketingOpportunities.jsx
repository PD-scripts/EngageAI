import React from 'react';
import coffeeLatteArt from '../../assets/coffee_latte_art.png';
import icedCoffee from '../../assets/iced_coffee.png';
import coffeeCupTop from '../../assets/coffee_cup_top.png';

const MarketingOpportunities = ({ onNavigate }) => {
  const opportunities = [
    {
      id: 'birthday-opp',
      title: 'Birthday Opportunity',
      description: '18 customers have birthdays this week.',
      revenueLabel: 'Expected Revenue',
      revenue: '₹12,400',
      actionLabel: 'Suggested Campaign',
      actionValue: 'Birthday Rewards Campaign',
      image: coffeeLatteArt,
      path: '/campaigns',
      state: { audience: 'Birthday Customers', template: 'Birthday Promo' }
    },
    {
      id: 'weather-opp',
      title: 'Weather Opportunity',
      description: 'Delhi temperature expected to reach 41°C.',
      promoteLabel: 'Promote',
      promoteTags: ['Cold Brew', 'Iced Latte'],
      revenueLabel: 'Expected Revenue',
      revenue: '₹18,000',
      image: icedCoffee,
      path: '/campaigns',
      state: { audience: 'Delhi Customers', template: 'Cold Brew Promo' }
    },
    {
      id: 'health-opp',
      title: 'Customer Health Opportunity',
      description: '42 customers are at risk of churn.',
      actionLabel: 'Suggested Campaign',
      actionValue: 'Win-back Coffee Campaign',
      revenueLabel: 'Potential Recovery',
      revenue: '₹24,600',
      image: coffeeCupTop,
      path: '/campaigns',
      state: { audience: 'Inactive Customers', template: 'Winback Promo' }
    }
  ];

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
