import React from 'react';
import coffeeCupTop from '../../assets/coffee_cup_top.png';
import coffeeBeansCup from '../../assets/coffee_beans_cup.png';
import icedCoffee from '../../assets/iced_coffee.png';
import coffeeLatteArt from '../../assets/coffee_latte_art.png';
import coffeeDrip from '../../assets/coffee_drip.png';

// Simple static image map to stay beginner-friendly
const imagesMap = {
  'coffee_cup_top.png': coffeeCupTop,
  'coffee_beans_cup.png': coffeeBeansCup,
  'iced_coffee.png': icedCoffee,
  'coffee_latte_art.png': coffeeLatteArt,
  'coffee_drip.png': coffeeDrip
};

const StrategyDraftCard = ({ title, audienceName, channel, score, imageName }) => {
  const imageSrc = imagesMap[imageName] || coffeeCupTop;
  const isWhatsApp = channel.toLowerCase() === 'whatsapp';

  return (
    <div className="flex items-center justify-between p-4 bg-white border border-[#E7E5E4] rounded-xl hover:border-[#8B7355]/30 transition-all select-none">
      
      {/* Left side: Thumbnail + Title & Segment */}
      <div className="flex items-center space-x-3.5 flex-1 min-w-0">
        <img 
          src={imageSrc} 
          alt={title} 
          className="h-12 w-12 rounded-full object-cover border border-[#E7E5E4] shrink-0"
        />
        <div className="min-w-0">
          <h5 className="text-xs font-bold text-[#1F2937] truncate leading-tight">
            {title}
          </h5>
          <p className="text-[10px] text-[#6B7280] font-semibold truncate mt-0.5">
            {audienceName}
          </p>
        </div>
      </div>

      {/* Right side: Channel Badge + Score Box */}
      <div className="flex flex-col items-end space-y-1.5 shrink-0 ml-4">
        {/* Channel Badge */}
        <span className={`px-2 py-0.5 text-[9px] font-bold rounded-full border ${
          isWhatsApp 
            ? 'bg-emerald-50 text-emerald-600 border-emerald-100' 
            : 'bg-stone-50 text-stone-600 border-stone-100'
        }`}>
          {channel}
        </span>

        {/* Score Badge */}
        <span className="text-[9px] font-bold text-[#1F2937] bg-[#F8F6F2] border border-[#E7E5E4] px-1.5 py-0.5 rounded">
          Score: {score}
        </span>
      </div>

    </div>
  );
};

export default StrategyDraftCard;
