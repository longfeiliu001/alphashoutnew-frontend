// StockthirteenDemo.js - Demo version for non-authenticated users
import React, { useState, useEffect, useRef } from 'react';
import { Button, Input, Spin, Card, Typography, Tag, message, Modal, Tooltip, Tabs } from 'antd';
import { SearchOutlined, LoginOutlined, ReloadOutlined, DollarOutlined, BarChartOutlined, ExperimentOutlined, CheckCircleOutlined, ClockCircleOutlined, FileTextOutlined, FundOutlined, RiseOutlined, FallOutlined } from '@ant-design/icons';
import { useAnalysis } from './AnalysisContext';
import { DEMO_DATA, DEMO_MESSAGES } from './DemoDataFinancial';
import { InfoCircleOutlined } from '@ant-design/icons';

const { Title, Text } = Typography;


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
    textInverse: '#FFFFFF',
    tableHeader: '#F0F3F5',
    tableRowHover: '#F8FAFB',
    tableRowAlt: '#FAFBFC',
    deepAnalysis: '#8B008B'  // Deep purple for deep analysis
  },
  fonts: {
    primary: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    heading: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    mono: "'SF Mono', Monaco, 'Courier New', monospace"
  },
  shadows: {
    small: '0 1px 2px rgba(0, 0, 0, 0.05)',
    medium: '0 2px 4px rgba(0, 0, 0, 0.08)',
    large: '0 4px 8px rgba(0, 0, 0, 0.12)',
    card: '0 0 20px rgba(0, 0, 0, 0.08)'
  },
  radius: {
    small: '2px',
    medium: '4px',
    large: '8px',
    xlarge: '12px'
  }
};
// Custom message function with AlphaShout styling
const showAlphaShoutMessage = (type, content, duration = 4) => {
  // Destroy any existing messages first
  message.destroy();
  
  // Configure message position
  message.config({
    top: window.innerHeight / 2 - 100, // Center of screen
    duration: duration,
    maxCount: 1,
  });
  
  const messageContent = (
    <div style={{
      fontSize: '14px',
      fontFamily: AlphaShoutTheme.fonts.primary,
      padding: '8px 12px',
      borderRadius: AlphaShoutTheme.radius.medium,
      boxShadow: AlphaShoutTheme.shadows.large,
    }}>
      {content}
    </div>
  );
  
  switch(type) {
    case 'warning':
      message.warning(messageContent);
      break;
    case 'error':
      message.error(messageContent);
      break;
    case 'success':
      message.success(messageContent);
      break;
    default:
      message.info(messageContent);
  }
};

// Usage Instructions Component - Updated to remove technical analysis
const UsageInstructions = () => (
  <div style={{
    background: 'linear-gradient(135deg, #FAFBFC 0%, #FFFFFF 100%)',
    borderRadius: AlphaShoutTheme.radius.large,
    padding: '48px',
    marginBottom: '32px',
    border: `1px solid ${AlphaShoutTheme.colors.borderLight}`,
    boxShadow: AlphaShoutTheme.shadows.card
  }}>
    <div style={{ textAlign: 'center', marginBottom: '40px' }}>
      <Title level={2} style={{
        color: AlphaShoutTheme.colors.primary,
        marginBottom: '16px',
        fontSize: '28px'
      }}>
        Professional Stock Analysis Platform
      </Title>
      <Text style={{
        fontSize: '16px',
        color: AlphaShoutTheme.colors.textSecondary,
        display: 'block'
      }}>
        Comprehensive financial analysis powered by institutional-grade data and AI insights
      </Text>
    </div>

    <div style={{
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '24px',
      marginBottom: '40px'
    }}>
      {[
        {
          icon: <FileTextOutlined style={{ fontSize: '28px' }} />,
          title: 'Income Statement',
          description: 'Quarterly and annual revenue, gross profit, operating income, EBITDA, net income with YoY comparisons',
          color: AlphaShoutTheme.colors.primary
        },
        {
          icon: <FundOutlined style={{ fontSize: '28px' }} />,
          title: 'Balance Sheet',
          description: 'Assets, liabilities, equity, debt ratios, working capital analysis, and financial health metrics',
          color: AlphaShoutTheme.colors.secondary
        },
        {
          icon: <DollarOutlined style={{ fontSize: '28px' }} />,
          title: 'Cash Flow Statement',
          description: 'Operating, investing, and financing activities, free cash flow, and cash conversion metrics',
          color: AlphaShoutTheme.colors.accent
        }
      ].map((item, index) => (
        <div key={index} style={{
          background: AlphaShoutTheme.colors.surface,
          padding: '24px',
          borderRadius: AlphaShoutTheme.radius.medium,
          border: `1px solid ${AlphaShoutTheme.colors.borderLight}`,
          transition: 'all 0.3s ease',
          cursor: 'default'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'translateY(-4px)';
          e.currentTarget.style.boxShadow = AlphaShoutTheme.shadows.large;
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'none';
        }}>
          <div style={{ color: item.color, marginBottom: '12px' }}>
            {item.icon}
          </div>
          <div style={{
            fontSize: '16px',
            fontWeight: 600,
            color: AlphaShoutTheme.colors.textPrimary,
            marginBottom: '8px'
          }}>
            {item.title}
          </div>
          <div style={{
            fontSize: '13px',
            color: AlphaShoutTheme.colors.textSecondary,
            lineHeight: '1.5'
          }}>
            {item.description}
          </div>
        </div>
      ))}
    </div>

    <div style={{
      background: `linear-gradient(135deg, ${AlphaShoutTheme.colors.primaryLight}10, ${AlphaShoutTheme.colors.accent}10)`,
      padding: '20px',
      borderRadius: AlphaShoutTheme.radius.medium,
      marginBottom: '24px'
    }}>
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        marginBottom: '12px'
      }}>
        <ExperimentOutlined style={{ fontSize: '20px', color: AlphaShoutTheme.colors.deepAnalysis }} />
        <Text strong style={{ fontSize: '15px', color: AlphaShoutTheme.colors.primaryDark }}>
          Deep Analysis Available
        </Text>
      </div>
      <Text style={{ fontSize: '13px', color: AlphaShoutTheme.colors.textSecondary, display: 'block' }}>
        Get enhanced AI-powered insights with Deep Analysis for Income Statement, Balance Sheet, and Cash Flow. 
        Deep Analysis provides detailed breakdowns, trend analysis, and predictive insights using advanced algorithms.
      </Text>
    </div>

    <div style={{
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '16px',
      background: AlphaShoutTheme.colors.surfaceLight,
      borderRadius: AlphaShoutTheme.radius.medium,
      border: `1px solid ${AlphaShoutTheme.colors.borderLight}`
    }}>
      <div>
        <Text strong style={{ fontSize: '14px', color: AlphaShoutTheme.colors.textPrimary }}>
          How to Start:
        </Text>
        <div style={{ marginTop: '8px' }}>
          <Text style={{ fontSize: '13px', color: AlphaShoutTheme.colors.textSecondary }}>
            1. Search for a stock symbol (e.g., AAPL, MSFT, TSLA)<br />
            2. Click "Analyze Stock" to generate comprehensive reports
          </Text>
        </div>
      </div>
      <div style={{ textAlign: 'right' }}>
        <Text style={{ fontSize: '12px', color: AlphaShoutTheme.colors.textTertiary }}>
          Token Cost:
        </Text>
        <div style={{ marginTop: '4px' }}>
          <Tag color="blue">Full Analysis: 3 tokens</Tag>
          <Tag color="green">Refresh: 1 token</Tag>
          <Tag color="purple">Deep Analysis: 2 tokens</Tag>
        </div>
      </div>
    </div>
  </div>
);

