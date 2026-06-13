import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapPin, TrendingUp, DollarSign, AlertTriangle, Star } from 'lucide-react';

const API_BASE_URL = 'http://localhost:5000/api';

const RegionalIntelligence = () => {
  const [highlights, setHighlights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCityAnalytics = async () => {
      try {
        const res = await axios.get(`${API_BASE_URL}/analytics/cities`);
        if (res.data && res.data.length > 0) {
          const cityData = res.data;

          let bestCity = 'Bangalore';
          let fastestCity = 'Pune';
          let highestRevCity = 'Delhi';
          let highestChurnCity = 'Mumbai';

          // Best performing (highest campaignEngagement)
          const sortedByEngagement = [...cityData].sort((a, b) => b.campaignEngagement - a.campaignEngagement);
          if (sortedByEngagement[0] && sortedByEngagement[0].campaignEngagement > 0) {
            bestCity = sortedByEngagement[0].city;
          } else {
            const sortedByCustomers = [...cityData].sort((a, b) => b.customers - a.customers);
            bestCity = sortedByCustomers[0]?.city || 'Bangalore';
          }

          // Highest revenue
          const sortedByRevenue = [...cityData].sort((a, b) => b.revenue - a.revenue);
          if (sortedByRevenue[0]) {
            highestRevCity = sortedByRevenue[0].city;
          }

          // Fastest growing: sorting by total number of customers
          const sortedByCustomers = [...cityData].sort((a, b) => b.customers - a.customers);
          if (sortedByCustomers[0]) {
            const found = sortedByCustomers.find(c => c.city !== highestRevCity);
            fastestCity = found ? found.city : sortedByCustomers[0].city;
          }

          // Highest churn (highest inactiveRate)
          const sortedByChurn = [...cityData].sort((a, b) => b.inactiveRate - a.inactiveRate);
          if (sortedByChurn[0]) {
            highestChurnCity = sortedByChurn[0].city;
          }

          setHighlights([
            {
              label: 'Best Performing City',
              city: bestCity,
              icon: Star,
              color: 'text-emerald-500',
              bgColor: 'bg-emerald-500/10'
            },
            {
              label: 'Fastest Growing City',
              city: fastestCity,
              icon: TrendingUp,
              color: 'text-amber-500',
              bgColor: 'bg-amber-500/10'
            },
            {
              label: 'Highest Revenue City',
              city: highestRevCity,
              icon: DollarSign,
              color: 'text-emerald-400',
              bgColor: 'bg-emerald-400/10'
            },
            {
              label: 'Highest Churn City',
              city: highestChurnCity,
              icon: AlertTriangle,
              color: 'text-rose-500',
              bgColor: 'bg-rose-500/10'
            }
          ]);
        }
      } catch (error) {
        console.warn('[Regional Intelligence Sync] Error fetching city analytics:', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchCityAnalytics();
  }, []);

  if (loading || highlights.length === 0) {
    return (
      <div className="w-full rounded-2xl border border-[#B08D57]/15 bg-gradient-to-br from-[#161619] to-[#0B0B0D] p-6 lg:p-8 shadow-xl flex flex-col md:flex-row gap-6 items-center">
        <div className="w-[180px] h-[220px] bg-[#0B0B0D]/40 rounded-xl border border-[#B08D57]/10 animate-pulse flex items-center justify-center shrink-0" />
        <div className="flex-1 w-full space-y-3">
          {[1, 2, 3, 4].map(n => (
            <div key={n} className="h-10 rounded-xl border border-[#B08D57]/5 bg-[#0B0B0D]/60 animate-pulse" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full rounded-2xl border border-[#B08D57]/15 bg-gradient-to-br from-[#161619] to-[#0B0B0D] p-6 lg:p-8 shadow-xl flex flex-col md:flex-row gap-6 items-center">
      {/* SVG India Map Outline with Glowing Cities */}
      <div className="relative w-[180px] h-[220px] bg-[#0B0B0D]/40 rounded-xl p-3 border border-[#B08D57]/10 flex items-center justify-center overflow-hidden shrink-0">
        {/* Minimal styled SVG of India */}
        <svg 
          className="w-full h-full text-[#B08D57]/15" 
          viewBox="0 0 200 240" 
          fill="currentColor" 
          stroke="currentColor" 
          strokeWidth="0.5"
        >
          {/* Abstract geometric outline representing India's map */}
          <path d="M 90,20 
                   L 110,25 L 120,40 L 135,45 L 140,55 L 142,65 
                   L 155,75 L 168,78 L 172,88 L 168,96 L 158,98 
                   L 145,108 L 138,120 L 138,135 L 148,142 L 140,150 
                   L 125,165 L 118,185 L 112,205 L 105,225 L 98,235 
                   L 95,238 L 93,235 L 90,215 L 85,195 L 82,180 
                   L 75,160 L 68,148 L 52,145 L 45,135 L 38,125 
                   L 25,120 L 22,110 L 25,102 L 35,98 L 48,96 
                   L 55,90 L 62,80 L 68,68 L 72,55 L 75,40 
                   L 80,30 Z" 
          />
          
          {/* Pulse Animations for Cities */}
          {/* Delhi (North) */}
          <circle cx="85" cy="65" r="3" fill="#B08D57" />
          <circle cx="85" cy="65" r="7" fill="none" stroke="#B08D57" strokeWidth="0.5" className="animate-ping" />
          
          {/* Mumbai (West) */}
          <circle cx="58" cy="142" r="3" fill="#EF4444" />
          <circle cx="58" cy="142" r="7" fill="none" stroke="#EF4444" strokeWidth="0.5" className="animate-ping" />
          
          {/* Pune (West-ish) */}
          <circle cx="68" cy="155" r="3" fill="#F59E0B" />
          <circle cx="68" cy="155" r="7" fill="none" stroke="#F59E0B" strokeWidth="0.5" className="animate-ping" />
          
          {/* Bangalore (South) */}
          <circle cx="88" cy="192" r="3" fill="#10B981" />
          <circle cx="88" cy="192" r="7" fill="none" stroke="#10B981" strokeWidth="0.5" className="animate-ping" />
        </svg>

        {/* Floating City Labels inside the Map box */}
        <span className="absolute top-8 left-12 text-[7px] text-gray-500 font-mono tracking-widest">IND-HQ</span>
      </div>

      {/* Highlights List */}
      <div className="flex-1 w-full space-y-3">
        {highlights.map((hl) => {
          const IconComp = hl.icon;
          return (
            <div 
              key={hl.label} 
              className="flex items-center justify-between p-2.5 rounded-xl border border-[#B08D57]/5 bg-[#0B0B0D]/60 hover:border-[#B08D57]/20 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <div className={`p-1.5 rounded-lg ${hl.bgColor} ${hl.color}`}>
                  <IconComp className="h-3.5 w-3.5" />
                </div>
                <span className="text-[10px] text-gray-400 font-medium tracking-wide">
                  {hl.label}
                </span>
              </div>
              <span className="text-xs font-semibold text-[#F5F1EA] tracking-wide">
                {hl.city}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default RegionalIntelligence;
