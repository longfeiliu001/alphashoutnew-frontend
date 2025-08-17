import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, TrendingUp, TrendingDown, Activity, Brain, 
  AlertCircle, DollarSign, BarChart3, Info, 
  Clock, ChevronDown, Eye, Zap, LineChart,
  PieChart, Users, Newspaper, Hash, Calendar,
  ArrowUp, ArrowDown, Loader2, CheckCircle, XCircle,
  CandlestickChart, Gauge, Target, RefreshCw, Maximize2
} from 'lucide-react';
import { 
  LineChart as RechartsLineChart, 
  Line, XAxis, YAxis, CartesianGrid, 
  Tooltip, Legend, ResponsiveContainer, 
  Area, AreaChart, Bar, BarChart, 
  ComposedChart, ReferenceLine,
  Dot, Cell
} from 'recharts';
import { useStockAnalysis } from './StockAnalysisContext';

// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

// AlphaShout Inspired Design System
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
    border: '#E5E7EB',
    borderLight: '#F3F4F6',
    textPrimary: '#111827',
    textSecondary: '#6B7280',
    textTertiary: '#9CA3AF',
    chartGreen: '#10B981',
    chartRed: '#EF4444',
    chartBlue: '#3B82F6',
    chartPurple: '#8B5CF6',
    chartOrange: '#F59E0B',
    dividend: '#8B5CF6',
    volume: '#93C5FD',
    bollinger: '#FF6B6B',
    macd: '#4ECDC4',
    rsi: '#F97316',
    sma50: '#EAB308',
    sma200: '#8B5CF6'
  },
  fonts: {
    primary: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
    mono: 'ui-monospace, SFMono-Regular, "SF Mono", Consolas, monospace'
  },
  shadows: {
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1)'
  },
  borderRadius: {
    sm: '4px',
    md: '6px',
    lg: '8px'
  },
  spacing: {
    sm: '8px',
    md: '16px',
    lg: '24px'
  }
};

// Available intervals
const INTERVALS = [
  { value: 'daily', label: 'Daily', description: 'Daily adjusted', category: 'historical' },
  { value: 'weekly', label: 'Weekly', description: 'Weekly adjusted', category: 'historical' },
  { value: 'monthly', label: 'Monthly', description: 'Monthly adjusted', category: 'historical' }
];

// Utility functions
const formatNumber = (num) => {
  if (!num) return '0';
  if (num >= 1000000000) return (num / 1000000000).toFixed(2) + 'B';
  if (num >= 1000000) return (num / 1000000).toFixed(2) + 'M';
  if (num >= 1000) return (num / 1000).toFixed(2) + 'K';
  return num.toLocaleString();
};

// Custom message function
const showMessage = (type, content, duration = 4) => {
  // Simple alert for now - can be enhanced with a proper notification system
  console.log(`${type.toUpperCase()}: ${content}`);
  if (type === 'error' || type === 'warning') {
    alert(content);
  }
};

// 修复的日期格式化函数
const formatDate = (dateString, interval, index, dataLength) => {
  const date = new Date(dateString);
  
  if (interval === 'daily') {
    const day = date.getDate();
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    return `${month} ${day}`;
  } 
  else if (interval === 'weekly') {
    const day = date.getDate();
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    return `${month} ${day}`;
  } 
  else if (interval === 'monthly') {
    const month = date.toLocaleDateString('en-US', { month: 'short' });
    const year = date.getFullYear().toString().substr(-2);
    return `${month} '${year}`;
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
  } 
  else if (interval === 'weekly') {
    const endDate = new Date(date);
    endDate.setDate(date.getDate() + 6);
    
    if (date.getMonth() === endDate.getMonth()) {
      return `${date.toLocaleDateString('en-US', { 
        month: 'short'
      })} ${date.getDate()}-${endDate.getDate()}, ${date.getFullYear()}`;
    } else {
      return `${date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric'
      })} - ${endDate.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric'
      })}, ${date.getFullYear()}`;
    }
  } 
  else if (interval === 'monthly') {
    const currentYear = new Date().getFullYear();
    if (date.getFullYear() === currentYear) {
      return date.toLocaleDateString('en-US', { 
        month: 'long'
      });
    } else {
      return date.toLocaleDateString('en-US', { 
        month: 'short',
        year: 'numeric'
      });
    }
  }
  
  return dateString;
};

