// src/utils/analytics.js
// ALPHASHOUT Google Analytics 4 完整集成 - 最终版
// 测量 ID: G-5VG3EFDLVZ
// 数据流: alphashout digitalocean
// 创建日期: 2025-08-25
// 版本: 1.0.0

import ReactGA from 'react-ga4';

// ==================== 配置常量 ====================

// 从环境变量获取配置，带默认值
export const GA_MEASUREMENT_ID = process.env.REACT_APP_GA_MEASUREMENT_ID || 'G-5VG3EFDLVZ';
const ENABLE_ANALYTICS = process.env.REACT_APP_ENABLE_ANALYTICS === 'true';
const APP_VERSION = process.env.REACT_APP_VERSION || '1.0.0';
const NODE_ENV = process.env.NODE_ENV || 'development';

// 初始化状态
let isInitialized = false;

// ==================== 核心初始化函数 ====================

/**
 * 初始化 Google Analytics 4
 * 根据环境变量自动决定是否启用跟踪
 */
export const initGA = () => {
  // 防止重复初始化
  if (isInitialized) {
    console.log('🔄 GA4 already initialized');
    return;
  }

  // 验证测量ID
  if (!GA_MEASUREMENT_ID || !GA_MEASUREMENT_ID.startsWith('G-')) {
    console.error('❌ Invalid or missing GA_MEASUREMENT_ID:', GA_MEASUREMENT_ID);
    return;
  }

  // 决定是否启用（生产环境或明确启用）
  const shouldInitialize = NODE_ENV === 'production' || ENABLE_ANALYTICS;
  
  if (!shouldInitialize) {
    console.log(`🚫 GA4 disabled - ENV: ${NODE_ENV}, ENABLE: ${ENABLE_ANALYTICS}`);
    return;
  }

  try {
    // GA4 初始化配置
    const config = {
      debug: NODE_ENV === 'development',
      testMode: NODE_ENV !== 'production',
      gtagOptions: {
        // 隐私设置
        anonymize_ip: true,
        cookie_expires: 63072000, // 2年
        
        // 根据环境调整Google信号
        allow_google_signals: NODE_ENV === 'production',
        allow_ad_personalization_signals: NODE_ENV === 'production',
        
        // Cookie 设置
        cookie_domain: NODE_ENV === 'production' ? 'alphashout.app' : 'auto',
        cookie_update: true,
        cookie_flags: NODE_ENV === 'production' ? 'SameSite=None;Secure' : 'SameSite=Lax',
        
        // 自定义配置
        send_page_view: false, // 我们手动发送页面浏览
        custom_map: {
          'custom_parameter_1': 'user_type',
          'custom_parameter_2': 'feature_usage'
        }
      }
    };

    // 执行初始化
    ReactGA.initialize(GA_MEASUREMENT_ID, config);
    isInitialized = true;
    
    console.log(`✅ GA4 initialized successfully`);
    console.log(`📊 Environment: ${NODE_ENV}, Version: ${APP_VERSION}`);
    console.log(`🎯 Measurement ID: ${GA_MEASUREMENT_ID}`);
    
    // 发送初始页面浏览事件
    sendInitialPageView();
    
  } catch (error) {
    console.error('❌ GA4 initialization failed:', error);
    isInitialized = false;
  }
};

/**
 * 发送初始页面浏览事件
 */
const sendInitialPageView = () => {
  const initialPageView = {
    hitType: "pageview",
    page: window.location.pathname + window.location.search,
    title: document.title,
    page_location: window.location.href,
    page_referrer: document.referrer || 'direct',
    app_version: APP_VERSION,
    environment: NODE_ENV
  };
  
  ReactGA.send(initialPageView);
  console.log('📄 Initial page view sent:', initialPageView.page);
};

// ==================== 核心跟踪函数 ====================

/**
 * 检查是否应该发送跟踪数据
 */
const shouldTrack = () => {
  return isInitialized && (NODE_ENV === 'production' || ENABLE_ANALYTICS);
};

