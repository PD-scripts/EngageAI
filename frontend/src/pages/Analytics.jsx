import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  Tooltip, 
  ResponsiveContainer, 
  LineChart, 
  Line, 
  Legend,
  CartesianGrid
} from 'recharts';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Send, 
  DollarSign, 
  Activity, 
  MapPin, 
  AlertTriangle,
  Award,
  Sparkles,
  Zap,
  Globe
} from 'lucide-react';

import { API_BASE_URL } from '../config/api';

// Animated Counter for Premium Aesthetic
const AnimatedNumber = ({ value, prefix = "", suffix = "" }) => {
  const [current, setCurrent] = useState(0);

  useEffect(() => {
    let start = 0;
    const end = parseFloat(value);
    if (isNaN(end)) {
      setCurrent(value);
      return;
    }
    if (start === end) {
      setCurrent(end);
      return;
    }
    
    const duration = 800; // ms
    const range = end - start;
    let currentNum = start;
    const increment = end > start ? 1 : -1;
    const stepTime = Math.abs(Math.floor(duration / range));
    const finalStepTime = Math.max(stepTime, 16); // cap at ~60fps
    
    const stepCount = duration / finalStepTime;
    const stepValue = range / stepCount;

    const timer = setInterval(() => {
      currentNum += stepValue;
      if ((stepValue > 0 && currentNum >= end) || (stepValue < 0 && currentNum <= end)) {
        clearInterval(timer);
        setCurrent(end);
      } else {
        setCurrent(currentNum);
      }
    }, finalStepTime);

    return () => clearInterval(timer);
  }, [value]);

  const formatted = typeof value === 'number' 
    ? (Number.isInteger(value) ? Math.round(current).toLocaleString() : current.toFixed(1))
    : value;

  return <span>{prefix}{formatted}{suffix}</span>;
};

// Skeleton Loaders
const SkeletonCard = () => (
  <div className="bg-white p-5 rounded-2xl border border-border shadow-xs animate-pulse space-y-3">
    <div className="h-3 bg-slate-200 rounded w-1/3" />
    <div className="h-8 bg-slate-200 rounded w-2/3" />
    <div className="h-3 bg-slate-200 rounded w-1/2" />
  </div>
);

const SkeletonChart = () => (
  <div className="bg-white p-6 rounded-2xl border border-border shadow-xs animate-pulse space-y-4">
    <div className="h-4 bg-slate-200 rounded w-1/4" />
    <div className="h-60 bg-slate-100 rounded" />
  </div>
);

const SkeletonTable = () => (
  <div className="bg-white p-6 rounded-2xl border border-border shadow-xs animate-pulse space-y-4">
    <div className="h-4 bg-slate-200 rounded w-1/3" />
    <div className="space-y-3">
      {[1, 2, 3, 4].map(n => (
        <div key={n} className="grid grid-cols-4 gap-4">
          <div className="h-3 bg-slate-100 rounded" />
          <div className="h-3 bg-slate-100 rounded" />
          <div className="h-3 bg-slate-100 rounded" />
          <div className="h-3 bg-slate-100 rounded" />
        </div>
      ))}
    </div>
  </div>
);

