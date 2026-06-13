import React from 'react';

const TickerItem = ({ event }) => {
  return (
    <div className="inline-flex items-center space-x-3 text-xs font-sans text-[#F5F1EA] select-none mx-6">
      {/* Category Badge */}
      <span 
        className={`px-2.5 py-0.5 rounded-full text-[9px] font-mono font-bold uppercase tracking-wider border ${event.color}`}
      >
        {event.badge}
      </span>
      {/* Event Details */}
      <span className="font-serif tracking-wide text-[#F5F1EA]/85">
        {event.text}
      </span>
      {/* Divider Bullet */}
      <span className="text-[#B08D57]/30 text-[10px] pl-3 font-semibold select-none">•</span>
    </div>
  );
};

export default TickerItem;
