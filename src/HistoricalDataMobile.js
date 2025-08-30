import React, { useState, useEffect, useRef } from 'react';
import { 
  Card, Input, Button, Tag, Badge, Space, Tabs, Empty, message, Modal, List, Drawer, Segmented, Spin
} from 'antd';
import { 
  SearchOutlined, BarChartOutlined, TrendingUpOutlined, DashboardOutlined,
  LoadingOutlined, DollarSignOutlined, AreaChartOutlined, ReloadOutlined,
  ClockOutlined, InfoCircleOutlined, LineChartOutlined, AlertOutlined,
  RiseOutlined, FallOutlined, FundOutlined, StockOutlined
} from '@ant-design/icons';
import { 
  LineChart, Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, ResponsiveContainer, Area, AreaChart, Bar, BarChart,
  ComposedChart, ReferenceLine, Cell
} from 'recharts';
import { useStockAnalysis } from './StockAnalysisContext';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

// Mobile optimized intervals
const INTERVALS = [
  { value: 'daily', label: 'Daily', description: 'Daily adjusted' },
  { value: 'weekly', label: 'Weekly', description: 'Weekly adjusted' },
  { value: 'monthly', label: 'Monthly', description: 'Monthly adjusted' }
];

// Utility functions
const formatNumber = (num) => {
  if (!num) return '0';
  if (num >= 1000000000) return (num / 1000000000).toFixed(2) + 'B';
  if (num >= 1000000) return (num / 1000000).toFixed(2) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(2) + 'K';
  return num.toLocaleString();
};

const showMessage = (type, content, duration = 4) => {
  if (type === 'error') {
    message.error(content, duration);
  } else if (type === 'success') {
    message.success(content, duration);
  } else if (type === 'warning') {
    message.warning(content, duration);
  } else {
    message.info(content, duration);
  }
};

const formatDate = (dateString, interval) => {
  const date = new Date(dateString);
  
  if (interval === 'daily') {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric'
    });
  } else if (interval === 'weekly') {
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric'
    });
  } else if (interval === 'monthly') {
    return date.toLocaleDateString('en-US', { 
      month: 'short',
      year: '2-digit'
    });
  }
  
  return dateString;
};

const formatDisplayDate = (dateString, interval) => {
  const date = new Date(dateString);
  
  if (interval === 'daily') {
    return date.toLocaleDateString('en-US', { 
      weekday: 'short',
      month: 'short', 
      day: 'numeric',
      year: date.getFullYear() !== new Date().getFullYear() ? 'numeric' : undefined
    });
  } else if (interval === 'weekly') {
    const endDate = new Date(date);
    endDate.setDate(date.getDate() + 6);
    return `${date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric'
    })} - ${endDate.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric'
    })}`;
  } else if (interval === 'monthly') {
    return date.toLocaleDateString('en-US', { 
      month: 'long',
      year: 'numeric'
    });
  }
  
  return dateString;
};

