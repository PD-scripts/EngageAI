import React from 'react';
import { NavLink } from 'react-router-dom';

const Sidebar = () => {
  const menuItems = [
    { name: 'Dashboard', path: '/' },
    { name: 'Customers', path: '/customers' },
    { name: 'Orders', path: '/orders' },
    { name: 'AI Copilot', path: '/ai-copilot' }
  ];

  return (
    <aside className="w-64 bg-white border-r border-border flex flex-col h-full">
      {/* Brand Logo / Name */}
      <div className="p-6 border-b border-border">
        <h1 className="text-xl font-bold text-primary tracking-wide">Xeno CRM</h1>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 p-4 space-y-1">
        {menuItems.map((item) => (
          <NavLink
            key={item.name}
            to={item.path}
            className={({ isActive }) =>
              `flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors duration-150 ${
                isActive
                  ? 'bg-blue-50 text-primary'
                  : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
              }`
            }
          >
            {item.name}
          </NavLink>
        ))}
      </nav>

      {/* Footer / Info */}
      <div className="p-4 border-t border-border">
        <div className="text-xs text-slate-400 text-center">
          v1.0.0-foundation
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
