import React from 'react';
import CustomerIntelligenceTicker from './CustomerIntelligenceTicker';
import { useScrollVisibility } from './useScrollVisibility';

const Header = () => {
  const isVisible = useScrollVisibility();

  return (
    <header 
      className={`relative w-full flex-shrink-0 transition-all duration-500 ease-in-out border-b border-white/[0.08] z-30 select-none overflow-hidden ${
        isVisible 
          ? 'h-14 opacity-100 translate-y-0' 
          : 'h-0 opacity-0 -translate-y-full border-none pointer-events-none'
      }`}
      style={{
        backgroundColor: '#0B0B0D',
        backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.05))',
        backdropFilter: 'blur(24px)',
        WebkitBackdropFilter: 'blur(24px)'
      }}
    >
      <div className="h-full w-full px-8 flex items-center justify-between">
        {/* Real-time Customer Intelligence scrolling ticker */}
        <CustomerIntelligenceTicker />
      </div>
    </header>
  );
};

export default Header;
