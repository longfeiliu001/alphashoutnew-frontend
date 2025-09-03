import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { usePortfolio } from './PortfolioContext';
import { portfolioDemoData } from './PortfolioDemoData';
import { 
  Input, 
  Button, 
  Select, 
  InputNumber, 
  Card, 
  Typography, 
  Space, 
  Tag, 
  message,
  Spin,
  Divider,
  Progress,
  Statistic,
  Row,
  Col,
  Alert,
  Tooltip,
  Badge,
  Table,
  Tabs,
  Collapse,
  Switch,
  Form,
  Drawer,
  Modal
} from 'antd';
import { 
  SearchOutlined, 
  CopyOutlined, 
  DownloadOutlined, 
  CloseOutlined,
  FilePdfOutlined,
  SendOutlined,
  InfoCircleOutlined,
  CheckCircleOutlined,
  WarningOutlined,
  RiseOutlined,
  FallOutlined,
  LineChartOutlined,
  PieChartOutlined,
  BarChartOutlined,
  FundOutlined,
  DollarOutlined,
  PercentageOutlined,
  SafetyOutlined,
  ThunderboltOutlined,
  GlobalOutlined,
  StockOutlined,
  FileTextOutlined,
  BulbOutlined,
  DashboardOutlined,
  ExperimentOutlined,
  AlertOutlined,
  TrophyOutlined,
  FireOutlined,
  RocketOutlined,
  ClockCircleOutlined,
  CalendarOutlined,
  SaveOutlined,
  DeleteOutlined,
  ReloadOutlined,
  CloudOutlined,
  CodeOutlined,
  MenuOutlined,
  SettingOutlined,
  PlusOutlined,
  UserAddOutlined,
  LockOutlined,
  GiftOutlined
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TabPane } = Tabs;
const { Panel } = Collapse;

// Configure axios defaults
axios.defaults.withCredentials = true;
axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

// Alphashout color palette
const AlphaShout_COLORS = {
  primary: '#003d7a',
  secondary: '#005eb8',
  accent: '#0084d4',
  success: '#52c41a',
  danger: '#ff4d4f',
  gray: '#666666',
  lightGray: '#f0f0f0',
  white: '#ffffff',
  asset1: '#003d7a',
  asset2: '#005eb8',
  asset3: '#0084d4',
  asset4: '#40a9ff',
  asset5: '#69c0ff',
  asset6: '#91d5ff',
  asset7: '#1890ff',
  asset8: '#096dd9'
};

// Get asset color by index
const getAssetColor = (index) => {
  const colors = [
    AlphaShout_COLORS.asset1,
    AlphaShout_COLORS.asset2,
    AlphaShout_COLORS.asset3,
    AlphaShout_COLORS.asset4,
    AlphaShout_COLORS.asset5,
    AlphaShout_COLORS.asset6,
    AlphaShout_COLORS.asset7,
    AlphaShout_COLORS.asset8
  ];
  return colors[index % colors.length];
};

// Cache management (simplified for demo)
const CACHE_KEYS = {
  SYMBOLS: 'portfolio_symbols',
  CONFIG: 'portfolio_config',
  WEBHOOK_RESPONSE: 'portfolio_webhook_response',
  AUTO_SAVE_ENABLED: 'portfolio_auto_save_enabled',
  LAST_SAVE_TIME: 'portfolio_last_save_time'
};

class DataCache {
  static save(key, data) {
    try {
      if (typeof window !== 'undefined') {
        if (!window.portfolioCache) {
          window.portfolioCache = {};
        }
        window.portfolioCache[key] = {
          data: JSON.parse(JSON.stringify(data)),
          timestamp: Date.now()
        };
      }
      return true;
    } catch (error) {
      console.warn('Cache save failed:', error);
      return false;
    }
  }

  static load(key) {
    try {
      if (typeof window !== 'undefined' && window.portfolioCache && window.portfolioCache[key]) {
        const cached = window.portfolioCache[key];
        if (Date.now() - cached.timestamp < 24 * 60 * 60 * 1000) {
          return cached.data;
        }
      }
      return null;
    } catch (error) {
      console.warn('Cache load failed:', error);
      return null;
    }
  }

  static getStatus() {
    const status = {
      memoryCache: false,
      sessionStorage: false,
      cachedItems: []
    };

    try {
      if (typeof window !== 'undefined' && window.portfolioCache) {
        status.memoryCache = true;
        status.cachedItems = Object.keys(window.portfolioCache);
      }
    } catch (error) {
      console.warn('Get cache status failed:', error);
    }

    return status;
  }
}

