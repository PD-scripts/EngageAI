import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Cpu } from 'lucide-react';

import AIOpportunityScanner from './AIOpportunityScanner';
import RotatingInsights from './RotatingInsights';

import coffeeBeansDeco from '../../assets/coffee_beans_deco.png';
import coffeeVideo from '../../assets/videos/coffee-hero.mp4';

const HeroBanner = () => {
  const [coords, setCoords] = useState({ x: 0, y: 0 });
  const [currentStep, setCurrentStep] = useState(0);

  // Unified scanner timer state (looping step 0-4)
  useEffect(() => {
    let timer;
    if (currentStep < 4) {
      // 1.5 seconds per scanning step
      timer = setTimeout(() => {
        setCurrentStep((prev) => prev + 1);
      }, 1500);
    } else {
      // 4 seconds pause in completed state
      timer = setTimeout(() => {
        setCurrentStep(0);
      }, 4000);
    }
    return () => clearTimeout(timer);
  }, [currentStep]);

  const handleMouseMove = (e) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left - rect.width / 2) / 35;
    const y = (e.clientY - rect.top - rect.height / 2) / 35;
    setCoords({ x, y });
  };

  const handleMouseLeave = () => {
    setCoords({ x: 0, y: 0 });
  };

  return (
    <div 
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full rounded-[32px] overflow-hidden bg-[#0B0B0D] border p-8 lg:p-14 flex flex-col lg:flex-row items-center justify-between min-h-[500px] lg:h-[580px] shadow-2xl transition-all duration-700 select-none"
      style={{
        borderColor: currentStep === 4 ? 'rgba(176, 141, 87, 0.45)' : 'rgba(176, 141, 87, 0.15)',
        boxShadow: currentStep === 4 
          ? '0 0 50px rgba(176, 141, 87, 0.2), inset 0 0 20px rgba(176, 141, 87, 0.05), 0 10px 30px rgba(0,0,0,0.5)' 
          : '0 10px 30px rgba(0,0,0,0.5)'
      }}
    >
      {/* BACKGROUND LAYER: Looping Cinematic Coffee Video (brighter and more vibrant) */}
      <video
        autoPlay
        muted
        loop
        playsInline
        src={coffeeVideo}
        className="absolute inset-0 w-full h-full object-cover z-0 pointer-events-none select-none brightness-[1.15] contrast-[1.05] saturate-[1.05]"
      />

      {/* OVERLAY 1: Directional gradient overlay to darken only the text area (left side 70% to right side 5% opacity) */}
      <div 
        className="absolute inset-0 z-1 pointer-events-none" 
        style={{
          background: 'linear-gradient(90deg, rgba(11,11,13,0.70) 0%, rgba(11,11,13,0.45) 35%, rgba(11,11,13,0.20) 70%, rgba(11,11,13,0.05) 100%)'
        }}
      />

      {/* OVERLAY 2: Subtle luxury bronze tint layer to integrate the video into the brand identity */}
      <div 
        className="absolute inset-0 z-1 pointer-events-none" 
        style={{
          backgroundColor: 'rgba(176,141,87,0.08)'
        }}
      />

      {/* BACKGROUND BLENDING: Edge gradients to merge the video container seamlessly into the dashboard theme */}
      <div className="absolute top-0 left-0 right-0 h-16 bg-gradient-to-b from-[#0B0B0D] to-transparent z-1 pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-[#0B0B0D] to-transparent z-1 pointer-events-none" />
      <div className="absolute top-0 bottom-0 left-0 w-16 bg-gradient-to-r from-[#0B0B0D] to-transparent z-1 pointer-events-none" />
      <div className="absolute top-0 bottom-0 right-0 w-16 bg-gradient-to-l from-[#0B0B0D] to-transparent z-1 pointer-events-none" />

      {/* Subtle Dark Vignette Overlay for background depth */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,0,0,0)_40%,#0B0B0D_95%)] z-1 pointer-events-none" />

      {/* Background radial bronze glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(176,141,87,0.15),transparent_65%)] z-1 pointer-events-none" />

      {/* COFFEE REACTION EFFECT: Unified background bronze pulse glow on scan completion */}
      <div 
        className={`absolute inset-0 bg-[radial-gradient(circle_at_60%_40%,rgba(176,141,87,0.28),transparent_70%)] transition-opacity duration-1000 z-1 pointer-events-none ${
          currentStep === 4 ? 'opacity-100 animate-pulse' : 'opacity-0'
        }`} 
      />

      {/* Floating Coffee Beans Parallax Micro-Animations */}
      <motion.img 
        src={coffeeBeansDeco}
        alt="Floating Bean Left"
        animate={{ x: coords.x * -1.8, y: coords.y * -1.8 }}
        transition={{ type: 'spring', damping: 20 }}
        className="absolute top-10 left-12 w-20 opacity-[0.05] pointer-events-none z-10 rotate-12"
      />
      <motion.img 
        src={coffeeBeansDeco}
        alt="Floating Bean Right"
        animate={{ x: coords.x * 2.2, y: coords.y * 2.2 }}
        transition={{ type: 'spring', damping: 20 }}
        className="absolute bottom-12 right-24 w-28 opacity-[0.04] pointer-events-none z-10 -rotate-45"
      />
      <motion.img 
        src={coffeeBeansDeco}
        alt="Floating Bean Center"
        animate={{ x: coords.x * -1.0, y: coords.y * -1.0 }}
        transition={{ type: 'spring', damping: 20 }}
        className="absolute top-[40%] left-[45%] w-16 opacity-[0.03] pointer-events-none z-10 rotate-90"
      />

      {/* Left Column: Command details & Scanner (layered above the video background) */}
      <div className="relative z-10 flex-1 max-w-xl space-y-8 text-[#F5F1EA]">
        {/* Pulsing Active Status Badge */}
        <div className="inline-flex items-center space-x-2 bg-[#0B0B0D]/90 border border-[#B08D57]/30 px-3.5 py-1.5 rounded-full backdrop-blur-md">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#B08D57] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-[#B08D57]"></span>
          </span>
          <span className="text-[9px] font-mono font-bold uppercase tracking-widest text-[#F5F1EA] flex items-center space-x-1.5">
            <Cpu className="h-3 w-3 text-[#B08D57] animate-pulse" />
            <span>AI Strategist Active</span>
          </span>
        </div>

        {/* Brand & Greetings Header */}
        <div className="space-y-3">
          <h1 
            style={{ textShadow: '0 2px 12px rgba(0,0,0,0.45)' }}
            className="text-4xl lg:text-5xl font-serif font-light leading-tight tracking-tight"
          >
            Good Morning, <span className="font-semibold text-transparent bg-clip-text bg-gradient-to-r from-[#F5F1EA] via-[#EAE6DF] to-[#B08D57]">Sophia</span>
          </h1>
          
          <RotatingInsights />
          
          <p 
            style={{ textShadow: '0 2px 12px rgba(0,0,0,0.45)' }}
            className="text-xs text-[#F5F1EA]/85 tracking-wide leading-relaxed font-sans max-w-md pt-1"
          >
            3 high-impact marketing opportunities detected today. Connect directly with your customer segments via our automated AI suggestions below.
          </p>
        </div>

        {/* Grid linking Scanner status and Revenue impact */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6 border-t border-[#B08D57]/15">
          {/* Revenue Impact summary */}
          <div className="space-y-1">
            <span 
              style={{ textShadow: '0 2px 12px rgba(0,0,0,0.45)' }}
              className="text-[9px] font-mono font-bold text-[#B08D57] uppercase tracking-widest block"
            >
              Potential Revenue Impact
            </span>
            <span 
              style={{ textShadow: '0 2px 12px rgba(0,0,0,0.45)' }}
              className="text-3xl lg:text-4xl font-serif font-black text-[#F5F1EA]"
            >
              ₹48,500
            </span>
            <span 
              style={{ textShadow: '0 2px 12px rgba(0,0,0,0.45)' }}
              className="text-[9px] font-sans text-gray-300 block"
            >
              94% conversion confidence score
            </span>
          </div>

          {/* AI Opportunity Scanner list */}
          <div className="border-l border-[#B08D57]/10 pl-6">
            <AIOpportunityScanner currentStep={currentStep} />
          </div>
        </div>
      </div>

      {/* Right side is kept empty on desktop to display the gorgeous coffee pour video context */}
      <div className="hidden lg:block lg:w-[320px] h-full pointer-events-none" />
    </div>
  );
};

export default HeroBanner;
