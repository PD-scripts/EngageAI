import React from 'react';

const Customers = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">Customers</h2>
        <p className="text-slate-500 mt-1">Customer management will be implemented in Stage 2.</p>
      </div>

      {/* Placeholder card */}
      <div className="bg-white p-8 rounded-xl border border-border text-center max-w-xl shadow-sm">
        <div className="w-16 h-16 bg-blue-50 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-slate-700">No Customers Imported Yet</h3>
        <p className="text-slate-500 mt-2 text-sm">
          In the next stage, you will be able to upload client lists from Excel files and manage detailed profiles here.
        </p>
      </div>
    </div>
  );
};

export default Customers;
