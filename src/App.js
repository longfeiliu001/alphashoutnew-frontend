// src/App.js
// 版本: 最新版 (集成完整 SEO 功能 + React Router)
// 更新日期: 2025-08-26

import logo from './logo.svg';
import './App.css';
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';

// 导入 SEO Hook - 最新版本
import { useSEO } from './hooks/useSEO';

import Solana from './Solana';
import Supabase from './Supabase';
import Portfolioanalysis from './Portfolioanalysis';
import { initGA, trackPageView, trackFeatureUsage } from './utils/analytics';

import Portfoliocapm7 from './Portfoliocapm7';

import Payment3 from './Payment3';
import Payment4 from './Payment4';
import Login3 from './Login3';
import Login4 from './Login4';
import Login5 from './Login5';
import Donation from './Donation';
import Uservarify from './Uservarify';
import EnhancedUserSection from './EnhancedUserSection';
import { Clover, TrendingUp, DollarSign, User, Gift, Image, Home, Loader2 ,Info,History,PieChart, KeyRound  } from 'lucide-react';

import Testchart8 from './Testchart8';

import Stockthirteen from './Stockthirteen';

import Historicaldata from './Historicaldata';
import Stripepay from './Stripepay';

import Screenshot8 from './Screenshot8';
import Screenshot9 from './Screenshot9';
import { StockAnalysisProvider, useStockAnalysis } from './StockAnalysisContext';

import Aboutus2 from './Aboutus2';
import { checkUserEmailandToken } from './Usermanager';
import { AuthProvider, useAuth } from './Login3';
// Import ResetPasswordPage
import ResetPasswordPage from './ResetPasswordPage';
// Import both contexts
import { AnalysisProvider, useAnalysis } from './AnalysisContext';
import { PortfolioProvider, usePortfolio } from './PortfolioContext';

import { Breadcrumb, Layout, Menu, theme, Badge, Spin } from 'antd';
const { Header, Content, Footer } = Layout;

// 路由配置
const ROUTES = {
  HOME: '/',
  STOCK_ANALYSIS: '/stock-analysis',
  PORTFOLIO_OPTIMIZATION: '/portfolio-optimization',
  TECHNICAL_ANALYSIS: '/technical-analysis',
  HISTORICAL_DATA: '/historical-data',
  BILLING: '/billing',
  PROFILE: '/profile',
  LOGIN: '/login',
  ABOUT: '/about',
  RESET_PASSWORD: '/reset-password'
};

// 菜单项与路由的映射
const MENU_ROUTE_MAP = {
  1: ROUTES.PORTFOLIO_OPTIMIZATION,
  2: ROUTES.STOCK_ANALYSIS,
  3: ROUTES.BILLING,
  4: ROUTES.PROFILE,
  7: ROUTES.TECHNICAL_ANALYSIS,
  8: ROUTES.ABOUT,
  9: ROUTES.HISTORICAL_DATA
};

// 反向映射：路由到菜单key
const ROUTE_MENU_MAP = Object.entries(MENU_ROUTE_MAP).reduce((acc, [key, route]) => {
  acc[route] = key;
  return acc;
}, {});


// 添加 login 路由映射到菜单项4
ROUTE_MENU_MAP['/login'] = '4';

