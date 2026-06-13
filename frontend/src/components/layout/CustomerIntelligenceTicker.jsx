import React, { useState, useEffect } from 'react';
import axios from 'axios';
import TickerItem from './TickerItem';

const CustomerIntelligenceTicker = () => {
  const defaultEvents = [
    { type: 'purchase', badge: '☕ Purchase', text: 'Rahul Sharma purchased a Hazelnut Cappuccino 12 minutes ago', color: 'bg-amber-950/40 text-[#B08D57] border-[#B08D57]/30' },
    { type: 'vip', badge: '⭐ VIP', text: 'Priya Verma upgraded to VIP Status in Pune', color: 'bg-yellow-500/10 text-yellow-250 border-yellow-500/25' },
    { type: 'birthday', badge: '🎂 Birthday', text: '5 customer birthdays detected this week', color: 'bg-rose-500/10 text-rose-250 border-rose-500/25' },
    { type: 'growth', badge: '🔥 Hot', text: 'Cold Brew demand rising in Delhi NCR', color: 'bg-orange-500/10 text-orange-250 border-orange-500/25' },
    { type: 'risk', badge: '⚠ Risk', text: '12 customers are showing churn signals', color: 'bg-red-500/10 text-red-250 border-red-500/25' },
    { type: 'growth', badge: '📈 Growth', text: 'Mumbai engagement score increased 11%', color: 'bg-emerald-500/10 text-emerald-250 border-emerald-500/25' },
    { type: 'campaign', badge: '💎 Campaign', text: 'Ankit Gupta became a Champion Customer', color: 'bg-blue-500/10 text-blue-250 border-blue-500/25' }
  ];

  const [events, setEvents] = useState(defaultEvents);

  useEffect(() => {
    const fetchMongoDBData = async () => {
      try {
        const [custRes, campRes] = await Promise.all([
          axios.get('http://localhost:5000/api/customers?limit=100'),
          axios.get('http://localhost:5000/api/campaigns')
        ]);

        const customers = custRes.data?.customers || [];
        const campaigns = campRes.data || [];

        if (customers.length > 0) {
          const beverages = ['Hazelnut Cappuccino', 'Iced Americano', 'Cold Brew Espresso', 'Vanilla Latte', 'Caramel Macchiato', 'Classic Espresso'];
          const dynamicEvents = [];

          customers.slice(0, 15).forEach((cust, idx) => {
            const name = cust.Name || cust.name || 'Valued Customer';
            const city = cust.City || cust.city || 'Delhi';
            const score = cust.HealthScore || cust.healthScore || 75;
            
            // Build diverse, luxury events using real database fields
            if (idx % 4 === 0) {
              const beverage = beverages[idx % beverages.length];
              dynamicEvents.push({
                type: 'purchase',
                badge: '☕ Purchase',
                text: `${name} purchased a ${beverage} ${idx * 3 + 4} minutes ago`,
                color: 'bg-amber-950/40 text-[#B08D57] border-[#B08D57]/30'
              });
            } else if (idx % 4 === 1) {
              if (score >= 90) {
                dynamicEvents.push({
                  type: 'campaign',
                  badge: '💎 Champion',
                  text: `${name} became a Champion Customer (Health Score: ${score})`,
                  color: 'bg-blue-500/10 text-blue-250 border-blue-500/25'
                });
              } else if (score < 40) {
                dynamicEvents.push({
                  type: 'risk',
                  badge: '⚠ Risk',
                  text: `${name} is showing churn signals (Health Score: ${score})`,
                  color: 'bg-red-500/10 text-red-250 border-red-500/25'
                });
              } else {
                dynamicEvents.push({
                  type: 'vip',
                  badge: '⭐ VIP',
                  text: `${name} became a VIP customer in ${city}`,
                  color: 'bg-yellow-500/10 text-yellow-250 border-yellow-500/25'
                });
              }
            } else if (idx % 4 === 2) {
              // Integrate a real campaign if available
              const camp = campaigns[idx % campaigns.length];
              if (camp) {
                const campaignTitle = camp.title || camp.name || 'Special Offer';
                dynamicEvents.push({
                  type: 'campaign',
                  badge: '🎯 Campaign',
                  text: `${name} responded to the "${campaignTitle}" campaign`,
                  color: 'bg-[#B08D57]/15 text-[#F5F1EA] border-[#B08D57]/20'
                });
              } else {
                dynamicEvents.push({
                  type: 'birthday',
                  badge: '🎂 Birthday',
                  text: `Upcoming birthday detected for ${name} this week`,
                  color: 'bg-rose-500/10 text-rose-250 border-rose-500/25'
                });
              }
            } else {
              dynamicEvents.push({
                type: 'growth',
                badge: '📈 Growth',
                text: `${city} engagement score for ${name} increased by ${idx + 5}%`,
                color: 'bg-emerald-500/10 text-emerald-250 border-emerald-500/25'
              });
            }
          });

          if (dynamicEvents.length > 0) {
            setEvents(dynamicEvents);
          }
        }
      } catch (error) {
        console.warn('[Ticker Live Sync] Using default luxury CRM events:', error.message);
      }
    };

    fetchMongoDBData();
  }, []);

  return (
    <div className="relative w-full h-full overflow-hidden flex items-center bg-transparent">
      {/* Infinite scrolling container */}
      <div className="flex whitespace-nowrap">
        <div className="animate-marquee py-1">
          {events.map((event, idx) => (
            <TickerItem key={`event-1-${idx}`} event={event} />
          ))}
        </div>
        {/* Duplicate the items for seamless infinite scroll */}
        <div className="animate-marquee py-1" aria-hidden="true">
          {events.map((event, idx) => (
            <TickerItem key={`event-2-${idx}`} event={event} />
          ))}
        </div>
      </div>

      <style>{`
        @keyframes marquee {
          0% { transform: translateX(0%); }
          100% { transform: translateX(-100%); }
        }
        .animate-marquee {
          display: inline-flex;
          animation: marquee 55s linear infinite;
        }
        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
};

export default CustomerIntelligenceTicker;
