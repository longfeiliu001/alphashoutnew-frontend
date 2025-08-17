import React, { useState, useRef, useCallback, useEffect } from 'react';
import { Button, Card, Alert, Typography, Space, Divider, message, Switch, Row, Col, Spin, Tag, Input, Tabs } from 'antd';
import {
  CameraOutlined,
  DownloadOutlined,
  ReloadOutlined,
  PictureOutlined,
  SelectOutlined,
  FullscreenOutlined,
  RobotOutlined,
  DollarOutlined,
  InfoCircleOutlined,
  BarChartOutlined,
  LineChartOutlined,
  FundOutlined,
  CopyOutlined,
  ThunderboltOutlined,
  SettingOutlined,
  CloseOutlined,
  LoadingOutlined,
  SearchOutlined,
  StockOutlined,
  FileImageOutlined,
  ApiOutlined,
  CheckOutlined,
  ClearOutlined,
  ExclamationCircleOutlined,
  ExperimentOutlined,
  LoginOutlined
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

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
    textInverse: '#FFFFFF',
    tableHeader: '#F0F3F5',
    tableRowHover: '#F8FAFB',
    tableRowAlt: '#FAFBFC',
    deepAnalysis: '#8B008B',
    codeBackground: '#F5F7FA',
    codeBorder: '#E1E4E8',
    linkColor: '#0066CC',
    linkHover: '#0052A3'
  },
  fonts: {
    primary: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    heading: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    code: "'Monaco', 'Consolas', 'Courier New', monospace"
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
  message.destroy();
  
  message.config({
    top: window.innerHeight / 2 - 100,
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

// Custom Modal Component
const CustomModal = ({ 
  visible, 
  onClose, 
  title, 
  children, 
  width = '800px',
  footer 
}) => {
  useEffect(() => {
    if (visible) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [visible]);

  if (!visible) return null;

  return (
    <div style={{
      position: 'fixed',
      top: 0,
      left: 0,
      right: 0,
      bottom: 0,
      backgroundColor: 'rgba(0, 0, 0, 0.6)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 1000,
      padding: '20px'
    }}>
      <div 
        style={{
          backgroundColor: AlphaShoutTheme.colors.surface,
          borderRadius: AlphaShoutTheme.radius.large,
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.3)',
          width: '100%',
          maxWidth: width,
          maxHeight: '90vh',
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden'
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div style={{
          padding: '20px 24px',
          borderBottom: `1px solid ${AlphaShoutTheme.colors.borderLight}`,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          backgroundColor: AlphaShoutTheme.colors.surfaceSecondary
        }}>
          <div style={{
            fontSize: '18px',
            fontWeight: 600,
            color: AlphaShoutTheme.colors.textPrimary,
            display: 'flex',
            alignItems: 'center'
          }}>
            {title}
          </div>
          <button
            onClick={onClose}
            style={{
              background: 'none',
              border: 'none',
              fontSize: '18px',
              cursor: 'pointer',
              color: AlphaShoutTheme.colors.textSecondary,
              padding: '4px',
              borderRadius: '4px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center'
            }}
          >
            <CloseOutlined />
          </button>
        </div>
        
        <div style={{
          padding: '24px',
          flex: 1,
          overflowY: 'auto'
        }}>
          {children}
        </div>
        
        {footer && (
          <div style={{
            padding: '16px 24px',
            borderTop: `1px solid ${AlphaShoutTheme.colors.borderLight}`,
            backgroundColor: AlphaShoutTheme.colors.surfaceSecondary,
            display: 'flex',
            justifyContent: 'flex-end',
            gap: '8px'
          }}>
            {footer}
          </div>
        )}
      </div>
    </div>
  );
};

// Custom TextArea Component
const CustomTextArea = ({ 
  value, 
  onChange, 
  placeholder, 
  rows = 3, 
  disabled = false,
  style = {} 
}) => {
  const [focused, setFocused] = useState(false);
  
  return (
    <textarea
      value={value}
      onChange={onChange}
      placeholder={placeholder}
      rows={rows}
      disabled={disabled}
      style={{
        width: '100%',
        padding: '8px 12px',
        borderRadius: '6px',
        border: focused 
          ? `2px solid ${AlphaShoutTheme.colors.primary}` 
          : `1px solid ${AlphaShoutTheme.colors.border}`,
        fontSize: '14px',
        fontFamily: AlphaShoutTheme.fonts.primary,
        resize: 'vertical',
        minHeight: '80px',
        lineHeight: '1.5',
        outline: 'none',
        transition: 'all 0.3s ease',
        backgroundColor: disabled ? AlphaShoutTheme.colors.surfaceSecondary : AlphaShoutTheme.colors.surface,
        cursor: disabled ? 'not-allowed' : 'text',
        ...style
      }}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
    />
  );
};

// AlphaShout Styled Components
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

// Enhanced Markdown Parser for AlphaShout Style
const parseMarkdownToAlphaShout = (content) => {
  if (!content) return null;

  // Function to parse inline styles
  const parseInlineStyles = (text) => {
    if (!text) return text;

    // Handle special case where entire lines are wrapped in **
    // Check if the entire text is wrapped in bold
    const fullBoldMatch = text.match(/^\*\*(.+)\*\*$/);
    if (fullBoldMatch) {
      // Check if it contains a colon, indicating it might be a heading:content format
      const colonIndex = fullBoldMatch[1].indexOf(':');
      if (colonIndex > 0) {
        const heading = fullBoldMatch[1].substring(0, colonIndex);
        const content = fullBoldMatch[1].substring(colonIndex + 1).trim();
        return `<strong style="font-weight: 600; color: ${AlphaShoutTheme.colors.primary}">${heading}:</strong> ${parseInlineStyles(content)}`;
      }
      // Otherwise, just make the whole thing bold
      return `<strong style="font-weight: 600; color: ${AlphaShoutTheme.colors.textPrimary}">${fullBoldMatch[1]}</strong>`;
    }

    // Parse bold text (non-greedy to handle multiple bold sections)
    text = text.replace(/\*\*([^*]+)\*\*/g, (match, p1) => {
      return `<strong style="font-weight: 600; color: ${AlphaShoutTheme.colors.textPrimary}">${p1}</strong>`;
    });

    // Parse italic text (but not if it's part of a bold marker)
    text = text.replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, (match, p1) => {
      return `<em style="font-style: italic">${p1}</em>`;
    });

    // Parse inline code
    text = text.replace(/`([^`]+)`/g, (match, p1) => {
      return `<code style="background-color: ${AlphaShoutTheme.colors.codeBackground}; padding: 2px 6px; border-radius: 3px; font-family: ${AlphaShoutTheme.fonts.code}; font-size: 0.9em; color: ${AlphaShoutTheme.colors.primary}">${p1}</code>`;
    });

    // Parse links
    text = text.replace(/\[([^\]]+)\]\(([^)]+)\)/g, (match, p1, p2) => {
      return `<a href="${p2}" style="color: ${AlphaShoutTheme.colors.linkColor}; text-decoration: underline; transition: color 0.2s" onmouseover="this.style.color='${AlphaShoutTheme.colors.linkHover}'" onmouseout="this.style.color='${AlphaShoutTheme.colors.linkColor}'">${p1}</a>`;
    });

    return text;
  };

  // Preprocess content to handle special n8n formatting
  const preprocessContent = (text) => {
    // Handle lines that are entirely wrapped in ** and contain section headers
    const lines = text.split('\n');
    const processedLines = [];
    
    for (let i = 0; i < lines.length; i++) {
      let line = lines[i];
      
      // Check if line starts with **word(s) followed by space and more content
      const sectionMatch = line.match(/^\*\*([A-Za-z\s]+)\s+(.+)\*\*$/);
      if (sectionMatch) {
        // Convert to markdown heading format
        const heading = sectionMatch[1].trim();
        const content = sectionMatch[2].trim();
        
        // Determine heading level based on content
        if (heading.match(/^(Current|Key|Trading|Technical)/i)) {
          processedLines.push(`### ${heading}`);
          processedLines.push(content);
        } else {
          processedLines.push(`**${heading}** ${content}`);
        }
      } else if (line.match(/^\*\*[^:]+:\s*.+\*\*$/)) {
        // Line with format **Label: content**
        processedLines.push(line);
      } else if (line.match(/^\*\s*#/)) {
        // Handle * # format
        processedLines.push(line.replace(/^\*\s*/, ''));
      } else {
        processedLines.push(line);
      }
    }
    
    return processedLines.join('\n');
  };

  // Preprocess the content
  content = preprocessContent(content);

  // Split content by lines
  const lines = content.split('\n');
  const elements = [];
  let currentList = null;
  let currentListType = null;
  let codeBlock = null;
  let tableData = null;

  for (let i = 0; i < lines.length; i++) {
    let line = lines[i];

    // Code blocks
    if (line.startsWith('```')) {
      if (codeBlock === null) {
        codeBlock = { language: line.slice(3).trim(), lines: [] };
      } else {
        elements.push(
          <pre key={i} style={{
            backgroundColor: AlphaShoutTheme.colors.codeBackground,
            border: `1px solid ${AlphaShoutTheme.colors.codeBorder}`,
            borderRadius: AlphaShoutTheme.radius.medium,
            padding: '16px',
            overflowX: 'auto',
            margin: '16px 0',
            fontFamily: AlphaShoutTheme.fonts.code,
            fontSize: '14px',
            lineHeight: '1.6'
          }}>
            <code style={{ color: AlphaShoutTheme.colors.textPrimary }}>
              {codeBlock.lines.join('\n')}
            </code>
          </pre>
        );
        codeBlock = null;
      }
      continue;
    }

    if (codeBlock !== null) {
      codeBlock.lines.push(line);
      continue;
    }

    // Tables
    if (line.includes('|') && line.trim().startsWith('|') && line.trim().endsWith('|')) {
      if (!tableData) {
        tableData = { headers: [], rows: [] };
      }
      
      const cells = line.split('|').filter(cell => cell.trim()).map(cell => cell.trim());
      
      if (tableData.headers.length === 0) {
        tableData.headers = cells;
      } else if (line.includes('---')) {
        // Skip separator line
        continue;
      } else {
        tableData.rows.push(cells);
      }
      
      // Check if next line is not a table line
      if (i === lines.length - 1 || !lines[i + 1].includes('|')) {
        elements.push(
          <div key={i} style={{ overflowX: 'auto', margin: '16px 0' }}>
            <table style={{
              width: '100%',
              borderCollapse: 'collapse',
              border: `1px solid ${AlphaShoutTheme.colors.border}`,
              fontFamily: AlphaShoutTheme.fonts.primary,
              fontSize: '14px'
            }}>
              <thead>
                <tr style={{ backgroundColor: AlphaShoutTheme.colors.tableHeader }}>
                  {tableData.headers.map((header, idx) => (
                    <th key={idx} style={{
                      padding: '12px',
                      textAlign: 'left',
                      borderBottom: `2px solid ${AlphaShoutTheme.colors.border}`,
                      fontWeight: 600,
                      color: AlphaShoutTheme.colors.textPrimary
                    }}>
                      {header}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {tableData.rows.map((row, rowIdx) => (
                  <tr key={rowIdx} style={{
                    backgroundColor: rowIdx % 2 === 0 ? AlphaShoutTheme.colors.surface : AlphaShoutTheme.colors.tableRowAlt
                  }}>
                    {row.map((cell, cellIdx) => (
                      <td key={cellIdx} style={{
                        padding: '12px',
                        borderBottom: `1px solid ${AlphaShoutTheme.colors.borderLight}`,
                        color: AlphaShoutTheme.colors.textSecondary
                      }}>
                        <span dangerouslySetInnerHTML={{ __html: parseInlineStyles(cell) }} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );
        tableData = null;
      }
      continue;
    }

    // Headers
    if (line.match(/^#+\s/)) {
      const headerMatch = line.match(/^(#+)\s(.+)/);
      if (headerMatch) {
        const level = headerMatch[1].length;
        const text = headerMatch[2];
        
        const headerStyles = {
          1: { fontSize: '28px', marginTop: '32px', marginBottom: '20px', fontWeight: 700 },
          2: { fontSize: '24px', marginTop: '28px', marginBottom: '16px', fontWeight: 600 },
          3: { fontSize: '20px', marginTop: '24px', marginBottom: '14px', fontWeight: 600 },
          4: { fontSize: '18px', marginTop: '20px', marginBottom: '12px', fontWeight: 600 },
          5: { fontSize: '16px', marginTop: '16px', marginBottom: '10px', fontWeight: 600 },
          6: { fontSize: '14px', marginTop: '14px', marginBottom: '8px', fontWeight: 600 }
        };

        const style = headerStyles[level] || headerStyles[6];

        elements.push(
          <div key={i} style={{
            ...style,
            color: AlphaShoutTheme.colors.primary,
            fontFamily: AlphaShoutTheme.fonts.heading,
            lineHeight: '1.4'
          }}>
            <span dangerouslySetInnerHTML={{ __html: parseInlineStyles(text) }} />
          </div>
        );
        continue;
      }
    }

    // Blockquotes
    if (line.startsWith('>')) {
      const quoteText = line.substring(1).trim();
      elements.push(
        <blockquote key={i} style={{
          borderLeft: `4px solid ${AlphaShoutTheme.colors.accent}`,
          paddingLeft: '20px',
          marginLeft: '0',
          marginRight: '0',
          marginTop: '16px',
          marginBottom: '16px',
          backgroundColor: AlphaShoutTheme.colors.surfaceSecondary,
          padding: '16px 20px',
          borderRadius: `0 ${AlphaShoutTheme.radius.medium} ${AlphaShoutTheme.radius.medium} 0`,
          fontStyle: 'italic',
          color: AlphaShoutTheme.colors.textSecondary
        }}>
          <span dangerouslySetInnerHTML={{ __html: parseInlineStyles(quoteText) }} />
        </blockquote>
      );
      continue;
    }

    // Lists
    const unorderedListMatch = line.match(/^(\s*)[*+-]\s(.+)/);
    const orderedListMatch = line.match(/^(\s*)(\d+)\.\s(.+)/);

    if (unorderedListMatch || orderedListMatch) {
      const isOrdered = !!orderedListMatch;
      const indent = (unorderedListMatch || orderedListMatch)[1].length;
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
              paddingLeft: '24px',
              margin: '12px 0',
              color: AlphaShoutTheme.colors.textSecondary,
              fontFamily: AlphaShoutTheme.fonts.primary,
              lineHeight: '1.8'
            }
          },
          []
        );
      }

      const listItem = (
        <li key={`item-${i}`} style={{
          marginBottom: '8px',
          paddingLeft: `${indent * 20}px`
        }}>
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

    // Horizontal rules
    if (line.match(/^---+$/) || line.match(/^\*\*\*+$/) || line.match(/^___+$/)) {
      elements.push(
        <hr key={i} style={{
          border: 'none',
          borderTop: `1px solid ${AlphaShoutTheme.colors.borderLight}`,
          margin: '24px 0'
        }} />
      );
      continue;
    }

    // Empty lines
    if (line.trim() === '') {
      if (i > 0 && lines[i - 1].trim() !== '') {
        elements.push(<div key={i} style={{ height: '16px' }} />);
      }
      continue;
    }

    // Regular paragraphs
    elements.push(
      <p key={i} style={{
        color: AlphaShoutTheme.colors.textSecondary,
        lineHeight: '1.7',
        marginBottom: '12px',
        fontFamily: AlphaShoutTheme.fonts.primary,
        fontSize: '15px'
      }}>
        <span dangerouslySetInnerHTML={{ __html: parseInlineStyles(line) }} />
      </p>
    );
  }

  // Add any remaining list
  if (currentList) {
    elements.push(currentList);
  }

  return <div style={{ fontFamily: AlphaShoutTheme.fonts.primary }}>{elements}</div>;
};

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
    </div>
  );
};

// Technical Refresh Button Component
const TechnicalRefreshButton = ({ onClick, loading }) => (
  <button
    onClick={onClick}
    disabled={loading}
    style={{
      background: loading ? AlphaShoutTheme.colors.surfaceSecondary : AlphaShoutTheme.colors.surface,
      border: `1px solid ${AlphaShoutTheme.colors.primary}`,
      borderRadius: AlphaShoutTheme.radius.medium,
      padding: '6px 12px',
      color: AlphaShoutTheme.colors.primary,
      cursor: loading ? 'not-allowed' : 'pointer',
      fontSize: '12px',
      fontWeight: 500,
      fontFamily: AlphaShoutTheme.fonts.primary,
      transition: 'all 0.2s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '6px',
      marginTop: '12px'
    }}
  >
    {loading ? (
      <>
        <Spin size="small" />
        Refreshing...
      </>
    ) : (
      <>
        <ReloadOutlined style={{ fontSize: '12px' }} />
        Refresh (1 token)
      </>
    )}
  </button>
);

// Main Component
const EnhancedScreenshotAnalyzer = () => {
  // State Management
  const [activeTab, setActiveTab] = useState('screenshot');
  const [screenshot, setScreenshot] = useState(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [error, setError] = useState(null);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectionArea, setSelectionArea] = useState(null);
  const [isSelecting, setIsSelecting] = useState(false);
  const [fullScreenshot, setFullScreenshot] = useState(null);
  const [aiAnalysis, setAiAnalysis] = useState(null);
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisModalVisible, setAnalysisModalVisible] = useState(false);
  const [customAnalysisModalVisible, setCustomAnalysisModalVisible] = useState(false);
  const [customPrompt, setCustomPrompt] = useState('');
  const [analysisError, setAnalysisError] = useState(null);
  const [selectionComplete, setSelectionComplete] = useState(false);
  const [imageLoading, setImageLoading] = useState(false);
  const [imageLoadError, setImageLoadError] = useState(false);
  const [imageLoadProgress, setImageLoadProgress] = useState(0);
  const [imageInfo, setImageInfo] = useState(null);
  const [startPoint, setStartPoint] = useState(null);
  const [isMouseDown, setIsMouseDown] = useState(false);
  
  // Authentication and quota states
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [userQuota, setUserQuota] = useState(null);
  const [quotaConfig, setQuotaConfig] = useState(null);
  const [authMessage, setAuthMessage] = useState('');
  const [techAuthMessage, setTechAuthMessage] = useState('');
  
  // Stock Analysis States
  const [symbol, setSymbol] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const [interval, setInterval] = useState('5m');
  const [technicalAnalysis, setTechnicalAnalysis] = useState(null);
  const [chartUrl, setChartUrl] = useState(null);
  const [isLoadingTechnical, setIsLoadingTechnical] = useState(false);
  
  const canvasRef = useRef(null);
  const selectionCanvasRef = useRef(null);
  const overlayRef = useRef(null);
  const dropdownRef = useRef(null);
  const searchTimeoutRef = useRef(null);
  const searchInputRef = useRef(null);

  // Check authentication on mount
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
      const response = await fetch(`${API_BASE_URL}/api/screenshot/quota-config`);
      const data = await response.json();
      if (data.success) {
        setQuotaConfig(data.config);
      }
    } catch (error) {
      console.error('Failed to fetch quota config:', error);
    }
  };

  // ==================== Selection Mode Functions ====================
  const handleMouseDown = useCallback((e) => {
    if (!isSelecting) return;
    
    if (e.button !== 0) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    setIsMouseDown(true);
    setStartPoint({ x, y });
    setSelectionArea({
      x: x,
      y: y,
      width: 0,
      height: 0
    });
    setSelectionComplete(false);
  }, [isSelecting]);

  const handleMouseMove = useCallback((e) => {
    if (!startPoint || !isSelecting || !isMouseDown) return;
    
    const rect = e.currentTarget.getBoundingClientRect();
    const currentX = e.clientX - rect.left;
    const currentY = e.clientY - rect.top;
    
    const x = Math.min(currentX, startPoint.x);
    const y = Math.min(currentY, startPoint.y);
    const width = Math.abs(currentX - startPoint.x);
    const height = Math.abs(currentY - startPoint.y);
    
    setSelectionArea({ x, y, width, height });
  }, [startPoint, isSelecting, isMouseDown]);

  const handleMouseUp = useCallback(() => {
    if (!isMouseDown) return;
    
    setIsMouseDown(false);
    setStartPoint(null);
    
    const MIN_WIDTH = 50;
    const MIN_HEIGHT = 50;
    
    if (selectionArea) {
      if (selectionArea.width >= MIN_WIDTH && selectionArea.height >= MIN_HEIGHT) {
        setSelectionComplete(true);
        showAlphaShoutMessage('success', 'Selection ready!');
      } else {
        setSelectionArea(null);
        setSelectionComplete(false);
        showAlphaShoutMessage('info', `Please select a larger area (min: ${MIN_WIDTH}×${MIN_HEIGHT}px)`, 2);
      }
    }
  }, [selectionArea, isMouseDown]);

  const confirmSelection = async () => {
    if (!selectionArea || !fullScreenshot) {
      showAlphaShoutMessage('warning', 'Please select an area first');
      return;
    }
    
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      const img = new Image();
      
      img.onload = () => {
        const scaleX = img.naturalWidth / imageInfo.displayWidth;
        const scaleY = img.naturalHeight / imageInfo.displayHeight;
        
        const actualX = selectionArea.x * scaleX;
        const actualY = selectionArea.y * scaleY;
        const actualWidth = selectionArea.width * scaleX;
        const actualHeight = selectionArea.height * scaleY;
        
        canvas.width = actualWidth;
        canvas.height = actualHeight;
        
        ctx.drawImage(
          img,
          actualX, actualY, actualWidth, actualHeight,
          0, 0, actualWidth, actualHeight
        );
        
        const croppedImage = canvas.toDataURL('image/png');
        setScreenshot(croppedImage);
        setIsSelecting(false);
        setFullScreenshot(null);
        setSelectionArea(null);
        setSelectionComplete(true);
        
        showAlphaShoutMessage('success', 'Area selected successfully!');
      };
      
      img.onerror = () => {
        showAlphaShoutMessage('error', 'Failed to process selection');
      };
      
      img.src = fullScreenshot;
    } catch (error) {
      console.error('Error processing selection:', error);
      showAlphaShoutMessage('error', 'Failed to process selection');
    }
  };

  const clearSelection = () => {
    setSelectionArea(null);
    setStartPoint(null);
    setSelectionComplete(false);
    showAlphaShoutMessage('info', 'Selection cleared. Click and drag to make a new selection.');
  };

  const cancelSelectionMode = () => {
    setIsSelecting(false);
    setFullScreenshot(null);
    setSelectionArea(null);
    setSelectionComplete(false);
    setStartPoint(null);
    setIsMouseDown(false);
    showAlphaShoutMessage('info', 'Selection mode cancelled');
  };

  // ==================== Copy Function ====================
  const copyAnalysisToClipboard = () => {
    if (aiAnalysis) {
      navigator.clipboard.writeText(aiAnalysis)
        .then(() => {
          showAlphaShoutMessage('success', 'Analysis copied to clipboard!');
        })
        .catch(() => {
          showAlphaShoutMessage('error', 'Failed to copy analysis');
        });
    }
  };

  // ==================== Keyboard Shortcuts ====================
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.key === 'Escape') {
        if (isSelecting) {
          cancelSelectionMode();
        } else if (showDropdown) {
          setShowDropdown(false);
          setSelectedIndex(-1);
        } else if (analysisModalVisible) {
          setAnalysisModalVisible(false);
        } else if (customAnalysisModalVisible) {
          setCustomAnalysisModalVisible(false);
        }
      }
      
      if (e.key === 'Enter' && selectionArea && selectionArea.width > 10 && isSelecting) {
        e.preventDefault();
        confirmSelection();
      }
    };
    
    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [isSelecting, selectionArea, showDropdown, analysisModalVisible, customAnalysisModalVisible]);

  // ==================== Search Dropdown Keyboard Navigation ====================
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (!showDropdown || searchResults.length === 0) return;
      
      if (e.key === 'ArrowDown') {
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < searchResults.length - 1 ? prev + 1 : 0
        );
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        setSelectedIndex(prev => prev > 0 ? prev - 1 : searchResults.length - 1);
      } else if (e.key === 'Enter' && selectedIndex >= 0) {
        e.preventDefault();
        selectSymbol(searchResults[selectedIndex]);
      }
    };
    
    if (showDropdown) {
      document.addEventListener('keydown', handleKeyDown);
      return () => document.removeEventListener('keydown', handleKeyDown);
    }
  }, [showDropdown, searchResults, selectedIndex]);

  // ==================== Quick Analysis Templates ====================
  const QUICK_ANALYSIS_TEMPLATES = {
    'trend_identification': {
      prompt: 'You are a professional financial analyst. Provide a concise analysis of the stock based on the provided data. Analyze image based on: Recognizing whether a stock is in an uptrend, downtrend, or sideways trend is fundamental. Tools like Moving Averages (Simple and Exponential) and Moving Average Convergence Divergence (MACD) are widely used to capture trends and potential changes in momentum.',
      displayName: 'Trend Identification Analysis'
    },
    'momentum_rsi': {
      prompt: 'You are a professional financial analyst. Provide a concise analysis of the stock based on the provided data. Analyze image based on: Oscillators such as the Relative Strength Index (RSI) help identify if a stock is overbought (above 70) or oversold (below 30), indicating potential reversals or pullbacks.',
      displayName: 'Momentum & RSI Analysis'
    },
    'support_resistance': {
      prompt: 'You are a professional financial analyst. Provide a concise analysis of the stock based on the provided data. Analyze image based on: These price levels act as barriers where buying or selling pressure tends to emerge. Use tools like pivot points, trendlines, channels, and Fibonacci retracements to anticipate areas where prices might reverse or consolidate.',
      displayName: 'Support & Resistance Analysis'
    },
    'volume_analysis': {
      prompt: 'You are a professional financial analyst. Provide a concise analysis of the stock based on the provided data. Analyze image based on: Volume confirms the strength or weakness behind price moves. Indicators like On-Balance Volume (OBV) and Accumulation/Distribution Line track volume flow to confirm trend sustainability or signal divergences that may precede reversals.',
      displayName: 'Volume Analysis'
    },
    'volatility_bollinger': {
      prompt: 'You are a professional financial analyst. Provide a concise analysis of the stock based on the provided data. Analyze image based on: Tools such as Bollinger Bands measure volatility by creating bands around moving averages. Contracting bands signal low volatility and potential breakouts, while expanding bands indicate higher volatility.',
      displayName: 'Volatility & Bollinger Analysis'
    }
  };

  const handleQuickAnalysis = (templateType) => {
    if (!screenshot) {
      showAlphaShoutMessage('warning', 'Please capture a screenshot first');
      return;
    }
    
    if (QUICK_ANALYSIS_TEMPLATES[templateType]) {
      const template = QUICK_ANALYSIS_TEMPLATES[templateType];
      setCustomPrompt(template.prompt);
      analyzeScreenshot(template.prompt, true);
    }
  };

  // Symbol Search Functions
  const searchSymbols = async (query) => {
    if (!query || query.length < 2) {
      setSearchResults([]);
      setShowDropdown(false);
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
        setSearchResults(data.symbols);
        setShowDropdown(data.symbols.length > 0);
        setSelectedIndex(-1);
      }
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
      setShowDropdown(false);
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
      setShowDropdown(false);
      return;
    }
    
    searchTimeoutRef.current = setTimeout(() => {
      searchSymbols(value);
    }, 300);
  };

  const selectSymbol = (symbolData) => {
    const formattedSymbol = `${symbolData.exchange}:${symbolData.symbol}`;
    setSymbol(formattedSymbol);
    setSearchQuery(formattedSymbol);
    setShowDropdown(false);
    setSelectedIndex(-1);
  };

  // Fetch Technical Analysis Only
  const fetchTechnicalAnalysisOnly = async () => {
    setTechAuthMessage('');
    
    if (!symbol) {
      setTechAuthMessage('no_symbol');
      showAlphaShoutMessage('warning', 'Please select a stock symbol first');
      return;
    }

    if (!isAuthenticated) {
      setTechAuthMessage('login_required');
      showAlphaShoutMessage('warning', (
        <span>
          Please <a 
            onClick={() => window.dispatchEvent(new CustomEvent('navigate-to-login', { detail: { page: 'login' } }))}
            style={{ 
              color: AlphaShoutTheme.colors.primary, 
              textDecoration: 'underline', 
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            login
          </a> to use this feature
        </span>
      ), 4);
      return;
    }

    // Frontend token check
    const TECH_ANALYSIS_COST = 2;
    if (userQuota && userQuota.available_quota < TECH_ANALYSIS_COST) {
      setTechAuthMessage('insufficient_tokens');
      showAlphaShoutMessage('warning', (
        <span>
          You need <strong>{TECH_ANALYSIS_COST} tokens</strong> for technical analysis. 
          Your balance: <strong>{userQuota.available_quota} tokens</strong>. 
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
      return;
    }

    setIsLoadingTechnical(true);
    setTechnicalAnalysis(null);
    setChartUrl(null);

    try {
      const response = await fetch(`${API_BASE_URL}/api/stock/technical-analysis-only`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        body: JSON.stringify({ symbol, interval })
      });

      const data = await response.json();

      if (!response.ok || !data.success) {
        if (data.error === 'INSUFFICIENT_QUOTA') {
          setTechAuthMessage('insufficient_tokens');
          showAlphaShoutMessage('warning', (
            <span>
              You need <strong>{data.required} tokens</strong> for technical analysis. 
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
          showAlphaShoutMessage('error', data.message || 'Failed to fetch analysis');
        }
        return;
      }

      setTechAuthMessage('');

      const results = data.analysis.results.technicalAnalysis;
      setTechnicalAnalysis(results.content);
      setChartUrl(results.chartUrl);
      
      if (data.quota) {
        setUserQuota(prev => ({ ...prev, available_quota: data.quota.remaining }));
        showAlphaShoutMessage('success', `Analysis completed! ${data.quota.deducted} tokens used.`);
      }

    } catch (error) {
      console.error('Technical analysis error:', error);
      showAlphaShoutMessage('error', 'Failed to fetch technical analysis');
    } finally {
      setIsLoadingTechnical(false);
    }
  };

  // Refresh Technical Analysis
  const refreshTechnicalAnalysis = async () => {
    setTechAuthMessage('');
    
    if (!symbol) {
      setTechAuthMessage('no_symbol');
      showAlphaShoutMessage('warning', 'Please select a stock symbol first');
      return;
    }

    if (!isAuthenticated) {
      setTechAuthMessage('login_required');
      showAlphaShoutMessage('warning', (
        <span>
          Please <a 
            onClick={() => window.dispatchEvent(new CustomEvent('navigate-to-login', { detail: { page: 'login' } }))}
            style={{ 
              color: AlphaShoutTheme.colors.primary, 
              textDecoration: 'underline', 
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            login
          </a> to refresh analysis
        </span>
      ), 4);
      return;
    }

    const REFRESH_COST = 1;
    if (userQuota && userQuota.available_quota < REFRESH_COST) {
      setTechAuthMessage('insufficient_tokens_refresh');
      showAlphaShoutMessage('warning', (
        <span>
          You need <strong>1 token</strong> to refresh. 
          Your balance: <strong>{userQuota.available_quota} tokens</strong>. 
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
      return;
    }

    setIsLoadingTechnical(true);

    try {
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

      if (!response.ok || !data.success) {
        if (data.error === 'INSUFFICIENT_QUOTA') {
          setTechAuthMessage('insufficient_tokens_refresh');
          showAlphaShoutMessage('warning', (
            <span>
              You need <strong>1 token</strong> to refresh. 
              Your balance: <strong>{userQuota?.available_quota || 0} tokens</strong>. 
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
        return;
      }

      setTechAuthMessage('');
      
      showAlphaShoutMessage('success', `Refreshed! ${data.quota.deducted} token used.`);
      
      if (data.quota) {
        setUserQuota(prev => ({ ...prev, available_quota: data.quota.remaining }));
      }

      setTechnicalAnalysis(data.data.content);
      setChartUrl(data.data.chartUrl);

    } catch (error) {
      console.error('Refresh error:', error);
      showAlphaShoutMessage('error', 'Refresh failed');
    } finally {
      setIsLoadingTechnical(false);
    }
  };

  // Screenshot Functions
  const captureFullScreen = async () => {
    setIsCapturing(true);
    setError(null);
    setAuthMessage('');
    setSelectionComplete(false);
    setImageLoading(false);
    setImageLoadError(false);
    setImageLoadProgress(0);
    
    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getDisplayMedia) {
        throw new Error('Screen capture is not supported in your browser');
      }

      const stream = await navigator.mediaDevices.getDisplayMedia({
        video: {
          mediaSource: 'screen',
          width: { ideal: 1920, max: 2560 },
          height: { ideal: 1080, max: 2160 },
          frameRate: { ideal: 30, max: 60 }
        }
      });

      const video = document.createElement('video');
      video.srcObject = stream;
      video.setAttribute('playsinline', '');
      video.setAttribute('autoplay', '');
      video.muted = true;

      video.onloadedmetadata = async () => {
        try {
          await new Promise(resolve => setTimeout(resolve, 100));
          
          const canvas = canvasRef.current;
          const ctx = canvas.getContext('2d');
          
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          
          ctx.imageSmoothingEnabled = false;
          ctx.drawImage(video, 0, 0);
          
          const dataURL = canvas.toDataURL('image/png', 1.0);
          
          stream.getTracks().forEach(track => track.stop());
          
          window.focus();
          
          if (selectionMode) {
            setImageLoading(true);
            setImageLoadProgress(0);
            setFullScreenshot(dataURL);
            setIsSelecting(true);
            showAlphaShoutMessage('success', 'Screenshot captured! Loading image for selection...', 3);
          } else {
            setScreenshot(dataURL);
            showAlphaShoutMessage('success', 'Screenshot captured successfully!');
          }
          
          setIsCapturing(false);
        } catch (error) {
          console.error('Error processing video:', error);
          stream.getTracks().forEach(track => track.stop());
          throw new Error('Failed to process video stream');
        }
      };

      await video.play();

    } catch (err) {
      handleCaptureError(err);
    }
  };

  const handleCaptureError = (err) => {
    console.error('Error capturing screenshot:', err);
    let errorMessage = 'Failed to capture screenshot';
    
    if (err.name === 'NotAllowedError') {
      errorMessage = 'Screen capture permission denied. Please allow screen sharing and try again.';
    } else if (err.name === 'AbortError') {
      errorMessage = 'Screen capture was cancelled.';
    } else if (err.message) {
      errorMessage = err.message;
    }
    
    setError(errorMessage);
    setIsCapturing(false);
    setIsSelecting(false);
    setImageLoading(false);
    showAlphaShoutMessage('error', errorMessage);
  };

  const clearScreenshot = () => {
    setScreenshot(null);
    setFullScreenshot(null);
    setSelectionArea(null);
    setIsSelecting(false);
    setError(null);
    setAiAnalysis(null);
    setAnalysisError(null);
    setAuthMessage('');
    setCustomPrompt('');
    setSelectionComplete(false);
    setImageLoading(false);
    setImageLoadError(false);
    setImageLoadProgress(0);
    setImageInfo(null);
    setStartPoint(null);
    setIsMouseDown(false);
    showAlphaShoutMessage('info', 'Screenshot cleared');
  };

  const downloadScreenshot = () => {
    if (!screenshot) {
      showAlphaShoutMessage('warning', 'No screenshot available to download');
      return;
    }
    
    try {
      const link = document.createElement('a');
      const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
      link.download = `stock-chart-${timestamp}.png`;
      link.href = screenshot;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      
      showAlphaShoutMessage('success', 'Screenshot downloaded successfully!');
    } catch (err) {
      showAlphaShoutMessage('error', 'Failed to download screenshot');
    }
  };

  // ENHANCED ANALYZE SCREENSHOT FUNCTION WITH AUTH LOGIC
  const analyzeScreenshot = async (customPromptText = '', keepModalOpen = false) => {
    console.log('analyzeScreenshot called with:', { customPromptText, keepModalOpen });
    console.log('Current screenshot:', screenshot ? 'exists' : 'null');
    console.log('Is authenticated:', isAuthenticated);
    
    // Clear any previous auth message
    setAuthMessage('');
    
    if (!screenshot) {
      setAuthMessage('no_screenshot');
      showAlphaShoutMessage('warning', 'Please capture a screenshot first');
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
          </a> to use AI analysis features
        </span>
      ), 4);
      return;
    }

    // Check quota before making request
    const ANALYSE_COST = quotaConfig?.ANALYSE_COST || 2;
    if (userQuota && userQuota.available_quota < ANALYSE_COST) {
      setAuthMessage('insufficient_tokens');
      showAlphaShoutMessage('warning', (
        <span>
          You need <strong>{ANALYSE_COST} tokens</strong> for AI analysis. 
          Your balance: <strong>{userQuota.available_quota} tokens</strong>. 
          <a 
            onClick={() => {
              setAuthMessage('');
              window.dispatchEvent(new CustomEvent('navigate-to-payment', { detail: { page: 'payment2' } }));
            }}
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
      return;
    }

    if (isAnalyzing) {
      showAlphaShoutMessage('info', 'Analysis already in progress...');
      return;
    }

    if (!keepModalOpen) {
      setCustomAnalysisModalVisible(false);
      setAnalysisModalVisible(true);
    }
    
    setIsAnalyzing(true);
    setAiAnalysis(null);
    setAnalysisError(null);
    
    try {
      console.log('Sending analysis request to:', `${API_BASE_URL}/api/screenshot/analyze`);
      
      const requestBody = {
        screenshot: screenshot,
        prompt: customPromptText || undefined,
        requestId: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        timestamp: new Date().toISOString()
      };
      
      const response = await fetch(`${API_BASE_URL}/api/screenshot/analyze`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        credentials: 'include',
        body: JSON.stringify(requestBody)
      });
      
      console.log('Response status:', response.status);
      
      const data = await response.json();
      console.log('Response data:', data);
      
      if (!response.ok || !data.success) {
        if (data.error === 'INSUFFICIENT_QUOTA') {
          setAuthMessage('insufficient_tokens');
          showAlphaShoutMessage('warning', (
            <span>
              You need <strong>{data.required} tokens</strong> for AI analysis. 
              Your balance: <strong>{data.available} tokens</strong>. 
              <a 
                onClick={() => {
                  setAuthMessage('');
                  window.dispatchEvent(new CustomEvent('navigate-to-payment', { detail: { page: 'payment2' } }));
                }}
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
          setAnalysisError({
            message: data.message || 'Analysis failed. Please try again.',
            timestamp: new Date().toLocaleString()
          });
          showAlphaShoutMessage('error', data.message || 'Analysis failed');
        }
        return;
      }

      // Clear auth message on success
      setAuthMessage('');
      setAiAnalysis(data.analysis.content);
      showAlphaShoutMessage('success', `Analysis completed! ${data.quota.deducted} tokens used.`);
      
      if (data.quota.remaining !== undefined) {
        setUserQuota(prev => ({
          ...prev,
          available_quota: data.quota.remaining
        }));
      }
      
    } catch (error) {
      console.error('Analysis error details:', error);
      setAnalysisError({
        message: `Error: ${error.message || 'Unknown error occurred'}`,
        timestamp: new Date().toLocaleString()
      });
      showAlphaShoutMessage('error', 'Analysis failed. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  // ==================== Selection Mode Display ====================
  const renderSelectionMode = () => {
    if (!isSelecting || !fullScreenshot) return null;

    const MIN_WIDTH = 50;
    const MIN_HEIGHT = 50;
    const isValidSize = selectionArea && 
      selectionArea.width >= MIN_WIDTH && 
      selectionArea.height >= MIN_HEIGHT;

    return (
      <div
        ref={overlayRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(0, 0, 0, 0.8)',
          zIndex: 9999,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          overflow: 'auto',
          padding: '20px',
          cursor: isMouseDown ? 'crosshair' : 'default'
        }}
      >
        <div style={{
          position: 'relative',
          maxWidth: '90vw',
          maxHeight: '90vh',
          overflow: 'auto',
          backgroundColor: '#fff',
          borderRadius: '8px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.3)'
        }}>
          {/* Selection Toolbar */}
          <div style={{
            position: 'sticky',
            top: 0,
            zIndex: 10,
            backgroundColor: AlphaShoutTheme.colors.primary,
            color: '#fff',
            padding: '12px 20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            borderRadius: '8px 8px 0 0'
          }}>
            <div>
              <span style={{ fontSize: '16px', fontWeight: 500 }}>
                {isMouseDown ? 
                  '🖱️ Drag to select area' : 
                  selectionComplete ? 
                  '✅ Selection complete - Click confirm to proceed' :
                  '👆 Click and drag to select an area'}
              </span>
              <span style={{ 
                fontSize: '12px', 
                marginLeft: '16px',
                opacity: 0.8
              }}>
                (Min size: {MIN_WIDTH}×{MIN_HEIGHT}px)
              </span>
            </div>
            <AlphaShoutButton
              onClick={cancelSelectionMode}
              style={{
                background: 'rgba(255,255,255,0.2)',
                border: 'none',
                color: '#fff'
              }}
            >
              Cancel (ESC)
            </AlphaShoutButton>
          </div>
          
          {/* Image Container */}
          <div 
            style={{
              position: 'relative',
              display: 'inline-block',
              cursor: isMouseDown ? 'crosshair' : 'crosshair',
              userSelect: 'none'
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
          >
            <img
              src={fullScreenshot}
              alt="Full Screenshot"
              style={{
                display: 'block',
                maxWidth: '100%',
                height: 'auto',
                pointerEvents: 'none'
              }}
              onLoad={(e) => {
                setImageLoading(false);
                setImageInfo({
                  width: e.target.naturalWidth,
                  height: e.target.naturalHeight,
                  displayWidth: e.target.width,
                  displayHeight: e.target.height
                });
              }}
              onError={() => {
                setImageLoadError(true);
                setImageLoading(false);
                showAlphaShoutMessage('error', 'Failed to load screenshot for selection');
              }}
              draggable={false}
            />
            
            {/* Selection Box */}
            {selectionArea && (
              <div
                style={{
                  position: 'absolute',
                  left: `${selectionArea.x}px`,
                  top: `${selectionArea.y}px`,
                  width: `${selectionArea.width}px`,
                  height: `${selectionArea.height}px`,
                  border: selectionComplete ? 
                    '2px solid #52c41a' :
                    isValidSize ? 
                      '2px dashed #00A6E0' :
                      '2px dashed #ff4d4f',
                  backgroundColor: selectionComplete ? 
                    'rgba(82, 196, 26, 0.1)' :
                    'rgba(0, 166, 224, 0.1)',
                  pointerEvents: 'none',
                  transition: 'border-color 0.2s ease'
                }}
              >
                {/* Size Label */}
                {selectionArea.width > 30 && selectionArea.height > 20 && (
                  <div style={{
                    position: 'absolute',
                    top: '-25px',
                    left: '0',
                    background: selectionComplete ? 
                      '#52c41a' : 
                      isValidSize ? 
                        AlphaShoutTheme.colors.primary : 
                        '#ff4d4f',
                    color: '#fff',
                    padding: '2px 8px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    whiteSpace: 'nowrap'
                  }}>
                    {Math.round(selectionArea.width)} × {Math.round(selectionArea.height)}
                    {selectionComplete && ' ✔'}
                  </div>
                )}
                
                {/* Selection complete indicator */}
                {selectionComplete && (
                  <div style={{
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    background: 'rgba(82, 196, 26, 0.9)',
                    color: '#fff',
                    padding: '8px 16px',
                    borderRadius: '4px',
                    fontSize: '14px',
                    fontWeight: 600,
                    boxShadow: '0 2px 8px rgba(0,0,0,0.2)'
                  }}>
                    <CheckOutlined style={{ marginRight: '8px' }} />
                    Ready
                  </div>
                )}
              </div>
            )}
            
            {/* Minimum size guide */}
            {isMouseDown && startPoint && !selectionArea && (
              <div style={{
                position: 'absolute',
                left: `${startPoint.x}px`,
                top: `${startPoint.y}px`,
                width: `${MIN_WIDTH}px`,
                height: `${MIN_HEIGHT}px`,
                border: '1px dotted rgba(255, 255, 255, 0.2)',
                pointerEvents: 'none'
              }}>
                <div style={{
                  position: 'absolute',
                  top: '-18px',
                  left: '0',
                  background: 'rgba(0, 0, 0, 0.5)',
                  color: '#fff',
                  padding: '1px 4px',
                  borderRadius: '2px',
                  fontSize: '10px',
                  whiteSpace: 'nowrap',
                  opacity: 0.7
                }}>
                  Min size
                </div>
              </div>
            )}
          </div>
          
          {/* Action Buttons */}
          {selectionArea && (
            <div style={{
              position: 'sticky',
              bottom: 0,
              backgroundColor: AlphaShoutTheme.colors.surfaceSecondary,
              padding: '16px',
              borderTop: `1px solid ${AlphaShoutTheme.colors.border}`,
              textAlign: 'center',
              borderRadius: '0 0 8px 8px'
            }}>
              {isValidSize ? (
                <Space>
                  <AlphaShoutButton
                    primary
                    size="large"
                    icon={<CheckOutlined />}
                    onClick={confirmSelection}
                    style={{
                      background: selectionComplete ? AlphaShoutTheme.colors.success : AlphaShoutTheme.colors.primary,
                      borderColor: selectionComplete ? AlphaShoutTheme.colors.success : AlphaShoutTheme.colors.primary,
                      boxShadow: selectionComplete ? '0 2px 8px rgba(82, 196, 26, 0.3)' : 'none'
                    }}
                  >
                    {selectionComplete ? 'Confirm Selection ✔' : 'Confirm Selection'} (Enter)
                  </AlphaShoutButton>
                  <AlphaShoutButton
                    size="large"
                    icon={<ClearOutlined />}
                    onClick={clearSelection}
                  >
                    Clear Selection
                  </AlphaShoutButton>
                </Space>
              ) : (
                <div style={{ color: AlphaShoutTheme.colors.textSecondary }}>
                  <InfoCircleOutlined style={{ 
                    color: AlphaShoutTheme.colors.warning, 
                    marginRight: '8px'
                  }} />
                  Continue dragging to reach minimum size ({MIN_WIDTH}×{MIN_HEIGHT}px)
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div style={{ 
      minHeight: '100vh',
      background: AlphaShoutTheme.colors.background,
      fontFamily: AlphaShoutTheme.fonts.primary
    }}>
      {/* Quota Display */}
      <QuotaDisplay 
        quota={userQuota} 
        onRecharge={() => window.dispatchEvent(new CustomEvent('navigate-to-payment', { detail: { page: 'payment2' } }))} 
        isAuthenticated={isAuthenticated}
      />

      <div style={{ maxWidth: 1400, margin: '0 auto', padding: '24px' }}>
        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: '48px', paddingTop: '32px' }}>
          <Title level={1} style={{
            color: AlphaShoutTheme.colors.primary,
            fontFamily: AlphaShoutTheme.fonts.heading,
            fontSize: '42px',
            marginBottom: '8px'
          }}>
            <BarChartOutlined style={{ marginRight: '16px' }} />
            Real-time Trending AI Analysis
          </Title>
          <Text style={{
            fontSize: '18px',
            color: AlphaShoutTheme.colors.textSecondary
          }}>
            AI-powered technical analysis with captured chart
          </Text>
        </div>

        {/* Main Content Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
          
          {/* Left Column - Screenshot Analysis */}
          <div>
            <AlphaShoutCard>
              <Title level={4} style={{ color: AlphaShoutTheme.colors.primary, marginBottom: '24px' }}>
                <FileImageOutlined style={{ marginRight: '8px' }} />
                Screenshot Analysis
              </Title>

              {/* Screenshot Instructions */}
              <div style={{
                background: `linear-gradient(135deg, ${AlphaShoutTheme.colors.primaryLight}10, ${AlphaShoutTheme.colors.secondary}10)`,
                padding: '20px',
                borderRadius: AlphaShoutTheme.radius.medium,
                marginBottom: '24px',
                border: `1px solid ${AlphaShoutTheme.colors.secondary}30`
              }}>
                <Text style={{ color: AlphaShoutTheme.colors.textSecondary }}>
                  Take a screenshot of any chart and get AI-powered insights
                </Text>
              </div>

              {/* Selection Mode Toggle */}
              <div style={{ marginBottom: '24px', textAlign: 'center' }}>
                <Space direction="vertical" size="small">
                  <Text strong style={{ fontSize: '14px' }}>
                    Capture Mode
                  </Text>
                  <Space>
                    <FullscreenOutlined style={{ color: AlphaShoutTheme.colors.primary }} />
                    <Switch
                      checked={selectionMode}
                      onChange={setSelectionMode}
                      disabled={isCapturing || isSelecting}
                    />
                    <SelectOutlined style={{ color: AlphaShoutTheme.colors.secondary }} />
                  </Space>
                  <Text style={{ fontSize: '12px', color: AlphaShoutTheme.colors.textLight }}>
                    {selectionMode ? 'Area Selection' : 'Full Screen'}
                  </Text>
                </Space>
              </div>

              {/* Screenshot Buttons */}
              <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                <Space size="middle" wrap>
                  {!isSelecting && !screenshot ? (
                    <AlphaShoutButton
                      primary
                      size="large"
                      icon={<CameraOutlined />}
                      loading={isCapturing}
                      onClick={captureFullScreen}
                    >
                      {isCapturing ? 'Capturing...' : 
                       selectionMode ? 'Start Selection' : 'Take Screenshot'}
                    </AlphaShoutButton>
                  ) : null}
                  
                  {screenshot && !isSelecting && (
                    <>
                      <AlphaShoutButton
                        primary
                        size="large"
                        icon={<RobotOutlined />}
                        onClick={() => {
                          console.log('AI Analysis button clicked');
                          analyzeScreenshot();
                        }}
                        loading={isAnalyzing}
                        disabled={isAnalyzing}
                      >
                        {isAnalyzing ? 'Analyzing...' : `AI Analysis (${quotaConfig?.ANALYSE_COST || 2} tokens)`}
                      </AlphaShoutButton>
                      <AlphaShoutButton
                        size="large"
                        icon={<SettingOutlined />}
                        onClick={() => setCustomAnalysisModalVisible(true)}
                        disabled={isAnalyzing}
                      >
                        Custom Analysis
                      </AlphaShoutButton>
                      <AlphaShoutButton
                        size="large"
                        icon={<DownloadOutlined />}
                        onClick={downloadScreenshot}
                      >
                        Download
                      </AlphaShoutButton>
                      <AlphaShoutButton
                        size="large"
                        icon={<ReloadOutlined />}
                        onClick={clearScreenshot}
                        danger
                      >
                        Clear
                      </AlphaShoutButton>
                    </>
                  )}
                </Space>
              </div>

              {/* Auth Messages for Screenshot Analysis */}
              {screenshot && !isSelecting && authMessage === 'no_screenshot' && (
                <div style={{
                  marginTop: '16px',
                  padding: '12px 20px',
                  background: `linear-gradient(135deg, ${AlphaShoutTheme.colors.warning}10, ${AlphaShoutTheme.colors.warning}05)`,
                  border: `1px solid ${AlphaShoutTheme.colors.warning}`,
                  borderRadius: AlphaShoutTheme.radius.medium,
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
                    Please capture a screenshot first
                  </span>
                </div>
              )}

              {screenshot && !isSelecting && authMessage === 'login_required' && (
                <div style={{
                  marginTop: '16px',
                  padding: '12px 20px',
                  background: `linear-gradient(135deg, ${AlphaShoutTheme.colors.warning}10, ${AlphaShoutTheme.colors.warning}05)`,
                  border: `1px solid ${AlphaShoutTheme.colors.warning}`,
                  borderRadius: AlphaShoutTheme.radius.medium,
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
                    {' '}to use AI analysis features
                  </span>
                </div>
              )}
              
              {screenshot && !isSelecting && authMessage === 'insufficient_tokens' && (
                <div style={{
                  marginTop: '16px',
                  padding: '12px 20px',
                  background: `linear-gradient(135deg, ${AlphaShoutTheme.colors.error}10, ${AlphaShoutTheme.colors.error}05)`,
                  border: `1px solid ${AlphaShoutTheme.colors.error}`,
                  borderRadius: AlphaShoutTheme.radius.medium,
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

              {/* Screenshot Display */}
              {screenshot && !isSelecting && (
                <div style={{
                  maxHeight: '400px',
                  overflow: 'auto',
                  padding: '10px',
                  backgroundColor: AlphaShoutTheme.colors.surfaceSecondary,
                  borderRadius: AlphaShoutTheme.radius.medium,
                  border: `1px solid ${AlphaShoutTheme.colors.border}`
                }}>
                  <img
                    src={screenshot}
                    alt="Screenshot"
                    style={{ 
                      maxWidth: '100%',
                      height: 'auto',
                      display: 'block',
                      margin: '0 auto',
                      borderRadius: AlphaShoutTheme.radius.small
                    }}
                  />
                </div>
              )}

              {/* Error Alert */}
              {error && (
                <Alert
                  type="error"
                  message="Screenshot Capture Failed"
                  description={error}
                  showIcon
                  closable
                  onClose={() => setError(null)}
                  style={{ marginTop: 16 }}
                />
              )}
            </AlphaShoutCard>
          </div>

          {/* Right Column - Symbol Analysis */}
          <div>
            <AlphaShoutCard>
              <Title level={4} style={{ color: AlphaShoutTheme.colors.primary, marginBottom: '24px' }}>
                <ApiOutlined style={{ marginRight: '8px' }} />
                Real-Time Chart Analysis
              </Title>

              {/* Symbol Analysis Instructions */}
              <div style={{
                background: `linear-gradient(135deg, ${AlphaShoutTheme.colors.primaryLight}10, ${AlphaShoutTheme.colors.accent}10)`,
                padding: '20px',
                borderRadius: AlphaShoutTheme.radius.medium,
                marginBottom: '24px',
                border: `1px solid ${AlphaShoutTheme.colors.accent}30`
              }}>
                <Text style={{ color: AlphaShoutTheme.colors.textSecondary }}>
                  Enter any stock symbol for automated technical analysis and charts
                </Text>
              </div>

              {/* Symbol Search */}
              <div ref={dropdownRef} style={{ position: 'relative', marginBottom: '24px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: 500,
                  color: AlphaShoutTheme.colors.textSecondary,
                  marginBottom: '8px'
                }}>
                  Stock Symbol
                </label>
                <Input
                  ref={searchInputRef}
                  size="large"
                  placeholder="Search for a stock symbol (e.g., AAPL, MSFT)"
                  prefix={<SearchOutlined />}
                  suffix={isSearching ? <Spin size="small" /> : null}
                  value={searchQuery}
                  onChange={(e) => handleSearchChange(e.target.value)}
                  style={{
                    borderRadius: AlphaShoutTheme.radius.medium,
                    fontSize: '14px'
                  }}
                />
                
                {/* Search Dropdown */}
                {showDropdown && (
                  <Card
                    style={{
                      position: 'absolute',
                      top: '80px',
                      left: 0,
                      right: 0,
                      zIndex: 1050,
                      maxHeight: '300px',
                      overflow: 'auto',
                      borderRadius: AlphaShoutTheme.radius.medium,
                      boxShadow: AlphaShoutTheme.shadows.large
                    }}
                    bodyStyle={{ padding: 0 }}
                  >
                    {searchResults.map((result, index) => (
                      <div
                        key={`${result.symbol}-${index}`}
                        style={{
                          padding: '12px 16px',
                          cursor: 'pointer',
                          backgroundColor: index === selectedIndex ? AlphaShoutTheme.colors.surfaceSecondary : 'transparent',
                          borderBottom: `1px solid ${AlphaShoutTheme.colors.borderLight}`,
                          transition: 'all 0.2s'
                        }}
                        onClick={() => selectSymbol(result)}
                        onMouseEnter={() => setSelectedIndex(index)}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                          <StockOutlined style={{ fontSize: '20px', color: AlphaShoutTheme.colors.primary }} />
                          <div style={{ flex: 1 }}>
                            <Text strong style={{ fontSize: '14px' }}>
                              {result.symbol}
                            </Text>
                            <Tag color="blue" style={{ marginLeft: '8px', fontSize: '11px' }}>
                              {result.exchange}
                            </Tag>
                            <div style={{ fontSize: '12px', color: AlphaShoutTheme.colors.textLight, marginTop: '2px' }}>
                              {result.instrument_name}
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </Card>
                )}
              </div>

              {/* Interval Selection */}
              <div style={{ marginBottom: '24px' }}>
                <label style={{
                  display: 'block',
                  fontSize: '14px',
                  fontWeight: 500,
                  color: AlphaShoutTheme.colors.textSecondary,
                  marginBottom: '8px'
                }}>
                  Time Interval
                </label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
                  {['1m', '5m', '15m', '30m', '1h', '4h', '1D', '1W', '1M'].map((option) => (
                    <button
                      key={option}
                      onClick={() => setInterval(option)}
                      style={{
                        padding: '6px 14px',
                        borderRadius: AlphaShoutTheme.radius.medium,
                        fontSize: '13px',
                        fontWeight: 500,
                        border: `1px solid ${interval === option ? AlphaShoutTheme.colors.primary : AlphaShoutTheme.colors.border}`,
                        background: interval === option ? AlphaShoutTheme.colors.primary : AlphaShoutTheme.colors.surface,
                        color: interval === option ? AlphaShoutTheme.colors.textInverse : AlphaShoutTheme.colors.textPrimary,
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>

              {/* Analyze Button */}
              <div style={{ textAlign: 'center', marginBottom: '32px' }}>
                <AlphaShoutButton
                  primary
                  size="large"
                  icon={<LineChartOutlined />}
                  onClick={fetchTechnicalAnalysisOnly}
                  loading={isLoadingTechnical}
                  disabled={!symbol || isLoadingTechnical}
                >
                  {isLoadingTechnical ? 'Analyzing...' : 'Get Technical Analysis (2 tokens)'}
                </AlphaShoutButton>
              </div>

              {/* Auth Messages for Technical Analysis */}
              {techAuthMessage === 'no_symbol' && (
                <div style={{
                  marginTop: '16px',
                  padding: '12px 20px',
                  background: `linear-gradient(135deg, ${AlphaShoutTheme.colors.warning}10, ${AlphaShoutTheme.colors.warning}05)`,
                  border: `1px solid ${AlphaShoutTheme.colors.warning}`,
                  borderRadius: AlphaShoutTheme.radius.medium,
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
                    Please select a stock symbol first
                  </span>
                </div>
              )}
              
              {techAuthMessage === 'login_required' && (
                <div style={{
                  marginTop: '16px',
                  padding: '12px 20px',
                  background: `linear-gradient(135deg, ${AlphaShoutTheme.colors.warning}10, ${AlphaShoutTheme.colors.warning}05)`,
                  border: `1px solid ${AlphaShoutTheme.colors.warning}`,
                  borderRadius: AlphaShoutTheme.radius.medium,
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
                        setTechAuthMessage('');
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
                    {' '}to use technical analysis
                  </span>
                </div>
              )}
              
              {techAuthMessage === 'insufficient_tokens' && (
                <div style={{
                  marginTop: '16px',
                  padding: '12px 20px',
                  background: `linear-gradient(135deg, ${AlphaShoutTheme.colors.error}10, ${AlphaShoutTheme.colors.error}05)`,
                  border: `1px solid ${AlphaShoutTheme.colors.error}`,
                  borderRadius: AlphaShoutTheme.radius.medium,
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
                        setTechAuthMessage('');
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

              {techAuthMessage === 'insufficient_tokens_refresh' && (
                <div style={{
                  marginTop: '16px',
                  padding: '12px 20px',
                  background: `linear-gradient(135deg, ${AlphaShoutTheme.colors.error}10, ${AlphaShoutTheme.colors.error}05)`,
                  border: `1px solid ${AlphaShoutTheme.colors.error}`,
                  borderRadius: AlphaShoutTheme.radius.medium,
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
                    Need 1 token to refresh.{' '}
                    <a 
                      onClick={() => {
                        setTechAuthMessage('');
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
            </AlphaShoutCard>
          </div>
        </div>

        {/* Analysis Results Section - Full Width Below */}
        {(technicalAnalysis || chartUrl) && (
          <div style={{ marginTop: '24px' }}>
            <AlphaShoutCard>
              <Title level={3} style={{ 
                color: AlphaShoutTheme.colors.primary, 
                marginBottom: '24px',
                textAlign: 'center' 
              }}>
                Analysis Results
              </Title>

              {/* Technical Analysis */}
              {technicalAnalysis && (
                <div style={{ marginBottom: '32px' }}>
                  <div style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: '16px'
                  }}>
                    <Title level={4} style={{ margin: 0 }}>
                      <LineChartOutlined style={{ marginRight: 8 }} />
                      Technical Analysis - {symbol}
                    </Title>
                    <TechnicalRefreshButton 
                      onClick={refreshTechnicalAnalysis}
                      loading={isLoadingTechnical}
                    />
                  </div>
                  <div style={{ 
                    padding: '20px',
                    backgroundColor: AlphaShoutTheme.colors.surfaceSecondary,
                    borderRadius: AlphaShoutTheme.radius.medium,
                    border: `1px solid ${AlphaShoutTheme.colors.borderLight}`,
                    whiteSpace: 'pre-wrap',
                    lineHeight: 1.6
                  }}>
                    {parseMarkdownToAlphaShout(technicalAnalysis)}
                  </div>
                </div>
              )}

              {/* Chart Display */}
              {chartUrl && (
                <div>
                  <Title level={4} style={{ marginBottom: '16px' }}>
                    <BarChartOutlined style={{ marginRight: 8 }} />
                    Price Chart
                  </Title>
                  <div style={{ textAlign: 'center' }}>
                    <img 
                      src={chartUrl} 
                      alt="Stock Chart" 
                      style={{ 
                        maxWidth: '100%',
                        height: 'auto',
                        borderRadius: AlphaShoutTheme.radius.medium,
                        boxShadow: AlphaShoutTheme.shadows.medium
                      }}
                    />
                    <div style={{ marginTop: '16px' }}>
                      <Space>
                        <AlphaShoutButton
                          icon={<DownloadOutlined />}
                          onClick={() => {
                            const link = document.createElement('a');
                            link.download = `${symbol}-chart-${interval}.png`;
                            link.href = chartUrl;
                            link.click();
                          }}
                        >
                          Download Chart
                        </AlphaShoutButton>
                      </Space>
                    </div>
                  </div>
                </div>
              )}
            </AlphaShoutCard>
          </div>
        )}

        {/* AI Analysis Results Modal */}
        <CustomModal
          visible={analysisModalVisible}
          onClose={() => {
            setAnalysisModalVisible(false);
            setAiAnalysis(null);
            setAnalysisError(null);
          }}
          title={
            <span>
              <RobotOutlined style={{ marginRight: 8, color: AlphaShoutTheme.colors.secondary }} />
              AI Analysis Results
            </span>
          }
          width="800px"
          footer={[
            <AlphaShoutButton key="copy" icon={<CopyOutlined />} onClick={copyAnalysisToClipboard} disabled={!aiAnalysis}>
              Copy Analysis
            </AlphaShoutButton>,
            <AlphaShoutButton key="close" onClick={() => setAnalysisModalVisible(false)}>
              Close
            </AlphaShoutButton>
          ]}
        >
          {isAnalyzing && (
            <div style={{
              textAlign: 'center',
              padding: '40px 20px',
              background: AlphaShoutTheme.colors.surfaceSecondary,
              borderRadius: AlphaShoutTheme.radius.medium,
              marginBottom: '20px'
            }}>
              <Spin size="large" />
              <div style={{ marginTop: 16, fontSize: '16px', color: AlphaShoutTheme.colors.textSecondary }}>
                Analyzing screenshot with AI...
              </div>
            </div>
          )}

          {aiAnalysis && (
            <div style={{
              background: AlphaShoutTheme.colors.surfaceSecondary,
              borderRadius: AlphaShoutTheme.radius.medium,
              border: `1px solid ${AlphaShoutTheme.colors.border}`,
              marginBottom: '20px'
            }}>
              <div style={{
                padding: '16px',
                borderBottom: `1px solid ${AlphaShoutTheme.colors.borderLight}`,
                fontWeight: 600,
                color: AlphaShoutTheme.colors.textPrimary
              }}>
                Analysis Results
              </div>
              <div style={{ 
                padding: '20px',
                whiteSpace: 'pre-wrap',
                lineHeight: 1.6,
                maxHeight: '500px',
                overflowY: 'auto'
              }}>
                {parseMarkdownToAlphaShout(aiAnalysis)}
              </div>
            </div>
          )}

          {analysisError && (
            <Alert
              type="error"
              message="Analysis Failed"
              description={
                <div>
                  <p>{analysisError.message}</p>
                  <small>Time: {analysisError.timestamp}</small>
                </div>
              }
              showIcon
              closable
              onClose={() => setAnalysisError(null)}
            />
          )}
        </CustomModal>

        {/* Custom Analysis Modal */}
        <CustomModal
          visible={customAnalysisModalVisible}
          onClose={() => {
            setCustomAnalysisModalVisible(false);
            setAiAnalysis(null);
            setAnalysisError(null);
            setCustomPrompt('');
          }}
          title={
            <span>
              <SettingOutlined style={{ marginRight: 8, color: AlphaShoutTheme.colors.secondary }} />
              Custom Analysis Options
            </span>
          }
          width="900px"
          footer={[
            <AlphaShoutButton 
              key="copy" 
              icon={<CopyOutlined />} 
              onClick={copyAnalysisToClipboard} 
              disabled={!aiAnalysis}
              style={{ marginRight: 'auto' }}
            >
              Copy Analysis
            </AlphaShoutButton>,
            <AlphaShoutButton key="cancel" onClick={() => {
              setCustomAnalysisModalVisible(false);
              setAiAnalysis(null);
              setAnalysisError(null);
              setCustomPrompt('');
            }}>
              Close
            </AlphaShoutButton>
          ]}
        >
          <Space direction="vertical" size="large" style={{ width: '100%' }}>
            {/* Custom Prompt Input */}
            <div style={{
              background: AlphaShoutTheme.colors.surface,
              borderRadius: AlphaShoutTheme.radius.medium,
              border: `1px solid ${AlphaShoutTheme.colors.border}`,
              padding: '20px'
            }}>
              <div style={{
                fontSize: '16px',
                fontWeight: 600,
                color: AlphaShoutTheme.colors.textPrimary,
                marginBottom: '16px'
              }}>
                Custom Analysis Prompt
              </div>
              <div>
                <CustomTextArea
                  value={customPrompt}
                  onChange={(e) => setCustomPrompt(e.target.value)}
                  placeholder="Enter a custom prompt for AI analysis (e.g., 'Focus on MACD and RSI indicators', 'Analyze volume profile', 'Identify chart patterns')"
                  rows={3}
                  disabled={isAnalyzing}
                  style={{ marginBottom: '16px' }}
                />
                <AlphaShoutButton
                  primary
                  icon={<RobotOutlined />}
                  loading={isAnalyzing}
                  onClick={() => analyzeScreenshot(customPrompt, true)}
                  disabled={!customPrompt.trim() || isAnalyzing}
                >
                  Analyze with Custom Prompt
                </AlphaShoutButton>
              </div>
            </div>

            {/* Analysis Results in Modal */}
            {aiAnalysis && (
              <div style={{
                background: AlphaShoutTheme.colors.surfaceSecondary,
                borderRadius: AlphaShoutTheme.radius.medium,
                border: `1px solid ${AlphaShoutTheme.colors.border}`,
                marginBottom: '20px'
              }}>
                <div style={{
                  padding: '16px',
                  borderBottom: `1px solid ${AlphaShoutTheme.colors.borderLight}`,
                  fontWeight: 600,
                  color: AlphaShoutTheme.colors.textPrimary
                }}>
                  Analysis Results
                </div>
                <div style={{ 
                  padding: '20px',
                  whiteSpace: 'pre-wrap',
                  lineHeight: 1.6,
                  maxHeight: '400px',
                  overflowY: 'auto'
                }}>
                  {parseMarkdownToAlphaShout(aiAnalysis)}
                </div>
              </div>
            )}

            {/* Analysis Loading */}
            {isAnalyzing && (
              <div style={{
                textAlign: 'center',
                padding: '40px 20px',
                background: AlphaShoutTheme.colors.surfaceSecondary,
                borderRadius: AlphaShoutTheme.radius.medium,
                marginBottom: '20px'
              }}>
                <Spin size="large" />
                <div style={{ marginTop: 16, fontSize: '16px', color: AlphaShoutTheme.colors.textSecondary }}>
                  Analyzing screenshot with AI...
                </div>
              </div>
            )}

            {/* Quick Analysis Templates */}
            <div style={{
              background: AlphaShoutTheme.colors.surface,
              borderRadius: AlphaShoutTheme.radius.medium,
              border: `1px solid ${AlphaShoutTheme.colors.border}`,
              padding: '20px'
            }}>
              <div style={{
                fontSize: '16px',
                fontWeight: 600,
                color: AlphaShoutTheme.colors.textPrimary,
                marginBottom: '16px'
              }}>
                Quick Analysis Templates
              </div>
              <Space wrap>
                <AlphaShoutButton
                  primary
                  loading={isAnalyzing}
                  onClick={() => handleQuickAnalysis('trend_identification')}
                  disabled={!isAuthenticated || isAnalyzing}
                  icon={<LineChartOutlined />}
                  style={{ background: AlphaShoutTheme.colors.primary }}
                >
                  Trend Analysis
                </AlphaShoutButton>
                <AlphaShoutButton
                  primary
                  loading={isAnalyzing}
                  onClick={() => handleQuickAnalysis('momentum_rsi')}
                  disabled={!isAuthenticated || isAnalyzing}
                  icon={<RobotOutlined />}
                  style={{ background: AlphaShoutTheme.colors.primaryLight }}
                >
                  Technical Indicators
                </AlphaShoutButton>
                <AlphaShoutButton
                  primary
                  loading={isAnalyzing}
                  onClick={() => handleQuickAnalysis('volume_analysis')}
                  disabled={!isAuthenticated || isAnalyzing}
                  icon={<FundOutlined />}
                  style={{ background: AlphaShoutTheme.colors.success }}
                >
                  Volume Analysis
                </AlphaShoutButton>
                <AlphaShoutButton
                  primary
                  loading={isAnalyzing}
                  onClick={() => handleQuickAnalysis('support_resistance')}
                  disabled={!isAuthenticated || isAnalyzing}
                  icon={<BarChartOutlined />}
                  style={{ background: AlphaShoutTheme.colors.secondary }}
                >
                  Support & Resistance
                </AlphaShoutButton>
                <AlphaShoutButton
                  primary
                  loading={isAnalyzing}
                  onClick={() => handleQuickAnalysis('volatility_bollinger')}
                  disabled={!isAuthenticated || isAnalyzing}
                  icon={<ThunderboltOutlined />}
                  style={{ background: AlphaShoutTheme.colors.accent }}
                >
                  Volatility Analysis
                </AlphaShoutButton>
              </Space>
            </div>

            {/* Analysis Error */}
            {analysisError && (
              <Alert
                type="error"
                message="Analysis Failed"
                description={
                  <div>
                    <p>{analysisError.message}</p>
                    <small>Time: {analysisError.timestamp}</small>
                  </div>
                }
                showIcon
                closable
                onClose={() => setAnalysisError(null)}
              />
            )}

            {/* Info Alert */}
            <Alert
              message="Analysis Information"
              description={
                <ul style={{ paddingLeft: '20px', margin: '8px 0' }}>
                  <li>Each analysis costs {quotaConfig?.ANALYSE_COST || 2} tokens</li>
                  <li>Custom prompts allow specific analysis focus</li>
                  <li>Quick templates provide common analysis patterns</li>
                  <li>Use keyboard shortcuts: ESC to close, Enter to confirm</li>
                </ul>
              }
              type="info"
              showIcon
            />
          </Space>
        </CustomModal>

        {/* Render Selection Mode Overlay */}
        {renderSelectionMode()}
      </div>

      {/* Hidden canvases for image processing */}
      <canvas 
        ref={canvasRef} 
        style={{ display: 'none' }}
        aria-hidden="true"
      />
      <canvas 
        ref={selectionCanvasRef} 
        style={{ display: 'none' }}
        aria-hidden="true"
      />
    </div>
  );
};

export default EnhancedScreenshotAnalyzer;