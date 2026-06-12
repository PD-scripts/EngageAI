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
  Terminal 
} from 'lucide-react';

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
    <aside className="w-64 bg-sidebar text-slate-300 border-r border-slate-800 flex flex-col h-full z-20 shrink-0">
      {/* Brand Header */}
      <div className="p-6 border-b border-slate-800 flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center space-x-2">
            <span className="text-xl font-bold tracking-wider text-white">ENGAGE<span className="text-primary font-extrabold">AI</span></span>
            {/* Glowing AI status dot */}
            <span className="flex h-2 w-2 relative">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-primary"></span>
            </span>
          </div>
          <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">Marketing Engine</p>
        </div>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-4 space-y-1.5 overflow-y-auto">
        {menuItems.map((item) => {
          const IconComponent = item.icon;
          return (
            <NavLink
              key={item.name}
              to={item.path}
              className={({ isActive }) =>
                `relative flex items-center px-4 py-3 rounded-lg text-sm font-semibold transition-all duration-200 group ${
                  isActive
                    ? 'text-white bg-white/5 border-l-2 border-primary'
                    : 'text-slate-400 hover:text-white hover:bg-white/3'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <IconComponent 
                    className={`h-4.5 w-4.5 mr-3 transition-colors duration-150 ${
                      isActive ? 'text-primary' : 'text-slate-500 group-hover:text-slate-300'
                    }`}
                  />
                  <span>{item.name}</span>
                  {/* Subtle active glow pill background using Framer Motion layoutId */}
                  {isActive && (
                    <motion.div
                      layoutId="activeNavIndicator"
                      className="absolute inset-0 bg-primary/5 rounded-lg -z-10"
                      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                    />
                  )}
                </>
              )}
            </NavLink>
          );
        })}
      </nav>

      {/* Footer / Utilities */}
      <div className="p-4 border-t border-slate-850 bg-slate-950/40 space-y-2">
        <NavLink
          to="/query-tester"
          className={({ isActive }) =>
            `flex items-center px-3 py-2 rounded-md text-xs font-semibold transition-all duration-150 ${
              isActive 
                ? 'text-primary bg-primary/5' 
                : 'text-slate-500 hover:text-slate-300'
            }`
          }
        >
          <Terminal className="h-3.5 w-3.5 mr-2" />
          <span>Developer Sandbox</span>
        </NavLink>
        <div className="text-[10px] text-slate-600 text-center font-bold tracking-widest">
          ENGAGEAI v1.1.0-LUXURY
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
