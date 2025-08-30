// StockthirteenWrapper.js
import React, { useState, useEffect } from 'react';
import Stockthirteen from './Stockthirteen';
import StockthirteenMobile from './StockthirteenMobile';

export default function StockthirteenWrapper() {
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const checkDevice = () => {
      const mobile = window.innerWidth <= 768 || 
                    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      setIsMobile(mobile);
      setIsLoading(false);
    };
    
    checkDevice();
    window.addEventListener('resize', checkDevice);
    
    return () => window.removeEventListener('resize', checkDevice);
  }, []);
  
  if (isLoading) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div>;
  }
  
  return isMobile ? <StockthirteenMobile /> : <Stockthirteen />;
}