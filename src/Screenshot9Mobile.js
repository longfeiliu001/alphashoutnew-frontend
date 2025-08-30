import React, { useState, useRef, useEffect } from 'react';
import { Button, Card, Typography, message, Input, Tabs, Upload, Tag, Spin } from 'antd';
import {
  CameraOutlined,
  UploadOutlined,
  SearchOutlined,
  LineChartOutlined,
  CheckCircleOutlined,
  DollarOutlined,
  FileImageOutlined,
  CloseOutlined,
  LoginOutlined,
  ReloadOutlined,
  RobotOutlined
} from '@ant-design/icons';

const { Title, Text } = Typography;
const { TabPane } = Tabs;

// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

// AlphaShout Theme
const AlphaShoutTheme = {
  colors: {
    primary: '#003D6D',
    primaryDark: '#002347',
    primaryLight: '#005A9C',
    secondary: '#0089CC',
    accent: '#00B4E5',
    success: '#6ABF4B',
    warning: '#FFB81C',
    error: '#E31E24',
    background: '#FFFFFF',
    surface: '#FFFFFF',
    surfaceSecondary: '#F8F9FA',
    surfaceLight: '#FAFBFC',
    border: '#D4D7DC',
    borderLight: '#E8EAED',
    textPrimary: '#1A1A1A',
    textSecondary: '#4A4A4A',
    textTertiary: '#767676',
    textLight: '#999999',
    textInverse: '#FFFFFF'
  },
  fonts: {
    primary: "'Helvetica Neue', Helvetica, Arial, sans-serif"
  },
  radius: {
    small: '4px',
    medium: '8px',
    large: '12px'
  }
};

