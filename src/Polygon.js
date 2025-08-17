import React, { useState, useEffect, useRef } from 'react';
import { Search, TrendingUp, Building2, DollarSign, X, ChevronDown, ExternalLink } from 'lucide-react';

const StockSearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [apiKey, setApiKey] = useState('');
  const [showDropdown, setShowDropdown] = useState(false);
  const [selectedStock, setSelectedStock] = useState(null);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  
  const searchTimeoutRef = useRef(null);
  const searchRequestRef = useRef(null);
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  // 实时搜索函数
  const performSearch = async (searchQuery) => {
    if (!searchQuery.trim() || !apiKey.trim()) {
      setResults([]);
      setShowDropdown(false);
      return;
    }

    // 取消之前的请求
    if (searchRequestRef.current) {
      searchRequestRef.current.abort();
    }

    setLoading(true);
    setError(null);

    try {
      // 创建新的 AbortController
      const controller = new AbortController();
      searchRequestRef.current = controller;

      const response = await fetch(
        `https://api.polygon.io/v3/reference/tickers?search=p41gd2TxTh7uyW3tVUVELuLR9923Eno3&active=true&limit=10&apikey=${apiKey}`,
        { signal: controller.signal }
      );

      if (!response.ok) {
        throw new Error(`API Error: ${response.status} ${response.statusText}`);
      }

      const data = await response.json();
      setResults(data.results || []);
      setShowDropdown(true);
      setHighlightedIndex(-1);
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err.message);
        setResults([]);
        setShowDropdown(true);
      }
    } finally {
      setLoading(false);
      searchRequestRef.current = null;
    }
  };

  // 防抖处理搜索
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (query.trim() && apiKey.trim()) {
      searchTimeoutRef.current = setTimeout(() => {
        performSearch(query);
      }, 300); // 减少到300ms延迟，提高响应速度
    } else {
      setResults([]);
      setShowDropdown(false);
      setError(null);
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [query, apiKey]);

  // 点击外部关闭下拉框
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false);
        setHighlightedIndex(-1);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // 选择股票
  const selectStock = (stock) => {
    setSelectedStock(stock);
    setQuery(stock.ticker);
    setShowDropdown(false);
    setHighlightedIndex(-1);
    inputRef.current?.blur();
  };

  // 清除搜索
  const clearSearch = () => {
    setQuery('');
    setResults([]);
    setShowDropdown(false);
    setError(null);
    setSelectedStock(null);
    setHighlightedIndex(-1);
    inputRef.current?.focus();
  };

  // 键盘导航
  const handleKeyDown = (e) => {
    if (!showDropdown || results.length === 0) return;

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev < results.length - 1 ? prev + 1 : 0
        );
        break;
      case 'ArrowUp':
        e.preventDefault();
        setHighlightedIndex(prev => 
          prev > 0 ? prev - 1 : results.length - 1
        );
        break;
      case 'Enter':
        e.preventDefault();
        if (highlightedIndex >= 0 && highlightedIndex < results.length) {
          selectStock(results[highlightedIndex]);
        }
        break;
      case 'Escape':
        setShowDropdown(false);
        setHighlightedIndex(-1);
        break;
    }
  };

  const styles = {
    container: {
      maxWidth: '900px',
      margin: '0 auto',
      padding: '24px',
      backgroundColor: 'white',
      fontFamily: 'Arial, sans-serif',
      position: 'relative'
    },
    header: {
      marginBottom: '32px'
    },
    title: {
      fontSize: '28px',
      fontWeight: 'bold',
      color: '#1f2937',
      marginBottom: '8px',
      display: 'flex',
      alignItems: 'center',
      gap: '8px'
    },
    subtitle: {
      color: '#6b7280',
      fontSize: '16px'
    },
    inputGroup: {
      marginBottom: '16px'
    },
    label: {
      display: 'block',
      fontSize: '14px',
      fontWeight: '500',
      color: '#374151',
      marginBottom: '8px'
    },
    input: {
      width: '100%',
      padding: '12px 16px',
      border: '1px solid #d1d5db',
      borderRadius: '8px',
      fontSize: '16px',
      outline: 'none',
      transition: 'border-color 0.2s, box-shadow 0.2s',
      boxSizing: 'border-box'
    },
    searchContainer: {
      marginBottom: '24px',
      position: 'relative'
    },
    searchInputWrapper: {
      position: 'relative'
    },
    searchInput: {
      width: '100%',
      paddingLeft: '40px',
      paddingRight: query ? '80px' : '16px',
      paddingTop: '12px',
      paddingBottom: '12px',
      border: showDropdown ? '2px solid #3b82f6' : '1px solid #d1d5db',
      borderRadius: showDropdown ? '8px 8px 0 0' : '8px',
      fontSize: '18px',
      outline: 'none',
      transition: 'border-color 0.2s, box-shadow 0.2s',
      boxSizing: 'border-box',
      backgroundColor: 'white'
    },
    searchIcon: {
      position: 'absolute',
      left: '12px',
      top: '50%',
      transform: 'translateY(-50%)',
      color: loading ? '#3b82f6' : '#9ca3af',
      animation: loading ? 'spin 1s linear infinite' : 'none'
    },
    inputActions: {
      position: 'absolute',
      right: '12px',
      top: '50%',
      transform: 'translateY(-50%)',
      display: 'flex',
      gap: '4px'
    },
    clearButton: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      color: '#6b7280',
      padding: '4px',
      borderRadius: '4px',
      display: query ? 'flex' : 'none',
      alignItems: 'center',
      justifyContent: 'center'
    },
    dropdownToggle: {
      background: 'none',
      border: 'none',
      cursor: 'pointer',
      color: '#6b7280',
      padding: '4px',
      borderRadius: '4px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    dropdown: {
      position: 'absolute',
      top: '100%',
      left: '0',
      right: '0',
      backgroundColor: 'white',
      border: '2px solid #3b82f6',
      borderTop: 'none',
      borderRadius: '0 0 8px 8px',
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.1)',
      maxHeight: '400px',
      overflowY: 'auto',
      zIndex: 50
    },
    dropdownHeader: {
      padding: '12px 16px',
      borderBottom: '1px solid #e5e7eb',
      backgroundColor: '#f9fafb',
      fontSize: '12px',
      fontWeight: '600',
      color: '#374151',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    stockItem: {
      padding: '12px 16px',
      borderBottom: '1px solid #f3f4f6',
      cursor: 'pointer',
      transition: 'background-color 0.1s',
      display: 'flex',
      alignItems: 'center',
      gap: '12px'
    },
    stockItemHighlighted: {
      backgroundColor: '#eff6ff'
    },
    stockItemHover: {
      backgroundColor: '#f9fafb'
    },
    stockIcon: {
      backgroundColor: '#dbeafe',
      padding: '6px',
      borderRadius: '6px',
      flexShrink: 0
    },
    stockDetails: {
      flex: 1
    },
    stockTicker: {
      fontSize: '14px',
      fontWeight: 'bold',
      color: '#1f2937',
      marginBottom: '2px'
    },
    stockName: {
      color: '#6b7280',
      fontSize: '12px',
      marginBottom: '4px'
    },
    stockMeta: {
      fontSize: '11px',
      color: '#9ca3af'
    },
    marketBadge: {
      padding: '2px 6px',
      backgroundColor: '#dcfce7',
      color: '#166534',
      borderRadius: '10px',
      fontSize: '10px',
      fontWeight: '500'
    },
    loadingItem: {
      padding: '16px',
      textAlign: 'center',
      color: '#6b7280',
      fontSize: '14px'
    },
    noResults: {
      padding: '24px 16px',
      textAlign: 'center',
      color: '#6b7280',
      fontSize: '14px'
    },
    selectedStockCard: {
      backgroundColor: '#f8fafc',
      border: '2px solid #e2e8f0',
      borderRadius: '12px',
      padding: '24px',
      marginTop: '24px'
    },
    selectedHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-start',
      marginBottom: '16px'
    },
    selectedInfo: {
      display: 'flex',
      alignItems: 'center',
      gap: '16px'
    },
    selectedIcon: {
      backgroundColor: '#3b82f6',
      padding: '12px',
      borderRadius: '12px'
    },
    selectedTicker: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#1f2937',
      marginBottom: '4px'
    },
    selectedName: {
      color: '#6b7280',
      fontSize: '16px'
    },
    selectedMeta: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
      gap: '16px',
      marginBottom: '16px'
    },
    metaItem: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      fontSize: '14px',
      color: '#374151'
    },
    description: {
      color: '#6b7280',
      fontSize: '14px',
      lineHeight: '1.6',
      marginBottom: '16px'
    },
    websiteLink: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      color: '#3b82f6',
      fontSize: '14px',
      fontWeight: '500',
      textDecoration: 'none',
      padding: '8px 16px',
      backgroundColor: '#eff6ff',
      borderRadius: '6px',
      transition: 'background-color 0.2s'
    },
    helpText: {
      fontSize: '12px',
      color: '#6b7280',
      marginTop: '4px'
    },
    helpLink: {
      color: '#3b82f6',
      textDecoration: 'none'
    },
    liveIndicator: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px',
      fontSize: '11px',
      color: '#059669',
      fontWeight: '500'
    },
    liveDot: {
      width: '6px',
      height: '6px',
      backgroundColor: '#10b981',
      borderRadius: '50%',
      animation: 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite'
    }
  };

  // 添加 CSS 动画
  useEffect(() => {
    const style = document.createElement('style');
    style.textContent = `
      @keyframes spin {
        from { transform: translateY(-50%) rotate(0deg); }
        to { transform: translateY(-50%) rotate(360deg); }
      }
      @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
      }
    `;
    document.head.appendChild(style);
    return () => document.head.removeChild(style);
  }, []);

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1 style={styles.title}>
          <TrendingUp color="#3b82f6" />
          智能股票搜索
        </h1>
        <p style={styles.subtitle}>输入股票代码或公司名称，从下拉列表中选择股票</p>
      </div>

      {/* API Key Input */}
      <div style={styles.inputGroup}>
        <label style={styles.label}>
          Polygon.io API Key
        </label>
        <input
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="输入您的 Polygon.io API 密钥"
          style={styles.input}
        />
        <p style={styles.helpText}>
          在 <a href="https://polygon.io" target="_blank" rel="noopener noreferrer" style={styles.helpLink}>polygon.io</a> 获取免费 API 密钥
        </p>
      </div>

      {/* Search Input with Dropdown */}
      <div style={styles.searchContainer} ref={dropdownRef}>
        <div style={styles.searchInputWrapper}>
          <Search style={styles.searchIcon} size={20} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            onFocus={() => {
              if (results.length > 0) {
                setShowDropdown(true);
              }
            }}
            placeholder="搜索股票代码或公司名称..."
            style={styles.searchInput}
            autoComplete="off"
          />
          <div style={styles.inputActions}>
            {query && (
              <button
                style={styles.clearButton}
                onClick={clearSearch}
                onMouseOver={(e) => e.target.style.backgroundColor = '#f3f4f6'}
                onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
                title="清除搜索"
              >
                <X size={16} />
              </button>
            )}
            <button
              style={styles.dropdownToggle}
              onClick={() => {
                if (results.length > 0) {
                  setShowDropdown(!showDropdown);
                }
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = '#f3f4f6'}
              onMouseOut={(e) => e.target.style.backgroundColor = 'transparent'}
              title="切换下拉列表"
            >
              <ChevronDown 
                size={16} 
                style={{
                  transform: showDropdown ? 'rotate(180deg)' : 'rotate(0deg)',
                  transition: 'transform 0.2s'
                }}
              />
            </button>
          </div>
        </div>

        {/* Dropdown Results */}
        {showDropdown && (
          <div style={styles.dropdown}>
            <div style={styles.dropdownHeader}>
              <span>
                {loading ? '搜索中...' : `${results.length} 个结果`}
              </span>
              {!loading && query && (
                <div style={styles.liveIndicator}>
                  <div style={styles.liveDot}></div>
                  实时
                </div>
              )}
            </div>

            {loading && (
              <div style={styles.loadingItem}>
                正在搜索股票信息...
              </div>
            )}

            {error && (
              <div style={{...styles.loadingItem, color: '#dc2626'}}>
                错误: {error}
              </div>
            )}

            {!loading && results.length > 0 && (
              <div>
                {results.map((stock, index) => (
                  <div
                    key={stock.ticker}
                    style={{
                      ...styles.stockItem,
                      ...(highlightedIndex === index ? styles.stockItemHighlighted : {})
                    }}
                    onMouseEnter={() => setHighlightedIndex(index)}
                    onMouseLeave={() => setHighlightedIndex(-1)}
                    onClick={() => selectStock(stock)}
                  >
                    <div style={styles.stockIcon}>
                      <DollarSign color="#3b82f6" size={14} />
                    </div>
                    <div style={styles.stockDetails}>
                      <div style={styles.stockTicker}>{stock.ticker}</div>
                      <div style={styles.stockName}>{stock.name}</div>
                      <div style={styles.stockMeta}>
                        {stock.primary_exchange && `${stock.primary_exchange}`}
                        {stock.type && ` • ${stock.type}`}
                      </div>
                    </div>
                    {stock.market && (
                      <div style={styles.marketBadge}>
                        {stock.market}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}

            {!loading && !error && results.length === 0 && query && (
              <div style={styles.noResults}>
                未找到匹配 "{query}" 的股票
                <br />
                <small>请尝试其他搜索词或股票代码</small>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Selected Stock Details */}
      {selectedStock && (
        <div style={styles.selectedStockCard}>
          <div style={styles.selectedHeader}>
            <div style={styles.selectedInfo}>
              <div style={styles.selectedIcon}>
                <DollarSign color="white" size={24} />
              </div>
              <div>
                <div style={styles.selectedTicker}>{selectedStock.ticker}</div>
                <div style={styles.selectedName}>{selectedStock.name}</div>
              </div>
            </div>
            {selectedStock.market && (
              <span style={{...styles.marketBadge, fontSize: '12px', padding: '4px 12px'}}>
                {selectedStock.market}
              </span>
            )}
          </div>

          <div style={styles.selectedMeta}>
            {selectedStock.primary_exchange && (
              <div style={styles.metaItem}>
                <Building2 color="#6b7280" size={16} />
                <span><strong>交易所:</strong> {selectedStock.primary_exchange}</span>
              </div>
            )}
            {selectedStock.type && (
              <div style={styles.metaItem}>
                <span><strong>类型:</strong> {selectedStock.type}</span>
              </div>
            )}
            {selectedStock.currency_name && (
              <div style={styles.metaItem}>
                <span><strong>货币:</strong> {selectedStock.currency_name}</span>
              </div>
            )}
          </div>

          {selectedStock.description && (
            <p style={styles.description}>
              {selectedStock.description}
            </p>
          )}

          {selectedStock.homepage_url && (
            <a
              href={selectedStock.homepage_url}
              target="_blank"
              rel="noopener noreferrer"
              style={styles.websiteLink}
              onMouseOver={(e) => e.target.style.backgroundColor = '#dbeafe'}
              onMouseOut={(e) => e.target.style.backgroundColor = '#eff6ff'}
            >
              <ExternalLink size={14} />
              访问公司官网
            </a>
          )}
        </div>
      )}
    </div>
  );
};

export default StockSearch;