const parseMarkdown = (text) => {
  if (!text) return null;
  
  let processedText = text;
  processedText = processedText.replace(/^### (.*$)/gim, '<h3 class="markdown-h3">$1</h3>');
  processedText = processedText.replace(/^## (.*$)/gim, '<h2 class="markdown-h2">$1</h2>');
  processedText = processedText.replace(/^# (.*$)/gim, '<h1 class="markdown-h1">$1</h1>');
  processedText = processedText.replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>');
  processedText = processedText.replace(/\*(.+?)\*/g, '<em>$1</em>');
  processedText = processedText.replace(/^\* (.+)$/gim, '<li>$1</li>');
  processedText = processedText.replace(/(<li>.*<\/li>)/s, '<ul>$1</ul>');
  processedText = processedText.replace(/\n\n/g, '</p><p>');
  processedText = '<p>' + processedText + '</p>';
  
  return <div dangerouslySetInnerHTML={{ __html: processedText }} />;
};

// 修复的 PriceChart 组件
const PriceChart = ({ data, interval }) => {
  if (!data || data.length === 0) return null;

  const PriceChartTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0]?.payload;
      const displayDate = data?.fullDate || data?.originalDate || label;
      const hasPrice = data?.close !== undefined;
      
      return (
        <div style={{
          background: 'rgba(17, 24, 39, 0.95)',
          color: 'white',
          padding: '12px 16px',
          borderRadius: '6px',
          fontSize: '12px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          minWidth: '180px',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
          zIndex: 9999
        }}>
          <p style={{ 
            margin: '0 0 10px 0', 
            fontWeight: '600', 
            borderBottom: '1px solid rgba(255,255,255,0.2)', 
            paddingBottom: '6px',
            fontSize: '13px'
          }}>
            📅 {displayDate}
          </p>
          
          {hasPrice && (
            <>
              <div style={{ display: 'grid', gap: '4px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'rgba(255,255,255,0.7)' }}>Open:</span>
                  <span style={{ fontWeight: '500' }}>${data.open?.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'rgba(255,255,255,0.7)' }}>High:</span>
                  <span style={{ fontWeight: '500', color: '#10B981' }}>${data.high?.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'rgba(255,255,255,0.7)' }}>Low:</span>
                  <span style={{ fontWeight: '500', color: '#EF4444' }}>${data.low?.toFixed(2)}</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span style={{ color: 'rgba(255,255,255,0.7)' }}>Close:</span>
                  <span style={{ fontWeight: '600', color: '#00B4E5' }}>${data.close?.toFixed(2)}</span>
                </div>
              </div>
              
              {data.volume !== undefined && (
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between',
                  marginTop: '8px',
                  paddingTop: '8px',
                  borderTop: '1px solid rgba(255,255,255,0.1)'
                }}>
                  <span style={{ color: 'rgba(255,255,255,0.7)' }}>Volume:</span>
                  <span style={{ fontWeight: '500' }}>{formatNumber(data.volume)}</span>
                </div>
              )}
              
              {(data.sma50 !== null || data.sma200 !== null) && (
                <div style={{ 
                  marginTop: '8px',
                  paddingTop: '8px',
                  borderTop: '1px solid rgba(255,255,255,0.1)'
                }}>
                  {data.sma50 !== null && (
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                      <span style={{ color: 'rgba(255,255,255,0.7)' }}>SMA 50:</span>
                      <span style={{ fontWeight: '500', color: AlphaShoutTheme.colors.sma50 }}>
                        ${data.sma50.toFixed(2)}
                      </span>
                    </div>
                  )}
                  {data.sma200 !== null && (
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                      <span style={{ color: 'rgba(255,255,255,0.7)' }}>SMA 200:</span>
                      <span style={{ fontWeight: '500', color: AlphaShoutTheme.colors.sma200 }}>
                        ${data.sma200.toFixed(2)}
                      </span>
                    </div>
                  )}
                </div>
              )}
              
              {data.open && data.close && (
                <div style={{ 
                  marginTop: '8px',
                  paddingTop: '8px',
                  borderTop: '1px solid rgba(255,255,255,0.1)',
                  display: 'flex',
                  justifyContent: 'space-between'
                }}>
                  <span style={{ color: 'rgba(255,255,255,0.7)' }}>Change:</span>
                  <span style={{ 
                    fontWeight: '600',
                    color: data.close >= data.open ? '#10B981' : '#EF4444'
                  }}>
                    {data.close >= data.open ? '▲' : '▼'} {Math.abs(((data.close - data.open) / data.open * 100)).toFixed(2)}%
                  </span>
                </div>
              )}
            </>
          )}
        </div>
      );
    }
    return null;
  };

  const maxVolume = Math.max(...data.map(d => d.volume || 0));
  const minPrice = Math.min(...data.map(d => Math.min(d.low, d.close)));
  const maxPrice = Math.max(...data.map(d => Math.max(d.high, d.close)));
  const priceRange = maxPrice - minPrice;
  const priceBuffer = priceRange * 0.1;

  return (
    <div style={{
      background: 'white',
      border: `1px solid ${AlphaShoutTheme.colors.border}`,
      borderRadius: '8px',
      padding: '20px',
      marginBottom: '20px',
      position: 'relative'
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px'
      }}>
        <h3 style={{ 
          margin: 0, 
          fontSize: '16px', 
          fontWeight: '500',
          color: AlphaShoutTheme.colors.textPrimary,
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <CandlestickChart size={18} color={AlphaShoutTheme.colors.primary} />
          Price Chart ({interval})
        </h3>
        <div style={{ display: 'flex', gap: '8px' }}>
          <span style={{ 
            fontSize: '12px', 
            padding: '4px 8px',
            background: AlphaShoutTheme.colors.surfaceSecondary,
            borderRadius: '4px',
            color: AlphaShoutTheme.colors.textSecondary
          }}>
            H: ${maxPrice.toFixed(2)}
          </span>
          <span style={{ 
            fontSize: '12px', 
            padding: '4px 8px',
            background: AlphaShoutTheme.colors.surfaceSecondary,
            borderRadius: '4px',
            color: AlphaShoutTheme.colors.textSecondary
          }}>
            L: ${minPrice.toFixed(2)}
          </span>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height={400}>
        <ComposedChart 
          data={data} 
          margin={{ top: 10, right: 30, left: 0, bottom: 40 }}
        >
          <defs>
            <linearGradient id="volumeGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={AlphaShoutTheme.colors.volume} stopOpacity={0.8}/>
              <stop offset="95%" stopColor={AlphaShoutTheme.colors.volume} stopOpacity={0.1}/>
            </linearGradient>
            <linearGradient id="areaGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={AlphaShoutTheme.colors.primary} stopOpacity={0.3}/>
              <stop offset="95%" stopColor={AlphaShoutTheme.colors.primary} stopOpacity={0.05}/>
            </linearGradient>
            <linearGradient id="bollingerGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={AlphaShoutTheme.colors.bollinger} stopOpacity={0.2}/>
              <stop offset="95%" stopColor={AlphaShoutTheme.colors.bollinger} stopOpacity={0.05}/>
            </linearGradient>
          </defs>
          
          <CartesianGrid 
            strokeDasharray="3 3" 
            stroke={AlphaShoutTheme.colors.borderLight} 
            strokeOpacity={0.5}
          />
          
          <XAxis 
            dataKey="displayDate" 
            tick={{ fontSize: 11, fill: AlphaShoutTheme.colors.textSecondary }}
            angle={-45}
            textAnchor="end"
            height={60}
            interval={0}
            minTickGap={5}
          />
          
          <YAxis 
            yAxisId="price"
            orientation="left"
            tick={{ fontSize: 11, fill: AlphaShoutTheme.colors.textSecondary }}
            domain={[minPrice - priceBuffer, maxPrice + priceBuffer]}
            tickFormatter={(value) => `$${value.toFixed(0)}`}
          />
          
          <YAxis 
            yAxisId="volume"
            orientation="right"
            tick={{ fontSize: 11, fill: AlphaShoutTheme.colors.textTertiary }}
            domain={[0, maxVolume * 1.5]}
            tickFormatter={(value) => formatNumber(value)}
          />
          
          <Tooltip 
            content={<PriceChartTooltip />}
            cursor={{ 
              stroke: 'rgba(0, 0, 0, 0.1)', 
              strokeWidth: 1, 
              strokeDasharray: '5 5' 
            }}
            wrapperStyle={{ zIndex: 1000 }}
          />
          
          <Legend 
            wrapperStyle={{
              paddingTop: '20px',
              fontSize: '12px'
            }}
          />
          
          <Bar 
            yAxisId="volume"
            dataKey="volume" 
            fill="url(#volumeGradient)"
            opacity={0.3}
            name="Volume"
          />
          
          {data.some(d => d.bollingerUpper !== null) && (
            <Area
              yAxisId="price"
              type="monotone"
              dataKey="bollingerUpper"
              stroke="none"
              fill="url(#bollingerGradient)"
              fillOpacity={0.2}
              connectNulls={true}
            />
          )}
          
          {data.some(d => d.bollingerUpper !== null) && (
            <Line 
              yAxisId="price"
              type="monotone" 
              dataKey="bollingerUpper" 
              stroke={AlphaShoutTheme.colors.bollinger}
              strokeWidth={1}
              strokeDasharray="3 3"
              dot={false}
              name="BB Upper"
              connectNulls={true}
            />
          )}
          
          {data.some(d => d.bollingerMiddle !== null) && (
            <Line 
              yAxisId="price"
              type="monotone" 
              dataKey="bollingerMiddle" 
              stroke={AlphaShoutTheme.colors.bollinger}
              strokeWidth={1.5}
              dot={false}
              name="BB Middle"
              connectNulls={true}
              opacity={0.7}
            />
          )}
          
          {data.some(d => d.bollingerLower !== null) && (
            <Line 
              yAxisId="price"
              type="monotone" 
              dataKey="bollingerLower" 
              stroke={AlphaShoutTheme.colors.bollinger}
              strokeWidth={1}
              strokeDasharray="3 3"
              dot={false}
              name="BB Lower"
              connectNulls={true}
            />
          )}
          
          <Area
            yAxisId="price"
            type="monotone"
            dataKey="close"
            stroke="none"
            fill="url(#areaGradient)"
            fillOpacity={0.3}
          />
          
          <Line 
            yAxisId="price"
            type="monotone" 
            dataKey="high" 
            stroke={AlphaShoutTheme.colors.chartGreen}
            strokeWidth={0.5}
            strokeDasharray="2 2"
            dot={false}
            opacity={0.5}
            name="High"
          />
          
          <Line 
            yAxisId="price"
            type="monotone" 
            dataKey="low" 
            stroke={AlphaShoutTheme.colors.chartRed}
            strokeWidth={0.5}
            strokeDasharray="2 2"
            dot={false}
            opacity={0.5}
            name="Low"
          />
          
          <Line 
            yAxisId="price"
            type="monotone" 
            dataKey="close" 
            stroke={AlphaShoutTheme.colors.primary}
            strokeWidth={2}
            dot={false}
            name="Close"
            activeDot={{ r: 6, fill: AlphaShoutTheme.colors.primary }}
          />
          
          {data.some(d => d.sma50 !== null) && (
            <Line 
              yAxisId="price"
              type="monotone" 
              dataKey="sma50" 
              stroke={AlphaShoutTheme.colors.sma50}
              strokeWidth={1.5}
              strokeDasharray="5 5"
              dot={false}
              name="SMA 50"
              connectNulls={true}
            />
          )}
          
          {data.some(d => d.sma200 !== null) && (
            <Line 
              yAxisId="price"
              type="monotone" 
              dataKey="sma200" 
              stroke={AlphaShoutTheme.colors.sma200}
              strokeWidth={1.5}
              strokeDasharray="5 5"
              dot={false}
              name="SMA 200"
              connectNulls={true}
            />
          )}
        </ComposedChart>
      </ResponsiveContainer>
      
      <div style={{
        marginTop: '12px',
        display: 'flex',
        gap: '20px',
        justifyContent: 'center',
        fontSize: '12px',
        flexWrap: 'wrap'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ 
            width: '20px', 
            height: '2px', 
            background: AlphaShoutTheme.colors.sma50,
            borderRadius: '1px'
          }} />
          <span style={{ color: AlphaShoutTheme.colors.textSecondary }}>SMA 50</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ 
            width: '20px', 
            height: '2px', 
            background: AlphaShoutTheme.colors.sma200,
            borderRadius: '1px'
          }} />
          <span style={{ color: AlphaShoutTheme.colors.textSecondary }}>SMA 200</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <div style={{ 
            width: '20px', 
            height: '2px', 
            background: AlphaShoutTheme.colors.bollinger,
            borderRadius: '1px',
            border: '1px dashed ' + AlphaShoutTheme.colors.bollinger
          }} />
          <span style={{ color: AlphaShoutTheme.colors.textSecondary }}>Bollinger Bands</span>
        </div>
      </div>
    </div>
  );
};

