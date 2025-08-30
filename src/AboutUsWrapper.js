import React, { useState, useEffect } from 'react';
import Aboutus2 from './Aboutus2';
import Aboutus2Mobile from './Aboutus2Mobile';

const AboutUsWrapper = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    // Initial check
    checkMobile();
    
    // Add event listener for window resize
    window.addEventListener('resize', checkMobile);
    
    // Cleanup
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Render appropriate component based on screen size
  return isMobile ? <Aboutus2Mobile /> : <Aboutus2 />;
};

export default AboutUsWrapper;