// AlphaShout Styled Components
const AlphaShoutButton = ({ children, primary, ...props }) => (
  <Button 
    {...props}
    style={{
      background: primary ? AlphaShoutTheme.colors.primary : AlphaShoutTheme.colors.surface,
      border: primary ? 'none' : `1px solid ${AlphaShoutTheme.colors.border}`,
      color: primary ? AlphaShoutTheme.colors.textInverse : AlphaShoutTheme.colors.primary,
      fontFamily: AlphaShoutTheme.fonts.primary,
      fontWeight: 500,
      borderRadius: AlphaShoutTheme.radius.medium,
      boxShadow: props.disabled ? 'none' : AlphaShoutTheme.shadows.small,
      transition: 'all 0.2s ease',
      ...props.style
    }}
  >
    {children}
  </Button>
);

const AlphaShoutCard = ({ children, ...props }) => (
  <Card
    {...props}
    style={{
      background: AlphaShoutTheme.colors.surface,
      borderRadius: AlphaShoutTheme.radius.medium,
      border: `1px solid ${AlphaShoutTheme.colors.borderLight}`,
      boxShadow: AlphaShoutTheme.shadows.card,
      ...props.style
    }}
  >
    {children}
  </Card>
);

const AlphaShoutInput = ({ ...props }) => (
  <Input
    {...props}
    style={{
      borderRadius: AlphaShoutTheme.radius.medium,
      border: `1px solid ${AlphaShoutTheme.colors.border}`,
      fontFamily: AlphaShoutTheme.fonts.primary,
      fontSize: '14px',
      transition: 'all 0.2s ease',
      ...props.style
    }}
    onFocus={(e) => {
      e.target.style.borderColor = AlphaShoutTheme.colors.secondary;
      e.target.style.boxShadow = `0 0 0 2px ${AlphaShoutTheme.colors.accent}20`;
      props.onFocus && props.onFocus(e);
    }}
    onBlur={(e) => {
      e.target.style.borderColor = AlphaShoutTheme.colors.border;
      e.target.style.boxShadow = 'none';
      props.onBlur && props.onBlur(e);
    }}
  />
);
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
    boxShadow: AlphaShoutTheme.shadows.medium
  }}>
    {DEMO_MESSAGES.demoNotice.title} - {DEMO_MESSAGES.demoNotice.content}
  </div>
);

// Refresh Button Component - Demo version
const RefreshButton = ({ onClick }) => (
  <button
    onClick={onClick}
    style={{
      background: AlphaShoutTheme.colors.surface,
      border: `1px solid ${AlphaShoutTheme.colors.primary}`,
      borderRadius: AlphaShoutTheme.radius.medium,
      padding: '4px 10px',
      color: AlphaShoutTheme.colors.primary,
      cursor: 'pointer',
      fontSize: '11px',
      fontWeight: 500,
      fontFamily: AlphaShoutTheme.fonts.primary,
      transition: 'all 0.2s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '4px'
    }}
  >
    <ReloadOutlined style={{ fontSize: '10px' }} />
    Refresh (1 token)
  </button>
);

