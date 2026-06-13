import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Cpu } from 'lucide-react';

import AIOpportunityScanner from './AIOpportunityScanner';
import RotatingInsights from './RotatingInsights';

import coffeeBeansDeco from '../../assets/coffee_beans_deco.png';
import coffeeVideo from '../../assets/videos/coffee-hero.mp4';

const HeroBanner = ({ recommendations }) => {
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
      className="relative w-auto -mx-8 lg:-mx-10 -mt-8 lg:-mt-10 overflow-visible bg-[#0B0B0D] px-8 lg:px-10 py-12 lg:py-16 flex flex-col lg:flex-row items-center justify-between min-h-[500px] lg:h-[580px] transition-all duration-700 select-none"
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
          background: 'transparent'
        }}
      />

      {/* OVERLAY 2: Subtle luxury bronze tint layer to integrate the video into the brand identity */}
      <div 
        className="absolute inset-0 z-1 pointer-events-none" 
        style={{
          backgroundColor: 'transparent'
        }}
      />

      {/* BACKGROUND BLENDING: Edge gradients to merge the video container seamlessly into the dashboard theme */}
      <div className="absolute top-0 left-0 right-0 h-28 bg-transparent z-1 pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-32 bg-transparent z-1 pointer-events-none" />
      <div className="absolute top-0 bottom-0 left-0 w-28 bg-transparent z-1 pointer-events-none" />
      <div className="absolute top-0 bottom-0 right-0 w-28 bg-transparent z-1 pointer-events-none" />

      {/* Subtle Dark Vignette Overlay for background depth */}
      <div className="absolute inset-0 bg-transparent z-1 pointer-events-none" />

      {/* Background radial bronze glow */}
      <div className="absolute inset-0 bg-transparent z-1 pointer-events-none" />

      {/* COFFEE REACTION EFFECT: Unified background bronze pulse glow on scan completion */}
      <div 
        className={`absolute inset-0 bg-transparent transition-opacity duration-1000 z-1 pointer-events-none`} 
      />

      {/* Floating Coffee Beans Parallax Micro-Animations */}
      <motion.img 
        src={coffeeBeansDeco}
        alt="Floating Bean Left"
        animate={{ x: coords.x * -1.8, y: coords.y * -1.8 }}
        transition={{ type: 'spring', damping: 20 }}
        className="absolute top-[-20px] left-[-10px] w-20 opacity-[0.05] pointer-events-none z-10 rotate-12"
      />
      <motion.img 
        src={coffeeBeansDeco}
        alt="Floating Bean Right"
        animate={{ x: coords.x * 2.2, y: coords.y * 2.2 }}
        transition={{ type: 'spring', damping: 20 }}
        className="absolute bottom-[-30px] right-[40px] w-28 opacity-[0.04] pointer-events-none z-10 -rotate-45"
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
          
          <RotatingInsights recommendations={recommendations} />
          
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
