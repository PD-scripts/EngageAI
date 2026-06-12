import React from 'react';
import { Sparkles } from 'lucide-react';

const MetricCard = ({ title, value, trend, subtext, id }) => {
  const isSent = title.includes('SENT');
  const isPositive = trend && trend.includes('↑');

  return (
    <div className="bg-white p-6 rounded-2xl border border-[#E7E5E4] shadow-xs flex flex-col justify-between h-36 relative overflow-hidden transition-all duration-300 hover:shadow-sm hover:border-[#8B7355]/30 group">
      
      {/* Decorative top dot */}
      <div className="absolute top-0 right-0 w-16 h-16 bg-[#B89B72]/5 rounded-bl-full transition-all duration-300 group-hover:bg-[#B89B72]/10" />

      <div className="space-y-1">
        <span className="text-[10px] font-bold text-[#6B7280] tracking-widest uppercase">
          {title}
        </span>
        <h3 className="text-3xl font-bold text-[#1F2937] tracking-tight font-serif mt-1">
          {value}
        </h3>
      </div>

      <div className="flex items-center space-x-1.5 mt-2">
        {isSent ? (
          <span className="px-2 py-0.5 text-[10px] font-bold rounded-full bg-[#B89B72]/10 text-[#8B7355] border border-[#B89B72]/20 flex items-center space-x-1">
            <span className="w-1.5 h-1.5 rounded-full bg-[#8B7355] animate-pulse" />
            <span>{trend}</span>
          </span>
        ) : (
          <>
            <span className={`text-xs font-bold ${isPositive ? 'text-[#8B7355]' : 'text-gray-500'}`}>
              {trend}
            </span>
            <span className="text-[10px] text-gray-400 font-semibold">{subtext}</span>
          </>
        )}
      </div>

    </div>
  );
};

export default MetricCard;
