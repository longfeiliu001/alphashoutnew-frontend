// Stockthirteen.js - Fixed Markdown Parsing Version with Tabs
import React, { useState, useEffect, useRef } from 'react';
import { Button, Input, Divider, Spin, Empty, Card, Typography, Tag, Space, Avatar, message, Modal, Tooltip, Tabs } from 'antd';
import { SearchOutlined, StockOutlined, InfoCircleOutlined, UserOutlined, LoginOutlined, ReloadOutlined, DollarOutlined, BarChartOutlined, ExclamationCircleOutlined, ExperimentOutlined, CheckCircleOutlined, ClockCircleOutlined, FileTextOutlined, FundOutlined, RiseOutlined, FallOutlined } from '@ant-design/icons';
import { useAnalysis } from './AnalysisContext'; // Import the global context

const { Title, Text, Paragraph } = Typography;
const { TabPane } = Tabs;

// API Configuration
const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

// Cache key for localStorage
const CACHE_KEY = 'stocknine_analysis_cache';
const CACHE_EXPIRY = 30 * 60 * 1000; // 30 minutes

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

// Quota Display Component
const QuotaDisplay = ({ quota, onRecharge, isAuthenticated }) => {
  if (!isAuthenticated) {
    return (
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
        fontFamily: AlphaShoutTheme.fonts.primary,
        cursor: 'pointer'
      }}
      onClick={() => {
        // Navigate to login page
        window.dispatchEvent(new CustomEvent('navigate-to-login', { detail: { page: 'login' } }));
      }}>
        <LoginOutlined style={{ fontSize: '18px', color: AlphaShoutTheme.colors.primary }} />
        <div>
          <div style={{ fontSize: '14px', color: AlphaShoutTheme.colors.textPrimary, fontWeight: 500 }}>
            Login to Start
          </div>
        </div>
      </div>
    );
  }
  
  if (!quota) return null;
  
  const quotaColor = quota.available_quota <= 5 ? AlphaShoutTheme.colors.error : 
                     quota.available_quota <= 20 ? AlphaShoutTheme.colors.warning : 
                     AlphaShoutTheme.colors.success;
  
  return (
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
      fontFamily: AlphaShoutTheme.fonts.primary
    }}>
      <DollarOutlined style={{ fontSize: '18px', color: quotaColor }} />
      <div>
        <div style={{ fontSize: '11px', color: AlphaShoutTheme.colors.textTertiary, fontWeight: 400 }}>
          Available Tokens
        </div>
        <div style={{ fontSize: '16px', fontWeight: 600, color: quotaColor }}>
          {quota.available_quota}
        </div>
      </div>
      {quota.available_quota <= 5 && (
        <Tooltip title="Recharge tokens">
          <AlphaShoutButton 
            size="small" 
            primary
            onClick={onRecharge}
            style={{ marginLeft: '8px', fontSize: '12px' }}
          >
            Recharge
          </AlphaShoutButton>
        </Tooltip>
      )}
    </div>
  );
};

// Enhanced Refresh Button Component without Cancel functionality
const RefreshButton = ({ onClick, loading, dataType, isAuthenticated }) => {
  const handleClick = () => {
    if (!isAuthenticated) {
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
      return;
    }
    onClick();
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      style={{
        background: loading ? AlphaShoutTheme.colors.surfaceSecondary : AlphaShoutTheme.colors.surface,
        border: `1px solid ${AlphaShoutTheme.colors.primary}`,
        borderRadius: AlphaShoutTheme.radius.medium,
        padding: '4px 10px',
        color: AlphaShoutTheme.colors.primary,
        cursor: loading ? 'not-allowed' : 'pointer',
        fontSize: '11px',
        fontWeight: 500,
        fontFamily: AlphaShoutTheme.fonts.primary,
        transition: 'all 0.2s ease',
        display: 'flex',
        alignItems: 'center',
        gap: '4px'
      }}
    >
      {loading ? (
        <>
          <Spin size="small" />
          Loading...
        </>
      ) : (
        <>
          <ReloadOutlined style={{ fontSize: '10px' }} />
          Refresh (1 token)
        </>
      )}
    </button>
  );
};

