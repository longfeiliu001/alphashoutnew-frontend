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
  Form
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

  static clear(key) {
    try {
      if (typeof window !== 'undefined' && window.portfolioCache) {
        delete window.portfolioCache[key];
      }
      return true;
    } catch (error) {
      console.warn('Cache clear failed:', error);
      return false;
    }
  }

  static clearAll() {
    try {
      if (typeof window !== 'undefined') {
        window.portfolioCache = {};
      }
      return true;
    } catch (error) {
      console.warn('Cache clear all failed:', error);
      return false;
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

// Enhanced Circular Progress Component with metrics
const CircularWeightChart = ({ weights, strategyName, metrics = {}, symbols = ['VGT', 'VUG', 'ARKK', 'VTI'] }) => {
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

  // Calculate cumulative angles for pie chart
  let cumulativeAngle = 0;
  const segments = chartData.map((item) => {
    const startAngle = cumulativeAngle;
    const endAngle = cumulativeAngle + (item.value * 3.6);
    cumulativeAngle = endAngle;
    return { ...item, startAngle, endAngle };
  });

  return (
    <div style={{ 
      padding: '16px',
      background: AlphaShout_COLORS.white,
      borderRadius: '8px',
      border: `1px solid ${AlphaShout_COLORS.lightGray}`,
      height: '100%'
    }}>
      <Text strong style={{ display: 'block', marginBottom: '12px', color: AlphaShout_COLORS.primary, fontSize: '14px', textAlign: 'center' }}>
        {strategyName}
      </Text>
      
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '12px' }}>
        <div style={{ position: 'relative', width: '140px', height: '140px' }}>
          <svg width="140" height="140" viewBox="0 0 140 140">
            {segments.map((segment, index) => {
              const startRad = (segment.startAngle - 90) * Math.PI / 180;
              const endRad = (segment.endAngle - 90) * Math.PI / 180;
              
              const x1 = 70 + 55 * Math.cos(startRad);
              const y1 = 70 + 55 * Math.sin(startRad);
              const x2 = 70 + 55 * Math.cos(endRad);
              const y2 = 70 + 55 * Math.sin(endRad);
              
              const largeArc = segment.value > 50 ? 1 : 0;
              
              if (segment.value === 0) return null;
              
              return (
                <g key={index}>
                  <path
                    d={`M 70 70 L ${x1} ${y1} A 55 55 0 ${largeArc} 1 ${x2} ${y2} Z`}
                    fill={segment.color}
                    stroke={AlphaShout_COLORS.white}
                    strokeWidth="2"
                  />
                  {segment.value > 5 && (
                    <text
                      x={70 + 35 * Math.cos((segment.startAngle + segment.endAngle) / 2 * Math.PI / 180 - Math.PI / 2)}
                      y={70 + 35 * Math.sin((segment.startAngle + segment.endAngle) / 2 * Math.PI / 180 - Math.PI / 2)}
                      fill="white"
                      fontSize="11"
                      fontWeight="bold"
                      textAnchor="middle"
                      dominantBaseline="middle"
                    >
                      {segment.value.toFixed(0)}%
                    </text>
                  )}
                </g>
              );
            })}
            <circle cx="70" cy="70" r="25" fill={AlphaShout_COLORS.white} />
            <text x="70" y="70" fill={AlphaShout_COLORS.primary} fontSize="12" fontWeight="bold" textAnchor="middle" dominantBaseline="middle">
              {metrics.sharpe_ratio ? parseFloat(metrics.sharpe_ratio).toFixed(2) : ''}
            </text>
            {metrics.sharpe_ratio && (
              <text x="70" y="82" fill={AlphaShout_COLORS.gray} fontSize="9" textAnchor="middle">
                Sharpe
              </text>
            )}
          </svg>
        </div>
      </div>

      {/* Metrics */}
      <div style={{ marginBottom: '12px', borderTop: `1px solid ${AlphaShout_COLORS.lightGray}`, paddingTop: '8px' }}>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '4px', fontSize: '11px' }}>
          <div style={{ color: AlphaShout_COLORS.gray }}>Return:</div>
          <div style={{ textAlign: 'right', fontWeight: 'bold', color: parseFloat(metrics.return) > 0 ? AlphaShout_COLORS.success : AlphaShout_COLORS.danger }}>
            {metrics.return || 'N/A'}
          </div>
          <div style={{ color: AlphaShout_COLORS.gray }}>Volatility:</div>
          <div style={{ textAlign: 'right', fontWeight: 'bold', color: AlphaShout_COLORS.primary }}>
            {metrics.volatility || 'N/A'}
          </div>
          <div style={{ color: AlphaShout_COLORS.gray }}>Sortino:</div>
          <div style={{ textAlign: 'right', fontWeight: 'bold', color: AlphaShout_COLORS.primary }}>
            {metrics.sortino_ratio || 'N/A'}
          </div>
        </div>
      </div>

      {/* Weight breakdown with colors */}
      <div style={{ fontSize: '11px' }}>
        {chartData.map((item, index) => (
          <div key={index} style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            marginBottom: '2px',
            alignItems: 'center'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
              <div style={{ width: '8px', height: '8px', backgroundColor: item.color, borderRadius: '2px' }} />
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
    padding: '8px 24px',
    textAlign: 'center',
    fontSize: '14px',
    fontWeight: 600,
    zIndex: 1001,
    boxShadow: '0 2px 4px rgba(0, 0, 0, 0.08)'
  }}>
    Demo Mode - Register to analyze your own portfolio & Get 20 free tokens!
  </div>
);

