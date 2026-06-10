import React from 'react';

const Dashboard = () => {
  const stats = [
    { name: 'Total Customers', value: '1,245', description: 'Registered shoppers' },
    { name: 'Campaigns', value: '8', description: 'Active and completed' },
    { name: 'Revenue', value: '$45,230', description: 'LTV from campaigns' }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Dashboard</h2>
        <p className="text-slate-500 mt-1">Campaign insights and analytics will appear here.</p>
      </div>

      {/* Grid of Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white p-6 rounded-xl border border-border shadow-sm">
            <p className="text-sm font-medium text-slate-500">{stat.name}</p>
            <p className="text-3xl font-bold text-slate-800 mt-2">{stat.value}</p>
            <p className="text-xs text-slate-400 mt-1">{stat.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Dashboard;
