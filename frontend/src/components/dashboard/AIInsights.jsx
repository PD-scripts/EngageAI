import React from 'react';
import { Sparkles } from 'lucide-react';
import coffeeBeansDeco from '../../assets/coffee_beans_deco.png';

const AIInsights = () => {
  const insights = [
    { text: 'Cold Brew demand is expected to rise in Delhi tomorrow due to the temperature surge.' },
    { text: 'Birthday campaigns historically generate 18% higher conversion and enhance customer lifetime value.' },
    { text: 'VIP customers engage 24% more through WhatsApp than traditional email communication.' },
    { text: 'Mumbai customer activity declined 9% this month, suggesting targeted loyalty rewards are required.' }
  ];

  return (
    <div className="relative w-full rounded-2xl border border-[#B08D57]/15 bg-gradient-to-br from-[#161619] to-[#0B0B0D] p-6 lg:p-8 overflow-hidden shadow-xl min-h-[280px] flex flex-col justify-between">
      {/* Subtle Coffee Beans overlay */}
      <img 
        src={coffeeBeansDeco} 
        alt="Coffee Beans Deco" 
        className="absolute top-1/2 -right-10 w-44 opacity-[0.08] pointer-events-none select-none z-0 transform -translate-y-1/2 rotate-12"
      />

      <div className="relative z-10 space-y-6">
        {/* Panel Header */}
        <div className="flex items-center justify-between border-b border-[#B08D57]/10 pb-3">
          <h3 className="text-md font-serif text-[#F5F1EA] tracking-wide flex items-center space-x-2">
            <Sparkles className="h-4 w-4 text-[#B08D57]" />
            <span>AI Intelligence Insights</span>
          </h3>
          <span className="text-[9px] font-mono text-[#B08D57]/60 tracking-widest uppercase">Live Stream</span>
        </div>

        {/* Bullet text panel */}
        <div className="space-y-4 font-sans">
          {insights.map((ins, idx) => (
            <div key={idx} className="flex items-start space-x-3.5 group">
              <span className="text-[#B08D57] text-[10px] mt-1.5 transition-transform duration-300 group-hover:scale-125">◆</span>
              <p className="text-xs text-[#F5F1EA]/80 leading-relaxed font-light tracking-wide group-hover:text-[#F5F1EA] transition-colors">
                {ins.text}
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Decorative luxury bottom line */}
      <div className="relative z-10 text-[9px] font-mono text-[#B08D57]/45 tracking-widest uppercase text-left border-t border-[#B08D57]/10 pt-4 mt-4">
        © ENGAGEAI • COFFEE COGNITION SYSTEM
      </div>
    </div>
  );
};

export default AIInsights;
