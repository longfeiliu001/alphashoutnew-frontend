import logo from './logo.svg';
import './App.css';
import React, { useState, useMemo, useCallback, useEffect } from 'react';

import Solana from './Solana';
import Supabase from './Supabase';
import Portfolioanalysis from './Portfolioanalysis';

import Portfoliocapm7 from './Portfoliocapm7';

import Payment3 from './Payment3';
import Payment4 from './Payment4';
import Login3 from './Login3';
import Login4 from './Login4';
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
const getBreadcrumbItems = (selectedKey, menuItems) => {
 const keyNum = parseInt(selectedKey);
 const currentItem = menuItems.find(item => item.key === keyNum);

 return [
   { title: 'Home' },
   { title: currentItem ? currentItem.label : 'Dashboard' }
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
 const [selectedKeys, setSelectedKeys] = useState(['2']);
 const [isScrolled, setIsScrolled] = useState(false);
 const [scrollProgress, setScrollProgress] = useState(0);
 
 const { user, loading } = useAuth();
 const [menuKey, setMenuKey] = useState(0);

 // Check if we're on password reset page
 const [isPasswordResetPage, setIsPasswordResetPage] = useState(false);

 // Check URL for password reset route
 useEffect(() => {
   const checkPasswordResetRoute = () => {
     const hashParams = new URLSearchParams(window.location.hash.substring(1));
     const accessToken = hashParams.get('access_token');
     const type = hashParams.get('type');
     
     // Check if current path is /reset-password or has recovery token in hash
     const isResetRoute = window.location.pathname === '/reset-password' || 
                         (accessToken && type === 'recovery');
     
     setIsPasswordResetPage(isResetRoute);
   };

   checkPasswordResetRoute();
   
   // Listen for URL changes
   window.addEventListener('hashchange', checkPasswordResetRoute);
   window.addEventListener('popstate', checkPasswordResetRoute);
   
   return () => {
     window.removeEventListener('hashchange', checkPasswordResetRoute);
     window.removeEventListener('popstate', checkPasswordResetRoute);
   };
 }, []);

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
     setSelectedKeys(['4']);
     setMenuKey(prev => prev + 1);
   };

   window.addEventListener('user-login', handleUserLogin);
   window.addEventListener('user-logout', handleUserLogout);

   return () => {
     window.removeEventListener('user-login', handleUserLogin);
     window.removeEventListener('user-logout', handleUserLogout);
   };
 }, []);
 
 // Listen for navigation events
 useEffect(() => {
   const handleNavigateToPayment = (event) => {
     console.log('Navigate to payment event received', event.detail);
     if (event.detail && event.detail.page === 'payment2') {
       setSelectedKeys(['3']);
     }
   };

   const handleNavigateToLogin = (event) => {
     console.log('Navigate to login event received', event.detail);
     if (event.detail && event.detail.page === 'login') {
       setSelectedKeys(['4']);
     }
   };

   window.addEventListener('navigate-to-payment', handleNavigateToPayment);
   window.addEventListener('navigate-to-login', handleNavigateToLogin);
   
   return () => {
     window.removeEventListener('navigate-to-payment', handleNavigateToPayment);
     window.removeEventListener('navigate-to-login', handleNavigateToLogin);
   };
 }, []);

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

     setIsScrolled(scrollPosition > 50); // Changed from 10 to 50
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
   return getBreadcrumbItems(selectedKeys[0], menuItems);
 }, [selectedKeys, menuItems]);

 // Render main content component
 const renderContent = () => {
   const currentKey = selectedKeys[0];

   if (currentKey == 1) {
     return <Portfoliocapm7 />;
   } else if (currentKey == 2) {
     return <Stockthirteen />;
   } else if (currentKey == 3) {
     return <Payment4 />;
   } else if (currentKey == 4) {
     return <Login4 />;
   } else if (currentKey == 6) {
     return <Uservarify />;
   } else if (currentKey == 7) {
     return <Screenshot9 />;
   }else if (currentKey == 8) {
     return <Aboutus2 />;
   }
   else if (currentKey == 9) {
     return <Historicaldata />;
   }
   return <Stockthirteen />;
 };

 // Cache menu selection handler
 const handleMenuSelect = useCallback(({ selectedKeys }) => {
   setSelectedKeys(selectedKeys);
   // Scroll to top when menu item is clicked
   window.scrollTo({ top: 0, behavior: 'smooth' });
 }, []);

 // If on password reset page, render it directly without the normal layout
 if (isPasswordResetPage) {
   return <ResetPasswordPage />;
 }

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
       {/* Logo with hover effect */}
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
           {renderContent()}
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
 <AuthProvider>
   <StockAnalysisProvider>
     <AnalysisProvider>
       <PortfolioProvider>
         <AppContent />
       </PortfolioProvider>
     </AnalysisProvider>
   </StockAnalysisProvider>
 </AuthProvider>
 );
}

export default App;