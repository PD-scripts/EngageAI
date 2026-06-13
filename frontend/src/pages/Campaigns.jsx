import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, 
  Send, 
  Settings, 
  Target, 
  AlertCircle, 
  CheckCircle, 
  FileText, 
  Plus, 
  Activity, 
  Sliders, 
  ChevronRight,
  Eye,
  Rocket,
  RefreshCw,
  Clock,
  CheckCircle2,
  XCircle,
  MailOpen,
  MousePointerClick,
  CheckSquare
} from 'lucide-react';

const API_BASE_URL = 'http://localhost:5000/api';

const SUGGESTIONS = [
  'Create a WhatsApp campaign for High Value Customers to Increase Repeat Purchases',
  'Write an Email campaign for Delhi Customers to Promote New Collection',
  'Draft an SMS campaign for Inactive Customers to Reactivate them'
];

const AUDIENCES = [
  'All Customers',
  'High Value Customers',
  'Delhi Customers',
  'Mumbai Customers',
  'Pune Customers',
  'Hyderabad Customers',
  'Inactive Customers',
  'Frequent Buyers'
];

const CHANNELS = ['Email', 'WhatsApp', 'SMS'];

const GOALS = [
  'Increase Sales',
  'Increase Repeat Purchases',
  'Reactivate Customers',
  'Promote New Collection',
  'Clear Inventory'
];

