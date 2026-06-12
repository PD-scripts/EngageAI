import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  Users, 
  ShoppingBag, 
  Sparkles, 
  Send, 
  BarChart3, 
  Bot, 
  Settings,
  Terminal
} from 'lucide-react';
import coffeeMug from '../../assets/coffee_sidebar_mug.png';

const Sidebar = () => {
  const menuItems = [
    { name: 'Dashboard', path: '/', icon: LayoutDashboard },
    { name: 'Customers', path: '/customers', icon: Users },
    { name: 'Orders', path: '/orders', icon: ShoppingBag },
    { name: 'Audience Builder', path: '/audience-builder', icon: Sparkles },
    { name: 'Campaigns', path: '/campaigns', icon: Send },
    { name: 'Analytics', path: '/analytics', icon: BarChart3 },
    { name: 'AI Strategist', path: '/ai-strategist', icon: Bot }
  ];

  return (
    <aside className="w-64 bg-[#111827] text-slate-300 flex flex-col h-full z-20 shrink-0 select-none">
      {/* Brand Header */}
      <div className="p-6 flex flex-col items-center border-b border-gray-800 text-center">
        {/* Coffee Branch SVG Logo */}
        <svg className="w-9 h-9 mb-2 text-[#B89B72]" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12s4.477 10 10 10z" strokeDasharray="3 3" />
          <path d="M12 6a6 6 0 016 6v1a5 5 0 01-5 5H11a5 5 0 01-5-5v-1a6 6 0 016-6z" fill="currentColor" fillOpacity="0.1" />
          <path d="M8 14c1.5-1.5 2.5-3.5 2.5-5.5M16 14c-1.5-1.5-2.5-3.5-2.5-5.5" strokeLinecap="round" />
          <circle cx="12" cy="11" r="1.5" fill="currentColor" />
        </svg>
        <h1 className="text-lg font-bold tracking-widest text-[#F8F6F2] font-serif uppercase">
          ENGAGE<span className="text-[#B89B72]">AI</span>
        </h1>
        <p className="text-[9px] text-gray-500 font-bold uppercase tracking-widest mt-0.5">by BREW & BEAN</p>
        <div className="w-10 h-[1px] bg-gray-800 my-1.5" />
        <p className="text-[8px] text-[#8B7355] font-extrabold uppercase tracking-widest">Marketing Engine</p>
      </div>

      {/* Navigation Links - Scrollbar Hidden */}
      <nav 
        style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
        className="flex-1 px-4 py-4 space-y-0.5 overflow-y-auto [&::-webkit-scrollbar]:hidden"
      >
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `relative flex items-center px-4 py-2.5 rounded text-sm transition-all duration-200 group ${
                  isActive
                    ? 'text-[#B89B72] bg-[#1F2937]/50 font-semibold border-l-2 border-[#8B7355]'
                    : 'text-gray-400 hover:text-[#F8F6F2] hover:bg-[#1F2937]/30'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <IconComponent 
                    className={`h-4.5 w-4.5 mr-3 transition-colors duration-150 ${
                      isActive ? 'text-[#B89B72]' : 'text-gray-500 group-hover:text-gray-300'
                    }`}
                  />
                  <span>{item.name}</span>
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Premium Coffee Visual Banner inside Sidebar - Shrunk to fit links */}
      <div className="p-3 border-t border-gray-800 flex flex-col items-center bg-[#0B0F19] text-center space-y-2">
        <div className="w-full h-14 overflow-hidden rounded-lg relative border border-gray-800">
          <img 
            src={coffeeMug} 
            alt="Brew & Bean Coffee" 
            className="w-full h-full object-cover brightness-90 contrast-105" 
          />
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0F19]/90 to-transparent" />
          <span className="absolute bottom-1 left-2 text-[8px] font-bold text-[#F8F6F2] uppercase tracking-wider bg-black/40 px-1 py-0.5 rounded backdrop-blur-xs">
            Brew & Bean
          </span>
        </div>
        <div className="space-y-0.5">
          <p className="text-[9px] text-gray-400 font-serif italic">
            "Great coffee. Stronger relationships. Better growth."
          </p>
        </div>
        
        {/* Sandbox toggle for devs */}
        <NavLink
          to="/query-tester"
          className={({ isActive }) =>
            `w-full flex items-center justify-center py-1.5 px-3 rounded border text-[9px] font-semibold tracking-wide transition-all ${
              isActive 
                ? 'text-[#B89B72] border-[#8B7355] bg-[#8B7355]/5' 
                : 'text-gray-500 border-gray-800 hover:text-gray-300 hover:border-gray-700'
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
