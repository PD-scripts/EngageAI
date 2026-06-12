import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';

const AIOpportunityScanner = ({ currentStep }) => {
  const steps = [
    { text: 'Scanning Customer Health...' },
    { text: 'Analyzing Weather Signals...' },
    { text: 'Checking Upcoming Birthdays...' },
    { text: 'Generating Opportunities...' }
  ];

  return (
    <div className="relative min-h-[120px] flex items-center">
      <AnimatePresence mode="wait">
        {currentStep === 4 ? (
          <motion.div
            key="completed"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            className="w-full bg-gradient-to-br from-[#3B2A1F]/30 to-[#0B0B0D]/50 border border-[#B08D57]/30 rounded-2xl p-4 flex items-center space-x-3.5 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05),0_12px_24px_-8px_rgba(0,0,0,0.5)]"
          >
            <div className="flex-shrink-0 h-10 w-10 rounded-full bg-[#B08D57]/10 border border-[#B08D57]/30 flex items-center justify-center text-[#B08D57] animate-pulse">
              <Sparkles className="h-5 w-5" />
            </div>
            <div>
              <p className="text-[10px] font-mono tracking-widest text-[#B08D57] uppercase font-bold">Analysis Complete</p>
              <h3 className="text-sm font-serif font-semibold text-[#F5F1EA] tracking-wide mt-0.5 animate-pulse">
                3 Opportunities Found
              </h3>
            </div>
          </motion.div>
        ) : (
          <motion.div
            key="scanning"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="space-y-3.5 w-full py-1.5"
          >
            {steps.map((step, idx) => {
              const isVisible = currentStep > idx;
              const isScanning = currentStep === idx;

              return (
                <div key={idx} className="flex items-center space-x-2.5 h-4 transition-opacity duration-300">
                  {/* Step Status Indicator */}
                  {isVisible ? (
                    <span className="text-[#B08D57] font-bold text-xs select-none">✓</span>
                  ) : isScanning ? (
                    <span className="relative flex h-2 w-2">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#B08D57] opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-2 w-2 bg-[#B08D57]"></span>
                    </span>
                  ) : (
                    <span className="inline-block h-1 w-1 rounded-full bg-[#F5F1EA]/20" />
                  )}

                  {/* Step Text */}
                  <span className={`font-mono text-[10px] tracking-widest uppercase transition-colors duration-300 ${
                    isVisible ? 'text-[#F5F1EA]/80 font-medium' : isScanning ? 'text-[#B08D57] font-semibold' : 'text-[#F5F1EA]/25'
                  }`}>
                    {step.text}
                  </span>
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AIOpportunityScanner;
