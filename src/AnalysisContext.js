// AnalysisContext.js - Enhanced Global state management for stock analysis
import React, { createContext, useContext, useState, useCallback, useRef } from 'react';

const AnalysisContext = createContext();

export const useAnalysis = () => {
  const context = useContext(AnalysisContext);
  if (!context) {
    throw new Error('useAnalysis must be used within AnalysisProvider');
  }
  return context;
};

export const AnalysisProvider = ({ children }) => {
  // Global analysis states
  const [globalAnalysisData, setGlobalAnalysisData] = useState({});
  const [globalDeepAnalysisData, setGlobalDeepAnalysisData] = useState({
    income: null,
    balance: null,
    cashflow: null
  });
  const [globalLoadingStates, setGlobalLoadingStates] = useState({
    full: false,
    technical: false,
    income: false,
    balance: false,
    cashflow: false,
    deepIncome: false,
    deepBalance: false,
    deepCashflow: false
  });
  const [currentSymbol, setCurrentSymbol] = useState('');
  const [currentInterval, setCurrentInterval] = useState('1D');
  
  // Refs to track ongoing operations
  const activeOperationsRef = useRef(new Set());
  const abortControllersRef = useRef(new Map());
  
  // Add operation to active set
  const addActiveOperation = useCallback((operationId) => {
    activeOperationsRef.current.add(operationId);
    console.log(`➕ Added operation: ${operationId}. Active operations: ${activeOperationsRef.current.size}`);
  }, []);
  
  // Remove operation from active set
  const removeActiveOperation = useCallback((operationId) => {
    activeOperationsRef.current.delete(operationId);
    // Clean up abort controller
    if (abortControllersRef.current.has(operationId)) {
      abortControllersRef.current.delete(operationId);
    }
    console.log(`➖ Removed operation: ${operationId}. Active operations: ${activeOperationsRef.current.size}`);
  }, []);
  
  // Check if any operation is active
  const hasActiveOperations = useCallback(() => {
    return activeOperationsRef.current.size > 0;
  }, []);
  
  // Get all active operations
  const getActiveOperations = useCallback(() => {
    return Array.from(activeOperationsRef.current);
  }, []);
  
  // Store abort controller for an operation
  const setAbortController = useCallback((operationId, controller) => {
    abortControllersRef.current.set(operationId, controller);
    console.log(`🎛️  Stored abort controller for: ${operationId}`);
  }, []);
  
  // Get abort controller for an operation
  const getAbortController = useCallback((operationId) => {
    return abortControllersRef.current.get(operationId);
  }, []);
  
  // Cancel all active operations
  const cancelAllOperations = useCallback(() => {
    console.log(`🚫 Cancelling all operations. Total active: ${activeOperationsRef.current.size}`);
    
    let cancelledCount = 0;
    
    // Cancel all abort controllers
    activeOperationsRef.current.forEach(operationId => {
      const controller = abortControllersRef.current.get(operationId);
      if (controller) {
        try {
          controller.abort();
          cancelledCount++;
          console.log(`❌ Cancelled operation: ${operationId}`);
        } catch (error) {
          console.error(`Failed to cancel operation ${operationId}:`, error);
        }
      }
    });
    
    // Clear all operations and controllers
    activeOperationsRef.current.clear();
    abortControllersRef.current.clear();
    
    // Reset all loading states except 'full' (which will be handled by the calling function)
    setGlobalLoadingStates(prev => ({
      ...prev,
      technical: false,
      income: false,
      balance: false,
      cashflow: false,
      deepIncome: false,
      deepBalance: false,
      deepCashflow: false
    }));
    
    console.log(`✅ Cancelled ${cancelledCount} operations successfully`);
    
    return cancelledCount;
  }, [setGlobalLoadingStates]);
  
  // Cancel specific operation
  const cancelOperation = useCallback((operationId) => {
    if (!operationId) {
      console.warn('⚠️  Attempted to cancel operation with no ID');
      return false;
    }
    
    console.log(`🚫 Cancelling specific operation: ${operationId}`);
    
    const controller = abortControllersRef.current.get(operationId);
    if (controller) {
      try {
        controller.abort();
        activeOperationsRef.current.delete(operationId);
        abortControllersRef.current.delete(operationId);
        console.log(`❌ Successfully cancelled operation: ${operationId}`);
        return true;
      } catch (error) {
        console.error(`Failed to cancel operation ${operationId}:`, error);
        return false;
      }
    } else {
      console.warn(`⚠️  No abort controller found for operation: ${operationId}`);
      // Still remove from active operations in case it's stuck
      activeOperationsRef.current.delete(operationId);
      return false;
    }
  }, []);
  
  const value = {
    // States
    globalAnalysisData,
    setGlobalAnalysisData,
    globalDeepAnalysisData,
    setGlobalDeepAnalysisData,
    globalLoadingStates,
    setGlobalLoadingStates,
    currentSymbol,
    setCurrentSymbol,
    currentInterval,
    setCurrentInterval,
    
    // Operation tracking
    addActiveOperation,
    removeActiveOperation,
    hasActiveOperations,
    getActiveOperations,
    setAbortController,
    getAbortController,
    cancelAllOperations,  // 新增
    cancelOperation       // 新增
  };
  
  return (
    <AnalysisContext.Provider value={value}>
      {children}
    </AnalysisContext.Provider>
  );
};