// Mobile optimized Price Chart
const MobilePriceChart = ({ data, interval }) => {
  if (!data || data.length === 0) return null;

  const maxVolume = Math.max(...data.map(d => d.volume || 0));
  const minPrice = Math.min(...data.map(d => Math.min(d.low, d.close)));
  const maxPrice = Math.max(...data.map(d => Math.max(d.high, d.close)));
  const priceRange = maxPrice - minPrice;
  const priceBuffer = priceRange * 0.1;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0]?.payload;
      return (
        <Card size="small" style={{ padding: '4px', fontSize: '11px' }}>
          <div style={{ fontWeight: 'bold', marginBottom: '4px' }}>{data?.fullDate || label}</div>
          <div>Close: ${data?.close?.toFixed(2)}</div>
          <div>Volume: {formatNumber(data?.volume)}</div>
          {data?.sma50 && <div>SMA50: ${data.sma50.toFixed(2)}</div>}
          {data?.sma200 && <div>SMA200: ${data.sma200.toFixed(2)}</div>}
        </Card>
      );
    }
    return null;
  };

  return (
    <Card size="small" title={
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <LineChartOutlined />
        <span>Price Chart ({interval})</span>
      </div>
    }>
      <ResponsiveContainer width="100%" height={250}>
        <ComposedChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 40 }}>
          <defs>
            <linearGradient id="volumeGradientMobile" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#93C5FD" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#93C5FD" stopOpacity={0.1}/>
            </linearGradient>
            <linearGradient id="areaGradientMobile" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#003D6D" stopOpacity={0.3}/>
              <stop offset="95%" stopColor="#003D6D" stopOpacity={0.05}/>
            </linearGradient>
          </defs>
          
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" strokeOpacity={0.5} />
          
          <XAxis 
            dataKey="displayDate" 
            tick={{ fontSize: 9 }}
            angle={-45}
            textAnchor="end"
            height={60}
            interval="preserveStartEnd"
          />
          
          <YAxis 
            yAxisId="price"
            orientation="left"
            tick={{ fontSize: 9 }}
            domain={[minPrice - priceBuffer, maxPrice + priceBuffer]}
            tickFormatter={(value) => `$${value.toFixed(0)}`}
          />
          
          <YAxis 
            yAxisId="volume"
            orientation="right"
            tick={{ fontSize: 9 }}
            domain={[0, maxVolume * 1.5]}
            tickFormatter={(value) => formatNumber(value)}
            hide
          />
          
          <Tooltip content={<CustomTooltip />} />
          
          <Bar 
            yAxisId="volume"
            dataKey="volume" 
            fill="url(#volumeGradientMobile)"
            opacity={0.3}
          />
          
          <Area
            yAxisId="price"
            type="monotone"
            dataKey="close"
            stroke="none"
            fill="url(#areaGradientMobile)"
            fillOpacity={0.3}
          />
          
          <Line 
            yAxisId="price"
            type="monotone" 
            dataKey="close" 
            stroke="#003D6D"
            strokeWidth={2}
            dot={false}
          />
          
          {data.some(d => d.sma50 !== null) && (
            <Line 
              yAxisId="price"
              type="monotone" 
              dataKey="sma50" 
              stroke="#EAB308"
              strokeWidth={1}
              strokeDasharray="5 5"
              dot={false}
              connectNulls={true}
            />
          )}
          
          {data.some(d => d.sma200 !== null) && (
            <Line 
              yAxisId="price"
              type="monotone" 
              dataKey="sma200" 
              stroke="#8B5CF6"
              strokeWidth={1}
              strokeDasharray="5 5"
              dot={false}
              connectNulls={true}
            />
          )}
        </ComposedChart>
      </ResponsiveContainer>
      
      <div style={{ marginTop: '8px', display: 'flex', gap: '12px', fontSize: '10px', justifyContent: 'center' }}>
        <span><span style={{ display: 'inline-block', width: '12px', height: '2px', background: '#EAB308', marginRight: '4px' }}></span>SMA 50</span>
        <span><span style={{ display: 'inline-block', width: '12px', height: '2px', background: '#8B5CF6', marginRight: '4px' }}></span>SMA 200</span>
      </div>
    </Card>
  );
};

// Mobile RSI Chart
const MobileRSIChart = ({ data }) => {
  if (!data || data.length === 0) return null;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0]?.payload;
      return (
        <Card size="small" style={{ padding: '4px', fontSize: '11px' }}>
          <div style={{ fontWeight: 'bold' }}>{data?.fullDate || label}</div>
          <div style={{ color: data?.rsi > 70 ? '#ff4d4f' : data?.rsi < 30 ? '#52c41a' : '#F97316' }}>
            RSI: {data?.rsi?.toFixed(2)}
          </div>
        </Card>
      );
    }
    return null;
  };

  return (
    <Card size="small" title={
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <DashboardOutlined />
        <span>RSI (14)</span>
      </div>
    } extra={
      <Space size="small">
        <Tag color="red" style={{ fontSize: '10px' }}>OB &gt;70</Tag>
        <Tag color="green" style={{ fontSize: '10px' }}>OS &lt;30</Tag>
      </Space>
    }>
      <ResponsiveContainer width="100%" height={150}>
        <AreaChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 40 }}>
          <defs>
            <linearGradient id="rsiGradientMobile" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#F97316" stopOpacity={0.8}/>
              <stop offset="95%" stopColor="#F97316" stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          
          <XAxis 
            dataKey="displayDate" 
            tick={{ fontSize: 9 }}
            angle={-45}
            textAnchor="end"
            height={60}
            interval="preserveStartEnd"
          />
          
          <YAxis 
            domain={[0, 100]}
            ticks={[0, 30, 70, 100]}
            tick={{ fontSize: 9 }}
          />
          
          <Tooltip content={<CustomTooltip />} />
          
          <ReferenceLine y={70} stroke="#ff4d4f" strokeDasharray="5 5" strokeWidth={1} opacity={0.5} />
          <ReferenceLine y={30} stroke="#52c41a" strokeDasharray="5 5" strokeWidth={1} opacity={0.5} />
          <ReferenceLine y={50} stroke="#9CA3AF" strokeDasharray="3 3" strokeWidth={0.5} opacity={0.3} />
          
          <Area
            type="monotone"
            dataKey="rsi"
            stroke="#F97316"
            strokeWidth={2}
            fill="url(#rsiGradientMobile)"
            dot={false}
          />
        </AreaChart>
      </ResponsiveContainer>
    </Card>
  );
};