// 修复的 RSI Chart 组件
const RSIChart = ({ data, interval }) => {
  if (!data || data.length === 0) return null;

  const RSITooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0]?.payload;
      const displayDate = data?.fullDate || data?.originalDate || label;
      
      return (
        <div style={{
          background: 'rgba(17, 24, 39, 0.95)',
          color: 'white',
          padding: '12px 16px',
          borderRadius: '6px',
          fontSize: '12px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          minWidth: '180px',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
          zIndex: 9999
        }}>
          <p style={{ 
            margin: '0 0 10px 0', 
            fontWeight: '600', 
            borderBottom: '1px solid rgba(255,255,255,0.2)', 
            paddingBottom: '6px',
            fontSize: '13px'
          }}>
            📅 {displayDate}
          </p>
          
          {data?.rsi !== undefined && (
            <div style={{ 
              display: 'flex', 
              justifyContent: 'space-between'
            }}>
              <span style={{ color: 'rgba(255,255,255,0.7)' }}>RSI:</span>
              <span style={{ 
                fontWeight: '600',
                color: data.rsi > 70 ? '#EF4444' : data.rsi < 30 ? '#10B981' : '#F97316'
              }}>
                {data.rsi.toFixed(2)}
                {data.rsi > 70 ? ' (Overbought)' : data.rsi < 30 ? ' (Oversold)' : ''}
              </span>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{
      background: 'white',
      border: `1px solid ${AlphaShoutTheme.colors.border}`,
      borderRadius: '8px',
      padding: '20px',
      marginBottom: '20px'
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px'
      }}>
        <h3 style={{ 
          margin: 0, 
          fontSize: '16px', 
          fontWeight: '500',
          color: AlphaShoutTheme.colors.textPrimary,
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <Activity size={18} color={AlphaShoutTheme.colors.rsi} />
          RSI (14) - Relative Strength Index
        </h3>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span style={{ 
            fontSize: '11px', 
            padding: '2px 6px',
            background: `${AlphaShoutTheme.colors.error}20`,
            color: AlphaShoutTheme.colors.error,
            borderRadius: '4px'
          }}>
            Overbought &gt; 70
          </span>
          <span style={{ 
            fontSize: '11px', 
            padding: '2px 6px',
            background: `${AlphaShoutTheme.colors.success}20`,
            color: AlphaShoutTheme.colors.success,
            borderRadius: '4px'
          }}>
            Oversold &lt; 30
          </span>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height={200}>
        <AreaChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 40 }}>
          <defs>
            <linearGradient id="rsiGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor={AlphaShoutTheme.colors.rsi} stopOpacity={0.8}/>
              <stop offset="95%" stopColor={AlphaShoutTheme.colors.rsi} stopOpacity={0.1}/>
            </linearGradient>
          </defs>
          
          <CartesianGrid strokeDasharray="3 3" stroke={AlphaShoutTheme.colors.borderLight} />
          
          <XAxis 
            dataKey="displayDate" 
            tick={{ fontSize: 11, fill: AlphaShoutTheme.colors.textSecondary }}
            angle={-45}
            textAnchor="end"
            height={60}
            interval={0}
            minTickGap={5}
          />
          
          <YAxis 
            domain={[0, 100]}
            ticks={[0, 30, 50, 70, 100]}
            tick={{ fontSize: 11, fill: AlphaShoutTheme.colors.textSecondary }}
          />
          
          <Tooltip 
            content={<RSITooltip />}
            cursor={{ stroke: 'rgba(0, 0, 0, 0.1)', strokeWidth: 1, strokeDasharray: '3 3' }}
            position={{ y: 0 }}
            wrapperStyle={{ zIndex: 1000 }}
          />
          
          <ReferenceLine 
            y={70} 
            stroke={AlphaShoutTheme.colors.error} 
            strokeDasharray="5 5" 
            strokeWidth={1}
            opacity={0.5}
          />
          
          <ReferenceLine 
            y={30} 
            stroke={AlphaShoutTheme.colors.success} 
            strokeDasharray="5 5" 
            strokeWidth={1}
            opacity={0.5}
          />
          
          <ReferenceLine 
            y={50} 
            stroke={AlphaShoutTheme.colors.textTertiary} 
            strokeDasharray="3 3" 
            strokeWidth={0.5}
            opacity={0.3}
          />
          
          <Area
            type="monotone"
            dataKey="rsi"
            stroke={AlphaShoutTheme.colors.rsi}
            strokeWidth={2}
            fill="url(#rsiGradient)"
            dot={false}
            name="RSI"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

// 修复的 MACD Chart 组件
const MACDChart = ({ data, interval }) => {
  if (!data || data.length === 0) return null;

  const MACDTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const data = payload[0]?.payload;
      const displayDate = data?.fullDate || data?.originalDate || label;
      
      return (
        <div style={{
          background: 'rgba(17, 24, 39, 0.95)',
          color: 'white',
          padding: '12px 16px',
          borderRadius: '6px',
          fontSize: '12px',
          border: '1px solid rgba(255, 255, 255, 0.1)',
          minWidth: '180px',
          boxShadow: '0 10px 40px rgba(0, 0, 0, 0.3)',
          zIndex: 9999
        }}>
          <p style={{ 
            margin: '0 0 10px 0', 
            fontWeight: '600', 
            borderBottom: '1px solid rgba(255,255,255,0.2)', 
            paddingBottom: '6px',
            fontSize: '13px'
          }}>
            📅 {displayDate}
          </p>
          
          {data?.macd !== undefined && (
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ color: 'rgba(255,255,255,0.7)' }}>MACD:</span>
                <span style={{ fontWeight: '500' }}>{data.macd.toFixed(4)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '4px' }}>
                <span style={{ color: 'rgba(255,255,255,0.7)' }}>Signal:</span>
                <span style={{ fontWeight: '500' }}>{data.signal.toFixed(4)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: 'rgba(255,255,255,0.7)' }}>Histogram:</span>
                <span style={{ 
                  fontWeight: '600',
                  color: data.histogram >= 0 ? '#6ABF4B' : '#E31E24'
                }}>
                  {data.histogram.toFixed(4)}
                </span>
              </div>
            </div>
          )}
        </div>
      );
    }
    return null;
  };

  return (
    <div style={{
      background: 'white',
      border: `1px solid ${AlphaShoutTheme.colors.border}`,
      borderRadius: '8px',
      padding: '20px',
      marginBottom: '20px'
    }}>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px'
      }}>
        <h3 style={{ 
          margin: 0, 
          fontSize: '16px', 
          fontWeight: '500',
          color: AlphaShoutTheme.colors.textPrimary,
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <BarChart3 size={18} color={AlphaShoutTheme.colors.macd} />
          MACD - Moving Average Convergence Divergence
        </h3>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          <span style={{ 
            fontSize: '11px', 
            padding: '2px 6px',
            background: `${AlphaShoutTheme.colors.primary}20`,
            color: AlphaShoutTheme.colors.primary,
            borderRadius: '4px'
          }}>
            MACD Line
          </span>
          <span style={{ 
            fontSize: '11px', 
            padding: '2px 6px',
            background: `${AlphaShoutTheme.colors.error}20`,
            color: AlphaShoutTheme.colors.error,
            borderRadius: '4px'
          }}>
            Signal Line
          </span>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height={200}>
        <ComposedChart data={data} margin={{ top: 10, right: 30, left: 0, bottom: 40 }}>
          <CartesianGrid strokeDasharray="3 3" stroke={AlphaShoutTheme.colors.borderLight} />
          
          <XAxis 
            dataKey="displayDate" 
            tick={{ fontSize: 11, fill: AlphaShoutTheme.colors.textSecondary }}
            angle={-45}
            textAnchor="end"
            height={60}
            interval={0}
            minTickGap={5}
          />
          
          <YAxis 
            tick={{ fontSize: 11, fill: AlphaShoutTheme.colors.textSecondary }}
          />
          
          <Tooltip 
            content={<MACDTooltip />}
            cursor={{ stroke: 'rgba(0, 0, 0, 0.1)', strokeWidth: 1, strokeDasharray: '3 3' }}
            wrapperStyle={{ zIndex: 1000 }}
          />
          
          <Legend />
          
          <ReferenceLine y={0} stroke={AlphaShoutTheme.colors.textTertiary} strokeWidth={0.5} />
          
          <Bar 
            dataKey="histogram" 
            fill={AlphaShoutTheme.colors.macd}
            opacity={0.6}
            name="Histogram"
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.histogram >= 0 ? AlphaShoutTheme.colors.success : AlphaShoutTheme.colors.error} />
            ))}
          </Bar>
          
          <Line 
            type="monotone" 
            dataKey="macd" 
            stroke={AlphaShoutTheme.colors.primary} 
            strokeWidth={2}
            dot={false}
            name="MACD"
          />
          
          <Line 
            type="monotone" 
            dataKey="signal" 
            stroke={AlphaShoutTheme.colors.error} 
            strokeWidth={2}
            strokeDasharray="5 5"
            dot={false}
            name="Signal"
          />
        </ComposedChart>
      </ResponsiveContainer>
    </div>
  );
};