/**
 * 页面浏览跟踪
 * @param {string} path - 页面路径
 * @param {string} title - 页面标题
 * @param {object} additionalData - 额外数据
 */
export const trackPageView = (path, title, additionalData = {}) => {
  if (!shouldTrack()) {
    console.log(`🔇 Page view tracking disabled: ${path}`);
    return;
  }

  const pageViewData = {
    hitType: "pageview",
    page: path,
    title: title,
    page_location: `https://alphashout.app${path}`,
    timestamp: new Date().toISOString(),
    app_version: APP_VERSION,
    environment: NODE_ENV,
    ...additionalData
  };

  ReactGA.send(pageViewData);
  console.log(`📄 Page View: ${path} - ${title}`);
};

/**
 * 通用事件跟踪
 * @param {string} eventName - 事件名称
 * @param {object} parameters - 事件参数
 */
export const trackEvent = (eventName, parameters = {}) => {
  if (!shouldTrack()) {
    console.log(`🔇 Event tracking disabled: ${eventName}`, parameters);
    return;
  }

  const eventData = {
    timestamp: new Date().toISOString(),
    page_location: window.location.href,
    page_title: document.title,
    app_version: APP_VERSION,
    environment: NODE_ENV,
    ...parameters
  };

  ReactGA.event(eventName, eventData);
  console.log(`🎯 Event: ${eventName}`, eventData);
};

// ==================== ALPHASHOUT 业务专用跟踪函数 ====================

/**
 * 股票分析相关跟踪
 */
export const trackStockAnalysis = (stockSymbol, analysisType = 'fundamental') => {
  trackEvent('stock_analysis_started', {
    stock_symbol: stockSymbol?.toUpperCase(),
    analysis_type: analysisType,
    feature: 'financial_statement_analysis',
    category: 'analysis_tools',
    component: 'stockthirteen'
  });
};

export const trackStockAnalysisCompleted = (stockSymbol, success = true, duration = null) => {
  const eventData = {
    stock_symbol: stockSymbol?.toUpperCase(),
    success: success,
    feature: 'financial_statement_analysis',
    category: 'analysis_tools',
    component: 'stockthirteen'
  };

  if (duration !== null) {
    eventData.duration_seconds = Math.round(duration);
    eventData.duration_category = duration < 10 ? 'fast' : duration < 30 ? 'medium' : 'slow';
  }

  trackEvent('stock_analysis_completed', eventData);
};

/**
 * 投资组合优化相关跟踪
 */
export const trackPortfolioOptimization = (portfolioSize, strategy) => {
  trackEvent('portfolio_optimization_started', {
    portfolio_size: portfolioSize,
    optimization_strategy: strategy,
    feature: 'portfolio_optimization',
    category: 'portfolio_tools',
    component: 'portfoliocapm7'
  });
};

export const trackPortfolioCompleted = (portfolioSize, strategy, success = true, duration = null) => {
  const eventData = {
    portfolio_size: portfolioSize,
    optimization_strategy: strategy,
    success: success,
    feature: 'portfolio_optimization',
    category: 'portfolio_tools',
    component: 'portfoliocapm7'
  };

  if (duration !== null) {
    eventData.duration_seconds = Math.round(duration);
  }

  trackEvent('portfolio_optimization_completed', eventData);
};

/**
 * 图表分析相关跟踪
 */
export const trackChartUpload = (fileType, fileSize) => {
  trackEvent('chart_upload', {
    file_type: fileType,
    file_size_kb: Math.round(fileSize / 1024),
    file_size_category: fileSize < 100000 ? 'small' : fileSize < 1000000 ? 'medium' : 'large',
    feature: 'chart_analysis',
    category: 'analysis_tools',
    component: 'screenshot9'
  });
};

export const trackChartAnalysisCompleted = (analysisResult, success = true) => {
  trackEvent('chart_analysis_completed', {
    analysis_result: analysisResult,
    success: success,
    feature: 'chart_analysis',
    category: 'analysis_tools',
    component: 'screenshot9'
  });
};

