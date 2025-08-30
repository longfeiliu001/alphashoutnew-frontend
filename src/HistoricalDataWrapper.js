import React, { useState, useEffect } from 'react';
import Historicaldata from './Historicaldata';
import HistoricalDataMobile from './HistoricalDataMobile';

export default function HistoricalDataWrapper() {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    
    // Check on mount
    handleResize();

    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  // Render appropriate component based on screen size
  return isMobile ? <HistoricalDataMobile /> : <Historicaldata />;
}