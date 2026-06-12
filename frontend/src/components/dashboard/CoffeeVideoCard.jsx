import React from 'react';
import { motion } from 'framer-motion';
import AnimatedSteam from './AnimatedSteam';

const CoffeeVideoCard = ({ isGlowActive, coords }) => {
  return (
    <motion.div 
      animate={{ 
        x: coords.x * 0.8, 
        y: coords.y * 0.8,
        borderColor: isGlowActive ? 'rgba(176,141,87,0.7)' : 'rgba(255,255,255,0.08)',
        boxShadow: isGlowActive 
          ? '0 0 50px rgba(176,141,87,0.45), 0 10px 30px rgba(0,0,0,0.6)'
          : '0 10px 30px rgba(0,0,0,0.35)'
      }}
      transition={{ type: 'spring', damping: 22 }}
      className={`relative z-10 w-full lg:w-[420px] h-[340px] lg:h-[440px] rounded-[32px] overflow-hidden border transition-all duration-700 select-none ${
        isGlowActive ? 'scale-[1.015]' : ''
      }`}
    >
      {/* HTML5 Coffee Video */}
      <video
        autoPlay
        muted
        loop
        playsInline
        src="https://nerfies.github.io/static/videos/coffee.mp4"
        className="w-full h-full object-cover brightness-[0.72] contrast-105"
      >
        Your browser does not support the video tag.
      </video>

      {/* Dark overlay inside video card */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0D] via-transparent to-[#0B0B0D]/20 pointer-events-none" />

      {/* Animated Steam over cup */}
      <AnimatedSteam />

      {/* Reaction Highlight Overlay (bronze pulse glow) */}
      <div 
        className={`absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(176,141,87,0.22),transparent_65%)] transition-opacity duration-700 pointer-events-none ${
          isGlowActive ? 'opacity-100' : 'opacity-0'
        }`} 
      />

      {/* Luxury details overlay */}
      <div className="absolute bottom-5 left-5 right-5 flex items-center justify-between text-white backdrop-blur-md bg-[#0B0B0D]/50 border border-[#B08D57]/20 p-3.5 rounded-2xl">
        <div className="text-left">
          <p className="text-[8px] font-mono text-[#B08D57] uppercase tracking-widest font-semibold">Active Extraction</p>
          <p className="text-xs font-serif font-medium text-[#F5F1EA]">Premium Roast Blend</p>
        </div>
        <div className="flex items-center space-x-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[9px] font-mono text-gray-400">92°C Extraction</span>
        </div>
      </div>
    </motion.div>
  );
};

export default CoffeeVideoCard;
