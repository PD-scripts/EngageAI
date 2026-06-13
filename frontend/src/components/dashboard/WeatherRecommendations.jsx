import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ArrowRight, RefreshCw, AlertCircle } from 'lucide-react';
import coffeeCupTop from '../../assets/coffee_cup_top.png';
import coffeeBeansCup from '../../assets/coffee_beans_cup.png';
import icedCoffee from '../../assets/iced_coffee.png';
import coffeeLatteArt from '../../assets/coffee_latte_art.png';
import coffeeDrip from '../../assets/coffee_drip.png';

const imagesMap = {
  'HOT': icedCoffee,
  'RAIN': coffeeCupTop,
  'COLD': coffeeLatteArt,
  'WARM': coffeeDrip,
  'NORMAL': coffeeBeansCup
};

const emojiMap = {
  'HOT': '☀️',
  'RAIN': '🌧️',
  'COLD': '❄️',
  'WARM': '⛅',
  'NORMAL': '☕'
};

import { API_BASE_URL } from '../../config/api';

const WeatherRecommendations = () => {
  const navigate = useNavigate();
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchWeatherRecommendations = async () => {
      try {
        setLoading(true);
        setError(false);
        const response = await axios.get(`${API_BASE_URL}/weather/recommendations`);
        if (response.data && response.data.success && response.data.recommendations) {
          // Show ONLY 2 weather recommendations. Select the 2 strongest opportunities.
          setRecommendations(response.data.recommendations.slice(0, 2));
        } else {
          setError(true);
        }
      } catch (err) {
        console.warn('[Weather Recommendations Sync] API error:', err.message);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchWeatherRecommendations();
  }, []);

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="border-b border-[#E7E5E4] pb-2">
          <h3 className="text-lg font-bold text-[#1F2937] tracking-tight flex items-center space-x-2">
            <span>Weather Intelligence</span>
          </h3>
          <div className="w-16 h-[2px] bg-[#8B7355] mt-1.5" />
        </div>
        <div className="py-8 flex items-center justify-center space-x-2 text-xs font-semibold text-[#6B7280]">
          <RefreshCw className="h-4 w-4 animate-spin text-[#8B7355]" />
          <span>Loading weather intelligence...</span>
        </div>
      </div>
    );
  }

  if (error || recommendations.length === 0) {
    return (
      <div className="space-y-4">
        <div className="border-b border-[#E7E5E4] pb-2">
          <h3 className="text-lg font-bold text-[#1F2937] tracking-tight flex items-center space-x-2">
            <span>Weather Intelligence</span>
          </h3>
          <div className="w-16 h-[2px] bg-[#8B7355] mt-1.5" />
        </div>
        <div className="py-6 flex items-center space-x-2 text-xs font-semibold text-[#6B7280] bg-[#F8F6F2] p-4 rounded-xl border border-[#E7E5E4]">
          <AlertCircle className="h-4 w-4 text-[#8B7355] shrink-0" />
          <span>Weather intelligence currently unavailable.</span>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="border-b border-[#E7E5E4] pb-2">
        <h3 className="text-lg font-bold text-[#1F2937] tracking-tight flex items-center space-x-2">
          <span>Weather Intelligence</span>
        </h3>
        <div className="w-16 h-[2px] bg-[#8B7355] mt-1.5" />
      </div>

      <div className="divide-y divide-[#E7E5E4]">
        {recommendations.map((rec) => {
          const emoji = emojiMap[rec.type] || '☕';
          const imageSrc = imagesMap[rec.type] || coffeeCupTop;
          
          return (
            <div 
              key={rec.city} 
              className="py-6 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-[#E7E5E4] last:border-0 group select-none"
            >
              {/* Left side: Coffee circle image + Typography details */}
              <div className="flex items-center space-x-5 flex-1">
                
                {/* Rounded thumbnail with weather overlay */}
                <div className="relative shrink-0">
                  <img 
                    src={imageSrc} 
                    alt={rec.city} 
                    className="h-16 w-16 rounded-full object-cover border-2 border-[#E7E5E4] shadow-xs group-hover:scale-102 transition-transform"
                  />
                  <div className="absolute -bottom-1 -right-1 bg-white rounded-full p-1 border border-[#E7E5E4] text-xs shadow-2xs flex items-center justify-center h-6.5 w-6.5">
                    {emoji}
                  </div>
                </div>

                {/* Text information */}
                <div className="space-y-1">
                  <span className="text-[9px] font-black tracking-widest uppercase text-[#8B7355]">
                    {emoji} {rec.city} – {rec.title}
                  </span>
                  <h4 className="text-sm font-bold text-[#1F2937] leading-snug">
                    {rec.recommendation}
                  </h4>
                  <p className="text-xs text-[#6B7280] font-medium">
                    {rec.description}
                  </p>
                  <div className="text-[10px] flex items-center space-x-1.5 pt-0.5">
                    <span className="text-[#8B7355] font-black uppercase tracking-wider">Campaign:</span>
                    <span className="text-[#4B5563] font-bold">{rec.campaignIdea}</span>
                  </div>
                </div>
              </div>

              {/* Right side: Action Link CTA */}
              <button 
                onClick={() => {
                  const promptText = `Create a WhatsApp campaign for ${rec.city} Customers to Promote ${rec.recommendation.replace('Promote ', '').replace('.', '')}`;
                  navigate('/campaigns', { state: { prompt: promptText } });
                }}
                className="shrink-0 flex items-center space-x-2 text-xs font-bold text-[#8B7355] hover:text-[#B89B72] transition-colors cursor-pointer self-start md:self-center bg-[#F8F6F2]/40 hover:bg-[#F8F6F2] py-2 px-4 rounded-lg border border-[#E7E5E4]"
              >
                <span>Launch Campaign</span>
                <ArrowRight className="h-4.5 w-4.5 transform group-hover:translate-x-1 transition-transform" />
              </button>

            </div>
          );
        })}
      </div>
    </div>
  );
};

export default WeatherRecommendations;
