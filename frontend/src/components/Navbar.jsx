import React from 'react';

const Navbar = () => {
  return (
    <header className="bg-white border-b border-border h-16 flex items-center px-6 justify-between">
      <div className="flex items-center space-x-2">
        <span className="font-semibold text-slate-800">Welcome to Xeno CRM</span>
      </div>
      <div>
        <span className="text-sm font-medium text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
          AI Native Marketing Platform
        </span>
      </div>
    </header>
  );
};

export default Navbar;
