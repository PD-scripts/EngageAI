import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MapPin, TrendingUp, DollarSign, AlertTriangle, Star } from 'lucide-react';
import statesData from './india_states.json';

import { API_BASE_URL } from '../../config/api';

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
        {/* Geographically accurate styled SVG of India */}
        <svg 
          className="w-full h-full text-[#B08D57]/5 hover:text-[#B08D57]/10 transition-colors duration-500" 
          viewBox="0 0 612 696" 
          fill="currentColor" 
          stroke="#B08D57" 
          strokeWidth="0.5"
          strokeOpacity="0.15"
        >
          {statesData.map((state) => (
            <path 
              key={state.id} 
              id={state.id} 
              title={state.name}
              d={state.d} 
              className="hover:fill-[#B08D57]/20 transition-all duration-300 cursor-pointer"
            />
          ))}
          
          {/* Pulse Animations for Cities */}
          {/* Delhi (North) */}
          <circle cx="187" cy="211" r="5" fill="#B08D57" />
          <circle cx="187" cy="211" r="12" fill="none" stroke="#B08D57" strokeWidth="1" className="animate-ping" />
          
          {/* Mumbai (West) */}
          <circle cx="120" cy="430" r="5" fill="#EF4444" />
          <circle cx="120" cy="430" r="12" fill="none" stroke="#EF4444" strokeWidth="1" className="animate-ping" />
          
          {/* Pune (West-ish) */}
          <circle cx="135" cy="445" r="5" fill="#F59E0B" />
          <circle cx="135" cy="445" r="12" fill="none" stroke="#F59E0B" strokeWidth="1" className="animate-ping" />
          
          {/* Bangalore (South) */}
          <circle cx="195" cy="565" r="5" fill="#10B981" />
          <circle cx="195" cy="565" r="12" fill="none" stroke="#10B981" strokeWidth="1" className="animate-ping" />
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