// Mobile-optimized Circular Weight Chart
const MobileCircularWeightChart = ({ weights, strategyName, metrics = {}, symbols = [] }) => {
  const parseWeight = (weight) => {
    if (typeof weight === 'string') {
      return parseFloat(weight.replace('%', ''));
    }
    return weight * 100;
  };

  const chartData = weights.map((weight, index) => ({
    value: parseWeight(weight),
    symbol: symbols[index] || `Asset${index + 1}`,
    color: getAssetColor(index)
  }));

  return (
    <div style={{ 
      padding: '12px',
      background: AlphaShout_COLORS.white,
      borderRadius: '8px',
      border: `1px solid ${AlphaShout_COLORS.lightGray}`,
      marginBottom: '12px'
    }}>
      <Text strong style={{ 
        display: 'block', 
        marginBottom: '8px', 
        color: AlphaShout_COLORS.primary, 
        fontSize: '13px', 
        textAlign: 'center' 
      }}>
        {strategyName}
      </Text>
      
      <Row gutter={[8, 8]}>
        <Col span={12}>
          <div style={{ fontSize: '11px' }}>
            <div style={{ color: AlphaShout_COLORS.gray }}>Return</div>
            <div style={{ 
              fontWeight: 'bold', 
              color: parseFloat(metrics.return) > 0 ? AlphaShout_COLORS.success : AlphaShout_COLORS.danger 
            }}>
              {metrics.return || 'N/A'}
            </div>
          </div>
        </Col>
        <Col span={12}>
          <div style={{ fontSize: '11px' }}>
            <div style={{ color: AlphaShout_COLORS.gray }}>Volatility</div>
            <div style={{ fontWeight: 'bold', color: AlphaShout_COLORS.primary }}>
              {metrics.volatility || 'N/A'}
            </div>
          </div>
        </Col>
        <Col span={12}>
          <div style={{ fontSize: '11px' }}>
            <div style={{ color: AlphaShout_COLORS.gray }}>Sharpe</div>
            <div style={{ fontWeight: 'bold', color: AlphaShout_COLORS.primary }}>
              {metrics.sharpe_ratio || 'N/A'}
            </div>
          </div>
        </Col>
        <Col span={12}>
          <div style={{ fontSize: '11px' }}>
            <div style={{ color: AlphaShout_COLORS.gray }}>Sortino</div>
            <div style={{ fontWeight: 'bold', color: AlphaShout_COLORS.primary }}>
              {metrics.sortino_ratio || 'N/A'}
            </div>
          </div>
        </Col>
      </Row>

      <Divider style={{ margin: '8px 0' }} />

      <div style={{ fontSize: '11px' }}>
        {chartData.map((item, index) => (
          <div key={index} style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            marginBottom: '2px',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <div style={{ 
                width: '8px', 
                height: '8px', 
                backgroundColor: item.color, 
                borderRadius: '2px' 
              }} />
              <span style={{ color: AlphaShout_COLORS.gray }}>{item.symbol}:</span>
            </div>
            <span style={{ fontWeight: 'bold', color: AlphaShout_COLORS.primary }}>
              {item.value.toFixed(1)}%
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

// Demo Mode Banner Component
const DemoModeBanner = () => (
  <div style={{
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    background: 'linear-gradient(90deg, #FFB81C, #FF6B6B)',
    color: 'white',
    padding: '6px 12px',
    textAlign: 'center',
    fontSize: '12px',
    fontWeight: 600,
    zIndex: 1001
  }}>
    Demo Mode - Register to analyze your own portfolio & Get 20 free tokens!
  </div>
);

// Registration Modal Component
const RegistrationModal = ({ visible, onClose }) => {
  return (
    <Modal
      title={
        <Space>
          <GiftOutlined style={{ color: AlphaShout_COLORS.success }} />
          <span style={{ color: AlphaShout_COLORS.primary }}>Get 20 Free Tokens!</span>
        </Space>
      }
      visible={visible}
      onCancel={onClose}
      footer={null}
      width="90%"
      style={{ maxWidth: '400px' }}
    >
      <div style={{ textAlign: 'center', padding: '20px 0' }}>
        <div style={{ marginBottom: '24px' }}>
          <div style={{ 
            display: 'inline-block', 
            padding: '12px 24px', 
            background: `linear-gradient(135deg, ${AlphaShout_COLORS.primary} 0%, ${AlphaShout_COLORS.secondary} 100%)`,
            borderRadius: '8px',
            color: 'white',
            fontSize: '20px',
            fontWeight: 'bold',
            marginBottom: '12px'
          }}>
            20 FREE TOKENS
          </div>
          <Text style={{ display: 'block', fontSize: '14px', color: AlphaShout_COLORS.gray }}>
            Sign up now and get instant access
          </Text>
        </div>

        <div style={{ marginBottom: '24px', textAlign: 'left' }}>
          <Space direction="vertical" size="small" style={{ width: '100%' }}>
            <div>
              <CheckCircleOutlined style={{ color: AlphaShout_COLORS.success, marginRight: '8px' }} />
              <Text style={{ fontSize: '13px' }}>Portfolio optimization analysis</Text>
            </div>
            <div>
              <CheckCircleOutlined style={{ color: AlphaShout_COLORS.success, marginRight: '8px' }} />
              <Text style={{ fontSize: '13px' }}>AI-powered recommendations</Text>
            </div>
            <div>
              <CheckCircleOutlined style={{ color: AlphaShout_COLORS.success, marginRight: '8px' }} />
              <Text style={{ fontSize: '13px' }}>Risk analysis metrics</Text>
            </div>
            <div>
              <CheckCircleOutlined style={{ color: AlphaShout_COLORS.success, marginRight: '8px' }} />
              <Text style={{ fontSize: '13px' }}>Multiple strategies</Text>
            </div>
          </Space>
        </div>

        <Space direction="vertical" size="middle" style={{ width: '100%' }}>
          <Button 
            type="primary" 
            size="large" 
            block
            icon={<UserAddOutlined />}
            onClick={() => window.location.href = '/login'}
            style={{ 
              height: '44px',
              fontSize: '16px',
              background: `linear-gradient(135deg, ${AlphaShout_COLORS.primary} 0%, ${AlphaShout_COLORS.secondary} 100%)`,
              border: 'none'
            }}
          >
            Sign Up Free
          </Button>
          
          <Button 
            size="large" 
            block
            onClick={() => window.location.href = '/login'}
            style={{ height: '40px' }}
          >
            Already have an account? Log In
          </Button>
        </Space>

        <div style={{ marginTop: '16px' }}>
          <Text style={{ fontSize: '11px', color: AlphaShout_COLORS.gray }}>
            No credit card required
          </Text>
        </div>
      </div>
    </Modal>
  );
};

export default function AlphashoutPortfolioAnalyticsMobileDemo() {
  // Global context integration
  const {
    globalPortfolioData,
    setGlobalPortfolioData,
    globalPortfolioLoadingState,
    setGlobalPortfolioLoadingState,
    globalPortfolioError,
    setGlobalPortfolioError,
    updatePortfolioSymbols,
    updatePortfolioConfig,
    updatePortfolioAnalysisResult,
    clearPortfolioAnalysisResult,
    addActivePortfolioOperation,
    removeActivePortfolioOperation,
    setPortfolioAbortController,
    getPortfolioAbortController
  } = usePortfolio();

  // State declarations - Initialize with demo data
  const [symbols, setSymbols] = useState(portfolioDemoData.demoConfig.symbols);
  const [config, setConfig] = useState(portfolioDemoData.demoConfig);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  
  const [isSending, setIsSending] = useState(false);
  const [webhookResponse, setWebhookResponse] = useState(portfolioDemoData.demoAnalysisResult);
  
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(false);
  const [lastSaveTime, setLastSaveTime] = useState(null);
  const [cacheStatus, setCacheStatus] = useState(DataCache.getStatus());
  
  // Mobile specific states
  const [configDrawerVisible, setConfigDrawerVisible] = useState(false);
  const [symbolsModalVisible, setSymbolsModalVisible] = useState(false);
  const [resultsModalVisible, setResultsModalVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('1');

  // Authentication states
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [availableQuota, setAvailableQuota] = useState(0);
  const [quotaConfig, setQuotaConfig] = useState({
    ANALYSIS_TOKEN_FEE: 5
  });

  // Demo specific states
  const [isDemo, setIsDemo] = useState(true);
  const [showRegistrationModal, setShowRegistrationModal] = useState(false);
  const [demoMessageShown, setDemoMessageShown] = useState(false);
  const [showDemoBanner, setShowDemoBanner] = useState(true);

  // Weight strategy options
  const weightStrategies = [
    { value: 'equal_weight', label: 'Equal Weight', icon: <PercentageOutlined /> },
    { value: 'inverse_volatility', label: 'Inverse Volatility', icon: <FallOutlined /> },
    { value: 'sharpe_optimization', label: 'Sharpe Optimization', icon: <TrophyOutlined /> },
    { value: 'utility', label: 'Utility Maximization', icon: <FundOutlined /> },
    { value: 'capm', label: 'CAPM Adjusted', icon: <GlobalOutlined /> },
    { value: 'target_return', label: 'Target Return', icon: <RiseOutlined /> },
    { value: 'risk_parity', label: 'Risk Parity', icon: <SafetyOutlined /> },
    { value: 'min_variance', label: 'Minimum Variance', icon: <ThunderboltOutlined /> }
  ];

  // Helper functions
  const safeParseJSON = (jsonString) => {
    try {
      if (typeof jsonString === 'string') {
        return JSON.parse(jsonString);
      }
      return jsonString;
    } catch (error) {
      console.warn('JSON parse error:', error);
      return null;
    }
  };

  const formatEnhancedPortfolioAnalysis = (data) => {
    if (!data || typeof data !== 'object') return null;

    const optimizationSummary = typeof data.optimization_summary === 'string' 
      ? safeParseJSON(data.optimization_summary) || {}
      : data.optimization_summary || {};
    
    const correlationAnalysis = typeof data.correlation_analysis === 'string'
      ? safeParseJSON(data.correlation_analysis) || {}
      : data.correlation_analysis || {};
    
    const riskAnalysis = typeof data.risk_analysis === 'string'
      ? safeParseJSON(data.risk_analysis) || {}
      : data.risk_analysis || {};
    
    const assetAllocation = typeof data.asset_allocation === 'string'
      ? safeParseJSON(data.asset_allocation) || []
      : data.asset_allocation || [];
    
    const strategyComparison = typeof data.strategy_comparison === 'string'
      ? safeParseJSON(data.strategy_comparison) || {}
      : data.strategy_comparison || {};

    return {
      dataSource: data.data_source || 'Unknown',
      optimizationSummary,
      correlationAnalysis,
      riskAnalysis,
      assetAllocation,
      strategyComparison,
      aiAnalysis: data.ai_analysis || ''
    };
  };

  // Format AI Analysis text for mobile display
  const formatAIAnalysisForMobile = (text) => {
    if (!text) return null;
    
    const lines = text.split('\n');
    const elements = [];
    
    lines.forEach((line, i) => {
      if (line.startsWith('###')) {
        elements.push(
          <div key={i} style={{ 
            color: AlphaShout_COLORS.primary, 
            fontSize: '14px',
            fontWeight: 'bold',
            marginTop: '12px',
            marginBottom: '8px'
          }}>
            {line.replace(/^###\s*/, '')}
          </div>
        );
      } else if (line.startsWith('####')) {
        elements.push(
          <div key={i} style={{ 
            color: AlphaShout_COLORS.secondary, 
            fontSize: '13px',
            fontWeight: 'bold',
            marginTop: '10px',
            marginBottom: '6px'
          }}>
            {line.replace(/^####\s*/, '')}
          </div>
        );
      } else if (line.trim().startsWith('-')) {
        elements.push(
          <div key={i} style={{ 
            marginLeft: '12px',
            marginBottom: '4px',
            fontSize: '12px',
            color: AlphaShout_COLORS.gray,
            lineHeight: '1.5'
          }}>
            • {line.replace(/^-\s*/, '')}
          </div>
        );
      } else if (line.trim()) {
        elements.push(
          <div key={i} style={{ 
            marginBottom: '8px',
            fontSize: '12px',
            color: AlphaShout_COLORS.gray,
            lineHeight: '1.5'
          }}>
            {line}
          </div>
        );
      }
    });
    
    return <div>{elements}</div>;
  };

  // Demo functions
  const showDemoMessage = () => {
    if (!demoMessageShown) {
      message.info('This is demo data. Sign up for free to analyze your own portfolio!', 5);
      setDemoMessageShown(true);
    }
  };

  const handleDemoInteraction = () => {
    if (isDemo) {
      setShowRegistrationModal(true);
    }
  };

  // Mock search function for demo
  const mockSearchSymbols = (query, setResults, setLoading) => {
    setLoading(true);
    setTimeout(() => {
      const filtered = portfolioDemoData.demoSearchResults.filter(item => 
        item['1. symbol'].toLowerCase().includes(query.toLowerCase()) ||
        item['2. name'].toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered.slice(0, 5));
      setLoading(false);
    }, 300);
  };

  // Check authentication status
  const checkAuthStatus = async () => {
    try {
      const response = await axios.get('/api/auth/me');
      if (response.data.user) {
        setIsAuthenticated(true);
        setUserEmail(response.data.user.email);
        setAvailableQuota(response.data.quota?.available_quota || 0);
        setIsDemo(false);
      }
    } catch (error) {
      console.log('User not authenticated - showing demo');
      setIsAuthenticated(false);
      setIsDemo(true);
      // Show demo message after a delay
      setTimeout(showDemoMessage, 1000);
    }
  };

  // Get quota config
  const fetchQuotaConfig = async () => {
    try {
      const response = await axios.get('/api/portfolio/quota-config');
      if (response.data.config) {
        setQuotaConfig(response.data.config);
      }
    } catch (error) {
      console.error('Failed to fetch quota config:', error);
    }
  };

  // Initialize
  useEffect(() => {
    checkAuthStatus();
    fetchQuotaConfig();
  }, []);

  // Search debounce for main symbols
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim()) {
        if (isDemo) {
          mockSearchSymbols(searchQuery.trim(), setSearchResults, setIsSearching);
          setShowDropdown(true);
        } else {
          // Real search logic here
        }
      } else {
        setSearchResults([]);
        setShowDropdown(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery, isDemo]);

  // Event handlers
  const addSymbolFromSearch = (symbol) => {
    if (isDemo) {
      handleDemoInteraction();
      return;
    }
    if (symbol && !symbols.includes(symbol)) {
      setSymbols(prev => [...prev, symbol]);
      message.success(`Added ${symbol}`);
    }
    setSearchQuery('');
    setShowDropdown(false);
    setSearchResults([]);
  };

  const removeSymbol = (symbolToRemove) => {
    if (isDemo) {
      handleDemoInteraction();
      return;
    }
    setSymbols(symbols.filter(symbol => symbol !== symbolToRemove));
    message.success(`Removed ${symbolToRemove}`);
  };

  const updateConfigField = (key, value) => {
    if (isDemo) {
      handleDemoInteraction();
      return;
    }
    setConfig(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const generateJSON = () => {
    const filteredSymbols = symbols.filter(symbol => symbol && symbol.trim() !== '');
    return {
      symbols: filteredSymbols.join(','),
      target_return: config.target_return,
      lookback_days: config.lookback_days,
      risk_free_symbol: config.risk_free_symbol,
      market_benchmark_symbol: config.market_benchmark_symbol,
      weight_strategy: config.weight_strategy
    };
  };

  const sendToWebhook = async () => {
    if (isDemo) {
      // For demo mode, just show results immediately
      setResultsModalVisible(true);
      return;
    }
    // Real webhook logic here for authenticated users
  };

  return (
    <>
      <style>
        {`
          body { padding-top: ${showDemoBanner ? '32px' : '0'}; }
          @keyframes pulse {
            0% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.8; transform: scale(1.02); }
            100% { opacity: 1; transform: scale(1); }
          }
        `}
      </style>
      
      {showDemoBanner && <DemoModeBanner />}
      
      <div style={{ 
        padding: '12px',
        minHeight: '100vh',
        background: '#f5f7fa'
      }}>
      {/* Header */}
      <Card style={{ marginBottom: '12px', padding: '12px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <Title level={4} style={{ margin: 0, color: AlphaShout_COLORS.primary }}>
              Portfolio Analytics
            </Title>
            <Text style={{ fontSize: '12px', color: AlphaShout_COLORS.gray }}>
              {isDemo ? 'Demo Mode' : `${availableQuota} tokens`}
            </Text>
          </div>
          <Space>
            <Button 
              icon={<SettingOutlined />}
              onClick={() => setConfigDrawerVisible(true)}
              disabled={isDemo}
            />
          </Space>
        </div>
      </Card>

      {/* Selected Assets */}
      <Card 
        title="Portfolio Assets"
        extra={
          <Button 
            type="primary" 
            size="small" 
            icon={<PlusOutlined />}
            onClick={() => {
              if (isDemo) {
                handleDemoInteraction();
              } else {
                setSymbolsModalVisible(true);
              }
            }}
          >
            Add
          </Button>
        }
        style={{ marginBottom: '12px' }}
      >
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
          {symbols.length > 0 ? (
            symbols.map((symbol, index) => (
              <Tag
                key={symbol}
                closable={!isDemo}
                onClose={() => removeSymbol(symbol)}
                style={{ 
                  padding: '4px 8px',
                  background: getAssetColor(index),
                  color: 'white',
                  borderColor: getAssetColor(index)
                }}
              >
                {symbol}
              </Tag>
            ))
          ) : (
            <Text style={{ color: AlphaShout_COLORS.gray, fontSize: '13px' }}>
              No assets selected. Tap "Add" to start.
            </Text>
          )}
        </div>
      </Card>

      {/* Quick Config Display */}
      <Card style={{ marginBottom: '12px' }}>
        <Row gutter={[8, 8]}>
          <Col span={12}>
            <Text style={{ fontSize: '11px', color: AlphaShout_COLORS.gray }}>Strategy</Text>
            <div style={{ fontSize: '13px', fontWeight: 'bold', color: AlphaShout_COLORS.primary }}>
              {weightStrategies.find(s => s.value === config.weight_strategy)?.label}
            </div>
          </Col>
          <Col span={12}>
            <Text style={{ fontSize: '11px', color: AlphaShout_COLORS.gray }}>Target Return</Text>
            <div style={{ fontSize: '13px', fontWeight: 'bold', color: AlphaShout_COLORS.primary }}>
              {(parseFloat(config.target_return) * 100).toFixed(1)}%
            </div>
          </Col>
          <Col span={12}>
            <Text style={{ fontSize: '11px', color: AlphaShout_COLORS.gray }}>Lookback</Text>
            <div style={{ fontSize: '13px', fontWeight: 'bold', color: AlphaShout_COLORS.primary }}>
              {config.lookback_days} days
            </div>
          </Col>
          <Col span={12}>
            <Text style={{ fontSize: '11px', color: AlphaShout_COLORS.gray }}>Benchmark</Text>
            <div style={{ fontSize: '13px', fontWeight: 'bold', color: AlphaShout_COLORS.primary }}>
              {config.market_benchmark_symbol}
            </div>
          </Col>
          <Col span={12}>
            <Text style={{ fontSize: '11px', color: AlphaShout_COLORS.gray }}>Risk-Free</Text>
            <div style={{ fontSize: '13px', fontWeight: 'bold', color: AlphaShout_COLORS.primary }}>
              {config.risk_free_symbol}
            </div>
          </Col>
          <Col span={12}>
            <Text style={{ fontSize: '11px', color: AlphaShout_COLORS.gray }}>Assets</Text>
            <div style={{ fontSize: '13px', fontWeight: 'bold', color: AlphaShout_COLORS.primary }}>
              {symbols.length} selected
            </div>
          </Col>
        </Row>
      </Card>

      {/* Analyze/View Results Button */}
      <Button 
        type="primary" 
        size="large"
        block
        icon={<DashboardOutlined />}
        onClick={() => {
          if (isDemo) {
            // In demo mode, always show results
            setResultsModalVisible(true);
          } else {
            // In authenticated mode, run analysis or show results
            if (webhookResponse) {
              setResultsModalVisible(true);
            } else {
              sendToWebhook();
            }
          }
        }}
        loading={!isDemo && (isSending || globalPortfolioLoadingState)}
        style={{ 
          height: '48px',
          fontSize: '16px',
          marginBottom: '12px',
          animation: isDemo ? 'pulse 2s infinite' : 'none'
        }}
      >
        {isDemo 
          ? 'Try Demo Analysis (Free)'
          : globalPortfolioLoadingState
            ? 'Analyzing...'
            : webhookResponse
              ? 'View Analysis Results'
              : `Analyze Portfolio (${quotaConfig.ANALYSIS_TOKEN_FEE} Tokens)`}
      </Button>

      {/* Register Button - Only show in demo mode */}
      {isDemo && (
        <Button 
          size="large"
          block
          icon={<UserAddOutlined />}
          onClick={() => window.location.href = '/login'}
          style={{ 
            height: '44px',
            fontSize: '15px',
            marginBottom: '12px',
            background: 'linear-gradient(135deg, #52c41a 0%, #73d13d 100%)',
            border: 'none',
            color: 'white'
          }}
        >
          Register & Get 20 Free Tokens
        </Button>
      )}

      {/* Add Symbols Modal */}
      <Modal
        title="Add Stock Symbols"
        visible={symbolsModalVisible}
        onCancel={() => setSymbolsModalVisible(false)}
        footer={null}
        width="90%"
        style={{ maxWidth: '400px' }}
      >
        <Input
          prefix={<SearchOutlined />}
          suffix={isSearching ? <Spin size="small" /> : null}
          placeholder="Search stocks..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{ marginBottom: '12px' }}
        />
        
        {showDropdown && searchResults.length > 0 && (
          <div style={{ marginBottom: '12px' }}>
            {searchResults.map((result, index) => (
              <div
                key={index}
                onClick={() => {
                  addSymbolFromSearch(result['1. symbol']);
                  setSymbolsModalVisible(false);
                }}
                style={{
                  padding: '10px',
                  cursor: 'pointer',
                  borderBottom: `1px solid ${AlphaShout_COLORS.lightGray}`
                }}
              >
                <div style={{ fontWeight: 'bold', color: AlphaShout_COLORS.primary }}>
                  {result['1. symbol']}
                </div>
                <div style={{ fontSize: '12px', color: AlphaShout_COLORS.gray }}>
                  {result['2. name']}
                </div>
              </div>
            ))}
          </div>
        )}
      </Modal>

      {/* Configuration Drawer */}
      <Drawer
        title="Configuration"
        placement="bottom"
        height="70%"
        onClose={() => setConfigDrawerVisible(false)}
        visible={configDrawerVisible}
      >
        <Form layout="vertical">
          <Form.Item label="Weight Strategy">
            <Select
              value={config.weight_strategy}
              onChange={(value) => updateConfigField('weight_strategy', value)}
              style={{ width: '100%' }}
              disabled={isDemo}
            >
              {weightStrategies.map(strategy => (
                <Option key={strategy.value} value={strategy.value}>
                  {strategy.label}
                </Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label="Target Return (%)">
            <InputNumber
              value={parseFloat(config.target_return) * 100}
              onChange={(value) => updateConfigField('target_return', (value / 100).toString())}
              style={{ width: '100%' }}
              min={0}
              max={100}
              precision={1}
              disabled={isDemo}
            />
          </Form.Item>

          <Form.Item label="Lookback Days">
            <InputNumber
              value={parseInt(config.lookback_days)}
              onChange={(value) => updateConfigField('lookback_days', value.toString())}
              style={{ width: '100%' }}
              min={1}
              max={10000}
              disabled={isDemo}
            />
          </Form.Item>

          <Form.Item label="Risk Free Symbol">
            <Input
              value={config.risk_free_symbol}
              onChange={(e) => updateConfigField('risk_free_symbol', e.target.value.toUpperCase())}
              placeholder="e.g., BND"
              disabled={isDemo}
            />
          </Form.Item>

          <Form.Item label="Market Benchmark">
            <Input
              value={config.market_benchmark_symbol}
              onChange={(e) => updateConfigField('market_benchmark_symbol', e.target.value.toUpperCase())}
              placeholder="e.g., SPY"
              disabled={isDemo}
            />
          </Form.Item>
        </Form>
      </Drawer>

      {/* Results Modal */}
      <Modal
        title={
          <Space>
            <span>Analysis Results</span>
            {isDemo && <Badge text="Demo" color="#faad14" />}
          </Space>
        }
        visible={resultsModalVisible}
        onCancel={() => setResultsModalVisible(false)}
        footer={
          isDemo ? (
            <div style={{ textAlign: 'center' }}>
              <Button 
                type="primary"
                block
                icon={<UserAddOutlined />}
                onClick={() => window.location.href = '/login'}
                style={{ 
                  background: 'linear-gradient(135deg, #52c41a 0%, #73d13d 100%)',
                  border: 'none'
                }}
              >
                Register to Analyze Your Portfolio
              </Button>
            </div>
          ) : null
        }
        width="95%"
        style={{ maxWidth: '500px', top: 20 }}
      >
        {webhookResponse && !webhookResponse.error && (() => {
          const analysisData = formatEnhancedPortfolioAnalysis(webhookResponse.data);
          
          if (analysisData) {
            return (
              <Tabs activeKey={activeTab} onChange={setActiveTab}>
                <TabPane tab="Overview" key="1">
                  <Row gutter={[8, 8]}>
                    <Col span={12}>
                      <Card size="small">
                        <Statistic
                          title="Return"
                          value={parseFloat(analysisData.optimizationSummary.portfolio_return?.replace('%', '') || 0)}
                          suffix="%"
                          valueStyle={{ fontSize: '16px', color: AlphaShout_COLORS.success }}
                        />
                      </Card>
                    </Col>
                    <Col span={12}>
                      <Card size="small">
                        <Statistic
                          title="Volatility"
                          value={parseFloat(analysisData.optimizationSummary.portfolio_volatility?.replace('%', '') || 0)}
                          suffix="%"
                          valueStyle={{ fontSize: '16px', color: AlphaShout_COLORS.primary }}
                        />
                      </Card>
                    </Col>
                    <Col span={12}>
                      <Card size="small">
                        <Statistic
                          title="Sharpe"
                          value={parseFloat(analysisData.optimizationSummary.portfolio_sharpe || 0)}
                          precision={2}
                          valueStyle={{ fontSize: '16px', color: AlphaShout_COLORS.primary }}
                        />
                      </Card>
                    </Col>
                    <Col span={12}>
                      <Card size="small">
                        <Statistic
                          title="Diversification"
                          value={parseFloat(analysisData.optimizationSummary.diversification_ratio || 0)}
                          precision={2}
                          valueStyle={{ fontSize: '16px', color: AlphaShout_COLORS.primary }}
                        />
                      </Card>
                    </Col>
                  </Row>
                  
                  {/* Risk Metrics */}
                  {analysisData.riskAnalysis?.risk_metrics && (
                    <div style={{ marginTop: '12px' }}>
                      <Text strong style={{ color: AlphaShout_COLORS.primary, fontSize: '13px' }}>
                        Risk Metrics
                      </Text>
                      <Row gutter={[8, 8]} style={{ marginTop: '8px' }}>
                        <Col span={12}>
                          <div style={{ fontSize: '11px' }}>
                            <Text style={{ color: AlphaShout_COLORS.gray }}>VaR 95%:</Text>
                            <div style={{ fontWeight: 'bold', color: '#ff6f00' }}>
                              {analysisData.riskAnalysis.risk_metrics.portfolio_var_95 || 'N/A'}
                            </div>
                          </div>
                        </Col>
                        <Col span={12}>
                          <div style={{ fontSize: '11px' }}>
                            <Text style={{ color: AlphaShout_COLORS.gray }}>Max Drawdown:</Text>
                            <div style={{ fontWeight: 'bold', color: '#ff6f00' }}>
                              {analysisData.riskAnalysis.risk_metrics.maximum_drawdown || 'N/A'}
                            </div>
                          </div>
                        </Col>
                        <Col span={12}>
                          <div style={{ fontSize: '11px' }}>
                            <Text style={{ color: AlphaShout_COLORS.gray }}>Sortino Ratio:</Text>
                            <div style={{ fontWeight: 'bold', color: AlphaShout_COLORS.primary }}>
                              {parseFloat(analysisData.riskAnalysis.risk_metrics.sortino_ratio || 0).toFixed(3)}
                            </div>
                          </div>
                        </Col>
                        <Col span={12}>
                          <div style={{ fontSize: '11px' }}>
                            <Text style={{ color: AlphaShout_COLORS.gray }}>Calmar Ratio:</Text>
                            <div style={{ fontWeight: 'bold', color: AlphaShout_COLORS.primary }}>
                              {parseFloat(analysisData.riskAnalysis.risk_metrics.calmar_ratio || 0).toFixed(3)}
                            </div>
                          </div>
                        </Col>
                      </Row>
                    </div>
                  )}
                </TabPane>

                <TabPane tab="Allocation" key="2">
                  {analysisData.assetAllocation?.map((asset, index) => (
                    <Card key={asset.symbol} size="small" style={{ marginBottom: '8px' }}>
                      <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                        <Text strong style={{ color: getAssetColor(index) }}>
                          {asset.symbol}
                        </Text>
                        <Tag color="blue">{asset.weight}</Tag>
                      </div>
                      <Row gutter={8}>
                        <Col span={8}>
                          <Text style={{ fontSize: '11px', color: AlphaShout_COLORS.gray }}>Return</Text>
                          <div style={{ fontSize: '12px', fontWeight: 'bold' }}>{asset.expected_return}</div>
                        </Col>
                        <Col span={8}>
                          <Text style={{ fontSize: '11px', color: AlphaShout_COLORS.gray }}>Vol</Text>
                          <div style={{ fontSize: '12px', fontWeight: 'bold' }}>{asset.volatility}</div>
                        </Col>
                        <Col span={8}>
                          <Text style={{ fontSize: '11px', color: AlphaShout_COLORS.gray }}>Sharpe</Text>
                          <div style={{ fontSize: '12px', fontWeight: 'bold' }}>{asset.sharpe_ratio}</div>
                        </Col>
                      </Row>
                    </Card>
                  ))}
                </TabPane>

                <TabPane tab="Strategies" key="3">
                  {analysisData.strategyComparison && Object.entries(analysisData.strategyComparison).map(([strategy, data]) => (
                    <MobileCircularWeightChart
                      key={strategy}
                      strategyName={weightStrategies.find(s => s.value === strategy)?.label || strategy}
                      weights={data.weights || []}
                      metrics={data}
                      symbols={symbols}
                    />
                  ))}
                </TabPane>

                <TabPane tab="AI Analysis" key="4">
                  <div style={{ 
                    background: '#f8f9fa', 
                    padding: '12px', 
                    borderRadius: '8px',
                    maxHeight: '400px',
                    overflowY: 'auto'
                  }}>
                    {analysisData.aiAnalysis ? (
                      formatAIAnalysisForMobile(analysisData.aiAnalysis)
                    ) : (
                      <Text style={{ color: AlphaShout_COLORS.gray, fontSize: '12px' }}>
                        No AI analysis available
                      </Text>
                    )}
                  </div>
                </TabPane>
              </Tabs>
            );
          }
          
          return null;
        })()}
      </Modal>

      {/* Registration Modal */}
      <RegistrationModal 
        visible={showRegistrationModal} 
        onClose={() => setShowRegistrationModal(false)} 
      />
      </div>
    </>
  );
}