// Markdown Parser for Mobile
const parseMarkdownMobile = (content) => {
  if (!content) return null;

  const parseInlineStyles = (text) => {
    if (!text) return text;

    // Bold text
    text = text.replace(/\*\*([^*]+)\*\*/g, (match, p1) => {
      return `<strong style="font-weight: 600; color: ${AlphaShoutTheme.colors.primary}">${p1}</strong>`;
    });

    // Italic text
    text = text.replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, (match, p1) => {
      return `<em style="font-style: italic">${p1}</em>`;
    });

    // Inline code
    text = text.replace(/`([^`]+)`/g, (match, p1) => {
      return `<code style="background-color: #f5f5f5; padding: 2px 4px; border-radius: 3px; font-size: 0.85em; color: ${AlphaShoutTheme.colors.primary}">${p1}</code>`;
    });

    return text;
  };

  const lines = content.split('\n');
  const elements = [];
  let currentList = null;
  let currentListType = null;

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];

    // Headers
    if (line.match(/^#+\s/)) {
      const headerMatch = line.match(/^(#+)\s(.+)/);
      if (headerMatch) {
        const level = headerMatch[1].length;
        const text = headerMatch[2];
        
        const headerStyles = {
          1: { fontSize: '18px', marginTop: '16px', marginBottom: '12px', fontWeight: 700 },
          2: { fontSize: '16px', marginTop: '14px', marginBottom: '10px', fontWeight: 600 },
          3: { fontSize: '15px', marginTop: '12px', marginBottom: '8px', fontWeight: 600 },
          4: { fontSize: '14px', marginTop: '10px', marginBottom: '6px', fontWeight: 600 }
        };

        const style = headerStyles[Math.min(level, 4)];

        elements.push(
          <div key={i} style={{
            ...style,
            color: AlphaShoutTheme.colors.primary,
            borderBottom: level <= 2 ? `1px solid ${AlphaShoutTheme.colors.borderLight}` : 'none',
            paddingBottom: level <= 2 ? '4px' : '0'
          }}>
            <span dangerouslySetInnerHTML={{ __html: parseInlineStyles(text) }} />
          </div>
        );
        continue;
      }
    }

    // Lists
    const unorderedListMatch = line.match(/^(\s*)[*+-]\s(.+)/);
    const orderedListMatch = line.match(/^(\s*)(\d+)\.\s(.+)/);

    if (unorderedListMatch || orderedListMatch) {
      const isOrdered = !!orderedListMatch;
      const content = isOrdered ? orderedListMatch[3] : unorderedListMatch[2];

      if (!currentList || currentListType !== (isOrdered ? 'ol' : 'ul')) {
        if (currentList) {
          elements.push(currentList);
        }
        currentListType = isOrdered ? 'ol' : 'ul';
        currentList = React.createElement(
          currentListType,
          {
            key: `list-${i}`,
            style: {
              paddingLeft: '20px',
              margin: '8px 0',
              fontSize: '13px',
              lineHeight: '1.6'
            }
          },
          []
        );
      }

      const listItem = (
        <li key={`item-${i}`} style={{ marginBottom: '4px' }}>
          <span dangerouslySetInnerHTML={{ __html: parseInlineStyles(content) }} />
        </li>
      );

      currentList = React.cloneElement(currentList, {
        children: [...currentList.props.children, listItem]
      });
      continue;
    } else if (currentList) {
      elements.push(currentList);
      currentList = null;
      currentListType = null;
    }

    // Empty lines
    if (line.trim() === '') {
      if (i > 0 && lines[i - 1].trim() !== '') {
        elements.push(<div key={i} style={{ height: '8px' }} />);
      }
      continue;
    }

    // Regular paragraphs
    elements.push(
      <p key={i} style={{
        fontSize: '13px',
        lineHeight: '1.6',
        marginBottom: '8px',
        color: AlphaShoutTheme.colors.textSecondary
      }}>
        <span dangerouslySetInnerHTML={{ __html: parseInlineStyles(line) }} />
      </p>
    );
  }

  if (currentList) {
    elements.push(currentList);
  }

  return <div>{elements}</div>;
};

// Mobile-optimized message
const showMobileMessage = (type, content) => {
  message.config({
    top: 60,
    duration: 3,
    maxCount: 1,
  });
  message[type](content);
};

// Quota Display Component
const MobileQuotaDisplay = ({ quota, isAuthenticated, onLogin }) => {
  if (!isAuthenticated) {
    return (
      <div 
        onClick={onLogin}
        style={{
          padding: '10px',
          background: '#FFF3E0',
          borderRadius: '8px',
          marginBottom: '12px',
          textAlign: 'center',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px'
        }}
      >
        <LoginOutlined style={{ color: AlphaShoutTheme.colors.warning }} />
        <span style={{ fontSize: '14px' }}>Tap to login</span>
      </div>
    );
  }
  
  if (!quota) return null;
  
  const quotaColor = quota.available_quota <= 5 ? AlphaShoutTheme.colors.error : 
                     quota.available_quota <= 20 ? AlphaShoutTheme.colors.warning : 
                     AlphaShoutTheme.colors.success;
  
  return (
    <div style={{
      padding: '10px 12px',
      background: AlphaShoutTheme.colors.surfaceSecondary,
      borderRadius: '8px',
      marginBottom: '12px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <DollarOutlined style={{ color: quotaColor }} />
        <span style={{ fontSize: '13px', color: AlphaShoutTheme.colors.textSecondary }}>
          Tokens
        </span>
      </div>
      <span style={{ fontSize: '16px', fontWeight: 'bold', color: quotaColor }}>
        {quota.available_quota}
      </span>
    </div>
  );
};

const Screenshot9Mobile = () => {
  // State Management
  const [activeTab, setActiveTab] = useState('1');
  const [uploadedImage, setUploadedImage] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [showAnalysisResult, setShowAnalysisResult] = useState(false);
  
  // Stock Search States
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedStock, setSelectedStock] = useState(null);
  const [interval, setInterval] = useState('5m');
  const [technicalAnalysis, setTechnicalAnalysis] = useState(null);
  const [chartUrl, setChartUrl] = useState(null);
  const [isLoadingTechnical, setIsLoadingTechnical] = useState(false);
  
  // Auth States
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userQuota, setUserQuota] = useState(null);
  const [quotaConfig, setQuotaConfig] = useState(null);
  
  const fileInputRef = useRef(null);
  const searchTimeoutRef = useRef(null);

  // Check authentication
  useEffect(() => {
    checkAuthentication();
    fetchUserQuota();
    fetchQuotaConfig();
  }, []);

  const checkAuthentication = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
        credentials: 'include'
      });
      setIsAuthenticated(response.ok);
    } catch (error) {
      console.error('Auth check error:', error);
      setIsAuthenticated(false);
    }
  };

  const fetchUserQuota = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/quota/details`, {
        credentials: 'include'
      });
      if (response.ok) {
        const data = await response.json();
        setUserQuota(data);
      }
    } catch (error) {
      console.error('Failed to fetch quota:', error);
    }
  };

  const fetchQuotaConfig = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/screenshot/quota-config`);
      const data = await response.json();
      if (data.success) {
        setQuotaConfig(data.config);
      }
    } catch (error) {
      console.error('Failed to fetch quota config:', error);
    }
  };

  // Handle image upload
  const handleImageUpload = (info) => {
    const { file } = info;
    
    if (file.status === 'done' || file.originFileObj) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setUploadedImage(e.target.result);
        setAnalysisResult(null);
        setShowAnalysisResult(false);
      };
      reader.readAsDataURL(file.originFileObj || file);
    }
  };

  // Analyze uploaded image with default prompt
  const analyzeImage = async () => {
    if (!uploadedImage) {
      showMobileMessage('warning', 'Please upload an image first');
      return;
    }

    if (!isAuthenticated) {
      showMobileMessage('warning', 'Please login to use analysis');
      window.dispatchEvent(new CustomEvent('navigate-to-login', { detail: { page: 'login' } }));
      return;
    }

    const ANALYSE_COST = quotaConfig?.ANALYSE_COST || 2;
    if (userQuota && userQuota.available_quota < ANALYSE_COST) {
      showMobileMessage('warning', `Need ${ANALYSE_COST} tokens. You have ${userQuota.available_quota}`);
      window.dispatchEvent(new CustomEvent('navigate-to-payment', { detail: { page: 'payment2' } }));
      return;
    }

    setIsAnalyzing(true);
    setAnalysisResult(null);
    setShowAnalysisResult(false);

    try {
      const response = await fetch(`${API_BASE_URL}/api/screenshot/analyze`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({
          screenshot: uploadedImage
          // No custom prompt - use default AI analysis
        })
      });

      const data = await response.json();

      if (data.success) {
        setAnalysisResult(data.analysis.content);
        setShowAnalysisResult(true);
        showMobileMessage('success', `Analysis done! ${data.quota.deducted} tokens used`);
        
        if (data.quota.remaining !== undefined) {
          setUserQuota(prev => ({
            ...prev,
            available_quota: data.quota.remaining
          }));
        }
      } else {
        showMobileMessage('error', data.message || 'Analysis failed');
      }
    } catch (error) {
      console.error('Analysis error:', error);
      showMobileMessage('error', 'Analysis failed');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // Search stocks
  const searchStocks = async (query) => {
    if (!query || query.length < 2) {
      setSearchResults([]);
      return;
    }

    setIsSearching(true);
    
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/stock/search?query=${encodeURIComponent(query)}`,
        { credentials: 'include' }
      );
      
      const data = await response.json();
      
      if (data.success && Array.isArray(data.symbols)) {
        setSearchResults(data.symbols.slice(0, 5));
      }
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchChange = (value) => {
    setSearchQuery(value);
    
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    if (!value.trim()) {
      setSearchResults([]);
      return;
    }
    
    searchTimeoutRef.current = setTimeout(() => {
      searchStocks(value);
    }, 300);
  };

  const selectStock = (stock) => {
    setSelectedStock(stock);
    setSearchQuery(`${stock.exchange}:${stock.symbol}`);
    setSearchResults([]);
  };

  // Fetch technical analysis
  const fetchTechnicalAnalysis = async () => {
    if (!selectedStock) {
      showMobileMessage('warning', 'Please select a stock');
      return;
    }

    if (!isAuthenticated) {
      showMobileMessage('warning', 'Please login first');
      window.dispatchEvent(new CustomEvent('navigate-to-login', { detail: { page: 'login' } }));
      return;
    }

    if (userQuota && userQuota.available_quota < 2) {
      showMobileMessage('warning', `Need 2 tokens. You have ${userQuota.available_quota}`);
      window.dispatchEvent(new CustomEvent('navigate-to-payment', { detail: { page: 'payment2' } }));
      return;
    }

    setIsLoadingTechnical(true);
    setTechnicalAnalysis(null);
    setChartUrl(null);

    try {
      const symbol = `${selectedStock.exchange}:${selectedStock.symbol}`;
      const response = await fetch(`${API_BASE_URL}/api/stock/technical-analysis-only`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ symbol, interval })
      });

      const data = await response.json();

      if (data.success) {
        const results = data.analysis.results.technicalAnalysis;
        setTechnicalAnalysis(results.content);
        setChartUrl(results.chartUrl);
        
        if (data.quota) {
          setUserQuota(prev => ({ ...prev, available_quota: data.quota.remaining }));
          showMobileMessage('success', `Analysis done! ${data.quota.deducted} tokens used`);
        }
      } else {
        showMobileMessage('error', data.message || 'Failed to fetch analysis');
      }
    } catch (error) {
      console.error('Technical analysis error:', error);
      showMobileMessage('error', 'Analysis failed');
    } finally {
      setIsLoadingTechnical(false);
    }
  };

  // Refresh technical analysis
  const refreshTechnicalAnalysis = async () => {
    if (!selectedStock || !technicalAnalysis) return;
    
    if (!isAuthenticated) {
      showMobileMessage('warning', 'Please login first');
      return;
    }

    if (userQuota && userQuota.available_quota < 1) {
      showMobileMessage('warning', 'Need 1 token to refresh');
      return;
    }

    setIsLoadingTechnical(true);

    try {
      const symbol = `${selectedStock.exchange}:${selectedStock.symbol}`;
      const response = await fetch(`${API_BASE_URL}/api/stock/refresh-analysis`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ 
          symbol, 
          analysisType: 'technical', 
          interval 
        })
      });

      const data = await response.json();

      if (data.success) {
        setTechnicalAnalysis(data.data.content);
        setChartUrl(data.data.chartUrl);
        
        if (data.quota) {
          setUserQuota(prev => ({ ...prev, available_quota: data.quota.remaining }));
          showMobileMessage('success', 'Refreshed!');
        }
      } else {
        showMobileMessage('error', 'Refresh failed');
      }
    } catch (error) {
      showMobileMessage('error', 'Refresh failed');
    } finally {
      setIsLoadingTechnical(false);
    }
  };

  return (
    <div style={{ 
      padding: '12px',
      maxWidth: '100%',
      margin: '0 auto',
      background: AlphaShoutTheme.colors.background,
      minHeight: '100vh'
    }}>
      {/* Header */}
      <div style={{ marginBottom: '16px', textAlign: 'center' }}>
        <Title level={4} style={{ margin: 0, color: AlphaShoutTheme.colors.primary }}>
          Real-Time Chart AI
        </Title>
      </div>

      {/* Quota Display */}
      <MobileQuotaDisplay 
        quota={userQuota} 
        isAuthenticated={isAuthenticated}
        onLogin={() => window.dispatchEvent(new CustomEvent('navigate-to-login', { detail: { page: 'login' } }))}
      />

      {/* Tabs */}
      <Tabs 
        activeKey={activeTab} 
        onChange={setActiveTab}
        centered
        size="small"
      >
        <TabPane 
          tab={
            <span style={{ fontSize: '14px' }}>
              <FileImageOutlined />
              <span style={{ marginLeft: '4px' }}>Upload</span>
            </span>
          }
          key="1"
        >
          {/* Upload Section */}
          <Upload.Dragger
            name="file"
            accept="image/*"
            showUploadList={false}
            customRequest={({ file, onSuccess }) => {
              setTimeout(() => onSuccess("ok"), 0);
            }}
            onChange={handleImageUpload}
            style={{
              background: AlphaShoutTheme.colors.surfaceSecondary,
              border: `2px dashed ${AlphaShoutTheme.colors.border}`,
              borderRadius: AlphaShoutTheme.radius.large,
              marginBottom: '16px'
            }}
          >
            <p style={{ fontSize: '28px', margin: '16px 0' }}>
              {uploadedImage ? <CheckCircleOutlined style={{ color: AlphaShoutTheme.colors.success }} /> : <CameraOutlined />}
            </p>
            <p style={{ fontSize: '14px', fontWeight: '500', marginBottom: '4px' }}>
              {uploadedImage ? 'Image uploaded' : 'Tap to upload chart'}
            </p>
            <p style={{ fontSize: '12px', color: AlphaShoutTheme.colors.textLight }}>
              Take photo or choose from gallery
            </p>
          </Upload.Dragger>

          {/* Uploaded Image Preview */}
          {uploadedImage && !showAnalysisResult && (
            <>
              <div style={{ 
                marginBottom: '16px',
                position: 'relative',
                borderRadius: AlphaShoutTheme.radius.medium,
                overflow: 'hidden',
                border: `1px solid ${AlphaShoutTheme.colors.border}`
              }}>
                <img 
                  src={uploadedImage} 
                  alt="Uploaded chart" 
                  style={{ 
                    width: '100%', 
                    height: 'auto',
                    display: 'block'
                  }}
                />
                <Button
                  icon={<CloseOutlined />}
                  onClick={() => {
                    setUploadedImage(null);
                    setAnalysisResult(null);
                    setShowAnalysisResult(false);
                  }}
                  size="small"
                  style={{
                    position: 'absolute',
                    top: '8px',
                    right: '8px',
                    background: 'rgba(255,255,255,0.9)'
                  }}
                  shape="circle"
                />
              </div>

              {/* AI Analysis Button */}
              <Button
                type="primary"
                size="large"
                block
                icon={<RobotOutlined />}
                loading={isAnalyzing}
                onClick={analyzeImage}
                style={{
                  background: AlphaShoutTheme.colors.primary,
                  height: '48px',
                  fontSize: '16px',
                  marginBottom: '16px',
                  fontWeight: '500'
                }}
              >
                {isAnalyzing ? 'Analyzing...' : `AI Analysis (${quotaConfig?.ANALYSE_COST || 2} tokens)`}
              </Button>
            </>
          )}

          {/* Analysis Result */}
          {showAnalysisResult && analysisResult && (
            <Card 
              size="small"
              title={
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '15px', fontWeight: '600', color: AlphaShoutTheme.colors.primary }}>
                    AI Analysis Result
                  </span>
                  <Button
                    type="text"
                    icon={<CloseOutlined />}
                    size="small"
                    onClick={() => {
                      setShowAnalysisResult(false);
                      setAnalysisResult(null);
                    }}
                  />
                </div>
              }
              style={{ 
                background: AlphaShoutTheme.colors.surface,
                border: `1px solid ${AlphaShoutTheme.colors.borderLight}`,
                borderRadius: AlphaShoutTheme.radius.large
              }}
              bodyStyle={{
                padding: '12px',
                background: AlphaShoutTheme.colors.surfaceSecondary,
                borderRadius: `0 0 ${AlphaShoutTheme.radius.large} ${AlphaShoutTheme.radius.large}`
              }}
            >
              <div style={{ 
                maxHeight: '400px',
                overflowY: 'auto',
                paddingRight: '4px'
              }}>
                {parseMarkdownMobile(analysisResult)}
              </div>
            </Card>
          )}
        </TabPane>

        <TabPane 
          tab={
            <span style={{ fontSize: '14px' }}>
              <SearchOutlined />
              <span style={{ marginLeft: '4px' }}>Search</span>
            </span>
          }
          key="2"
        >
          {/* Stock Search Section */}
          <Input
            size="large"
            placeholder="Search stock (e.g., AAPL)"
            prefix={<SearchOutlined />}
            suffix={isSearching ? <Spin size="small" /> : null}
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            style={{
              borderRadius: AlphaShoutTheme.radius.medium,
              marginBottom: '12px'
            }}
          />

          {/* Search Results */}
          {searchResults.length > 0 && (
            <Card 
              bodyStyle={{ padding: 0 }}
              style={{ 
                borderRadius: AlphaShoutTheme.radius.medium,
                marginBottom: '12px'
              }}
            >
              {searchResults.map((result, index) => (
                <div
                  key={`${result.symbol}-${index}`}
                  onClick={() => selectStock(result)}
                  style={{
                    padding: '10px 12px',
                    borderBottom: index < searchResults.length - 1 ? `1px solid ${AlphaShoutTheme.colors.borderLight}` : 'none',
                    background: 'white',
                    transition: 'background 0.2s'
                  }}
                  onTouchStart={(e) => e.currentTarget.style.background = AlphaShoutTheme.colors.surfaceSecondary}
                  onTouchEnd={(e) => e.currentTarget.style.background = 'white'}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Text strong style={{ fontSize: '14px' }}>{result.symbol}</Text>
                    <Tag color="blue" style={{ fontSize: '11px' }}>{result.exchange}</Tag>
                  </div>
                  <Text style={{ fontSize: '11px', color: AlphaShoutTheme.colors.textLight }}>
                    {result.instrument_name}
                  </Text>
                </div>
              ))}
            </Card>
          )}

          {/* Selected Stock & Controls */}
          {selectedStock && (
            <>
              {/* Stock Info */}
              <Card 
                size="small"
                style={{ 
                  marginBottom: '12px',
                  background: AlphaShoutTheme.colors.surfaceSecondary
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <Text strong style={{ fontSize: '16px' }}>
                      {selectedStock.symbol}
                    </Text>
                    <Tag color="blue" style={{ marginLeft: '6px', fontSize: '10px' }}>{selectedStock.exchange}</Tag>
                  </div>
                  <Button
                    type="text"
                    icon={<CloseOutlined />}
                    size="small"
                    onClick={() => {
                      setSelectedStock(null);
                      setSearchQuery('');
                      setTechnicalAnalysis(null);
                      setChartUrl(null);
                    }}
                  />
                </div>
                <Text style={{ fontSize: '12px', color: AlphaShoutTheme.colors.textSecondary }}>
                  {selectedStock.instrument_name}
                </Text>
              </Card>

              {/* Interval Selection */}
              <div style={{ marginBottom: '12px' }}>
                <Text style={{ fontSize: '13px', display: 'block', marginBottom: '6px' }}>
                  Time Interval:
                </Text>
                <div style={{ 
                  display: 'grid',
                  gridTemplateColumns: 'repeat(3, 1fr)',
                  gap: '6px'
                }}>
                  {['5m', '15m', '1h', '1D', '1W', '1M'].map(option => (
                    <Button
                      key={option}
                      size="small"
                      onClick={() => setInterval(option)}
                      type={interval === option ? 'primary' : 'default'}
                      style={{
                        background: interval === option ? AlphaShoutTheme.colors.primary : 'white',
                        fontSize: '12px'
                      }}
                    >
                      {option}
                    </Button>
                  ))}
                </div>
              </div>

              {/* Analyze Button */}
              <Button
                type="primary"
                size="large"
                block
                icon={<LineChartOutlined />}
                loading={isLoadingTechnical}
                onClick={fetchTechnicalAnalysis}
                style={{
                  background: AlphaShoutTheme.colors.primary,
                  height: '44px',
                  fontSize: '15px',
                  marginBottom: '12px'
                }}
              >
                Get Analysis (2 tokens)
              </Button>
            </>
          )}

          {/* Chart Display */}
          {chartUrl && (
            <Card 
              size="small"
              title={
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: '14px' }}>Price Chart</span>
                  {technicalAnalysis && (
                    <Button
                      size="small"
                      icon={<ReloadOutlined />}
                      loading={isLoadingTechnical}
                      onClick={refreshTechnicalAnalysis}
                    >
                      Refresh
                    </Button>
                  )}
                </div>
              }
              style={{ marginBottom: '12px' }}
            >
              <img 
                src={chartUrl} 
                alt="Stock chart" 
                style={{ 
                  width: '100%',
                  height: 'auto',
                  borderRadius: AlphaShoutTheme.radius.medium
                }}
              />
            </Card>
          )}

          {/* Technical Analysis */}
          {technicalAnalysis && (
            <Card 
              size="small"
              title={<span style={{ fontSize: '14px', fontWeight: '600', color: AlphaShoutTheme.colors.primary }}>Technical Analysis</span>}
              style={{ 
                background: AlphaShoutTheme.colors.surface,
                border: `1px solid ${AlphaShoutTheme.colors.borderLight}`,
                borderRadius: AlphaShoutTheme.radius.large
              }}
              bodyStyle={{
                padding: '12px',
                background: AlphaShoutTheme.colors.surfaceSecondary,
                borderRadius: `0 0 ${AlphaShoutTheme.radius.large} ${AlphaShoutTheme.radius.large}`
              }}
            >
              <div style={{ 
                maxHeight: '400px',
                overflowY: 'auto',
                paddingRight: '4px'
              }}>
                {parseMarkdownMobile(technicalAnalysis)}
              </div>
            </Card>
          )}
        </TabPane>
      </Tabs>
    </div>
  );
};

export default Screenshot9Mobile;