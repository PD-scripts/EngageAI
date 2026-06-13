import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const RotatingInsights = ({ recommendations }) => {
  const insights = (recommendations && recommendations.length > 0)
    ? recommendations.map(rec => rec.description || rec.title)
    : [
        "Track customer interactions to see real-time insights",
        "Launch your next coffee campaign today",
        "Coffee intelligence engine is active"
      ];

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setIndex((prev) => (prev + 1) % insights.length);
    }, 5000); // 5 seconds
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="h-6 overflow-hidden relative flex items-center">
      <AnimatePresence mode="wait">
        <motion.p
          key={index}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -12 }}
          transition={{ duration: 0.5, ease: 'easeInOut' }}
          style={{ textShadow: '0 2px 12px rgba(0,0,0,0.45)' }}
          className="text-xs font-mono font-bold tracking-widest text-[#B08D57] uppercase"
        >
          {insights[index]}
        </motion.p>
      </AnimatePresence>
    </div>
  );
};

export default RotatingInsights;