/**
 * 历史数据分析跟踪
 */
export const trackHistoricalDataAnalysis = (symbol, timeframe, analysisType) => {
  trackEvent('historical_data_analysis', {
    stock_symbol: symbol?.toUpperCase(),
    timeframe: timeframe,
    analysis_type: analysisType,
    feature: 'historical_data_analysis',
    category: 'analysis_tools',
    component: 'historicaldata'
  });
};

/**
 * 支付相关跟踪
 */
export const trackPayment = (amount, currency = 'USD', method = 'stripe') => {
  trackEvent('begin_checkout', {
    currency: currency,
    value: amount,
    payment_method: method,
    category: 'monetization',
    component: 'payment4'
  });
};

export const trackPaymentCompleted = (amount, currency = 'USD', tokens, transactionId = null) => {
  const eventData = {
    currency: currency,
    value: amount,
    items: [{
      item_id: 'analysis_tokens',
      item_name: 'ALPHASHOUT Analysis Tokens',
      category: 'tokens',
      quantity: tokens,
      price: amount / tokens
    }],
    category: 'monetization',
    component: 'payment4',
    token_count: tokens,
    price_per_token: amount / tokens
  };

  if (transactionId) {
    eventData.transaction_id = transactionId;
  }

  trackEvent('purchase', eventData);
};

/**
 * 用户认证相关跟踪
 */
export const trackUserLogin = (method = 'email', success = true) => {
  trackEvent('login', {
    method: method,
    success: success,
    category: 'user_engagement',
    component: 'login5'
  });
};

export const trackUserSignup = (method = 'email', success = true) => {
  trackEvent('sign_up', {
    method: method,
    success: success,
    category: 'user_acquisition',
    component: 'login5'
  });
};

export const trackUserLogout = () => {
  trackEvent('logout', {
    category: 'user_engagement',
    component: 'login5'
  });
};

/**
 * 功能使用跟踪
 */
export const trackFeatureUsage = (featureName, action, additionalData = {}) => {
  trackEvent('feature_usage', {
    feature_name: featureName,
    action: action,
    page: window.location.pathname,
    category: 'user_engagement',
    ...additionalData
  });
};

export const trackMenuNavigation = (fromMenu, toMenu) => {
  trackEvent('menu_navigation', {
    from_menu: fromMenu,
    to_menu: toMenu,
    navigation_type: 'menu_click',
    category: 'user_engagement'
  });
};

export const trackSearch = (searchTerm, searchType = 'stock_symbol', resultsCount = 0) => {
  trackEvent('search', {
    search_term: searchTerm?.substring(0, 100), // 限制长度
    search_type: searchType,
    results_count: resultsCount,
    category: 'user_engagement'
  });
};

/**
 * 错误跟踪
 */
export const trackError = (errorType, errorMessage, context = '', fatal = false) => {
  trackEvent('exception', {
    description: `${errorType}: ${errorMessage}`.substring(0, 150),
    fatal: fatal,
    error_type: errorType,
    context: context,
    page: window.location.pathname,
    category: 'errors',
    user_agent: navigator.userAgent
  });
};

export const trackPerformance = (metricName, value, context = '') => {
  trackEvent('performance_metric', {
    metric_name: metricName,
    metric_value: value,
    context: context,
    category: 'performance'
  });
};

// ==================== 用户管理函数 ====================

/**
 * 设置用户属性
 */
export const setUserProperties = (userProperties) => {
  if (!shouldTrack()) {
    console.log('🔇 User properties tracking disabled');
    return;
  }

  const properties = {
    ...userProperties,
    platform: 'web',
    app_version: APP_VERSION,
    environment: NODE_ENV
  };

  ReactGA.gtag('config', GA_MEASUREMENT_ID, {
    user_properties: properties
  });

  console.log('👤 User Properties Set:', properties);
};

