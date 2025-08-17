import React, { useState, useEffect, useRef, useCallback } from 'react';
import axios from 'axios';
import { usePortfolio } from './PortfolioContext'; // ADD THIS IMPORT
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
  CodeOutlined
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
  primary: '#003d7a',      // Deep blue
  secondary: '#005eb8',    // Medium blue
  accent: '#0084d4',       // Light blue
  success: '#52c41a',      // Green for positive values
  danger: '#ff4d4f',       // Red for negative values
  gray: '#666666',         // Gray for secondary text
  lightGray: '#f0f0f0',    // Light gray for backgrounds
  white: '#ffffff',
  // Extended colors for more assets
  asset1: '#003d7a',       // Deep blue
  asset2: '#005eb8',       // Medium blue
  asset3: '#0084d4',       // Light blue
  asset4: '#40a9ff',       // Lighter blue
  asset5: '#69c0ff',       // Sky blue
  asset6: '#91d5ff',       // Light sky blue
  asset7: '#1890ff',       // Bright blue
  asset8: '#096dd9'        // Dark bright blue
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

// Cache management
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
      
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.setItem(key, JSON.stringify({
          data,
          timestamp: Date.now()
        }));
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
      
      if (typeof sessionStorage !== 'undefined') {
        const cached = sessionStorage.getItem(key);
        if (cached) {
          const { data, timestamp } = JSON.parse(cached);
          if (Date.now() - timestamp < 24 * 60 * 60 * 1000) {
            return data;
          }
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
      if (typeof sessionStorage !== 'undefined') {
        sessionStorage.removeItem(key);
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
      if (typeof sessionStorage !== 'undefined') {
        Object.values(CACHE_KEYS).forEach(key => {
          sessionStorage.removeItem(key);
        });
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
      
      if (typeof sessionStorage !== 'undefined') {
        status.sessionStorage = true;
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

// PDF Generation Function
const generatePDFReport = (analysisData, config, symbols) => {
  const formatCorrelationMatrix = () => {
    if (!analysisData?.correlationAnalysis?.correlation_matrix) return '';
    
    const matrix = analysisData.correlationAnalysis.correlation_matrix;
    const assets = Object.keys(matrix);
    
    let tableHTML = '<table class="correlation-matrix"><thead><tr><th></th>';
    assets.forEach(asset => {
      tableHTML += `<th>${asset}</th>`;
    });
    tableHTML += '</tr></thead><tbody>';
    
    assets.forEach(rowAsset => {
      tableHTML += `<tr><th>${rowAsset}</th>`;
      assets.forEach(colAsset => {
        const value = matrix[rowAsset][colAsset];
        const formatted = typeof value === 'number' ? value.toFixed(3) : value;
        const colorClass = value >= 0.8 ? 'high-corr' : value >= 0.5 ? 'med-corr' : 'low-corr';
        tableHTML += `<td class="${colorClass}">${formatted}</td>`;
      });
      tableHTML += '</tr>';
    });
    tableHTML += '</tbody></table>';
    return tableHTML;
  };

  const formatAIAnalysisHTML = () => {
    if (!analysisData?.aiAnalysis) return '';
    
    const text = analysisData.aiAnalysis;
    const lines = text.split('\n');
    let html = '';
    
    lines.forEach(line => {
      if (line.startsWith('###')) {
        html += `<h3>${line.replace(/^###\s*/, '')}</h3>`;
      } else if (line.startsWith('####')) {
        html += `<h4>${line.replace(/^####\s*/, '')}</h4>`;
      } else if (line.trim().startsWith('-')) {
        html += `<li>${line.replace(/^-\s*/, '')}</li>`;
      } else if (line.trim()) {
        html += `<p>${line}</p>`;
      }
    });
    
    return html;
  };

  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Portfolio Analysis Report</title>
      <style>
        @page { 
          size: A4 landscape; 
          margin: 10mm;
        }
        body {
          font-family: -apple-system, 'Segoe UI', Arial, sans-serif;
          font-size: 9pt;
          line-height: 1.3;
          color: #333;
          margin: 0;
          padding: 0;
        }
        .header {
          background: linear-gradient(90deg, #003d7a 0%, #005eb8 100%);
          color: white;
          padding: 15px 20px;
          margin-bottom: 15px;
        }
        h1 {
          margin: 0;
          font-size: 20pt;
          font-weight: 300;
        }
        .subtitle {
          font-size: 10pt;
          margin-top: 5px;
          opacity: 0.9;
        }
        h2 {
          color: #003d7a;
          font-size: 14pt;
          margin: 15px 0 10px 0;
          padding: 8px;
          background: #f0f5ff;
          border-left: 4px solid #003d7a;
        }
        h3 {
          color: #005eb8;
          font-size: 11pt;
          margin: 12px 0 8px 0;
        }
        h4 {
          color: #0084d4;
          font-size: 10pt;
          margin: 10px 0 6px 0;
        }
        .content {
          padding: 0 10px;
        }
        .metrics-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 8px;
          margin: 10px 0;
        }
        .metric-card {
          background: #f8f9fa;
          padding: 10px;
          border-radius: 4px;
          border: 1px solid #e0e0e0;
          text-align: center;
        }
        .metric-label {
          color: #666;
          font-size: 8pt;
          margin-bottom: 4px;
        }
        .metric-value {
          color: #003d7a;
          font-size: 16pt;
          font-weight: bold;
        }
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 10px 0;
          font-size: 8pt;
        }
        th {
          background: #003d7a;
          color: white;
          padding: 6px;
          text-align: left;
          font-weight: 600;
        }
        td {
          padding: 5px;
          border-bottom: 1px solid #e0e0e0;
        }
        tr:nth-child(even) { background: #f8f9fa; }
        .positive { color: #52c41a; font-weight: bold; }
        .negative { color: #ff4d4f; font-weight: bold; }
        
        .correlation-matrix {
          font-size: 8pt;
        }
        .correlation-matrix th {
          background: #005eb8;
          color: white;
          padding: 4px;
          text-align: center;
        }
        .correlation-matrix td {
          text-align: center;
          padding: 4px;
        }
        .high-corr { background: #ff9999; }
        .med-corr { background: #ffcc99; }
        .low-corr { background: #ccffcc; }
        
        .risk-grid {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 10px;
          margin: 10px 0;
        }
        .risk-card {
          background: #fff3e0;
          border-left: 3px solid #ff6f00;
          padding: 8px;
        }
        .risk-label {
          font-size: 8pt;
          color: #666;
        }
        .risk-value {
          font-size: 12pt;
          font-weight: bold;
          color: #ff6f00;
        }
        
        .strategy-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 8px;
          margin: 10px 0;
        }
        .strategy-card {
          border: 1px solid #e0e0e0;
          padding: 6px;
          border-radius: 4px;
          font-size: 7pt;
        }
        .strategy-name {
          color: #003d7a;
          font-weight: bold;
          margin-bottom: 4px;
          font-size: 8pt;
        }
        
        .ai-analysis {
          background: #f0f5ff;
          padding: 12px;
          border-radius: 4px;
          margin: 10px 0;
          font-size: 9pt;
          line-height: 1.4;
        }
        .ai-analysis h3 {
          color: #003d7a;
          margin-top: 10px;
        }
        .ai-analysis p {
          margin: 6px 0;
        }
        .ai-analysis li {
          margin: 4px 0 4px 20px;
        }
        
        .footer {
          margin-top: 20px;
          padding: 10px;
          border-top: 2px solid #003d7a;
          font-size: 8pt;
          color: #666;
          text-align: center;
        }
        
        @media print {
          body { margin: 0; }
          .page-break { page-break-before: always; }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Portfolio Risk Analytics Report</h1>
        <div class="subtitle">
          Generated: ${new Date().toLocaleString('en-US')} | 
          Strategy: ${config.weight_strategy.replace(/_/g, ' ').toUpperCase()} | 
          Assets: ${symbols.join(', ')}
        </div>
      </div>

      <div class="content">
        <h2>1. Portfolio Performance Overview</h2>
        <div class="metrics-grid">
          <div class="metric-card">
            <div class="metric-label">Portfolio Return</div>
            <div class="metric-value">${analysisData?.optimizationSummary?.portfolio_return || 'N/A'}</div>
          </div>
          <div class="metric-card">
            <div class="metric-label">Volatility</div>
            <div class="metric-value">${analysisData?.optimizationSummary?.portfolio_volatility || 'N/A'}</div>
          </div>
          <div class="metric-card">
            <div class="metric-label">Sharpe Ratio</div>
            <div class="metric-value">${analysisData?.optimizationSummary?.portfolio_sharpe || 'N/A'}</div>
          </div>
          <div class="metric-card">
            <div class="metric-label">Diversification</div>
            <div class="metric-value">${analysisData?.optimizationSummary?.diversification_ratio || 'N/A'}</div>
          </div>
        </div>

        <h2>2. Asset Allocation</h2>
        <table>
          <thead>
            <tr>
              <th>Symbol</th>
              <th>Weight</th>
              <th>Expected Return</th>
              <th>Volatility</th>
              <th>Sharpe Ratio</th>
              <th>Risk Contribution</th>
              <th>Beta</th>
              <th>Alpha</th>
            </tr>
          </thead>
          <tbody>
            ${analysisData?.assetAllocation?.map(asset => `
              <tr>
                <td><strong>${asset.symbol}</strong></td>
                <td>${asset.weight}</td>
                <td class="${parseFloat(asset.expected_return) > 0 ? 'positive' : 'negative'}">${asset.expected_return}</td>
                <td>${asset.volatility}</td>
                <td>${asset.sharpe_ratio}</td>
                <td>${asset.risk_contribution}</td>
                <td>${asset.beta || 'N/A'}</td>
                <td>${asset.alpha || 'N/A'}</td>
              </tr>
            `).join('') || '<tr><td colspan="8">No data available</td></tr>'}
          </tbody>
        </table>

        <h2>3. Risk Analysis</h2>
        <div class="risk-grid">
          <div class="risk-card">
            <div class="risk-label">VaR 95%</div>
            <div class="risk-value">${analysisData?.riskAnalysis?.risk_metrics?.portfolio_var_95 || 'N/A'}</div>
          </div>
          <div class="risk-card">
            <div class="risk-label">Max Drawdown</div>
            <div class="risk-value">${analysisData?.riskAnalysis?.risk_metrics?.maximum_drawdown || 'N/A'}</div>
          </div>
          <div class="risk-card">
            <div class="risk-label">Downside Deviation</div>
            <div class="risk-value">${analysisData?.riskAnalysis?.risk_metrics?.downside_deviation || 'N/A'}</div>
          </div>
          <div class="risk-card">
            <div class="risk-label">Sortino Ratio</div>
            <div class="risk-value">${analysisData?.riskAnalysis?.risk_metrics?.sortino_ratio || 'N/A'}</div>
          </div>
          <div class="risk-card">
            <div class="risk-label">Calmar Ratio</div>
            <div class="risk-value">${analysisData?.riskAnalysis?.risk_metrics?.calmar_ratio || 'N/A'}</div>
          </div>
          <div class="risk-card">
            <div class="risk-label">Omega Ratio</div>
            <div class="risk-value">${analysisData?.riskAnalysis?.risk_metrics?.omega_ratio || 'N/A'}</div>
          </div>
        </div>

        <h2>4. Correlation Matrix</h2>
        ${formatCorrelationMatrix()}

        <h2>5. Strategy Comparison</h2>
        <div class="strategy-grid">
          ${analysisData?.strategyComparison ? Object.entries(analysisData.strategyComparison).map(([strategy, data]) => `
            <div class="strategy-card">
              <div class="strategy-name">${strategy.replace(/_/g, ' ').toUpperCase()}</div>
              <div>Return: <strong>${data.return}</strong></div>
              <div>Volatility: ${data.volatility}</div>
              <div>Sharpe: ${data.sharpe_ratio}</div>
              <div>Sortino: ${data.sortino_ratio || 'N/A'}</div>
            </div>
          `).join('') : '<div>No comparison data available</div>'}
        </div>

        <h2>6. AI Analysis & Recommendations</h2>
        <div class="ai-analysis">
          ${formatAIAnalysisHTML()}
        </div>
      </div>

      <div class="footer">
        Portfolio Risk Analytics Platform | Alphashout | Confidential<br>
        This report is for informational purposes only and does not constitute investment advice.
      </div>
    </body>
    </html>
  `;

  const printWindow = window.open('', '_blank');
  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.onload = () => {
    printWindow.focus();
    setTimeout(() => {
      printWindow.print();
    }, 500);
  };
};
export default function AlphashoutPortfolioAnalytics() {
  // ========== GLOBAL CONTEXT INTEGRATION ==========
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
  // ========== END GLOBAL CONTEXT ==========

  // State declarations - Initialize from global state
  const [symbols, setSymbols] = useState(globalPortfolioData.symbols || []);
  const [config, setConfig] = useState(globalPortfolioData.config || {
    target_return: '0.12',
    lookback_days: '252',
    risk_free_symbol: 'BND',
    market_benchmark_symbol: 'SPY',
    weight_strategy: 'risk_parity'
  });
  
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
  const [webhookResponse, setWebhookResponse] = useState(globalPortfolioData.analysisResult);
  
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(true);
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

  // ========== SYNC WITH GLOBAL STATE ==========
  // Sync symbols with global state
  useEffect(() => {
    updatePortfolioSymbols(symbols);
  }, [symbols]);
  
  // Sync config with global state
  useEffect(() => {
    updatePortfolioConfig(config);
  }, [config]);
  
  // Sync webhook response with global state
  useEffect(() => {
    if (webhookResponse && !webhookResponse.error) {
      updatePortfolioAnalysisResult(webhookResponse);
    }
  }, [webhookResponse]);
  
  // Load global data on mount
  useEffect(() => {
    if (globalPortfolioData.symbols && globalPortfolioData.symbols.length > 0) {
      setSymbols(globalPortfolioData.symbols);
    }
    if (globalPortfolioData.config) {
      setConfig(globalPortfolioData.config);
    }
    if (globalPortfolioData.analysisResult) {
      setWebhookResponse(globalPortfolioData.analysisResult);
    }
  }, []); // Only run once on mount
  
  // Show notification when analysis is running globally but not locally
  useEffect(() => {
    if (globalPortfolioLoadingState && !isSending) {
      // Analysis is running from another page
      message.info('Portfolio analysis is running in the background...');
    }
  }, [globalPortfolioLoadingState, isSending]);
  // ========== END SYNC WITH GLOBAL STATE ==========

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

  // Cache functions
  const autoSave = useCallback(() => {
    if (!autoSaveEnabled) return;
    
    try {
      DataCache.save(CACHE_KEYS.SYMBOLS, symbols);
      DataCache.save(CACHE_KEYS.CONFIG, config);
      if (webhookResponse) {
        DataCache.save(CACHE_KEYS.WEBHOOK_RESPONSE, webhookResponse);
      }
      const now = new Date().toISOString();
      DataCache.save(CACHE_KEYS.LAST_SAVE_TIME, now);
      setLastSaveTime(now);
      setCacheStatus(DataCache.getStatus());
    } catch (error) {
      console.warn('Auto save failed:', error);
    }
  }, [symbols, config, webhookResponse, autoSaveEnabled]);

  const manualSave = () => {
    try {
      DataCache.save(CACHE_KEYS.SYMBOLS, symbols);
      DataCache.save(CACHE_KEYS.CONFIG, config);
      DataCache.save(CACHE_KEYS.AUTO_SAVE_ENABLED, autoSaveEnabled);
      if (webhookResponse) {
        DataCache.save(CACHE_KEYS.WEBHOOK_RESPONSE, webhookResponse);
      }
      const now = new Date().toISOString();
      DataCache.save(CACHE_KEYS.LAST_SAVE_TIME, now);
      setLastSaveTime(now);
      setCacheStatus(DataCache.getStatus());
      message.success('Data saved to cache');
    } catch (error) {
      message.error('Save failed: ' + error.message);
    }
  };

  const loadFromCache = () => {
    try {
      const cachedSymbols = DataCache.load(CACHE_KEYS.SYMBOLS);
      const cachedConfig = DataCache.load(CACHE_KEYS.CONFIG);
      const cachedAutoSave = DataCache.load(CACHE_KEYS.AUTO_SAVE_ENABLED);
      const cachedWebhookResponse = DataCache.load(CACHE_KEYS.WEBHOOK_RESPONSE);
      const cachedLastSave = DataCache.load(CACHE_KEYS.LAST_SAVE_TIME);

      if (cachedSymbols && Array.isArray(cachedSymbols)) {
        setSymbols(cachedSymbols);
      }
      
      if (cachedConfig && typeof cachedConfig === 'object') {
        setConfig(prev => ({ ...prev, ...cachedConfig }));
      }
      
      if (typeof cachedAutoSave === 'boolean') {
        setAutoSaveEnabled(cachedAutoSave);
      }
      
      if (cachedWebhookResponse) {
        setWebhookResponse(cachedWebhookResponse);
      }
      
      if (cachedLastSave) {
        setLastSaveTime(cachedLastSave);
      }

      setCacheStatus(DataCache.getStatus());
      if (cachedSymbols || cachedConfig || cachedWebhookResponse) {
        message.success('Data restored from cache');
      }
    } catch (error) {
      console.warn('Load cache failed:', error);
    }
  };

  const clearCache = () => {
    try {
      DataCache.clearAll();
      setCacheStatus(DataCache.getStatus());
      setLastSaveTime(null);
      message.success('Cache cleared');
    } catch (error) {
      message.error('Clear cache failed: ' + error.message);
    }
  };

  // Clear global results
  const clearGlobalResults = () => {
    clearPortfolioAnalysisResult();
    setWebhookResponse(null);
    message.success('Analysis results cleared');
  };

  // API search function
const searchSymbols = async (query, setResults, setLoading, setShow) => {
    if (query.length < 2) {
      setResults([]);
      setShow(false);
      return;
    }

    setLoading(true);
    
    try {
      const response = await axios.get(`/api/stock/search-alphavantage?query=${encodeURIComponent(query)}`);
      
      if (response.data.success && response.data.bestMatches && Array.isArray(response.data.bestMatches)) {
        const results = response.data.bestMatches.slice(0, 10);
        setResults(results);
        setShow(true);
      } else {
        setResults([]);
        setShow(false);
      }
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
      setShow(false);
      
      if (error.response?.status === 429) {
        message.warning('API rate limit reached, please try again later');
      } else if (error.response?.status === 504) {
        message.warning('Search timeout, please retry');
      } else if (error.response?.data?.error === 'API_NOT_CONFIGURED') {
        message.error('Search service temporarily unavailable');
      } else {
        message.warning('Search failed, please try again');
      }
    } finally {
      setLoading(false);
    }
  };

  // Check authentication status on mount
  const checkAuthStatus = async () => {
    try {
      const response = await axios.get('/api/auth/me');
      if (response.data.user) {
        setIsAuthenticated(true);
        setUserEmail(response.data.user.email);
        setAvailableQuota(response.data.quota?.available_quota || 0);
      }
    } catch (error) {
      console.log('User not authenticated');
      setIsAuthenticated(false);
    }
  };

  // Get portfolio quota configuration
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

  // Initialize axios configuration
  useEffect(() => {
    checkAuthStatus();
    fetchQuotaConfig();
  }, []);

  // Component initialization - load cache
  useEffect(() => {
    loadFromCache();
  }, []);

  useEffect(() => {
    if (autoSaveEnabled) {
      const timer = setTimeout(autoSave, 1000);
      return () => clearTimeout(timer);
    }
  }, [symbols, config, autoSave]);

  // Page lifecycle management
  useEffect(() => {
    const handleBeforeUnload = () => {
      if (autoSaveEnabled) {
        autoSave();
      }
    };

    const handleVisibilityChange = () => {
      if (document.hidden && autoSaveEnabled) {
        autoSave();
      } else if (!document.hidden) {
        setCacheStatus(DataCache.getStatus());
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [autoSave, autoSaveEnabled]);

  // Update main search useEffect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim()) {
        searchSymbols(searchQuery.trim(), setSearchResults, setIsSearching, setShowDropdown);
      } else {
        setSearchResults([]);
        setShowDropdown(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

   // Update risk-free asset search useEffect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (riskFreeQuery && riskFreeQuery.trim() && riskFreeQuery.length >= 2) {
        // Use the same search function, or create a dedicated one
        searchSymbols(riskFreeQuery.trim(), setRiskFreeResults, setIsRiskFreeSearching, setShowRiskFreeDropdown);
      } else if (riskFreeQuery.length === 0) {
        setRiskFreeResults([]);
        setShowRiskFreeDropdown(false);
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [riskFreeQuery]);

// Update benchmark search useEffect
  useEffect(() => {
    const timer = setTimeout(() => {
      if (benchmarkQuery && benchmarkQuery.trim() && benchmarkQuery.length >= 2) {
        // Use the same search function
        searchSymbols(benchmarkQuery.trim(), setBenchmarkResults, setIsBenchmarkSearching, setShowBenchmarkDropdown);
      } else if (benchmarkQuery.length === 0) {
        setBenchmarkResults([]);
        setShowBenchmarkDropdown(false);
      }
    }, 800);

    return () => clearTimeout(timer);
  }, [benchmarkQuery]);

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
    if (symbol && !symbols.includes(symbol)) {
      setSymbols(prev => [...prev, symbol]);
      message.success(`Added ${symbol} to portfolio`);
    }
    setSearchQuery('');
    setShowDropdown(false);
    setSearchResults([]);
  };

  const removeSymbol = (symbolToRemove) => {
    setSymbols(symbols.filter(symbol => symbol !== symbolToRemove));
    message.success(`Removed ${symbolToRemove}`);
  };

  const updateConfig = (key, value) => {
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

  // ========== MODIFIED sendToWebhook WITH GLOBAL TRACKING ==========
  const sendToWebhook = async () => {
    // Check if user is authenticated
    if (!isAuthenticated) {
      message.warning('Please login to perform portfolio analysis');
      return;
    }

    // Check quota
    if (availableQuota < quotaConfig.ANALYSIS_TOKEN_FEE) {
      message.error(`Insufficient quota! Need ${quotaConfig.ANALYSIS_TOKEN_FEE} tokens, you have ${availableQuota}`);
      return;
    }

    const jsonData = generateJSON();
    
    // Validate inputs
    if (!jsonData.symbols || jsonData.symbols.length === 0) {
      message.error('Please add at least one stock symbol');
      return;
    }
    
    // Generate unique operation ID
    const operationId = `portfolio-analysis-${Date.now()}`;
    
    setIsSending(true);
    setGlobalPortfolioLoadingState(true); // Set global loading state
    setWebhookResponse(null);
    clearPortfolioAnalysisResult(); // Clear previous global result
    setGlobalPortfolioError(null); // Clear any previous errors
    
    // Add to active operations
    addActivePortfolioOperation(operationId);
    
    // Create abort controller
    const abortController = new AbortController();
    setPortfolioAbortController(operationId, abortController);
    
    try {
      // First check quota (without deducting)
      const quotaCheck = await axios.post('/api/portfolio/check-quota', {}, {
        signal: abortController.signal
      });
      
      if (!quotaCheck.data.hasEnoughQuota) {
        message.error(quotaCheck.data.message);
        setIsSending(false);
        setGlobalPortfolioLoadingState(false);
        removeActivePortfolioOperation(operationId);
        return;
      }

      // Perform the analysis (this will deduct quota and call webhook)
      const response = await axios.post('/api/portfolio/analyze', jsonData, {
        signal: abortController.signal
      });

      if (response.data.success) {
        const newWebhookResponse = {
          status: response.data.analysis.status,
          statusText: response.data.analysis.statusText,
          data: response.data.analysis.data,
          timestamp: response.data.analysis.timestamp
        };

        setWebhookResponse(newWebhookResponse);
        updatePortfolioAnalysisResult(newWebhookResponse); // Update global state
        
        // Update available quota
        setAvailableQuota(response.data.quota.remaining);
        
        // Auto-save response if enabled
        if (autoSaveEnabled) {
          DataCache.save(CACHE_KEYS.WEBHOOK_RESPONSE, newWebhookResponse);
        }
        
        message.success(`Analysis successful! Deducted ${response.data.quota.deducted} tokens, ${response.data.quota.remaining} remaining`);
      } else {
        message.error(response.data.message || 'Analysis failed');
        setGlobalPortfolioError(response.data.message || 'Analysis failed');
      }
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('Portfolio analysis was aborted');
        message.info('Analysis was cancelled');
      } else {
        console.error('Analysis error:', error);
        
        if (error.response?.status === 401) {
          message.error('Session expired, please login again');
          setIsAuthenticated(false);
        } else if (error.response?.status === 400) {
          message.error(error.response.data.message || 'Invalid request');
        } else {
          message.error('Analysis failed: ' + (error.response?.data?.message || error.message));
        }
        
        const errorResponse = {
          error: true,
          message: error.response?.data?.message || error.message,
          timestamp: new Date().toISOString()
        };
        setWebhookResponse(errorResponse);
        setGlobalPortfolioError(error.message);
      }
    } finally {
      setIsSending(false);
      setGlobalPortfolioLoadingState(false);
      removeActivePortfolioOperation(operationId);
    }
  };
  // ========== END MODIFIED sendToWebhook ==========

  const handleManualAdd = () => {
    const value = manualInput.trim().toUpperCase();
    if (value && !symbols.includes(value)) {
      setSymbols(prev => [...prev, value]);
      setManualInput('');
      message.success(`Added ${value} to portfolio`);
    } else if (symbols.includes(value)) {
      message.info(`${value} already exists`);
      setManualInput('');
    }
  };

  const loadExampleConfig = () => {
    const exampleSymbols = ['VGT', 'VUG', 'ARKK', 'VTI'];
    const exampleConfig = {
      target_return: '0.25',
      lookback_days: '252',
      risk_free_symbol: 'BND',
      market_benchmark_symbol: 'SPY',
      weight_strategy: 'risk_parity'
    };
    
    setSymbols(exampleSymbols);
    setConfig(exampleConfig);
    
    // Also update global state
    updatePortfolioSymbols(exampleSymbols);
    updatePortfolioConfig(exampleConfig);
    
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

  // Continue from Part 2...
  
  return (
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
                  {isAuthenticated ? (
                    <Text style={{ color: 'white', fontSize: '13px', fontWeight: 'bold' }}>
                      {userEmail}
                    </Text>
                  ) : (
                    <Text style={{ color: '#ff4d4f', fontSize: '13px', fontWeight: 'bold' }}>
                      Not Logged In
                    </Text>
                  )}
                </div>
              </Col>
              <Col xs={24} sm={8} md={4}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                  <Text style={{ color: 'rgba(255,255,255,0.7)', fontSize: '11px' }}>AVAILABLE QUOTA</Text>
                  <Badge 
                    count={`${availableQuota} Tokens`}
                    style={{ 
                      backgroundColor: availableQuota >= quotaConfig.ANALYSIS_TOKEN_FEE ? '#52c41a' : '#ff4d4f',
                      fontSize: '13px'
                    }}
                  />
                </div>
              </Col>
              {globalPortfolioLoadingState && (
                <Col xs={24} sm={8} md={4}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                    <Spin size="small" style={{ color: 'white' }} />
                    <Text style={{ color: 'white', fontSize: '12px', fontWeight: 'bold' }}>
                      Analysis Running
                    </Text>
                  </div>
                </Col>
              )}
              <Col xs={24} sm={8} md={4}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: '12px' }}>Auto Save:</Text>
                  <Switch 
                    checked={autoSaveEnabled}
                    onChange={setAutoSaveEnabled}
                    size="small"
                  />
                </div>
              </Col>
              <Col xs={24} sm={8} md={4}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: '12px' }}>Cache:</Text>
                  <Badge 
                    status={cacheStatus.memoryCache ? "success" : "error"} 
                    text={
                      <Text style={{ color: 'white', fontSize: '12px' }}>
                        {cacheStatus.memoryCache ? 'Active' : 'Inactive'}
                      </Text>
                    }
                  />
                </div>
              </Col>
              <Col xs={24} sm={8} md={3}>
                <Text style={{ color: 'rgba(255,255,255,0.9)', fontSize: '11px' }}>
                  {lastSaveTime ? `Saved: ${new Date(lastSaveTime).toLocaleTimeString()}` : 'Not saved'}
                </Text>
              </Col>
              <Col xs={24} sm={8} md={4}>
                <Space>
                  <Button 
                    size="small" 
                    icon={<SaveOutlined />} 
                    onClick={manualSave}
                    style={{ background: 'rgba(255,255,255,0.2)', borderColor: 'rgba(255,255,255,0.3)', color: 'white' }}
                  >
                    Save
                  </Button>
                  <Button 
                    size="small" 
                    icon={<ReloadOutlined />} 
                    onClick={loadFromCache}
                    style={{ background: 'rgba(255,255,255,0.2)', borderColor: 'rgba(255,255,255,0.3)', color: 'white' }}
                  >
                    Restore
                  </Button>
                  <Button 
                    size="small" 
                    icon={<DeleteOutlined />} 
                    onClick={clearGlobalResults}
                    style={{ background: 'rgba(255,255,255,0.2)', borderColor: 'rgba(255,255,255,0.3)', color: 'white' }}
                  >
                    Clear
                  </Button>
                </Space>
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
                placeholder="Search stock symbols or company names..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onFocus={() => {
                  if (searchResults.length > 0) {
                    setShowDropdown(true);
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
                        borderBottom: index < searchResults.length - 1 ? `1px solid ${AlphaShout_COLORS.lightGray}` : 'none'
                      }}
                      onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f5ff'}
                      onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
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
                      closable
                      onClose={() => removeSymbol(symbol)}
                      style={{ 
                        padding: '6px 12px',
                        fontSize: '14px',
                        background: getAssetColor(index),
                        color: 'white',
                        borderColor: getAssetColor(index)
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
                  style={{ width: '100%' }}
                  min={1}
                  max={10000}
                />
              </div>

              <div>
                <Text strong style={{ display: 'block', marginBottom: '8px' }}>Risk Free Symbol</Text>
                <div style={{ position: 'relative' }} ref={riskFreeRef}>
                  <Space.Compact style={{ width: '100%' }}>
                    <Input
                      prefix={<SearchOutlined />}
                      suffix={isRiskFreeSearching ? <Spin size="small" /> : null}
                      placeholder="Search or enter risk-free asset..."
                      value={riskFreeQuery !== '' ? riskFreeQuery : config.risk_free_symbol}
                      onChange={(e) => {
                        setRiskFreeQuery(e.target.value);
                        if (e.target.value === '') {
                          updateConfig('risk_free_symbol', '');
                        }
                      }}
                      onBlur={() => {
                        if (riskFreeQuery && riskFreeQuery.trim()) {
                          updateConfig('risk_free_symbol', riskFreeQuery.trim().toUpperCase());
                          setRiskFreeQuery('');
                        }
                      }}
                      onPressEnter={() => {
                        if (riskFreeQuery && riskFreeQuery.trim()) {
                          updateConfig('risk_free_symbol', riskFreeQuery.toUpperCase());
                          setRiskFreeQuery('');
                          setShowRiskFreeDropdown(false);
                        }
                      }}
                      style={{ flex: 1 }}
                    />
                    <Button 
                      type="primary" 
                      onClick={() => {
                        const value = riskFreeQuery || config.risk_free_symbol;
                        if (value && value.trim()) {
                          updateConfig('risk_free_symbol', value.trim().toUpperCase());
                          setRiskFreeQuery('');
                          setShowRiskFreeDropdown(false);
                          message.success(`Risk-free symbol set to ${value.trim().toUpperCase()}`);
                        }
                      }}
                      icon={<CheckCircleOutlined />}
                      style={{ background: AlphaShout_COLORS.primary }}
                    >
                      Set
                    </Button>
                  </Space.Compact>
                  
                  {showRiskFreeDropdown && riskFreeResults.length > 0 && (
                    <div style={{ 
                      position: 'absolute', 
                      zIndex: 1000, 
                      width: '100%', 
                      marginTop: '4px',
                      background: 'white',
                      border: `1px solid ${AlphaShout_COLORS.lightGray}`,
                      borderRadius: '4px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                      maxHeight: '200px',
                      overflowY: 'auto'
                    }}>
                      {riskFreeResults.map((result, index) => (
                        <div
                          key={index}
                          onClick={() => {
                            updateConfig('risk_free_symbol', result['1. symbol']);
                            setRiskFreeQuery('');
                            setShowRiskFreeDropdown(false);
                            setRiskFreeResults([]);
                          }}
                          style={{
                            padding: '10px',
                            cursor: 'pointer',
                            borderBottom: index < riskFreeResults.length - 1 ? `1px solid ${AlphaShout_COLORS.lightGray}` : 'none'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f5ff'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
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
                </div>
              </div>

              <div>
                <Text strong style={{ display: 'block', marginBottom: '8px' }}>Market Benchmark Symbol</Text>
                <div style={{ position: 'relative' }} ref={benchmarkRef}>
                  <Space.Compact style={{ width: '100%' }}>
                    <Input
                      prefix={<SearchOutlined />}
                      suffix={isBenchmarkSearching ? <Spin size="small" /> : null}
                      placeholder="Search or enter benchmark..."
                      value={benchmarkQuery !== '' ? benchmarkQuery : config.market_benchmark_symbol}
                      onChange={(e) => {
                        setBenchmarkQuery(e.target.value);
                        if (e.target.value === '') {
                          updateConfig('market_benchmark_symbol', '');
                        }
                      }}
                      onBlur={() => {
                        if (benchmarkQuery && benchmarkQuery.trim()) {
                          updateConfig('market_benchmark_symbol', benchmarkQuery.trim().toUpperCase());
                          setBenchmarkQuery('');
                        }
                      }}
                      onPressEnter={() => {
                        if (benchmarkQuery && benchmarkQuery.trim()) {
                          updateConfig('market_benchmark_symbol', benchmarkQuery.toUpperCase());
                          setBenchmarkQuery('');
                          setShowBenchmarkDropdown(false);
                        }
                      }}
                      style={{ flex: 1 }}
                    />
                    <Button 
                      type="primary" 
                      onClick={() => {
                        const value = benchmarkQuery || config.market_benchmark_symbol;
                        if (value && value.trim()) {
                          updateConfig('market_benchmark_symbol', value.trim().toUpperCase());
                          setBenchmarkQuery('');
                          setShowBenchmarkDropdown(false);
                          message.success(`Benchmark symbol set to ${value.trim().toUpperCase()}`);
                        }
                      }}
                      icon={<CheckCircleOutlined />}
                      style={{ background: AlphaShout_COLORS.primary }}
                    >
                      Set
                    </Button>
                  </Space.Compact>
                  
                  {showBenchmarkDropdown && benchmarkResults.length > 0 && (
                    <div style={{ 
                      position: 'absolute', 
                      zIndex: 1000, 
                      width: '100%', 
                      marginTop: '4px',
                      background: 'white',
                      border: `1px solid ${AlphaShout_COLORS.lightGray}`,
                      borderRadius: '4px',
                      boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                      maxHeight: '200px',
                      overflowY: 'auto'
                    }}>
                      {benchmarkResults.map((result, index) => (
                        <div
                          key={index}
                          onClick={() => {
                            updateConfig('market_benchmark_symbol', result['1. symbol']);
                            setBenchmarkQuery('');
                            setShowBenchmarkDropdown(false);
                            setBenchmarkResults([]);
                          }}
                          style={{
                            padding: '10px',
                            cursor: 'pointer',
                            borderBottom: index < benchmarkResults.length - 1 ? `1px solid ${AlphaShout_COLORS.lightGray}` : 'none'
                          }}
                          onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#f0f5ff'}
                          onMouseLeave={(e) => e.currentTarget.style.backgroundColor = 'white'}
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
                </div>
              </div>

              <div>
                <Text strong style={{ display: 'block', marginBottom: '8px' }}>Weight Strategy</Text>
                <Select
                  value={config.weight_strategy}
                  onChange={(value) => updateConfig('weight_strategy', value)}
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
                  disabled={!isAuthenticated || availableQuota < quotaConfig.ANALYSIS_TOKEN_FEE || globalPortfolioLoadingState}
                  style={{ 
                    background: (!isAuthenticated || availableQuota < quotaConfig.ANALYSIS_TOKEN_FEE) 
                      ? '#d9d9d9' 
                      : globalPortfolioLoadingState 
                        ? 'linear-gradient(135deg, #ff9800 0%, #ff6f00 100%)'
                        : AlphaShout_COLORS.primary, 
                    borderColor: globalPortfolioLoadingState ? '#ff9800' : AlphaShout_COLORS.primary 
                  }}
                >
                  {!isAuthenticated 
                    ? 'Login Required' 
                    : availableQuota < quotaConfig.ANALYSIS_TOKEN_FEE
                      ? `Need ${quotaConfig.ANALYSIS_TOKEN_FEE} Tokens`
                      : globalPortfolioLoadingState
                        ? 'Analysis Running...'
                        : `Analyze (${quotaConfig.ANALYSIS_TOKEN_FEE} Tokens)`}
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
                  message="Quick Start"
                  description="Click 'Load Example Configuration' to quickly load a sample portfolio"
                  type="info"
                  showIcon
                  style={{ marginBottom: '16px', borderColor: AlphaShout_COLORS.accent }}
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

      {/* Results Display - Continue in next part... */}

      {/* Results Display - Continuation from Part 3 */}
      {webhookResponse && !webhookResponse.error && (
        <div style={{ marginTop: '32px' }}>
          <Card 
            title={
              <Space>
                <DashboardOutlined style={{ fontSize: '24px', color: AlphaShout_COLORS.primary }} />
                <span style={{ fontSize: '20px', fontWeight: '500', color: AlphaShout_COLORS.primary }}>
                  Portfolio Analysis Results
                </span>
              </Space>
            }
            style={{ 
              background: 'white',
              borderColor: AlphaShout_COLORS.primary,
              borderWidth: '2px'
            }}
            extra={
              <Space>
                <Button 
                  type="primary"
                  icon={<FilePdfOutlined />}
                  onClick={() => {
                    const analysisData = formatEnhancedPortfolioAnalysis(webhookResponse.data);
                    generatePDFReport(analysisData, config, symbols);
                  }}
                  style={{ 
                    background: AlphaShout_COLORS.danger,
                    borderColor: AlphaShout_COLORS.danger
                  }}
                >
                  Download PDF Report
                </Button>
                <Button 
                  onClick={() => {
                    setWebhookResponse(null);
                    clearPortfolioAnalysisResult();
                  }}
                  icon={<CloseOutlined />}
                >
                  Clear
                </Button>
              </Space>
            }
          >
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
                              symbols={symbols.length > 0 ? symbols : ['VGT', 'VUG', 'ARKK', 'VTI']}
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
          </Card>
        </div>
      )}

      {/* Error Display */}
      {webhookResponse && webhookResponse.error && (
        <div style={{ marginTop: '32px' }}>
          <Alert
            message="Analysis Error"
            description={webhookResponse.message || 'An error occurred during analysis'}
            type="error"
            showIcon
            closable
            onClose={() => {
              setWebhookResponse(null);
              clearPortfolioAnalysisResult();
            }}
          />
        </div>
      )}
    </div>
  );
}