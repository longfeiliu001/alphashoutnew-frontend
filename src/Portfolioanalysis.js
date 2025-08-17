import React, { useState, useEffect, useRef } from 'react';
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
  Spin
} from 'antd';
import { 
  SearchOutlined, 
  CopyOutlined, 
  DownloadOutlined, 
  CloseOutlined,
  SendOutlined
} from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

export default function StockPortfolioForm() {
  // State declarations
  const [symbols, setSymbols] = useState([]);
  const [config, setConfig] = useState({
    target_return: '0.06',
    risk_free_rate: '0.045',
    lookback_days: '252',
    data_frequency: 'daily',
    optimization_type: 'strategic',
    rebalance_threshold: '0.03'
  });

  // Search related states
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [manualInput, setManualInput] = useState('');
  const [apiKey] = useState('YOUR_API_KEY_HERE');
  const [isSending, setIsSending] = useState(false);
  const [webhookResponse, setWebhookResponse] = useState(null);
  
  const searchRef = useRef(null);
  const dropdownRef = useRef(null);

  // Helper function to parse JSON strings safely
  const safeParseJSON = (jsonString) => {
    try {
      if (typeof jsonString === 'string') {
        return JSON.parse(jsonString);
      }
      return jsonString; // Already an object
    } catch (error) {
      console.warn('JSON parse error:', error, 'Input:', jsonString);
      return null; // Return null instead of original string on error
    }
  };

  // Format portfolio analysis data
  const formatPortfolioAnalysis = (data) => {
    if (!data || typeof data !== 'object') return null;

    console.log('Raw data:', data); // Debug log
    
    const optimization = safeParseJSON(data.optimization || '{}') || {};
    // Handle both old and new field names
    const corranalysis = safeParseJSON(data.corranalysis || data.correlation_analysis || '{}') || {};
    const riskanalysis = safeParseJSON(data.riskanalysis || data.risk_analysis || '{}') || {};
    const assetallo = safeParseJSON(data.assetallo || data.asset_allocation || '[]') || [];
    const individualstatus = safeParseJSON(data.individualstatus || data.individual_status || '{}') || {};

    console.log('Parsed corranalysis:', corranalysis); // Debug log
    console.log('Parsed riskanalysis:', riskanalysis); // Debug log

    return {
      source: data.source || 'Unknown',
      optimization,
      corranalysis,
      riskanalysis,
      assetallo: Array.isArray(assetallo) ? assetallo : [],
      individualstatus,
      ai_opinion: data.ai_opinion || ''
    };
  };

  // Alpha Vantage API search function
  const searchSymbols = async (query) => {
    if (query.length < 2) {
      setSearchResults([]);
      setShowDropdown(false);
      return;
    }

    setIsSearching(true);
    try {
      const response = await fetch(
        `https://www.alphavantage.co/query?function=SYMBOL_SEARCH&keywords=${encodeURIComponent(query)}&apikey=${apiKey}`
      );
      const data = await response.json();
      
      if (data.bestMatches && Array.isArray(data.bestMatches)) {
        setSearchResults(data.bestMatches.slice(0, 10));
        setShowDropdown(true);
      } else if (data.Note) {
        setSearchResults([]);
        setShowDropdown(false);
        message.warning('API rate limit reached');
      } else {
        setSearchResults([]);
        setShowDropdown(false);
      }
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
      setShowDropdown(false);
      message.error('Search failed');
    } finally {
      setIsSearching(false);
    }
  };

  // Debounced search
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchQuery.trim()) {
        searchSymbols(searchQuery.trim());
      } else {
        setSearchResults([]);
        setShowDropdown(false);
      }
    }, 500);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const addSymbolFromSearch = (symbol) => {
    if (symbol && !symbols.includes(symbol)) {
      setSymbols(prev => [...prev, symbol]);
      message.success(`Added ${symbol} to portfolio`);
    } else if (symbols.includes(symbol)) {
      message.info(`${symbol} already exists in portfolio`);
    }
    setSearchQuery('');
    setShowDropdown(false);
    setSearchResults([]);
  };

  const removeSymbol = (symbolToRemove) => {
    const newSymbols = symbols.filter(symbol => symbol !== symbolToRemove);
    setSymbols(newSymbols);
    message.success(`Removed ${symbolToRemove} from portfolio`);
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
      risk_free_rate: config.risk_free_rate,
      lookback_days: config.lookback_days,
      data_frequency: config.data_frequency,
      optimization_type: config.optimization_type,
      rebalance_threshold: config.rebalance_threshold
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
    const jsonData = generateJSON();
    
    setIsSending(true);
    setWebhookResponse(null);
    
    try {
      const response = await fetch('https://n8n.alphashout.com/webhook/19e7aa5e-8ccb-4b1f-9d17-c1e871571a7a', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(jsonData)
      });

      const responseText = await response.text();
      let responseData;
      
      try {
        responseData = JSON.parse(responseText);
      } catch {
        responseData = responseText;
      }

      setWebhookResponse({
        status: response.status,
        statusText: response.statusText,
        headers: Object.fromEntries(response.headers.entries()),
        data: responseData,
        timestamp: new Date().toISOString()
      });

      if (response.ok) {
        message.success('Configuration sent successfully!');
      } else {
        message.warning(`Request completed with status ${response.status}`);
      }
    } catch (error) {
      console.error('Send error:', error);
      setWebhookResponse({
        error: true,
        message: error.message,
        timestamp: new Date().toISOString()
      });
      message.error(`Failed to send configuration: ${error.message}`);
    } finally {
      setIsSending(false);
    }
  };

  const handleManualAdd = () => {
    const value = manualInput.trim().toUpperCase();
    if (value && !symbols.includes(value)) {
      setSymbols(prev => [...prev, value]);
      setManualInput('');
      message.success(`Added ${value} to portfolio`);
    } else if (symbols.includes(value)) {
      message.info(`${value} already exists in portfolio`);
      setManualInput('');
    } else {
      message.warning('Please enter a valid stock symbol');
    }
  };

  const handleInputKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleManualAdd();
    }
  };

  return (
    <div style={{ maxWidth: '1200px', margin: '0 auto', padding: '24px' }}>
      <div style={{ marginBottom: '32px', textAlign: 'center' }}>
        <Title level={1}>Stock Portfolio Configuration Generator</Title>
        <Paragraph style={{ fontSize: '16px', color: '#666' }}>
          Configure portfolio parameters and generate JSON configuration file
        </Paragraph>
      </div>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(500px, 1fr))', 
        gap: '32px' 
      }}>
        {/* Left Configuration Area */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          {/* Stock Search & Add Section */}
          <Card title="Add Stock Symbols" style={{ background: '#fafafa' }}>
            {/* Search Box */}
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
                style={{ width: '100%' }}
              />
              
              {/* Search Results Dropdown */}
              {showDropdown && searchResults.length > 0 && (
                <div style={{ 
                  position: 'absolute', 
                  zIndex: 1000, 
                  width: '100%', 
                  marginTop: '4px',
                  background: 'white',
                  border: '1px solid #d9d9d9',
                  borderRadius: '6px',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
                  maxHeight: '240px',
                  overflowY: 'auto'
                }}>
                  {searchResults.map((result, index) => (
                    <div
                      key={`search-${index}`}
                      onClick={() => addSymbolFromSearch(result['1. symbol'])}
                      style={{
                        padding: '12px 16px',
                        cursor: 'pointer',
                        borderBottom: index < searchResults.length - 1 ? '1px solid #f0f0f0' : 'none'
                      }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#f5f5f5'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = 'white'}
                    >
                      <div style={{ fontWeight: 'bold', fontSize: '14px' }}>
                        {result['1. symbol']}
                      </div>
                      <div style={{ fontSize: '12px', color: '#666', marginTop: '2px' }}>
                        {result['2. name']}
                      </div>
                      <div style={{ fontSize: '11px', color: '#999', marginTop: '2px' }}>
                        {result['4. region']} • {result['3. type']}
                      </div>
                    </div>
                  ))}
                </div>
              )}
              
              {showDropdown && searchQuery && !isSearching && searchResults.length === 0 && (
                <div style={{ 
                  position: 'absolute', 
                  zIndex: 1000, 
                  width: '100%', 
                  marginTop: '4px',
                  background: 'white',
                  border: '1px solid #d9d9d9',
                  borderRadius: '6px',
                  padding: '16px',
                  textAlign: 'center',
                  color: '#999',
                  boxShadow: '0 2px 8px rgba(0,0,0,0.15)'
                }}>
                  No matching stock symbols found
                </div>
              )}
            </div>

            {/* Selected Stocks */}
            <div style={{ marginBottom: '16px' }}>
              <Title level={4} style={{ marginBottom: '12px' }}>
                Selected Stocks ({symbols.length})
              </Title>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', minHeight: '32px' }}>
                {symbols.length > 0 ? (
                  symbols.map((symbol, index) => (
                    <Tag
                      key={`symbol-${index}-${symbol}`}
                      closable
                      onClose={() => removeSymbol(symbol)}
                      style={{ 
                        padding: '4px 12px',
                        fontSize: '14px',
                        fontFamily: 'monospace',
                        fontWeight: 'bold'
                      }}
                    >
                      {symbol}
                    </Tag>
                  ))
                ) : (
                  <div style={{ 
                    color: '#999', 
                    fontStyle: 'italic',
                    padding: '8px 0'
                  }}>
                    No stocks selected. Search or manually add stocks to get started.
                  </div>
                )}
              </div>
            </div>

            {/* Manual Add Stock Input */}
            <Card 
              size="small" 
              style={{ 
                border: '2px dashed #d9d9d9',
                background: 'white'
              }}
            >
              <Text style={{ fontSize: '14px', color: '#666', display: 'block', marginBottom: '8px' }}>
                Or manually enter stock symbol:
              </Text>
              <Space.Compact style={{ width: '100%' }}>
                <Input
                  placeholder="Enter stock symbol (e.g., AAPL)"
                  value={manualInput}
                  onChange={(e) => setManualInput(e.target.value)}
                  onPressEnter={handleInputKeyPress}
                  style={{ flex: 1 }}
                />
                <Button type="default" onClick={handleManualAdd}>
                  Add
                </Button>
              </Space.Compact>
            </Card>
          </Card>

          {/* Configuration Parameters */}
          <Card title="Configuration Parameters" style={{ background: '#fafafa' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <Text strong style={{ display: 'block', marginBottom: '4px' }}>
                  Target Return
                </Text>
                <InputNumber
                  step={0.001}
                  value={parseFloat(config.target_return) || 0}
                  onChange={(value) => updateConfig('target_return', (value || 0).toString())}
                  style={{ width: '100%' }}
                  precision={3}
                  min={0}
                  max={1}
                />
              </div>

              <div>
                <Text strong style={{ display: 'block', marginBottom: '4px' }}>
                  Risk Free Rate
                </Text>
                <InputNumber
                  step={0.001}
                  value={parseFloat(config.risk_free_rate) || 0}
                  onChange={(value) => updateConfig('risk_free_rate', (value || 0).toString())}
                  style={{ width: '100%' }}
                  precision={3}
                  min={0}
                  max={1}
                />
              </div>

              <div>
                <Text strong style={{ display: 'block', marginBottom: '4px' }}>
                  Lookback Days
                </Text>
                <InputNumber
                  value={parseInt(config.lookback_days) || 0}
                  onChange={(value) => updateConfig('lookback_days', (value || 0).toString())}
                  style={{ width: '100%' }}
                  min={1}
                  max={10000}
                />
              </div>

              <div>
                <Text strong style={{ display: 'block', marginBottom: '4px' }}>
                  Data Frequency
                </Text>
                <Select
                  value={config.data_frequency}
                  onChange={(value) => updateConfig('data_frequency', value)}
                  style={{ width: '100%' }}
                >
                  <Option value="daily">Daily</Option>
                  <Option value="weekly">Weekly</Option>
                  <Option value="monthly">Monthly</Option>
                </Select>
              </div>

              <div>
                <Text strong style={{ display: 'block', marginBottom: '4px' }}>
                  Optimization Type
                </Text>
                <Select
                  value={config.optimization_type}
                  onChange={(value) => updateConfig('optimization_type', value)}
                  style={{ width: '100%' }}
                >
                  <Option value="strategic">Strategic</Option>
                  <Option value="tactical">Tactical</Option>
                  <Option value="adaptive">Adaptive</Option>
                  <Option value="mean_variance">Mean Variance</Option>
                  <Option value="risk_parity">Risk Parity</Option>
                  <Option value="black_litterman">Black-Litterman</Option>
                  <Option value="minimum_variance">Minimum Variance</Option>
                  <Option value="maximum_sharpe">Maximum Sharpe</Option>
                </Select>
              </div>

              <div>
                <Text strong style={{ display: 'block', marginBottom: '4px' }}>
                  Rebalance Threshold
                </Text>
                <InputNumber
                  step={0.001}
                  value={parseFloat(config.rebalance_threshold) || 0}
                  onChange={(value) => updateConfig('rebalance_threshold', (value || 0).toString())}
                  style={{ width: '100%' }}
                  precision={3}
                  min={0}
                  max={1}
                />
              </div>
            </div>
          </Card>
        </div>

        {/* Right Preview Area */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
          <Card 
            title="JSON Preview"
            extra={
              <Space wrap>
                <Button 
                  type="primary" 
                  icon={<SendOutlined />} 
                  onClick={sendToWebhook}
                  loading={isSending}
                  style={{ background: '#fa8c16', borderColor: '#fa8c16' }}
                >
                  Send to Webhook
                </Button>
                <Button 
                  type="primary" 
                  icon={<CopyOutlined />} 
                  onClick={copyToClipboard}
                  style={{ background: '#52c41a', borderColor: '#52c41a' }}
                >
                  Copy
                </Button>
                <Button 
                  type="primary" 
                  icon={<DownloadOutlined />} 
                  onClick={downloadJSON}
                  style={{ background: '#722ed1', borderColor: '#722ed1' }}
                >
                  Download
                </Button>
              </Space>
            }
            style={{ background: '#fafafa' }}
          >
            <pre style={{ 
              background: '#1f1f1f',
              color: '#4ade80',
              padding: '16px',
              borderRadius: '6px',
              fontSize: '12px',
              fontFamily: 'monospace',
              overflow: 'auto',
              margin: 0,
              minHeight: '200px'
            }}>
              {JSON.stringify(generateJSON(), null, 2)}
            </pre>
          </Card>

          {/* Usage Instructions */}
          <Card 
            title="Usage Instructions" 
            style={{ background: '#e6f7ff', borderColor: '#1890ff' }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              <div>
                <Text strong style={{ color: '#1890ff' }}>🔍 Stock Search</Text>
                <Paragraph style={{ margin: '4px 0 0 0', fontSize: '14px' }}>
                  Enter stock symbols or company names in the search box to get matching results from Alpha Vantage API
                </Paragraph>
              </div>
              <div>
                <Text strong style={{ color: '#1890ff' }}>➕ Add Stocks</Text>
                <Paragraph style={{ margin: '4px 0 0 0', fontSize: '14px' }}>
                  Click on any search result to add it to your portfolio
                </Paragraph>
              </div>
              <div>
                <Text strong style={{ color: '#1890ff' }}>🗑️ Remove Stocks</Text>
                <Paragraph style={{ margin: '4px 0 0 0', fontSize: '14px' }}>
                  Click the X button on selected stock tags to remove them
                </Paragraph>
              </div>
              <div>
                <Text strong style={{ color: '#1890ff' }}>📤 Send to Webhook</Text>
                <Paragraph style={{ margin: '4px 0 0 0', fontSize: '14px' }}>
                  Click "Send to Webhook" to automatically submit your configuration to the processing endpoint
                </Paragraph>
              </div>
            </div>
          </Card>

          {/* Parameter Description */}
          <Card 
            title="Parameter Description" 
            style={{ background: '#f6ffed', borderColor: '#52c41a' }}
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '14px' }}>
              <div><Text strong>symbols:</Text> Stock symbols separated by commas</div>
              <div><Text strong>target_return:</Text> Expected annual return (decimal format)</div>
              <div><Text strong>risk_free_rate:</Text> Risk-free rate (e.g., treasury bond yield)</div>
              <div><Text strong>lookback_days:</Text> Number of historical data days to analyze</div>
              <div><Text strong>data_frequency:</Text> Data update frequency</div>
              <div><Text strong>optimization_type:</Text> Portfolio optimization strategy</div>
              <div><Text strong>rebalance_threshold:</Text> Deviation threshold to trigger rebalancing</div>
            </div>
          </Card>
        </div>
      </div>

      {/* Webhook Response Display */}
      {webhookResponse && (
        <div style={{ marginTop: '32px' }}>
          <Card 
            title="Portfolio Analysis Results" 
            style={{ 
              background: webhookResponse.error ? '#fff1f0' : '#f6ffed',
              borderColor: webhookResponse.error ? '#ff4d4f' : '#52c41a'
            }}
            extra={
              <Button 
                size="small" 
                onClick={() => setWebhookResponse(null)}
                icon={<CloseOutlined />}
              >
                Clear
              </Button>
            }
          >
            {webhookResponse.error ? (
              <div style={{ color: '#ff4d4f' }}>
                <Text strong>Error:</Text>
                <div style={{ marginTop: '8px', fontSize: '14px' }}>
                  {webhookResponse.message}
                </div>
                <div style={{ marginTop: '8px', fontSize: '12px', color: '#999' }}>
                  Time: {new Date(webhookResponse.timestamp).toLocaleString()}
                </div>
              </div>
            ) : (
              <div>
                <div style={{ marginBottom: '16px' }}>
                  <Space>
                    <Text strong>Status:</Text>
                    <Tag color={webhookResponse.status < 400 ? 'green' : 'red'}>
                      {webhookResponse.status} {webhookResponse.statusText}
                    </Tag>
                    <Text style={{ fontSize: '12px', color: '#999' }}>
                      {new Date(webhookResponse.timestamp).toLocaleString()}
                    </Text>
                  </Space>
                </div>
                
                {(() => {
                  const analysisData = formatPortfolioAnalysis(webhookResponse.data);
                  
                  if (analysisData) {
                    return (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                        {/* Data Source & Field Mapping Info */}
                        <Card 
                          title="📋 Data Source Information" 
                          size="small"
                          style={{ background: '#f0f2ff', borderColor: '#adc6ff' }}
                        >
                          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px' }}>
                            <div>
                              <Text strong>Data Source</Text>
                              <div style={{ fontSize: '16px', fontWeight: 'bold', color: '#1890ff' }}>
                                {analysisData.source || 'Unknown'}
                              </div>
                            </div>
                            <div>
                              <Text strong>Analysis Timestamp</Text>
                              <div style={{ fontSize: '14px', color: '#666' }}>
                                {new Date().toLocaleString()}
                              </div>
                            </div>
                            <div>
                              <Text strong>Response Status</Text>
                              <div style={{ fontSize: '14px', color: '#52c41a', fontWeight: 'bold' }}>
                                ✅ Successfully Parsed
                              </div>
                            </div>
                          </div>
                        </Card>

                        {/* Portfolio Summary */}
                        {analysisData.optimization && Object.keys(analysisData.optimization).length > 0 && (
                          <Card 
                            title="📊 Portfolio Summary" 
                            size="small"
                            style={{ background: '#e6fffb', borderColor: '#87e8de' }}
                          >
                            <div>
                              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                                <div>
                                  <Text strong style={{ color: '#006d75' }}>Portfolio Return</Text>
                                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#13c2c2' }}>
                                    {analysisData.optimization.portfolio_return || 'N/A'}
                                  </div>
                                </div>
                                <div>
                                  <Text strong style={{ color: '#006d75' }}>Volatility</Text>
                                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#fa8c16' }}>
                                    {analysisData.optimization.portfolio_volatility || 'N/A'}
                                  </div>
                                </div>
                                <div>
                                  <Text strong style={{ color: '#006d75' }}>Sharpe Ratio</Text>
                                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#52c41a' }}>
                                    {analysisData.optimization.portfolio_sharpe || 'N/A'}
                                  </div>
                                </div>
                                <div>
                                  <Text strong style={{ color: '#006d75' }}>Diversification</Text>
                                  <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#722ed1' }}>
                                    {analysisData.optimization.diversification_ratio || 'N/A'}
                                  </div>
                                </div>
                              </div>
                              <div style={{ fontSize: '12px', color: '#666', borderTop: '1px solid #e8e8e8', paddingTop: '12px' }}>
                                <div><strong>Optimization Date:</strong> {analysisData.optimization.optimization_date ? new Date(analysisData.optimization.optimization_date).toLocaleString() : 'N/A'}</div>
                                <div><strong>Target Return:</strong> {analysisData.optimization.target_return || 'N/A'}</div>
                                <div><strong>Risk Free Rate:</strong> {analysisData.optimization.risk_free_rate || 'N/A'}</div>
                                <div><strong>Assets Processed:</strong> {analysisData.optimization.assets_processed || 'N/A'}</div>
                              </div>
                            </div>
                          </Card>
                        )}

                        {/* Asset Allocation */}
                        {analysisData.assetallo && Array.isArray(analysisData.assetallo) && analysisData.assetallo.length > 0 && (
                          <Card 
                            title="💼 Asset Allocation" 
                            size="small"
                            style={{ background: '#f6ffed', borderColor: '#b7eb8f' }}
                          >
                            <div style={{ overflowX: 'auto' }}>
                              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                  <tr style={{ background: '#f0f0f0' }}>
                                    <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #d9d9d9' }}>Symbol</th>
                                    <th style={{ padding: '8px', textAlign: 'right', border: '1px solid #d9d9d9' }}>Weight</th>
                                    <th style={{ padding: '8px', textAlign: 'right', border: '1px solid #d9d9d9' }}>Expected Return</th>
                                    <th style={{ padding: '8px', textAlign: 'right', border: '1px solid #d9d9d9' }}>Volatility</th>
                                    <th style={{ padding: '8px', textAlign: 'right', border: '1px solid #d9d9d9' }}>Sharpe Ratio</th>
                                    <th style={{ padding: '8px', textAlign: 'right', border: '1px solid #d9d9d9' }}>Risk Contribution</th>
                                    <th style={{ padding: '8px', textAlign: 'right', border: '1px solid #d9d9d9' }}>Data Points</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {analysisData.assetallo.map((asset, index) => (
                                    <tr key={`asset-${index}-${asset.symbol || index}`}>
                                      <td style={{ padding: '8px', fontFamily: 'monospace', fontWeight: 'bold', border: '1px solid #d9d9d9' }}>
                                        {asset.symbol || 'N/A'}
                                      </td>
                                      <td style={{ padding: '8px', textAlign: 'right', border: '1px solid #d9d9d9' }}>
                                        {asset.weight || 'N/A'}
                                      </td>
                                      <td style={{ 
                                        padding: '8px', 
                                        textAlign: 'right', 
                                        border: '1px solid #d9d9d9',
                                        color: asset.expected_return && parseFloat(asset.expected_return.replace('%', '')) >= 0 ? '#52c41a' : '#ff4d4f'
                                      }}>
                                        {asset.expected_return || 'N/A'}
                                      </td>
                                      <td style={{ padding: '8px', textAlign: 'right', border: '1px solid #d9d9d9' }}>
                                        {asset.volatility || 'N/A'}
                                      </td>
                                      <td style={{ 
                                        padding: '8px', 
                                        textAlign: 'right', 
                                        border: '1px solid #d9d9d9',
                                        color: asset.sharpe_ratio && parseFloat(asset.sharpe_ratio) >= 0 ? '#52c41a' : '#ff4d4f'
                                      }}>
                                        {asset.sharpe_ratio || 'N/A'}
                                      </td>
                                      <td style={{ padding: '8px', textAlign: 'right', border: '1px solid #d9d9d9' }}>
                                        {asset.risk_contribution || 'N/A'}
                                      </td>
                                      <td style={{ padding: '8px', textAlign: 'right', border: '1px solid #d9d9d9' }}>
                                        {asset.data_points || 'N/A'}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </Card>
                        )}

                        {/* Correlation Analysis */}
                        {analysisData.corranalysis && Object.keys(analysisData.corranalysis).length > 0 && (
                          <Card 
                            title="🔗 Correlation Analysis" 
                            size="small"
                            style={{ background: '#fff7e6', borderColor: '#ffd591' }}
                          >
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                              <div>
                                <Text strong>Average Correlation</Text>
                                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#fa8c16' }}>
                                  {analysisData.corranalysis.average_correlation !== undefined ? analysisData.corranalysis.average_correlation : 'N/A'}
                                </div>
                              </div>
                              <div>
                                <Text strong>Max Correlation</Text>
                                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#ff4d4f' }}>
                                  {analysisData.corranalysis.max_correlation !== undefined ? analysisData.corranalysis.max_correlation : 'N/A'}
                                </div>
                              </div>
                              <div>
                                <Text strong>Min Correlation</Text>
                                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#52c41a' }}>
                                  {analysisData.corranalysis.min_correlation !== undefined ? analysisData.corranalysis.min_correlation : 'N/A'}
                                </div>
                              </div>
                            </div>
                            
                            {analysisData.corranalysis.high_correlation_pairs && Array.isArray(analysisData.corranalysis.high_correlation_pairs) && analysisData.corranalysis.high_correlation_pairs.length > 0 && (
                              <div style={{ marginBottom: '16px' }}>
                                <Text strong style={{ display: 'block', marginBottom: '8px' }}>High Correlation Pairs:</Text>
                                {analysisData.corranalysis.high_correlation_pairs.map((pair, index) => (
                                  <Tag key={index} color="orange" style={{ margin: '2px' }}>
                                    {Array.isArray(pair.assets) ? pair.assets.join(' ↔ ') : 'Invalid pair'}: {pair.correlation || 'N/A'}
                                  </Tag>
                                ))}
                              </div>
                            )}
                            
                            {analysisData.corranalysis.correlation_matrix && typeof analysisData.corranalysis.correlation_matrix === 'object' && Object.keys(analysisData.corranalysis.correlation_matrix).length > 0 && (
                              <div>
                                <Text strong style={{ display: 'block', marginBottom: '8px' }}>Correlation Matrix:</Text>
                                <div style={{ overflowX: 'auto' }}>
                                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '12px' }}>
                                    <thead>
                                      <tr style={{ background: '#f0f0f0' }}>
                                        <th style={{ padding: '6px', textAlign: 'left', border: '1px solid #d9d9d9' }}>Asset</th>
                                        {Object.keys(analysisData.corranalysis.correlation_matrix).map(symbol => (
                                          <th key={symbol} style={{ padding: '6px', textAlign: 'center', border: '1px solid #d9d9d9', fontFamily: 'monospace' }}>
                                            {symbol}
                                          </th>
                                        ))}
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {Object.entries(analysisData.corranalysis.correlation_matrix).map(([rowSymbol, correlations]) => (
                                        <tr key={rowSymbol}>
                                          <td style={{ padding: '6px', fontFamily: 'monospace', fontWeight: 'bold', border: '1px solid #d9d9d9' }}>
                                            {rowSymbol}
                                          </td>
                                          {Object.entries(correlations || {}).map(([colSymbol, correlation]) => (
                                            <td key={colSymbol} style={{ 
                                              padding: '6px', 
                                              textAlign: 'center', 
                                              border: '1px solid #d9d9d9',
                                              backgroundColor: correlation === 1 ? '#e6f7ff' : 
                                                Math.abs(correlation) > 0.7 ? '#fff2e8' : 
                                                Math.abs(correlation) > 0.3 ? '#f6ffed' : '#fafafa',
                                              fontWeight: correlation === 1 ? 'bold' : 'normal'
                                            }}>
                                              {typeof correlation === 'number' ? correlation.toFixed(3) : (correlation || 'N/A')}
                                            </td>
                                          ))}
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            )}
                          </Card>
                        )}

                        {/* Risk Analysis */}
                        {analysisData.riskanalysis && Object.keys(analysisData.riskanalysis).length > 0 && (
                          <Card 
                            title="⚠️ Risk Analysis" 
                            size="small"
                            style={{ background: '#fff1f0', borderColor: '#ffadd2' }}
                          >
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '16px', marginBottom: '16px' }}>
                              <div>
                                <Text strong>Portfolio Variance</Text>
                                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#ff4d4f' }}>
                                  {analysisData.riskanalysis.portfolio_variance !== undefined ? analysisData.riskanalysis.portfolio_variance : 'N/A'}
                                </div>
                              </div>
                              <div>
                                <Text strong>Weighted Avg Volatility</Text>
                                <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#fa8c16' }}>
                                  {analysisData.riskanalysis.weighted_avg_volatility !== undefined ? analysisData.riskanalysis.weighted_avg_volatility : 'N/A'}
                                </div>
                              </div>
                            </div>
                            
                            {analysisData.riskanalysis.risk_contributions && typeof analysisData.riskanalysis.risk_contributions === 'object' && Object.keys(analysisData.riskanalysis.risk_contributions).length > 0 && (
                              <div>
                                <Text strong style={{ display: 'block', marginBottom: '12px' }}>Risk Contributions:</Text>
                                <div style={{ overflowX: 'auto' }}>
                                  <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                    <thead>
                                      <tr style={{ background: '#f0f0f0' }}>
                                        <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #d9d9d9' }}>Symbol</th>
                                        <th style={{ padding: '8px', textAlign: 'right', border: '1px solid #d9d9d9' }}>Marginal Contribution</th>
                                        <th style={{ padding: '8px', textAlign: 'right', border: '1px solid #d9d9d9' }}>Risk Contribution</th>
                                        <th style={{ padding: '8px', textAlign: 'right', border: '1px solid #d9d9d9' }}>Percentage</th>
                                      </tr>
                                    </thead>
                                    <tbody>
                                      {Object.entries(analysisData.riskanalysis.risk_contributions).map(([symbol, risk]) => (
                                        <tr key={symbol}>
                                          <td style={{ padding: '8px', fontFamily: 'monospace', fontWeight: 'bold', border: '1px solid #d9d9d9' }}>
                                            {symbol}
                                          </td>
                                          <td style={{ padding: '8px', textAlign: 'right', border: '1px solid #d9d9d9', fontSize: '12px' }}>
                                            {typeof risk.marginal_contribution === 'number' 
                                              ? risk.marginal_contribution.toFixed(6) 
                                              : (risk.marginal_contribution || 'N/A')}
                                          </td>
                                          <td style={{ padding: '8px', textAlign: 'right', border: '1px solid #d9d9d9', fontSize: '12px' }}>
                                            {typeof risk.risk_contribution === 'number' 
                                              ? risk.risk_contribution.toFixed(6) 
                                              : (risk.risk_contribution || 'N/A')}
                                          </td>
                                          <td style={{ 
                                            padding: '8px', 
                                            textAlign: 'right', 
                                            border: '1px solid #d9d9d9',
                                            color: '#ff4d4f', 
                                            fontWeight: 'bold'
                                          }}>
                                            {risk.risk_contribution_percent || 'N/A'}
                                          </td>
                                        </tr>
                                      ))}
                                    </tbody>
                                  </table>
                                </div>
                              </div>
                            )}
                          </Card>
                        )}

                        {/* Individual Asset Status */}
                        {analysisData.individualstatus && typeof analysisData.individualstatus === 'object' && Object.keys(analysisData.individualstatus).length > 0 && (
                          <Card 
                            title="📈 Individual Asset Performance" 
                            size="small"
                            style={{ background: '#fff0f6', borderColor: '#ffadd2' }}
                          >
                            <div style={{ overflowX: 'auto' }}>
                              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                                <thead>
                                  <tr style={{ background: '#f0f0f0' }}>
                                    <th style={{ padding: '8px', textAlign: 'left', border: '1px solid #d9d9d9' }}>Symbol</th>
                                    <th style={{ padding: '8px', textAlign: 'right', border: '1px solid #d9d9d9' }}>Expected Return</th>
                                    <th style={{ padding: '8px', textAlign: 'right', border: '1px solid #d9d9d9' }}>Volatility</th>
                                    <th style={{ padding: '8px', textAlign: 'right', border: '1px solid #d9d9d9' }}>Variance</th>
                                    <th style={{ padding: '8px', textAlign: 'right', border: '1px solid #d9d9d9' }}>Sharpe Ratio</th>
                                    <th style={{ padding: '8px', textAlign: 'right', border: '1px solid #d9d9d9' }}>Data Points</th>
                                  </tr>
                                </thead>
                                <tbody>
                                  {Object.entries(analysisData.individualstatus).map(([symbol, data]) => (
                                    <tr key={`individual-${symbol}`}>
                                      <td style={{ padding: '8px', fontFamily: 'monospace', fontWeight: 'bold', border: '1px solid #d9d9d9' }}>
                                        {symbol}
                                      </td>
                                      <td style={{ 
                                        padding: '8px', 
                                        textAlign: 'right', 
                                        border: '1px solid #d9d9d9',
                                        color: (data.expected_return || 0) >= 0 ? '#52c41a' : '#ff4d4f'
                                      }}>
                                        {typeof data.expected_return === 'number' 
                                          ? (data.expected_return * 100).toFixed(2) + '%' 
                                          : (data.expected_return || 'N/A')}
                                      </td>
                                      <td style={{ padding: '8px', textAlign: 'right', border: '1px solid #d9d9d9' }}>
                                        {typeof data.volatility === 'number' 
                                          ? (data.volatility * 100).toFixed(2) + '%' 
                                          : (data.volatility || 'N/A')}
                                      </td>
                                      <td style={{ padding: '8px', textAlign: 'right', border: '1px solid #d9d9d9', fontSize: '12px' }}>
                                        {typeof data.variance === 'number' 
                                          ? data.variance.toFixed(6) 
                                          : (data.variance || 'N/A')}
                                      </td>
                                      <td style={{ 
                                        padding: '8px', 
                                        textAlign: 'right', 
                                        border: '1px solid #d9d9d9',
                                        color: (data.sharpe_ratio || 0) >= 0 ? '#52c41a' : '#ff4d4f'
                                      }}>
                                        {typeof data.sharpe_ratio === 'number' 
                                          ? data.sharpe_ratio.toFixed(3) 
                                          : (data.sharpe_ratio || 'N/A')}
                                      </td>
                                      <td style={{ padding: '8px', textAlign: 'right', border: '1px solid #d9d9d9' }}>
                                        {data.data_points || 'N/A'}
                                      </td>
                                    </tr>
                                  ))}
                                </tbody>
                              </table>
                            </div>
                          </Card>
                        )}

                        {/* AI Opinion */}
                        {analysisData.ai_opinion && analysisData.ai_opinion.trim() && (
                          <Card 
                            title="🤖 AI Analysis & Recommendations" 
                            size="small"
                            style={{ background: '#f9f0ff', borderColor: '#d3adf7' }}
                          >
                            <div style={{ 
                              whiteSpace: 'pre-wrap', 
                              lineHeight: '1.6',
                              fontSize: '14px',
                              color: '#434343'
                            }}>
                              {analysisData.ai_opinion}
                            </div>
                          </Card>
                        )}

                        {/* Raw Data Toggle */}
                        <Card 
                          title="📋 Raw Response Data" 
                          size="small"
                          style={{ background: '#f5f5f5' }}
                        >
                          <pre style={{ 
                            background: '#f0f0f0',
                            border: '1px solid #d9d9d9',
                            borderRadius: '6px',
                            padding: '12px',
                            fontSize: '11px',
                            fontFamily: 'monospace',
                            overflow: 'auto',
                            margin: 0,
                            maxHeight: '200px'
                          }}>
                            {JSON.stringify(webhookResponse.data, null, 2)}
                          </pre>
                        </Card>
                      </div>
                    );
                  } else {
                    // Fallback to original display
                    return (
                      <div>
                        <div style={{ marginBottom: '16px' }}>
                          <Text strong style={{ display: 'block', marginBottom: '8px' }}>Response Data:</Text>
                          <pre style={{ 
                            background: '#f5f5f5',
                            border: '1px solid #d9d9d9',
                            borderRadius: '6px',
                            padding: '12px',
                            fontSize: '12px',
                            fontFamily: 'monospace',
                            overflow: 'auto',
                            margin: 0,
                            maxHeight: '300px'
                          }}>
                            {typeof webhookResponse.data === 'object' 
                              ? JSON.stringify(webhookResponse.data, null, 2)
                              : webhookResponse.data
                            }
                          </pre>
                        </div>

                        <div>
                          <Text strong style={{ display: 'block', marginBottom: '8px' }}>Response Headers:</Text>
                          <pre style={{ 
                            background: '#f9f9f9',
                            border: '1px solid #e8e8e8',
                            borderRadius: '6px',
                            padding: '8px',
                            fontSize: '11px',
                            fontFamily: 'monospace',
                            overflow: 'auto',
                            margin: 0,
                            maxHeight: '150px'
                          }}>
                            {JSON.stringify(webhookResponse.headers, null, 2)}
                          </pre>
                        </div>
                      </div>
                    );
                  }
                })()}
              </div>
            )}
          </Card>
        </div>
      )}
    </div>
  );
}