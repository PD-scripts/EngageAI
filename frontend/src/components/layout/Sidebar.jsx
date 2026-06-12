import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  Coffee, 
  Users, 
  ShoppingBag, 
  Sparkles, 
  Send, 
  BarChart3, 
  Cpu, 
  Settings,
  Terminal
} from 'lucide-react';
import coffeeMug from '../../assets/coffee_sidebar_mug.png';

const Sidebar = () => {
  const menuItems = [
    { name: 'Dashboard', path: '/', icon: Coffee },
    { name: 'Customers', path: '/customers', icon: Users },
    { name: 'Orders', path: '/orders', icon: ShoppingBag },
    { name: 'Audience Builder', path: '/audience-builder', icon: Sparkles },
    { name: 'Campaigns', path: '/campaigns', icon: Send },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'AI Strategist', path: '/ai-strategist', icon: Cpu },
    { name: 'Settings', path: '#', icon: Settings }
  ];

  return (
    <aside className="w-64 bg-[#0B0B0D] text-[#F5F1EA]/80 flex flex-col h-full z-20 shrink-0 select-none border-r border-[#B08D57]/20 shadow-2xl">
      {/* Brand Header */}
      <div className="p-6 flex flex-col items-center border-b border-[#B08D57]/15 text-center bg-[#0B0B0D]">
        {/* Coffee Branch SVG Logo */}
        <svg className="w-9 h-9 mb-2 text-[#B08D57]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" strokeDasharray="3 3" />
          <path d="M12 6a6 6 0 016 6v1a5 5 0 01-5 5H11a5 5 0 01-5-5v-1a6 6 0 016-6z" fill="currentColor" fillOpacity="0.08" />
          <path d="M8 14c1.5-1.5 2.5-3.5 2.5-5.5M16 14c-1.5-1.5-2.5-3.5-2.5-5.5" strokeLinecap="round" />
          <circle cx="12" cy="11" r="1.5" fill="currentColor" />
        </svg>
        <h1 className="text-lg font-serif font-black tracking-widest text-[#F5F1EA] uppercase">
          ENGAGE<span className="text-[#B08D57]">AI</span>
        </h1>
        <p className="text-[9px] text-[#B08D57]/60 font-bold uppercase tracking-widest mt-0.5">by BREW & BEAN</p>
        <div className="w-10 h-[1px] bg-[#B08D57]/20 my-1.5" />
        <p className="text-[8px] text-[#F5F1EA]/40 font-extrabold uppercase tracking-widest">Executive Command Center</p>
      </div>

      {/* Navigation Links - Scrollbar Hidden */}
      <nav 
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        className="flex-1 px-4 py-4 space-y-1 overflow-y-auto [&::-webkit-scrollbar]:hidden"
      >
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `relative flex items-center px-4 py-2.5 rounded text-xs tracking-wide uppercase transition-all duration-200 group ${
                  isActive
                    ? 'text-[#B08D57] bg-[#3B2A1F]/20 font-bold border-l border-[#B08D57]'
                    : 'text-[#F5F1EA]/60 hover:text-[#F5F1EA] hover:bg-[#3B2A1F]/10'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <IconComponent 
                    className={`h-4 w-4 mr-3 transition-colors duration-150 ${
                      isActive ? 'text-[#B08D57]' : 'text-[#F5F1EA]/40 group-hover:text-[#F5F1EA]/80'
                    }`}
                  />
                  <span>{item.name}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Premium Coffee Visual Banner inside Sidebar */}
      <div className="p-3 border-t border-[#B08D57]/15 flex flex-col items-center bg-[#0B0B0D] text-center space-y-2">
        <div className="w-full h-14 overflow-hidden rounded-lg relative border border-[#B08D57]/10">
          <img 
            src={coffeeMug} 
            alt="Brew & Bean Coffee" 
            className="w-full h-full object-cover brightness-[0.75] contrast-105" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0B0D]/95 to-transparent" />
          <span className="absolute bottom-1 left-2 text-[8px] font-mono font-bold text-[#B08D57] uppercase tracking-wider bg-black/40 px-1 py-0.5 rounded backdrop-blur-xs">
            Brew & Bean
          </span>
        </div>
        
        {/* Sandbox toggle for devs */}
        <NavLink
          to="/query-tester"
          className={({ isActive }) =>
            `w-full flex items-center justify-center py-1.5 px-3 rounded border text-[9px] font-mono tracking-widest uppercase transition-all ${
              isActive 
                ? 'text-[#B08D57] border-[#B08D57] bg-[#B08D57]/5' 
                : 'text-[#F5F1EA]/45 border-[#B08D57]/15 hover:text-[#F5F1EA] hover:border-[#B08D57]/30'
            }`
          }
        >
          <Terminal className="h-2.5 w-2.5 mr-1.5" />
          <span>Developer Sandbox</span>
        </NavLink>
      </div>
    </aside>
  );
};

export default Sidebar;
