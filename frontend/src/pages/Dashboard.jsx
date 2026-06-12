import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles, Send } from 'lucide-react';
import MetricCard from '../components/dashboard/MetricCard';
import RecommendationItem from '../components/dashboard/RecommendationItem';
import RevenueChart from '../components/dashboard/RevenueChart';
import StrategyDraftCard from '../components/dashboard/StrategyDraftCard';
import WeatherRecommendations from '../components/dashboard/WeatherRecommendations';

import { 
  kpisData as mockKpis, 
  recommendationsData as mockRecs, 
  revenueChartData as mockRevenue, 
  strategyDraftsData as mockDrafts 
} from '../data/dashboardData';
import coffeeBeansDeco from '../assets/coffee_beans_deco.png';

const API_BASE_URL = 'http://localhost:5000/api';

const Dashboard = () => {
  const navigate = useNavigate();
  const [kpis, setKpis] = useState(mockKpis);
  const [recommendations, setRecommendations] = useState(mockRecs);
  const [revenueData] = useState(mockRevenue);
  const [strategyDrafts, setStrategyDrafts] = useState(mockDrafts);
  const [loading, setLoading] = useState(true);

  // Map backend recommendation keys to visual themes and images
  const getRecMetadata = (type) => {
    switch (type) {
      case 'CHURN':
        return {
          category: 'HIGH CHURN RISK',
          imageName: 'coffee_cup_top.png',
          themeColor: 'rose',
          description: 'Re-engage inactive customers with a personalized offer.'
        };
      case 'REVENUE':
        return {
          category: 'REVENUE OPPORTUNITY',
          imageName: 'coffee_beans_cup.png',
          themeColor: 'emerald',
          description: 'Target them with an exclusive loyalty campaign.'
        };
      case 'CHANNEL':
        return {
          category: 'BEST PERFORMING CHANNEL',
          imageName: 'iced_coffee.png',
          themeColor: 'amber',
          description: 'Shift more campaigns to WhatsApp for better engagement.'
        };
      case 'CITY':
        return {
          category: 'FASTEST GROWING CITY',
          imageName: 'coffee_latte_art.png',
          themeColor: 'amber',
          description: 'Increase local marketing activities to ride growth.'
        };
      case 'AUDIENCE':
        return {
          category: 'AUDIENCE OPPORTUNITY',
          imageName: 'coffee_drip.png',
          themeColor: 'amber',
          description: 'Scale message delivery frequency to boost conversions.'
        };
      case 'BIRTHDAY':
      case 'BIRTHDAY_WEEK':
        return {
          category: 'BIRTHDAY OPPORTUNITY',
          imageName: 'coffee_latte_art.png',
          themeColor: 'amber',
          description: 'Offer them a complimentary birthday drink or reward.'
        };
      case 'BIRTHDAY_MONTH':
        return {
          category: 'BIRTHDAY MONTH SPECIAL',
          imageName: 'coffee_drip.png',
          themeColor: 'amber',
          description: 'Promote a birthday coffee rewards program for this month.'
        };
      case 'VIP_BIRTHDAY':
        return {
          category: 'VIP BIRTHDAY OPPORTUNITY',
          imageName: 'coffee_cup_top.png',
          themeColor: 'rose',
          description: 'Reward high-value VIP customers with an exclusive gift.'
        };
      case 'HEALTH_AT_RISK':
        return {
          category: 'CUSTOMER RETENTION OPPORTUNITY',
          imageName: 'coffee_cup_top.png',
          themeColor: 'rose',
          description: 'Win back at-risk shoppers with a target campaign.'
        };
      case 'HEALTH_CHAMPION':
        return {
          category: 'CHAMPION CUSTOMER OPPORTUNITY',
          imageName: 'coffee_beans_cup.png',
          themeColor: 'emerald',
          description: 'Reward loyal fans with VIP rewards.'
        };
      default:
        return {
          category: 'STRATEGY INSIGHT',
          imageName: 'coffee_cup_top.png',
          themeColor: 'amber',
          description: 'Optimize campaign variables to improve performance.'
        };
    }
  };

  useEffect(() => {
    const fetchLiveStats = async () => {
      try {
        const [campRes, audRes, recRes] = await Promise.all([
          axios.get(`${API_BASE_URL}/campaigns`),
          axios.get(`${API_BASE_URL}/campaigns/audiences`),
          axios.get(`${API_BASE_URL}/recommendations`)
        ]);

        // 1. Sync KPIs dynamically from database
        const totalCampaigns = campRes.data.length || 0;
        const allCustObj = audRes.data.find(a => a.name === 'All Customers');
        const totalCustomersCount = allCustObj ? allCustObj.size : 200;

        const upcomingBirthdaysCount = recRes.data.upcomingBirthdays30Days || 0;

        const updatedKpis = mockKpis.map(kpi => {
          if (kpi.id === 'total-customers') {
            return { ...kpi, value: totalCustomersCount.toLocaleString() };
          }
          if (kpi.id === 'campaigns-sent') {
            return { ...kpi, value: totalCampaigns.toString() };
          }
          if (kpi.id === 'upcoming-birthdays') {
            return { ...kpi, value: `${upcomingBirthdaysCount} Customers` };
          }
          return kpi;
        });
        setKpis(updatedKpis);

        // 2. Sync Recommendations from Engine (strictly mapping 4 rows)
        if (recRes.data && recRes.data.recommendations) {
          const liveRecs = recRes.data.recommendations.slice(0, 4).map((rec, index) => {
            const meta = getRecMetadata(rec.type);
            return {
              id: rec.id || `rec-${index}`,
              category: meta.category,
              title: rec.description || rec.title,
              description: meta.description,
              actionText: rec.action,
              path: rec.path,
              state: rec.state,
              imageName: meta.imageName,
              themeColor: meta.themeColor
            };
          });
          
          // Fallback if less than 4 recommendations are generated
          if (liveRecs.length < 4) {
            const paddedRecs = [...liveRecs];
            for (let i = liveRecs.length; i < 4; i++) {
              const mockItem = mockRecs[i % mockRecs.length];
              paddedRecs.push({
                ...mockItem,
                id: `mock-${i}`
              });
            }
            setRecommendations(paddedRecs);
          } else {
            setRecommendations(liveRecs);
          }
        }

        // 3. Sync Strategy Drafts from MongoDB (first 3)
        if (campRes.data && campRes.data.length > 0) {
          const draftList = [
            'coffee_latte_art.png',
            'coffee_drip.png',
            'coffee_cup_top.png'
          ];
          const liveDrafts = campRes.data.slice(0, 3).map((camp, index) => ({
            id: camp.id || `draft-${index}`,
            title: camp.title || 'Untitled Campaign',
            audienceName: camp.audienceName || 'All Customers',
            channel: camp.channel || 'SMS',
            score: camp.qualityScore || 90,
            imageName: draftList[index % draftList.length]
          }));
          
          // Pad if less than 3 drafts
          if (liveDrafts.length < 3) {
            const paddedDrafts = [...liveDrafts];
            for (let i = liveDrafts.length; i < 3; i++) {
              paddedDrafts.push(mockDrafts[i]);
            }
            setStrategyDrafts(paddedDrafts);
          } else {
            setStrategyDrafts(liveDrafts);
          }
        }

      } catch (error) {
        console.warn('[Dashboard API Sync] Backend offline or error. Displaying luxury dummy datasets.', error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchLiveStats();
  }, []);

  return (
    <div className="relative min-h-screen pb-12 select-none">
      
      {/* Decorative Scattered Coffee Beans absolute background images */}
      <img 
        src={coffeeBeansDeco} 
        alt="Coffee Beans Deco Left" 
        className="absolute -top-12 -left-16 w-32 opacity-80 pointer-events-none select-none z-0 rotate-12"
      />
      <img 
        src={coffeeBeansDeco} 
        alt="Coffee Beans Deco Right" 
        className="absolute top-36 right-4 w-40 opacity-85 pointer-events-none select-none z-0 -rotate-45"
      />
      <img 
        src={coffeeBeansDeco} 
        alt="Coffee Beans Deco Center" 
        className="absolute bottom-28 left-[40%] w-36 opacity-75 pointer-events-none select-none z-0 rotate-90"
      />

      <div className="relative z-10 space-y-10">
        
        {/* Welcome Section */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
          <div className="space-y-1">
            <h1 className="text-4xl font-serif font-black text-[#1F2937] tracking-tight">
              Good morning, Sophia
            </h1>
            <div className="flex items-center space-x-2 text-xs text-[#6B7280] font-semibold mt-2">
              <span className="text-[#8B7355] text-[10px]">◆</span>
              <p>
                Your coffee brand is <span className="text-[#8B7355] font-bold">brewing strong connections</span> today.
              </p>
            </div>
          </div>

          {/* Quick Action Top Buttons */}
          <div className="flex items-center space-x-3.5">
            <button
              onClick={() => navigate('/ai-strategist')}
              className="px-5 py-2.5 text-xs font-bold text-[#1F2937] bg-white border border-[#E7E5E4] rounded-lg shadow-2xs hover:bg-[#F8F6F2] hover:border-[#8B7355]/40 transition-all flex items-center space-x-2 cursor-pointer"
            >
              <Sparkles className="h-4 w-4 text-[#8B7355]" />
              <span>Consult AI Strategist</span>
            </button>
            <button
              onClick={() => navigate('/campaigns')}
              className="px-5 py-2.5 text-xs font-bold text-white bg-[#8B7355] border border-[#8B7355] hover:bg-[#8B7355]/95 rounded-lg shadow-sm hover:shadow-md transition-all flex items-center space-x-2 cursor-pointer"
            >
              <Send className="h-4 w-4" />
              <span>Launch Campaign</span>
            </button>
          </div>
        </div>

        {/* KPI Grid Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {kpis.map((kpi) => (
            <MetricCard 
              key={kpi.id}
              title={kpi.title}
              value={kpi.value}
              trend={kpi.trend}
              subtext={kpi.subtext}
              id={kpi.id}
            />
          ))}
        </div>

        {/* AI-Driven Strategy Recommendations Row List */}
        <div className="space-y-4">
          <div className="border-b border-[#E7E5E4] pb-2">
            <h3 className="text-lg font-bold text-[#1F2937] tracking-tight flex items-center space-x-2">
              <span>AI-Driven Strategy Recommendations</span>
            </h3>
            <div className="w-16 h-[2px] bg-[#8B7355] mt-1.5" />
          </div>

          <div className="bg-white p-2 px-8 rounded-2xl border border-[#E7E5E4] shadow-2xs">
            {recommendations.map((rec) => (
              <RecommendationItem 
                key={rec.id}
                category={rec.category}
                title={rec.title}
                description={rec.description}
                actionText={rec.actionText}
                imageName={rec.imageName}
                themeColor={rec.themeColor}
                onActionClick={() => navigate(rec.path || '/campaigns', { state: rec.state })}
              />
            ))}
          </div>
        </div>

        {/* Weather Intelligence Recommendations */}
        <WeatherRecommendations />

        {/* Bottom charts & draft split columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Revenue and Orders Line Chart */}
          <div className="lg:col-span-7 bg-white p-8 rounded-2xl border border-[#E7E5E4] shadow-2xs space-y-6 relative overflow-hidden">
            <div className="flex items-center justify-between border-b border-[#E7E5E4] pb-4">
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-[#1F2937] tracking-tight font-serif flex items-center space-x-2">
                  <span className="text-[#8B7355] text-xs">●</span>
                  <span>Campaign Revenue Metrics</span>
                </h4>
                <p className="text-[11px] text-[#6B7280] font-semibold">
                  Monthly performance across messaging channels.
                </p>
              </div>
              <Link 
                to="/analytics" 
                className="text-[11px] font-bold text-[#8B7355] hover:text-[#B89B72] hover:underline flex items-center space-x-0.5"
              >
                <span>View Report</span>
                <span>→</span>
              </Link>
            </div>

            <RevenueChart data={revenueData} />
            
            {/* Small scattered coffee bean decor under graph */}
            <img 
              src={coffeeBeansDeco} 
              alt="Deco beans" 
              className="absolute -bottom-4 right-10 w-24 opacity-80 pointer-events-none" 
            />
          </div>

          {/* Strategy Drafts List */}
          <div className="lg:col-span-5 bg-white p-8 rounded-2xl border border-[#E7E5E4] shadow-2xs space-y-6">
            <div className="flex items-center justify-between border-b border-[#E7E5E4] pb-4">
              <div className="space-y-1">
                <h4 className="text-sm font-bold text-[#1F2937] tracking-tight font-serif flex items-center space-x-2">
                  <span className="text-[#8B7355] text-xs">◆</span>
                  <span>Recent Strategy Drafts</span>
                </h4>
                <p className="text-[11px] text-[#6B7280] font-semibold">
                  Stored campaign configs.
                </p>
              </div>
              <Link 
                to="/campaigns" 
                className="text-[11px] font-bold text-[#8B7355] hover:text-[#B89B72] hover:underline flex items-center space-x-0.5"
              >
                <span>View All</span>
                <span>→</span>
              </Link>
            </div>

            <div className="space-y-3.5">
              {strategyDrafts.map((draft) => (
                <StrategyDraftCard 
                  key={draft.id}
                  title={draft.title}
                  audienceName={draft.audienceName}
                  channel={draft.channel}
                  score={draft.score}
                  imageName={draft.imageName}
                />
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};

export default Dashboard;