// Enhanced Deep Analysis Button Component without Cancel functionality
const DeepAnalysisButton = ({ onClick, loading, dataType, isAuthenticated }) => {
  const handleClick = () => {
    if (!isAuthenticated) {
      showAlphaShoutMessage('warning', (
        <span>
          Please <a 
            onClick={() => window.dispatchEvent(new CustomEvent('navigate-to-login', { detail: { page: 'login' } }))}
            style={{ color: AlphaShoutTheme.colors.primary, textDecoration: 'underline', cursor: 'pointer' }}
          >
            login
          </a> to use deep analysis
        </span>
      ));
      return;
    }
    onClick();
  };

  return (
    <div style={{ marginLeft: '8px' }}>
      <button
        onClick={handleClick}
        disabled={loading}
        style={{
          background: loading ? AlphaShoutTheme.colors.surfaceSecondary : AlphaShoutTheme.colors.deepAnalysis,
          border: `1px solid ${AlphaShoutTheme.colors.deepAnalysis}`,
          borderRadius: AlphaShoutTheme.radius.medium,
          padding: '4px 10px',
          color: AlphaShoutTheme.colors.textInverse,
          cursor: loading ? 'not-allowed' : 'pointer',
          fontSize: '11px',
          fontWeight: 500,
          fontFamily: AlphaShoutTheme.fonts.primary,
          transition: 'all 0.2s ease',
          display: 'flex',
          alignItems: 'center',
          gap: '4px'
        }}
      >
        {loading ? (
          <>
            <Spin size="small" style={{ color: 'white' }} />
            Analyzing...
          </>
        ) : (
          <>
            <ExperimentOutlined style={{ fontSize: '10px' }} />
            Deep Analysis (2 tokens)
          </>
        )}
      </button>
    </div>
  );
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

// Main Component
export default function StockAnalysisDashboard() {
  // Get global context
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
    getAbortController,
    cancelAllOperations,
    cancelOperation,
    hasActiveOperations
  } = useAnalysis();
  
  // Local state for UI-specific things
  const [userQuota, setUserQuota] = useState(null);
  const [quotaConfig, setQuotaConfig] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showInstructions, setShowInstructions] = useState(true);
  const [authMessage, setAuthMessage] = useState('');
  
  // Search states (keep local as they're UI-specific)
  const [query, setQuery] = useState(currentSymbol || 'AAPL');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  
  // Use global states for analysis data
  const analysisData = globalAnalysisData;
  const setAnalysisData = setGlobalAnalysisData;
  const deepAnalysisData = globalDeepAnalysisData;
  const setDeepAnalysisData = setGlobalDeepAnalysisData;
  const loadingStates = globalLoadingStates;
  const setLoadingStates = setGlobalLoadingStates;
  
  // Refs
  const dropdownRef = useRef(null);
  const searchTimeoutRef = useRef(null);
  
  // Add dropdown styles
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      .ant-input-affix-wrapper {
        z-index: 1 !important;
      }
      
      .stock-dropdown {
        position: absolute !important;
        z-index: 99999 !important;
        background: white !important;
        border: 1px solid #d4d7dc !important;
        border-radius: 4px !important;
        box-shadow: 0 8px 24px rgba(0, 0, 0, 0.2) !important;
        max-height: 300px !important;
        overflow-y: auto !important;
      }
      
      .stock-dropdown-item {
        padding: 12px 16px !important;
        cursor: pointer !important;
        transition: background-color 0.2s ease !important;
      }
      
      .stock-dropdown-item:hover {
        background-color: #f8f9fa !important;
      }
    `;
    document.head.appendChild(style);
    
    return () => {
      if (style.parentNode) {
        style.parentNode.removeChild(style);
      }
    };
  }, []);
  
  // Update global symbol when it changes
  useEffect(() => {
    if (query && query !== currentSymbol) {
      setCurrentSymbol(query);
    }
    // Set default symbol if none exists
    if (!currentSymbol && !query) {
      setQuery('AAPL');
      setCurrentSymbol('AAPL');
    }
  }, [query, currentSymbol, setCurrentSymbol]);
  
  // Load cached data or global data on mount
  useEffect(() => {
    // Check if we have global data first
    if (globalAnalysisData && Object.keys(globalAnalysisData).length > 0) {
      setShowInstructions(false);
    } else {
      // Try to load from cache
      const cached = localStorage.getItem(CACHE_KEY);
      if (cached) {
        const { data, timestamp, symbol } = JSON.parse(cached);
        if (Date.now() - timestamp < CACHE_EXPIRY) {
          if (symbol) setQuery(symbol);
          if (data.analysisData && Object.keys(data.analysisData).length > 0) {
            setGlobalAnalysisData(data.analysisData);
            setShowInstructions(false);
          }
          if (data.deepAnalysisData) {
            setGlobalDeepAnalysisData(data.deepAnalysisData);
          }
        }
      }
    }
    
    // Set default symbol if no symbol is set
    if (!query && !currentSymbol) {
      setQuery('AAPL');
      setCurrentSymbol('AAPL');
    }
  }, []);
  
  // Save to cache whenever data changes
  useEffect(() => {
    if (Object.keys(analysisData).length > 0 || Object.values(deepAnalysisData).some(v => v !== null)) {
      const cacheData = {
        data: { analysisData, deepAnalysisData },
        timestamp: Date.now(),
        symbol: query
      };
      localStorage.setItem(CACHE_KEY, JSON.stringify(cacheData));
    }
  }, [analysisData, deepAnalysisData, query]);
  
  // Check Authentication
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
  
  // Fetch User Quota
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
  
  // Fetch Quota Config
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
  
  // Initialize
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
  }, []);
  
  // Search Symbols using Alpha Vantage - FIXED VERSION with Country
  const searchSymbols = async (searchQuery) => {
    console.log('searchSymbols called with:', searchQuery);
    
    if (!searchQuery || typeof searchQuery !== 'string') {
      setResults([]);
      setShowDropdown(false);
      setLoading(false);
      return;
    }
    
    const trimmedQuery = searchQuery.trim();
    
    if (trimmedQuery.length < 2) {
      setResults([]);
      setShowDropdown(false);
      setLoading(false);
      return;
    }

    // Create abort controller for search
    const searchAbortController = new AbortController();
    setLoading(true);
    
    try {
      const response = await fetch(
        `${API_BASE_URL}/api/stock/search-us-equity?query=${encodeURIComponent(trimmedQuery)}`,
        { 
          signal: searchAbortController.signal,
          credentials: 'include'
        }
      );
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Search API response:', data);
      
      if (searchAbortController.signal.aborted) {
        return;
      }
      
      // Check both possible response formats from server
      if (data.success && data.bestMatches && Array.isArray(data.bestMatches) && data.bestMatches.length > 0) {
        // Alpha Vantage format from /api/stock/search-us-equity
        const transformedResults = data.bestMatches.map(match => ({
          symbol: match.symbol,
          instrument_name: match.instrument_name,
          country: match.region || match.country || 'United States',
          instrument_type: match.instrument_type || 'Equity'
        }));
        
        console.log('Alpha Vantage transformed results:', transformedResults);
        
        setResults(transformedResults);
        setShowDropdown(true);
        setSelectedIndex(-1);
      } else if (data.success && data.symbols && Array.isArray(data.symbols) && data.symbols.length > 0) {
        // Alternative format that might be returned
        const transformedResults = data.symbols.map(match => ({
          symbol: match.symbol,
          instrument_name: match.instrument_name,
          country: match.region || match.country || 'United States',
          instrument_type: match.instrument_type || 'Equity'
        }));
        
        console.log('Alternative format transformed results:', transformedResults);
        
        setResults(transformedResults);
        setShowDropdown(true);
        setSelectedIndex(-1);
      } else {
        console.log('No results found in response:', data);
        setResults([]);
        setShowDropdown(false);
      }
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Search error:', error);
        setResults([]);
        setShowDropdown(false);
      }
    } finally {
      setLoading(false);
    }
  };
  
  // Handle Query Change - FIXED VERSION
  const handleQueryChange = (value) => {
    console.log('Query changed to:', value);
    setQuery(value);
    
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
      searchTimeoutRef.current = null;
    }
    
    if (!value.trim()) {
      setResults([]);
      setShowDropdown(false);
      setLoading(false);
      return;
    }
    
    // Immediately show loading state
    setLoading(true);
    
    searchTimeoutRef.current = setTimeout(() => {
      if (value.trim() && value.length >= 2) {
        searchSymbols(value);
      } else {
        setLoading(false);
      }
    }, 300);
  };
  
  // Full Analysis with global operation tracking and cancellation of previous operations
  const handleFullAnalysis = async () => {
    console.log('Analyze button clicked');
    console.log('Current query:', query);
    console.log('Is authenticated:', isAuthenticated);
    
    // Clear any previous auth message
    setAuthMessage('');
    
    if (!query.trim()) {
      setAuthMessage('no_symbol');
      showAlphaShoutMessage('warning', 'Please select a stock symbol first');
      return;
    }
    
    if (!isAuthenticated) {
      console.log('User not authenticated, showing login message');
      setAuthMessage('login_required');
      showAlphaShoutMessage('warning', (
        <span>
          Please <a 
            onClick={() => {
              console.log('Navigating to login from message');
              window.dispatchEvent(new CustomEvent('navigate-to-login', { detail: { page: 'login' } }));
            }}
            style={{ 
              color: AlphaShoutTheme.colors.primary, 
              textDecoration: 'underline', 
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            login
          </a> to use the stock analysis feature
        </span>
      ), 4);
      return;
    }
    
    console.log('Starting analysis for:', query);
    
    // Cancel all existing operations before starting new analysis
    if (hasActiveOperations()) {
      console.log('Cancelling existing operations before starting new analysis');
      const cancelledCount = cancelAllOperations();
      
      showAlphaShoutMessage('info', `Previous operations cancelled (${cancelledCount}). Starting new analysis...`);
      
      // Wait a bit for cleanup
      await new Promise(resolve => setTimeout(resolve, 100));
    }
    
    // Generate unique operation ID
    const operationId = `full-analysis-${Date.now()}`;
    
    // Hide instructions when analysis starts
    setShowInstructions(false);
    
    // Add to active operations
    addActiveOperation(operationId);
    
    setLoadingStates(prev => ({ 
      ...prev, 
      full: true,
      income: true,
      balance: true,
      cashflow: true
    }));
    
    // Create abort controller for this operation
    const abortController = new AbortController();
    setAbortController(operationId, abortController);
    
    try {
      const requestBody = { symbol: query };
      console.log('Sending request with body:', requestBody);
      
      const response = await fetch(`${API_BASE_URL}/api/stock/full-analysis`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify(requestBody),
        signal: abortController.signal
      });
      
      console.log('Analysis response status:', response.status);
      
      const data = await response.json();
      console.log('Analysis response data:', data);
      
      if (!response.ok || !data.success) {
        if (data.error === 'INSUFFICIENT_QUOTA') {
          setAuthMessage('insufficient_tokens');
          showAlphaShoutMessage('warning', (
            <span>
              You need <strong>{data.required} tokens</strong> to perform analysis. 
              Your balance: <strong>{data.available} tokens</strong>. 
              <a 
                onClick={() => window.dispatchEvent(new CustomEvent('navigate-to-payment', { detail: { page: 'payment2' } }))}
                style={{ 
                  color: AlphaShoutTheme.colors.primary, 
                  textDecoration: 'underline', 
                  cursor: 'pointer',
                  marginLeft: '8px',
                  fontWeight: 'bold'
                }}
              >
                Go to Billing
              </a>
            </span>
          ), 5);
        } else {
          showAlphaShoutMessage('error', data.message || 'Analysis failed');
        }
        setLoadingStates(prev => ({ 
          ...prev, 
          full: false,
          income: false,
          balance: false,
          cashflow: false
        }));
        removeActiveOperation(operationId);
        return;
      }
      
      // Clear auth message on success
      setAuthMessage('');
      
      showAlphaShoutMessage('success', `Analysis completed! ${data.quota.deducted} tokens used.`);
      
      if (userQuota) {
        setUserQuota({ ...userQuota, available_quota: data.quota.remaining });
      }
      
      const results = data.analysis.results;
      console.log('Analysis results:', results);
      
      // Update global analysis data (without technical analysis)
      setAnalysisData(prev => {
        const newData = {
          ...prev,
          incomeStatement: results.incomeStatement || prev.incomeStatement,
          balanceSheet: results.balanceSheet || prev.balanceSheet,
          cashFlow: results.cashFlow || prev.cashFlow
        };
        console.log('Updated analysis data:', newData);
        return newData;
      });
      
      // Clear deep analysis data when new analysis is performed
      setDeepAnalysisData({
        income: null,
        balance: null,
        cashflow: null
      });
      
      setLoadingStates(prev => ({ 
        ...prev, 
        full: false,
        income: false,
        balance: false,
        cashflow: false
      }));
      
    } catch (error) {
      if (error.name === 'AbortError') {
        console.log('Analysis was aborted');
        showAlphaShoutMessage('info', 'Analysis was cancelled');
      } else {
        console.error('Analysis error details:', error);
        showAlphaShoutMessage('error', `Network error: ${error.message}. Please try again.`);
      }
      setLoadingStates(prev => ({ 
        ...prev, 
        full: false,
        income: false,
        balance: false,
        cashflow: false
      }));
    } finally {
      removeActiveOperation(operationId);
    }
  };
  
  // Refresh Individual Analysis with global tracking
  const handleRefresh = async (analysisType) => {
    if (!query.trim()) {
      showAlphaShoutMessage('warning', 'Please select a stock symbol first');
      return;
    }
    
    if (!isAuthenticated) {
      return;
    }
    
    // Generate unique operation ID
    const operationId = `refresh-${analysisType}-${Date.now()}`;
    addActiveOperation(operationId);
    
    setLoadingStates(prev => ({ ...prev, [analysisType]: true }));
    
    // Create abort controller
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
          showAlphaShoutMessage('warning', (
            <span>
              Insufficient tokens. You need <strong>1 token</strong> to refresh. 
              <a 
                onClick={() => window.dispatchEvent(new CustomEvent('navigate-to-payment', { detail: { page: 'payment2' } }))}
                style={{ 
                  color: AlphaShoutTheme.colors.primary, 
                  textDecoration: 'underline', 
                  cursor: 'pointer',
                  marginLeft: '8px',
                  fontWeight: 'bold'
                }}
              >
                Go to Billing
              </a>
            </span>
          ), 5);
        } else {
          showAlphaShoutMessage('error', data.message || 'Refresh failed');
        }
        setLoadingStates(prev => ({ ...prev, [analysisType]: false }));
        removeActiveOperation(operationId);
        return;
      }
      
      showAlphaShoutMessage('success', `Refreshed! ${data.quota.deducted} token used.`);
      
      if (userQuota) {
        setUserQuota({ ...userQuota, available_quota: data.quota.remaining });
      }
      
      // Update global data
      const fieldMap = {
        'income': 'incomeStatement',
        'balance': 'balanceSheet',
        'cashflow': 'cashFlow'
      };
      setAnalysisData(prev => ({
        ...prev,
        [fieldMap[analysisType]]: data.data
      }));
      
      // Clear deep analysis for this type when refreshed
      setDeepAnalysisData(prev => ({
        ...prev,
        [analysisType]: null
      }));
      
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Refresh error:', error);
        showAlphaShoutMessage('error', 'Refresh failed');
      }
    } finally {
      setLoadingStates(prev => ({ ...prev, [analysisType]: false }));
      removeActiveOperation(operationId);
    }
  };
  
  // Deep Analysis with global tracking
  const handleDeepAnalysis = async (analysisType) => {
    if (!query.trim()) {
      showAlphaShoutMessage('warning', 'Please select a stock symbol first');
      return;
    }
    
    if (!isAuthenticated) {
      return;
    }
    
    const operationId = `deep-${analysisType}-${Date.now()}`;
    addActiveOperation(operationId);
    
    const loadingKey = `deep${analysisType.charAt(0).toUpperCase() + analysisType.slice(1)}`;
    
    setLoadingStates(prev => ({ ...prev, [loadingKey]: true }));
    
    const abortController = new AbortController();
    setAbortController(operationId, abortController);
    
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
      
      const data = await response.json();
      
      if (!response.ok || !data.success) {
        if (data.error === 'INSUFFICIENT_QUOTA') {
          showAlphaShoutMessage('warning', (
            <span>
              You need <strong>{data.required} tokens</strong> for deep analysis. 
              Your balance: <strong>{data.available} tokens</strong>. 
              <a 
                onClick={() => window.dispatchEvent(new CustomEvent('navigate-to-payment', { detail: { page: 'payment2' } }))}
                style={{ 
                  color: AlphaShoutTheme.colors.primary, 
                  textDecoration: 'underline', 
                  cursor: 'pointer',
                  marginLeft: '8px',
                  fontWeight: 'bold'
                }}
              >
                Go to Billing
              </a>
            </span>
          ), 5);
        } else {
          showAlphaShoutMessage('error', data.message || 'Deep analysis failed');
        }
        setLoadingStates(prev => ({ ...prev, [loadingKey]: false }));
        removeActiveOperation(operationId);
        return;
      }
      
      showAlphaShoutMessage('success', `Deep analysis completed! ${data.quota.deducted} tokens used.`);
      
      if (userQuota) {
        setUserQuota({ ...userQuota, available_quota: data.quota.remaining });
      }
      
      // Store deep analysis data globally
      setDeepAnalysisData(prev => ({
        ...prev,
        [analysisType]: data.data
      }));
      
    } catch (error) {
      if (error.name !== 'AbortError') {
        console.error('Deep analysis error:', error);
        showAlphaShoutMessage('error', 'Deep analysis failed');
      }
    } finally {
      setLoadingStates(prev => ({ ...prev, [loadingKey]: false }));
      removeActiveOperation(operationId);
    }
  };
  
  // Select Symbol
  const selectSymbol = (symbol) => {
    // For Alpha Vantage, we just use the symbol directly (already cleaned in transformation)
    setQuery(symbol.symbol);
    setShowDropdown(false);
    setSelectedIndex(-1);
    console.log('Selected symbol:', symbol.symbol);
  };
  
  // Keyboard Navigation
  const handleKeyDown = (e) => {
    if (!showDropdown) return;
    
    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => prev < results.length - 1 ? prev + 1 : prev);
        break;
      case 'ArrowUp':
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
        break;
      case 'Enter':
        e.preventDefault();
        if (selectedIndex >= 0 && results[selectedIndex]) {
          selectSymbol(results[selectedIndex]);
        }
        break;
      case 'Escape':
        setShowDropdown(false);
        setSelectedIndex(-1);
        break;
      default:
        break;
    }
  };
  
  // Cleanup effect
  useEffect(() => {
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
        searchTimeoutRef.current = null;
      }
    };
  }, []);
  
  // Click Outside Handler
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
        setSelectedIndex(-1);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);
  
  return (
    <>
      <style>
        {`
          @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700&display=swap');
          
          * { font-family: ${AlphaShoutTheme.fonts.primary}; }
          body { background: ${AlphaShoutTheme.colors.background}; margin: 0; }
        `}
      </style>
      
      <div style={{ 
        minHeight: '100vh',
        background: AlphaShoutTheme.colors.background,
        padding: '24px'
      }}>
        
        {/* Quota Display */}
        <QuotaDisplay 
          quota={userQuota} 
          onRecharge={() => window.dispatchEvent(new CustomEvent('navigate-to-payment', { detail: { page: 'payment2' } }))} 
          isAuthenticated={isAuthenticated}
        />
        
        <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
          
          {/* Header */}
          <div style={{ textAlign: 'center', marginBottom: '48px', padding: '48px 0' }}>
            <Title level={1} style={{ 
              marginBottom: '8px',
              color: AlphaShoutTheme.colors.primary,
              fontFamily: AlphaShoutTheme.fonts.heading,
              fontWeight: 600,
              fontSize: '42px'
            }}>
              Financial Statement AI Deep Analysis
            </Title>
            <Text style={{ 
              fontSize: '16px',
              color: AlphaShoutTheme.colors.textSecondary,
              fontFamily: AlphaShoutTheme.fonts.primary
            }}>
              Professional stock analysis with institutional-grade insights
            </Text>
          </div>
          
          {/* Show Instructions if no analysis data */}
          {showInstructions && <UsageInstructions />}
          
          {/* Search Section */}
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
              
              {/* FIXED DROPDOWN CONTAINER */}
              <div 
                ref={dropdownRef} 
                style={{ 
                  position: 'relative',
                  width: '100%'
                }}
              >
                <AlphaShoutInput
                  size="large"
                  placeholder="Enter stock symbol (e.g., AAPL, MSFT, NVDA)"
                  prefix={<SearchOutlined style={{ color: AlphaShoutTheme.colors.primary }} />}
                  suffix={loading ? <Spin size="small" /> : null}
                  value={query}
                  onChange={(e) => handleQueryChange(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onFocus={() => {
                    // When input gets focus, show dropdown if there are results
                    if (results.length > 0) {
                      setShowDropdown(true);
                    }
                  }}
                  style={{ 
                    height: '44px',
                    width: '100%'
                  }}
                />
                
                {/* FIXED DROPDOWN LIST */}
            {showDropdown && results.length > 0 && (
              <div
                style={{
                  position: 'absolute',
                  top: '100%',
                  left: 0,
                  right: 0,
                  marginTop: '4px',
                  background: AlphaShoutTheme.colors.surface,
                  border: `1px solid ${AlphaShoutTheme.colors.border}`,
                  borderRadius: AlphaShoutTheme.radius.medium,
                  boxShadow: AlphaShoutTheme.shadows.card,
                  maxHeight: '300px',
                  overflowY: 'auto',
                  zIndex: 1000
                }}
              >
                {results.map((symbol, index) => (
                  <div
                    key={index}
                    onClick={() => selectSymbol(symbol)}
                    style={{
                      padding: '12px 16px',
                      cursor: 'pointer',
                      borderBottom: index < results.length - 1 ? `1px solid ${AlphaShoutTheme.colors.borderLight}` : 'none',
                      transition: 'background 0.15s'
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = AlphaShoutTheme.colors.surfaceSecondary;
                      setSelectedIndex(index);
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <div>
                        <span style={{ 
                          fontWeight: '500', 
                          marginRight: '8px',
                          color: AlphaShoutTheme.colors.primary 
                        }}>
                          {symbol.symbol}
                        </span>
                        <span style={{ 
                          color: AlphaShoutTheme.colors.textSecondary, 
                          fontSize: '13px' 
                        }}>
                          {symbol.instrument_name}
                        </span>
                      </div>
                      <span style={{ 
                        fontSize: '11px', 
                        color: AlphaShoutTheme.colors.textTertiary,
                        background: AlphaShoutTheme.colors.surfaceSecondary,
                        padding: '2px 8px',
                        borderRadius: AlphaShoutTheme.radius.small,
                        fontWeight: '500'
                      }}>
                        {symbol.country}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
              </div>
              
              {/* Analyze Button */}
              <div style={{ marginTop: '32px', textAlign: 'center' }}>
                <AlphaShoutButton
                  primary
                  size="large"
                  icon={<BarChartOutlined />}
                  onClick={handleFullAnalysis}
                  loading={loadingStates.full}
                  disabled={loadingStates.full}
                  style={{
                    height: '44px',
                    fontSize: '15px',
                    padding: '0 32px'
                  }}
                >
                  {loadingStates.full ? 'Analyzing...' : `Analyze Stock (${quotaConfig?.ANALYSE_COST || 3} tokens)`}
                </AlphaShoutButton>
                
                {/* Auth Message Display Below Button */}
                {authMessage === 'no_symbol' && (
                  <div style={{
                    marginTop: '16px',
                    padding: '12px 20px',
                    background: `linear-gradient(135deg, ${AlphaShoutTheme.colors.warning}10, ${AlphaShoutTheme.colors.warning}05)`,
                    border: `1px solid ${AlphaShoutTheme.colors.warning}`,
                    borderRadius: AlphaShoutTheme.radius.medium,
                    maxWidth: '400px',
                    margin: '16px auto 0',
                    textAlign: 'center'
                  }}>
                    <ExclamationCircleOutlined style={{ 
                      color: AlphaShoutTheme.colors.warning, 
                      marginRight: '8px',
                      verticalAlign: 'middle'
                    }} />
                    <span style={{ 
                      color: AlphaShoutTheme.colors.textPrimary,
                      fontSize: '14px',
                      fontFamily: AlphaShoutTheme.fonts.primary,
                      verticalAlign: 'middle'
                    }}>
                      Please enter a stock symbol to proceed with analysis
                    </span>
                  </div>
                )}
                
                {authMessage === 'login_required' && (
                  <div style={{
                    marginTop: '16px',
                    padding: '12px 20px',
                    background: `linear-gradient(135deg, ${AlphaShoutTheme.colors.warning}10, ${AlphaShoutTheme.colors.warning}05)`,
                    border: `1px solid ${AlphaShoutTheme.colors.warning}`,
                    borderRadius: AlphaShoutTheme.radius.medium,
                    maxWidth: '400px',
                    margin: '16px auto 0',
                    textAlign: 'center'
                  }}>
                    <ExclamationCircleOutlined style={{ 
                      color: AlphaShoutTheme.colors.warning, 
                      marginRight: '8px',
                      verticalAlign: 'middle'
                    }} />
                    <span style={{ 
                      color: AlphaShoutTheme.colors.textPrimary,
                      fontSize: '14px',
                      fontFamily: AlphaShoutTheme.fonts.primary,
                      verticalAlign: 'middle'
                    }}>
                      Please{' '}
                      <a 
                        onClick={() => {
                          setAuthMessage('');
                          window.dispatchEvent(new CustomEvent('navigate-to-login', { detail: { page: 'login' } }));
                        }}
                        style={{ 
                          color: AlphaShoutTheme.colors.primary, 
                          textDecoration: 'underline', 
                          cursor: 'pointer',
                          fontWeight: 'bold'
                        }}
                      >
                        login
                      </a>
                      {' '}to use the stock analysis feature
                    </span>
                  </div>
                )}
                
                {authMessage === 'insufficient_tokens' && (
                  <div style={{
                    marginTop: '16px',
                    padding: '12px 20px',
                    background: `linear-gradient(135deg, ${AlphaShoutTheme.colors.error}10, ${AlphaShoutTheme.colors.error}05)`,
                    border: `1px solid ${AlphaShoutTheme.colors.error}`,
                    borderRadius: AlphaShoutTheme.radius.medium,
                    maxWidth: '400px',
                    margin: '16px auto 0',
                    textAlign: 'center'
                  }}>
                    <ExclamationCircleOutlined style={{ 
                      color: AlphaShoutTheme.colors.error, 
                      marginRight: '8px',
                      verticalAlign: 'middle'
                    }} />
                    <span style={{ 
                      color: AlphaShoutTheme.colors.textPrimary,
                      fontSize: '14px',
                      fontFamily: AlphaShoutTheme.fonts.primary,
                      verticalAlign: 'middle'
                    }}>
                      Insufficient tokens.{' '}
                      <a 
                        onClick={() => {
                          setAuthMessage('');
                          window.dispatchEvent(new CustomEvent('navigate-to-payment', { detail: { page: 'payment2' } }));
                        }}
                        style={{ 
                          color: AlphaShoutTheme.colors.primary, 
                          textDecoration: 'underline', 
                          cursor: 'pointer',
                          fontWeight: 'bold'
                        }}
                      >
                        Go to Billing
                      </a>
                      {' '}to recharge
                    </span>
                  </div>
                )}
              </div>
            </div>
          </AlphaShoutCard>
          
          {/* Analysis Results - Tabs for Financial Statements */}
          {(analysisData.incomeStatement || analysisData.balanceSheet || analysisData.cashFlow) && (
            <AlphaShoutCard>
              <div style={{ padding: '24px' }}>
                <Tabs 
                  defaultActiveKey="income"
                  type="card"
                  style={{
                    '--ant-primary-color': AlphaShoutTheme.colors.primary,
                    '--ant-primary-color-hover': AlphaShoutTheme.colors.primaryLight,
                  }}
                  tabBarStyle={{
                    borderBottom: `2px solid ${AlphaShoutTheme.colors.borderLight}`,
                    marginBottom: '24px'
                  }}
                  items={[
                    // Income Statement Tab
                    (analysisData.incomeStatement && 
                     analysisData.incomeStatement !== 'No income statement data available' && 
                     analysisData.incomeStatement !== 'Income statement temporarily unavailable') ? {
                      key: 'income',
                      label: (
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '8px',
                          padding: '4px 8px',
                          fontFamily: AlphaShoutTheme.fonts.primary,
                          fontWeight: 600
                        }}>
                          <FileTextOutlined style={{ color: AlphaShoutTheme.colors.primary }} />
                          Income Statement
                        </div>
                      ),
                      children: (
                        <div>
                          <div style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center',
                            marginBottom: '20px',
                            paddingBottom: '12px',
                            borderBottom: `1px solid ${AlphaShoutTheme.colors.borderLight}`
                          }}>
                            <Text style={{ 
                              fontSize: '16px',
                              color: AlphaShoutTheme.colors.primary,
                              fontWeight: 600
                            }}>
                              Revenue, Profitability & Growth Analysis
                            </Text>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                              <RefreshButton 
                                onClick={() => handleRefresh('income')}
                                loading={loadingStates.income}
                                dataType="Income Statement"
                                isAuthenticated={isAuthenticated}
                              />
                              <DeepAnalysisButton
                                onClick={() => handleDeepAnalysis('income')}
                                loading={loadingStates.deepIncome}
                                dataType="Income Statement"
                                isAuthenticated={isAuthenticated}
                              />
                            </div>
                          </div>
                          {deepAnalysisData.income ? 
                            formatAlphaShoutTable(deepAnalysisData.income, true) : 
                            formatAlphaShoutTable(analysisData.incomeStatement)}
                        </div>
                      )
                    } : null,
                    
                    // Balance Sheet Tab
                    (analysisData.balanceSheet && 
                     analysisData.balanceSheet !== 'No balance sheet data available' && 
                     analysisData.balanceSheet !== 'Balance sheet temporarily unavailable') ? {
                      key: 'balance',
                      label: (
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '8px',
                          padding: '4px 8px',
                          fontFamily: AlphaShoutTheme.fonts.primary,
                          fontWeight: 600
                        }}>
                          <FundOutlined style={{ color: AlphaShoutTheme.colors.secondary }} />
                          Balance Sheet
                        </div>
                      ),
                      children: (
                        <div>
                          <div style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center',
                            marginBottom: '20px',
                            paddingBottom: '12px',
                            borderBottom: `1px solid ${AlphaShoutTheme.colors.borderLight}`
                          }}>
                            <Text style={{ 
                              fontSize: '16px',
                              color: AlphaShoutTheme.colors.secondary,
                              fontWeight: 600
                            }}>
                              Assets, Liabilities & Financial Position
                            </Text>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                              <RefreshButton 
                                onClick={() => handleRefresh('balance')}
                                loading={loadingStates.balance}
                                dataType="Balance Sheet"
                                isAuthenticated={isAuthenticated}
                              />
                              <DeepAnalysisButton
                                onClick={() => handleDeepAnalysis('balance')}
                                loading={loadingStates.deepBalance}
                                dataType="Balance Sheet"
                                isAuthenticated={isAuthenticated}
                              />
                            </div>
                          </div>
                          {deepAnalysisData.balance ? 
                            formatAlphaShoutTable(deepAnalysisData.balance, true) : 
                            formatAlphaShoutTable(analysisData.balanceSheet)}
                        </div>
                      )
                    } : null,
                    
                    // Cash Flow Tab
                    (analysisData.cashFlow && 
                     analysisData.cashFlow !== 'No cash flow data available' && 
                     analysisData.cashFlow !== 'Cash flow temporarily unavailable') ? {
                      key: 'cashflow',
                      label: (
                        <div style={{ 
                          display: 'flex', 
                          alignItems: 'center', 
                          gap: '8px',
                          padding: '4px 8px',
                          fontFamily: AlphaShoutTheme.fonts.primary,
                          fontWeight: 600
                        }}>
                          <DollarOutlined style={{ color: AlphaShoutTheme.colors.accent }} />
                          Cash Flow
                        </div>
                      ),
                      children: (
                        <div>
                          <div style={{ 
                            display: 'flex', 
                            justifyContent: 'space-between', 
                            alignItems: 'center',
                            marginBottom: '20px',
                            paddingBottom: '12px',
                            borderBottom: `1px solid ${AlphaShoutTheme.colors.borderLight}`
                          }}>
                            <Text style={{ 
                              fontSize: '16px',
                              color: AlphaShoutTheme.colors.accent,
                              fontWeight: 600
                            }}>
                              Operating, Investing & Financing Activities
                            </Text>
                            <div style={{ display: 'flex', alignItems: 'center' }}>
                              <RefreshButton 
                                onClick={() => handleRefresh('cashflow')}
                                loading={loadingStates.cashflow}
                                dataType="Cash Flow"
                                isAuthenticated={isAuthenticated}
                              />
                              <DeepAnalysisButton
                                onClick={() => handleDeepAnalysis('cashflow')}
                                loading={loadingStates.deepCashflow}
                                dataType="Cash Flow"
                                isAuthenticated={isAuthenticated}
                              />
                            </div>
                          </div>
                          {deepAnalysisData.cashflow ? 
                            formatAlphaShoutTable(deepAnalysisData.cashflow, true) : 
                            formatAlphaShoutTable(analysisData.cashFlow)}
                        </div>
                      )
                    } : null
                  ].filter(Boolean)}
                />
              </div>
            </AlphaShoutCard>
          )}
          
          {/* Loading indicator only when analysis is in progress */}
          {loadingStates.full && (
            <AlphaShoutCard>
              <div style={{ textAlign: 'center', padding: '48px' }}>
                <Spin size="large" />
                <div style={{ marginTop: '16px', color: AlphaShoutTheme.colors.textSecondary }}>
                  Analyzing {query}...
                </div>
                <div style={{ marginTop: '8px', fontSize: '12px', color: AlphaShoutTheme.colors.textTertiary }}>
                  This may take a few moments
                </div>
              </div>
            </AlphaShoutCard>
          )}
        </div>
      </div>
    </>
  );
}