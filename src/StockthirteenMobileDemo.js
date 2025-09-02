// StockthirteenMobileDemo.js - Demo version for mobile non-authenticated users
import React, { useState, useEffect } from 'react';
import { 
  Card, Input, Button, Tag, Badge, Space,
  Drawer, List, Segmented, message, Spin, Empty, Modal, Tooltip
} from 'antd';
import { 
  SearchOutlined, ReloadOutlined, ExperimentOutlined,
  LoginOutlined, BarChartOutlined,
  RiseOutlined, FallOutlined, InfoCircleOutlined
} from '@ant-design/icons';
import { useAnalysis } from './AnalysisContext';
import { DEMO_DATA, DEMO_MESSAGES } from './DemoDataFinancial';

// Demo Mode Banner Component
const DemoModeBanner = ({ isVisible }) => {
  if (!isVisible) return null;
  
  return (
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
      {DEMO_MESSAGES.demoNotice.title} - {DEMO_MESSAGES.demoNotice.content}
    </div>
  );
};

// Deep Analysis Wrapper for Mobile
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
        height: '10%', // Show 80% of content
        background: 'linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.8) 30%, rgba(255,255,255,0.95) 100%)',
        backdropFilter: 'blur(3px)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '20px'
      }}>
        <div style={{
          background: 'white',
          padding: '20px',
          borderRadius: '8px',
          boxShadow: '0 4px 20px rgba(0,0,0,0.15)',
          textAlign: 'center',
          border: '2px solid #8B008B',
          maxWidth: '90%'
        }}>
          <ExperimentOutlined style={{ 
            fontSize: '24px', 
            color: '#8B008B',
            marginBottom: '8px'
          }} />
          <h4 style={{ margin: '0 0 8px 0', color: '#333', fontSize: '16px' }}>
            Unlock Complete Analysis
          </h4>
          <p style={{ color: '#666', marginBottom: '12px', fontSize: '12px' }}>
            Register to view full insights
          </p>
          <Button 
            type="primary"
            size="small"
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