const Analytics = () => {
  const [loading, setLoading] = useState(true);
  const [overview, setOverview] = useState(null);
  const [campaignData, setCampaignData] = useState([]);
  const [channelData, setChannelData] = useState([]);
  const [cityData, setCityData] = useState([]);
  const [audienceData, setAudienceData] = useState([]);
  const [customerData, setCustomerData] = useState(null);
  const [activeCustomerTab, setActiveCustomerTab] = useState('topCustomers');

  useEffect(() => {
    const fetchAnalytics = async () => {
      setLoading(true);
      try {
        const [overviewRes, campaignsRes, channelsRes, citiesRes, audiencesRes, customersRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/analytics/overview`),
          axios.get(`${API_BASE_URL}/analytics/campaigns`),
          axios.get(`${API_BASE_URL}/analytics/channels`),
          axios.get(`${API_BASE_URL}/analytics/cities`),
          axios.get(`${API_BASE_URL}/analytics/audiences`),
          axios.get(`${API_BASE_URL}/analytics/customers`)
        ]);

        setOverview(overviewRes.data);
        setCampaignData(campaignsRes.data);
        setChannelData(channelsRes.data);
        setCityData(citiesRes.data);
        setAudienceData(audiencesRes.data);
        setCustomerData(customersRes.data);
      } catch (err) {
        console.error('Error fetching analytics engine data:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchAnalytics();
  }, []);

  // Compute key city intelligence cards
  const getCityInsights = () => {
    if (!cityData || cityData.length === 0) return { highestRev: '-', highestSpend: '-', highestInactive: '-', bestEngagement: '-' };

    const sortedByRevenue = [...cityData].sort((a, b) => b.revenue - a.revenue);
    const sortedByAvgSpend = [...cityData].sort((a, b) => b.averageSpend - a.averageSpend);
    const sortedByInactivity = [...cityData].sort((a, b) => b.inactiveRate - a.inactiveRate);
    const sortedByEngagement = [...cityData].sort((a, b) => b.campaignEngagement - a.campaignEngagement);

    return {
      highestRev: sortedByRevenue[0]?.city || 'N/A',
      highestSpend: sortedByAvgSpend[0]?.city || 'N/A',
      highestInactive: sortedByInactivity[0]?.city || 'N/A',
      bestEngagement: sortedByEngagement[0]?.city || 'N/A'
    };
  };

  const cityInsights = getCityInsights();

  if (loading) {
    return (
      <div className="space-y-8 pb-16">
        <div>
          <h2 className="text-2xl font-bold text-text-main tracking-tight animate-pulse">Loading Analytics Engine...</h2>
          <p className="text-text-muted mt-0.5 text-xs font-medium">Assembling live database ledger metrics.</p>
        </div>

        {/* Loading Skeletons */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          {[1, 2, 3, 4].map(n => <SkeletonCard key={n} />)}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          <div className="lg:col-span-8">
            <SkeletonChart />
          </div>
          <div className="lg:col-span-4">
            <SkeletonChart />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <SkeletonTable />
          <SkeletonTable />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-16">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-border pb-5">
        <div>
          <h2 className="text-2xl font-bold text-text-main tracking-tight flex items-center space-x-2">
            <BarChart3 className="h-6 w-6 text-primary" />
            <span>Analytics Engine</span>
          </h2>
          <p className="text-text-muted mt-0.5 text-xs font-medium">
            Aggregated customer, campaign, and channel intelligence metrics sourced from MongoDB.
          </p>
        </div>
        <div className="flex items-center space-x-2 bg-success/5 border border-success/20 px-3 py-1.5 rounded-lg text-xs font-bold text-success w-fit">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Real-time Ledger Connected</span>
        </div>
      </div>

      {/* Section 1: Executive KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
        
        {/* Total Customers */}
        <div className="bg-white p-5 rounded-2xl border border-border shadow-xs space-y-2 relative overflow-hidden group hover:border-primary/20 transition-all duration-200">
          <div className="flex justify-between items-center">
            <span className="text-[10px] text-text-muted uppercase font-bold tracking-wider">Total Database Customers</span>
            <Users className="h-4.5 w-4.5 text-text-muted group-hover:text-primary transition-colors" />
          </div>
          <div className="text-3xl font-black text-text-main">
            <AnimatedNumber value={overview?.totalCustomers ?? 0} />
          </div>
          <p className="text-[10px] text-text-muted font-semibold">Active profiles in system memory</p>
        </div>

        {/* Total Campaigns */}
        <div className="bg-white p-5 rounded-2xl border border-border shadow-xs space-y-2 relative overflow-hidden group hover:border-primary/20 transition-all duration-200">
          <div className="flex justify-between items-center">
            <span className="text-[10px] text-text-muted uppercase font-bold tracking-wider">Total Campaigns Sent</span>
            <Send className="h-4.5 w-4.5 text-text-muted group-hover:text-primary transition-colors" />
          </div>
          <div className="text-3xl font-black text-text-main">
            <AnimatedNumber value={overview?.totalCampaigns ?? 0} />
          </div>
          <p className="text-[10px] text-text-muted font-semibold">AI marketing broadcasts dispatched</p>
        </div>

        {/* Total Revenue */}
        <div className="bg-white p-5 rounded-2xl border border-border shadow-xs space-y-2 relative overflow-hidden group hover:border-primary/20 transition-all duration-200">
          <div className="flex justify-between items-center">
            <span className="text-[10px] text-text-muted uppercase font-bold tracking-wider">Accumulated Revenue</span>
            <DollarSign className="h-4.5 w-4.5 text-text-muted group-hover:text-primary transition-colors" />
          </div>
          <div className="text-3xl font-black text-text-main">
            <AnimatedNumber value={overview?.totalRevenue ?? 0} prefix="₹" />
          </div>
          <p className="text-[10px] text-success font-bold flex items-center space-x-1">
            <TrendingUp className="h-3 w-3" />
            <span>Sum of lifetime transactions</span>
          </p>
        </div>

        {/* Conversion Rate */}
        <div className="bg-white p-5 rounded-2xl border border-border shadow-xs space-y-2 relative overflow-hidden group hover:border-primary/20 transition-all duration-200">
          <div className="flex justify-between items-center">
            <span className="text-[10px] text-text-muted uppercase font-bold tracking-wider">Purchase Conversion Rate</span>
            <Activity className="h-4.5 w-4.5 text-text-muted group-hover:text-primary transition-colors" />
          </div>
          <div className="text-3xl font-black text-text-main">
            <AnimatedNumber value={overview?.purchaseRate ?? 0} suffix="%" />
          </div>
          <p className="text-[10px] text-text-muted font-semibold">Overall purchase rate of click triggers</p>
        </div>

      </div>

      {/* Section 2 & 3: Performance Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Campaign Metrics Line Chart */}
        <div className="lg:col-span-8 bg-white p-6 rounded-2xl border border-border shadow-xs space-y-6">
          <div>
            <h3 className="text-sm font-bold text-text-main uppercase tracking-wider flex items-center space-x-1.5">
              <TrendingUp className="h-4.5 w-4.5 text-primary" />
              <span>Campaign Event Funnel Trends</span>
            </h3>
            <p className="text-[10px] text-text-muted font-semibold mt-0.5">Live rates compiled across chronological MongoDB campaign history.</p>
          </div>

          <div className="h-72 w-full">
            {campaignData.length === 0 ? (
              <div className="h-full flex items-center justify-center text-xs text-text-muted font-bold bg-slate-50 rounded-xl">
                No active campaign records found. Launch a campaign to display chart telemetry.
              </div>
            ) : (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={campaignData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                  <XAxis dataKey="title" stroke="#94A3B8" fontSize={10} tickLine={false} />
                  <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} unit="%" />
                  <Tooltip 
                    contentStyle={{ 
                      backgroundColor: '#FFFFFF', 
                      borderRadius: '12px', 
                      border: '1px solid #E2E8F0',
                      fontSize: '11px',
                      fontWeight: '600'
                    }} 
                  />
                  <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 'bold' }} />
                  <Line type="monotone" dataKey="openRate" name="Open Rate %" stroke="#8B7355" strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="clickRate" name="Click Rate %" stroke="#B89B72" strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                  <Line type="monotone" dataKey="purchaseRate" name="Purchase Rate %" stroke="#10B981" strokeWidth={2.5} dot={{ r: 4 }} activeDot={{ r: 6 }} />
                </LineChart>
              </ResponsiveContainer>
            )}
          </div>
        </div>

        {/* Channel Comparison Bar Chart */}
        <div className="lg:col-span-4 bg-white p-6 rounded-2xl border border-border shadow-xs space-y-6">
          <div>
            <h3 className="text-sm font-bold text-text-main uppercase tracking-wider flex items-center space-x-1.5">
              <Zap className="h-4.5 w-4.5 text-primary" />
              <span>Channel Efficiency Index</span>
            </h3>
            <p className="text-[10px] text-text-muted font-semibold mt-0.5">Rates comparing WhatsApp, Email, and SMS conversions.</p>
          </div>

          <div className="h-72 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={channelData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#F1F5F9" />
                <XAxis dataKey="channel" stroke="#94A3B8" fontSize={10} tickLine={false} />
                <YAxis stroke="#94A3B8" fontSize={10} tickLine={false} unit="%" />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#FFFFFF', 
                    borderRadius: '12px', 
                    border: '1px solid #E2E8F0',
                    fontSize: '11px',
                    fontWeight: '600'
                  }}
                />
                <Legend iconType="circle" wrapperStyle={{ fontSize: '10px', fontWeight: 'bold' }} />
                <Bar dataKey="openRate" name="Open Rate" fill="#8B7355" radius={[4, 4, 0, 0]} />
                <Bar dataKey="clickRate" name="Click Rate" fill="#B89B72" radius={[4, 4, 0, 0]} />
                <Bar dataKey="purchaseRate" name="Purchase Rate" fill="#10B981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

      </div>

      {/* Section 4: City Intelligence */}
      <div className="space-y-4">
        <div>
          <h3 className="text-sm font-bold text-text-main uppercase tracking-wider flex items-center space-x-1.5">
            <Globe className="h-4.5 w-4.5 text-primary" />
            <span>Geographic Intelligence Indicators</span>
          </h3>
          <p className="text-[10px] text-text-muted font-semibold mt-0.5">City-level aggregates comparing market demand and marketing footprint.</p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          
          <div className="bg-slate-50 p-4 rounded-xl border border-border flex items-start space-x-3">
            <MapPin className="h-5 w-5 text-primary mt-0.5" />
            <div>
              <span className="text-[9px] text-text-muted uppercase font-bold tracking-wider block">Highest Revenue Market</span>
              <p className="text-sm font-black text-text-main mt-0.5">{cityInsights.highestRev}</p>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-border flex items-start space-x-3">
            <Award className="h-5 w-5 text-success mt-0.5" />
            <div>
              <span className="text-[9px] text-text-muted uppercase font-bold tracking-wider block">Highest Average Order Value</span>
              <p className="text-sm font-black text-text-main mt-0.5">{cityInsights.highestSpend}</p>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-border flex items-start space-x-3">
            <AlertTriangle className="h-5 w-5 text-amber-500 mt-0.5" />
            <div>
              <span className="text-[9px] text-text-muted uppercase font-bold tracking-wider block">highest lapse rate market</span>
              <p className="text-sm font-black text-text-main mt-0.5">{cityInsights.highestInactive}</p>
            </div>
          </div>

          <div className="bg-slate-50 p-4 rounded-xl border border-border flex items-start space-x-3">
            <Activity className="h-5 w-5 text-info mt-0.5" />
            <div>
              <span className="text-[9px] text-text-muted uppercase font-bold tracking-wider block">best campaign response</span>
              <p className="text-sm font-black text-text-main mt-0.5">{cityInsights.bestEngagement}</p>
            </div>
          </div>

        </div>
      </div>

      {/* Section 5 & 6: Audience and Customer Performance Lists */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Audience Performance Table (Left 7/12) */}
        <div className="lg:col-span-7 bg-white p-6 rounded-2xl border border-border shadow-xs space-y-4">
          <div>
            <h3 className="text-sm font-bold text-text-main uppercase tracking-wider">Cohort Segmentation Performance</h3>
            <p className="text-[10px] text-text-muted font-semibold mt-0.5">Campaign conversion counts and rates mapped by target audience segments.</p>
          </div>

          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/70 text-text-muted border-b border-border font-bold uppercase tracking-wider">
                  <th className="px-4 py-3">Audience Name</th>
                  <th className="px-4 py-3 text-center">Campaigns</th>
                  <th className="px-4 py-3 text-center">Sent</th>
                  <th className="px-4 py-3 text-center">Opened</th>
                  <th className="px-4 py-3 text-center">Purchased</th>
                  <th className="px-4 py-3 text-center">Conversion %</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-text-main font-semibold">
                {audienceData.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="text-center py-6 text-[10px] text-text-muted font-bold">
                      No campaign logs available yet.
                    </td>
                  </tr>
                ) : (
                  audienceData.map((aud, idx) => {
                    const rate = aud.sent > 0 ? Math.round((aud.purchased / aud.sent) * 100 * 10) / 10 : 0;
                    return (
                      <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                        <td className="px-4 py-3 font-bold">{aud.audienceName}</td>
                        <td className="px-4 py-3 text-center">{aud.campaigns}</td>
                        <td className="px-4 py-3 text-center">{aud.sent}</td>
                        <td className="px-4 py-3 text-center">{aud.opened}</td>
                        <td className="px-4 py-3 text-center">{aud.purchased}</td>
                        <td className="px-4 py-3 text-center">
                          <span className={`px-2 py-0.5 rounded text-[10px] font-black ${
                            rate >= 5 ? 'bg-success/5 text-success border border-success/15' : 'bg-slate-100 text-slate-700'
                          }`}>
                            {rate}%
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Customer Intelligence Rank tables (Right 5/12) */}
        <div className="lg:col-span-5 bg-white p-6 rounded-2xl border border-border shadow-xs space-y-4">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-border pb-3">
            <div>
              <h3 className="text-sm font-bold text-text-main uppercase tracking-wider">Database Leaders</h3>
              <p className="text-[10px] text-text-muted font-semibold mt-0.5">Leaderboard indexes stripped of contact details.</p>
            </div>
            
            {/* Tab Swappers */}
            <div className="flex space-x-1.5 bg-slate-100 p-1 rounded-lg">
              <button 
                onClick={() => setActiveCustomerTab('topCustomers')}
                className={`px-2 py-1 text-[9px] font-bold rounded cursor-pointer ${activeCustomerTab === 'topCustomers' ? 'bg-white text-text-main shadow-xs' : 'text-text-muted hover:text-text-main'}`}
              >
                Top
              </button>
              <button 
                onClick={() => setActiveCustomerTab('highestSpenders')}
                className={`px-2 py-1 text-[9px] font-bold rounded cursor-pointer ${activeCustomerTab === 'highestSpenders' ? 'bg-white text-text-main shadow-xs' : 'text-text-muted hover:text-text-main'}`}
              >
                Spend
              </button>
              <button 
                onClick={() => setActiveCustomerTab('atRiskCustomers')}
                className={`px-2 py-1 text-[9px] font-bold rounded cursor-pointer ${activeCustomerTab === 'atRiskCustomers' ? 'bg-white text-text-main shadow-xs' : 'text-text-muted hover:text-text-main'}`}
              >
                At Risk
              </button>
            </div>
          </div>

          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-slate-50/70 text-text-muted border-b border-border font-bold uppercase tracking-wider">
                  <th className="px-4 py-3">Shopper</th>
                  <th className="px-4 py-3">City</th>
                  {activeCustomerTab === 'atRiskCustomers' ? (
                    <th className="px-4 py-3 text-right">Lapsed Days</th>
                  ) : (
                    <>
                      <th className="px-4 py-3 text-center">Orders</th>
                      <th className="px-4 py-3 text-right">Spend</th>
                    </>
                  )}
                </tr>
              </thead>
              <tbody className="divide-y divide-border text-text-main font-semibold">
                {(!customerData || !customerData[activeCustomerTab] || customerData[activeCustomerTab].length === 0) ? (
                  <tr>
                    <td colSpan={4} className="text-center py-6 text-[10px] text-text-muted font-bold">
                      No records matched.
                    </td>
                  </tr>
                ) : (
                  customerData[activeCustomerTab].map((c, idx) => (
                    <tr key={idx} className="hover:bg-slate-50/50 transition-colors">
                      <td className="px-4 py-3">
                        <div className="font-bold">{c.name}</div>
                        <div className="text-[8px] text-text-muted font-bold">{c.customerId}</div>
                      </td>
                      <td className="px-4 py-3 text-text-muted">{c.city}</td>
                      {activeCustomerTab === 'atRiskCustomers' ? (
                        <td className="px-4 py-3 text-right text-danger font-black">{c.lastPurchaseDays}d ago</td>
                      ) : (
                        <>
                          <td className="px-4 py-3 text-center">{c.totalOrders}</td>
                          <td className="px-4 py-3 text-right font-black">₹{c.totalSpend.toLocaleString()}</td>
                        </>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>

      </div>

    </div>
  );
};

export default Analytics;
