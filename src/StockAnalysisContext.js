import React, { createContext, useContext, useState, useRef, useCallback } from 'react';

// Create the context
const StockAnalysisContext = createContext();

// Custom hook to use the context
export const useStockAnalysis = () => {
  const context = useContext(StockAnalysisContext);
  if (!context) {
    throw new Error('useStockAnalysis must be used within a StockAnalysisProvider');
  }
  return context;
};

// Provider component
export const StockAnalysisProvider = ({ children }) => {
  // Global states
  const [globalAnalysisData, setGlobalAnalysisData] = useState(null);
  const [globalChartData, setGlobalChartData] = useState({
    price: [],
    rsi: [],
    macd: []
  });
  const [globalLoadingState, setGlobalLoadingState] = useState(false);
  const [globalError, setGlobalError] = useState(null);
  
  // Current analysis parameters
  const [currentSymbol, setCurrentSymbol] = useState('');
  const [currentInterval, setCurrentInterval] = useState('daily');
  const [currentSearchQuery, setCurrentSearchQuery] = useState('');
  
  // Operation tracking
  const activeOperations = useRef(new Map());
  const abortControllers = useRef(new Map());
  
  // Add active operation
  const addActiveOperation = useCallback((operationId) => {
    activeOperations.current.set(operationId, {
      id: operationId,
      startTime: Date.now(),
      status: 'active'
    });
    console.log(`[StockAnalysis] Added operation: ${operationId}`);
  }, []);
  
  // Remove active operation
  const removeActiveOperation = useCallback((operationId) => {
    activeOperations.current.delete(operationId);
    const controller = abortControllers.current.get(operationId);
    if (controller) {
      abortControllers.current.delete(operationId);
    }
    console.log(`[StockAnalysis] Removed operation: ${operationId}`);
  }, []);
  
  // Set abort controller for operation
  const setAbortController = useCallback((operationId, controller) => {
    abortControllers.current.set(operationId, controller);
  }, []);
  
  // Get abort controller for operation
  const getAbortController = useCallback((operationId) => {
    return abortControllers.current.get(operationId);
  }, []);
  
  // Cancel specific operation
  const cancelOperation = useCallback((operationId) => {
    const controller = abortControllers.current.get(operationId);
    if (controller) {
      controller.abort();
      removeActiveOperation(operationId);
      console.log(`[StockAnalysis] Cancelled operation: ${operationId}`);
      return true;
    }
    return false;
  }, [removeActiveOperation]);
  
  // Cancel all operations
  const cancelAllOperations = useCallback(() => {
    let cancelledCount = 0;
    activeOperations.current.forEach((operation, operationId) => {
      if (cancelOperation(operationId)) {
        cancelledCount++;
      }
    });
    console.log(`[StockAnalysis] Cancelled ${cancelledCount} operations`);
    return cancelledCount;
  }, [cancelOperation]);
  
  // Check if has active operations
  const hasActiveOperations = useCallback(() => {
    return activeOperations.current.size > 0;
  }, []);
  
  // Get active operations count
  const getActiveOperationsCount = useCallback(() => {
    return activeOperations.current.size;
  }, []);
  
  // Update analysis result
  const updateAnalysisResult = useCallback((analysisData) => {
    setGlobalAnalysisData(analysisData);
    setGlobalError(null);
  }, []);
  
  // Update chart data
  const updateChartData = useCallback((chartData) => {
    setGlobalChartData(chartData);
  }, []);
  
  // Clear analysis result
  const clearAnalysisResult = useCallback(() => {
    setGlobalAnalysisData(null);
    setGlobalChartData({
      price: [],
      rsi: [],
      macd: []
    });
    setGlobalError(null);
  }, []);
  
  // Save to storage
  const saveToStorage = useCallback(() => {
    try {
      const storageData = {
        analysisData: globalAnalysisData,
        chartData: globalChartData,
        symbol: currentSymbol,
        searchQuery: currentSearchQuery,
        interval: currentInterval,
        timestamp: Date.now()
      };
      sessionStorage.setItem('stockAnalysis_data', JSON.stringify(storageData));
      return true;
    } catch (error) {
      console.error('[StockAnalysis] Save to storage failed:', error);
      return false;
    }
  }, [globalAnalysisData, globalChartData, currentSymbol, currentSearchQuery, currentInterval]);
  
  // Load from storage
  const loadFromStorage = useCallback(() => {
    try {
      const storedData = sessionStorage.getItem('stockAnalysis_data');
      if (storedData) {
        const data = JSON.parse(storedData);
        // Check if data is not too old (30 minutes)
        if (Date.now() - data.timestamp < 30 * 60 * 1000) {
          return data;
        }
      }
      return null;
    } catch (error) {
      console.error('[StockAnalysis] Load from storage failed:', error);
      return null;
    }
  }, []);
  
  // Check for ongoing analysis
  const checkOngoingAnalysis = useCallback(() => {
    const ongoing = sessionStorage.getItem('stockAnalysis_ongoing');
    if (ongoing) {
      try {
        const data = JSON.parse(ongoing);
        // Check if not too old (5 minutes)
        if (Date.now() - data.timestamp < 5 * 60 * 1000) {
          return data;
        }
        sessionStorage.removeItem('stockAnalysis_ongoing');
      } catch (error) {
        console.error('[StockAnalysis] Check ongoing analysis failed:', error);
      }
    }
    return null;
  }, []);
  
  // Mark analysis as ongoing
  const markAnalysisOngoing = useCallback((symbol, interval) => {
    const data = {
      symbol,
      interval,
      timestamp: Date.now()
    };
    sessionStorage.setItem('stockAnalysis_ongoing', JSON.stringify(data));
  }, []);
  
  // Clear ongoing analysis marker
  const clearOngoingAnalysis = useCallback(() => {
    sessionStorage.removeItem('stockAnalysis_ongoing');
  }, []);
  
  const value = {
    // States
    globalAnalysisData,
    setGlobalAnalysisData,
    globalChartData,
    setGlobalChartData,
    globalLoadingState,
    setGlobalLoadingState,
    globalError,
    setGlobalError,
    currentSymbol,
    setCurrentSymbol,
    currentInterval,
    setCurrentInterval,
    currentSearchQuery,
    setCurrentSearchQuery,
    
    // Operation management
    addActiveOperation,
    removeActiveOperation,
    setAbortController,
    getAbortController,
    cancelOperation,
    cancelAllOperations,
    hasActiveOperations,
    getActiveOperationsCount,
    
    // Data management
    updateAnalysisResult,
    updateChartData,
    clearAnalysisResult,
    
    // Storage management
    saveToStorage,
    loadFromStorage,
    checkOngoingAnalysis,
    markAnalysisOngoing,
    clearOngoingAnalysis
  };
  
  return (
    <StockAnalysisContext.Provider value={value}>
      {children}
    </StockAnalysisContext.Provider>
  );
};