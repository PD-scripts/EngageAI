import React from 'react';
import { ArrowRight } from 'lucide-react';
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

const RecommendationItem = ({ 
  category, 
  title, 
  description, 
  actionText, 
  imageName, 
  themeColor,
  onActionClick 
}) => {
  
  // Resolve local image path, fallback to top-view coffee cup
  const imageSrc = imagesMap[imageName] || coffeeCupTop;

  // Resolve tailwind color styles based on category theme
  const getThemeStyles = () => {
    switch (themeColor) {
      case 'rose':
        return {
          text: 'text-rose-600',
          bg: 'bg-rose-50 border-rose-100'
        };
      case 'emerald':
        return {
          text: 'text-emerald-600',
          bg: 'bg-emerald-50 border-emerald-100'
        };
      case 'amber':
      default:
        return {
          text: 'text-[#8B7355]',
          bg: 'bg-[#F8F6F2] border-[#E7E5E4]'
        };
    }
  };

  const themeStyles = getThemeStyles();

  return (
    <div className="py-6 flex flex-col md:flex-row md:items-center justify-between gap-6 border-b border-[#E7E5E4] last:border-0 group select-none">
      
      {/* Left side: Coffee circle image + Typography details */}
      <div className="flex items-center space-x-5 flex-1">
        
        {/* Rounded thumbnail */}
        <div className="relative shrink-0">
          <img 
            src={imageSrc} 
            alt={category} 
            className="h-16 w-16 rounded-full object-cover border-2 border-[#E7E5E4] shadow-xs group-hover:scale-102 transition-transform"
          />
          <div className="absolute inset-0 rounded-full bg-black/5 opacity-0 group-hover:opacity-100 transition-opacity" />
        </div>

        {/* Text information */}
        <div className="space-y-1">
          <span className={`text-[9px] font-black tracking-widest uppercase ${themeStyles.text}`}>
            {category}
          </span>
          <h4 className="text-sm font-bold text-[#1F2937] leading-snug">
            {title}
          </h4>
          <p className="text-xs text-[#6B7280] font-medium">
            {description}
          </p>
        </div>
      </div>

      {/* Right side: Action Link CTA */}
      <button 
        onClick={onActionClick}
        className="shrink-0 flex items-center space-x-2 text-xs font-bold text-[#8B7355] hover:text-[#B89B72] transition-colors cursor-pointer self-start md:self-center bg-[#F8F6F2]/40 hover:bg-[#F8F6F2] py-2 px-4 rounded-lg border border-[#E7E5E4]"
      >
        <span>{actionText}</span>
        <ArrowRight className="h-4.5 w-4.5 transform group-hover:translate-x-1 transition-transform" />
      </button>

    </div>
  );
};

export default RecommendationItem;
