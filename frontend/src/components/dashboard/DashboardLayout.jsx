import React from 'react';

const DashboardLayout = ({ children }) => {
  return (
    <div className="space-y-8 select-none pb-12">
      {children}
    </div>
  );
};

export default DashboardLayout;
