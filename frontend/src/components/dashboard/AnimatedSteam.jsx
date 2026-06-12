import React from 'react';

const AnimatedSteam = () => {
  return (
    <div className="absolute top-[10%] left-[45%] w-16 h-28 pointer-events-none select-none overflow-hidden z-20 flex justify-center">
      {/* Steam Line 1 */}
      <div className="steam-line steam-1 absolute bottom-4 w-[4px] bg-[#F5F1EA]/30 blur-[3px] rounded-full" />
      {/* Steam Line 2 */}
      <div className="steam-line steam-2 absolute bottom-4 w-[5px] bg-[#F5F1EA]/25 blur-[4px] rounded-full" style={{ animationDelay: '1.5s' }} />
      {/* Steam Line 3 */}
      <div className="steam-line steam-3 absolute bottom-4 w-[4px] bg-[#F5F1EA]/20 blur-[3px] rounded-full" style={{ animationDelay: '3s' }} />
      
      <style>{`
        .steam-line {
          height: 0;
          opacity: 0;
          transform-origin: bottom center;
          animation: steam-drift 5s infinite linear;
        }
        .steam-1 {
          left: 35%;
          animation-name: steam-drift-left;
        }
        .steam-2 {
          left: 50%;
          animation-name: steam-drift-center;
        }
        .steam-3 {
          left: 65%;
          animation-name: steam-drift-right;
        }
        @keyframes steam-drift-left {
          0% {
            height: 0px;
            opacity: 0;
            transform: translateY(0) scaleX(1);
          }
          15% {
            opacity: 0.5;
          }
          50% {
            height: 55px;
            opacity: 0.35;
            transform: translateY(-20px) translateX(-5px) scaleX(1.3);
          }
          100% {
            height: 80px;
            opacity: 0;
            transform: translateY(-65px) translateX(-15px) scaleX(1.8);
          }
        }
        @keyframes steam-drift-center {
          0% {
            height: 0px;
            opacity: 0;
            transform: translateY(0) scaleX(1);
          }
          20% {
            opacity: 0.45;
          }
          50% {
            height: 65px;
            opacity: 0.3;
            transform: translateY(-25px) translateX(3px) scaleX(1.4);
          }
          100% {
            height: 90px;
            opacity: 0;
            transform: translateY(-75px) translateX(8px) scaleX(2);
          }
        }
        @keyframes steam-drift-right {
          0% {
            height: 0px;
            opacity: 0;
            transform: translateY(0) scaleX(1);
          }
          10% {
            opacity: 0.4;
          }
          50% {
            height: 50px;
            opacity: 0.25;
            transform: translateY(-15px) translateX(8px) scaleX(1.2);
          }
          100% {
            height: 75px;
            opacity: 0;
            transform: translateY(-60px) translateX(18px) scaleX(1.6);
          }
        }
      `}</style>
    </div>
  );
};

export default AnimatedSteam;