// Combined Analysis Status Indicator Component
const CombinedAnalysisIndicator = () => {
 // Check if hooks are available
 let stockAnalysisActive = false;
 let portfolioAnalysisActive = false;
 let currentSymbol = '';
 let portfolioSymbolsCount = 0;
 let stockAnalysisLoadingState = false;
 let stockAnalysisSymbol = '';

 // Check AnalysisContext (used by Stocktwelve)
 try {
   const analysisContext = useAnalysis();
   if (analysisContext) {
     const { globalLoadingStates, currentSymbol: symbol } = analysisContext;
     stockAnalysisActive = Object.values(globalLoadingStates).filter(state => state).length > 0;
     currentSymbol = symbol;
   }
 } catch (e) {
   // Context not available
 }

 // Check StockAnalysisContext (used by Testchart8)
 try {
   const stockAnalysisContext = useStockAnalysis();
   if (stockAnalysisContext) {
     const { globalLoadingState, currentSymbol, hasActiveOperations } = stockAnalysisContext;
     stockAnalysisLoadingState = globalLoadingState || hasActiveOperations();
     stockAnalysisSymbol = currentSymbol;
   }
 } catch (e) {
   // Context not available
 }

 // Check PortfolioContext
 try {
   const portfolioContext = usePortfolio();
   if (portfolioContext) {
     const { globalPortfolioLoadingState, globalPortfolioData } = portfolioContext;
     portfolioAnalysisActive = globalPortfolioLoadingState;
     portfolioSymbolsCount = globalPortfolioData?.symbols?.length || 0;
   }
 } catch (e) {
   // Context not available
 }

 const totalActiveOps = (stockAnalysisActive ? 1 : 0) + 
                       (portfolioAnalysisActive ? 1 : 0) + 
                       (stockAnalysisLoadingState ? 1 : 0);
 
 if (totalActiveOps === 0) return null;
 
 return (
   <div style={{
     position: 'fixed',
     bottom: '24px',
     right: '24px',
     background: 'linear-gradient(135deg, #003D6D 0%, #005A9C 100%)',
     color: 'white',
     padding: '12px 20px',
     borderRadius: '8px',
     boxShadow: '0 4px 20px rgba(0, 0, 0, 0.15)',
     zIndex: 1001,
     minWidth: '280px',
     maxWidth: '350px',
     animation: 'pulse 2s infinite'
   }}>
     <style>
       {`
         @keyframes pulse {
           0% { opacity: 0.9; }
           50% { opacity: 1; }
           100% { opacity: 0.9; }
         }
         @keyframes spin {
           from { transform: rotate(0deg); }
           to { transform: rotate(360deg); }
         }
       `}
     </style>
     
     <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
       <Loader2 
         size={20} 
         style={{ 
           animation: 'spin 1s linear infinite',
           flexShrink: 0
         }} 
       />
       <div style={{ flex: 1 }}>
         <div style={{ fontSize: '14px', fontWeight: 600, marginBottom: '4px' }}>
           Analysis in Progress
         </div>
         
         {stockAnalysisActive && (
           <div style={{ fontSize: '12px', opacity: 0.9 }}>
             Financial Statement: {currentSymbol || 'Processing'}
           </div>
         )}
         
         {stockAnalysisLoadingState && (
           <div style={{ fontSize: '12px', opacity: 0.9 }}>
             Historical Data: {stockAnalysisSymbol || 'Processing'}
           </div>
         )}
         
         {portfolioAnalysisActive && (
           <div style={{ fontSize: '12px', opacity: 0.9 }}>
             Portfolio: Analyzing {portfolioSymbolsCount} assets
           </div>
         )}
         
         <div style={{ 
           fontSize: '11px', 
           opacity: 0.7, 
           marginTop: '4px' 
         }}>
           Total: {totalActiveOps} operation{totalActiveOps > 1 ? 's' : ''} running
         </div>
       </div>
     </div>
   </div>
 );
};

// Breadcrumb mapping configuration
const getBreadcrumbItems = (currentRoute, menuItems) => {
 const menuKey = ROUTE_MENU_MAP[currentRoute];
 const currentItem = menuItems.find(item => item.key === parseInt(menuKey));

 return [
   { 
     title: <span onClick={() => window.location.href = ROUTES.HOME} style={{ cursor: 'pointer' }}>Home</span>
   },
   { 
     title: currentItem ? currentItem.label : 'Dashboard' 
   }
 ];
};

// Custom theme colors
const customTheme = {
 header: {
   background: 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
   boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
 },
 content: {
   background: 'linear-gradient(to bottom, #f8fafc, #e2e8f0)',
   minHeight: 'calc(100vh - 134px)',
   borderRadius: '12px 12px 0 0',
   margin: '0 -48px',
   padding: '24px 48px'
 },
 footer: {
   background: 'linear-gradient(135deg, #1e3a8a 0%, #1e40af 100%)',
   color: 'white',
   fontWeight: '500'
 }
};

