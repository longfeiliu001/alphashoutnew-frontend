// LoginWrapper.js - Responsive Login Wrapper Component
import React, { useState, useEffect } from 'react';
import Login5 from './Login5'; // Original desktop login
import MobileLogin from './MobileLogin'; // New mobile login
import { AuthProvider } from './Login5'; // Import AuthProvider

// Device detection utility
const DeviceDetector = {
  isMobile: () => {
    // Check viewport width
    if (window.innerWidth <= 768) return true;
    
    // Check user agent for mobile devices
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    const mobileRegex = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i;
    
    // Check for touch capability
    const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    
    // Return true if any mobile indicator is found
    return mobileRegex.test(userAgent.toLowerCase()) || (hasTouch && window.innerWidth <= 1024);
  },
  
  isTablet: () => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    const tabletRegex = /ipad|android(?!.*mobile)|tablet/i;
    
    return tabletRegex.test(userAgent.toLowerCase()) || 
           (window.innerWidth > 768 && window.innerWidth <= 1024 && 'ontouchstart' in window);
  },
  
  getDeviceType: () => {
    if (DeviceDetector.isMobile()) return 'mobile';
    if (DeviceDetector.isTablet()) return 'tablet';
    return 'desktop';
  }
};

// Loading component for transition
const LoadingTransition = () => (
  <div style={{
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: '#003D6D',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    color: 'white',
    fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
    zIndex: 9999
  }}>
    <div style={{
      width: '60px',
      height: '60px',
      border: '3px solid rgba(255, 255, 255, 0.3)',
      borderTopColor: 'white',
      borderRadius: '50%',
      animation: 'spin 1s linear infinite'
    }}/>
    <div style={{ marginTop: '24px', fontSize: '18px', fontWeight: '500' }}>
      AlphaShout
    </div>
    <div style={{ marginTop: '8px', fontSize: '14px', opacity: 0.8 }}>
      Loading...
    </div>
    <style jsx>{`
      @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
      }
    `}</style>
  </div>
);

// Main Wrapper Component - Now properly wrapped with AuthProvider
const LoginWrapper = () => {
  const [deviceType, setDeviceType] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [orientation, setOrientation] = useState(
    window.innerHeight > window.innerWidth ? 'portrait' : 'landscape'
  );

  useEffect(() => {
    // Initial device detection
    const detectDevice = () => {
      const type = DeviceDetector.getDeviceType();
      setDeviceType(type);
      setIsLoading(false);
    };

    // Detect orientation
    const detectOrientation = () => {
      setOrientation(window.innerHeight > window.innerWidth ? 'portrait' : 'landscape');
    };

    // Handle resize events with debouncing
    let resizeTimeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      setIsLoading(true);
      
      resizeTimeout = setTimeout(() => {
        detectDevice();
        detectOrientation();
      }, 300); // Debounce for 300ms
    };

    // Handle orientation change
    const handleOrientationChange = () => {
      detectOrientation();
      
      // Force re-detection after orientation change
      setTimeout(() => {
        detectDevice();
      }, 100);
    };

    // Initial detection
    detectDevice();
    detectOrientation();

    // Add event listeners
    window.addEventListener('resize', handleResize);
    window.addEventListener('orientationchange', handleOrientationChange);

    // Cleanup
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleOrientationChange);
      clearTimeout(resizeTimeout);
    };
  }, []);

  // Show loading during transition
  if (isLoading || !deviceType) {
    return <LoadingTransition />;
  }

  // Wrap everything with AuthProvider to ensure context is available
  // NOTE: If your App.js already wraps with AuthProvider, remove this wrapper
  return (
    <AuthProvider>
      {deviceType === 'mobile' ? (
        <div className="login-wrapper mobile-wrapper">
          <MobileLogin />
        </div>
      ) : deviceType === 'tablet' ? (
        orientation === 'portrait' ? (
          <div className="login-wrapper tablet-wrapper portrait">
            <MobileLogin />
          </div>
        ) : (
          <div className="login-wrapper tablet-wrapper landscape">
            <Login5 />
          </div>
        )
      ) : (
        <div className="login-wrapper desktop-wrapper">
          <Login5 />
        </div>
      )}
    </AuthProvider>
  );
};

// Export additional utilities for use in other components
export { DeviceDetector };
export default LoginWrapper;