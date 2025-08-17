// PortfolioContext.js - Global state management for portfolio analysis
import React, { createContext, useContext, useState, useCallback, useRef } from 'react';

const PortfolioContext = createContext();

export const usePortfolio = () => {
  const context = useContext(PortfolioContext);
  if (!context) {
    throw new Error('usePortfolio must be used within PortfolioProvider');
  }
  return context;
};

export const PortfolioProvider = ({ children }) => {
  // Global portfolio states
  const [globalPortfolioData, setGlobalPortfolioData] = useState({
    symbols: [],
    config: {
      target_return: '0.12',
      lookback_days: '252',
      risk_free_symbol: 'BND',
      market_benchmark_symbol: 'SPY',
      weight_strategy: 'risk_parity'
    },
    analysisResult: null,
    lastAnalysisTime: null
  });
  
  const [globalPortfolioLoadingState, setGlobalPortfolioLoadingState] = useState(false);
  const [globalPortfolioError, setGlobalPortfolioError] = useState(null);
  
  // Refs to track ongoing operations
  const activePortfolioOperationsRef = useRef(new Set());
  const portfolioAbortControllersRef = useRef(new Map());
  
  // Add operation to active set
  const addActivePortfolioOperation = useCallback((operationId) => {
    activePortfolioOperationsRef.current.add(operationId);
  }, []);
  
  // Remove operation from active set
  const removeActivePortfolioOperation = useCallback((operationId) => {
    activePortfolioOperationsRef.current.delete(operationId);
    // Clean up abort controller
    if (portfolioAbortControllersRef.current.has(operationId)) {
      portfolioAbortControllersRef.current.delete(operationId);
    }
  }, []);
  
  // Check if any portfolio operation is active
  const hasActivePortfolioOperations = useCallback(() => {
    return activePortfolioOperationsRef.current.size > 0;
  }, []);
  
  // Get all active portfolio operations
  const getActivePortfolioOperations = useCallback(() => {
    return Array.from(activePortfolioOperationsRef.current);
  }, []);
  
  // Store abort controller for a portfolio operation
  const setPortfolioAbortController = useCallback((operationId, controller) => {
    portfolioAbortControllersRef.current.set(operationId, controller);
  }, []);
  
  // Get abort controller for a portfolio operation
  const getPortfolioAbortController = useCallback((operationId) => {
    return portfolioAbortControllersRef.current.get(operationId);
  }, []);
  
  // Update portfolio symbols
  const updatePortfolioSymbols = useCallback((symbols) => {
    setGlobalPortfolioData(prev => ({
      ...prev,
      symbols
    }));
  }, []);
  
  // Update portfolio config
  const updatePortfolioConfig = useCallback((config) => {
    setGlobalPortfolioData(prev => ({
      ...prev,
      config: { ...prev.config, ...config }
    }));
  }, []);
  
  // Update analysis result
  const updatePortfolioAnalysisResult = useCallback((result) => {
    setGlobalPortfolioData(prev => ({
      ...prev,
      analysisResult: result,
      lastAnalysisTime: new Date().toISOString()
    }));
  }, []);
  
  // Clear analysis result
  const clearPortfolioAnalysisResult = useCallback(() => {
    setGlobalPortfolioData(prev => ({
      ...prev,
      analysisResult: null,
      lastAnalysisTime: null
    }));
  }, []);
  
  const value = {
    // States
    globalPortfolioData,
    setGlobalPortfolioData,
    globalPortfolioLoadingState,
    setGlobalPortfolioLoadingState,
    globalPortfolioError,
    setGlobalPortfolioError,
    
    // Helper functions
    updatePortfolioSymbols,
    updatePortfolioConfig,
    updatePortfolioAnalysisResult,
    clearPortfolioAnalysisResult,
    
    // Operation tracking
    addActivePortfolioOperation,
    removeActivePortfolioOperation,
    hasActivePortfolioOperations,
    getActivePortfolioOperations,
    setPortfolioAbortController,
    getPortfolioAbortController
  };
  
  return (
    <PortfolioContext.Provider value={value}>
      {children}
    </PortfolioContext.Provider>
  );
};