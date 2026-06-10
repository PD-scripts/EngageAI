import React from 'react';

const AICopilot = () => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-slate-800">AI Copilot</h2>
        <p className="text-slate-500 mt-1">AI Audience Builder will be implemented in Stage 4.</p>
      </div>

      {/* Placeholder card */}
      <div className="bg-white p-8 rounded-xl border border-border text-center max-w-xl shadow-sm">
        <div className="w-16 h-16 bg-blue-50 text-primary rounded-full flex items-center justify-center mx-auto mb-4">
          <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        <h3 className="text-lg font-semibold text-slate-700">AI Capabilities Offline</h3>
        <p className="text-slate-500 mt-2 text-sm">
          Stage 4 will introduce integration with Groq to dynamically query customer attributes, segment lists, and generate personalized campaigns.
        </p>
      </div>
    </div>
  );
};

export default AICopilot;
