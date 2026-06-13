import { useState, useEffect } from 'react';

export const useScrollVisibility = () => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const handleScroll = (e) => {
      // e.target represents the scrolling element
      const scrollTop = e.target.scrollTop || 0;
      if (scrollTop < 30) {
        setIsVisible(true);
      } else {
        setIsVisible(false);
      }
    };

    // Listen to scroll events in the capture phase (third parameter = true)
    // This catches events from scrollable children like the <main> container in MainLayout.jsx
    window.addEventListener('scroll', handleScroll, true);
    return () => window.removeEventListener('scroll', handleScroll, true);
  }, []);

  return isVisible;
};
