// src/App.js
// Version: Final with mobile responsive design
// Update date: 2025-08-26

import logo from './logo.svg';
import './App.css';
import React, { useState, useMemo, useCallback, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import ScreenshotWrapper from './ScreenshotWrapper';
// Import SEO Hook
import { useSEO } from './hooks/useSEO';
import AboutUsWrapper from './AboutUsWrapper';
// Analytics
import { initGA, trackPageView, trackFeatureUsage } from './utils/analytics';
import LoginWrapper from './LoginWrapper';
// Components
import Portfoliocapm7 from './Portfoliocapm7';
import PortfolioWrapper from './PortfolioWrapper';
//import Payment4 from './Payment4';
import PaymentWrapper from './PaymentWrapper';
import Login5 from './Login5';
import Uservarify from './Uservarify';
import StockthirteenWrapper from './StockthirteenWrapper';
//import Historicaldata from './Historicaldata';
import HistoricalDataWrapper from './HistoricalDataWrapper';
import Screenshot9 from './Screenshot9';
import Aboutus2 from './Aboutus2';
import ResetPasswordPage from './ResetPasswordPage';

// Icons
import { Clover, TrendingUp, DollarSign, User, Image, Loader2, Info, History, PieChart } from 'lucide-react';
import { MenuOutlined } from '@ant-design/icons';

// Contexts
import { StockAnalysisProvider, useStockAnalysis } from './StockAnalysisContext';
import { AuthProvider, useAuth } from './Login3';
import { AnalysisProvider, useAnalysis } from './AnalysisContext';
import { PortfolioProvider, usePortfolio } from './PortfolioContext';

// Ant Design
import { Breadcrumb, Layout, Menu, theme, Badge, Spin, Drawer } from 'antd';
const { Header, Content, Footer } = Layout;

// Route configuration
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

// Menu to route mapping
const MENU_ROUTE_MAP = {
  1: ROUTES.PORTFOLIO_OPTIMIZATION,
  2: ROUTES.STOCK_ANALYSIS,
  3: ROUTES.BILLING,
  4: ROUTES.PROFILE,
  7: ROUTES.TECHNICAL_ANALYSIS,
  8: ROUTES.ABOUT,
  9: ROUTES.HISTORICAL_DATA
};

// Reverse mapping
const ROUTE_MENU_MAP = Object.entries(MENU_ROUTE_MAP).reduce((acc, [key, route]) => {
  acc[route] = key;
  return acc;
}, {});

ROUTE_MENU_MAP['/login'] = '4';

// Combined Analysis Status Indicator Component
const CombinedAnalysisIndicator = () => {
  let stockAnalysisActive = false;
  let portfolioAnalysisActive = false;
  let currentSymbol = '';
  let portfolioSymbolsCount = 0;
  let stockAnalysisLoadingState = false;
  let stockAnalysisSymbol = '';

  try {
    const analysisContext = useAnalysis();
    if (analysisContext) {
      const { globalLoadingStates, currentSymbol: symbol } = analysisContext;
      stockAnalysisActive = Object.values(globalLoadingStates).filter(state => state).length > 0;
      currentSymbol = symbol;
    }
  } catch (e) {}

  try {
    const stockAnalysisContext = useStockAnalysis();
    if (stockAnalysisContext) {
      const { globalLoadingState, currentSymbol, hasActiveOperations } = stockAnalysisContext;
      stockAnalysisLoadingState = globalLoadingState || hasActiveOperations();
      stockAnalysisSymbol = currentSymbol;
    }
  } catch (e) {}

  try {
    const portfolioContext = usePortfolio();
    if (portfolioContext) {
      const { globalPortfolioLoadingState, globalPortfolioData } = portfolioContext;
      portfolioAnalysisActive = globalPortfolioLoadingState;
      portfolioSymbolsCount = globalPortfolioData?.symbols?.length || 0;
    }
  } catch (e) {}

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

// Breadcrumb mapping
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
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [mobileDrawerVisible, setMobileDrawerVisible] = useState(false);
  
  const { user, loading } = useAuth();
  const [menuKey, setMenuKey] = useState(0);

  // Check for mobile
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const getCurrentMenuKey = () => {
    const currentRoute = location.pathname;
    if (currentRoute === '/login') {
      return ['4'];
    }
    const menuKey = ROUTE_MENU_MAP[currentRoute];
    return menuKey ? [menuKey] : ['2'];
  };

  const selectedKeys = getCurrentMenuKey();

  const getSEOProps = () => {
    const currentRoute = location.pathname;
    
    switch(currentRoute) {
      case ROUTES.PORTFOLIO_OPTIMIZATION:
        return {
          title: "Portfolio Optimization - 8 Professional Strategies | ALPHASHOUT",
          description: "Advanced portfolio optimization with institutional strategies",
          keywords: "portfolio optimization, risk parity, sharpe ratio",
          image: "/portfolio-optimization-preview.jpg",
          url: `https://alphashout.app${ROUTES.PORTFOLIO_OPTIMIZATION}`
        };
      case ROUTES.STOCK_ANALYSIS:
        return {
          title: "AI Stock Analysis & Financial Reports | ALPHASHOUT", 
          description: "Real-time AI-powered equity research with comprehensive financial statement analysis",
          keywords: "stock analysis, equity research, financial statements",
          image: "/stock-analysis-preview.jpg",
          url: `https://alphashout.app${ROUTES.STOCK_ANALYSIS}`
        };
      default:
        return {
          title: "ALPHASHOUT - Institutional-Grade Investment Analytics",
          description: "Professional financial analysis tools",
          keywords: "investment analytics, stock analysis, portfolio optimization",
          image: "/alphashout-home-preview.jpg",
          url: "https://alphashout.app"
        };
    }
  };

  useSEO(getSEOProps());

  useEffect(() => {
    initGA();
    trackPageView(location.pathname);
  }, [location.pathname]);

  let stockLoadingStates = {};
  let portfolioLoadingState = false;
  let hasActiveOperations = () => false;
  let hasActivePortfolioOperations = () => false;
  let stockAnalysisLoadingState = false;
  let hasActiveStockAnalysisOps = () => false;

  try {
    const analysisContext = useAnalysis();
    if (analysisContext) {
      stockLoadingStates = analysisContext.globalLoadingStates || {};
      hasActiveOperations = analysisContext.hasActiveOperations || (() => false);
    }
  } catch (e) {}

  try {
    const portfolioContext = usePortfolio();
    if (portfolioContext) {
      portfolioLoadingState = portfolioContext.globalPortfolioLoadingState || false;
      hasActivePortfolioOperations = portfolioContext.hasActivePortfolioOperations || (() => false);
    }
  } catch (e) {}

  try {
    const stockAnalysisContext = useStockAnalysis();
    if (stockAnalysisContext) {
      stockAnalysisLoadingState = stockAnalysisContext.globalLoadingState || false;
      hasActiveStockAnalysisOps = stockAnalysisContext.hasActiveOperations || (() => false);
    }
  } catch (e) {}

  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

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
        icon: <PieChart size={isScrolled ? 14 : 16} />
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
        icon: <History size={isScrolled ? 14 : 16} />
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

  const menuItems = useMemo(() => {
    const historicalDataActive = stockAnalysisLoadingState || hasActiveStockAnalysisOps();
    return getMenuItems(isScrolled, !!user, historicalDataActive);
  }, [isScrolled, user, stockLoadingStates, portfolioLoadingState, stockAnalysisLoadingState, hasActiveStockAnalysisOps]);

  const breadcrumbItems = useMemo(() => {
    return getBreadcrumbItems(location.pathname, menuItems);
  }, [location.pathname, menuItems]);

  const handleMenuSelect = useCallback(({ selectedKeys }) => {
    const key = parseInt(selectedKeys[0]);
    const route = MENU_ROUTE_MAP[key];
    
    if (route) {
      navigate(route);
      trackFeatureUsage(`menu_${key}`);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, [navigate]);

  const handleLogoClick = useCallback(() => {
    navigate(ROUTES.STOCK_ANALYSIS);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [navigate]);

  // Mobile bottom tabs - 使用专业金融术语版本
  const mobileBottomTabs = [
    { 
      key: 'financial', 
      icon: <TrendingUp size={20} />, 
      title: 'Financials', // 财务
      route: ROUTES.STOCK_ANALYSIS 
    },
    { 
      key: 'portfolio', 
      icon: <PieChart size={20} />, 
      title: 'Portfolio', // 组合
      route: ROUTES.PORTFOLIO_OPTIMIZATION 
    },
    { 
      key: 'chart', 
      icon: <Image size={20} />, 
      title: 'Technical', // 技术面
      route: ROUTES.TECHNICAL_ANALYSIS 
    },
    { 
      key: 'history', 
      icon: <History size={20} />, 
      title: 'Data', // 数据
      route: ROUTES.HISTORICAL_DATA 
    }
  ];

  return (
    <Layout style={{ minHeight: '100vh' }}>
      {/* Desktop Header - unchanged, Mobile Header - simplified */}
      {!isMobile ? (
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
      ) : (
        // Mobile Header
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          height: '50px',
          background: 'white',
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          display: 'flex',
          alignItems: 'center',
          padding: '0 12px',
          zIndex: 1000
        }}>
          {/* 左侧：汉堡菜单 + Logo */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            flex: '1',
            gap: '10px'
          }}>
            <MenuOutlined 
              onClick={() => setMobileDrawerVisible(true)}
              style={{ fontSize: '20px' }}
            />
            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <Clover 
                size={18} 
                color="#FF4500"
                style={{ filter: 'drop-shadow(0 0 4px rgba(255, 69, 0, 0.3))' }}
              />
              <span style={{ 
                fontSize: '16px', 
                fontWeight: 'bold',
                color: '#003D6D'
              }}>
                ALPHASHOUT
              </span>
            </div>
          </div>
          
          {/* 右侧：用户信息 */}
          <div style={{ 
            flex: '0 0 auto'
          }}>
            <Uservarify />
          </div>
        </div>
      )}

      {/* Scroll progress bar */}
      {!isMobile && (
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
      )}

      {/* Content */}
      <Content style={{
        padding: isMobile ? '0' : '0 48px',
        position: 'relative',
        marginTop: isMobile ? '50px' : '70px',
        marginBottom: isMobile ? '56px' : '0'
      }}>
        <div style={{
          ...customTheme.content,
          margin: isMobile ? '0' : '0 -48px',
          padding: isMobile ? '0' : '24px 48px',
          background: isMobile ? 'transparent' : customTheme.content.background,
          borderRadius: isMobile ? '0' : '12px 12px 0 0'
        }}>
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
          
          {!isMobile && (
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
          )}

          <div style={{
            background: isMobile ? 'transparent' : 'white',
            borderRadius: isMobile ? '0' : '12px',
            padding: isMobile ? '0' : '24px',
            boxShadow: isMobile ? 'none' : '0 4px 20px rgba(0,0,0,0.1)',
            border: isMobile ? 'none' : '1px solid rgba(255,255,255,0.2)',
            backdropFilter: 'blur(10px)',
            minHeight: isMobile ? 'calc(100vh - 106px)' : 'auto'
          }}>
            <Routes>
              <Route path={ROUTES.HOME} element={<StockthirteenWrapper />} />
              <Route path={ROUTES.STOCK_ANALYSIS} element={<StockthirteenWrapper />} />
              <Route path={ROUTES.PORTFOLIO_OPTIMIZATION} element={<PortfolioWrapper />} />
              <Route path={ROUTES.TECHNICAL_ANALYSIS} element={<ScreenshotWrapper  />} />
              <Route path={ROUTES.HISTORICAL_DATA} element={<HistoricalDataWrapper  />} />
              
              <Route path={ROUTES.BILLING} element={<PaymentWrapper />} />
           
              <Route path={ROUTES.LOGIN} element={<LoginWrapper />} />
              <Route path={ROUTES.PROFILE} element={<LoginWrapper />} />
              <Route path={ROUTES.ABOUT} element={<AboutUsWrapper  />} />
              <Route path={ROUTES.RESET_PASSWORD} element={<ResetPasswordPage />} />
              <Route path="*" element={<StockthirteenWrapper />} />
            </Routes>
          </div>
        </div>
      </Content>

      {/* Mobile Bottom Navigation - 专业金融术语版本 */}
      {isMobile && (
        <div style={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          height: '60px', // 稍微增加高度
          background: 'white',
          borderTop: '1px solid #e8e8e8',
          display: 'flex',
          justifyContent: 'space-around',
          alignItems: 'center',
          zIndex: 1000,
          boxShadow: '0 -2px 10px rgba(0,0,0,0.05)' // 添加阴影效果
        }}>
          {mobileBottomTabs.map(tab => {
            const isActive = location.pathname === tab.route;
            return (
              <div
                key={tab.key}
                onClick={() => {
                  navigate(tab.route);
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                style={{
                  flex: 1,
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  justifyContent: 'center',
                  height: '100%',
                  cursor: 'pointer',
                  transition: 'all 0.3s',
                  position: 'relative'
                }}
              >
                {/* 活跃状态的顶部指示条 */}
                {isActive && (
                  <div style={{
                    position: 'absolute',
                    top: 0,
                    left: '50%',
                    transform: 'translateX(-50%)',
                    width: '50px',
                    height: '3px',
                    background: 'linear-gradient(90deg, #003D6D, #005A9C)',
                    borderRadius: '0 0 3px 3px',
                    boxShadow: '0 2px 4px rgba(0,61,109,0.3)'
                  }} />
                )}
                
                {/* 图标容器 */}
                <div style={{
                  color: isActive ? '#003D6D' : '#999',
                  marginBottom: '4px',
                  transform: isActive ? 'scale(1.15)' : 'scale(1)',
                  transition: 'all 0.3s',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '28px',
                  height: '28px',
                  borderRadius: isActive ? '8px' : '0',
                  background: isActive ? 'rgba(0,61,109,0.08)' : 'transparent'
                }}>
                  {tab.icon}
                </div>
                
                {/* 标题文字 - 专业金融术语 */}
                <span style={{
                  fontSize: '11px', // 增大字体，因为文字更短了
                  color: isActive ? '#003D6D' : '#999',
                  fontWeight: isActive ? '700' : '500', // 加粗以增强可读性
                  textAlign: 'center',
                  lineHeight: '1.2',
                  maxWidth: '100%',
                  paddingLeft: '2px',
                  paddingRight: '2px',
                  whiteSpace: 'nowrap',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis',
                  letterSpacing: isActive ? '0.5px' : '0px' // 活跃状态增加字间距
                }}>
                  {tab.title}
                </span>
              </div>
            );
          })}
        </div>
      )}

      {/* Mobile Drawer Menu */}
      {isMobile && (
        <Drawer
          title="Menu"
          placement="left"
          width="80%"
          onClose={() => setMobileDrawerVisible(false)}
          open={mobileDrawerVisible}
          bodyStyle={{ padding: 0 }}
        >
          <div style={{ padding: '20px' }}>
            <div style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '30px',
              paddingBottom: '20px',
              borderBottom: '1px solid #e8e8e8'
            }}>
              <Clover size={24} color="#FF4500" />
              <span style={{
                marginLeft: '10px',
                fontSize: '20px',
                fontWeight: 'bold',
                color: '#003D6D'
              }}>
                ALPHASHOUT
              </span>
            </div>
            
            {menuItems.map((item) => {
              // Safely extract label text
              let labelText = '';
              if (React.isValidElement(item.label)) {
                // Check if it's a Badge component with children
                const badgeProps = item.label.props;
                if (badgeProps && badgeProps.children) {
                  // Check if children is a span element
                  if (React.isValidElement(badgeProps.children)) {
                    labelText = badgeProps.children.props.children;
                  } else {
                    labelText = badgeProps.children;
                  }
                }
              } else {
                labelText = item.label;
              }
                
              return (
                <div
                  key={item.key}
                  onClick={() => {
                    handleMenuSelect({ selectedKeys: [item.key.toString()] });
                    setMobileDrawerVisible(false);
                  }}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    padding: '15px 10px',
                    borderRadius: '8px',
                    marginBottom: '8px',
                    cursor: 'pointer',
                    background: selectedKeys.includes(item.key.toString()) ? '#f0f8ff' : 'transparent'
                  }}
                >
                  <div style={{ 
                    color: selectedKeys.includes(item.key.toString()) ? '#003D6D' : '#666',
                    marginRight: '15px'
                  }}>
                    {item.icon}
                  </div>
                  <span style={{
                    fontSize: '16px',
                    color: selectedKeys.includes(item.key.toString()) ? '#003D6D' : '#333',
                    fontWeight: selectedKeys.includes(item.key.toString()) ? 'bold' : 'normal'
                  }}>
                    {labelText}
                  </span>
                </div>
              );
            })}
          </div>
        </Drawer>
      )}

      {/* Footer - Desktop only */}
      {!isMobile && (
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
      )}
      
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