// Analysis Results Wrapper with Blur effect (similar to StockthirteenDemo's DeepAnalysisWrapper)
const AnalysisResultsWrapper = ({ children, isDemo }) => {
  if (!isDemo) return children;
  
  return (
    <div style={{ position: 'relative' }}>
      {children}
      <div style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        height: '10%',
        background: 'linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.8) 30%, rgba(255,255,255,0.95) 100%)',
        backdropFilter: 'blur(5px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}>
        <div style={{
          background: 'white',
          padding: '24px 48px',
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          textAlign: 'center',
          border: `2px solid ${AlphaShout_COLORS.primary}`
        }}>
          <RocketOutlined style={{ 
            fontSize: '32px', 
            color: AlphaShout_COLORS.primary,
            marginBottom: '12px'
          }} />
          <h3 style={{ margin: '0 0 8px 0', color: '#333' }}>
            Unlock Complete Portfolio Analysis
          </h3>
          <p style={{ color: '#666', marginBottom: '16px' }}>
            Login to analyze any portfolio with AI-powered insights
          </p>
          <Button 
            type="primary"
            size="large"
            style={{ 
              background: AlphaShout_COLORS.primary,
              borderColor: AlphaShout_COLORS.primary
            }}
            onClick={() => {
              // Try multiple methods to navigate to login/register
              if (window.dispatchEvent) {
                window.dispatchEvent(new CustomEvent('navigate-to-login', { detail: { page: 'login' } }));
              } else {
                window.location.href = '/login';
              }
            }}
          >
            Register & Get 20 Free Tokens
          </Button>
        </div>
      </div>
    </div>
  );
};