// Mobile MACD Chart
const MobileMACDChart = ({ data }) => {
  if (!data || data.length === 0) return null;

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0]?.payload;
      return (
        <Card size="small" style={{ padding: '4px', fontSize: '11px' }}>
          <div style={{ fontWeight: 'bold' }}>{data?.fullDate || label}</div>
          <div>MACD: {data?.macd?.toFixed(4)}</div>
          <div>Signal: {data?.signal?.toFixed(4)}</div>
          <div style={{ color: data?.histogram >= 0 ? '#52c41a' : '#ff4d4f' }}>
            Histogram: {data?.histogram?.toFixed(4)}
          </div>
        </Card>
      );
    }
    return null;
  };

  return (
    <Card size="small" title={
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
        <BarChartOutlined />
        <span>MACD</span>
      </div>
    }>
      <ResponsiveContainer width="100%" height={150}>
        <ComposedChart data={data} margin={{ top: 5, right: 5, left: 5, bottom: 40 }}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          
          <XAxis 
            dataKey="displayDate" 
            tick={{ fontSize: 9 }}
            angle={-45}
            textAnchor="end"
            height={60}
            interval="preserveStartEnd"
          />
          
          <YAxis tick={{ fontSize: 9 }} />
          
          <Tooltip content={<CustomTooltip />} />
          
          <ReferenceLine y={0} stroke="#9CA3AF" strokeWidth={0.5} />
          
          <Bar dataKey="histogram" opacity={0.6}>
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.histogram >= 0 ? '#52c41a' : '#ff4d4f'} />
            ))}
          </Bar>
          
          <Line type="monotone" dataKey="macd" stroke="#003D6D" strokeWidth={1.5} dot={false} />
          <Line type="monotone" dataKey="signal" stroke="#ff4d4f" strokeWidth={1.5} strokeDasharray="5 5" dot={false} />
        </ComposedChart>
      </ResponsiveContainer>
    </Card>
  );
};

