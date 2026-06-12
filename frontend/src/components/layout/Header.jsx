import React from 'react';
import { Search, Bell, ChevronDown, Coffee, Sparkles } from 'lucide-react';
import avatarImg from '../../assets/react.svg'; // Default placeholder, will use Unsplash stock or custom avatar

const Header = () => {
  return (
    <header className="h-20 bg-white border-b border-[#E7E5E4] px-8 flex items-center justify-between z-10 select-none">
      
      {/* Left: Brand Selector & Search Bar */}
      <div className="flex items-center space-x-6">
        
        {/* Brand Selector Dropdown */}
        <div className="relative">
          <button className="flex items-center space-x-2 px-3 py-1.5 bg-[#F8F6F2] hover:bg-[#EAE6DF] border border-[#E7E5E4] rounded-lg text-xs font-bold text-[#1F2937] transition-all cursor-pointer">
            <Coffee className="h-4 w-4 text-[#8B7355] fill-[#8B7355]/10" />
            <span className="font-serif">Brew & Bean</span>
            <ChevronDown className="h-3 w-3 text-gray-400" />
          </button>
        </div>

        {/* Search Bar Input */}
        <div className="relative w-64 lg:w-80">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input 
            type="text"
            placeholder="Search campaigns, audiences..."
            className="w-full pl-10 pr-4 py-2 bg-[#F8F6F2]/60 hover:bg-[#F8F6F2] focus:bg-white border border-[#E7E5E4] focus:border-[#8B7355] rounded-lg text-xs outline-none text-[#1F2937] transition-all"
          />
        </div>
      </div>

      {/* Right: Status, Notification, Profile */}
      <div className="flex items-center space-x-6">
        
        {/* AI Engine Status Badge */}
        <div className="flex items-center space-x-2 bg-[#F8F6F2] border border-[#E7E5E4] px-3 py-1.5 rounded-full">
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
          </span>
          <span className="text-[10px] font-bold text-[#6B7280] tracking-wider uppercase flex items-center space-x-1">
            <Sparkles className="h-2.5 w-2.5 text-[#8B7355]" />
            <span>AI Engine Online</span>
          </span>
        </div>

        {/* Notification Bell */}
        <div className="relative cursor-pointer hover:text-gray-650 transition-colors">
          <Bell className="h-5 w-5 text-gray-600" />
          <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-[#8B7355] text-[9px] font-extrabold text-white">
            3
          </span>
        </div>

        {/* User Profile Details */}
        <div className="flex items-center space-x-3 pl-2 border-l border-gray-200">
          <img 
            src="https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80" 
            alt="Sophia Sterling" 
            className="h-9 w-9 rounded-full object-cover border border-[#E7E5E4] bg-stone-150"
          />
          <div className="hidden md:flex flex-col text-left">
            <span className="text-xs font-bold text-[#1F2937] leading-none">Sophia Sterling</span>
            <span className="text-[10px] text-gray-400 font-semibold mt-0.5">Marketing Director</span>
          </div>
          <ChevronDown className="h-3.5 w-3.5 text-gray-400 cursor-pointer" />
        </div>

      </div>

    </header>
  );
};

export default Header;