const Campaigns = () => {
  const location = useLocation();

  // Inputs
  const [audiences, setAudiences] = useState(AUDIENCES);
  const [prompt, setPrompt] = useState('');
  const [selectedAudience, setSelectedAudience] = useState('All Customers');
  const [selectedChannel, setSelectedChannel] = useState('Email');
  const [selectedGoal, setSelectedGoal] = useState('Increase Sales');

  // App UI state
  const [loading, setLoading] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  
  // Active selected campaign details
  const [generatedCampaign, setGeneratedCampaign] = useState(null);
  
  // Real-time tracking metrics (Stage 6)
  const [campaignStats, setCampaignStats] = useState(null);
  const [activityFeed, setActivityFeed] = useState([]);
  const [statsLoading, setStatsLoading] = useState(false);

  // Saved campaigns list
  const [campaignHistory, setCampaignHistory] = useState([]);

  // Check landing parameters on mount
  useEffect(() => {
    if (location.state?.prompt) {
      setPrompt(location.state.prompt);
    }
    if (location.state?.prefilledAudience) {
      setSelectedAudience('High Value Customers');
    }

    // Auto-fill from AI Strategist campaign draft
    if (location.state?.draft) {
      const draft = location.state.draft;
      
      // Update dynamic audiences list if not present
      setAudiences(prev => {
        if (!prev.includes(draft.audience)) {
          return [...prev, draft.audience];
        }
        return prev;
      });
      
      // Map campaignType to GOALS
      let goal = 'Increase Sales';
      if (draft.campaignType === 'Reactivation') {
        goal = 'Reactivate Customers';
      } else if (draft.campaignType === 'Birthday') {
        goal = 'Increase Repeat Purchases';
      }
      
      // Set parameters setup states
      setSelectedAudience(draft.audience);
      setSelectedChannel(draft.channel);
      setSelectedGoal(goal);
      setPrompt(draft.recommendationSource);
      
      // Set generated campaign editor states
      setGeneratedCampaign({
        title: draft.campaignName,
        message: draft.message,
        cta: draft.campaignType === 'Reactivation' ? 'Claim 15% Off' : draft.campaignType === 'Birthday' ? 'Claim Birthday Treat' : 'Order Now',
        subject: draft.channel === 'Email' ? `Special Deal: ${draft.campaignName}` : '',
        audienceName: draft.audience,
        audienceSize: 24, // Simulated segment size
        channel: draft.channel,
        goal: goal,
        strategy: `AI Recommendation Strategy: ${draft.campaignType}`,
        recommendedOffer: draft.campaignType === 'Reactivation' ? '15% Off Win Back Offer' : draft.campaignType === 'Birthday' ? 'Complimentary Coffee' : 'Cold Brew Special',
        aiReasoning: 'This campaign draft was parsed and generated automatically by ENGAGEAI Agent from an executive recommendation.',
        qualityScore: 92,
        strengths: ['Highly personalized incentive', 'Tailored delivery channel selection', 'Clear customer call to action'],
        improvements: ['Consider experimenting with alternative offer amounts'],
        status: 'Draft'
      });
    }

    fetchCampaignHistory();
  }, [location]);

  // Polling hook: Poll stats every 5 seconds if campaign is sent
  useEffect(() => {
    let intervalId = null;

    if (generatedCampaign?.id && generatedCampaign?.status === 'Sent') {
      // Fetch immediately
      fetchStatsAndFeed(generatedCampaign.id);

      // Setup interval
      intervalId = setInterval(() => {
        fetchStatsAndFeed(generatedCampaign.id);
      }, 5000);
    } else {
      setCampaignStats(null);
      setActivityFeed([]);
    }

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, [generatedCampaign?.id, generatedCampaign?.status]);

  const fetchCampaignHistory = async () => {
    try {
      const response = await axios.get(`${API_BASE_URL}/campaigns`);
      setCampaignHistory(response.data);
    } catch (err) {
      console.error('Error fetching campaigns list:', err);
    }
  };

  const fetchStatsAndFeed = async (campId) => {
    try {
      setStatsLoading(true);
      const response = await axios.get(`${API_BASE_URL}/campaigns/${campId}/stats`);
      setCampaignStats(response.data.stats);
      setActivityFeed(response.data.feed);
    } catch (err) {
      console.error('Error loading stats:', err.message);
    } finally {
      setStatsLoading(false);
    }
  };

  const handleChipClick = (suggestion) => {
    setPrompt(suggestion);
    setError(null);
    setSuccess(null);
  };

  const handleGenerateCampaign = async () => {
    if (!prompt.trim()) {
      setError('Please describe your campaign intent or click a suggestion.');
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
      if (response.data.audienceName) setSelectedAudience(response.data.audienceName);
      if (response.data.channel) setSelectedChannel(response.data.channel);
      if (response.data.goal) setSelectedGoal(response.data.goal);
    } catch (err) {
      console.error('Error generating campaign:', err);
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError('Unable to parse prompt and generate campaign. Ensure backend is running.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateManual = async () => {
    const generatedPrompt = `Create a ${selectedChannel} campaign for ${selectedAudience} to ${selectedGoal}`;
    setPrompt(generatedPrompt);
    
    setLoading(true);
    setError(null);
    setSuccess(null);
    setGeneratedCampaign(null);
    
    try {
      const response = await axios.post(`${API_BASE_URL}/campaigns/generate`, {
        prompt: generatedPrompt
      });
      setGeneratedCampaign(response.data);
    } catch (err) {
      console.error('Error generating campaign:', err);
      setError('Failed to generate campaign. Check if backend is online.');
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
      
      setGeneratedCampaign(prev => ({
        ...prev,
        id: response.data.id,
        status: response.data.status,
        createdAt: response.data.createdAt
      }));
    } catch (err) {
      console.error('Error saving campaign:', err);
      setError('Failed to save campaign. Please check database logs.');
    }
  };

  // Stage 6 Action: Launch/Send Campaign
  const handleLaunchCampaign = async () => {
    if (!generatedCampaign?.id) {
      setError('Please save the campaign draft first before launching.');
      return;
    }

    setSending(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await axios.post(`${API_BASE_URL}/campaigns/${generatedCampaign.id}/send`);
      setSuccess(response.data.message);
      
      // Update local state status to Sent to immediately trigger polling logic
      setGeneratedCampaign(prev => ({
        ...prev,
        status: 'Sent'
      }));
      fetchCampaignHistory();
    } catch (err) {
      console.error('Error launching campaign send:', err);
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError('Failed to send campaign. Please check connection to Channel Service.');
      }
    } finally {
      setSending(false);
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
    
    if (campaign.audienceName) setSelectedAudience(campaign.audienceName);
    if (campaign.channel) setSelectedChannel(campaign.channel);
    if (campaign.goal) setSelectedGoal(campaign.goal);

    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getScoreColor = (score) => {
    if (score >= 80) return 'stroke-success text-success';
    if (score >= 60) return 'stroke-warning text-warning';
    return 'stroke-danger text-danger';
  };

  const getFeedIcon = (type) => {
    switch (type) {
      case 'SENT': return <Rocket className="h-3.5 w-3.5 text-primary" />;
      case 'DELIVERED': return <CheckCircle2 className="h-3.5 w-3.5 text-success" />;
      case 'FAILED': return <XCircle className="h-3.5 w-3.5 text-danger" />;
      case 'OPENED': return <MailOpen className="h-3.5 w-3.5 text-indigo-500" />;
      case 'CLICKED': return <MousePointerClick className="h-3.5 w-3.5 text-warning" />;
      case 'PURCHASED': return <CheckSquare className="h-3.5 w-3.5 text-success" />;
      default: return <Clock className="h-3.5 w-3.5 text-text-muted" />;
    }
  };

  return (
    <div className="space-y-8 pb-16">
      
      {/* Page Header */}
      <div>
        <h2 className="text-2xl font-bold text-text-main tracking-tight">Campaign Builder</h2>
        <p className="text-text-muted mt-0.5 text-xs font-medium">
          Create, edit, and evaluate marketing communication drafts optimized dynamically by AI.
        </p>
      </div>

      {/* Alerts */}
      {error && (
        <div className="bg-danger/5 border border-danger/10 text-danger p-4 rounded-xl text-xs font-bold flex items-center space-x-2">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}
      {success && (
        <div className="bg-success/5 border border-success/10 text-success p-4 rounded-xl text-xs font-bold flex items-center space-x-2">
          <CheckCircle className="h-4 w-4 shrink-0" />
          <span>{success}</span>
        </div>
      )}

      {/* Hero AI Prompter */}
      <div className="bg-white p-6 rounded-2xl border border-border shadow-xs space-y-4">
        <div className="space-y-2">
          <label className="text-xs font-bold text-text-muted uppercase tracking-wider block flex items-center space-x-1">
            <Sparkles className="h-4 w-4 text-primary" />
            <span>AI Campaign Ideation Prompt</span>
          </label>
          <div className="flex flex-col sm:flex-row gap-3">
            <input
              type="text"
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Describe campaign goals... e.g., SMS collection drop for Mumbai VIPs"
              className="flex-1 px-4 py-2.5 text-xs border border-border rounded-xl bg-slate-50/50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-text-main font-semibold"
            />
            <button
              onClick={handleGenerateCampaign}
              disabled={loading}
              className="px-5 py-2.5 bg-primary text-white text-xs font-semibold rounded-xl hover:bg-primary/95 transition-colors flex items-center justify-center space-x-2 shrink-0 cursor-pointer disabled:opacity-50"
            >
              {loading ? (
                <>
                  <div className="animate-spin h-3.5 w-3.5 border-2 border-white border-t-transparent rounded-full" />
                  <span>Generating Draft...</span>
                </>
              ) : (
                <>
                  <Sparkles className="h-3.5 w-3.5" />
                  <span>AI Generate</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* Suggestion Chips */}
        <div className="space-y-2">
          <p className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Suggested Copilot Requests</p>
          <div className="flex flex-wrap gap-2">
            {SUGGESTIONS.map((suggestion, idx) => (
              <button
                key={idx}
                onClick={() => handleChipClick(suggestion)}
                className="px-3 py-1.5 text-xs font-semibold text-text-muted bg-slate-50 border border-border rounded-full hover:bg-slate-100 hover:text-text-main transition-colors cursor-pointer"
              >
                {suggestion}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Two-Panel Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column (5/12): Setup Panel */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-border shadow-xs space-y-6">
          <h3 className="text-sm font-bold text-text-main uppercase tracking-wider flex items-center space-x-2 border-b border-border pb-3">
            <Sliders className="h-4 w-4 text-text-muted" />
            <span>Campaign Parameters Setup</span>
          </h3>

          <div className="space-y-5 text-xs font-semibold text-text-main">
            {/* Target Audience */}
            <div className="space-y-1.5">
              <label className="text-[10px] text-text-muted uppercase font-bold tracking-wider">Target Segment</label>
              <select
                value={selectedAudience}
                onChange={(e) => setSelectedAudience(e.target.value)}
                disabled={generatedCampaign?.status === 'Sent'}
                className="w-full px-3.5 py-2.5 border border-border rounded-xl bg-slate-50/50 focus:bg-white text-text-main cursor-pointer outline-none disabled:opacity-60"
              >
                {audiences.map((a) => <option key={a} value={a}>{a}</option>)}
              </select>
            </div>

            {/* Communication Channel */}
            <div className="space-y-1.5">
              <label className="text-[10px] text-text-muted uppercase font-bold tracking-wider">Target Channel</label>
              <select
                value={selectedChannel}
                onChange={(e) => setSelectedChannel(e.target.value)}
                disabled={generatedCampaign?.status === 'Sent'}
                className="w-full px-3.5 py-2.5 border border-border rounded-xl bg-slate-50/50 focus:bg-white text-text-main cursor-pointer outline-none disabled:opacity-60"
              >
                {CHANNELS.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>

            {/* Campaign Goal */}
            <div className="space-y-1.5">
              <label className="text-[10px] text-text-muted uppercase font-bold tracking-wider">Campaign Goal</label>
              <select
                value={selectedGoal}
                onChange={(e) => setSelectedGoal(e.target.value)}
                disabled={generatedCampaign?.status === 'Sent'}
                className="w-full px-3.5 py-2.5 border border-border rounded-xl bg-slate-50/50 focus:bg-white text-text-main cursor-pointer outline-none disabled:opacity-60"
              >
                {GOALS.map((g) => <option key={g} value={g}>{g}</option>)}
              </select>
            </div>

            <button
              onClick={handleGenerateManual}
              disabled={loading || generatedCampaign?.status === 'Sent'}
              className="w-full py-2.5 bg-slate-100 hover:bg-slate-200/80 text-text-main text-xs font-bold rounded-xl border border-border transition-colors cursor-pointer disabled:opacity-50"
            >
              Compile Setup Draft
            </button>
          </div>
        </div>

        {/* Right Column (7/12): Copilot Strategy & Editor Workspace */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-border shadow-xs space-y-6 min-h-[480px]">
          
          {loading && (
            <div className="flex flex-col items-center justify-center space-y-4 py-32 text-xs text-text-muted font-bold">
              <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full" />
              <span>AI Strategist drafting campaign...</span>
            </div>
          )}

          {!loading && !generatedCampaign && (
            <div className="flex flex-col items-center justify-center py-28 text-center space-y-3">
              <FileText className="h-10 w-10 text-slate-300" />
              <h4 className="text-sm font-bold text-text-main">No Campaign Active</h4>
              <p className="text-xs text-text-muted max-w-xs font-medium">
                Enter a request above or adjust the parameters on the left to review the AI strategy.
              </p>
            </div>
          )}

          {!loading && generatedCampaign && (
            <div className="space-y-6">
              
              {/* Header metadata pill */}
              <div className="flex flex-wrap gap-2 items-center justify-between border-b border-border pb-4">
                <div>
                  <h4 className="text-sm font-bold text-text-main">AI Strategic Draft Output</h4>
                  <p className="text-[10px] text-text-muted font-semibold mt-0.5">Audience Segment size: {generatedCampaign.audienceSize} shoppers</p>
                </div>
                
                <span className={`text-[9px] font-black uppercase px-2.5 py-1 rounded border ${
                  generatedCampaign.status === 'Sent'
                    ? 'bg-success/5 text-success border-success/20'
                    : 'bg-slate-100 text-slate-700 border-border'
                }`}>
                  {generatedCampaign.status || 'Draft'}
                </span>
              </div>

              {/* Real-time statistics cards (Stage 6 SEND active view) */}
              {generatedCampaign.status === 'Sent' && (
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <h5 className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Live Delivery Stats</h5>
                    <div className="flex items-center space-x-1 text-[9px] font-bold text-primary bg-primary/5 px-2 py-0.5 rounded border border-primary/10">
                      <RefreshCw className="h-2.5 w-2.5 animate-spin" />
                      <span>Polling events (5s)</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    <div className="bg-slate-50 border border-border p-3 rounded-xl">
                      <span className="text-[8px] text-text-muted font-bold uppercase tracking-wider block">Total Sent</span>
                      <span className="text-base font-black text-text-main">{campaignStats?.sent ?? '...'}</span>
                    </div>
                    <div className="bg-success/5 border border-success/10 p-3 rounded-xl">
                      <span className="text-[8px] text-success font-bold uppercase tracking-wider block">Delivered</span>
                      <span className="text-base font-black text-success">{campaignStats?.delivered ?? '...'}</span>
                    </div>
                    <div className="bg-danger/5 border border-danger/10 p-3 rounded-xl">
                      <span className="text-[8px] text-danger font-bold uppercase tracking-wider block">Failed</span>
                      <span className="text-base font-black text-danger">{campaignStats?.failed ?? '...'}</span>
                    </div>
                    <div className="bg-slate-50 border border-border p-3 rounded-xl">
                      <span className="text-[8px] text-text-muted font-bold uppercase tracking-wider block">Opened</span>
                      <span className="text-base font-black text-text-main">{campaignStats?.opened ?? '...'}</span>
                    </div>
                    <div className="bg-slate-50 border border-border p-3 rounded-xl">
                      <span className="text-[8px] text-text-muted font-bold uppercase tracking-wider block">Clicked</span>
                      <span className="text-base font-black text-text-main">{campaignStats?.clicked ?? '...'}</span>
                    </div>
                    <div className="bg-primary/5 border border-primary/10 p-3 rounded-xl">
                      <span className="text-[8px] text-primary font-bold uppercase tracking-wider block">Purchased</span>
                      <span className="text-base font-black text-primary">{campaignStats?.purchased ?? '...'}</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Strategy & Recommended Offer */}
              {generatedCampaign.status !== 'Sent' && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                  <div className="p-4 bg-slate-50 border border-border rounded-xl space-y-1">
                    <span className="text-[9px] text-text-muted uppercase font-bold tracking-wider">AI Strategic Direction</span>
                    <p className="text-text-main font-bold leading-relaxed">{generatedCampaign.strategy}</p>
                  </div>
                  
                  <div className="p-4 bg-primary/5 border border-primary/10 rounded-xl space-y-1">
                    <span className="text-[9px] text-primary uppercase font-bold tracking-wider">Recommended Offer Incentive</span>
                    <p className="text-text-main font-black leading-relaxed">{generatedCampaign.recommendedOffer || 'No specific incentive'}</p>
                  </div>
                </div>
              )}

              {/* Copy Editor Inputs */}
              <div className="space-y-4 text-xs font-semibold text-text-main">
                {/* Title */}
                <div className="space-y-1">
                  <label className="text-[10px] text-text-muted uppercase font-bold tracking-wider">Internal Title</label>
                  <input
                    type="text"
                    value={generatedCampaign.title}
                    onChange={(e) => handleFieldChange('title', e.target.value)}
                    disabled={generatedCampaign.status === 'Sent'}
                    className="w-full px-3 py-2 border border-border rounded-xl focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-text-main font-bold disabled:opacity-75"
                  />
                </div>

                {/* Subject */}
                {generatedCampaign.channel === 'Email' && (
                  <div className="space-y-1">
                    <label className="text-[10px] text-text-muted uppercase font-bold tracking-wider">Subject Line</label>
                    <input
                      type="text"
                      value={generatedCampaign.subject}
                      onChange={(e) => handleFieldChange('subject', e.target.value)}
                      disabled={generatedCampaign.status === 'Sent'}
                      className="w-full px-3 py-2 border border-border rounded-xl focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-text-main disabled:opacity-75"
                    />
                  </div>
                )}

                {/* Message Box */}
                <div className="space-y-1">
                  <label className="text-[10px] text-text-muted uppercase font-bold tracking-wider">Draft Copy Body</label>
                  <textarea
                    value={generatedCampaign.message}
                    onChange={(e) => handleFieldChange('message', e.target.value)}
                    disabled={generatedCampaign.status === 'Sent'}
                    rows={6}
                    className="w-full p-3 border border-border rounded-xl focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-text-main leading-relaxed font-mono font-medium text-xs bg-slate-50/30 disabled:opacity-75"
                  />
                </div>

                {/* CTA */}
                <div className="space-y-1">
                  <label className="text-[10px] text-text-muted uppercase font-bold tracking-wider">CTA Button Action</label>
                  <input
                    type="text"
                    value={generatedCampaign.cta}
                    onChange={(e) => handleFieldChange('cta', e.target.value)}
                    disabled={generatedCampaign.status === 'Sent'}
                    className="w-full px-3 py-2 border border-border rounded-xl focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary text-text-main disabled:opacity-75"
                  />
                </div>
              </div>

              {/* Action Buttons Panel */}
              <div className="flex justify-between items-center border-t border-border pt-4">
                <div>
                  {generatedCampaign.status === 'Sent' && (
                    <span className="text-[10px] text-text-muted font-bold block">
                      Campaign launched and active. Tracking callback endpoints.
                    </span>
                  )}
                </div>

                <div className="flex items-center space-x-3">
                  {generatedCampaign.status !== 'Sent' && (
                    <button
                      onClick={handleSaveCampaign}
                      className="px-4 py-2 bg-slate-100 hover:bg-slate-200/80 border border-border text-text-main text-xs font-bold rounded-xl transition-colors cursor-pointer"
                    >
                      Save Draft
                    </button>
                  )}

                  {generatedCampaign.status === 'Draft' && generatedCampaign.id && (
                    <button
                      onClick={handleLaunchCampaign}
                      disabled={sending}
                      className="px-4 py-2 bg-primary hover:bg-primary/95 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer flex items-center space-x-1.5"
                    >
                      {sending ? (
                        <>
                          <div className="animate-spin h-3 w-3 border-2 border-white border-t-transparent rounded-full" />
                          <span>Sending...</span>
                        </>
                      ) : (
                        <>
                          <Rocket className="h-3.5 w-3.5" />
                          <span>Launch Campaign</span>
                        </>
                      )}
                    </button>
                  )}
                </div>
              </div>

              {/* Real-time Webhook Activity Logs feed (Stage 6) */}
              {generatedCampaign.status === 'Sent' && (
                <div className="border-t border-border pt-5 space-y-3">
                  <h5 className="text-[10px] font-bold text-text-muted uppercase tracking-wider">Delivery Event Logs Feed</h5>
                  
                  {activityFeed.length === 0 ? (
                    <p className="text-[10px] text-text-muted italic py-4 text-center">
                      Waiting for incoming callbacks from Channel Service...
                    </p>
                  ) : (
                    <div className="max-h-48 overflow-y-auto space-y-2.5 pr-2.5">
                      {activityFeed.map((evt) => (
                        <div 
                          key={evt.id} 
                          className="flex items-start space-x-3 text-[10px] font-bold text-text-main bg-slate-50 border border-border p-2.5 rounded-xl hover:bg-slate-100 transition-colors"
                        >
                          <div className="mt-0.5">{getFeedIcon(evt.type)}</div>
                          <div className="flex-1 space-y-0.5">
                            <p className="leading-normal">{evt.text}</p>
                            <span className="text-[8px] text-text-muted font-semibold">
                              {new Date(evt.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit', second: '2-digit'})}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              )}

            </div>
          )}

        </div>

      </div>

      {/* Campaigns History Archive */}
      <div className="bg-white p-6 rounded-2xl border border-border shadow-xs space-y-4">
        <div>
          <h3 className="text-lg font-bold text-text-main tracking-tight flex items-center space-x-2">
            <Plus className="h-4.5 w-4.5 text-text-muted" />
            <span>Campaign Archives & Schedules ({campaignHistory.length})</span>
          </h3>
          <p className="text-xs text-text-muted font-medium mt-0.5">Review, re-inspect, and trigger execution of previously compiled AI drafts.</p>
        </div>

        {campaignHistory.length === 0 ? (
          <div className="text-center py-10 text-xs text-text-muted font-bold">
            No compiled strategies logged. Generate a new campaign prompt to initialize.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/70 text-text-muted border-b border-border font-bold uppercase tracking-wider">
                  <th className="px-6 py-4">Campaign Name</th>
                  <th className="px-6 py-4">Audience Target</th>
                  <th className="px-6 py-4">Channel</th>
                  <th className="px-6 py-4">Quality Score</th>
                  <th className="px-6 py-4">Status</th>
                  <th className="px-6 py-4">Created Window</th>
                  <th className="px-6 py-4 text-center">Inspect</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-text-main font-semibold">
                {campaignHistory.map((camp, idx) => (
                  <tr key={camp.id || idx} className="hover:bg-slate-50/50 transition-colors duration-150">
                    <td className="px-6 py-4">
                      <div className="font-bold text-text-main">{camp.title}</div>
                      {camp.recommendedOffer && <div className="text-[10px] text-primary mt-0.5 font-bold">{camp.recommendedOffer}</div>}
                    </td>
                    <td className="px-6 py-4">
                      <div>{camp.audienceName}</div>
                      <div className="text-[10px] text-text-muted font-semibold mt-0.5">Size: {camp.audienceSize} shoppers</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 text-[9px] font-black rounded-full uppercase border ${
                        camp.channel === 'WhatsApp' ? 'bg-success/10 text-success border-success/20' :
                        camp.channel === 'Email' ? 'bg-primary/10 text-primary border-primary/20' :
                        'bg-slate-100 text-slate-700 border-slate-200'
                      }`}>
                        {camp.channel}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2 py-0.5 text-[9px] font-black rounded-lg border ${
                        camp.qualityScore >= 80 ? 'bg-success/5 text-success border-success/15' :
                        camp.qualityScore >= 60 ? 'bg-warning/5 text-warning border-warning/15' :
                        'bg-danger/5 text-danger border-danger/15'
                      }`}>
                        Index {camp.qualityScore}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`px-2.5 py-0.5 text-[9px] font-black rounded-full uppercase border ${
                        camp.status === 'Sent'
                          ? 'bg-success/10 text-success border-success/20'
                          : 'bg-slate-100 text-slate-700 border-slate-200'
                      }`}>
                        {camp.status || 'Draft'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-text-muted">
                      {new Date(camp.createdAt).toLocaleDateString()} {new Date(camp.createdAt).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button
                        onClick={() => handleViewSavedCampaign(camp)}
                        className="inline-flex items-center space-x-1 px-3 py-1.5 bg-slate-50 hover:bg-slate-100 border border-border hover:border-primary/30 rounded-lg text-[10px] font-bold text-text-main transition-colors cursor-pointer"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        <span>Inspect</span>
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