// Deep Analysis Button Component - Demo version
const DeepAnalysisButton = ({ onClick }) => (
  <div style={{ marginLeft: '8px' }}>
    <Tooltip 
      title="Click to preview Deep Analysis features"
      placement="bottom"
    >
      <button
        onClick={onClick}
        style={{
          background: AlphaShoutTheme.colors.deepAnalysis,
          border: `1px solid ${AlphaShoutTheme.colors.deepAnalysis}`,
          borderRadius: AlphaShoutTheme.radius.medium,
          padding: '4px 10px',
          color: AlphaShoutTheme.colors.textInverse,
          cursor: 'pointer',
          fontSize: '11px',
          fontWeight: 500,
          fontFamily: AlphaShoutTheme.fonts.primary,
          transition: 'all 0.2s ease',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}
      >
        <ExperimentOutlined style={{ fontSize: '10px' }} />
        Deep Analysis (2 tokens)
      </button>
    </Tooltip>
  </div>
);

// Deep Analysis Wrapper with Blur effect
const DeepAnalysisWrapper = ({ children, isDemo }) => {
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
          border: '2px solid #8B008B'
        }}>
          <ExperimentOutlined style={{ 
            fontSize: '32px', 
            color: '#8B008B',
            marginBottom: '12px'
          }} />
          <h3 style={{ margin: '0 0 8px 0', color: '#333' }}>
            Unlock Complete Deep Analysis
          </h3>
          <p style={{ color: '#666', marginBottom: '16px' }}>
            Login to view full AI-powered insights and recommendations
          </p>
          <Button 
            type="primary"
            size="large"
            style={{ 
              background: '#8B008B',
              borderColor: '#8B008B'
            }}
            onClick={() => window.dispatchEvent(new CustomEvent('navigate-to-login', { detail: { page: 'login' } }))}
          >
            Register & Get 20 Free Tokens
          </Button>
        </div>
      </div>
    </div>
  );
};
// Main Demo Component
export default function StockthirteenDemo() {
  const {
    globalAnalysisData,
    setGlobalAnalysisData,
    globalDeepAnalysisData,
    setGlobalDeepAnalysisData,
    globalLoadingStates,
    setGlobalLoadingStates,
    setCurrentSymbol
  } = useAnalysis();
  
  // State
  const [query] = useState('AAPL'); // Fixed to AAPL
  const [showInstructions, setShowInstructions] = useState(true);
  const [showDemoBanner, setShowDemoBanner] = useState(false);
  
  // Initialize
  useEffect(() => {
    setCurrentSymbol('AAPL');
  }, []);
  
  // Handle search attempt
  const handleSearchClick = () => {
    showAlphaShoutMessage('info', (
      <span>
        <a onClick={() => window.dispatchEvent(new CustomEvent('navigate-to-login', { detail: { page: 'login' } }))}
           style={{ color: AlphaShoutTheme.colors.primary, textDecoration: 'underline', cursor: 'pointer' }}>
          {DEMO_MESSAGES.loginPrompt.buttonText}
        </a> {DEMO_MESSAGES.loginPrompt.content}
      </span>
    ));
  };
  
  // Handle demo analysis
  const handleDemoAnalysis = () => {
    setShowInstructions(false);
    setShowDemoBanner(true);
    setGlobalAnalysisData({
      incomeStatement: DEMO_DATA.AAPL.analysis.incomeStatement,
      balanceSheet: DEMO_DATA.AAPL.analysis.balanceSheet,
      cashFlow: DEMO_DATA.AAPL.analysis.cashFlow
    });
    showAlphaShoutMessage('info', 'Displaying AAPL demo data. Register to analyze any stock!');
  };
  
  // Handle refresh attempt
  const handleRefreshClick = () => {
    showAlphaShoutMessage('warning', (
      <span>
        Please <a 
          onClick={() => window.dispatchEvent(new CustomEvent('navigate-to-login', { detail: { page: 'login' } }))}
          style={{ color: AlphaShoutTheme.colors.primary, textDecoration: 'underline', cursor: 'pointer' }}
        >
          login
        </a> to refresh analysis
      </span>
    ));
  };
  
  // Handle deep analysis
  const handleDemoDeepAnalysis = (analysisType) => {
    // Show demo deep analysis
    setGlobalDeepAnalysisData(prev => ({
      ...prev,
      [analysisType]: DEMO_DATA.AAPL.deepAnalysis[analysisType]
    }));
    
    // Show modal after a delay
    setTimeout(() => {
      Modal.info({
        title: '🔍 Deep Analysis Preview',
        width: 500,
        content: (
          <div>
            <p style={{ marginBottom: '16px' }}>
              You're viewing a sample of our AI-powered deep analysis for AAPL.
            </p>
            
            <div style={{ background: '#f0f0f0', padding: '12px', borderRadius: '8px', marginBottom: '16px' }}>
              <strong>With a free account, you can:</strong>
              <ul style={{ marginTop: '8px', marginBottom: 0 }}>
                <li>Get real-time deep analysis for any stock</li>
                <li>Access complete AI insights and predictions</li>
                <li>Receive 20 free tokens to start</li>
                <li>Export analysis reports</li>
              </ul>
            </div>
            
            <p style={{ fontSize: '12px', color: '#666', marginBottom: 0 }}>
              Deep analysis uses advanced algorithms to provide institutional-grade insights.
            </p>
          </div>
        ),
        okText: 'Login to Get Full Access',
        onOk: () => {
          window.dispatchEvent(new CustomEvent('navigate-to-login', { detail: { page: 'login' } }));
        }
      });
    }, 100);
  };
  
  // AlphaShout Table Formatter functions with Markdown support - COMPLETE VERSION FROM STOCKTWELVE
const formatAlphaShoutTable = (text, isDeepAnalysis = false) => {
  if (!text || text === 'No data available') {
    return (
      <div style={{
        textAlign: 'center',
        padding: '40px',
        color: AlphaShoutTheme.colors.textTertiary,
        fontFamily: AlphaShoutTheme.fonts.primary,
        fontSize: '14px'
      }}>
        <InfoCircleOutlined style={{ fontSize: '32px', marginBottom: '16px', opacity: 0.5 }} />
        <div>No data available</div>
      </div>
    );
  }
  
  if (isDeepAnalysis) {
    return (
      <div>
        <div style={{
          background: `linear-gradient(90deg, ${AlphaShoutTheme.colors.deepAnalysis}, ${AlphaShoutTheme.colors.primary})`,
          color: AlphaShoutTheme.colors.textInverse,
          padding: '8px 16px',
          fontSize: '12px',
          fontWeight: 600,
          marginBottom: '16px',
          borderRadius: AlphaShoutTheme.radius.medium,
          display: 'flex',
          alignItems: 'center',
          gap: '8px'
        }}>
          <ExperimentOutlined />
          DEEP ANALYSIS RESULTS
        </div>
        {formatMarkdownContent(text)}
      </div>
    );
  }
  
  return formatMarkdownContent(text);
};

// Markdown content parser with AlphaShout styling - COMPLETE VERSION FROM STOCKTWELVE
const formatMarkdownContent = (text) => {
  const sections = text.split('\n\n').filter(section => section.trim());
  
  return (
    <div style={{ fontFamily: AlphaShoutTheme.fonts.primary }}>
      {sections.map((section, sectionIdx) => {
        // Check if it's a code block format
        if (section.trim().startsWith('```') || section.trim().startsWith('[') || section.trim().startsWith('{') || section.includes('fiscalYear')) {
          return (
            <div key={sectionIdx} style={{
              background: AlphaShoutTheme.colors.surfaceSecondary,
              border: `1px solid ${AlphaShoutTheme.colors.borderLight}`,
              borderRadius: AlphaShoutTheme.radius.medium,
              padding: '16px',
              marginBottom: '24px',
              fontFamily: AlphaShoutTheme.fonts.mono,
              fontSize: '13px',
              lineHeight: '1.6',
              color: AlphaShoutTheme.colors.textPrimary,
              overflowX: 'auto',
              whiteSpace: 'pre-wrap',
              wordBreak: 'break-word'
            }}>
              <div style={{
                background: `linear-gradient(90deg, ${AlphaShoutTheme.colors.primary}, ${AlphaShoutTheme.colors.primaryLight})`,
                color: AlphaShoutTheme.colors.textInverse,
                padding: '6px 12px',
                fontSize: '11px',
                fontWeight: 600,
                marginBottom: '12px',
                borderRadius: AlphaShoutTheme.radius.small,
                display: 'inline-block'
              }}>
                📊 STRUCTURED DATA
              </div>
              <pre style={{
                margin: 0,
                fontFamily: 'inherit',
                fontSize: 'inherit',
                lineHeight: 'inherit',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
                color: 'inherit'
              }}>
                {section.replace(/```[\w]*\n?/g, '').replace(/\*\*/g, '')}
              </pre>
            </div>
          );
        }

        // Markdown table processing
        if (section.includes('|') && section.split('\n').filter(line => line.includes('|')).length > 1) {
          const lines = section.split('\n').filter(line => {
            const trimmed = line.trim();
            return trimmed && !trimmed.match(/^[|:\s-]+$/) && !trimmed.match(/---+/);
          });
          const rows = lines.map(line => 
            line.split('|').map(cell => cell.trim()).filter(cell => cell)
          );
          
          if (rows.length > 0) {
            return (
              <div key={sectionIdx} style={{ 
                overflowX: 'auto', 
                marginBottom: '24px',
                width: '100%'
              }}>
                <table style={{
                  width: '100%',
                  borderCollapse: 'collapse',
                  fontFamily: AlphaShoutTheme.fonts.primary,
                  fontSize: '14px',
                  backgroundColor: AlphaShoutTheme.colors.surface,
                  tableLayout: 'fixed'
                }}>
                  <thead>
                    <tr style={{ backgroundColor: AlphaShoutTheme.colors.tableHeader }}>
                      {rows[0].map((cell, idx) => (
                        <th key={idx} style={{
                          padding: '12px 16px',
                          textAlign: idx === 0 ? 'left' : 'right',
                          fontWeight: 600,
                          fontSize: '13px',
                          color: AlphaShoutTheme.colors.textSecondary,
                          borderBottom: `2px solid ${AlphaShoutTheme.colors.border}`,
                          wordWrap: 'break-word',
                          width: idx === 0 ? '30%' : `${70 / (rows[0].length - 1)}%`
                        }}>
                          {parseInlineMarkdown(cell)}
                        </th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {rows.slice(1).map((row, rowIdx) => (
                      <tr key={rowIdx} style={{
                        backgroundColor: rowIdx % 2 === 0 ? AlphaShoutTheme.colors.surface : AlphaShoutTheme.colors.tableRowAlt,
                        transition: 'background-color 0.2s'
                      }}>
                        {row.map((cell, cellIdx) => (
                          <td key={cellIdx} style={{
                            padding: '10px 16px',
                            textAlign: cellIdx === 0 ? 'left' : 'right',
                            borderBottom: `1px solid ${AlphaShoutTheme.colors.borderLight}`,
                            color: AlphaShoutTheme.colors.textPrimary,
                            fontWeight: cellIdx === 0 ? 500 : 400,
                            wordWrap: 'break-word',
                            wordBreak: 'break-word',
                            overflowWrap: 'break-word',
                            maxWidth: '0',
                            lineHeight: '1.4'
                          }}>
                            {parseInlineMarkdown(cell)}
                          </td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          }
        }
        
        return parseMarkdownSection(section, sectionIdx);
      })}
    </div>
  );
};

// Parse individual markdown section
const parseMarkdownSection = (section, sectionIdx) => {
  const lines = section.split('\n').filter(line => {
    const trimmed = line.trim();
    return trimmed && !trimmed.match(/---+/);
  });
  
  if (lines.length === 0) return null;
  const firstLine = lines[0];
  
  // Markdown header processing
  if (firstLine.match(/^#{1,6}\s/)) {
    const level = (firstLine.match(/^#+/) || [''])[0].length;
    const headerText = firstLine.replace(/^#+\s*/, '').replace(/\*\*/g, '').trim();
    
    // H1-H2: main headers
    if (level <= 2) {
      return (
        <div key={sectionIdx} style={{ 
          marginBottom: '32px',
          width: '100%'
        }}>
          <div style={{
            background: `linear-gradient(135deg, ${AlphaShoutTheme.colors.primaryDark} 0%, ${AlphaShoutTheme.colors.primary} 100%)`,
            color: AlphaShoutTheme.colors.textInverse,
            padding: '16px 24px',
            fontSize: level === 1 ? '20px' : '18px',
            fontWeight: 700,
            letterSpacing: '0.5px',
            marginBottom: '20px',
            width: '100%',
            boxShadow: AlphaShoutTheme.shadows.large,
            borderRadius: AlphaShoutTheme.radius.medium,
            wordWrap: 'break-word',
            overflowWrap: 'break-word',
            border: `2px solid ${AlphaShoutTheme.colors.accent}`
          }}>
            {level === 1 ? '📊' : '📈'} {parseInlineMarkdown(headerText)}
          </div>
          {lines.slice(1).length > 0 && formatMarkdownLines(lines.slice(1))}
        </div>
      );
    }
    // H3-H4: secondary headers
    else if (level <= 4) {
      return (
        <div key={sectionIdx} style={{ 
          marginBottom: '24px',
          width: '100%'
        }}>
          <div style={{
            background: `linear-gradient(135deg, ${AlphaShoutTheme.colors.primary} 0%, ${AlphaShoutTheme.colors.primaryLight} 100%)`,
            color: AlphaShoutTheme.colors.textInverse,
            padding: '12px 20px',
            fontSize: '16px',
            fontWeight: 600,
            letterSpacing: '0.3px',
            marginBottom: '16px',
            width: '100%',
            borderRadius: AlphaShoutTheme.radius.medium,
            wordWrap: 'break-word',
            overflowWrap: 'break-word'
          }}>
            {parseInlineMarkdown(headerText)}
          </div>
          {lines.slice(1).length > 0 && formatMarkdownLines(lines.slice(1))}
        </div>
      );
    }
    // H5-H6: small headers
    else {
      return (
        <div key={sectionIdx} style={{ 
          marginBottom: '16px',
          width: '100%'
        }}>
          <div style={{
            backgroundColor: AlphaShoutTheme.colors.accent,
            color: AlphaShoutTheme.colors.textInverse,
            padding: '8px 16px',
            fontSize: '14px',
            fontWeight: 600,
            marginBottom: '12px',
            borderRadius: AlphaShoutTheme.radius.medium,
            wordWrap: 'break-word',
            overflowWrap: 'break-word'
          }}>
            {parseInlineMarkdown(headerText)}
          </div>
          {lines.slice(1).length > 0 && formatMarkdownLines(lines.slice(1))}
        </div>
      );
    }
  }
  
  return (
    <div key={sectionIdx} style={{
      marginBottom: '16px',
      width: '100%'
    }}>
      {formatMarkdownLines(lines)}
    </div>
  );
};

// Format markdown lines
const formatMarkdownLines = (lines) => {
  return (
    <div style={{ width: '100%' }}>
      {lines.map((line, lineIdx) => {
        if (line.match(/---+/)) return null;
        
        // Markdown quotes
        if (line.trim().startsWith('>')) {
          const cleanLine = line.replace(/^>\s*/, '');
          return (
            <div key={lineIdx} style={{
              padding: '16px 20px',
              backgroundColor: AlphaShoutTheme.colors.surfaceSecondary,
              borderLeft: `4px solid ${AlphaShoutTheme.colors.accent}`,
              marginTop: '16px',
              marginBottom: '16px',
              fontStyle: 'italic',
              fontSize: '14px',
              color: AlphaShoutTheme.colors.textPrimary,
              wordWrap: 'break-word',
              overflowWrap: 'break-word',
              borderRadius: `0 ${AlphaShoutTheme.radius.medium} ${AlphaShoutTheme.radius.medium} 0`
            }}>
              <strong>💡 {parseInlineMarkdown(cleanLine)}</strong>
            </div>
          );
        }
        
        // Handle bold numbered headers (e.g., **1.Revenue & Profitability**)
        if (line.match(/^\*\*\d+\./)) {
          const match = line.match(/^\*\*(\d+)\.\s*([^*]*)\*\*(.*)$/);
          if (match) {
            const number = match[1];
            const title = match[2];
            const content = match[3];
            
            return (
              <div key={lineIdx} style={{
                marginBottom: '20px',
                width: '100%'
              }}>
                <div style={{
                  background: `linear-gradient(135deg, ${AlphaShoutTheme.colors.primaryDark} 0%, ${AlphaShoutTheme.colors.primary} 100%)`,
                  color: AlphaShoutTheme.colors.textInverse,
                  padding: '12px 20px',
                  fontSize: '16px',
                  fontWeight: 700,
                  marginBottom: '12px',
                  borderRadius: AlphaShoutTheme.radius.medium,
                  wordWrap: 'break-word',
                  overflowWrap: 'break-word',
                  boxShadow: AlphaShoutTheme.shadows.medium,
                  border: `2px solid ${AlphaShoutTheme.colors.accent}`
                }}>
                  <span style={{ 
                    backgroundColor: 'rgba(255,255,255,0.2)',
                    padding: '4px 8px',
                    borderRadius: '4px',
                    marginRight: '12px',
                    fontSize: '14px',
                    fontWeight: '800'
                  }}>
                    {number}
                  </span>
                  {parseInlineMarkdown(title)}
                  {content && parseInlineMarkdown(content)}
                </div>
              </div>
            );
          }
        }
        
        // Markdown ordered lists (normal format)
        if (line.match(/^\d+\.\s/) && !line.match(/^\*\*/)) {
          const match = line.match(/^(\d+)\.\s*(.*)$/);
          const number = match ? match[1] : (lineIdx + 1);
          const cleanLine = match ? match[2] : line.replace(/^\d+\.\s*/, '');
          
          return (
            <div key={lineIdx} style={{
              padding: '8px 16px 8px 40px',
              fontSize: '14px',
              color: AlphaShoutTheme.colors.textPrimary,
              backgroundColor: AlphaShoutTheme.colors.surfaceLight,
              marginBottom: '4px',
              borderLeft: `3px solid ${AlphaShoutTheme.colors.primary}`,
              wordWrap: 'break-word',
              overflowWrap: 'break-word',
              position: 'relative'
            }}>
              <span style={{
                position: 'absolute',
                left: '16px',
                fontWeight: 600,
                color: AlphaShoutTheme.colors.primary
              }}>
                {number}.
              </span>
              {parseInlineMarkdown(cleanLine)}
            </div>
          );
        }
        
        // Handle bold bullet points (e.g., **•Net Income**: xxx)
        if (line.match(/^\*\*•/)) {
          const match = line.match(/^\*\*•([^*:]+)\*\*:\s*(.*)$/);
          if (match) {
            const label = match[1];
            const content = match[2];
            
            return (
              <div key={lineIdx} style={{
                padding: '10px 16px 10px 40px',
                fontSize: '14px',
                backgroundColor: AlphaShoutTheme.colors.surfaceSecondary,
                marginBottom: '8px',
                borderLeft: `3px solid ${AlphaShoutTheme.colors.accent}`,
                wordWrap: 'break-word',
                overflowWrap: 'break-word',
                position: 'relative'
              }}>
                <span style={{
                  position: 'absolute',
                  left: '20px',
                  color: AlphaShoutTheme.colors.accent,
                  fontWeight: 'bold',
                  fontSize: '16px'
                }}>
                  •
                </span>
                <div>
                  <span style={{
                    color: AlphaShoutTheme.colors.primary,
                    fontWeight: 600,
                    fontSize: '14px'
                  }}>
                    {label}:
                  </span>
                  <span style={{
                    color: AlphaShoutTheme.colors.textPrimary,
                    marginLeft: '8px'
                  }}>
                    {parseInlineMarkdown(content)}
                  </span>
                </div>
              </div>
            );
          }
        }
        
        // Markdown unordered lists
        if (line.match(/^[\*\-\+]\s/) || line.match(/^\s*[\*\-\+]\s/)) {
          const cleanLine = line.replace(/^[\s]*[\*\-\+]\s*/, '');
          return (
            <div key={lineIdx} style={{
              padding: '8px 16px 8px 32px',
              fontSize: '13px',
              color: AlphaShoutTheme.colors.textSecondary,
              backgroundColor: AlphaShoutTheme.colors.surfaceSecondary,
              marginBottom: '4px',
              borderLeft: `2px solid ${AlphaShoutTheme.colors.warning}`,
              wordWrap: 'break-word',
              overflowWrap: 'break-word',
              lineHeight: '1.5'
            }}>
              <span style={{ 
                color: AlphaShoutTheme.colors.warning,
                fontWeight: 'bold',
                marginRight: '8px'
              }}>
                •
              </span>
              {parseInlineMarkdown(cleanLine)}
            </div>
          );
        }
        
        // Handle numbered items with bold headers (e.g., 1. **Title**: content)
        if (line.match(/^\d+\.\s+\*\*.*\*\*:/) || line.match(/^-\s+\*\*.*\*\*:/)) {
          const parts = line.split(':');
          const titlePart = parts[0].replace(/^\d+\.\s+/, '').replace(/^-\s+/, '').replace(/\*\*/g, '').trim();
          const contentPart = parts.slice(1).join(':').trim();
          
          return (
            <div key={lineIdx} style={{
              padding: '12px 16px',
              backgroundColor: lineIdx % 2 === 0 ? AlphaShoutTheme.colors.surfaceLight : AlphaShoutTheme.colors.surface,
              borderLeft: `3px solid ${AlphaShoutTheme.colors.accent}`,
              marginBottom: '8px'
            }}>
              <div style={{
                fontSize: '14px',
                fontWeight: 600,
                color: AlphaShoutTheme.colors.primary,
                marginBottom: '4px',
                wordWrap: 'break-word',
                overflowWrap: 'break-word'
              }}>
                {titlePart}
              </div>
              <div style={{
                fontSize: '13px',
                color: AlphaShoutTheme.colors.textSecondary,
                lineHeight: '1.6',
                wordWrap: 'break-word',
                overflowWrap: 'break-word'
              }}>
                {formatLineContent(contentPart)}
              </div>
            </div>
          );
        }
        
        // Handle colon-separated data (Key: Value format)
        if (line.includes(':') && !line.startsWith('>') && !line.startsWith('*')) {
          const [key, ...valueParts] = line.split(':');
          const value = valueParts.join(':').trim();
          const cleanKey = key.replace(/^[•·]\s*/, '').replace(/\*\*/g, '').trim();
          
          return (
            <div key={lineIdx} style={{
              display: 'flex',
              justifyContent: 'space-between',
              padding: '8px 16px',
              backgroundColor: lineIdx % 2 === 0 ? AlphaShoutTheme.colors.surfaceLight : AlphaShoutTheme.colors.surface,
              borderLeft: `3px solid ${AlphaShoutTheme.colors.accent}`,
              marginBottom: '2px',
              width: '100%',
              gap: '16px'
            }}>
              <span style={{ 
                color: AlphaShoutTheme.colors.textSecondary,
                fontSize: '13px',
                fontWeight: 500,
                flexShrink: 1,
                wordWrap: 'break-word',
                overflowWrap: 'break-word',
                minWidth: '0'
              }}>
                {cleanKey}
              </span>
              <span style={{ 
                color: AlphaShoutTheme.colors.textPrimary,
                fontSize: '13px',
                fontWeight: 600,
                textAlign: 'right',
                flexShrink: 0,
                wordWrap: 'break-word',
                overflowWrap: 'break-word'
              }}>
                {formatValue(value)}
              </span>
            </div>
          );
        }
        
        // Regular paragraphs
        return (
          <div key={lineIdx} style={{
            padding: '8px 16px',
            fontSize: '14px',
            lineHeight: '1.6',
            color: AlphaShoutTheme.colors.textPrimary,
            marginBottom: '8px',
            wordWrap: 'break-word',
            overflowWrap: 'break-word'
          }}>
            {parseInlineMarkdown(line)}
          </div>
        );
      }).filter(Boolean)}
    </div>
  );
};

// Parse inline markdown (bold, italic, code, links)
const parseInlineMarkdown = (text) => {
  if (!text) return text;
  
  // Simple approach - just remove markdown syntax for now
  let cleanText = text.replace(/\*\*/g, '').replace(/\*/g, '').trim();
  
  // Keep parenthetical numbers as they are
  cleanText = cleanText.replace(/\(([^)]+)\)/g, (match, p1) => {
    if (p1.match(/^\d+\.?\d*[BMK]?$/)) {
      return `(${p1})`;
    }
    return match;
  });
  
  return cleanText;
};

// Format line content helper
const formatLineContent = (text) => {
  if (!text) return text;
  
  let cleanText = text.replace(/\*\*/g, '').replace(/\*/g, '').trim();
  
  cleanText = cleanText.replace(/\(([^)]+)\)/g, (match, p1) => {
    if (p1.match(/^\d+\.?\d*[BMK]?$/)) {
      return `(${p1})`;
    }
    return match;
  });
  
  return cleanText;
};

// Format value with proper styling for financial data
const formatValue = (value) => {
  if (!value) return value;
  
  const cleanValue = value.replace(/[\*\#]/g, '').trim();
  
  if (cleanValue.includes('%')) {
    const isPositive = cleanValue.includes('+') || (parseFloat(cleanValue) > 0 && !cleanValue.includes('-'));
    const isNegative = cleanValue.includes('-');
    
    return (
      <span style={{
        color: isNegative ? AlphaShoutTheme.colors.error : 
               isPositive ? AlphaShoutTheme.colors.success : 
               AlphaShoutTheme.colors.textPrimary,
        fontWeight: 600
      }}>
        {isPositive && <RiseOutlined style={{ marginRight: '4px', fontSize: '11px' }} />}
        {isNegative && <FallOutlined style={{ marginRight: '4px', fontSize: '11px' }} />}
        {cleanValue}
      </span>
    );
  }
  
  if (cleanValue.includes('M') || cleanValue.includes('B')) {
    return (
      <span style={{
        color: AlphaShoutTheme.colors.primary,
        fontWeight: 600,
        fontFamily: AlphaShoutTheme.fonts.mono
      }}>
        {cleanValue}
      </span>
    );
  }
  
  return cleanValue;
};

  return (
    <>
      <style>
        {`
          @keyframes pulse {
            0% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.8; transform: scale(1.02); }
            100% { opacity: 1; transform: scale(1); }
          }
          body { padding-top: ${showDemoBanner ? '40px' : '0'}; }
        `}
      </style>
      
      <DemoModeBanner isVisible={showDemoBanner} />
      
      <div style={{ minHeight: '100vh', background: AlphaShoutTheme.colors.background, padding: '24px' }}>
        
        {/* Login prompt instead of quota display */}
        <div style={{
          position: 'fixed',
          top: '24px',
          right: '24px',
          background: AlphaShoutTheme.colors.surface,
          padding: '12px 20px',
          borderRadius: AlphaShoutTheme.radius.medium,
          border: `1px solid ${AlphaShoutTheme.colors.border}`,
          boxShadow: AlphaShoutTheme.shadows.medium,
          zIndex: 1000,
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          cursor: 'pointer'
        }}
        onClick={() => window.dispatchEvent(new CustomEvent('navigate-to-login', { detail: { page: 'login' } }))}>
          <LoginOutlined style={{ fontSize: '18px', color: AlphaShoutTheme.colors.primary }} />
          <div>
            <div style={{ fontSize: '14px', color: AlphaShoutTheme.colors.textPrimary, fontWeight: 500 }}>
              Login to Start
            </div>
          </div>
        </div>
        
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '48px', padding: '48px 0' }}>
            <Title level={1} style={{ 
              marginBottom: '8px',
              color: AlphaShoutTheme.colors.primary,
              fontWeight: 600,
              fontSize: '42px'
            }}>
              Financial Statement AI Deep Analysis
            </Title>
            <Text style={{ 
              fontSize: '16px',
              color: AlphaShoutTheme.colors.textSecondary
            }}>
              Professional stock analysis with institutional-grade insights
            </Text>
          </div>
          
          {showInstructions && <UsageInstructions />}
          
          {/* Search Card */}
          <AlphaShoutCard style={{ marginBottom: '24px' }}>
            <div style={{ padding: '24px' }}>
              <label style={{ 
                display: 'block',
                fontSize: '13px',
                fontWeight: 500,
                color: AlphaShoutTheme.colors.textSecondary,
                marginBottom: '12px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Stock Symbol Search
              </label>
              <Tooltip 
  title="Register to unlock analysis for more stocks & Get 20 free tokens!"
  placement="top"
  mouseEnterDelay={0.5}
>
              <AlphaShoutInput
                size="large"
                placeholder="AAPL (Demo Mode)"
                prefix={<SearchOutlined style={{ color: AlphaShoutTheme.colors.primary }} />}
                value={query}
                onClick={handleSearchClick}
                readOnly
                style={{ 
                  height: '44px',
                  width: '100%',
                  cursor: 'not-allowed'
                }}
              /></Tooltip>
              
              <div style={{ marginTop: '32px', textAlign: 'center' }}>
                <AlphaShoutButton
                  primary
                  size="large"
                  icon={<BarChartOutlined />}
                  onClick={handleDemoAnalysis}
                  style={{
                    height: '44px',
                    fontSize: '15px',
                    padding: '0 32px',
                    animation: !globalAnalysisData.incomeStatement ? 'pulse 2s infinite' : 'none'
                  }}
                >
                  Try Demo Analysis (Free)
                </AlphaShoutButton>
                
                <div style={{ marginTop: '8px', fontSize: '12px', color: AlphaShoutTheme.colors.textSecondary }}>
                  See AAPL analysis example
                </div>
              </div>
            </div>
          </AlphaShoutCard>
          
          {/* Analysis Results */}
          {(globalAnalysisData.incomeStatement || globalAnalysisData.balanceSheet || globalAnalysisData.cashFlow) && (
            <AlphaShoutCard>
              <div style={{ padding: '24px' }}>
                <Tabs 
                  defaultActiveKey="income"
                  type="card"
                  items={[
                    // Income Statement Tab
                    globalAnalysisData.incomeStatement && {
                      key: 'income',
                      label: (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                          <FileTextOutlined />
                          Income Statement
                        </div>
                      ),
                      children: (
                        <div>
                          <div style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center',
                            marginBottom: '20px'
                          }}>
                            <Text style={{ fontSize: '16px', color: AlphaShoutTheme.colors.primary, fontWeight: 600 }}>
                              Revenue, Profitability & Growth Analysis
                            </Text>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                              <RefreshButton onClick={handleRefreshClick} />
                              <DeepAnalysisButton onClick={() => handleDemoDeepAnalysis('income')} />
                            </div>
                          </div>
                          <DeepAnalysisWrapper isDemo={globalDeepAnalysisData.income}>
                            {globalDeepAnalysisData.income ? 
                              formatAlphaShoutTable(globalDeepAnalysisData.income, true) : 
                              formatAlphaShoutTable(globalAnalysisData.incomeStatement)}
                          </DeepAnalysisWrapper>
                        </div>
                      )
                    },
                    globalAnalysisData.balanceSheet && {
  key: 'balance',
  label: (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <FundOutlined />
      Balance Sheet
    </div>
  ),
  children: (
    <div>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <Text style={{ fontSize: '16px', color: AlphaShoutTheme.colors.secondary, fontWeight: 600 }}>
          Assets, Liabilities & Financial Position
        </Text>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <RefreshButton onClick={handleRefreshClick} />
          <DeepAnalysisButton onClick={() => handleDemoDeepAnalysis('balance')} />
        </div>
      </div>
      <DeepAnalysisWrapper isDemo={globalDeepAnalysisData.balance}>
        {globalDeepAnalysisData.balance ? 
          formatAlphaShoutTable(globalDeepAnalysisData.balance, true) : 
          formatAlphaShoutTable(globalAnalysisData.balanceSheet)}
      </DeepAnalysisWrapper>
    </div>
  )
},

// Cash Flow Tab
globalAnalysisData.cashFlow && {
  key: 'cashflow',
  label: (
    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
      <DollarOutlined />
      Cash Flow
    </div>
  ),
  children: (
    <div>
      <div style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center',
        marginBottom: '20px'
      }}>
        <Text style={{ fontSize: '16px', color: AlphaShoutTheme.colors.accent, fontWeight: 600 }}>
          Operating, Investing & Financing Activities
        </Text>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <RefreshButton onClick={handleRefreshClick} />
          <DeepAnalysisButton onClick={() => handleDemoDeepAnalysis('cashflow')} />
        </div>
      </div>
      <DeepAnalysisWrapper isDemo={globalDeepAnalysisData.cashflow}>
        {globalDeepAnalysisData.cashflow ? 
          formatAlphaShoutTable(globalDeepAnalysisData.cashflow, true) : 
          formatAlphaShoutTable(globalAnalysisData.cashFlow)}
      </DeepAnalysisWrapper>
    </div>
  )
}
                  ].filter(Boolean)}
                />
              </div>
            </AlphaShoutCard>
          )}
        </div>
      </div>
    </>
  );
}