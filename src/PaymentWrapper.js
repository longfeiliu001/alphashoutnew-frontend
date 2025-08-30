// PaymentWrapper.js - Smart wrapper for payment routing
import React, { useState, useEffect } from 'react';
import Payment4 from './Payment4';
import Payment4Mobile from './Payment4Mobile';

const PaymentWrapper = () => {
  const [deviceType, setDeviceType] = useState('detecting');
  const [hasWalletExtension, setHasWalletExtension] = useState(false);
  
  useEffect(() => {
    detectDeviceAndWallet();
    
    // Re-check on window focus (user might install extension)
    window.addEventListener('focus', detectDeviceAndWallet);
    return () => window.removeEventListener('focus', detectDeviceAndWallet);
  }, []);

  const detectDeviceAndWallet = () => {
    const ua = navigator.userAgent;
    
    // Check for wallet extensions
    const walletDetected = !!(
      window.phantom?.solana || 
      window.solflare || 
      window.bitkeep?.solana
    );
    
    setHasWalletExtension(walletDetected);
    
    // If wallet extension exists, always use desktop version
    if (walletDetected) {
      setDeviceType('desktop');
      return;
    }
    
    // Device detection
    const isMobile = /iPhone|iPod|Android.*Mobile/i.test(ua);
    const isTablet = /iPad|Android(?!.*Mobile)|Tablet/i.test(ua) || 
                     (ua.includes('Macintosh') && 'ontouchend' in document);
    
    if (isMobile || isTablet) {
      setDeviceType('mobile');
    } else {
      setDeviceType('desktop');
    }
  };

  // Force desktop/mobile for testing via URL params
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const forceMode = params.get('payment_mode');
    
    if (forceMode === 'mobile') {
      setDeviceType('mobile');
    } else if (forceMode === 'desktop') {
      setDeviceType('desktop');
    }
  }, []);

  // Loading state while detecting
  if (deviceType === 'detecting') {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#f8f9fa'
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: '4px solid #e9ecef',
            borderTop: '4px solid #007bff',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 20px'
          }}></div>
          <div style={{ color: '#6c757d' }}>Detecting payment options...</div>
        </div>
        <style>
          {`@keyframes spin { 0% { transform: rotate(0deg); } 100% { transform: rotate(360deg); } }`}
        </style>
      </div>
    );
  }

  // Development mode indicator
  const isDevelopment = process.env.NODE_ENV === 'development';
  
  return (
    <>
      {isDevelopment && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          backgroundColor: '#ffc107',
          color: '#000',
          padding: '4px',
          fontSize: '11px',
          textAlign: 'center',
          zIndex: 9999
        }}>
          Payment Mode: {deviceType.toUpperCase()} 
          {hasWalletExtension && ' (Wallet Detected)'}
          {' | '}
          <a href="?payment_mode=mobile" style={{ color: '#000' }}>Force Mobile</a>
          {' | '}
          <a href="?payment_mode=desktop" style={{ color: '#000' }}>Force Desktop</a>
        </div>
      )}
      
      {deviceType === 'mobile' ? <Payment4Mobile /> : <Payment4 />}
    </>
  );
};

export default PaymentWrapper;