/**
 * 设置用户ID（登录后调用）
 */
export const setUserId = (userId) => {
  if (!shouldTrack()) {
    console.log('🔇 User ID tracking disabled');
    return;
  }

  ReactGA.gtag('config', GA_MEASUREMENT_ID, {
    user_id: userId
  });

  console.log('🆔 User ID Set:', userId);
};

/**
 * 清除用户数据（登出时调用）
 */
export const clearUserData = () => {
  if (!shouldTrack()) {
    return;
  }

  ReactGA.gtag('config', GA_MEASUREMENT_ID, {
    user_id: null,
    user_properties: {
      user_type: null,
      subscription_status: null
    }
  });

  console.log('🧹 User data cleared');
};

// ==================== 工具和调试函数 ====================

/**
 * 获取当前分析状态
 */
export const getAnalyticsStatus = () => {
  return {
    isInitialized,
    measurementId: GA_MEASUREMENT_ID,
    environment: NODE_ENV,
    enableAnalytics: ENABLE_ANALYTICS,
    appVersion: APP_VERSION,
    shouldTrack: shouldTrack(),
    timestamp: new Date().toISOString()
  };
};

/**
 * 验证环境变量配置
 */
export const validateEnvironmentVariables = () => {
  const checks = {
    GA_MEASUREMENT_ID: {
      value: GA_MEASUREMENT_ID,
      valid: /^G-[A-Z0-9]{10}$/.test(GA_MEASUREMENT_ID)
    },
    NODE_ENV: {
      value: NODE_ENV,
      valid: ['development', 'production', 'test'].includes(NODE_ENV)
    },
    ENABLE_ANALYTICS: {
      value: ENABLE_ANALYTICS,
      valid: typeof ENABLE_ANALYTICS === 'boolean'
    }
  };

  console.group('🔍 Environment Variables Validation');
  
  let allValid = true;
  Object.entries(checks).forEach(([key, check]) => {
    const status = check.valid ? '✅' : '❌';
    console.log(`${status} ${key}: ${check.value}`);
    if (!check.valid) allValid = false;
  });
  
  console.groupEnd();
  
  return allValid;
};

/**
 * 发送测试事件（仅开发环境）
 */
export const sendTestEvent = () => {
  if (NODE_ENV === 'production') {
    console.warn('⚠️ Test events disabled in production');
    return;
  }

  trackEvent('test_event', {
    test_parameter: 'test_value',
    timestamp: new Date().toISOString(),
    category: 'testing',
    random_id: Math.random().toString(36).substring(7)
  });
  
  console.log('🧪 Test event sent');
};

/**
 * 批量事件发送（用于离线场景）
 */
export const sendBatchEvents = (events) => {
  if (!shouldTrack() || !Array.isArray(events)) {
    return;
  }

  events.forEach(event => {
    if (event.type === 'pageview') {
      trackPageView(event.path, event.title, event.data);
    } else {
      trackEvent(event.name, event.data);
    }
  });

  console.log(`📦 Batch sent: ${events.length} events`);
};

// ==================== 默认导出 ====================

export default {
  // 核心函数
  initGA,
  trackPageView,
  trackEvent,
  
  // 业务功能
  trackStockAnalysis,
  trackStockAnalysisCompleted,
  trackPortfolioOptimization,
  trackPortfolioCompleted,
  trackChartUpload,
  trackChartAnalysisCompleted,
  trackHistoricalDataAnalysis,
  
  // 支付和用户
  trackPayment,
  trackPaymentCompleted,
  trackUserLogin,
  trackUserSignup,
  trackUserLogout,
  
  // 用户体验
  trackFeatureUsage,
  trackMenuNavigation,
  trackSearch,
  trackError,
  trackPerformance,
  
  // 用户管理
  setUserProperties,
  setUserId,
  clearUserData,
  
  // 工具函数
  getAnalyticsStatus,
  validateEnvironmentVariables,
  sendTestEvent,
  sendBatchEvents
};