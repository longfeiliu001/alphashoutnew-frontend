// StockthirteenWrapper.js
import React, { useState, useEffect } from 'react';
import Stockthirteen from './Stockthirteen';
import StockthirteenDemo from './StockthirteenDemo';
import StockthirteenMobile from './StockthirteenMobile';
import StockthirteenMobileDemo from './StockthirteenMobileDemo';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export default function StockthirteenWrapper() {
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  
  // Check authentication
  const checkAuthentication = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
        credentials: 'include'
      });
      return response.ok;
    } catch (error) {
      console.error('Auth check error:', error);
      return false;
    }
  };
  
  useEffect(() => {
    const init = async () => {
      // Check device
      const mobile = window.innerWidth <= 768 || 
                    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      setIsMobile(mobile);
      
      // Check authentication
      const authenticated = await checkAuthentication();
      setIsAuthenticated(authenticated);
      
      setIsLoading(false);
    };
    
    init();
    
    const checkDevice = () => {
      const mobile = window.innerWidth <= 768 || 
                    /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      setIsMobile(mobile);
    };
    
    window.addEventListener('resize', checkDevice);
    return () => window.removeEventListener('resize', checkDevice);
  }, []);
  
  if (isLoading) {
    return <div style={{ padding: '20px', textAlign: 'center' }}>Loading...</div>;
  }
  
  // Decision logic
  if (isAuthenticated) {
    // Authenticated users get the original components
    return isMobile ? <StockthirteenMobile /> : <Stockthirteen />;
  } else {
    // Non-authenticated users get the demo components
    return isMobile ? <StockthirteenMobileDemo /> : <StockthirteenDemo />;
  }
}