function AppContent() {
 const navigate = useNavigate();
 const location = useLocation();
 
 const [isScrolled, setIsScrolled] = useState(false);
 const [scrollProgress, setScrollProgress] = useState(0);
 
 const { user, loading } = useAuth();
 const [menuKey, setMenuKey] = useState(0);

 // 根据当前路由获取选中的菜单项
 const getCurrentMenuKey = () => {
   const currentRoute = location.pathname;
  //  特殊处理 login 路由
  if (currentRoute === '/login') {
    return ['4']; // 选中 Profile/Login 菜单项
  }

   const menuKey = ROUTE_MENU_MAP[currentRoute];
   return menuKey ? [menuKey] : ['2']; // 默认选中股票分析
 };

 const selectedKeys = getCurrentMenuKey();

 // 动态 SEO 配置函数 - 最新版本，包含更丰富的关键词和描述
 const getSEOProps = () => {
   const currentRoute = location.pathname;
   
   switch(currentRoute) {
     case ROUTES.PORTFOLIO_OPTIMIZATION:
       return {
         title: "Portfolio Optimization - 8 Professional Strategies | ALPHASHOUT",
         description: "Advanced portfolio optimization with institutional strategies: Risk Parity, Sharpe Optimization, Minimum Variance, CAPM. Global asset coverage with Monte Carlo simulation, backtesting, and professional PDF reports. Democratizing hedge fund-level analytics.",
         keywords: "portfolio optimization, risk parity, sharpe ratio, minimum variance, CAPM, asset allocation, modern portfolio theory, diversification, monte carlo simulation, institutional strategies, hedge fund analytics, quantitative finance, portfolio management",
         image: "/portfolio-optimization-preview.jpg",
         url: `https://alphashout.app${ROUTES.PORTFOLIO_OPTIMIZATION}`
       };
     case ROUTES.STOCK_ANALYSIS:
       return {
         title: "AI Stock Analysis & Financial Reports | ALPHASHOUT", 
         description: "Real-time AI-powered equity research with comprehensive financial statement analysis. Deep-dive quarterly earnings, revenue trends, profitability metrics, cash flow analysis, and risk assessment with peer comparison. Professional-grade fundamental analysis.",
         keywords: "stock analysis, equity research, financial statements, earnings analysis, AI stock analysis, fundamental analysis, company valuation, financial reports, quarterly earnings, revenue analysis, cash flow, balance sheet analysis, income statement",
         image: "/stock-analysis-preview.jpg",
         url: `https://alphashout.app${ROUTES.STOCK_ANALYSIS}`
       };
     case ROUTES.BILLING:
       return {
         title: "Transparent Pricing - Pay Per Use | ALPHASHOUT",
         description: "Simple token-based pricing at $0.10 per analysis. No subscriptions, no hidden fees, no commitments. Professional-grade investment tools at accessible prices. Free trial available. Democratizing institutional analytics pricing.",
         keywords: "investment tools pricing, stock analysis cost, portfolio optimization pricing, financial analysis subscription, pay per use, token pricing, affordable investment tools, transparent pricing, no subscription fees",
         image: "/pricing-preview.jpg",
         url: `https://alphashout.app${ROUTES.BILLING}`
       };
     case ROUTES.TECHNICAL_ANALYSIS:
       return {
         title: "AI Technical Chart Analysis - Pattern Recognition | ALPHASHOUT",
         description: "Upload trading charts for instant AI analysis. Automated MACD interpretation, support/resistance detection, pattern recognition, trend analysis, and technical indicator analysis with professional trading insights and signals.",
         keywords: "technical analysis, chart analysis, MACD, support resistance, pattern recognition, technical indicators, AI chart analysis, trading signals, technical patterns, trend analysis, momentum indicators, volume analysis",
         image: "/technical-analysis-preview.jpg",
         url: `https://alphashout.app${ROUTES.TECHNICAL_ANALYSIS}`
       };
     case ROUTES.ABOUT:
       return {
         title: "About ALPHASHOUT - Democratizing Investment Analytics",
         description: "Our mission: democratizing institutional-grade financial analysis. Professional investment tools with bank-grade security, real-time data, AI-powered insights, and enterprise-level analytics accessible to individual investors and small firms.",
         keywords: "about alphashout, investment analytics platform, financial technology, democratizing finance, institutional tools, fintech, investment platform, financial analysis tools, AI finance, quantitative investing",
         image: "/about-preview.jpg",
         url: `https://alphashout.app${ROUTES.ABOUT}`
       };
     case ROUTES.HISTORICAL_DATA:
       return {
         title: "Historical Market Data Analysis - Backtesting Tools | ALPHASHOUT",
         description: "Comprehensive historical market data analysis with advanced algorithms. Multi-timeframe backtesting, trend analysis, volatility studies, correlation analysis, and data-driven investment insights for informed decision making and strategy validation.",
         keywords: "historical data analysis, market data, backtesting, historical stock prices, market trends, data analytics, quantitative analysis, investment research, volatility analysis, correlation studies, time series analysis",
         image: "/historical-data-preview.jpg",
         url: `https://alphashout.app${ROUTES.HISTORICAL_DATA}`
       };
     case ROUTES.PROFILE:
     case ROUTES.LOGIN:
       return {
         title: "User Dashboard & Profile | ALPHASHOUT",
         description: "Secure user dashboard with analysis history, token management, account settings, and personalized investment insights. Track your analysis usage, manage preferences, and access premium features.",
         keywords: "user dashboard, account management, analysis history, token usage, user profile, investment tracking, account settings, premium features",
         image: "/dashboard-preview.jpg",
         url: `https://alphashout.app${ROUTES.PROFILE}`
       };
     default:
       return {
         title: "ALPHASHOUT - Institutional-Grade Investment Analytics for Everyone",
         description: "Democratizing financial analysis with AI-powered tools. Professional equity research, portfolio optimization, technical analysis, and risk management. Real-time market data with institutional-grade insights at accessible prices. $0.10 per analysis.",
         keywords: "investment analytics, stock analysis, portfolio optimization, financial analysis, AI trading tools, institutional grade, democratizing finance, alphashout, quantitative finance, financial technology, investment research",
         image: "/alphashout-home-preview.jpg",
         url: "https://alphashout.app"
       };
   }
 };

 // 应用动态 SEO - 最新版本
 useSEO(getSEOProps());

 useEffect(() => {
  initGA();
  // Track page view when route changes
  trackPageView(location.pathname);
}, [location.pathname]);

 // Get contexts if available
 let stockLoadingStates = {};
 let portfolioLoadingState = false;
 let hasActiveOperations = () => false;
 let hasActivePortfolioOperations = () => false;
 
 // New: StockAnalysisContext states
 let stockAnalysisLoadingState = false;
 let hasActiveStockAnalysisOps = () => false;

 // Get AnalysisContext
 try {
   const analysisContext = useAnalysis();
   if (analysisContext) {
     stockLoadingStates = analysisContext.globalLoadingStates || {};
     hasActiveOperations = analysisContext.hasActiveOperations || (() => false);
   }
 } catch (e) {
   // Context not available
 }

 // Get PortfolioContext
 try {
   const portfolioContext = usePortfolio();
   if (portfolioContext) {
     portfolioLoadingState = portfolioContext.globalPortfolioLoadingState || false;
     hasActivePortfolioOperations = portfolioContext.hasActivePortfolioOperations || (() => false);
   }
 } catch (e) {
   // Context not available
 }

 // Get StockAnalysisContext
 try {
   const stockAnalysisContext = useStockAnalysis();
   if (stockAnalysisContext) {
     stockAnalysisLoadingState = stockAnalysisContext.globalLoadingState || false;
     hasActiveStockAnalysisOps = stockAnalysisContext.hasActiveOperations || (() => false);
   }
 } catch (e) {
   // Context not available
 }

 const {
   token: { colorBgContainer, borderRadiusLG },
 } = theme.useToken();

 // Monitor navigation and warn if operations are active
 useEffect(() => {
   const handleBeforeUnload = (e) => {
     if (hasActiveOperations() || hasActivePortfolioOperations() || hasActiveStockAnalysisOps()) {
       e.preventDefault();
       e.returnValue = 'Analysis is still in progress. Are you sure you want to leave?';
       return e.returnValue;
     }
   };
   
   window.addEventListener('beforeunload', handleBeforeUnload);
   return () => window.removeEventListener('beforeunload', handleBeforeUnload);
 }, [hasActiveOperations, hasActivePortfolioOperations, hasActiveStockAnalysisOps]);

 // Listen for user login/logout events
 useEffect(() => {
   const handleUserLogin = (event) => {
     console.log('User logged in:', event.detail);
     setMenuKey(prev => prev + 1);
   };

   const handleUserLogout = (event) => {
     console.log('User logged out');
     navigate(ROUTES.LOGIN);
     setMenuKey(prev => prev + 1);
   };

   window.addEventListener('user-login', handleUserLogin);
   window.addEventListener('user-logout', handleUserLogout);

   return () => {
     window.removeEventListener('user-login', handleUserLogin);
     window.removeEventListener('user-logout', handleUserLogout);
   };
 }, [navigate]);
 
 // Listen for navigation events
 useEffect(() => {
   const handleNavigateToPayment = (event) => {
     console.log('Navigate to payment event received', event.detail);
     if (event.detail && event.detail.page === 'payment2') {
       navigate(ROUTES.BILLING);
     }
   };

   const handleNavigateToLogin = (event) => {
     console.log('Navigate to login event received', event.detail);
     if (event.detail && event.detail.page === 'login') {
       navigate(ROUTES.LOGIN);
     }
   };

   window.addEventListener('navigate-to-payment', handleNavigateToPayment);
   window.addEventListener('navigate-to-login', handleNavigateToLogin);
   
   return () => {
     window.removeEventListener('navigate-to-payment', handleNavigateToPayment);
     window.removeEventListener('navigate-to-login', handleNavigateToLogin);
   };
 }, [navigate]);

 // Generate menu items with analysis indicators
 const getMenuItems = (isScrolled, isLoggedIn, historicalDataLoading) => {
   const activeStockAnalysisCount = Object.values(stockLoadingStates).filter(state => state).length;
   const portfolioAnalysisActive = portfolioLoadingState;
   
   const baseItems = [
     {
       key: 2,
       label: (
         <Badge count={activeStockAnalysisCount} size="small" offset={[10, 0]}>
           <span style={{ color: 'white' }}>Financial Statement</span>
         </Badge>
       ),
       icon: <TrendingUp size={isScrolled ? 14 : 16} />
     },
     {
       key: 1,
       label: (
         <Badge count={portfolioAnalysisActive ? 1 : 0} size="small" offset={[10, 0]}>
           <span style={{ color: 'white' }}>Portfolio Optimization</span>
         </Badge>
       ),
       icon: <PieChart  size={isScrolled ? 14 : 16} />
     },
     {
       key: 7,
       label: (
         <Badge count={0} size="small" offset={[10, 0]}>
           <span style={{ color: 'white' }}>Real-Time Chart AI</span>
         </Badge>
       ),
       icon: <Image size={isScrolled ? 14 : 16} />
     },
     {
       key: 9,
       label: (
         <Badge count={historicalDataLoading ? 1 : 0} size="small" offset={[10, 0]}>
           <span style={{ color: 'white' }}>Historical Data</span>
         </Badge>
       ),
       icon: <History  size={isScrolled ? 14 : 16} />
     },
     {
       key: 3,
       label: (
         <Badge count={0} size="small" offset={[10, 0]}>
           <span style={{ color: 'white' }}>Billing</span>
         </Badge>
       ),
       icon: <DollarSign size={isScrolled ? 14 : 16} />
     },
     {
       key: 4,
       label: (
         <Badge count={0} size="small" offset={[10, 0]}>
           <span style={{ color: 'white' }}>{isLoggedIn ? "Profile" : "Login"}</span>
         </Badge>
       ),
       icon: <User size={isScrolled ? 14 : 16} />
     },
     {
       key: 8,
       label: (
         <Badge count={0} size="small" offset={[10, 0]}>
           <span style={{ color: 'white' }}>About</span>
         </Badge>
       ),
       icon: <Info size={isScrolled ? 14 : 16} />
     }
   ];

   return baseItems;
 };

 // Listen for scroll events
 useEffect(() => {
   const handleScroll = () => {
     const scrollPosition = window.scrollY;
     const windowHeight = window.innerHeight;
     const documentHeight = document.documentElement.scrollHeight;

     const progress = (scrollPosition / (documentHeight - windowHeight)) * 100;
     setScrollProgress(Math.min(progress, 100));

     setIsScrolled(scrollPosition > 50);
   };

   window.addEventListener('scroll', handleScroll);
   return () => window.removeEventListener('scroll', handleScroll);
 }, []);

 // Dynamic menu items based on login status and loading states
 const menuItems = useMemo(() => {
   const historicalDataActive = stockAnalysisLoadingState || hasActiveStockAnalysisOps();
   return getMenuItems(isScrolled, !!user, historicalDataActive);
 }, [isScrolled, user, stockLoadingStates, portfolioLoadingState, stockAnalysisLoadingState, hasActiveStockAnalysisOps]);

 // Dynamic breadcrumbs
 const breadcrumbItems = useMemo(() => {
   return getBreadcrumbItems(location.pathname, menuItems);
 }, [location.pathname, menuItems]);

 // Cache menu selection handler - 使用路由导航
 const handleMenuSelect = useCallback(({ selectedKeys }) => {
   const key = parseInt(selectedKeys[0]);
   const route = MENU_ROUTE_MAP[key];
   
   if (route) {
     navigate(route);
     // Track feature usage
     trackFeatureUsage(`menu_${key}`);
     // Scroll to top when menu item is clicked
     window.scrollTo({ top: 0, behavior: 'smooth' });
   }
 }, [navigate]);

 // Logo click handler
 const handleLogoClick = useCallback(() => {
   navigate(ROUTES.STOCK_ANALYSIS);
   window.scrollTo({ top: 0, behavior: 'smooth' });
 }, [navigate]);

 return (
   <Layout style={{ minHeight: '100vh' }}>
     {/* Header with sticky effect */}
     <Header style={{
       ...customTheme.header,
       display: 'flex',
       alignItems: 'center',
       padding: '0 24px',
       height: isScrolled ? '56px' : '70px',
       position: 'fixed',
       top: 0,
       left: 0,
       right: 0,
       zIndex: 1000,
       transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
       backdropFilter: isScrolled ? 'blur(12px) saturate(180%)' : 'blur(0px)',
       background: isScrolled
         ? 'linear-gradient(135deg, rgba(15, 23, 42, 0.85) 0%, rgba(30, 41, 59, 0.85) 100%)'
         : 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)',
       boxShadow: isScrolled
         ? '0 4px 30px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.05)'
         : '0 2px 8px rgba(0,0,0,0.1)',
       borderBottom: isScrolled ? '1px solid rgba(255, 255, 255, 0.1)' : 'none',
     }}>
       {/* Logo with hover effect - 你的真实 Clover 图标 */}
       <div
         style={{
           fontSize: isScrolled ? '24px' : '32px',
           color: 'white',
           display: 'flex',
           alignItems: 'center',
           transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
           cursor: 'pointer',
           transform: 'scale(1)',
         }}
         onMouseEnter={(e) => {
           e.currentTarget.style.transform = 'scale(1.05)';
         }}
         onMouseLeave={(e) => {
           e.currentTarget.style.transform = 'scale(1)';
         }}
         onClick={handleLogoClick}
         title="ALPHASHOUT Home"
       >
         <Clover
           size={isScrolled ? 20 : 24}
           color="#FF4500"
           style={{
             filter: 'drop-shadow(0 0 8px rgba(255, 69, 0, 0.5))',
             transition: 'all 0.3s ease'
           }}
         />
         <span style={{ fontSize: isScrolled ? '24px' : '32px' }}>A</span>
         <span style={{ fontSize: isScrolled ? '20px' : '26px' }}>LPHA</span>
         <span style={{ fontSize: isScrolled ? '24px' : '32px' }}>S</span>
         <span style={{ fontSize: isScrolled ? '20px' : '26px' }}>HOUT</span>
       </div>

       <div style={{ width: '40px' }} />

       <Menu
         key={menuKey}
         theme="dark"
         mode="horizontal"
         selectedKeys={selectedKeys}
         defaultSelectedKeys={['2']}
         items={menuItems.map(item => ({
           ...item,
           style: {
             transition: 'all 0.2s ease',
           }
         }))}
         style={{
           flex: 1,
           minWidth: 0,
           background: 'transparent',
           borderBottom: 'none',
           fontSize: isScrolled ? '14px' : '16px',
           transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
         }}
         onSelect={handleMenuSelect}
         className="custom-menu"
       />

       {/* User section */}
       <div style={{
         marginLeft: '20px',
         padding: isScrolled ? '6px' : '8px',
         borderRadius: '12px',
         background: 'rgba(255,255,255,0.05)',
         backdropFilter: 'blur(10px)',
         border: '1px solid rgba(255,255,255,0.1)',
         transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
         boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
         cursor: 'pointer',
         transform: 'scale(1)',
       }}
         onMouseEnter={(e) => {
           e.currentTarget.style.transform = 'scale(1.05)';
           e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
         }}
         onMouseLeave={(e) => {
           e.currentTarget.style.transform = 'scale(1)';
           e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
         }}
       >
         <Uservarify />
       </div>
     </Header>

     {/* Scroll progress bar */}
     <div style={{
       position: 'fixed',
       top: isScrolled ? '56px' : '70px',
       left: 0,
       right: 0,
       height: '3px',
       background: 'rgba(255, 255, 255, 0.1)',
       zIndex: 999,
       transition: 'top 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
     }}>
       <div style={{
         height: '100%',
         width: `${scrollProgress}%`,
         background: 'linear-gradient(90deg, #FF4500 0%, #FF6347 50%, #FF4500 100%)',
         boxShadow: '0 0 10px rgba(255, 69, 0, 0.5)',
         transition: 'width 0.1s ease-out',
       }} />
     </div>

     {/* Content with top margin for fixed header */}
     <Content style={{
       padding: '0 48px',
       position: 'relative',
       marginTop: '70px'
     }}>
       <div style={customTheme.content}>
         <style>
           {`
             .custom-breadcrumb .ant-breadcrumb-link,
             .custom-breadcrumb .ant-breadcrumb-separator,
             .custom-breadcrumb span,
             .custom-breadcrumb a {
               color: #1e3a8a !important;
               font-weight: 500 !important;
             }
             .custom-breadcrumb a:hover {
               color: #1e40af !important;
             }
           `}
         </style>
         <Breadcrumb
           className="custom-breadcrumb"
           style={{
             margin: '0 0 24px 0',
             padding: '12px 20px',
             background: 'rgba(255,255,255,0.8)',
             borderRadius: '8px',
             backdropFilter: 'blur(10px)',
             boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
           }}
           items={breadcrumbItems}
         />

         <div style={{
           background: 'white',
           borderRadius: '12px',
           padding: '24px',
           boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
           border: '1px solid rgba(255,255,255,0.2)',
           backdropFilter: 'blur(10px)'
         }}>
           {/* 路由组件渲染区域 */}
           <Routes>
             <Route path={ROUTES.HOME} element={<Stockthirteen />} />
             <Route path={ROUTES.STOCK_ANALYSIS} element={<Stockthirteen />} />
             <Route path={ROUTES.PORTFOLIO_OPTIMIZATION} element={<Portfoliocapm7 />} />
             <Route path={ROUTES.TECHNICAL_ANALYSIS} element={<Screenshot9 />} />
             <Route path={ROUTES.HISTORICAL_DATA} element={<Historicaldata />} />
             <Route path={ROUTES.BILLING} element={<Payment4 />} />
             <Route path={ROUTES.PROFILE} element={<Login5 />} />
             <Route path={ROUTES.LOGIN} element={<Login5 />} />
             <Route path={ROUTES.ABOUT} element={<Aboutus2 />} />
             <Route path={ROUTES.RESET_PASSWORD} element={<ResetPasswordPage />} />
             {/* 默认重定向到股票分析 */}
             <Route path="*" element={<Stockthirteen />} />
           </Routes>
         </div>
       </div>
     </Content>

     {/* Footer */}
     <Footer style={{
       ...customTheme.footer,
       textAlign: 'center',
       padding: '20px 50px',
       boxShadow: '0 -2px 8px rgba(0,0,0,0.1)'
     }}>
       <div style={{
         display: 'flex',
         justifyContent: 'center',
         alignItems: 'center',
         gap: '8px'
       }}>
         <Clover size={20} color="#FFD700" />
         <span>ALPHASHOUT ©{new Date().getFullYear()} - Powered by Advanced Trading Technology</span>
       </div>
     </Footer>
     
     {/* Combined Analysis Status Indicator */}
     <CombinedAnalysisIndicator />
   </Layout>
 );
}

function App() {
 return (
   <Router>
     <AuthProvider>
       <StockAnalysisProvider>
         <AnalysisProvider>
           <PortfolioProvider>
             <AppContent />
           </PortfolioProvider>
         </AnalysisProvider>
       </StockAnalysisProvider>
     </AuthProvider>
   </Router>
 );
}

export default App;