import React, { useState, useEffect, useRef } from 'react';
import { Input, Spin, Empty, Card, Alert, Typography, Tag, Space, Avatar } from 'antd';
import { SearchOutlined, StockOutlined, InfoCircleOutlined, BankOutlined } from '@ant-design/icons';

const { Title, Text, Paragraph } = Typography;

const SymbolSearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  // Twelve Data API configuration
  const API_KEY = '91ed705006654f29b8cb2c8a972b8fb2'; // Replace with your actual API key
  const BASE_URL = 'https://api.twelvedata.com';

  const searchSymbols = async (searchQuery) => {
    if (!searchQuery.trim() || searchQuery.length < 2) {
      setResults([]);
      setShowDropdown(false);
      return;
    }

    setLoading(true);
    try {
      // Using Twelve Data Symbol Search endpoint
      const response = await fetch(
        `${BASE_URL}/symbol_search?symbol=${encodeURIComponent(searchQuery)}&apikey=${API_KEY}`
      );
      
      if (!response.ok) {
        throw new Error('Failed to fetch data');
      }
      
      const data = await response.json();
      
      // Handle the response format from Twelve Data
      const symbols = data.data || [];
      setResults(symbols.slice(0, 10)); // Limit to 10 results
      setShowDropdown(true);
      setSelectedIndex(-1);
    } catch (error) {
      console.error('Error searching symbols:', error);
      // For demo purposes, using mock data when API fails
      const mockResults = [
        {
          symbol: 'AAPL',
          instrument_name: 'Apple Inc.',
          exchange: 'NASDAQ',
          mic_code: 'XNAS',
          exchange_timezone: 'America/New_York',
          instrument_type: 'Common Stock',
          country: 'United States'
        },
        {
          symbol: 'GOOGL',
          instrument_name: 'Alphabet Inc.',
          exchange: 'NASDAQ',
          mic_code: 'XNAS',
          exchange_timezone: 'America/New_York',
          instrument_type: 'Common Stock',
          country: 'United States'
        },
        {
          symbol: 'MSFT',
          instrument_name: 'Microsoft Corporation',
          exchange: 'NASDAQ',
          mic_code: 'XNAS',
          exchange_timezone: 'America/New_York',
          instrument_type: 'Common Stock',
          country: 'United States'
        }
      ].filter(item => 
        item.symbol.toLowerCase().includes(searchQuery.toLowerCase()) ||
        item.instrument_name.toLowerCase().includes(searchQuery.toLowerCase())
      );
      
      setResults(mockResults);
      setShowDropdown(true);
    } finally {
      setLoading(false);
    }
  };

  // Debounce search to avoid too many API calls
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      searchSymbols(query);
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query]);

  // Handle keyboard navigation
  const handleKeyDown = (e) => {
    if (!showDropdown) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setSelectedIndex(prev => 
          prev < results.length - 1 ? prev + 1 : prev
        );
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
    }
  };

  const selectSymbol = (symbol) => {
    const formattedValue = `${symbol.exchange}:${symbol.symbol}`;
    setQuery(formattedValue);
    setShowDropdown(false);
    setSelectedIndex(-1);
    console.log('Selected symbol:', symbol);
    console.log('Formatted value:', formattedValue);
  };

  // Close dropdown when clicking outside
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

  const getExchangeColor = (exchange) => {
    const colors = {
      'NASDAQ': 'blue',
      'NYSE': 'purple',
      'LSE': 'green',
      'TSE': 'red'
    };
    return colors[exchange] || 'default';
  };

  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: 24 }}>
      {/* Header */}
      <div style={{ textAlign: 'center', marginBottom: 32 }}>
        <Title level={2} style={{ marginBottom: 8 }}>
          <StockOutlined style={{ marginRight: 8 }} />
          Stock Symbol Search
        </Title>
        <Paragraph type="secondary" style={{ fontSize: 16, marginBottom: 0 }}>
          Search for stock symbols using Twelve Data API
        </Paragraph>
      </div>

      {/* Search Section */}
      <div ref={dropdownRef} style={{ position: 'relative', marginBottom: 24 }}>
        <Input
          ref={inputRef}
          size="large"
          placeholder="Search for stocks (e.g., AAPL, Apple, Microsoft...)"
          prefix={<SearchOutlined />}
          suffix={loading ? <Spin size="small" /> : null}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          onFocus={() => query.length >= 2 && results.length > 0 && setShowDropdown(true)}
          style={{ borderRadius: 8 }}
        />

        {/* Dropdown Results */}
        {showDropdown && (
          <Card
            style={{
              position: 'absolute',
              top: '100%',
              left: 0,
              right: 0,
              zIndex: 1050,
              marginTop: 4,
              maxHeight: 400,
              overflow: 'auto',
              boxShadow: '0 6px 16px 0 rgba(0, 0, 0, 0.08), 0 3px 6px -4px rgba(0, 0, 0, 0.12), 0 9px 28px 8px rgba(0, 0, 0, 0.05)'
            }}
            bodyStyle={{ padding: 0 }}
          >
            {results.length === 0 && !loading ? (
              <Empty
                image={Empty.PRESENTED_IMAGE_SIMPLE}
                description="No symbols found"
                style={{ padding: '40px 16px' }}
              >
                <Text type="secondary">Try a different search term</Text>
              </Empty>
            ) : (
              <div>
                {results.map((symbol, index) => (
                  <div
                    key={`${symbol.symbol}-${symbol.exchange}-${index}`}
                    style={{
                      padding: '12px 16px',
                      cursor: 'pointer',
                      backgroundColor: index === selectedIndex ? '#f5f5f5' : 'transparent',
                      borderBottom: index === results.length - 1 ? 'none' : '1px solid #f0f0f0',
                      transition: 'background-color 0.2s'
                    }}
                    onClick={() => selectSymbol(symbol)}
                    onMouseEnter={() => setSelectedIndex(index)}
                  >
                    <Space align="start" size={12} style={{ width: '100%' }}>
                      <Avatar
                        size={40}
                        icon={<StockOutlined />}
                        style={{
                          backgroundColor: '#1890ff',
                          flexShrink: 0
                        }}
                      />
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ marginBottom: 4 }}>
                          <Space size={8} wrap>
                            <Text strong style={{ fontSize: 16 }}>
                              {symbol.symbol}
                            </Text>
                            <Tag color={getExchangeColor(symbol.exchange)} size="small">
                              {symbol.exchange}
                            </Tag>
                          </Space>
                        </div>
                        <Paragraph
                          ellipsis={{ rows: 1 }}
                          type="secondary"
                          style={{ marginBottom: 4, fontSize: 14 }}
                        >
                          {symbol.instrument_name}
                        </Paragraph>
                        <Space size={16} style={{ fontSize: 12 }}>
                          <Text type="secondary">
                            <BankOutlined style={{ marginRight: 4 }} />
                            {symbol.instrument_type}
                          </Text>
                          {symbol.country && (
                            <Text type="secondary">{symbol.country}</Text>
                          )}
                        </Space>
                      </div>
                    </Space>
                  </div>
                ))}
              </div>
            )}
          </Card>
        )}
      </div>

      {/* Instructions Card */}
      <Card
        title={
          <Space>
            <InfoCircleOutlined style={{ color: '#1890ff' }} />
            <span>How to use</span>
          </Space>
        }
        style={{ marginBottom: 16 }}
      >
        <ul style={{ marginBottom: 0, paddingLeft: 20 }}>
          <li style={{ marginBottom: 8 }}>
            <Text>Type at least 3 characters to start searching</Text>
          </li>
          <li style={{ marginBottom: 8 }}>
            <Text>Use arrow keys to navigate through results</Text>
          </li>
          <li style={{ marginBottom: 8 }}>
            <Text>Press Enter to select or click on any result</Text>
          </li>
          <li>
            <Text>Search by symbol (AAPL) or company name (Apple)</Text>
          </li>
        </ul>
      </Card>

      {/* API Notice */}
      <Alert
        message="API Configuration Required"
        description={
          <div>
            <Text>
              Replace the API_KEY variable with your actual Twelve Data API key. 
              You can get a free API key from{' '}
              <a 
                href="https://twelvedata.com" 
                target="_blank" 
                rel="noopener noreferrer"
              >
                twelvedata.com
              </a>
              . The component currently shows mock data when the API call fails.
            </Text>
          </div>
        }
        type="warning"
        showIcon
        style={{ borderRadius: 8 }}
      />
    </div>
  );
};

export default SymbolSearch;