export default function AlphashoutPortfolioAnalyticsDemo() {
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
  const [manualInput, setManualInput] = useState('');
  
  const [riskFreeQuery, setRiskFreeQuery] = useState('');
  const [riskFreeResults, setRiskFreeResults] = useState([]);
  const [isRiskFreeSearching, setIsRiskFreeSearching] = useState(false);
  const [showRiskFreeDropdown, setShowRiskFreeDropdown] = useState(false);
  
  const [benchmarkQuery, setBenchmarkQuery] = useState('');
  const [benchmarkResults, setBenchmarkResults] = useState([]);
  const [isBenchmarkSearching, setIsBenchmarkSearching] = useState(false);
  const [showBenchmarkDropdown, setShowBenchmarkDropdown] = useState(false);
  
  const [isSending, setIsSending] = useState(false);
  const [webhookResponse, setWebhookResponse] = useState(null); // Start with null
  
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(false);
  const [lastSaveTime, setLastSaveTime] = useState(null);
  const [cacheStatus, setCacheStatus] = useState(DataCache.getStatus());
  
  const searchRef = useRef(null);
  const dropdownRef = useRef(null);
  const riskFreeRef = useRef(null);
  const benchmarkRef = useRef(null);

  // Authentication and quota states
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const [availableQuota, setAvailableQuota] = useState(0);
  const [quotaConfig, setQuotaConfig] = useState({
    ANALYSIS_TOKEN_FEE: 5
  });

  // Demo specific states
  const [isDemo, setIsDemo] = useState(true);
  const [hasAnalyzed, setHasAnalyzed] = useState(false);

  // Weight strategy options
  const weightStrategies = [
    { value: 'equal_weight', label: 'Equal Weight', description: 'Equal allocation across all assets', icon: <PercentageOutlined /> },
    { value: 'inverse_volatility', label: 'Inverse Volatility', description: 'Weight inversely proportional to volatility', icon: <FallOutlined /> },
    { value: 'sharpe_optimization', label: 'Sharpe Optimization', description: 'Maximize Sharpe ratio', icon: <TrophyOutlined /> },
    { value: 'utility', label: 'Utility Maximization', description: 'Risk-averse utility function', icon: <FundOutlined /> },
    { value: 'capm', label: 'CAPM Adjusted', description: 'Market benchmark based optimization', icon: <GlobalOutlined /> },
    { value: 'target_return', label: 'Target Return', description: 'Minimize risk for target return', icon: <RiseOutlined /> },
    { value: 'risk_parity', label: 'Risk Parity', description: 'Equal risk contribution', icon: <SafetyOutlined /> },
    { value: 'min_variance', label: 'Minimum Variance', description: 'Minimize portfolio variance', icon: <ThunderboltOutlined /> }
  ];

  // Helper functions
  const showLoginPrompt = () => {
    message.info(
      <span>
        Please <a 
          onClick={() => window.location.href = '/login'}
          style={{ color: AlphaShout_COLORS.primary, textDecoration: 'underline', cursor: 'pointer' }}
        >
          login
        </a> to unlock this feature
      </span>
    );
  };

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
    
    const individualStatistics = typeof data.individual_statistics === 'string'
      ? safeParseJSON(data.individual_statistics) || {}
      : data.individual_statistics || {};
    
    const benchmarkComparison = typeof data.benchmark_comparison === 'string'
      ? safeParseJSON(data.benchmark_comparison) || {}
      : data.benchmark_comparison || {};
    
    const strategyComparison = typeof data.strategy_comparison === 'string'
      ? safeParseJSON(data.strategy_comparison) || {}
      : data.strategy_comparison || {};

    return {
      dataSource: data.data_source || 'Unknown',
      optimizationSummary,
      correlationAnalysis,
      riskAnalysis,
      assetAllocation,
      individualStatistics,
      benchmarkComparison,
      strategyComparison,
      aiAnalysis: data.ai_analysis || ''
    };
  };

  const formatAIAnalysis = (text) => {
    if (!text) return null;
    
    const lines = text.split('\n');
    const elements = [];
    let i = 0;
    
    while (i < lines.length) {
      const line = lines[i];
      
      if (line.includes('|') && i + 1 < lines.length && lines[i + 1].includes('-')) {
        // Table parsing logic
        let tableEnd = i + 2;
        while (tableEnd < lines.length && lines[tableEnd].includes('|')) {
          tableEnd++;
        }
        
        const headers = line.split('|').map(h => h.trim()).filter(h => h);
        const rows = [];
        
        for (let j = i + 2; j < tableEnd; j++) {
          const cells = lines[j].split('|').map(c => c.trim()).filter(c => c);
          if (cells.length === headers.length) {
            rows.push(cells);
          }
        }
        
        elements.push(
          <Table
            key={`table-${i}`}
            dataSource={rows.map((row, idx) => {
              const obj = { key: idx };
              headers.forEach((h, hIdx) => {
                obj[h] = row[hIdx];
              });
              return obj;
            })}
            columns={headers.map(h => ({
              title: h,
              dataIndex: h,
              key: h,
              render: (text) => (
                <span style={{ 
                  color: h === 'Strategy' ? AlphaShout_COLORS.primary : AlphaShout_COLORS.gray,
                  fontWeight: h === 'Strategy' ? 'bold' : 'normal'
                }}>
                  {text}
                </span>
              )
            }))}
            pagination={false}
            size="small"
            style={{ marginBottom: '16px' }}
          />
        );
        
        i = tableEnd;
        continue;
      }
      
      // Other formatting
      if (line.startsWith('###')) {
        elements.push(
          <h3 key={i} style={{ 
            color: AlphaShout_COLORS.primary, 
            fontSize: '16px',
            fontWeight: 'bold',
            marginTop: '20px',
            marginBottom: '12px'
          }}>
            {line.replace(/^###\s*/, '')}
          </h3>
        );
      } else if (line.trim()) {
        elements.push(
          <p key={i} style={{ 
            marginBottom: '10px',
            color: AlphaShout_COLORS.gray,
            lineHeight: '1.6',
            fontSize: '13px'
          }}>
            {line}
          </p>
        );
      }
      
      i++;
    }
    
    return <div>{elements}</div>;
  };

  // Mock search function for demo
  const mockSearchSymbols = (query, setResults, setLoading) => {
    setLoading(true);
    setTimeout(() => {
      const filtered = portfolioDemoData.demoSearchResults.filter(item => 
        item['1. symbol'].toLowerCase().includes(query.toLowerCase()) ||
        item['2. name'].toLowerCase().includes(query.toLowerCase())
      );
      setResults(filtered);
      setLoading(false);
    }, 300);
  };

  // Search debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim()) {
        mockSearchSymbols(searchQuery.trim(), setSearchResults, setIsSearching);
        setShowDropdown(true);
      } else {
        setSearchResults([]);
        setShowDropdown(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Click outside handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
      if (riskFreeRef.current && !riskFreeRef.current.contains(event.target)) {
        setShowRiskFreeDropdown(false);
      }
      if (benchmarkRef.current && !benchmarkRef.current.contains(event.target)) {
        setShowBenchmarkDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Event handlers
  const addSymbolFromSearch = (symbol) => {
    showLoginPrompt();
    setShowDropdown(false);
  };

  const removeSymbol = (symbolToRemove) => {
    showLoginPrompt();
  };

  const updateConfig = (key, value) => {
    showLoginPrompt();
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

  const copyToClipboard = async () => {
    try {
      const json = JSON.stringify(generateJSON(), null, 2);
      await navigator.clipboard.writeText(json);
      message.success('JSON copied to clipboard!');
    } catch (error) {
      message.error('Failed to copy to clipboard');
    }
  };

  const downloadJSON = () => {
    try {
      const json = JSON.stringify(generateJSON(), null, 2);
      const blob = new Blob([json], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'portfolio-config.json';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
      message.success('JSON file downloaded!');
    } catch (error) {
      message.error('Failed to download file');
    }
  };

  const sendToWebhook = async () => {
    if (!hasAnalyzed) {
      setWebhookResponse(portfolioDemoData.demoAnalysisResult);
      setHasAnalyzed(true);
      message.info('Displaying demo analysis for sample portfolio. Register to analyze any portfolio!');
    } else {
      // When clicking "View Demo Analysis" again after first analysis
      showLoginPrompt();
    }
  };

  const handleManualAdd = () => {
    showLoginPrompt();
  };

  const loadExampleConfig = () => {
    // Demo mode - just reload the same demo config
    setSymbols(portfolioDemoData.demoConfig.symbols);
    setConfig(portfolioDemoData.demoConfig);
    message.success('Example configuration loaded!');
  };

  // AlphaShout styled metric card
  const MetricCard = ({ title, value, suffix, prefix, icon, description }) => (
    <Card 
      hoverable
      style={{ 
        background: AlphaShout_COLORS.white,
        borderColor: AlphaShout_COLORS.lightGray,
        height: '100%'
      }}
    >
      <Statistic
        title={
          <Space>
            {icon}
            <span style={{ fontSize: '12px', color: AlphaShout_COLORS.gray }}>{title}</span>
          </Space>
        }
        value={value}
        precision={2}
        valueStyle={{ color: AlphaShout_COLORS.primary, fontSize: '22px', fontWeight: 'bold' }}
        prefix={prefix}
        suffix={suffix}
      />
      {description && (
        <div style={{ marginTop: '8px', fontSize: '11px', color: AlphaShout_COLORS.gray }}>
          {description}
        </div>
      )}
    </Card>
  );

  return (
    <>
      <style>
        {`
          @keyframes pulse {
            0% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.8; transform: scale(1.02); }
            100% { opacity: 1; transform: scale(1); }
          }
          body { padding-top: 40px; }
        `}
      </style>
      
      <DemoModeBanner />
      
      <div style={{ 
        maxWidth: '1600px', 
        margin: '0 auto', 
        padding: '24px', 
        background: 'linear-gradient(135deg, #f5f7fa 0%, #e9ecef 100%)',
        minHeight: '100vh'
      }}>
        {/* Header */}
        <div style={{ 
          marginBottom: '32px', 
          background: `linear-gradient(135deg, ${AlphaShout_COLORS.primary} 0%, ${AlphaShout_COLORS.secondary} 100%)`,
          padding: '48px 40px',
          color: 'white'
        }}>
          <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
            <Title level={1} style={{ 
              color: 'white', 
              marginBottom: '8px',
              fontSize: '36px',
              fontWeight: '300'
            }}>
              <RocketOutlined style={{ marginRight: '16px' }} />
              Portfolio Risk Analytics Platform
            </Title>
            <Paragraph style={{ 
              fontSize: '18px', 
              color: 'rgba(255,255,255,0.9)', 
              marginBottom: '24px'
            }}>
              Advanced Portfolio Optimization with AI-Powered Risk Analysis
            </Paragraph>
            
            {/* Cache Status Bar */}
            <div style={{ 
              background: 'rgba(255,255,255,0.1)', 
              borderRadius: '8px', 
              padding: '16px 24px', 
              marginBottom: '24px',
              backdropFilter: 'blur(10px)',
              border: '1px solid rgba(255,255,255,0.2)'
            }}>
              <Row gutter={[24, 16]} align="middle">
                <Col xs={24} sm={8} md={5}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: '11px' }}>USER STATUS</Text>
                    <Badge 
                      status="warning" 
                      text={<Text style={{ color: 'white', fontSize: '13px', fontWeight: 'bold' }}>Demo Mode</Text>}
                    />
                  </div>
                </Col>
                <Col xs={24} sm={8} md={4}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: '11px' }}>AVAILABLE QUOTA</Text>
                    <Badge 
                      count="Demo"
                      style={{ 
                        backgroundColor: '#faad14',
                        fontSize: '13px'
                      }}
                    />
                  </div>
                </Col>
              </Row>
            </div>
            
            <Button 
              type="primary" 
              size="large" 
              icon={<ExperimentOutlined />}
              onClick={loadExampleConfig}
              style={{ 
                background: 'rgba(255,255,255,0.95)', 
                color: AlphaShout_COLORS.primary, 
                borderColor: 'transparent',
                fontWeight: '500'
              }}
            >
              Load Example Configuration
            </Button>
          </div>
        </div>

        <div style={{ 
          display: 'grid', 
          gridTemplateColumns: 'repeat(auto-fit, minmax(580px, 1fr))', 
          gap: '32px' 
        }}>
          {/* Left Configuration Area */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {/* Stock Search Section */}
            <Card 
              title={
                <Space>
                  <StockOutlined style={{ fontSize: '20px', color: AlphaShout_COLORS.primary }} />
                  <span style={{ color: AlphaShout_COLORS.primary, fontWeight: '500' }}>Portfolio Assets</span>
                </Space>
              }
              style={{ background: 'white', border: `1px solid ${AlphaShout_COLORS.lightGray}` }}
            >
              <div style={{ marginBottom: '16px', position: 'relative' }} ref={dropdownRef}>
                <Input
                  ref={searchRef}
                  prefix={<SearchOutlined />}
                  suffix={isSearching ? <Spin size="small" /> : null}
                  placeholder="Search stocks (Demo - Login to unlock)"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onFocus={() => {
                    if (searchQuery.trim()) {
                      showLoginPrompt();
                    }
                  }}
                  allowClear
                  style={{ width: '100%', height: '48px', fontSize: '16px' }}
                />
                
                {showDropdown && searchResults.length > 0 && (
                  <div style={{ 
                    position: 'absolute', 
                    zIndex: 1000, 
                    width: '100%', 
                    marginTop: '4px',
                    background: 'white',
                    border: `1px solid ${AlphaShout_COLORS.lightGray}`,
                    borderRadius: '4px',
                    boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                    maxHeight: '300px',
                    overflowY: 'auto'
                  }}>
                    {searchResults.map((result, index) => (
                      <div
                        key={index}
                        onClick={() => addSymbolFromSearch(result['1. symbol'])}
                        style={{
                          padding: '12px',
                          cursor: 'pointer',
                          borderBottom: index < searchResults.length - 1 ? `1px solid ${AlphaShout_COLORS.lightGray}` : 'none',
                          ':hover': {
                            background: '#f5f5f5'
                          }
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.background = '#f5f5f5'}
                        onMouseLeave={(e) => e.currentTarget.style.background = 'white'}
                      >
                        <div style={{ fontWeight: 'bold', color: AlphaShout_COLORS.primary }}>
                          {result['1. symbol']}
                        </div>
                        <div style={{ fontSize: '14px', color: AlphaShout_COLORS.gray }}>
                          {result['2. name']}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <Card 
                title="Selected Assets"
                style={{ marginBottom: '16px', background: '#fafafa' }}
              >
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', minHeight: '48px' }}>
                  {symbols.length > 0 ? (
                    symbols.map((symbol, index) => (
                      <Tag
                        key={symbol}
                        closable={false}
                        onClose={() => removeSymbol(symbol)}
                        style={{ 
                          padding: '6px 12px',
                          fontSize: '14px',
                          background: getAssetColor(index),
                          color: 'white',
                          borderColor: getAssetColor(index),
                          cursor: 'default'
                        }}
                      >
                        {symbol}
                      </Tag>
                    ))
                  ) : (
                    <Text style={{ color: AlphaShout_COLORS.gray }}>No assets selected</Text>
                  )}
                </div>
              </Card>

              <Space.Compact style={{ width: '100%' }}>
                <Input
                  placeholder="Enter stock symbol (e.g., AAPL)"
                  value={manualInput}
                  onChange={(e) => setManualInput(e.target.value)}
                  onPressEnter={() => handleManualAdd()}
                  onFocus={() => showLoginPrompt()}
                  style={{ flex: 1 }}
                />
                <Button 
                  type="primary" 
                  onClick={handleManualAdd}
                  icon={<CheckCircleOutlined />}
                  style={{ background: AlphaShout_COLORS.primary, borderColor: AlphaShout_COLORS.primary }}
                >
                  Add
                </Button>
              </Space.Compact>
            </Card>

            {/* Configuration Parameters */}
            <Card 
              title={
                <Space>
                  <ExperimentOutlined style={{ fontSize: '20px', color: AlphaShout_COLORS.primary }} />
                  <span style={{ color: AlphaShout_COLORS.primary, fontWeight: '500' }}>Configuration Parameters</span>
                </Space>
              }
              style={{ background: 'white', border: `1px solid ${AlphaShout_COLORS.lightGray}` }}
            >
              <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div>
                  <Text strong style={{ display: 'block', marginBottom: '8px' }}>Target Return</Text>
                  <InputNumber
                    step={0.001}
                    value={parseFloat(config.target_return) || 0}
                    onChange={(value) => updateConfig('target_return', (value || 0).toString())}
                    onFocus={() => showLoginPrompt()}
                    style={{ width: '100%' }}
                    precision={3}
                    min={0}
                    max={1}
                    formatter={value => `${(value * 100).toFixed(1)}%`}
                    parser={value => value.replace('%', '') / 100}
                  />
                </div>

                <div>
                  <Text strong style={{ display: 'block', marginBottom: '8px' }}>Lookback Days</Text>
                  <InputNumber
                    value={parseInt(config.lookback_days) || 0}
                    onChange={(value) => updateConfig('lookback_days', (value || 0).toString())}
                    onFocus={() => showLoginPrompt()}
                    style={{ width: '100%' }}
                    min={1}
                    max={10000}
                  />
                </div>

                <div>
                  <Text strong style={{ display: 'block', marginBottom: '8px' }}>Risk Free Symbol</Text>
                  <Input
                    value={config.risk_free_symbol}
                    onChange={(e) => updateConfig('risk_free_symbol', e.target.value)}
                    onFocus={() => showLoginPrompt()}
                    placeholder="e.g., BND"
                  />
                </div>

                <div>
                  <Text strong style={{ display: 'block', marginBottom: '8px' }}>Market Benchmark Symbol</Text>
                  <Input
                    value={config.market_benchmark_symbol}
                    onChange={(e) => updateConfig('market_benchmark_symbol', e.target.value)}
                    onFocus={() => showLoginPrompt()}
                    placeholder="e.g., SPY"
                  />
                </div>

                <div>
                  <Text strong style={{ display: 'block', marginBottom: '8px' }}>Weight Strategy</Text>
                  <Select
                    value={config.weight_strategy}
                    onChange={(value) => updateConfig('weight_strategy', value)}
                    onFocus={() => showLoginPrompt()}
                    style={{ width: '100%' }}
                  >
                    {weightStrategies.map(strategy => (
                      <Option key={strategy.value} value={strategy.value}>
                        {strategy.label}
                      </Option>
                    ))}
                  </Select>
                </div>
              </div>
            </Card>
          </div>

          {/* Right Preview Area */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <Card 
              title={
                <Space>
                  <FileTextOutlined style={{ fontSize: '20px', color: AlphaShout_COLORS.primary }} />
                  <span style={{ color: AlphaShout_COLORS.primary, fontWeight: '500' }}>JSON Configuration</span>
                </Space>
              }
              extra={
                <Space>
                  <Button 
                    type="primary" 
                    icon={<SendOutlined />} 
                    onClick={sendToWebhook}
                    loading={isSending || globalPortfolioLoadingState}
                    style={{ 
                      background: AlphaShout_COLORS.primary,
                      borderColor: AlphaShout_COLORS.primary,
                      animation: !hasAnalyzed ? 'pulse 2s infinite' : 'none'
                    }}
                  >
                    {!hasAnalyzed ? 'Try Demo Analysis (Free)' : 'View Demo Analysis'}
                  </Button>
                  <Button icon={<CopyOutlined />} onClick={copyToClipboard}>Copy</Button>
                  <Button icon={<DownloadOutlined />} onClick={downloadJSON}>Download</Button>
                </Space>
              }
              style={{ background: 'white', border: `1px solid ${AlphaShout_COLORS.lightGray}` }}
            >
              <pre style={{ 
                background: '#f5f5f5',
                padding: '16px',
                borderRadius: '4px',
                fontSize: '14px',
                overflow: 'auto',
                margin: 0
              }}>
                {JSON.stringify(generateJSON(), null, 2)}
              </pre>
            </Card>

            {/* Instructions Tabs */}
            <Tabs 
              defaultActiveKey="1" 
              style={{ 
                background: 'white', 
                padding: '16px', 
                borderRadius: '4px',
                border: `1px solid ${AlphaShout_COLORS.lightGray}`
              }}
            >
              <TabPane tab={<span style={{ color: AlphaShout_COLORS.primary }}>Usage Instructions</span>} key="1">
                <div style={{ fontSize: '13px', color: AlphaShout_COLORS.gray }}>
                  <Alert
                    message="Demo Mode"
                    description="You're viewing demo data showing portfolio analysis for META, NVDA, AAPL, ARKK, MSFT, and TSLA."
                    type="info"
                    showIcon
                    style={{ marginBottom: '16px' }}
                  />
                  <h4 style={{ color: AlphaShout_COLORS.primary, marginBottom: '12px' }}>Step-by-Step Guide</h4>
                  <ol style={{ lineHeight: '1.8' }}>
                    <li><strong>Add Assets:</strong> Search for stocks using the search box or manually enter symbols</li>
                    <li><strong>Configure Parameters:</strong> Set your target return, lookback period, and benchmarks</li>
                    <li><strong>Select Strategy:</strong> Choose an optimization strategy from the dropdown</li>
                    <li><strong>Analyze:</strong> Click "Analyze" to run the portfolio optimization</li>
                    <li><strong>Review Results:</strong> Examine performance metrics, asset allocation, and AI recommendations</li>
                  </ol>
                </div>
              </TabPane>
              
              <TabPane tab={<span style={{ color: AlphaShout_COLORS.primary }}>Weight Strategies</span>} key="2">
                <div style={{ fontSize: '13px' }}>
                  {weightStrategies.map(strategy => (
                    <div key={strategy.value} style={{ 
                      padding: '10px',
                      marginBottom: '8px',
                      background: config.weight_strategy === strategy.value ? '#f0f5ff' : '#fafafa',
                      borderRadius: '4px',
                      border: config.weight_strategy === strategy.value ? `2px solid ${AlphaShout_COLORS.primary}` : '1px solid #e0e0e0'
                    }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                        <span style={{ color: AlphaShout_COLORS.primary }}>{strategy.icon}</span>
                        <strong style={{ color: AlphaShout_COLORS.primary }}>{strategy.label}</strong>
                      </div>
                      <div style={{ color: AlphaShout_COLORS.gray, marginLeft: '24px' }}>
                        {strategy.description}
                      </div>
                    </div>
                  ))}
                </div>
              </TabPane>
            </Tabs>
          </div>
        </div>

        {/* Results Display - Wrapped with blur effect */}
        {webhookResponse && !webhookResponse.error && (
          <div style={{ marginTop: '32px' }}>
            <Card 
              title={
                <Space>
                  <DashboardOutlined style={{ fontSize: '24px', color: AlphaShout_COLORS.primary }} />
                  <span style={{ fontSize: '20px', fontWeight: '500', color: AlphaShout_COLORS.primary }}>
                    Portfolio Analysis Results
                  </span>
                  <Badge 
                    text="Demo Data"
                    color="#faad14"
                    style={{ marginLeft: '8px' }}
                  />
                </Space>
              }
              style={{ 
                background: 'white',
                borderColor: AlphaShout_COLORS.primary,
                borderWidth: '2px'
              }}
            >
              <AnalysisResultsWrapper isDemo={true}>
                {(() => {
                  const analysisData = formatEnhancedPortfolioAnalysis(webhookResponse.data);
                  
                  if (analysisData) {
                    return (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        {/* Section 1: Performance Overview */}
                        <div>
                          <Title level={3} style={{ color: AlphaShout_COLORS.primary, fontSize: '18px', marginBottom: '16px' }}>
                            1. Portfolio Performance Overview
                          </Title>
                          <Row gutter={[16, 16]}>
                            <Col xs={24} sm={12} md={6}>
                              <MetricCard
                                title="Portfolio Return"
                                value={parseFloat(analysisData.optimizationSummary.portfolio_return?.replace('%', '') || 0)}
                                suffix="%"
                                icon={<RiseOutlined />}
                                description="Annualized return"
                              />
                            </Col>
                            <Col xs={24} sm={12} md={6}>
                              <MetricCard
                                title="Volatility"
                                value={parseFloat(analysisData.optimizationSummary.portfolio_volatility?.replace('%', '') || 0)}
                                suffix="%"
                                icon={<LineChartOutlined />}
                                description="Risk level"
                              />
                            </Col>
                            <Col xs={24} sm={12} md={6}>
                              <MetricCard
                                title="Sharpe Ratio"
                                value={parseFloat(analysisData.optimizationSummary.portfolio_sharpe || 0)}
                                icon={<TrophyOutlined />}
                                description="Risk-adjusted return"
                              />
                            </Col>
                            <Col xs={24} sm={12} md={6}>
                              <MetricCard
                                title="Diversification"
                                value={parseFloat(analysisData.optimizationSummary.diversification_ratio || 0)}
                                icon={<PieChartOutlined />}
                                description="Portfolio diversity"
                              />
                            </Col>
                          </Row>
                        </div>

                        {/* Section 2: Asset Allocation Table */}
                        {analysisData.assetAllocation && analysisData.assetAllocation.length > 0 && (
                          <div>
                            <Title level={3} style={{ color: AlphaShout_COLORS.primary, fontSize: '18px', marginBottom: '16px' }}>
                              2. Asset Allocation & Performance Metrics
                            </Title>
                            <Table
                              dataSource={analysisData.assetAllocation}
                              rowKey="symbol"
                              pagination={false}
                              size="small"
                              columns={[
                                {
                                  title: 'Symbol',
                                  dataIndex: 'symbol',
                                  render: (text, record, index) => (
                                    <Space>
                                      <div style={{ width: '12px', height: '12px', backgroundColor: getAssetColor(index), borderRadius: '2px' }} />
                                      <Text strong style={{ color: AlphaShout_COLORS.primary }}>{text}</Text>
                                    </Space>
                                  )
                                },
                                {
                                  title: 'Weight',
                                  dataIndex: 'weight',
                                  render: (text) => <Tag color="blue">{text}</Tag>
                                },
                                {
                                  title: 'Expected Return',
                                  dataIndex: 'expected_return',
                                  render: (text) => (
                                    <span style={{ 
                                      color: parseFloat(text) > 0 ? AlphaShout_COLORS.success : AlphaShout_COLORS.danger,
                                      fontWeight: 'bold'
                                    }}>
                                      {text}
                                    </span>
                                  )
                                },
                                {
                                  title: 'Volatility',
                                  dataIndex: 'volatility'
                                },
                                {
                                  title: 'Sharpe Ratio',
                                  dataIndex: 'sharpe_ratio'
                                },
                                {
                                  title: 'Risk Contribution',
                                  dataIndex: 'risk_contribution'
                                }
                              ]}
                            />
                          </div>
                        )}

                        {/* Section 3: Risk Analysis Details */}
                        {analysisData.riskAnalysis && analysisData.riskAnalysis.risk_metrics && (
                          <div>
                            <Title level={3} style={{ color: AlphaShout_COLORS.primary, fontSize: '18px', marginBottom: '16px' }}>
                              3. Risk Analysis
                            </Title>
                            <Row gutter={[16, 16]}>
                              <Col xs={24} sm={12} md={8}>
                                <Card style={{ background: '#fff3e0', borderLeft: `3px solid #ff6f00` }}>
                                  <Statistic
                                    title="VaR 95%"
                                    value={analysisData.riskAnalysis.risk_metrics.portfolio_var_95 || 'N/A'}
                                    valueStyle={{ color: '#ff6f00' }}
                                    prefix={<AlertOutlined />}
                                  />
                                </Card>
                              </Col>
                              <Col xs={24} sm={12} md={8}>
                                <Card style={{ background: '#fff3e0', borderLeft: `3px solid #ff6f00` }}>
                                  <Statistic
                                    title="Maximum Drawdown"
                                    value={analysisData.riskAnalysis.risk_metrics.maximum_drawdown || 'N/A'}
                                    valueStyle={{ color: '#ff6f00' }}
                                    prefix={<FallOutlined />}
                                  />
                                </Card>
                              </Col>
                              <Col xs={24} sm={12} md={8}>
                                <Card style={{ background: '#fff3e0', borderLeft: `3px solid #ff6f00` }}>
                                  <Statistic
                                    title="Downside Deviation"
                                    value={analysisData.riskAnalysis.risk_metrics.downside_deviation || 'N/A'}
                                    valueStyle={{ color: '#ff6f00' }}
                                    prefix={<WarningOutlined />}
                                  />
                                </Card>
                              </Col>
                              <Col xs={24} sm={12} md={8}>
                                <Card style={{ background: '#f0f5ff', borderLeft: `3px solid ${AlphaShout_COLORS.primary}` }}>
                                  <Statistic
                                    title="Sortino Ratio"
                                    value={parseFloat(analysisData.riskAnalysis.risk_metrics.sortino_ratio || 0).toFixed(3)}
                                    valueStyle={{ color: AlphaShout_COLORS.primary }}
                                  />
                                </Card>
                              </Col>
                              <Col xs={24} sm={12} md={8}>
                                <Card style={{ background: '#f0f5ff', borderLeft: `3px solid ${AlphaShout_COLORS.primary}` }}>
                                  <Statistic
                                    title="Calmar Ratio"
                                    value={parseFloat(analysisData.riskAnalysis.risk_metrics.calmar_ratio || 0).toFixed(3)}
                                    valueStyle={{ color: AlphaShout_COLORS.primary }}
                                  />
                                </Card>
                              </Col>
                              <Col xs={24} sm={12} md={8}>
                                <Card style={{ background: '#f0f5ff', borderLeft: `3px solid ${AlphaShout_COLORS.primary}` }}>
                                  <Statistic
                                    title="Omega Ratio"
                                    value={parseFloat(analysisData.riskAnalysis.risk_metrics.omega_ratio || 0).toFixed(3)}
                                    valueStyle={{ color: AlphaShout_COLORS.primary }}
                                  />
                                </Card>
                              </Col>
                            </Row>
                          </div>
                        )}

                        {/* Section 4: Correlation Matrix */}
                        {analysisData.correlationAnalysis && analysisData.correlationAnalysis.correlation_matrix && (
                          <div>
                            <Title level={3} style={{ color: AlphaShout_COLORS.primary, fontSize: '18px', marginBottom: '16px' }}>
                              4. Correlation Matrix
                            </Title>
                            <Card>
                              <div style={{ overflowX: 'auto' }}>
                                <table style={{ 
                                  width: '100%', 
                                  borderCollapse: 'collapse',
                                  fontSize: '12px'
                                }}>
                                  <thead>
                                    <tr>
                                      <th style={{ 
                                        background: AlphaShout_COLORS.primary, 
                                        color: 'white', 
                                        padding: '8px',
                                        position: 'sticky',
                                        left: 0,
                                        zIndex: 1
                                      }}>
                                        Asset
                                      </th>
                                      {Object.keys(analysisData.correlationAnalysis.correlation_matrix).map(asset => (
                                        <th key={asset} style={{ 
                                          background: AlphaShout_COLORS.primary, 
                                          color: 'white', 
                                          padding: '8px',
                                          textAlign: 'center'
                                        }}>
                                          {asset}
                                        </th>
                                      ))}
                                    </tr>
                                  </thead>
                                  <tbody>
                                    {Object.entries(analysisData.correlationAnalysis.correlation_matrix).map(([rowAsset, correlations]) => (
                                      <tr key={rowAsset}>
                                        <td style={{ 
                                          background: AlphaShout_COLORS.secondary, 
                                          color: 'white', 
                                          padding: '8px',
                                          fontWeight: 'bold',
                                          position: 'sticky',
                                          left: 0
                                        }}>
                                          {rowAsset}
                                        </td>
                                        {Object.entries(correlations).map(([colAsset, value]) => {
                                          const numValue = typeof value === 'number' ? value : parseFloat(value);
                                          const bgColor = numValue === 1 ? '#003d7a' :
                                                         numValue >= 0.8 ? '#ffcccc' :
                                                         numValue >= 0.5 ? '#ffe6cc' :
                                                         '#ccffcc';
                                          const textColor = numValue === 1 ? 'white' : '#333';
                                          
                                          return (
                                            <td key={colAsset} style={{ 
                                              background: bgColor,
                                              color: textColor,
                                              padding: '8px',
                                              textAlign: 'center',
                                              fontWeight: numValue === 1 ? 'bold' : 'normal'
                                            }}>
                                              {numValue.toFixed(3)}
                                            </td>
                                          );
                                        })}
                                      </tr>
                                    ))}
                                  </tbody>
                                </table>
                              </div>
                              <div style={{ marginTop: '16px', fontSize: '12px', color: AlphaShout_COLORS.gray }}>
                                <Space direction="vertical">
                                  <Text>
                                    <Badge color="#ffcccc" /> High Correlation (≥ 0.8)
                                  </Text>
                                  <Text>
                                    <Badge color="#ffe6cc" /> Medium Correlation (0.5 - 0.8)
                                  </Text>
                                  <Text>
                                    <Badge color="#ccffcc" /> Low Correlation (&lt; 0.5)
                                  </Text>
                                </Space>
                              </div>
                            </Card>
                          </div>
                        )}

                        {/* Section 5: Strategy Comparison with Circular Charts */}
                        {analysisData.strategyComparison && Object.keys(analysisData.strategyComparison).length > 0 && (
                          <div>
                            <Title level={3} style={{ color: AlphaShout_COLORS.primary, fontSize: '18px', marginBottom: '16px' }}>
                              5. Strategy Comparison & Weight Distribution
                            </Title>
                            <div style={{ 
                              display: 'grid', 
                              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
                              gap: '16px'
                            }}>
                              {Object.entries(analysisData.strategyComparison).map(([strategy, data]) => (
                                <CircularWeightChart
                                  key={strategy}
                                  strategyName={weightStrategies.find(s => s.value === strategy)?.label || strategy.replace(/_/g, ' ').toUpperCase()}
                                  weights={data.weights || []}
                                  metrics={data}
                                  symbols={symbols.length > 0 ? symbols : ['META', 'NVDA', 'AAPL', 'ARKK', 'MSFT', 'TSLA']}
                                />
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Section 6: AI Analysis */}
                        {analysisData.aiAnalysis && (
                          <div>
                            <Title level={3} style={{ color: AlphaShout_COLORS.primary, fontSize: '18px', marginBottom: '16px' }}>
                              6. AI Analysis & Recommendations
                            </Title>
                            <Card style={{ background: '#f8f9fa', border: `1px solid ${AlphaShout_COLORS.lightGray}` }}>
                              {formatAIAnalysis(analysisData.aiAnalysis)}
                            </Card>
                          </div>
                        )}
                      </div>
                    );
                  }
                  
                  return null;
                })()}
              </AnalysisResultsWrapper>
            </Card>
          </div>
        )}
      </div>
    </>
  );
}