// Parse markdown for AI analysis - matching StockthirteenMobile style
const parseMarkdown = (text) => {
  if (!text) return null;
  
  const sections = text.split('\n\n').filter(s => s.trim());
  
  return (
    <div style={{ padding: '8px' }}>
      {sections.map((section, sectionIdx) => {
        // Code blocks
        if (section.trim().startsWith('```') || section.includes('fiscalYear')) {
          const cleanCode = section.replace(/```[\w]*\n?/g, '').replace(/\*\*/g, '');
          return (
            <Card key={sectionIdx} size="small" style={{ marginBottom: '8px', background: '#f5f5f5' }}>
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
        }
        
        // Tables
        if (section.includes('|') && section.split('\n').filter(line => line.includes('|')).length > 1) {
          const lines = section.split('\n').filter(line => 
            line.trim() && !line.match(/^[|:\s-]+$/) && !line.match(/---+/)
          );
          
          const rows = lines.map(line => 
            line.split('|').map(cell => cell.trim()).filter(cell => cell)
          );
          
          if (rows.length === 0) return null;
          
          const headers = rows[0];
          const dataRows = rows.slice(1);
          
          return (
            <div key={sectionIdx} style={{ marginBottom: '16px' }}>
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
        }
        
        // Headers
        if (section.match(/^#{1,6}\s/)) {
          const lines = section.split('\n');
          const firstLine = lines[0];
          const level = (firstLine.match(/^#+/) || [''])[0].length;
          const headerText = firstLine.replace(/^#+\s*/, '').replace(/\*\*/g, '');
          
          return (
            <div key={sectionIdx} style={{ marginBottom: '16px' }}>
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
        }
        
        // Regular paragraphs
        const lines = section.split('\n').filter(line => line.trim());
        return (
          <Card key={sectionIdx} size="small" style={{ marginBottom: '8px' }}>
            {formatMarkdownLines(lines)}
          </Card>
        );
      })}
    </div>
  );
};

const formatMarkdownLines = (lines) => {
  return lines.map((line, idx) => {
    if (!line.trim() || line.match(/---+/)) return null;
    
    // Blockquotes
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
    
    // Bold numbered items
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
    
    // Regular numbered items
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
    
    // Bullet points
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
    
    // Key-value pairs
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
    
    // Regular lines
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
  
  // Percentage values
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
  
  // Currency values
  if (cleanValue.match(/\$?[\d,]+\.?\d*[BMK]/)) {
    return (
      <span style={{ color: '#1890ff', fontWeight: 'bold' }}>
        {cleanValue}
      </span>
    );
  }
  
  return cleanValue;
};

export default function HistoricalDataMobile() {
  const {
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
    
    addActiveOperation,
    removeActiveOperation,
    setAbortController,
    getAbortController,
    cancelOperation,
    cancelAllOperations,
    hasActiveOperations,
    getActiveOperationsCount,
    
    updateAnalysisResult,
    updateChartData,
    clearAnalysisResult,
    
    saveToStorage,
    loadFromStorage,
    checkOngoingAnalysis,
    markAnalysisOngoing,
    clearOngoingAnalysis
  } = useStockAnalysis();
  
  const [symbol, setSymbol] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showDropdown, setShowDropdown] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const [selectedInterval, setSelectedInterval] = useState('daily');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userQuota, setUserQuota] = useState(null);
  const [quotaConfig, setQuotaConfig] = useState(null);
  const [searchDrawerVisible, setSearchDrawerVisible] = useState(false);
  const [activeTab, setActiveTab] = useState('1');
  
  const searchTimeoutRef = useRef(null);

  // Initialize component with global state
  useEffect(() => {
    if (currentSymbol) {
      setSymbol(currentSymbol);
      setSearchQuery(currentSymbol);
    }
    if (currentInterval) {
      setSelectedInterval(currentInterval);
    }
    if (currentSearchQuery) {
      setSearchQuery(currentSearchQuery);
    }
    
    const storedData = loadFromStorage();
    if (storedData && storedData.analysisData) {
      updateAnalysisResult(storedData.analysisData);
      updateChartData(storedData.chartData || { price: [], rsi: [], macd: [] });
      if (storedData.symbol) {
        setSymbol(storedData.symbol);
        setSearchQuery(storedData.symbol);
        setCurrentSymbol(storedData.symbol);
      }
      if (storedData.interval) {
        setSelectedInterval(storedData.interval);
        setCurrentInterval(storedData.interval);
      }
    }
    
    const ongoingAnalysis = checkOngoingAnalysis();
    if (ongoingAnalysis) {
      console.log('[HistoricalDataMobile] Found ongoing analysis:', ongoingAnalysis);
      setGlobalLoadingState(true);
    }
    
    checkAuth();
    fetchQuotaConfig();
  }, []);

  // Save to storage when data changes
  useEffect(() => {
    if (globalAnalysisData && Object.keys(globalAnalysisData).length > 0) {
      saveToStorage();
    }
  }, [globalAnalysisData, globalChartData, currentSymbol, currentInterval, saveToStorage]);

  // Update global state when local state changes
  useEffect(() => {
    if (symbol !== currentSymbol) {
      setCurrentSymbol(symbol);
    }
  }, [symbol, currentSymbol, setCurrentSymbol]);

  useEffect(() => {
    if (selectedInterval !== currentInterval) {
      setCurrentInterval(selectedInterval);
    }
  }, [selectedInterval, currentInterval, setCurrentInterval]);

  useEffect(() => {
    if (searchQuery !== currentSearchQuery) {
      setCurrentSearchQuery(searchQuery);
    }
  }, [searchQuery, currentSearchQuery, setCurrentSearchQuery]);

  const checkAuth = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/auth/me`, {
        credentials: 'include'
      });
      
      if (response.ok) {
        const data = await response.json();
        setIsAuthenticated(true);
        setUserQuota(data.quota);
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.error('Auth check failed:', error);
      setIsAuthenticated(false);
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

  const searchSymbols = async (query) => {
    if (!query || query.length < 2) {
      setSearchResults([]);
      setSearchDrawerVisible(false);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/stock/search-alphavantage?query=${encodeURIComponent(query)}`,
        { credentials: 'include' }
      );
      
      const data = await response.json();
      
      if (data.success && data.bestMatches) {
        setSearchResults(data.bestMatches);
        setSearchDrawerVisible(data.bestMatches.length > 0);
      }
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsSearching(false);
    }
  };

  const handleSearchChange = (value) => {
    setSearchQuery(value);
    
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }
    
    searchTimeoutRef.current = setTimeout(() => {
      searchSymbols(value);
    }, 800);
  };

  const selectSymbol = (match) => {
    setSymbol(match['1. symbol']);
    setSearchQuery(match['1. symbol'] + ' - ' + match['2. name']);
    setSearchDrawerVisible(false);
    setError('');
    setSuccess('');
  };

  const processChartData = (analysis) => {
    if (!analysis || !analysis.timeSeries) return;

    const timeSeriesEntries = Object.entries(analysis.timeSeries).slice(0, 50).reverse();
    const dataLength = timeSeriesEntries.length;
    
    const currentInterval = analysis.overview?.interval || selectedInterval || 'daily';
    
    const priceData = timeSeriesEntries.map(([date, data], index) => {
      const open = parseFloat(data.open) || 0;
      const high = parseFloat(data.high) || 0;
      const low = parseFloat(data.low) || 0;
      const close = parseFloat(data.close) || 0;
      const volume = parseInt(data.volume) || 0;
      
      let sma50Value = null;
      let sma200Value = null;
      
      if (analysis.technicalIndicators?.sma) {
        if (analysis.technicalIndicators.sma.sma50 && analysis.technicalIndicators.sma.sma50[date]) {
          sma50Value = parseFloat(analysis.technicalIndicators.sma.sma50[date]);
        }
        if (analysis.technicalIndicators.sma.sma200 && analysis.technicalIndicators.sma.sma200[date]) {
          sma200Value = parseFloat(analysis.technicalIndicators.sma.sma200[date]);
        }
      }
      
      let bollingerUpper = null;
      let bollingerMiddle = null;
      let bollingerLower = null;
      
      if (analysis.technicalIndicators?.bollingerBands && analysis.technicalIndicators.bollingerBands[date]) {
        const bbData = analysis.technicalIndicators.bollingerBands[date];
        bollingerUpper = parseFloat(bbData.upper);
        bollingerMiddle = parseFloat(bbData.middle);
        bollingerLower = parseFloat(bbData.lower);
      }
      
      const xAxisLabel = formatDate(date, currentInterval);
      const tooltipDate = formatDisplayDate(date, currentInterval);
      
      return {
        date: date,
        originalDate: date,
        displayDate: xAxisLabel,
        fullDate: tooltipDate,
        open: open,
        high: high,
        low: low,
        close: close,
        volume: volume,
        sma50: sma50Value,
        sma200: sma200Value,
        bollingerUpper: bollingerUpper,
        bollingerMiddle: bollingerMiddle,
        bollingerLower: bollingerLower
      };
    });

    const labelCounts = {};
    priceData.forEach((item, index) => {
      const label = item.displayDate;
      if (labelCounts[label]) {
        labelCounts[label]++;
        item.displayDate = `${label}\u200B${labelCounts[label]}`;
      } else {
        labelCounts[label] = 1;
      }
    });

    const rsiData = priceData.map((priceItem, index) => {
      const date = priceItem.originalDate;
      let rsiValue = 50;
      
      if (analysis.technicalIndicators?.rsi && analysis.technicalIndicators.rsi[date]) {
        rsiValue = parseFloat(analysis.technicalIndicators.rsi[date]);
      } else if (analysis.technical?.rsi && index === 0) {
        rsiValue = parseFloat(analysis.technical.rsi);
      }
      
      return {
        date: date,
        originalDate: date,
        displayDate: priceItem.displayDate,
        fullDate: priceItem.fullDate,
        rsi: Math.max(0, Math.min(100, rsiValue))
      };
    });

    const macdData = priceData.map((priceItem, index) => {
      const date = priceItem.originalDate;
      
      if (analysis.technicalIndicators?.macd && analysis.technicalIndicators.macd[date]) {
        const macdPoint = analysis.technicalIndicators.macd[date];
        return {
          date: date,
          originalDate: date,
          displayDate: priceItem.displayDate,
          fullDate: priceItem.fullDate,
          macd: parseFloat(macdPoint.macd || 0),
          signal: parseFloat(macdPoint.signal || 0),
          histogram: parseFloat(macdPoint.histogram || 0)
        };
      }
        
      return {
        date: date,
        originalDate: date,
        displayDate: priceItem.displayDate,
        fullDate: priceItem.fullDate,
        macd: 0,
        signal: 0,
        histogram: 0
      };
    });

    const newChartData = {
      price: priceData,
      rsi: rsiData,
      macd: macdData
    };

    updateChartData(newChartData);
  };

  const analyzeStock = async () => {
    setError('');
    setSuccess('');
    
    if (!symbol) {
      setError('Please select a stock symbol first');
      showMessage('error', 'Please select a stock symbol first');
      return;
    }
    
    if (!isAuthenticated) {
      setError('Please login to use the analysis feature');
      showMessage('warning', 'Please login to use the analysis feature');
      return;
    }
    
    if (userQuota && userQuota.available_quota < (quotaConfig?.STOCK_TECH_ANALYSE_COST || 2)) {
      setError(`Insufficient tokens. You need ${quotaConfig?.STOCK_TECH_ANALYSE_COST || 2} tokens.`);
      showMessage('error', `Insufficient tokens. You need ${quotaConfig?.STOCK_TECH_ANALYSE_COST || 2} tokens.`);
      return;
    }
    
    if (hasActiveOperations()) {
      console.log('[HistoricalDataMobile] Cancelling existing operations before starting new analysis');
      const cancelledCount = cancelAllOperations();
      showMessage('info', `Previous operations cancelled (${cancelledCount}). Starting new analysis...`);
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    const operationId = `historical-mobile-analysis-${Date.now()}`;
    
    markAnalysisOngoing(symbol, selectedInterval);
    addActiveOperation(operationId);
    
    setGlobalLoadingState(true);
    clearAnalysisResult();
    setGlobalError(null);
    
    const abortController = new AbortController();
    setAbortController(operationId, abortController);
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/stock/comprehensive-analysis`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ symbol, interval: selectedInterval }),
        signal: abortController.signal
      });
      
      const data = await response.json();
      
      if (!response.ok || !data.success) {
        if (data.error === 'INSUFFICIENT_QUOTA') {
          const errorMsg = `You need ${data.required} tokens. Your balance: ${data.available} tokens.`;
          setError(errorMsg);
          showMessage('error', errorMsg);
          
          setTimeout(() => {
            window.dispatchEvent(new CustomEvent('navigate-to-payment', { detail: { page: 'payment2' } }));
          }, 1000);
        } else {
          setError(data.message || 'Analysis failed');
          showMessage('error', data.message || 'Analysis failed');
        }
        setGlobalLoadingState(false);
        removeActiveOperation(operationId);
        clearOngoingAnalysis();
        return;
      }
      
      updateAnalysisResult(data.analysis);
      processChartData(data.analysis);
      setSuccess(`Analysis completed! ${data.quota.deducted} tokens used.`);
      showMessage('success', `Analysis completed! ${data.quota.deducted} tokens used.`);
      
      if (data.quota) {
        setUserQuota(prev => ({ ...prev, available_quota: data.quota.remaining }));
      }
      
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('[HistoricalDataMobile] Analysis was aborted');
        showMessage('info', 'Analysis was cancelled');
      } else {
        console.error('[HistoricalDataMobile] Analysis error:', error);
        const errorMsg = `Network error: ${error.message}. Please try again.`;
        setError(errorMsg);
        showMessage('error', errorMsg);
      }
    } finally {
      setGlobalLoadingState(false);
      removeActiveOperation(operationId);
      clearOngoingAnalysis();
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchDrawerVisible && !event.target.closest('.ant-drawer')) {
        setSearchDrawerVisible(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [searchDrawerVisible]);

  const tabItems = [
    {
      key: '1',
      label: 'Price',
      children: <MobilePriceChart data={globalChartData.price} interval={selectedInterval} />
    },
    {
      key: '2',
      label: 'RSI',
      children: <MobileRSIChart data={globalChartData.rsi} />
    },
    {
      key: '3',
      label: 'MACD',
      children: <MobileMACDChart data={globalChartData.macd} />
    },
    {
      key: '4',
      label: 'AI Analysis',
      children: globalAnalysisData?.aiAnalysis ? (
        <Card size="small" title={
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <FundOutlined />
            <span>AI Analysis</span>
          </div>
        }>
          {parseMarkdown(globalAnalysisData.aiAnalysis)}
        </Card>
      ) : <Empty description="No analysis available" />
    }
  ];

  return (
    <div style={{ background: '#f5f5f5', minHeight: '100vh', paddingBottom: '20px' }}>
      {/* Header */}
      <div style={{ 
        background: '#003D6D',
        color: 'white',
        padding: '8px 12px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center'
      }}>
        <span style={{ fontSize: '14px', fontWeight: 'bold' }}>
          Historical Data Analysis
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
      
      {/* Search and Controls */}
      <div style={{ 
        background: 'white',
        padding: '12px',
        boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
      }}>
        <Input
          size="large"
          placeholder="Search stock symbol (e.g., AAPL)"
          prefix={<SearchOutlined />}
          suffix={isSearching && <LoadingOutlined />}
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          style={{ marginBottom: '12px' }}
        />
        
        {/* Interval Selection */}
        <Segmented
          block
          value={selectedInterval}
          onChange={(value) => {
            setSelectedInterval(value);
            setCurrentInterval(value);
          }}
          options={INTERVALS.map(interval => ({
            label: interval.label,
            value: interval.value
          }))}
          style={{ marginBottom: '12px' }}
        />
        
        <Button 
          type="primary"
          size="large"
          block
          onClick={analyzeStock}
          loading={globalLoadingState}
          icon={<AreaChartOutlined />}
          disabled={!symbol}
          style={{ background: '#003D6D' }}
        >
          Analyze ({quotaConfig?.STOCK_TECH_ANALYSE_COST || 2} tokens)
        </Button>
        
        {/* Status Messages */}
        {globalError && (
          <div style={{
            marginTop: '8px',
            padding: '8px',
            background: '#fff2f0',
            border: '1px solid #ffccc7',
            borderRadius: '4px',
            fontSize: '12px',
            color: '#ff4d4f'
          }}>
            <AlertOutlined /> {globalError}
          </div>
        )}
        
        {error && (
          <div style={{
            marginTop: '8px',
            padding: '8px',
            background: '#fff2f0',
            border: '1px solid #ffccc7',
            borderRadius: '4px',
            fontSize: '12px',
            color: '#ff4d4f'
          }}>
            <AlertOutlined /> {error}
          </div>
        )}
        
        {success && (
          <div style={{
            marginTop: '8px',
            padding: '8px',
            background: '#f6ffed',
            border: '1px solid #b7eb8f',
            borderRadius: '4px',
            fontSize: '12px',
            color: '#52c41a'
          }}>
            <InfoCircleOutlined /> {success}
          </div>
        )}
        
        {hasActiveOperations() && (
          <div style={{
            marginTop: '8px',
            padding: '8px',
            background: '#e6f7ff',
            border: '1px solid #91d5ff',
            borderRadius: '4px',
            fontSize: '12px',
            color: '#1890ff'
          }}>
            <LoadingOutlined /> Analysis running ({getActiveOperationsCount()} operation{getActiveOperationsCount() > 1 ? 's' : ''})
          </div>
        )}
      </div>
      
      {/* Results Section */}
      {globalAnalysisData && globalChartData.price.length > 0 && (
        <div style={{ padding: '12px' }}>
          {/* Overview Cards */}
          <div style={{ marginBottom: '12px' }}>
            {globalAnalysisData.overview && (
              <Card size="small" style={{ marginBottom: '8px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '18px', fontWeight: 'bold' }}>
                      {symbol}
                    </div>
                    <div style={{ fontSize: '12px', color: '#666' }}>
                      ${globalAnalysisData.overview.price}
                    </div>
                  </div>
                  <Tag color={globalAnalysisData.overview.changePercent > 0 ? 'green' : 'red'}>
                    {globalAnalysisData.overview.changePercent > 0 ? <RiseOutlined /> : <FallOutlined />}
                    {globalAnalysisData.overview.changePercent}%
                  </Tag>
                </div>
                <div style={{ marginTop: '8px', fontSize: '11px', color: '#666' }}>
                  Volume: {formatNumber(globalAnalysisData.overview.volume)}
                </div>
              </Card>
            )}
            
            {globalAnalysisData.technical && (
              <Card size="small" style={{ marginBottom: '8px' }}>
                <div style={{ fontSize: '12px', fontWeight: 'bold', marginBottom: '8px' }}>
                  Technical Indicators
                </div>
                <Space wrap size="small">
                  <Tag color={
                    globalAnalysisData.technical.rsi > 70 ? 'red' : 
                    globalAnalysisData.technical.rsi < 30 ? 'green' : 'blue'
                  }>
                    RSI: {globalAnalysisData.technical.rsi}
                  </Tag>
                  <Tag color="orange">SMA50: ${globalAnalysisData.technical.sma50}</Tag>
                  <Tag color="purple">SMA200: ${globalAnalysisData.technical.sma200}</Tag>
                  {globalAnalysisData.technical.macd && (
                    <Tag color={
                      globalAnalysisData.technical.macd.crossover === 'Bullish Crossover' ? 'green' : 
                      globalAnalysisData.technical.macd.crossover === 'Bearish Crossover' ? 'red' : 'default'
                    }>
                      {globalAnalysisData.technical.macd.crossover}
                    </Tag>
                  )}
                  {globalAnalysisData.technical.bollingerBands && (
                    <Tag color="cyan">{globalAnalysisData.technical.bollingerBands.position}</Tag>
                  )}
                </Space>
              </Card>
            )}
            
            {globalAnalysisData.sentiment && (
              <Card size="small" style={{ marginBottom: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontSize: '12px', color: '#666' }}>Market Sentiment</div>
                    <div style={{ fontSize: '16px', fontWeight: 'bold', color: 
                      globalAnalysisData.sentiment.overall === 'Bullish' ? '#52c41a' :
                      globalAnalysisData.sentiment.overall === 'Bearish' ? '#ff4d4f' : '#faad14'
                    }}>
                      {globalAnalysisData.sentiment.overall}
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '11px', color: '#666' }}>Score</div>
                    <div style={{ fontSize: '14px', fontWeight: 'bold' }}>{globalAnalysisData.sentiment.score}</div>
                    <div style={{ fontSize: '10px', color: '#999' }}>{globalAnalysisData.sentiment.newsCount} news</div>
                  </div>
                </div>
              </Card>
            )}
          </div>
          
          {/* Charts Tabs with Charts Included */}
          <Tabs 
            activeKey={activeTab} 
            onChange={setActiveTab}
            items={[
              {
                key: '1',
                label: 'Price',
                children: <MobilePriceChart data={globalChartData.price} interval={selectedInterval} />
              },
              {
                key: '2',
                label: 'RSI',
                children: <MobileRSIChart data={globalChartData.rsi} />
              },
              {
                key: '3',
                label: 'MACD',
                children: <MobileMACDChart data={globalChartData.macd} />
              },
              {
                key: '4',
                label: 'AI Analysis',
                children: globalAnalysisData?.aiAnalysis ? (
                  <Card size="small" title={
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                      <FundOutlined />
                      <span>AI Analysis</span>
                    </div>
                  }>
                    {parseMarkdown(globalAnalysisData.aiAnalysis)}
                  </Card>
                ) : <Empty description="No analysis available" />
              }
            ]}
          />
        </div>
      )}
      
      {/* Loading State */}
      {globalLoadingState && (
        <div style={{ textAlign: 'center', padding: '40px' }}>
          <LoadingOutlined style={{ fontSize: '32px', color: '#003D6D' }} />
          <div style={{ marginTop: '12px', color: '#666' }}>
            Analyzing {symbol || currentSymbol}...
          </div>
          <div style={{ fontSize: '10px', color: '#999', marginTop: '4px' }}>
            This continues in the background
          </div>
        </div>
      )}
      
      {/* Search Results Drawer */}
      <Drawer
        title="Select Stock"
        placement="bottom"
        height="60%"
        onClose={() => setSearchDrawerVisible(false)}
        open={searchDrawerVisible}
        zIndex={1002}
        bodyStyle={{ padding: 0 }}
      >
        <List
          dataSource={searchResults}
          renderItem={item => (
            <List.Item
              onClick={() => selectSymbol(item)}
              style={{ 
                cursor: 'pointer',
                padding: '12px 16px'
              }}
            >
              <div style={{ 
                width: '100%',
                pointerEvents: 'auto'
              }}>
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}>
                  <div>
                    <span style={{ fontWeight: 'bold', fontSize: '16px' }}>
                      {item['1. symbol']}
                    </span>
                    <div style={{ fontSize: '12px', color: '#666', marginTop: '4px' }}>
                      {item['2. name']}
                    </div>
                  </div>
                  <Tag size="small">{item['3. type']}</Tag>
                </div>
              </div>
            </List.Item>
          )}
        />
      </Drawer>
    </div>
  );
}