export default function StockthirteenMobileDemo() {
  const {
    globalAnalysisData,
    setGlobalAnalysisData,
    globalDeepAnalysisData,
    setGlobalDeepAnalysisData,
    setCurrentSymbol
  } = useAnalysis();
  
  const [query] = useState('AAPL'); // Fixed to AAPL
  const [activeTab, setActiveTab] = useState('income');
  const [showDemoBanner, setShowDemoBanner] = useState(false);
  const [showInitialScreen, setShowInitialScreen] = useState(true);
  
  useEffect(() => {
    setCurrentSymbol('AAPL');
  }, [setCurrentSymbol]);
  
  // Handle search attempt - show login prompt
  const handleSearchClick = () => {
    message.info(
      <span>
        <a onClick={() => window.dispatchEvent(new CustomEvent('navigate-to-login', { detail: { page: 'login' } }))}
           style={{ color: '#003D6D', textDecoration: 'underline' }}>
          Register
        </a> to analyze any US stock and get 20 free tokens!
      </span>
    );
  };
  
  // Handle demo analysis
  const handleDemoAnalysis = () => {
    setShowInitialScreen(false);
    setShowDemoBanner(true);
    setGlobalAnalysisData({
      incomeStatement: DEMO_DATA.AAPL.analysis.incomeStatement,
      balanceSheet: DEMO_DATA.AAPL.analysis.balanceSheet,
      cashFlow: DEMO_DATA.AAPL.analysis.cashFlow
    });
    message.info('Displaying AAPL demo data. Register to analyze any stock!');
  };
  
  // Handle refresh attempt
  const handleRefreshClick = () => {
    message.warning(
      <span>
        Please <a 
          onClick={() => window.dispatchEvent(new CustomEvent('navigate-to-login', { detail: { page: 'login' } }))}
          style={{ color: '#003D6D', textDecoration: 'underline' }}
        >
          register
        </a> to refresh analysis
      </span>
    );
  };
  
  // Handle deep analysis demo
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
        width: '90%',
        centered: true,
        content: (
          <div style={{ fontSize: '14px' }}>
            <p style={{ marginBottom: '12px' }}>
              You're viewing a sample of our AI-powered deep analysis.
            </p>
            
            <div style={{ background: '#f0f0f0', padding: '10px', borderRadius: '6px', marginBottom: '12px' }}>
              <strong>With a free account:</strong>
              <ul style={{ marginTop: '8px', marginBottom: 0, paddingLeft: '20px' }}>
                <li>Real-time deep analysis</li>
                <li>Complete AI insights</li>
                <li>20 free tokens to start</li>
              </ul>
            </div>
          </div>
        ),
        okText: 'Register Now',
        onOk: () => {
          window.dispatchEvent(new CustomEvent('navigate-to-login', { detail: { page: 'login' } }));
        }
      });
    }, 100);
  };
  
  // Rendering functions
  const renderMobileFinancialData = (dataString, type, isDeepAnalysis = false) => {
    if (!dataString || dataString === 'No data available') {
      return <Empty description="No data available" />;
    }
    
    if (isDeepAnalysis) {
      return (
        <DeepAnalysisWrapper isDemo={true}>
          <div>
            <Tag color="purple" style={{ marginBottom: '12px' }}>
              <ExperimentOutlined /> Deep Analysis Results
            </Tag>
            {renderDataContent(dataString)}
          </div>
        </DeepAnalysisWrapper>
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
      
      if (line.includes(':') && !line.startsWith('>') && !line.startsWith('*')) {
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
      paddingBottom: '20px',
      paddingTop: showDemoBanner ? '40px' : '0'
    }}>
      <DemoModeBanner isVisible={showDemoBanner} />
      
      <div style={{ 
        background: '#003D6D',
        color: 'white',
        padding: '8px 12px',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      
        top: showDemoBanner ? '40px' : '0',
        left: 0,
        right: 0,
        zIndex: 1000
      }}>
        <span style={{ fontSize: '14px', fontWeight: 'bold' }}>
          Financial Statement AI Deep Analysis
        </span>
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
          <LoginOutlined /> Register
        </Button>
      </div>
      
      
        <div style={{ 
          background: 'white',
          padding: '12px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
        }}>
          <Tooltip
            title="Register to unlock analysis for more stocks & Get 20 free tokens!"
            placement="bottom"
          >
            <Input
              size="large"
              placeholder="AAPL (Demo Mode)"
              prefix={<SearchOutlined />}
              value={query}
              onClick={handleSearchClick}
              readOnly
              style={{ 
                marginBottom: '12px',
                backgroundColor: '#f5f5f5'
              }}
            />
          </Tooltip>
          
          <Button 
            type="primary"
            size="large"
            block
            onClick={handleDemoAnalysis}
            icon={<BarChartOutlined />}
            style={{
              animation: showInitialScreen ? 'pulse 2s infinite' : 'none'
            }}
          >
            Try Demo Analysis (Free)
          </Button>
          
          {showInitialScreen && (
            <div style={{ 
              textAlign: 'center', 
              marginTop: '8px', 
              fontSize: '12px', 
              color: '#666' 
            }}>
              See AAPL analysis example
            </div>
          )}
        
        
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
                onClick={handleRefreshClick}
                icon={<ReloadOutlined />}
              >
                Refresh
              </Button>
              <Button
                size="small"
                type="primary"
                style={{ background: '#8B008B' }}
                onClick={() => handleDemoDeepAnalysis(activeTab)}
                icon={<ExperimentOutlined />}
              >
                Deep Analysis
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
      </div>
      
      <style>
        {`
          @keyframes pulse {
            0% { opacity: 1; transform: scale(1); }
            50% { opacity: 0.8; transform: scale(1.02); }
            100% { opacity: 1; transform: scale(1); }
          }
        `}
      </style>
    </div>
  );
}