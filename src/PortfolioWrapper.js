import React, { useState, useEffect } from 'react';
import Portfoliocapm7 from './Portfoliocapm7';
import PortfoliocapmMobile from './PortfoliocapmMobile';
import { Spin } from 'antd';
import { LoadingOutlined } from '@ant-design/icons';

const PortfolioWrapper = () => {
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if mobile on mount and resize
    const checkMobile = () => {
      const mobile = window.innerWidth <= 768;
      setIsMobile(mobile);
      setIsLoading(false);
    };

    checkMobile();
    
    // Add resize listener
    window.addEventListener('resize', checkMobile);
    
    // Cleanup
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Loading state
  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #e9ecef 100%)'
      }}>
        <Spin 
          indicator={<LoadingOutlined style={{ fontSize: 32, color: '#003d7a' }} spin />}
          tip="Loading Portfolio Analytics..."
          style={{ color: '#003d7a' }}
        />
      </div>
    );
  }

  // Render appropriate component based on screen size
  return isMobile ? <PortfoliocapmMobile /> : <Portfoliocapm7 />;
};

export default PortfolioWrapper;