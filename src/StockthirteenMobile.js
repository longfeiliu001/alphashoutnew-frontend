// StockthirteenMobile.js - Simplified version
import React, { useState, useEffect, useRef } from 'react';
import { 
  Card, Input, Button, Tag, Badge, Space,
  Drawer, List, Segmented, message, Spin, Empty, Modal
} from 'antd';
import { 
  SearchOutlined, ReloadOutlined, ExperimentOutlined,
  LoginOutlined, BarChartOutlined,
  RiseOutlined, FallOutlined
} from '@ant-design/icons';
import { useAnalysis } from './AnalysisContext';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
const CACHE_KEY = 'stocknine_analysis_cache';
const CACHE_EXPIRY = 30 * 60 * 1000;

export default function StockthirteenMobile() {
  const {
    globalAnalysisData,
    setGlobalAnalysisData,
    globalDeepAnalysisData,
    setGlobalDeepAnalysisData,
    globalLoadingStates,
    setGlobalLoadingStates,
    currentSymbol,
    setCurrentSymbol,
    addActiveOperation,
    removeActiveOperation,
    setAbortController,
    hasActiveOperations,
    cancelAllOperations
  } = useAnalysis();
  
  const [query, setQuery] = useState(currentSymbol || 'AAPL');
  const [userQuota, setUserQuota] = useState(null);
  const [quotaConfig, setQuotaConfig] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [activeTab, setActiveTab] = useState('income');
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const [searchDrawerVisible, setSearchDrawerVisible] = useState(false);
  const searchTimeoutRef = useRef(null);
  
  useEffect(() => {
    const init = async () => {
      const authenticated = await checkAuthentication();
      setIsAuthenticated(authenticated);
      if (authenticated) {
        fetchUserQuota();
      }
    };
    init();
    fetchQuotaConfig();
    loadCachedData();
  }, []);
  
  const loadCachedData = () => {
    if (globalAnalysisData && Object.keys(globalAnalysisData).length > 0) {
      return;
    }
    
    const cached = localStorage.getItem(CACHE_KEY);
    if (cached) {
      const { data, timestamp, symbol } = JSON.parse(cached);
      if (Date.now() - timestamp < CACHE_EXPIRY) {
        if (symbol) {
          setQuery(symbol);
          setCurrentSymbol(symbol);
        }
        if (data.analysisData && Object.keys(data.analysisData).length > 0) {
          setGlobalAnalysisData(data.analysisData);
        }
        if (data.deepAnalysisData) {
          setGlobalDeepAnalysisData(data.deepAnalysisData);
        }
      }
    }
  };
  
  useEffect(() => {
    if (Object.keys(globalAnalysisData).length > 0) {
      const cacheData = {
        data: { 
          analysisData: globalAnalysisData, 
          deepAnalysisData: globalDeepAnalysisData 
        },
        timestamp: Date.now(),
        symbol: query
      };
      localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
    }
  }, [globalAnalysisData, globalDeepAnalysisData, query]);
  
  const checkAuthentication = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
        credentials: 'include'
      });
      return response.ok;
    } catch (error) {
      console.error('Auth check error:', error);
      return false;
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
      const response = await fetch(`${API_BASE_URL}/api/stock/quota-config`);
      const data = await response.json();
      if (data.success) {
        setQuotaConfig(data.config);
      }
    } catch (error) {
      console.error('Failed to fetch quota config:', error);
    }
  };
  
 const handleSearch = async (searchQuery) => {
  console.log('Mobile search triggered:', searchQuery);
  
  if (!searchQuery || searchQuery.length < 2) {
    setSearchResults([]);
    return;
  }
  
  setSearching(true);
  try {
    const response = await fetch(
      `${API_BASE_URL}/api/stock/search-us-equity?query=${encodeURIComponent(searchQuery)}`,
      { credentials: 'include' }
    );
    
    const data = await response.json();
    console.log('Search response:', data);
    
    // 修改这里：检查 symbols 而不是 bestMatches
    if (data.success && data.symbols && data.symbols.length > 0) {
      const transformedResults = data.symbols.map(match => ({
        symbol: match.symbol,
        instrument_name: match.instrument_name,
        country: match.region || match.country || 'United States',
        instrument_type: match.instrument_type || 'Equity'
      }));
      
      console.log('Transformed results:', transformedResults);
      setSearchResults(transformedResults);
      setSearchDrawerVisible(true);
    } else {
      console.log('No results found');
      setSearchResults([]);
    }
  } catch (error) {
    console.error('Search error:', error);
  } finally {
    setSearching(false);
  }
};
  
  const handleQueryChange = (value) => {
    setQuery(value);
    setCurrentSymbol(value);
    
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    if (value.trim().length >= 2) {
      searchTimeoutRef.current = setTimeout(() => {
        handleSearch(value);
      }, 300);
    }
  };
  
  const handleFullAnalysis = async () => {
    if (!isAuthenticated) {
      message.warning('Please login to use analysis');
      window.dispatchEvent(new CustomEvent('navigate-to-login', { 
        detail: { page: 'login' } 
      }));
      return;
    }
    
    if (!query.trim()) {
      message.warning('Please enter a stock symbol');
      return;
    }
    
    if (hasActiveOperations()) {
      const cancelledCount = cancelAllOperations();
      message.info(`Cancelled ${cancelledCount} operations. Starting new analysis...`);
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    const operationId = `mobile-full-${Date.now()}`;
    addActiveOperation(operationId);
    
    setGlobalLoadingStates(prev => ({ 
      ...prev, 
      full: true,
      income: true,
      balance: true,
      cashflow: true
    }));
    
    const abortController = new AbortController();
    setAbortController(operationId, abortController);
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/stock/full-analysis`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ symbol: query }),
        signal: abortController.signal
      });
      
      const data = await response.json();
      
      if (!response.ok || !data.success) {
        if (data.error === 'INSUFFICIENT_QUOTA') {
          Modal.warning({
            title: 'Insufficient Tokens',
            content: `You need ${data.required} tokens. Current balance: ${data.available}`,
            okText: 'Go to Billing',
            onOk: () => {
              window.dispatchEvent(new CustomEvent('navigate-to-payment', { 
                detail: { page: 'payment2' } 
              }));
            }
          });
        } else {
          message.error(data.message || 'Analysis failed');
        }
        return;
      }
      
      message.success(`Analysis completed! ${data.quota.deducted} tokens used.`);
      
      if (userQuota) {
        setUserQuota({ ...userQuota, available_quota: data.quota.remaining });
      }
      
      const results = data.analysis.results;
      setGlobalAnalysisData({
        incomeStatement: results.incomeStatement || '',
        balanceSheet: results.balanceSheet || '',
        cashFlow: results.cashFlow || ''
      });
      
      setGlobalDeepAnalysisData({
        income: null,
        balance: null,
        cashflow: null
      });
      
    } catch (error) {
      if (error.name === 'AbortError') {
        message.info('Analysis was cancelled');
      } else {
        message.error('Network error');
      }
    } finally {
      setGlobalLoadingStates(prev => ({ 
        ...prev, 
        full: false,
        income: false,
        balance: false,
        cashflow: false
      }));
      removeActiveOperation(operationId);
    }
  };
  
  const handleRefresh = async (analysisType) => {
    if (!isAuthenticated) {
      message.warning('Please login first');
      return;
    }
    
    if (!query.trim()) {
      message.warning('Please select a stock symbol');
      return;
    }
    
    const operationId = `refresh-${analysisType}-${Date.now()}`;
    addActiveOperation(operationId);
    
    setGlobalLoadingStates(prev => ({ ...prev, [analysisType]: true }));
    
    const abortController = new AbortController();
    setAbortController(operationId, abortController);
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/stock/refresh-analysis`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ 
          symbol: query, 
          analysisType
        }),
        signal: abortController.signal
      });
      
      const data = await response.json();
      
      if (!response.ok || !data.success) {
        if (data.error === 'INSUFFICIENT_QUOTA') {
          message.warning('Insufficient tokens. Need 1 token.');
        } else {
          message.error(data.message || 'Refresh failed');
        }
        return;
      }
      
      message.success(`Refreshed! ${data.quota.deducted} token used.`);
      
      if (userQuota) {
        setUserQuota({ ...userQuota, available_quota: data.quota.remaining });
      }
      
      const fieldMap = {
        'income': 'incomeStatement',
        'balance': 'balanceSheet',
        'cashflow': 'cashFlow'
      };
      
      setGlobalAnalysisData(prev => ({
        ...prev,
        [fieldMap[analysisType]]: data.data
      }));
      
      setGlobalDeepAnalysisData(prev => ({
        ...prev,
        [analysisType]: null
      }));
      
    } catch (error) {
      if (error.name !== 'AbortError') {
        message.error('Refresh failed');
      }
    } finally {
      setGlobalLoadingStates(prev => ({ ...prev, [analysisType]: false }));
      removeActiveOperation(operationId);
    }
  };
  
  const handleDeepAnalysis = async (analysisType) => {
    if (!isAuthenticated) {
      message.warning('Please login first');
      return;
    }
    
    if (!query.trim()) {
      message.warning('Please select a stock symbol');
      return;
    }
    
    const operationId = `deep-${analysisType}-${Date.now()}`;
    addActiveOperation(operationId);
    
    const loadingKey = `deep${analysisType.charAt(0).toUpperCase() + analysisType.slice(1)}`;
    setGlobalLoadingStates(prev => ({ ...prev, [loadingKey]: true }));
    
    message.info('Deep analysis may take up to 10 minutes...');
    
    const abortController = new AbortController();
    setAbortController(operationId, abortController);
    
    const timeoutId = setTimeout(() => {
      abortController.abort();
      message.warning('Deep analysis timeout. Tokens will be refunded if charged.');
    }, 9.5 * 60 * 1000);
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/stock/deep-analysis`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ 
          symbol: query, 
          analysisType
        }),
        signal: abortController.signal
      });
      
      clearTimeout(timeoutId);
      
      const data = await response.json();
      
      if (!response.ok || !data.success) {
        if (data.error === 'INSUFFICIENT_QUOTA') {
          message.warning(`Need ${data.required} tokens. Balance: ${data.available}`);
        } else if (data.error === 'DEEP_ANALYSIS_TIMEOUT') {
          message.info(`Timeout. ${data.quota?.deducted || 2} tokens refunded.`);
        } else {
          message.error(data.message || 'Deep analysis failed');
        }
        return;
      }
      
      message.success(`Deep analysis completed! ${data.quota.deducted} tokens used.`);
      
      if (userQuota) {
        setUserQuota({ ...userQuota, available_quota: data.quota.remaining });
      }
      
      setGlobalDeepAnalysisData(prev => ({
        ...prev,
        [analysisType]: data.data
      }));
      
    } catch (error) {
      clearTimeout(timeoutId);
      if (error.name === 'AbortError') {
        message.info('Deep analysis cancelled or timed out');
      } else {
        message.error('Deep analysis failed');
      }
    } finally {
      setGlobalLoadingStates(prev => ({ ...prev, [loadingKey]: false }));
      removeActiveOperation(operationId);
    }
  };
  
  // Markdown parsing functions (same as before)
  const renderMobileFinancialData = (dataString, type, isDeepAnalysis = false) => {
    if (!dataString || dataString === 'No data available') {
      return <Empty description="No data available" />;
    }
    
    if (isDeepAnalysis) {
      return (
        <div>
          <Tag color="purple" style={{ marginBottom: '12px' }}>
            <ExperimentOutlined /> Deep Analysis Results
          </Tag>
          {renderDataContent(dataString)}
        </div>
      );
    }
    
    return renderDataContent(dataString);
  };
  
  const renderDataContent = (dataString) => {
    const sections = dataString.split('\n\n').filter(s => s.trim());
    
    return (
      <div style={{ padding: '8px' }}>
        {sections.map((section, sectionIdx) => {
          if (section.trim().startsWith('```') || section.includes('fiscalYear')) {
            return renderCodeBlock(section, sectionIdx);
          }
          
          if (section.includes('|') && section.split('\n').filter(line => line.includes('|')).length > 1) {
            return renderMobileTable(section, sectionIdx);
          }
          
          if (section.match(/^#{1,6}\s/)) {
            return renderMobileHeader(section, sectionIdx);
          }
          
          return renderMobileSection(section, sectionIdx);
        })}
      </div>
    );
  };
  
  const renderCodeBlock = (code, key) => {
    const cleanCode = code.replace(/```[\w]*\n?/g, '').replace(/\*\*/g, '');
    
    return (
      <Card key={key} size="small" style={{ marginBottom: '8px', background: '#f5f5f5' }}>
        <pre style={{
          margin: 0,
          fontSize: '11px',
          overflowX: 'auto',
          whiteSpace: 'pre-wrap',
          wordBreak: 'break-word'
        }}>
          {cleanCode}
        </pre>
      </Card>
    );
  };
  
  const renderMobileTable = (tableString, key) => {
    const lines = tableString.split('\n').filter(line => 
      line.trim() && !line.match(/^[|:\s-]+$/) && !line.match(/---+/)
    );
    
    const rows = lines.map(line => 
      line.split('|').map(cell => cell.trim()).filter(cell => cell)
    );
    
    if (rows.length === 0) return null;
    
    const headers = rows[0];
    const dataRows = rows.slice(1);
    
    return (
      <div key={key} style={{ marginBottom: '16px' }}>
        {dataRows.map((row, idx) => (
          <Card 
            key={idx} 
            size="small" 
            style={{ marginBottom: '8px' }}
            title={
              <div style={{ fontSize: '14px', fontWeight: 'bold' }}>
                {parseInlineMarkdown(row[0])}
              </div>
            }
          >
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              {row.slice(1).map((cell, cellIdx) => (
                <div key={cellIdx} style={{
                  padding: '4px 8px',
                  background: '#f5f5f5',
                  borderRadius: '4px',
                  fontSize: '12px'
                }}>
                  <div style={{ color: '#666', fontSize: '10px' }}>
                    {parseInlineMarkdown(headers[cellIdx + 1])}
                  </div>
                  <div style={{ fontWeight: 'bold' }}>
                    {formatCellValue(cell)}
                  </div>
                </div>
              ))}
            </div>
          </Card>
        ))}
      </div>
    );
  };
  
  const renderMobileHeader = (section, key) => {
    const lines = section.split('\n');
    const firstLine = lines[0];
    const level = (firstLine.match(/^#+/) || [''])[0].length;
    const headerText = firstLine.replace(/^#+\s*/, '').replace(/\*\*/g, '');
    
    return (
      <div key={key} style={{ marginBottom: '16px' }}>
        <div style={{
          background: level <= 2 ? '#003D6D' : '#005A9C',
          color: 'white',
          padding: level <= 2 ? '12px' : '8px',
          fontSize: level <= 2 ? '16px' : '14px',
          fontWeight: 'bold',
          borderRadius: '4px',
          marginBottom: '8px'
        }}>
          {parseInlineMarkdown(headerText)}
        </div>
        {lines.slice(1).length > 0 && (
          <Card size="small">
            {formatMarkdownLines(lines.slice(1))}
          </Card>
        )}
      </div>
    );
  };
  
  const renderMobileSection = (section, key) => {
    const lines = section.split('\n').filter(line => line.trim());
    
    return (
      <Card key={key} size="small" style={{ marginBottom: '8px' }}>
        {formatMarkdownLines(lines)}
      </Card>
    );
  };
  
  const formatMarkdownLines = (lines) => {
    return lines.map((line, idx) => {
      if (!line.trim() || line.match(/---+/)) return null;
      
      if (line.trim().startsWith('>')) {
        const cleanLine = line.replace(/^>\s*/, '');
        return (
          <div key={idx} style={{
            padding: '8px',
            background: '#f0f8ff',
            borderLeft: '3px solid #1890ff',
            marginBottom: '8px',
            fontSize: '12px',
            fontStyle: 'italic'
          }}>
            {parseInlineMarkdown(cleanLine)}
          </div>
        );
      }
      
      if (line.match(/^\*\*\d+\./)) {
        const match = line.match(/^\*\*(\d+)\.\s*([^*]*)\*\*(.*)$/);
        if (match) {
          return (
            <div key={idx} style={{
              background: '#003D6D',
              color: 'white',
              padding: '8px',
              marginBottom: '8px',
              borderRadius: '4px',
              fontSize: '14px',
              fontWeight: 'bold'
            }}>
              <span style={{
                background: 'rgba(255,255,255,0.2)',
                padding: '2px 6px',
                borderRadius: '3px',
                marginRight: '8px'
              }}>
                {match[1]}
              </span>
              {match[2]}
              {match[3] && parseInlineMarkdown(match[3])}
            </div>
          );
        }
      }
      
      if (line.match(/^\d+\.\s/) && !line.match(/^\*\*/)) {
        const match = line.match(/^(\d+)\.\s*(.*)$/);
        if (match) {
          return (
            <div key={idx} style={{
              paddingLeft: '20px',
              marginBottom: '4px',
              fontSize: '12px',
              position: 'relative'
            }}>
              <span style={{
                position: 'absolute',
                left: '0',
                fontWeight: 'bold',
                color: '#003D6D'
              }}>
                {match[1]}.
              </span>
              {parseInlineMarkdown(match[2])}
            </div>
          );
        }
      }
      
      if (line.match(/^[\*\-\+]\s/) || line.match(/^\s*[\*\-\+]\s/)) {
        const cleanLine = line.replace(/^[\s]*[\*\-\+]\s*/, '');
        return (
          <div key={idx} style={{
            paddingLeft: '16px',
            marginBottom: '4px',
            fontSize: '12px'
          }}>
            • {parseInlineMarkdown(cleanLine)}
          </div>
        );
      }
      
      if (line.includes(':') && !line.startsWith('>')) {
        const [key, ...valueParts] = line.split(':');
        const value = valueParts.join(':').trim();
        
        return (
          <div key={idx} style={{
            display: 'flex',
            justifyContent: 'space-between',
            padding: '4px 0',
            fontSize: '12px',
            borderBottom: '1px solid #f0f0f0'
          }}>
            <span style={{ color: '#666' }}>
              {parseInlineMarkdown(key)}
            </span>
            <span style={{ fontWeight: 'bold' }}>
              {formatCellValue(value)}
            </span>
          </div>
        );
      }
      
      return (
        <div key={idx} style={{ 
          marginBottom: '4px', 
          fontSize: '12px',
          lineHeight: '1.6'
        }}>
          {parseInlineMarkdown(line)}
        </div>
      );
    }).filter(Boolean);
  };
  
  const parseInlineMarkdown = (text) => {
    if (!text) return text;
    
    let result = text.replace(/\*\*([^*]+)\*\*/g, '<strong>$1</strong>');
    result = result.replace(/\*([^*]+)\*/g, '<em>$1</em>');
    result = result.replace(/`([^`]+)`/g, '<code style="background:#f0f0f0;padding:2px 4px;border-radius:3px;font-size:11px;">$1</code>');
    
    return <span dangerouslySetInnerHTML={{ __html: result }} />;
  };
  
  const formatCellValue = (value) => {
    if (!value) return value;
    
    const cleanValue = value.replace(/\*\*/g, '').trim();
    
    if (cleanValue.includes('%')) {
      const isNegative = cleanValue.includes('-');
      const isPositive = cleanValue.includes('+') || 
                        (!isNegative && parseFloat(cleanValue) > 0);
      
      return (
        <span style={{ 
          color: isNegative ? '#ff4d4f' : isPositive ? '#52c41a' : '#000'
        }}>
          {isPositive && <RiseOutlined style={{ fontSize: '10px', marginRight: '2px' }} />}
          {isNegative && <FallOutlined style={{ fontSize: '10px', marginRight: '2px' }} />}
          {cleanValue}
        </span>
      );
    }
    
    if (cleanValue.match(/\$?[\d,]+\.?\d*[BMK]/)) {
      return (
        <span style={{ color: '#1890ff', fontWeight: 'bold' }}>
          {cleanValue}
        </span>
      );
    }
    
    return cleanValue;
  };
  
  return (
    <div style={{ 
      minHeight: '100vh',
      background: '#f5f5f5',
      paddingBottom: '20px'
    }}>
      <div style={{ 
        background: '#003D6D',
        color: 'white',
        padding: '8px 12px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <span style={{ fontSize: '14px', fontWeight: 'bold' }}>
          Financial Statement AI Deep Analysis
        </span>
        {isAuthenticated && userQuota ? (
          <Badge 
            count={userQuota.available_quota} 
            overflowCount={999999} 
            showZero
            style={{ backgroundColor: '#52c41a' }}
          />
        ) : (
          <Button 
            size="small" 
            type="link" 
            style={{ color: 'white' }}
            onClick={() => {
              window.dispatchEvent(new CustomEvent('navigate-to-login', { 
                detail: { page: 'login' } 
              }));
            }}
          >
            Login
          </Button>
        )}
      </div>
      
      <div style={{ 
        background: 'white',
        padding: '12px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <Input
          size="large"
          placeholder="Enter stock symbol (e.g., AAPL)"
          prefix={<SearchOutlined />}
          value={query}
          onChange={(e) => handleQueryChange(e.target.value)}
          style={{ marginBottom: '12px' }}
        />
        
        <Button 
          type="primary"
          size="large"
          block
          onClick={handleFullAnalysis}
          loading={globalLoadingStates.full}
          icon={<BarChartOutlined />}
        >
          Analyze Stock ({quotaConfig?.ANALYSE_COST || 3} tokens)
        </Button>
      </div>
      
      {(globalAnalysisData.incomeStatement || 
        globalAnalysisData.balanceSheet || 
        globalAnalysisData.cashFlow) && (
        <div style={{ padding: '12px' }}>
          <Segmented
            block
            value={activeTab}
            onChange={setActiveTab}
            options={[
              { label: 'Income', value: 'income' },
              { label: 'Balance', value: 'balance' },
              { label: 'Cash Flow', value: 'cashflow' }
            ]}
            style={{ marginBottom: '12px' }}
          />
          
          <Space style={{ marginBottom: '12px', width: '100%' }}>
            <Button
              size="small"
              onClick={() => handleRefresh(activeTab)}
              loading={globalLoadingStates[activeTab]}
              icon={<ReloadOutlined />}
            >
              Refresh (1 token)
            </Button>
            <Button
              size="small"
              type="primary"
              style={{ background: '#8B008B' }}
              onClick={() => handleDeepAnalysis(activeTab)}
              loading={globalLoadingStates[`deep${activeTab.charAt(0).toUpperCase() + activeTab.slice(1)}`]}
              icon={<ExperimentOutlined />}
            >
              Deep Analysis (2 tokens)
            </Button>
          </Space>
          
          <div>
            {activeTab === 'income' && (
              globalDeepAnalysisData.income ? 
                renderMobileFinancialData(globalDeepAnalysisData.income, 'income', true) :
                renderMobileFinancialData(globalAnalysisData.incomeStatement, 'income')
            )}
            {activeTab === 'balance' && (
              globalDeepAnalysisData.balance ?
                renderMobileFinancialData(globalDeepAnalysisData.balance, 'balance', true) :
                renderMobileFinancialData(globalAnalysisData.balanceSheet, 'balance')
            )}
            {activeTab === 'cashflow' && (
              globalDeepAnalysisData.cashflow ?
                renderMobileFinancialData(globalDeepAnalysisData.cashflow, 'cashflow', true) :
                renderMobileFinancialData(globalAnalysisData.cashFlow, 'cashflow')
            )}
          </div>
        </div>
      )}
      
      {globalLoadingStates.full && (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <Spin size="large" />
          <div style={{ marginTop: '12px' }}>Analyzing...</div>
        </div>
      )}
      
     <Drawer
  title="Select Stock"
  placement="bottom"
  height="60%"
  onClose={() => setSearchDrawerVisible(false)}
  open={searchDrawerVisible}
  zIndex={1002}  // 添加更高的 z-index
  bodyStyle={{ padding: 0 }}  // 添加这行
>
  <List
    dataSource={searchResults}
    renderItem={item => (
      <List.Item
        onClick={() => {
          setQuery(item.symbol);
          setCurrentSymbol(item.symbol);
          setSearchDrawerVisible(false);
        }}
        style={{ 
          cursor: 'pointer',
          padding: '12px 16px'  // 增加触摸区域
        }}
      >
        <div style={{ 
          width: '100%',
          pointerEvents: 'auto'  // 确保可点击
        }}>
          <div style={{ 
            display: 'flex', 
            justifyContent: 'space-between',
            alignItems: 'center'
          }}>
            <div>
              <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                {item.symbol}
              </span>
              <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                {item.instrument_name}
              </div>
            </div>
            <Tag size="small">{item.country}</Tag>
          </div>
        </div>
      </List.Item>
    )}
  />
</Drawer>
    </div>
  );
}