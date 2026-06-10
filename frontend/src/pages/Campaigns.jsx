import React, { useState, useEffect } from 'react';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api';

const SUGGESTIONS = [
  'Create a WhatsApp campaign for High Value Customers to Increase Repeat Purchases',
  'Write an Email campaign for Delhi Customers to Promote New Collection',
  'Draft an SMS campaign for Inactive Customers to Reactivate them'
];

const Campaigns = () => {
  // Input Prompt State
  const [prompt, setPrompt] = useState('');
  
  // App UI state
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  // Generated AI state
  const [generatedCampaign, setGeneratedCampaign] = useState(null);
  
  // History state
  const [campaignHistory, setCampaignHistory] = useState([]);

  // Load campaign history on mount
  useEffect(() => {
    fetchCampaignHistory();
  }, []);

  const fetchCampaignHistory = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/campaigns`);
      setCampaignHistory(response.data);
    } catch (err) {
      console.error('Error fetching campaigns:', err);
    }
  };

  const handleChipClick = (suggestion) => {
    setPrompt(suggestion);
    setError(null);
    setSuccess(null);
  };

  const handleGenerateCampaign = async () => {
    if (!prompt.trim()) {
      setError('Please enter a campaign prompt first.');
      return;
    }
    
    setLoading(true);
    setError(null);
    setSuccess(null);
    setGeneratedCampaign(null);
    
    try {
      const response = await axios.post(`${API_BASE_URL}/campaigns/generate`, {
        prompt: prompt.trim()
      });
      
      setGeneratedCampaign(response.data);
    } catch (err) {
      console.error('Error generating campaign from prompt:', err);
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError('Unable to parse prompt and generate campaign. Ensure backend is running.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleFieldChange = (field, value) => {
    setGeneratedCampaign(prev => {
      if (!prev) return null;
      return {
        ...prev,
        [field]: value
      };
    });
  };

  const handleSaveCampaign = async () => {
    if (!generatedCampaign) return;
    
    setError(null);
    setSuccess(null);
    
    try {
      const response = await axios.post(`${API_BASE_URL}/campaigns`, generatedCampaign);
      
      setSuccess('Campaign saved successfully!');
      fetchCampaignHistory();
      
      // Update with the saved ID
      setGeneratedCampaign(prev => ({
        ...prev,
        id: response.data.id,
        status: response.data.status,
        createdAt: response.data.createdAt
      }));
    } catch (err) {
      console.error('Error saving campaign:', err);
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError('Failed to save campaign. Please try again.');
      }
    }
  };

  const handleViewSavedCampaign = (campaign) => {
    setError(null);
    setSuccess(null);
    setGeneratedCampaign({
      id: campaign.id,
      audienceName: campaign.audienceName,
      audienceSize: campaign.audienceSize,
      channel: campaign.channel,
      goal: campaign.goal,
      strategy: campaign.strategy,
      recommendedOffer: campaign.recommendedOffer,
      title: campaign.title,
      subject: campaign.subject,
      message: campaign.message,
      cta: campaign.cta,
      aiReasoning: campaign.aiReasoning,
      qualityScore: campaign.qualityScore,
      strengths: campaign.strengths,
      improvements: campaign.improvements,
      status: campaign.status,
      createdAt: campaign.createdAt
    });
    
    // Smooth scroll to builder workspace
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getScoreColorClass = (score) => {
    if (score >= 80) return 'text-emerald-600 bg-emerald-50 border-emerald-200';
    if (score >= 60) return 'text-amber-600 bg-amber-50 border-amber-200';
    return 'text-red-600 bg-red-50 border-red-200';
  };

  const getScoreRingColor = (score) => {
    if (score >= 80) return 'stroke-emerald-500';
    if (score >= 60) return 'stroke-amber-500';
    return 'stroke-red-500';
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-12">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between border-b border-border pb-5">
        <div>
          <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight">AI Campaign Copilot</h2>
          <p className="text-slate-500 mt-1">Describe who to target and what to accomplish. AI will auto-extract targets, select channels, and draft campaigns.</p>
        </div>
      </div>

      {/* Error & Success Alerts */}
      {error && (
        <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm font-semibold flex items-center space-x-2">
          <span>⚠️ {error}</span>
        </div>
      )}
      {success && (
        <div className="bg-emerald-50 border border-emerald-200 text-emerald-700 px-4 py-3 rounded-lg text-sm font-semibold flex items-center space-x-2">
          <span>✅ {success}</span>
        </div>
      )}

      {/* Chat Prompt Box */}
      <div className="bg-white p-6 rounded-2xl border border-border shadow-sm space-y-4">
        <div className="space-y-2">
          <label className="text-sm font-bold text-slate-700 flex items-center space-x-2">
            <span>💬</span>
            <span>Describe Your Campaign Request</span>
          </label>
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="E.g., Write a WhatsApp message to our High Value Customers offering them 15% off to increase repeat purchases."
            rows={3}
            className="w-full p-4 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary text-sm text-slate-700 transition-all resize-none font-medium placeholder-slate-400"
          />
        </div>

        {/* Suggestion Chips */}
        <div className="space-y-2">
          <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">Suggested Requests</p>
          <div className="flex flex-wrap gap-2.5">
            {SUGGESTIONS.map((suggestion, idx) => (
              <button
                key={idx}
                onClick={() => handleChipClick(suggestion)}
                className="px-3.5 py-2 text-xs font-semibold text-slate-600 bg-slate-50 border border-border rounded-full hover:bg-blue-50 hover:text-primary hover:border-primary/30 transition-all cursor-pointer"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>

        {/* Generate Button */}
        <div>
          <button
            onClick={handleGenerateCampaign}
            disabled={loading}
            className="px-6 py-2.5 bg-primary hover:bg-blue-700 text-white font-semibold text-sm rounded-lg shadow transition duration-150 disabled:opacity-50 flex items-center justify-center space-x-2"
          >
            {loading ? (
              <>
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Generating campaign strategy...</span>
              </>
            ) : (
              <>
                <span>✨ Generate Campaign</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Grid Workspace */}
      {generatedCampaign && (
        <div className="space-y-6">
          
          {/* AI Extracted Parameters Header Badge */}
          <div className="bg-slate-50 p-4 rounded-xl border border-border flex flex-wrap gap-4 items-center justify-between shadow-sm">
            <div className="flex flex-wrap gap-3">
              <div className="flex items-center space-x-1 bg-blue-100/70 text-blue-900 border border-blue-200 px-3 py-1.5 rounded-lg text-xs font-bold">
                <span className="text-slate-500 uppercase tracking-wide mr-1">Audience:</span>
                <span>{generatedCampaign.audienceName} ({generatedCampaign.audienceSize} shoppers)</span>
              </div>
              <div className="flex items-center space-x-1 bg-purple-100/70 text-purple-900 border border-purple-200 px-3 py-1.5 rounded-lg text-xs font-bold">
                <span className="text-slate-500 uppercase tracking-wide mr-1">Channel:</span>
                <span>{generatedCampaign.channel}</span>
              </div>
              <div className="flex items-center space-x-1 bg-emerald-100/70 text-emerald-900 border border-emerald-200 px-3 py-1.5 rounded-lg text-xs font-bold">
                <span className="text-slate-500 uppercase tracking-wide mr-1">Goal:</span>
                <span>{generatedCampaign.goal}</span>
              </div>
            </div>
            
            {generatedCampaign.id && (
              <span className="text-xs font-bold bg-slate-200 text-slate-700 px-2.5 py-1 rounded-full border border-slate-300">
                ID: {generatedCampaign.id} • {generatedCampaign.status || 'Draft'}
              </span>
            )}
          </div>

          {/* Editor Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
            
            {/* Left Column: Strategy & Score */}
            <div className="lg:col-span-1 space-y-6">
              
              {/* AI Strategy Card */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-6 rounded-2xl border border-blue-100 shadow-sm space-y-4">
                <h3 className="text-md font-bold text-indigo-950 flex items-center space-x-2 border-b border-indigo-100 pb-2">
                  <span>💡</span>
                  <span>AI Strategy & Offer</span>
                </h3>
                
                <div className="space-y-4 text-sm">
                  <div>
                    <h4 className="font-bold text-indigo-900 text-xs uppercase tracking-wider">Strategic Angle</h4>
                    <p className="text-slate-700 mt-1 leading-relaxed bg-white/70 p-3 rounded-lg border border-indigo-100/50">
                      {generatedCampaign.strategy}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-bold text-indigo-900 text-xs uppercase tracking-wider">Recommended Incentive</h4>
                    <p className="text-slate-700 mt-1 leading-relaxed bg-white/70 p-3 rounded-lg border border-indigo-100/50 font-semibold text-primary">
                      {generatedCampaign.recommendedOffer || 'No specific incentive recommended.'}
                    </p>
                  </div>

                  <div>
                    <h4 className="font-bold text-indigo-900 text-xs uppercase tracking-wider">AI Strategy Rationale</h4>
                    <p className="text-slate-600 mt-1 text-xs leading-relaxed italic">
                      "{generatedCampaign.aiReasoning}"
                    </p>
                  </div>
                </div>
              </div>

              {/* Quality Score Card */}
              <div className="bg-white p-6 rounded-2xl border border-border shadow-sm space-y-4">
                <h3 className="text-md font-bold text-slate-800 border-b border-border pb-2 flex items-center space-x-2">
                  <span>📊</span>
                  <span>Campaign Quality Score</span>
                </h3>
                
                <div className="flex flex-col items-center justify-center p-4 border rounded-xl bg-slate-50 border-border">
                  <div className="relative flex items-center justify-center w-24 h-24">
                    <svg className="w-full h-full transform -rotate-90">
                      <circle cx="48" cy="48" r="40" className="stroke-slate-200 fill-none" strokeWidth="6" />
                      <circle 
                        cx="48" 
                        cy="48" 
                        r="40" 
                        className={`fill-none transition-all duration-500 ${getScoreRingColor(generatedCampaign.qualityScore)}`}
                        strokeWidth="6"
                        strokeDasharray={2 * Math.PI * 40}
                        strokeDashoffset={2 * Math.PI * 40 * (1 - (generatedCampaign.qualityScore / 100))}
                      />
                    </svg>
                    <span className="absolute text-2xl font-black text-slate-800">{generatedCampaign.qualityScore}</span>
                  </div>
                  <span className="text-xs font-semibold mt-2 text-slate-700">Health Index</span>
                </div>

                <div className="space-y-3 pt-2">
                  <div>
                    <h4 className="text-xs font-bold text-emerald-700 uppercase tracking-wider flex items-center space-x-1">
                      <span>✔</span>
                      <span>Strengths</span>
                    </h4>
                    {generatedCampaign.strengths && generatedCampaign.strengths.length > 0 ? (
                      <ul className="list-disc list-inside text-xs text-slate-600 space-y-1 pl-1">
                        {generatedCampaign.strengths.map((str, idx) => (
                          <li key={idx} className="leading-relaxed">{str}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-xs text-slate-400 italic">No specific strengths listed.</p>
                    )}
                  </div>

                  <div>
                    <h4 className="text-xs font-bold text-amber-700 uppercase tracking-wider flex items-center space-x-1">
                      <span>⚠</span>
                      <span>Improvements</span>
                    </h4>
                    {generatedCampaign.improvements && generatedCampaign.improvements.length > 0 ? (
                      <ul className="list-disc list-inside text-xs text-slate-600 space-y-1 pl-1">
                        {generatedCampaign.improvements.map((imp, idx) => (
                          <li key={idx} className="leading-relaxed">{imp}</li>
                        ))}
                      </ul>
                    ) : (
                      <p className="text-xs text-slate-400 italic">Looks solid! No suggestions.</p>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Right Column: Editable Copy Editor */}
            <div className="lg:col-span-2 bg-white p-6 rounded-2xl border border-border shadow-sm space-y-6">
              <div>
                <h3 className="text-lg font-bold text-slate-800 flex items-center space-x-2">
                  <span>✏️</span>
                  <span>Edit Campaign Copy</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Customize the generated title and text copy below.</p>
              </div>

              <div className="space-y-4">
                {/* Campaign Title (Internal Name) */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Campaign Title (Internal)</label>
                  <input
                    type="text"
                    value={generatedCampaign.title}
                    onChange={(e) => handleFieldChange('title', e.target.value)}
                    placeholder="E.g., Exclusive Rewards For Loyal VIPs"
                    className="w-full p-2.5 border border-border rounded-lg bg-background text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-medium"
                  />
                </div>

                {/* Subject Line (Conditional for Email) */}
                {generatedCampaign.channel === 'Email' && (
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Email Subject Line</label>
                    <input
                      type="text"
                      value={generatedCampaign.subject}
                      onChange={(e) => handleFieldChange('subject', e.target.value)}
                      placeholder="E.g., Enjoy an exclusive 15% off your next purchase!"
                      className="w-full p-2.5 border border-border rounded-lg bg-background text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                    />
                  </div>
                )}

                {/* Message Body */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Message Body</label>
                  <textarea
                    value={generatedCampaign.message}
                    onChange={(e) => handleFieldChange('message', e.target.value)}
                    rows={8}
                    className="w-full p-3.5 border border-border rounded-lg bg-background text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-mono leading-relaxed"
                  />
                  {generatedCampaign.channel === 'SMS' && (
                    <div className="text-right text-xs text-slate-400 mt-1">
                      Length: {generatedCampaign.message.length} characters (approx. {Math.ceil(generatedCampaign.message.length / 160)} SMS segments)
                    </div>
                  )}
                </div>

                {/* Call to Action Text */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-500 uppercase tracking-wider">Call to Action (CTA)</label>
                  <input
                    type="text"
                    value={generatedCampaign.cta}
                    onChange={(e) => handleFieldChange('cta', e.target.value)}
                    placeholder="E.g., Shop Now"
                    className="w-full p-2.5 border border-border rounded-lg bg-background text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary font-medium"
                  />
                </div>
              </div>

              {/* Action Save Button */}
              <div className="border-t border-border pt-4 flex justify-end">
                <button
                  onClick={handleSaveCampaign}
                  className="px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-semibold rounded-lg shadow-sm transition duration-150 flex items-center space-x-2 cursor-pointer"
                >
                  <span>💾 Save Campaign Draft</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Campaign History Table */}
      <div className="bg-white p-6 rounded-2xl border border-border shadow-sm space-y-4">
        <div>
          <h3 className="text-xl font-bold text-slate-800 flex items-center space-x-2">
            <span>📋</span>
            <span>Campaign History ({campaignHistory.length})</span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">Review and re-inspect previously generated marketing drafts.</p>
        </div>

        {campaignHistory.length === 0 ? (
          <div className="text-center py-10 text-slate-400 text-sm">
            No saved campaigns found. Start by entering a request above!
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-left border-collapse text-sm">
              <thead>
                <tr className="bg-slate-50 text-slate-500 border-b border-border text-xs font-bold uppercase tracking-wider">
                  <th className="px-6 py-4">Title</th>
                  <th className="px-6 py-4">Audience</th>
                  <th className="px-6 py-4">Channel</th>
                  <th className="px-6 py-4">Goal</th>
                  <th className="px-6 py-4">Created Date</th>
                  <th className="px-6 py-4 text-center">Score</th>
                  <th className="px-6 py-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-slate-700">
                {campaignHistory.map((camp) => (
                  <tr key={camp.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="font-semibold text-slate-900">{camp.title}</div>
                      {camp.recommendedOffer && (
                        <div className="text-xs text-primary font-medium mt-0.5">{camp.recommendedOffer}</div>
                      )}
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-800">{camp.audienceName}</div>
                      <div className="text-xs text-slate-400 mt-0.5">Size: {camp.audienceSize} shoppers</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-0.5 text-xs font-semibold rounded-full ${
                        camp.channel === 'WhatsApp' ? 'bg-emerald-100 text-emerald-800' :
                        camp.channel === 'Email' ? 'bg-blue-100 text-blue-800' :
                        'bg-purple-100 text-purple-800'
                      }`}>
                        {camp.channel}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600 font-medium text-xs">{camp.goal}</td>
                    <td className="px-6 py-4 text-slate-500 text-xs">
                      {new Date(camp.createdAt).toLocaleDateString()} {new Date(camp.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2.5 py-1 rounded-lg text-xs font-black border ${
                        camp.qualityScore >= 80 ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
                        camp.qualityScore >= 60 ? 'bg-amber-50 text-amber-700 border-amber-200' :
                        'bg-red-50 text-red-700 border-red-200'
                      }`}>
                        {camp.qualityScore}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleViewSavedCampaign(camp)}
                        className="px-3.5 py-1.5 bg-slate-50 hover:bg-blue-50 text-slate-700 hover:text-primary border border-border hover:border-primary/30 rounded-lg text-xs font-bold transition duration-150 cursor-pointer"
                      >
                        👁️ View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default Campaigns;