// Main Component
export default function EnhancedStockAnalysis() {
  // Use global context for state management
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
    
    // Operation management
    addActiveOperation,
    removeActiveOperation,
    setAbortController,
    getAbortController,
    cancelOperation,
    cancelAllOperations,
    hasActiveOperations,
    getActiveOperationsCount,
    
    // Data management
    updateAnalysisResult,
    updateChartData,
    clearAnalysisResult,
    
    // Storage management
    saveToStorage,
    loadFromStorage,
    checkOngoingAnalysis,
    markAnalysisOngoing,
    clearOngoingAnalysis
  } = useStockAnalysis();
  
  // Local state for UI-specific things
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
  
  const dropdownRef = useRef(null);
  const searchTimeoutRef = useRef(null);

  // Initialize component with global state
  useEffect(() => {
    // Sync local state with global state
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
    
    // Try to load from storage
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
    
    // Check for ongoing analysis
    const ongoingAnalysis = checkOngoingAnalysis();
    if (ongoingAnalysis) {
      console.log('[StockAnalysis] Found ongoing analysis:', ongoingAnalysis);
      setGlobalLoadingState(true);
      // Optionally resume or notify user
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
      setShowDropdown(false);
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
        setShowDropdown(data.bestMatches.length > 0);
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
    setShowDropdown(false);
    setError('');
    setSuccess('');
  };

  // 修复的数据处理函数
  const processChartData = (analysis) => {
    if (!analysis || !analysis.timeSeries) return;

    const timeSeriesEntries = Object.entries(analysis.timeSeries).slice(0, 50).reverse();
    const dataLength = timeSeriesEntries.length;
    
    const currentInterval = analysis.overview?.interval || selectedInterval || 'daily';
    
    console.log(`📄 Processing chart data for interval: ${currentInterval}`);
    
    // Process price data
    const priceData = timeSeriesEntries.map(([date, data], index) => {
      const open = parseFloat(data.open) || 0;
      const high = parseFloat(data.high) || 0;
      const low = parseFloat(data.low) || 0;
      const close = parseFloat(data.close) || 0;
      const volume = parseInt(data.volume) || 0;
      
      // Get SMA values for this specific date
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
      
      // Get Bollinger Bands
      let bollingerUpper = null;
      let bollingerMiddle = null;
      let bollingerLower = null;
      
      if (analysis.technicalIndicators?.bollingerBands && analysis.technicalIndicators.bollingerBands[date]) {
        const bbData = analysis.technicalIndicators.bollingerBands[date];
        bollingerUpper = parseFloat(bbData.upper);
        bollingerMiddle = parseFloat(bbData.middle);
        bollingerLower = parseFloat(bbData.lower);
      }
      
      // 关键修复：为X轴和悬窗创建正确的日期标签
      const xAxisLabel = formatDate(date, currentInterval, index, dataLength);
      const tooltipDate = formatDisplayDate(date, currentInterval);
      
      return {
        // 原始数据
        date: date,
        originalDate: date,
        
        // X轴显示 - 这是关键，必须是唯一的
        displayDate: xAxisLabel,
        
        // 悬窗显示用
        fullDate: tooltipDate,
        
        // 价格数据
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

    // 为了避免重复的 X 轴标签，添加索引
    const labelCounts = {};
    priceData.forEach((item, index) => {
      const label = item.displayDate;
      if (labelCounts[label]) {
        labelCounts[label]++;
        // 对于重复的标签，添加一个不可见的唯一标识
        item.displayDate = `${label}\u200B${labelCounts[label]}`; // 使用零宽空格
      } else {
        labelCounts[label] = 1;
      }
    });

    // Process RSI data - 使用相同的逻辑
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

    // Process MACD data - 使用相同的逻辑
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

    // 调试输出
    console.log('📊 Chart Data Processing Summary:');
    console.log(`- Interval: ${currentInterval}`);
    console.log(`- Total data points: ${priceData.length}`);
    
    // 检查前3个数据点的日期处理
    console.log('📅 Date Processing Verification:');
    priceData.slice(0, 3).forEach((item, idx) => {
      console.log(`  [${idx}] Original: "${item.originalDate}" | Axis: "${item.displayDate}" | Tooltip: "${item.fullDate}"`);
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
    
    // Cancel any existing operations
    if (hasActiveOperations()) {
      console.log('[StockAnalysis] Cancelling existing operations before starting new analysis');
      const cancelledCount = cancelAllOperations();
      showMessage('info', `Previous operations cancelled (${cancelledCount}). Starting new analysis...`);
      await new Promise(resolve => setTimeout(resolve, 100));
    }

    // Generate unique operation ID
    const operationId = `historical-analysis-${Date.now()}`;
    
    // Mark analysis as ongoing
    markAnalysisOngoing(symbol, selectedInterval);
    
    // Add to active operations
    addActiveOperation(operationId);
    
    setGlobalLoadingState(true);
    clearAnalysisResult();
    setGlobalError(null);
    
    // Create abort controller
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
          
          // Navigate to payment
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
        console.log('[StockAnalysis] Analysis was aborted');
        showMessage('info', 'Analysis was cancelled');
      } else {
        console.error('[StockAnalysis] Analysis error:', error);
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
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div style={{ 
      minHeight: '100vh',
      background: AlphaShoutTheme.colors.surfaceSecondary,
      fontFamily: AlphaShoutTheme.fonts.primary,
      color: AlphaShoutTheme.colors.textPrimary
    }}>
      {/* Header */}
      <div style={{
        background: AlphaShoutTheme.colors.primary,
        color: 'white',
        padding: '24px 0',
        boxShadow: AlphaShoutTheme.shadows.md
      }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              background: 'rgba(255, 255, 255, 0.1)',
              borderRadius: AlphaShoutTheme.borderRadius.md,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}>
              <CandlestickChart size={28} color="white" />
            </div>
            <div>
              <h1 style={{ 
                margin: 0, 
                fontSize: '24px', 
                fontWeight: '400',
                letterSpacing: '-0.5px'
              }}>
                Historical Data Analysis
              </h1>
              <p style={{ 
                margin: '4px 0 0', 
                opacity: 0.8, 
                fontSize: '14px',
                fontWeight: '300'
              }}>
                Professional Technical Analysis & Market Intelligence
              </p>
            </div>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '24px' }}>
        {/* Search and Controls */}
        <div style={{
          background: AlphaShoutTheme.colors.surface,
          borderRadius: AlphaShoutTheme.borderRadius.lg,
          padding: AlphaShoutTheme.spacing.lg,
          marginBottom: AlphaShoutTheme.spacing.lg,
          boxShadow: AlphaShoutTheme.shadows.sm,
          border: `1px solid ${AlphaShoutTheme.colors.borderLight}`
        }}>
          <div style={{
            marginBottom: AlphaShoutTheme.spacing.lg,
            paddingBottom: AlphaShoutTheme.spacing.md,
            borderBottom: `1px solid ${AlphaShoutTheme.colors.borderLight}`
          }}>
            <h2 style={{
              margin: 0,
              fontSize: '18px',
              fontWeight: '400',
              color: AlphaShoutTheme.colors.primary
            }}>
              Analysis Configuration
            </h2>
          </div>

          <div ref={dropdownRef} style={{ position: 'relative', marginBottom: AlphaShoutTheme.spacing.lg }}>
            <label style={{ 
              display: 'block', 
              marginBottom: AlphaShoutTheme.spacing.sm, 
              fontSize: '13px',
              fontWeight: '500',
              color: AlphaShoutTheme.colors.textSecondary,
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Stock Symbol
            </label>
            
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                placeholder="Search for symbol (e.g., AAPL, MSFT)"
                value={searchQuery}
                onChange={(e) => handleSearchChange(e.target.value)}
                style={{
                  width: '100%',
                  padding: '12px 12px 12px 40px',
                  border: `1px solid ${AlphaShoutTheme.colors.border}`,
                  borderRadius: AlphaShoutTheme.borderRadius.md,
                  fontSize: '14px',
                  outline: 'none',
                  transition: 'all 0.2s',
                  background: AlphaShoutTheme.colors.surface
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = AlphaShoutTheme.colors.secondary;
                  e.target.style.boxShadow = `0 0 0 3px ${AlphaShoutTheme.colors.secondary}20`;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = AlphaShoutTheme.colors.border;
                  e.target.style.boxShadow = 'none';
                }}
              />
              <Search 
                size={18} 
                style={{ 
                  position: 'absolute', 
                  left: '12px', 
                  top: '50%', 
                  transform: 'translateY(-50%)',
                  color: AlphaShoutTheme.colors.textTertiary 
                }} 
              />
              {isSearching && (
                <Loader2 
                  size={18} 
                  className="animate-spin"
                  style={{ 
                    position: 'absolute', 
                    right: '12px', 
                    top: '50%', 
                    transform: 'translateY(-50%)',
                    color: AlphaShoutTheme.colors.secondary 
                  }} 
                />
              )}
            </div>

            {showDropdown && searchResults.length > 0 && (
              <div style={{
                position: 'absolute',
                top: '100%',
                left: 0,
                right: 0,
                marginTop: '4px',
                background: AlphaShoutTheme.colors.surface,
                border: `1px solid ${AlphaShoutTheme.colors.border}`,
                borderRadius: AlphaShoutTheme.borderRadius.md,
                boxShadow: AlphaShoutTheme.shadows.lg,
                maxHeight: '300px',
                overflowY: 'auto',
                zIndex: 1000
              }}>
                {searchResults.map((match, index) => (
                  <div
                    key={index}
                    onClick={() => selectSymbol(match)}
                    style={{
                      padding: '12px 16px',
                      cursor: 'pointer',
                      borderBottom: index < searchResults.length - 1 ? `1px solid ${AlphaShoutTheme.colors.borderLight}` : 'none',
                      transition: 'background 0.15s'
                    }}
                    onMouseEnter={(e) => e.currentTarget.style.background = AlphaShoutTheme.colors.surfaceSecondary}
                    onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <span style={{ 
                          fontWeight: '500', 
                          marginRight: '8px',
                          color: AlphaShoutTheme.colors.primary 
                        }}>
                          {match['1. symbol']}
                        </span>
                        <span style={{ 
                          color: AlphaShoutTheme.colors.textSecondary, 
                          fontSize: '13px' 
                        }}>
                          {match['2. name']}
                        </span>
                      </div>
                      <span style={{ 
                        fontSize: '11px', 
                        color: AlphaShoutTheme.colors.textTertiary,
                        background: AlphaShoutTheme.colors.surfaceSecondary,
                        padding: '2px 8px',
                        borderRadius: AlphaShoutTheme.borderRadius.sm,
                        fontWeight: '500'
                      }}>
                        {match['3. type']}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Interval Selection */}
          <div style={{ marginBottom: AlphaShoutTheme.spacing.lg }}>
            <label style={{ 
              display: 'block', 
              marginBottom: AlphaShoutTheme.spacing.md, 
              fontSize: '13px',
              fontWeight: '500',
              color: AlphaShoutTheme.colors.textSecondary,
              textTransform: 'uppercase',
              letterSpacing: '0.5px'
            }}>
              Time Interval
            </label>
            
            <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {INTERVALS.map((interval) => (
                <button
                  key={interval.value}
                  onClick={() => setSelectedInterval(interval.value)}
                  style={{
                    padding: '8px 16px',
                    background: selectedInterval === interval.value ? 
                      AlphaShoutTheme.colors.primary : 
                      AlphaShoutTheme.colors.surface,
                    color: selectedInterval === interval.value ? 
                      'white' : 
                      AlphaShoutTheme.colors.textSecondary,
                    border: `1px solid ${selectedInterval === interval.value ? 
                      AlphaShoutTheme.colors.primary : 
                      AlphaShoutTheme.colors.border}`,
                    borderRadius: AlphaShoutTheme.borderRadius.md,
                    fontSize: '13px',
                    fontWeight: '400',
                    cursor: 'pointer',
                    transition: 'all 0.15s',
                    minWidth: '80px'
                  }}
                  onMouseEnter={(e) => {
                    if (selectedInterval !== interval.value) {
                      e.currentTarget.style.borderColor = AlphaShoutTheme.colors.secondary;
                      e.currentTarget.style.background = AlphaShoutTheme.colors.surfaceSecondary;
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (selectedInterval !== interval.value) {
                      e.currentTarget.style.borderColor = AlphaShoutTheme.colors.border;
                      e.currentTarget.style.background = AlphaShoutTheme.colors.surface;
                    }
                  }}
                >
                  <div>{interval.label}</div>
                  <div style={{ 
                    fontSize: '10px', 
                    opacity: 0.7,
                    marginTop: '2px'
                  }}>
                    {interval.description}
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Analyze Button */}
          <button
            onClick={analyzeStock}
            disabled={globalLoadingState || !symbol}
            style={{
              marginTop: AlphaShoutTheme.spacing.md,
              padding: '12px 32px',
              background: globalLoadingState || !symbol ? 
                AlphaShoutTheme.colors.textTertiary : 
                AlphaShoutTheme.colors.primary,
              color: 'white',
              border: 'none',
              borderRadius: AlphaShoutTheme.borderRadius.md,
              fontSize: '14px',
              fontWeight: '500',
              cursor: globalLoadingState || !symbol ? 'not-allowed' : 'pointer',
              display: 'inline-flex',
              alignItems: 'center',
              gap: '8px',
              transition: 'all 0.2s',
              boxShadow: globalLoadingState || !symbol ? 'none' : AlphaShoutTheme.shadows.sm
            }}
            onMouseEnter={(e) => {
              if (!globalLoadingState && symbol) {
                e.currentTarget.style.background = AlphaShoutTheme.colors.primaryDark;
                e.currentTarget.style.transform = 'translateY(-1px)';
                e.currentTarget.style.boxShadow = AlphaShoutTheme.shadows.md;
              }
            }}
            onMouseLeave={(e) => {
              if (!globalLoadingState && symbol) {
                e.currentTarget.style.background = AlphaShoutTheme.colors.primary;
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = AlphaShoutTheme.shadows.sm;
              }
            }}
          >
            {globalLoadingState ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Processing Analysis...
              </>
            ) : (
              <>
                <Brain size={16} />
                Analyze ({quotaConfig?.STOCK_TECH_ANALYSE_COST || 2} tokens)
              </>
            )}
          </button>

          {/* Status Messages */}
          {globalError && (
            <div style={{
              marginTop: AlphaShoutTheme.spacing.md,
              padding: '12px 16px',
              background: `${AlphaShoutTheme.colors.error}10`,
              border: `1px solid ${AlphaShoutTheme.colors.error}`,
              borderRadius: AlphaShoutTheme.borderRadius.md,
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <XCircle size={16} color={AlphaShoutTheme.colors.error} />
              <span>{globalError}</span>
            </div>
          )}

          {error && (
            <div style={{
              marginTop: AlphaShoutTheme.spacing.md,
              padding: '12px 16px',
              background: `${AlphaShoutTheme.colors.error}10`,
              border: `1px solid ${AlphaShoutTheme.colors.error}`,
              borderRadius: AlphaShoutTheme.borderRadius.md,
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <XCircle size={16} color={AlphaShoutTheme.colors.error} />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div style={{
              marginTop: AlphaShoutTheme.spacing.md,
              padding: '12px 16px',
              background: `${AlphaShoutTheme.colors.success}10`,
              border: `1px solid ${AlphaShoutTheme.colors.success}`,
              borderRadius: AlphaShoutTheme.borderRadius.md,
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <CheckCircle size={16} color={AlphaShoutTheme.colors.success} />
              <span>{success}</span>
            </div>
          )}

          {/* Background Operation Indicator */}
          {hasActiveOperations() && (
            <div style={{
              marginTop: AlphaShoutTheme.spacing.md,
              padding: '12px 16px',
              background: `${AlphaShoutTheme.colors.accent}10`,
              border: `1px solid ${AlphaShoutTheme.colors.accent}`,
              borderRadius: AlphaShoutTheme.borderRadius.md,
              fontSize: '13px',
              display: 'flex',
              alignItems: 'center',
              gap: '8px'
            }}>
              <Loader2 size={16} className="animate-spin" color={AlphaShoutTheme.colors.accent} />
              <span>
                Analysis running in background ({getActiveOperationsCount()} operation{getActiveOperationsCount() > 1 ? 's' : ''})
              </span>
            </div>
          )}
        </div>

        {/* Charts Section */}
        {globalAnalysisData && globalChartData.price.length > 0 && (
          <div>
            <PriceChart data={globalChartData.price} interval={selectedInterval} />
            <RSIChart data={globalChartData.rsi} interval={selectedInterval} />
            <MACDChart data={globalChartData.macd} interval={selectedInterval} />
            
            {/* Analysis Summary Cards */}
            <div style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', 
              gap: '20px',
              marginBottom: '24px'
            }}>
              {/* Overview Card */}
              <div style={{
                background: 'white',
                borderRadius: '8px',
                padding: '20px',
                boxShadow: AlphaShoutTheme.shadows.sm
              }}>
                <h3 style={{ 
                  margin: '0 0 16px 0', 
                  fontSize: '16px', 
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <Eye size={18} color={AlphaShoutTheme.colors.primary} />
                  Market Overview
                </h3>
                {globalAnalysisData.overview && (
                  <div style={{ fontSize: '14px', lineHeight: '1.8' }}>
                    <div style={{ marginBottom: '8px' }}>
                      <span style={{ color: AlphaShoutTheme.colors.textSecondary }}>Price:</span>
                      <span style={{ fontWeight: '500', marginLeft: '8px' }}>${globalAnalysisData.overview.price}</span>
                    </div>
                    <div style={{ marginBottom: '8px' }}>
                      <span style={{ color: AlphaShoutTheme.colors.textSecondary }}>Change:</span>
                      <span style={{ 
                        fontWeight: '500', 
                        marginLeft: '8px',
                        color: globalAnalysisData.overview.changePercent > 0 ? AlphaShoutTheme.colors.success : AlphaShoutTheme.colors.error
                      }}>
                        {globalAnalysisData.overview.changePercent > 0 ? '+' : ''}{globalAnalysisData.overview.changePercent}%
                      </span>
                    </div>
                    <div style={{ marginBottom: '8px' }}>
                      <span style={{ color: AlphaShoutTheme.colors.textSecondary }}>Volume:</span>
                      <span style={{ fontWeight: '500', marginLeft: '8px' }}>{formatNumber(globalAnalysisData.overview.volume)}</span>
                    </div>
                  </div>
                )}
              </div>

              {/* Technical Indicators Card */}
              <div style={{
                background: 'white',
                borderRadius: '8px',
                padding: '20px',
                boxShadow: AlphaShoutTheme.shadows.sm
              }}>
                <h3 style={{ 
                  margin: '0 0 16px 0', 
                  fontSize: '16px', 
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <Gauge size={18} color={AlphaShoutTheme.colors.primary} />
                  Technical Indicators
                </h3>
                {globalAnalysisData.technical && (
                  <div style={{ fontSize: '14px', lineHeight: '1.8' }}>
                    <div style={{ marginBottom: '8px' }}>
                      <span style={{ color: AlphaShoutTheme.colors.textSecondary }}>RSI:</span>
                      <span style={{ fontWeight: '500', marginLeft: '8px' }}>
                        {globalAnalysisData.technical.rsi} ({globalAnalysisData.technical.rsiSignal})
                      </span>
                    </div>
                    <div style={{ marginBottom: '8px' }}>
                      <span style={{ color: AlphaShoutTheme.colors.textSecondary }}>SMA 50:</span>
                      <span style={{ fontWeight: '500', marginLeft: '8px' }}>${globalAnalysisData.technical.sma50}</span>
                    </div>
                    <div style={{ marginBottom: '8px' }}>
                      <span style={{ color: AlphaShoutTheme.colors.textSecondary }}>SMA 200:</span>
                      <span style={{ fontWeight: '500', marginLeft: '8px' }}>${globalAnalysisData.technical.sma200}</span>
                    </div>
                    {globalAnalysisData.technical.macd && (
                      <div style={{ marginBottom: '8px' }}>
                        <span style={{ color: AlphaShoutTheme.colors.textSecondary }}>MACD:</span>
                        <span style={{ 
                          fontWeight: '500', 
                          marginLeft: '8px',
                          color: globalAnalysisData.technical.macd.crossover === 'Bullish Crossover' ? 
                            AlphaShoutTheme.colors.success : 
                            globalAnalysisData.technical.macd.crossover === 'Bearish Crossover' ? 
                            AlphaShoutTheme.colors.error : 
                            AlphaShoutTheme.colors.textPrimary
                        }}>
                          {globalAnalysisData.technical.macd.crossover}
                        </span>
                      </div>
                    )}
                    {globalAnalysisData.technical.bollingerBands && (
                      <div style={{ marginBottom: '8px' }}>
                        <span style={{ color: AlphaShoutTheme.colors.textSecondary }}>Bollinger:</span>
                        <span style={{ fontWeight: '500', marginLeft: '8px' }}>
                          {globalAnalysisData.technical.bollingerBands.position}
                        </span>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Sentiment Card */}
              <div style={{
                background: 'white',
                borderRadius: '8px',
                padding: '20px',
                boxShadow: AlphaShoutTheme.shadows.sm
              }}>
                <h3 style={{ 
                  margin: '0 0 16px 0', 
                  fontSize: '16px', 
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <Target size={18} color={AlphaShoutTheme.colors.primary} />
                  Market Sentiment
                </h3>
                {globalAnalysisData.sentiment && (
                  <div style={{ fontSize: '14px', lineHeight: '1.8' }}>
                    <div style={{ marginBottom: '8px' }}>
                      <span style={{ color: AlphaShoutTheme.colors.textSecondary }}>Overall:</span>
                      <span style={{ 
                        fontWeight: '500', 
                        marginLeft: '8px',
                        color: globalAnalysisData.sentiment.overall === 'Bullish' ? AlphaShoutTheme.colors.success : 
                               globalAnalysisData.sentiment.overall === 'Bearish' ? AlphaShoutTheme.colors.error : 
                               AlphaShoutTheme.colors.warning
                      }}>
                        {globalAnalysisData.sentiment.overall}
                      </span>
                    </div>
                    <div style={{ marginBottom: '8px' }}>
                      <span style={{ color: AlphaShoutTheme.colors.textSecondary }}>Score:</span>
                      <span style={{ fontWeight: '500', marginLeft: '8px' }}>{globalAnalysisData.sentiment.score}</span>
                    </div>
                    <div>
                      <span style={{ color: AlphaShoutTheme.colors.textSecondary }}>News:</span>
                      <span style={{ fontWeight: '500', marginLeft: '8px' }}>{globalAnalysisData.sentiment.newsCount} articles</span>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* AI Analysis */}
            {globalAnalysisData.aiAnalysis && (
              <div style={{
                background: 'white',
                borderRadius: '8px',
                padding: '24px',
                marginBottom: '24px',
                boxShadow: AlphaShoutTheme.shadows.sm
              }}>
                <h3 style={{ 
                  margin: '0 0 16px 0', 
                  fontSize: '18px', 
                  fontWeight: '500',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                  <Brain size={20} color={AlphaShoutTheme.colors.primary} />
                  AI Analysis
                </h3>
                <div className="ai-analysis-content" style={{ 
                  fontSize: '14px', 
                  lineHeight: '1.8',
                  color: AlphaShoutTheme.colors.textPrimary 
                }}>
                  {parseMarkdown(globalAnalysisData.aiAnalysis)}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Loading Indicator */}
        {globalLoadingState && (
          <div style={{
            background: 'white',
            borderRadius: '8px',
            padding: '48px',
            textAlign: 'center',
            boxShadow: AlphaShoutTheme.shadows.sm
          }}>
            <Loader2 size={48} className="animate-spin" style={{ color: AlphaShoutTheme.colors.primary, marginBottom: '16px' }} />
            <h3 style={{ 
              margin: '0 0 8px 0', 
              color: AlphaShoutTheme.colors.textPrimary,
              fontSize: '16px'
            }}>
              Analyzing {symbol || currentSymbol}...
            </h3>
            <p style={{ 
              margin: 0, 
              color: AlphaShoutTheme.colors.textSecondary,
              fontSize: '14px'
            }}>
              This analysis continues in the background even if you navigate to other pages
            </p>
          </div>
        )}

        {/* Quota Display */}
        {isAuthenticated && userQuota && (
          <div style={{
            position: 'fixed',
            bottom: '24px',
            right: '24px',
            background: 'white',
            borderRadius: '8px',
            padding: '12px 16px',
            boxShadow: AlphaShoutTheme.shadows.lg,
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            border: `1px solid ${AlphaShoutTheme.colors.border}`
          }}>
            <DollarSign size={18} color={AlphaShoutTheme.colors.primary} />
            <div>
              <div style={{ fontSize: '12px', color: AlphaShoutTheme.colors.textSecondary }}>Available Tokens</div>
              <div style={{ fontSize: '16px', fontWeight: '600', color: AlphaShoutTheme.colors.primary }}>
                {userQuota.available_quota}
              </div>
            </div>
          </div>
        )}
      </div>

      <style>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        .animate-spin {
          animation: spin 1s linear infinite;
        }
        
        .markdown-h1 {
          font-size: 24px;
          font-weight: 600;
          margin: 16px 0 12px;
          color: ${AlphaShoutTheme.colors.textPrimary};
        }
        .markdown-h2 {
          font-size: 20px;
          font-weight: 600;
          margin: 14px 0 10px;
          color: ${AlphaShoutTheme.colors.textPrimary};
        }
        .markdown-h3 {
          font-size: 16px;
          font-weight: 600;
          margin: 12px 0 8px;
          color: ${AlphaShoutTheme.colors.textPrimary};
        }
        .ai-analysis-content p {
          margin: 12px 0;
        }
        .ai-analysis-content ul {
          margin: 12px 0;
          padding-left: 24px;
        }
        .ai-analysis-content li {
          margin: 6px 0;
        }
        .ai-analysis-content strong {
          color: ${AlphaShoutTheme.colors.primary};
          font-weight: 600;
        }
      `}</style>
    </div>
  );
}