import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

import DashboardLayout from '../components/dashboard/DashboardLayout';
import HeroBanner from '../components/dashboard/HeroBanner';
import MarketingOpportunities from '../components/dashboard/MarketingOpportunities';
import AIInsights from '../components/dashboard/AIInsights';
import CustomerHealth from '../components/dashboard/CustomerHealth';
import RegionalIntelligence from '../components/dashboard/RegionalIntelligence';
import CampaignPerformance from '../components/dashboard/CampaignPerformance';
import CampaignAnalyticsHub from '../components/dashboard/CampaignAnalyticsHub';

import { API_BASE_URL } from '../config/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const [customers, setCustomers] = useState([]);
  const [campaigns, setCampaigns] = useState([]);
  const [analyticsData, setAnalyticsData] = useState({
    kpis: {},
    leaderboard: [],
    insights: [],
    campaigns: []
  });
  const [recommendations, setRecommendations] = useState([]);
  const [customerStats, setCustomerStats] = useState({ totalCustomers: 0, newCustomersToday: 0 });
  const [loading, setLoading] = useState(true);
  const [analyticsLoading, setAnalyticsLoading] = useState(true);

  const refreshAnalytics = async () => {
    try {
      setAnalyticsLoading(true);
      const res = await axios.get(`${API_BASE_URL}/campaigns/analytics`);
      if (res.data) {
        setAnalyticsData(res.data);
      }
    } catch (error) {
      console.warn('[Campaign Analytics Sync] Fetch error:', error.message);
    } finally {
      setAnalyticsLoading(false);
    }
  };

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const [custRes, campRes, analyticsRes, recsRes, statsRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/customers?limit=250`),
          axios.get(`${API_BASE_URL}/campaigns`),
          axios.get(`${API_BASE_URL}/campaigns/analytics`),
          axios.get(`${API_BASE_URL}/recommendations`),
          axios.get(`${API_BASE_URL}/customers/stats`)
        ]);

        if (custRes.data && custRes.data.customers) {
          setCustomers(custRes.data.customers);
        }
        if (campRes.data) {
          setCampaigns(campRes.data);
        }
        if (analyticsRes.data) {
          setAnalyticsData(analyticsRes.data);
        }
        if (recsRes.data && recsRes.data.recommendations) {
          setRecommendations(recsRes.data.recommendations);
        }
        if (statsRes.data) {
          setCustomerStats(statsRes.data);
        }
      } catch (error) {
        console.warn('[Dashboard Data Sync] Backend offline or fetch error:', error.message);
      }
    };

    fetchDashboardData();

    // Reduce loader display time to exactly 1 second (1000ms) for high-speed feel
    const timer = setTimeout(() => {
      setLoading(false);
      setAnalyticsLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="min-h-full bg-[#0B0B0D] -m-8 lg:-m-10 p-8 lg:p-10 text-[#F5F1EA]">
      {loading ? (
        <div className="flex flex-col items-center justify-center min-h-[600px] space-y-4">
          <svg className="animate-spin h-8 w-8 text-[#B08D57]" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <span className="text-xs font-mono tracking-widest text-[#B08D57] uppercase">Brewing Insights...</span>
        </div>
      ) : (
        <DashboardLayout>
          {/* Section 1: Cinematic Hero Section */}
          <HeroBanner recommendations={recommendations} stats={customerStats} />

          {/* Section 1.5: Campaign Performance Analytics Hub */}
          <CampaignAnalyticsHub 
            analyticsData={analyticsData}
            onRefresh={refreshAnalytics}
            isLoading={analyticsLoading}
          />

          {/* Section 2: Marketing Opportunities (exactly 3 cards) */}
          <MarketingOpportunities opportunities={recommendations} onNavigate={(path, state) => navigate(path, state)} />

          {/* 2-Column Grid Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-stretch">
            
            {/* Left Side: AI Insights (Section 3) + Regional Intelligence (Section 5) */}
            <div className="lg:col-span-6 flex flex-col space-y-8">
              <AIInsights insights={analyticsData.insights} />
              <RegionalIntelligence />
            </div>

            {/* Right Side: Customer Health (Section 4) + Campaign Performance (Section 6) */}
            <div className="lg:col-span-6 flex flex-col space-y-8">
              <CustomerHealth customers={customers} />
              <CampaignPerformance campaigns={campaigns} />
            </div>

          </div>

          {/* Section 7: Footer */}
          <footer className="mt-16 pt-8 border-t border-[#B08D57]/15 flex flex-col md:flex-row items-center justify-between text-[#F5F1EA]/50 text-xs font-sans">
            <div className="flex items-center space-x-2">
              <span className="font-serif italic font-semibold text-[#B08D57]">ENGAGEAI</span>
              <span>&copy; {new Date().getFullYear()} All Rights Reserved.</span>
            </div>
            <div className="flex space-x-6 mt-4 md:mt-0 font-mono uppercase tracking-widest text-[10px]">
              <a href="#privacy" className="hover:text-[#B08D57] transition-colors">Privacy Policy</a>
              <a href="#terms" className="hover:text-[#B08D57] transition-colors">Terms of Service</a>
              <a href="#status" className="hover:text-[#B08D57] transition-colors">System Status</a>
            </div>
          </footer>
        </DashboardLayout>
      )}
    </div>
  );
};

export default Dashboard;
