import React, { useState } from 'react';
import { Search, Bell, ChevronDown, Check, Sparkles } from 'lucide-react';

const Navbar = () => {
  const [selectedBrand, setSelectedBrand] = useState('Nike');
  const [brandDropdownOpen, setBrandDropdownOpen] = useState(false);
  const brands = ['Nike', 'Sephora', 'Adidas', 'L\'Oréal', 'Apple'];

  const toggleBrandDropdown = () => setBrandDropdownOpen(!brandDropdownOpen);

  const selectBrand = (brand) => {
    setSelectedBrand(brand);
    setBrandDropdownOpen(false);
  };

  return (
    <header className="sticky top-0 z-10 glass-nav h-16 flex items-center justify-between px-6 border-b border-border shrink-0">
      {/* Brand Switcher & Search */}
      <div className="flex items-center space-x-6">
        {/* Brand Dropdown Selector */}
        <div className="relative">
          <button 
            onClick={toggleBrandDropdown}
            className="flex items-center space-x-2 px-3 py-1.5 rounded-lg border border-border bg-white text-sm font-semibold text-text-main hover:bg-slate-50 transition-colors shadow-xs cursor-pointer"
          >
            <span className="w-2 h-2 rounded-full bg-primary"></span>
            <span>{selectedBrand}</span>
            <ChevronDown className="h-4 w-4 text-text-muted" />
          </button>

          {brandDropdownOpen && (
            <>
              <div 
                className="fixed inset-0 z-10" 
                onClick={() => setBrandDropdownOpen(false)}
              />
              <div className="absolute left-0 mt-1.5 w-48 bg-white border border-border rounded-xl shadow-lg z-20 py-1 overflow-hidden animate-in fade-in slide-in-from-top-1 duration-150">
                <p className="text-[10px] text-text-muted font-bold px-3 py-2 uppercase tracking-widest border-b border-border bg-slate-50">Select Account</p>
                {brands.map((brand) => (
                  <button
                    key={brand}
                    onClick={() => selectBrand(brand)}
                    className="w-full flex items-center justify-between px-3 py-2 text-xs font-semibold text-text-main hover:bg-slate-50 transition-colors text-left"
                  >
                    <span>{brand}</span>
                    {selectedBrand === brand && <Check className="h-3.5 w-3.5 text-primary" />}
                  </button>
                ))}
              </div>
            </>
          )}
        </div>

        {/* Global Search Bar */}
        <div className="relative hidden md:block w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-text-muted" />
          <input
            type="text"
            placeholder="Search campaigns, audiences..."
            className="w-full pl-9 pr-4 py-1.5 text-xs bg-white/50 border border-border rounded-lg focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all text-text-main"
          />
        </div>
      </div>

      {/* AI Status & Profile Actions */}
      <div className="flex items-center space-x-4">
        {/* Glowing AI status badge */}
        <div className="hidden sm:flex items-center space-x-2 bg-primary/5 border border-primary/20 px-3 py-1.5 rounded-lg text-xs font-bold text-primary">
          <Sparkles className="h-3.5 w-3.5 ai-glow text-primary" />
          <span>AI Engine Online</span>
        </div>

        {/* Alerts Button */}
        <button className="relative p-2 text-text-muted hover:text-text-main rounded-lg hover:bg-white/40 transition-colors cursor-pointer border border-transparent hover:border-border">
          <Bell className="h-4.5 w-4.5" />
          {/* Notification dot */}
          <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-danger"></span>
        </button>

        {/* Profile Avatar */}
        <div className="flex items-center space-x-2 pl-2 border-l border-border">
          <img
            src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=80&fit=crop&q=80"
            alt="User avatar"
            className="h-8 w-8 rounded-full border border-border object-cover"
          />
          <div className="hidden xl:block text-left">
            <p className="text-xs font-bold text-text-main">Sophia Sterling</p>
            <p className="text-[10px] text-text-muted font-semibold">Chief Brand Director</p>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
