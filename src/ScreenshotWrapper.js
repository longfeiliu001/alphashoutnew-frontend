import React, { useState, useEffect } from 'react';
import Screenshot9 from './Screenshot9'; // Desktop version (original)
import Screenshot9Mobile from './Screenshot9Mobile'; // Mobile version

const ScreenshotWrapper = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTablet] = useState(false);
  
  useEffect(() => {
    // Initial detection
    detectDevice();
    
    // Listen for resize events
    window.addEventListener('resize', detectDevice);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', detectDevice);
    };
  }, []);
  
  const detectDevice = () => {
    const width = window.innerWidth;
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    
    // Check for mobile devices using user agent
    const isMobileUA = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(userAgent.toLowerCase());
    
    // Check for touch capability
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    // Breakpoints
    const mobileBreakpoint = 768;
    const tabletBreakpoint = 1024;
    
    // Determine device type
    if (width <= mobileBreakpoint || (isMobileUA && hasTouch && width <= tabletBreakpoint)) {
      setIsMobile(true);
      setIsTablet(false);
    } else if (width <= tabletBreakpoint) {
      setIsMobile(false);
      setIsTablet(true);
    } else {
      setIsMobile(false);
      setIsTablet(false);
    }
  };
  
  // Optional: Show loading state during initial detection
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    // Small delay to ensure proper detection
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 100);
    
    return () => clearTimeout(timer);
  }, []);
  
  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '400px',
        fontSize: '16px',
        color: '#999'
      }}>
        Loading...
      </div>
    );
  }
  
  // Render appropriate component based on device type
  // For tablets, we can use the mobile version with slightly adjusted styling
  if (isMobile || isTablet) {
    return <Screenshot9Mobile isTablet={isTablet} />;
  }
  
  return <Screenshot9 />;
};

export default ScreenshotWrapper;