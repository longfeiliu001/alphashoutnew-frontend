// Login5.js - Professional authentication system with AlphaShout branding (with password reset)
import React, { useState, useEffect, createContext, useContext, useCallback, useRef } from 'react';

// ==================== Configuration ====================
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
const WS_URL = process.env.REACT_APP_WS_URL || 'ws://localhost:3001';

// AlphaShout Professional Theme
const AlphaShoutTheme = {
  colors: {
    primary: '#003D6D',      // Deep Blue
    primaryDark: '#002347',   // Darker Blue
    primaryLight: '#005A9C',  // Lighter Blue
    secondary: '#0089CC',     // Sky Blue
    accent: '#00B4E5',        // Light Blue
    success: '#6ABF4B',       // Green
    warning: '#FFB81C',       // Yellow/Orange
    error: '#E31E24',         // Red
    background: '#FFFFFF',    // White
    surface: '#F8F9FA',       // Light Gray
    textPrimary: '#1A1A1A',   // Almost Black
    textSecondary: '#4A4A4A', // Dark Gray
    textTertiary: '#767676',  // Medium Gray
    textLight: '#999999',     // Light Gray
    border: '#D4D7DC',        // Border Gray
    borderLight: '#E8EAED',   // Light Border
    googleBlue: '#4285F4',    // Google Blue
  },
  fonts: {
    primary: "'Helvetica Neue', Helvetica, Arial, sans-serif",
    heading: "'Helvetica Neue', Helvetica, Arial, sans-serif",
  },
  shadows: {
    small: '0 1px 2px rgba(0, 0, 0, 0.05)',
    medium: '0 2px 4px rgba(0, 0, 0, 0.08)',
    large: '0 4px 8px rgba(0, 0, 0, 0.12)',
  }
};

// 🔥 新添加 - AppleDeviceGuide组件
const AppleDeviceGuide = () => {
  const [showGuide, setShowGuide] = useState(false);
  const [deviceType, setDeviceType] = useState('');

  useEffect(() => {
    const userAgent = navigator.userAgent;
    const isAppleDevice = /iPad|iPhone|iPod|Mac/.test(userAgent);
    const isSafari = userAgent.includes('Safari') && !userAgent.includes('Chrome');
    
    if (!isAppleDevice || !isSafari) return;

    let device = '';
    if (userAgent.includes('iPad') || (userAgent.includes('Macintosh') && navigator.maxTouchPoints > 1)) {
      device = 'iPad';
    } else if (userAgent.includes('iPhone')) {
      device = 'iPhone';
    } else if (userAgent.includes('Macintosh')) {
      device = 'Mac';
    }

    setDeviceType(device);

    const hasShown = sessionStorage.getItem(`munich_apple_guide_${device}`);
    if (!hasShown) {
      setShowGuide(true);
    }
  }, []);

  const handleDismiss = (action) => {
    setShowGuide(false);
    if (action === 'dont-show') {
      sessionStorage.setItem(`munich_apple_guide_${deviceType}`, 'true');
    }
  };

  const getDeviceInstructions = () => {
    switch (deviceType) {
      case 'iPad':
      case 'iPhone':
        return {
          title: `${deviceType} Safari Configuration`,
          steps: [
            'Open Settings application',
            'Navigate to Safari settings',
            'Select "Privacy & Security"',
            'Disable "Prevent Cross-Site Tracking"',
            'Ensure "Block All Cookies" is disabled',
            'Return to Safari and retry login'
          ],
          urgency: 'high'
        };
      case 'Mac':
        return {
          title: 'Mac Safari Configuration',
          steps: [
            'Open Safari Preferences',
            'Navigate to Privacy tab',
            'Uncheck "Prevent cross-site tracking"',
            'Ensure "Block all cookies" is unchecked',
            'Retry login process'
          ],
          urgency: 'medium'
        };
      default:
        return null;
    }
  };

  if (!showGuide || !deviceType) return null;

  const instructions = getDeviceInstructions();
  if (!instructions) return null;

  const isHighPriority = instructions.urgency === 'high';

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
      zIndex: 9999,
      padding: '20px'
    }}>
      <div style={{
        backgroundColor: '#ffffff',
        border: '1px solid #e0e0e0',
        maxWidth: '480px',
        width: '100%',
        fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
        position: 'relative'
      }}>
        
        {/* Header */}
        <div style={{
          backgroundColor: '#005AA0',
          color: '#ffffff',
          padding: '20px 24px',
          borderBottom: '1px solid #004080'
        }}>
          <div style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'flex-start'
          }}>
            <div>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                margin: '0 0 4px 0',
                letterSpacing: '0.3px'
              }}>
                Browser Configuration Required
              </h3>
              <p style={{
                fontSize: '14px',
                margin: 0,
                opacity: 0.9,
                fontWeight: '400'
              }}>
                {instructions.title}
              </p>
            </div>
            
            <button
              onClick={() => handleDismiss('close')}
              style={{
                background: 'none',
                border: 'none',
                color: '#ffffff',
                fontSize: '20px',
                cursor: 'pointer',
                padding: '0',
                width: '20px',
                height: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                opacity: 0.8
              }}
              onMouseOver={(e) => e.target.style.opacity = '1'}
              onMouseOut={(e) => e.target.style.opacity = '0.8'}
            >
              ×
            </button>
          </div>
        </div>

        {/* Content */}
        <div style={{ padding: '24px' }}>
          
          {/* Alert */}
          {isHighPriority && (
            <div style={{
              backgroundColor: '#FFF8E1',
              border: '1px solid #FFB300',
              borderLeft: '4px solid #FF8F00',
              padding: '12px 16px',
              marginBottom: '24px',
              fontSize: '14px'
            }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'center',
                color: '#E65100',
                fontWeight: '600',
                marginBottom: '4px'
              }}>
                ⚠ Configuration Required
              </div>
              <div style={{ color: '#BF360C', lineHeight: '1.4' }}>
                Browser settings must be adjusted to enable secure login functionality.
              </div>
            </div>
          )}

          {/* Instructions */}
          <div style={{ marginBottom: '24px' }}>
            <h4 style={{
              fontSize: '16px',
              fontWeight: '600',
              color: '#212121',
              margin: '0 0 16px 0'
            }}>
              Required Configuration Steps:
            </h4>
            
            <ol style={{
              margin: 0,
              paddingLeft: '20px',
              fontSize: '14px',
              lineHeight: '1.6',
              color: '#424242'
            }}>
              {instructions.steps.map((step, index) => (
                <li key={index} style={{ 
                  marginBottom: '8px',
                  paddingLeft: '8px'
                }}>
                  {step}
                </li>
              ))}
            </ol>
          </div>

          {/* Security Notice */}
          <div style={{
            backgroundColor: '#F5F5F5',
            border: '1px solid #e0e0e0',
            padding: '16px',
            marginBottom: '24px'
          }}>
            <div style={{
              display: 'flex',
              alignItems: 'flex-start',
              gap: '8px'
            }}>
              <span style={{ 
                fontSize: '16px',
                color: '#005AA0',
                marginTop: '2px'
              }}>
                🔒
              </span>
              <div>
                <div style={{
                  fontWeight: '600',
                  fontSize: '14px',
                  color: '#212121',
                  marginBottom: '4px'
                }}>
                  Security Information
                </div>
                <div style={{
                  fontSize: '13px',
                  color: '#616161',
                  lineHeight: '1.4'
                }}>
                  This configuration allows secure authentication while maintaining your privacy. 
                  These settings are standard requirements for enterprise login systems.
                  <br /><br />
                  <strong>Scope:</strong> These Safari configurations apply globally to all websites 
                  and will improve your experience across modern web applications, including banking, 
                  e-commerce, and enterprise systems.
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div style={{
            display: 'flex',
            gap: '12px',
            justifyContent: 'flex-end'
          }}>
            <button
              onClick={() => handleDismiss('dont-show')}
              style={{
                padding: '10px 20px',
                backgroundColor: 'transparent',
                color: '#757575',
                border: '1px solid #e0e0e0',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                fontFamily: 'inherit',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = '#f5f5f5';
                e.target.style.borderColor = '#d0d0d0';
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = 'transparent';
                e.target.style.borderColor = '#e0e0e0';
              }}
            >
              Don't show again
            </button>
            
            <button
              onClick={() => handleDismiss('understood')}
              style={{
                padding: '10px 24px',
                backgroundColor: '#005AA0',
                color: '#ffffff',
                border: '1px solid #005AA0',
                fontSize: '14px',
                fontWeight: '500',
                cursor: 'pointer',
                fontFamily: 'inherit',
                transition: 'all 0.2s ease'
              }}
              onMouseOver={(e) => {
                e.target.style.backgroundColor = '#004080';
                e.target.style.borderColor = '#004080';
              }}
              onMouseOut={(e) => {
                e.target.style.backgroundColor = '#005AA0';
                e.target.style.borderColor = '#005AA0';
              }}
            >
              Understood
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// Export theme for use in other components
export { AlphaShoutTheme };

// ==================== API Service ====================
class ApiService {
  static async request(endpoint, options = {}) {
    try {
      const response = await fetch(`${API_URL}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          ...options.headers,
        },
        credentials: 'include', // Important: include cookies
      });

      const data = await response.json();

      if (!response.ok) {
        // If 401 error, don't keep retrying
        if (response.status === 401) {
          console.log('Token expired or invalid, user needs to login again');
          // Clean up local storage
          sessionStorage.removeItem('auth_user');
          sessionStorage.removeItem('quota_cache');
        }
        throw new Error(data.error || `Request failed with status ${response.status}`);
      }

      return data;
    } catch (error) {
      throw error;
    }
  }

  // Auth APIs
  static async register(email, password) {
    // 前端基础验证
    if (!email || !password) {
      throw new Error('Email and password are required');
    }
    
    // 邮箱格式验证
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Please enter a valid email address');
    }
    
    // 密码强度验证
    if (password.length < 8) {
      throw new Error('Password must be at least 8 characters long');
    }
    
    return this.request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
    });
  }

  static async login(email, password) {
    // 前端基础验证
    if (!email || !password) {
      throw new Error('Email and password are required');
    }
    
    return this.request('/api/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
    });
  }

  static async logout() {
    return this.request('/api/auth/logout', {
      method: 'POST',
    });
  }

  static async getCurrentUser() {
    return this.request('/api/auth/me');
  }

  // Password Reset APIs
  static async forgotPassword(email) {
    return this.request('/api/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ email: email.trim() }),
    });
  }

  static async updatePassword(newPassword) {
    return this.request('/api/auth/update-password', {
      method: 'POST',
      body: JSON.stringify({ newPassword }),
    });
  }
  
  // Google login
  static async loginWithGoogle(credential) {
    return this.request('/api/auth/google', {
      method: 'POST',
      body: JSON.stringify({ access_token: credential }),
    });
  }

  // Quota APIs
  static async getQuotaDetails() {
    return this.request('/api/quota/details');
  }

  static async verifyQuota(required) {
    return this.request('/api/quota/verify', {
      method: 'POST',
      body: JSON.stringify({ required }),
    });
  }

  static async consumeQuota(amount) {
    return this.request('/api/quota/consume', {
      method: 'POST',
      body: JSON.stringify({ amount }),
    });
  }

  static async updatePayment(amount) {
    return this.request('/api/quota/update-payment', {
      method: 'POST',
      body: JSON.stringify({ amount }),
    });
  }

  // Items APIs
  static async getItems() {
    return this.request('/api/items');
  }

  static async createItem(name) {
    return this.request('/api/items', {
      method: 'POST',
      body: JSON.stringify({ name }),
    });
  }

  static async deleteItem(id) {
    return this.request(`/api/items/${id}`, {
      method: 'DELETE',
    });
  }
}

// Export ApiService for external use
export { ApiService };

// ==================== WebSocket Manager ====================
class WebSocketManager {
  constructor(url, userId, onQuotaUpdate) {
    this.url = url;
    this.userId = userId;
    this.onQuotaUpdate = onQuotaUpdate;
    this.ws = null;
    this.reconnectTimeout = null;
    this.reconnectDelay = 5000; // Reconnect after 5 seconds
    this.heartbeatInterval = null;
  }

  connect() {
    if (this.ws && this.ws.readyState === WebSocket.OPEN) {
      return;
    }

    try {
      this.ws = new WebSocket(`${this.url}/ws?userId=${this.userId}`);

      this.ws.onopen = () => {
        console.log('WebSocket connected');
        this.startHeartbeat();
      };

      this.ws.onmessage = (event) => {
        try {
          const data = JSON.parse(event.data);
          
          if (data.type === 'quota_update') {
            this.onQuotaUpdate(data.quota);
          } else if (data.type === 'pong') {
            // Heartbeat response
          }
        } catch (error) {
          console.error('Failed to parse WebSocket message:', error);
        }
      };

      this.ws.onerror = (error) => {
        console.error('WebSocket error:', error);
      };

      this.ws.onclose = () => {
        console.log('WebSocket disconnected');
        this.stopHeartbeat();
        this.scheduleReconnect();
      };
    } catch (error) {
      console.error('Failed to create WebSocket:', error);
      this.scheduleReconnect();
    }
  }

  startHeartbeat() {
    this.heartbeatInterval = setInterval(() => {
      if (this.ws && this.ws.readyState === WebSocket.OPEN) {
        this.ws.send(JSON.stringify({ type: 'ping' }));
      }
    }, 30000); // Send heartbeat every 30 seconds
  }

  stopHeartbeat() {
    if (this.heartbeatInterval) {
      clearInterval(this.heartbeatInterval);
      this.heartbeatInterval = null;
    }
  }

  scheduleReconnect() {
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
    }

    this.reconnectTimeout = setTimeout(() => {
      console.log('Attempting to reconnect WebSocket...');
      this.connect();
    }, this.reconnectDelay);
  }

  disconnect() {
    this.stopHeartbeat();
    
    if (this.reconnectTimeout) {
      clearTimeout(this.reconnectTimeout);
      this.reconnectTimeout = null;
    }

    if (this.ws) {
      this.ws.close();
      this.ws = null;
    }
  }
}

// ==================== Server-Sent Events Manager (Fallback) ====================
class SSEManager {
  constructor(userId, onQuotaUpdate) {
    this.userId = userId;
    this.onQuotaUpdate = onQuotaUpdate;
    this.eventSource = null;
  }

  connect() {
    if (this.eventSource) {
      return;
    }

    this.eventSource = new EventSource(`${API_URL}/api/sse/quota/${this.userId}`);

    this.eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.quota !== undefined) {
          this.onQuotaUpdate(data);
        }
      } catch (error) {
        console.error('Failed to parse SSE message:', error);
      }
    };

    this.eventSource.onerror = (error) => {
      console.error('SSE error:', error);
      // EventSource will auto-reconnect
    };
  }

  disconnect() {
    if (this.eventSource) {
      this.eventSource.close();
      this.eventSource = null;
    }
  }
}

// ==================== Enhanced Quota Cache ====================
class QuotaCache {
  constructor() {
    this.cache = null;
    this.lastFetch = null;
    this.cacheTimeout = 30 * 1000; // 30 seconds refresh
    this.listeners = new Set();
  }

  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  update(data, notify = true) {
    this.cache = data;
    this.lastFetch = Date.now();
    
    if (data) {
      sessionStorage.setItem('quota_cache', JSON.stringify({
        data,
        timestamp: Date.now()
      }));
      
      if (notify) {
        this.listeners.forEach(listener => listener(data));
      }
    }
  }

  get() {
    if (this.cache) {
      return this.cache;
    }

    try {
      const stored = sessionStorage.getItem('quota_cache');
      if (stored) {
        const { data } = JSON.parse(stored);
        this.cache = data;
        return data;
      }
    } catch (error) {
      console.error('Failed to read quota cache:', error);
    }

    return null;
  }

  isStale() {
    return !this.lastFetch || (Date.now() - this.lastFetch > this.cacheTimeout);
  }

  clear() {
    this.cache = null;
    this.lastFetch = null;
    sessionStorage.removeItem('quota_cache');
    this.listeners.clear();
  }
}

const quotaCache = new QuotaCache();

// ==================== Auth Context ====================
const AuthContext = createContext(null);

// Export useAuth hook
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Export AuthProvider
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => {
    const cached = sessionStorage.getItem('auth_user');
    return cached ? JSON.parse(cached) : null;
  });

  const [quota, setQuota] = useState(() => {
    return quotaCache.get();
  });

  const [loading, setLoading] = useState(true);
  const [verified, setVerified] = useState(false);
  
  const wsManager = useRef(null);
  const sseManager = useRef(null);
  const pollingInterval = useRef(null);

  // Subscribe to quota cache updates
  useEffect(() => {
    const unsubscribe = quotaCache.subscribe((newQuota) => {
      setQuota(newQuota);
    });
    return unsubscribe;
  }, []);

  // Initialize authentication check
  useEffect(() => {
    checkAuth();
  }, []);

  // Set up real-time updates after user login
  useEffect(() => {
    if (user && user.id) {
      // Option 1: WebSocket (if server supports)
      if (typeof WebSocket !== 'undefined' && WS_URL) {
        try {
          wsManager.current = new WebSocketManager(
            WS_URL,
            user.id,
            (quotaData) => {
              quotaCache.update(quotaData);
              setQuota(quotaData);
            }
          );
          wsManager.current.connect();
        } catch (error) {
          console.log('WebSocket not available, falling back to polling');
        }
      }

      // Option 2: Server-Sent Events (if WebSocket unavailable)
      if (!wsManager.current && typeof EventSource !== 'undefined') {
        try {
          sseManager.current = new SSEManager(
            user.id,
            (quotaData) => {
              quotaCache.update(quotaData);
              setQuota(quotaData);
            }
          );
          sseManager.current.connect();
        } catch (error) {
          console.log('SSE not available, falling back to polling');
        }
      }

      // Option 3: Polling (as backup or main solution)
      pollingInterval.current = setInterval(async () => {
        try {
          // Check if user is still logged in
          const currentUser = await ApiService.getCurrentUser();
          if (currentUser && currentUser.user) {
            // User still logged in, fetch latest quota
            await fetchQuota(true, false); // Silent update
          } else {
            // User logged out or token expired, clean up
            console.log('Token expired or user logged out, stopping polling');
            if (pollingInterval.current) {
              clearInterval(pollingInterval.current);
              pollingInterval.current = null;
            }
            // Clean up local state
            setUser(null);
            setQuota(null);
            sessionStorage.removeItem('auth_user');
            quotaCache.clear();
          }
        } catch (error) {
          console.log('Polling error, likely token expired:', error.message);
          // If error (likely token expired), stop polling
          if (pollingInterval.current) {
            clearInterval(pollingInterval.current);
            pollingInterval.current = null;
          }
        }
      }, 15 * 60 * 1000); // Poll every 15 minutes

      // Fetch latest quota immediately
      fetchQuota(true);
    }

    return () => {
      // Clean up connections
      if (wsManager.current) {
        wsManager.current.disconnect();
        wsManager.current = null;
      }
      if (sseManager.current) {
        sseManager.current.disconnect();
        sseManager.current = null;
      }
      if (pollingInterval.current) {
        clearInterval(pollingInterval.current);
        pollingInterval.current = null;
      }
    };
  }, [user?.id]);

  const checkAuth = async () => {
    try {
      setLoading(true);
      const data = await ApiService.getCurrentUser();
      
      setUser(data.user);
      sessionStorage.setItem('auth_user', JSON.stringify(data.user));
      
      if (data.quota) {
        quotaCache.update(data.quota);
        setQuota(data.quota);
      }
      
      setVerified(true);
    } catch (err) {
      // Token expired or not logged in, clear all state
      console.log('Auth check failed, clearing state:', err.message);
      setUser(null);
      setQuota(null);
      setVerified(false);
      sessionStorage.removeItem('auth_user');
      quotaCache.clear();
      
      // Ensure all polling stops
      if (pollingInterval.current) {
        clearInterval(pollingInterval.current);
        pollingInterval.current = null;
      }
      if (wsManager.current) {
        wsManager.current.disconnect();
        wsManager.current = null;
      }
      if (sseManager.current) {
        sseManager.current.disconnect();
        sseManager.current = null;
      }
    } finally {
      setLoading(false);
    }
  };

  const login = async (email, password) => {
    const data = await ApiService.login(email, password);
    
    setUser(data.user);
    sessionStorage.setItem('auth_user', JSON.stringify(data.user));
    
    if (data.quota !== undefined) {
      const quotaData = { available_quota: data.quota };
      quotaCache.update(quotaData);
      setQuota(quotaData);
    }
    
    setVerified(true);
    
    // Trigger login event
    window.dispatchEvent(new CustomEvent('user-login', {
      detail: { user: data.user, quota: data.quota }
    }));
    
    return data;
  };

  const loginWithGoogle = async (credential) => {
    const data = await ApiService.loginWithGoogle(credential);
    
    setUser(data.user);
    sessionStorage.setItem('auth_user', JSON.stringify(data.user));
    
    if (data.quota !== undefined) {
      const quotaData = { available_quota: data.quota };
      quotaCache.update(quotaData);
      setQuota(quotaData);
    }
    
    setVerified(true);
    
    window.dispatchEvent(new CustomEvent('user-login', {
      detail: { user: data.user, quota: data.quota }
    }));
    
    return data;
  };

  const register = async (email, password) => {
    try {
      // 调用 API 注册
      const data = await ApiService.register(email, password);
      
      // 只有在成功创建用户后才更新状态
      if (data.user && data.user.id) {
        setUser(data.user);
        sessionStorage.setItem('auth_user', JSON.stringify(data.user));
        
        if (data.quota !== undefined) {
          const quotaData = { available_quota: data.quota };
          quotaCache.update(quotaData);
          setQuota(quotaData);
        }
        
        setVerified(true);
        
        // Trigger login event (registration counts as login)
        window.dispatchEvent(new CustomEvent('user-login', {
          detail: { user: data.user, quota: data.quota }
        }));
      }
      
      return data;
    } catch (error) {
      // 如果是重复注册错误，抛出更友好的消息
      if (error.message && (
        error.message.includes('already registered') ||
        error.message.includes('already exists') ||
        error.message.includes('duplicate')
      )) {
        throw new Error('This email is already registered. Please sign in instead.');
      }
      throw error;
    }
  };

  const logout = async () => {
    // Disconnect real-time connections first
    if (wsManager.current) {
      wsManager.current.disconnect();
      wsManager.current = null;
    }
    if (sseManager.current) {
      sseManager.current.disconnect();
      sseManager.current = null;
    }
    if (pollingInterval.current) {
      clearInterval(pollingInterval.current);
      pollingInterval.current = null;
    }

    await ApiService.logout();
    setUser(null);
    setQuota(null);
    setVerified(false);
    sessionStorage.clear();
    quotaCache.clear();
    
    // Trigger logout event
    window.dispatchEvent(new CustomEvent('user-logout'));
  };

  const fetchQuota = useCallback(async (force = false, showLoading = false) => {
    // Use cache if not forcing refresh and cache is fresh
    if (!force && !quotaCache.isStale()) {
      const cached = quotaCache.get();
      if (cached) {
        setQuota(cached);
        return cached;
      }
    }

    try {
      if (showLoading) setLoading(true);
      const data = await ApiService.getQuotaDetails();
      quotaCache.update(data);
      setQuota(data);
      return data;
    } catch (error) {
      // Don't throw error, just log and return null
      console.log('Failed to fetch quota (likely token expired):', error.message);
      
      // If authentication error, clean up state
      if (error.message && (error.message.includes('No access token') || error.message.includes('401'))) {
        // Token expired, stop polling
        if (pollingInterval.current) {
          clearInterval(pollingInterval.current);
          pollingInterval.current = null;
        }
      }
      
      return null;
    } finally {
      if (showLoading) setLoading(false);
    }
  }, []);

  const verifyQuota = useCallback(async (required) => {
    try {
      const data = await ApiService.verifyQuota(required);
      
      if (data.quota) {
        quotaCache.update(data.quota);
        setQuota(data.quota);
      }
      
      return {
        valid: data.valid,
        currentQuota: data.quota?.available_quota || 0
      };
    } catch (error) {
      console.error('Failed to verify quota:', error);
      return { valid: false, currentQuota: 0 };
    }
  }, []);

  const consumeQuota = useCallback(async (amount) => {
    // Optimistic update
    if (quota && quota.available_quota >= amount) {
      const optimisticQuota = {
        ...quota,
        available_quota: quota.available_quota - amount
      };
      setQuota(optimisticQuota);
      quotaCache.update(optimisticQuota, false); // Don't notify other listeners
    }

    try {
      const data = await ApiService.consumeQuota(amount);
      
      if (data.quota) {
        quotaCache.update(data.quota);
        setQuota(data.quota);
        
        // Trigger quota update event
        window.dispatchEvent(new CustomEvent('quota-update', {
          detail: { quota: data.quota.available_quota }
        }));
      }
      
      return data;
    } catch (error) {
      // Rollback on failure
      await fetchQuota(true);
      throw error;
    }
  }, [quota, fetchQuota]);

  const value = {
    user,
    quota,
    loading,
    verified,
    login,
    loginWithGoogle,
    register,
    logout,
    checkAuth,
    fetchQuota,
    verifyQuota,
    consumeQuota,
    refreshQuota: (force = false) => fetchQuota(force, false),
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

// ==================== Google Sign-In Button Component (DigitalOcean Style) ====================
// ==================== 最终版本：只替换 GoogleSignInButton 组件 ====================
// 🔥 在 Login5.js 中找到 GoogleSignInButton 组件（约第600-900行）并完全替换为这个版本

// ==================== 最终版本：只替换 GoogleSignInButton 组件 ====================
// 🔥 在 Login5.js 中找到 GoogleSignInButton 组件（约第600-900行）并完全替换为这个版本

const GoogleSignInButton = ({ onSuccess, onError, loading, setLoading }) => {
  const [isGoogleLoading, setIsGoogleLoading] = useState(true);
  const googleButtonRef = useRef(null);

  // 一次性加载和初始化
  useEffect(() => {
    const initGoogle = async () => {
      setIsGoogleLoading(true);
      
      // 加载脚本（如果还没加载）
      if (!window.google) {
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        document.head.appendChild(script);
        
        await new Promise((resolve, reject) => {
          script.onload = resolve;
          script.onerror = reject;
          // 🔥 最多等待10秒加载脚本
          setTimeout(reject, 10000);
        }).catch(() => {
          console.log('Google script loading timeout or failed');
        });
      }

      // 🔥 更智能的等待策略：指数退避
      const waitForGoogle = async () => {
        if (window.google?.accounts?.id) {
          return true; // Google可用
        }

        // 快速检查：前几次用短间隔
        for (let i = 0; i < 5; i++) {
          if (window.google?.accounts?.id) return true;
          await new Promise(resolve => setTimeout(resolve, 50)); // 50ms
        }

        // 慢速检查：后几次用长间隔  
        for (let i = 0; i < 10; i++) {
          if (window.google?.accounts?.id) return true;
          await new Promise(resolve => setTimeout(resolve, 200)); // 200ms
        }

        return false; // 超时，Google不可用
      };

      const googleReady = await waitForGoogle();

      if (googleReady && googleButtonRef.current) {
        try {
          // 🔥 更严格的Google Sign-In配置，防止自动登录
          window.google.accounts.id.initialize({
            client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
            callback: handleCredentialResponse,
            auto_select: false,                    // 禁用自动选择
            cancel_on_tap_outside: true,           // 点击外部取消
            use_fedcm_for_prompt: false,           // 禁用FedCM
            context: 'signin',                     // 明确指定为登录上下文
            ux_mode: 'popup',                      // 使用弹窗模式
            login_uri: window.location.origin,     // 明确指定登录URI
            native_callback: undefined,            // 禁用原生回调
          });

          // 🔥 确保清除任何现有的自动登录状态
          if (window.google.accounts.id.disableAutoSelect) {
            window.google.accounts.id.disableAutoSelect();
          }

          // 直接渲染真正的Google按钮
          googleButtonRef.current.innerHTML = '';
          window.google.accounts.id.renderButton(googleButtonRef.current, {
            theme: "outline",
            size: "large",
            text: "signin_with",        // 显示 "Sign in with Google"
            shape: "rectangular",
            width: "100%",
            type: "standard",           // 标准类型，不是继续登录
            click_listener: () => {     // 🔥 添加点击监听器
              console.log('🖱️ User clicked Google button');
            }
          });
          
          console.log('✅ Google button loaded successfully');
          setIsGoogleLoading(false);
        } catch (error) {
          console.log('❌ Google button render failed:', error);
          renderFallbackButton();
          setIsGoogleLoading(false);
        }
      } else {
        // Google不可用，渲染fallback按钮
        console.log('⚠️ Google not available, using fallback');
        renderFallbackButton();
        setIsGoogleLoading(false);
      }
    };

    initGoogle();
  }, []);

  // 处理Google登录回调
  const handleCredentialResponse = async (response) => {
    console.log('🔥 Google login callback triggered');
    console.log('👤 User actively chose to login'); // 确认是用户主动选择
    
    setLoading(true);
    try {
      await onSuccess(response.credential);
    } catch (error) {
      onError(error);
    } finally {
      setLoading(false);
    }
  };

  // 渲染fallback按钮（当Google不可用时）
  const renderFallbackButton = () => {
    if (!googleButtonRef.current) return;
    
    googleButtonRef.current.innerHTML = `
      <button style="
        width: 100%;
        padding: 12px 16px;
        border: 1px solid #dadce0;
        border-radius: 4px;
        background: white;
        color: #3c4043;
        font-size: 14px;
        font-family: ${AlphaShoutTheme.fonts.primary};
        cursor: pointer;
        display: flex;
        align-items: center;
        justify-content: center;
        gap: 8px;
        transition: background-color 0.2s;
      " onmouseover="this.style.backgroundColor='#f8f9fa'" 
         onmouseout="this.style.backgroundColor='white'">
        <svg width="18" height="18" viewBox="0 0 18 18">
          <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
          <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
          <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
          <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
        </svg>
        Sign in with Google
      </button>
    `;

    // 添加点击处理
    const fallbackBtn = googleButtonRef.current.querySelector('button');
    fallbackBtn.onclick = () => {
      // 手动OAuth流程
      const params = new URLSearchParams({
        client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
        redirect_uri: window.location.origin,
        response_type: 'code',
        scope: 'openid email profile',
        state: Math.random().toString(36)
      });
      window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
    };
  };

  return (
    <div style={{ position: 'relative', minHeight: '44px' }}>
      {/* 预显示假按钮 - 在Google加载时显示 */}
      {isGoogleLoading && (
        <button style={{
          width: '100%',
          padding: '11px 16px',
          border: '1px solid #dadce0',
          borderRadius: '4px',
          fontSize: '14px',
          fontWeight: '500',
          fontFamily: AlphaShoutTheme.fonts.primary,
          color: '#3c4043',
          backgroundColor: '#fff',
          cursor: 'default', // 加载中不可点击
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          minHeight: '44px',
          opacity: 0.7 // 稍微透明表示加载中
        }}>
          {/* Google Logo */}
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
            <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
            <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
            <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
          </svg>
          
          {/* 加载状态文字 + 动画 */}
          <span style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
            Loading...
            <div style={{
              width: '12px',
              height: '12px',
              border: '1.5px solid #f3f3f3',
              borderTop: '1.5px solid #4285f4',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}></div>
          </span>
        </button>
      )}

      {/* Google按钮容器 - 只在加载完成后显示 */}
      <div 
        ref={googleButtonRef} 
        style={{ 
          width: '100%',
          display: isGoogleLoading ? 'none' : 'block'
        }} 
      />
      
      {/* 登录中遮罩 */}
      {loading && !isGoogleLoading && (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          backgroundColor: 'rgba(255, 255, 255, 0.8)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '14px',
          color: '#5f6368',
          borderRadius: '4px'
        }}>
          Signing in...
        </div>
      )}

      {/* CSS动画 */}
      <style jsx>{`
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

// ==================== 使用说明 ====================

/*
🔥 替换步骤：

1. 在 Login5.js 中搜索：const GoogleSignInButton = ({ onSuccess, onError, loading, setLoading }) => {

2. 找到整个 GoogleSignInButton 组件定义（大约300行代码，包含所有复杂的设备检测、模态框等逻辑）

3. 删除整个组件定义

4. 粘贴上面的新版本

🚫 不要修改的部分：
- AppleDeviceGuide 组件 - 保持不变
- showAppleHelp 状态 - 保持不变  
- checkAppleLoginIssue 函数 - 保持不变
- handleSubmit 中的Apple检测 - 保持不变
- 所有 <AppleDeviceGuide /> 标签 - 保持不变
- Apple帮助提示的 JSX 块 - 保持不变

✅ 使用方式完全不变：
<GoogleSignInButton
  onSuccess={handleGoogleLogin}
  onError={(error) => {
    setMessage(error.message || 'Google Login Failed!');
    setMessageType('error');
  }}
  loading={loading}
  setLoading={setLoading}
/>

🎯 改进效果：
- ✅ Google按钮在平板上不会被disable
- ✅ 始终显示真正的Google官方按钮
- ✅ 代码从300行减少到100行
- ✅ 移除了所有复杂的设备检测和模态框
- ✅ 保持完整的iPad Safari帮助功能
- ✅ 有fallback到手动OAuth的机制
*/

// ==================== 使用说明 ====================

/*
🔥 替换步骤：

1. 在 Login5.js 中搜索：const GoogleSignInButton = ({ onSuccess, onError, loading, setLoading }) => {

2. 找到整个 GoogleSignInButton 组件定义（大约300行代码，包含所有复杂的设备检测、模态框等逻辑）

3. 删除整个组件定义

4. 粘贴上面的新版本

🚫 不要修改的部分：
- AppleDeviceGuide 组件 - 保持不变
- showAppleHelp 状态 - 保持不变  
- checkAppleLoginIssue 函数 - 保持不变
- handleSubmit 中的Apple检测 - 保持不变
- 所有 <AppleDeviceGuide /> 标签 - 保持不变
- Apple帮助提示的 JSX 块 - 保持不变

✅ 使用方式完全不变：
<GoogleSignInButton
  onSuccess={handleGoogleLogin}
  onError={(error) => {
    setMessage(error.message || 'Google Login Failed!');
    setMessageType('error');
  }}
  loading={loading}
  setLoading={setLoading}
/>

🎯 改进效果：
- ✅ Google按钮在平板上不会被disable
- ✅ 始终显示真正的Google官方按钮
- ✅ 代码从300行减少到100行
- ✅ 移除了所有复杂的设备检测和模态框
- ✅ 保持完整的iPad Safari帮助功能
- ✅ 有fallback到手动OAuth的机制
*/

// ==================== 使用说明 ====================

/*
🔥 替换步骤：

1. 在 Login5.js 中搜索：const GoogleSignInButton = ({ onSuccess, onError, loading, setLoading }) => {

2. 找到整个 GoogleSignInButton 组件定义（大约300行代码，包含所有复杂的设备检测、模态框等逻辑）

3. 删除整个组件定义

4. 粘贴上面的新版本

🚫 不要修改的部分：
- AppleDeviceGuide 组件 - 保持不变
- showAppleHelp 状态 - 保持不变  
- checkAppleLoginIssue 函数 - 保持不变
- handleSubmit 中的Apple检测 - 保持不变
- 所有 <AppleDeviceGuide /> 标签 - 保持不变
- Apple帮助提示的 JSX 块 - 保持不变

✅ 使用方式完全不变：
<GoogleSignInButton
  onSuccess={handleGoogleLogin}
  onError={(error) => {
    setMessage(error.message || 'Google Login Failed!');
    setMessageType('error');
  }}
  loading={loading}
  setLoading={setLoading}
/>

🎯 改进效果：
- ✅ Google按钮在平板上不会被disable
- ✅ 始终显示真正的Google官方按钮
- ✅ 代码从300行减少到100行
- ✅ 移除了所有复杂的设备检测和模态框
- ✅ 保持完整的iPad Safari帮助功能
- ✅ 有fallback到手动OAuth的机制
*/

// ==================== Internal LoginBox Component (using useAuth) ====================
const LoginBoxInternal = () => {
  const { user, quota, login, loginWithGoogle, register, logout, refreshQuota } = useAuth();
  
  const [isLogin, setIsLogin] = useState(true);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');

  // 🔥 新添加 - Apple设备帮助状态
  const [showAppleHelp, setShowAppleHelp] = useState(false);

  // 🔥 新添加 - 在 LoginBoxInternal 组件内部
  const checkAppleLoginIssue = (error) => {
    const userAgent = navigator.userAgent;
    const isAppleDevice = /iPad|iPhone|iPod|Mac/.test(userAgent);
    const isSafari = userAgent.includes('Safari') && !userAgent.includes('Chrome');
    
    if (isAppleDevice && isSafari) {
      if (error.message && (
        error.message.includes('token') || 
        error.message.includes('cookie') ||
        error.message.includes('session') ||
        error.message.includes('401')
      )) {
        setShowAppleHelp(true);
        return true;
      }
    }
    return false;
  };

 const handleSubmit = async () => {
  if (!email || !password) {
    setMessage('Please fill in all fields');
    setMessageType('error');
    return;
  }

  const cleanEmail = email.trim().toLowerCase();
  
  setLoading(true);
  setMessage('');
  setShowAppleHelp(false);

  try {
    const data = isLogin 
      ? await login(cleanEmail, password)
      : await register(cleanEmail, password);

    // 🔥 新增：登录成功后验证Cookie是否真的设置了
    const userAgent = navigator.userAgent;
    const isIOSSafari = /iPad|iPhone/.test(userAgent) && 
                       userAgent.includes('Safari') && 
                       !userAgent.includes('Chrome');

    if (isLogin && isIOSSafari) {
      // iPad/iPhone Safari需要验证Cookie是否真的工作
      console.log('🍎 iPad Safari登录成功，验证Cookie状态...');
      
      // 等待Cookie设置完成，然后测试
      setTimeout(async () => {
        try {
          await ApiService.getCurrentUser(); // 测试认证是否有效
          console.log('✅ iPad Safari Cookie验证成功');
        } catch (verifyError) {
          console.log('❌ iPad Safari Cookie验证失败:', verifyError);
          
          // Cookie设置失败，显示Safari配置提示
          if (verifyError.message && (
            verifyError.message.includes('401') ||
            verifyError.message.includes('No access token') ||
            verifyError.message.includes('Unauthorized')
          )) {
            setShowAppleHelp(true);
            setMessage('Login successful, but Safari privacy settings may prevent session persistence. Please check the configuration guide above.');
            setMessageType('warning');
          }
        }
      }, 1000); // 给Cookie设置一些时间
    }

    setMessage(data.message || (isLogin ? 'Login successful!' : 'Registration successful!'));
    setMessageType('success');
    
    if (isLogin || data.quota !== undefined) {
      setEmail('');
      setPassword('');
    }
  } catch (error) {
    // 🔥 原有的Apple设备特殊处理
    if (checkAppleLoginIssue(error)) {
      setMessage('Login may be affected by Safari privacy settings. Please check the configuration guide above.');
      setMessageType('warning');
    } else {
      // 原有错误处理...
      if (!isLogin && error.message && (
        error.message.includes('already registered') ||
        error.message.includes('already exists')
      )) {
        setMessage('This email is already registered. Switching to login...');
        setMessageType('warning');
        
        setTimeout(() => {
          setIsLogin(true);
          setMessage('Please enter your password to sign in');
          setMessageType('info');
        }, 2000);
      } else {
        setMessage(error.message || (isLogin ? 'Login failed' : 'Registration failed'));
        setMessageType('error');
      }
    }
  } finally {
    setLoading(false);
  }
};

  const handleForgotPassword = async () => {
    if (!email) {
      setMessage('Please enter your email address');
      setMessageType('error');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const data = await ApiService.forgotPassword(email);
      setMessage(data.message || 'If an account exists with this email, you will receive a password reset link shortly.');
      setMessageType('success');
      
      // 3秒后返回登入页面
      setTimeout(() => {
        setIsForgotPassword(false);
        setMessage('');
      }, 3000);
    } catch (error) {
      setMessage(error.message || 'Failed to send reset email');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout();
      setMessage('Logout successful!');
      setMessageType('success');
    } catch (error) {
      setMessage(error.message || 'Logout failed');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  const handleRecharge = () => {
    const event = new CustomEvent('navigate-to-payment', { detail: { page: 'payment2' } });
    window.dispatchEvent(event);
  };

  const handleGoogleLogin = async (credential) => {
  try {
    const data = await loginWithGoogle(credential);
    
    // 🔥 Google登录的Cookie验证
    const userAgent = navigator.userAgent;
    const isIOSSafari = /iPad|iPhone/.test(userAgent) && 
                       userAgent.includes('Safari') && 
                       !userAgent.includes('Chrome');

    if (isIOSSafari) {
      console.log('🍎 iPad Safari Google登录成功，验证Cookie状态...');
      
      setTimeout(async () => {
        try {
          await ApiService.getCurrentUser();
          console.log('✅ iPad Safari Google Cookie验证成功');
        } catch (verifyError) {
          console.log('❌ iPad Safari Google Cookie验证失败:', verifyError);
          
          if (verifyError.message && (
            verifyError.message.includes('401') ||
            verifyError.message.includes('No access token') ||
            verifyError.message.includes('Unauthorized')
          )) {
            setShowAppleHelp(true);
            setMessage('Google login successful, but Safari privacy settings may prevent session persistence. Please check the configuration guide above.');
            setMessageType('warning');
          }
        }
      }, 1000);
    }

    setMessage(data.message || 'Google Login Successful!');
    setMessageType('success');
    setEmail('');
    setPassword('');
  } catch (error) {
    // 🔥 原有的Google登录Apple设备特殊处理
    if (checkAppleLoginIssue(error)) {
      setMessage('Google login may be affected by Safari privacy settings. Please check the configuration guide above.');
      setMessageType('warning');
    } else {
      setMessage(error.message || 'Google Login Failed!');
      setMessageType('error');
    }
  }
};

  // Logged in state
  if (user) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: AlphaShoutTheme.colors.surface,
        padding: '48px 16px',
        fontFamily: AlphaShoutTheme.fonts.primary
      }}>
        {/* 🔥 新添加 - Apple设备配置指导 */}
        <AppleDeviceGuide />
        
        <div style={{
          maxWidth: '56rem',
          margin: '0 auto'
        }}>
          <div style={{
            backgroundColor: AlphaShoutTheme.colors.background,
            boxShadow: AlphaShoutTheme.shadows.large,
            borderRadius: '8px',
            padding: '32px',
            marginBottom: '24px',
            border: `1px solid ${AlphaShoutTheme.colors.borderLight}`
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '24px'
            }}>
              <h1 style={{
                fontSize: '28px',
                fontWeight: '300',
                color: AlphaShoutTheme.colors.primary,
                letterSpacing: '-0.5px'
              }}>Welcome, {user.email}</h1>
              <button
                onClick={handleLogout}
                disabled={loading}
                style={{
                  padding: '10px 24px',
                  backgroundColor: loading ? AlphaShoutTheme.colors.textTertiary : AlphaShoutTheme.colors.error,
                  color: AlphaShoutTheme.colors.background,
                  borderRadius: '4px',
                  border: 'none',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  opacity: loading ? 0.5 : 1,
                  transition: 'all 0.2s',
                  fontSize: '14px',
                  fontWeight: '500',
                  letterSpacing: '0.5px'
                }}
                onMouseOver={(e) => !loading && (e.target.style.backgroundColor = AlphaShoutTheme.colors.primaryDark)}
                onMouseOut={(e) => !loading && (e.target.style.backgroundColor = AlphaShoutTheme.colors.error)}
              >
                {loading ? 'Logging out...' : 'Logout'}
              </button>
            </div>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(3, 1fr)',
              gap: '20px',
              fontSize: '14px'
            }}>
              <div style={{
                backgroundColor: AlphaShoutTheme.colors.surface,
                padding: '16px',
                borderRadius: '4px',
                border: `1px solid ${AlphaShoutTheme.colors.border}`
              }}>
                <p style={{ color: AlphaShoutTheme.colors.textTertiary, marginBottom: '8px', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>User ID</p>
                <p style={{ fontWeight: '500', color: AlphaShoutTheme.colors.textPrimary, fontSize: '16px' }}>{user.id}</p>
              </div>
              <div style={{
                backgroundColor: AlphaShoutTheme.colors.surface,
                padding: '16px',
                borderRadius: '4px',
                position: 'relative',
                border: `1px solid ${AlphaShoutTheme.colors.border}`
              }}>
                <p style={{ color: AlphaShoutTheme.colors.textTertiary, marginBottom: '8px', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Available Tokens</p>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}>
                  <p style={{
                    fontWeight: '600',
                    fontSize: '20px',
                    color: AlphaShoutTheme.colors.primary,
                    margin: 0
                  }}>
                    {quota?.available_quota ?? 0}
                  </p>
                  <button
                    onClick={handleRecharge}
                    style={{
                      padding: '6px 16px',
                      backgroundColor: AlphaShoutTheme.colors.success,
                      color: AlphaShoutTheme.colors.background,
                      borderRadius: '4px',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: '500',
                      transition: 'all 0.2s',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '6px',
                      letterSpacing: '0.3px'
                    }}
                    onMouseOver={(e) => {
                      e.target.style.backgroundColor = '#5AAF3B';
                      e.target.style.transform = 'scale(1.05)';
                    }}
                    onMouseOut={(e) => {
                      e.target.style.backgroundColor = AlphaShoutTheme.colors.success;
                      e.target.style.transform = 'scale(1)';
                    }}
                  >
                    <svg 
                      width="14" 
                      height="14" 
                      viewBox="0 0 24 24" 
                      fill="none" 
                      stroke="currentColor" 
                      strokeWidth="2" 
                      strokeLinecap="round" 
                      strokeLinejoin="round"
                    >
                      <circle cx="12" cy="12" r="10"></circle>
                      <line x1="12" y1="8" x2="12" y2="16"></line>
                      <line x1="8" y1="12" x2="16" y2="12"></line>
                    </svg>
                    Recharge
                  </button>
                </div>
              </div>
              <div style={{
                backgroundColor: AlphaShoutTheme.colors.surface,
                padding: '16px',
                borderRadius: '4px',
                border: `1px solid ${AlphaShoutTheme.colors.border}`
              }}>
                <p style={{ color: AlphaShoutTheme.colors.textTertiary, marginBottom: '8px', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Total Used</p>
                <p style={{ fontWeight: '500', color: AlphaShoutTheme.colors.textPrimary, fontSize: '16px' }}>{quota?.total_used_quota ?? 0} tokens</p>
              </div>
            </div>

            {message && (
              <div style={{
                marginTop: '20px',
                padding: '14px',
                borderRadius: '4px',
                fontSize: '14px',
                backgroundColor: messageType === 'success' ? '#E6F4EA' : '#FCE8E6',
                color: messageType === 'success' ? AlphaShoutTheme.colors.success : AlphaShoutTheme.colors.error,
                border: `1px solid ${messageType === 'success' ? AlphaShoutTheme.colors.success : AlphaShoutTheme.colors.error}`
              }}>
                {message}
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  // Forgot password form
  if (isForgotPassword) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: AlphaShoutTheme.colors.surface,
        padding: '48px 16px',
        fontFamily: AlphaShoutTheme.fonts.primary
      }}>
        {/* 🔥 新添加 - Apple设备配置指导 */}
        <AppleDeviceGuide />
        
        <div style={{
          maxWidth: '440px',
          width: '100%'
        }}>
          <div style={{ marginBottom: '40px', textAlign: 'center' }}>
            <h2 style={{
              fontSize: '32px',
              fontWeight: '300',
              color: AlphaShoutTheme.colors.primary,
              marginBottom: '12px',
              letterSpacing: '-0.5px'
            }}>
              Reset Password
            </h2>
            <p style={{
              fontSize: '14px',
              color: AlphaShoutTheme.colors.textSecondary,
              letterSpacing: '0.2px'
            }}>
              Enter your email address and we'll send you a link to reset your password
            </p>
          </div>

          <div style={{
            backgroundColor: AlphaShoutTheme.colors.background,
            padding: '40px',
            boxShadow: AlphaShoutTheme.shadows.large,
            borderRadius: '8px',
            border: `1px solid ${AlphaShoutTheme.colors.borderLight}`
          }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <label htmlFor="reset-email" style={{
                  display: 'block',
                  fontSize: '13px',
                  fontWeight: '500',
                  color: AlphaShoutTheme.colors.textPrimary,
                  marginBottom: '8px',
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  Email Address
                </label>
                <input
                  id="reset-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleForgotPassword()}
                  style={{
                    appearance: 'none',
                    display: 'block',
                    width: '100%',
                    padding: '10px 12px',
                    border: `1px solid ${AlphaShoutTheme.colors.border}`,
                    borderRadius: '4px',
                    fontSize: '14px',
                    outline: 'none',
                    backgroundColor: AlphaShoutTheme.colors.background,
                    color: AlphaShoutTheme.colors.textPrimary,
                    transition: 'border-color 0.2s',
                    fontFamily: AlphaShoutTheme.fonts.primary
                  }}
                  onFocus={(e) => {
                    e.target.style.borderColor = AlphaShoutTheme.colors.primary;
                  }}
                  onBlur={(e) => {
                    e.target.style.borderColor = AlphaShoutTheme.colors.border;
                  }}
                  placeholder="you@example.com"
                  disabled={loading}
                />
              </div>

              {message && (
                <div style={{
                  borderRadius: '4px',
                  padding: '12px',
                  backgroundColor: messageType === 'success' ? '#E6F4EA' : '#FCE8E6',
                  color: messageType === 'success' ? AlphaShoutTheme.colors.success : AlphaShoutTheme.colors.error,
                  border: `1px solid ${messageType === 'success' ? AlphaShoutTheme.colors.success : AlphaShoutTheme.colors.error}`
                }}>
                  <p style={{ fontSize: '14px', margin: 0 }}>{message}</p>
                </div>
              )}

              <button
                onClick={handleForgotPassword}
                disabled={loading || !email}
                style={{
                  width: '100%',
                  padding: '12px 16px',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: AlphaShoutTheme.colors.background,
                  backgroundColor: loading || !email ? AlphaShoutTheme.colors.textTertiary : AlphaShoutTheme.colors.primary,
                  cursor: loading || !email ? 'not-allowed' : 'pointer',
                  opacity: loading || !email ? 0.5 : 1,
                  transition: 'background-color 0.2s',
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase'
                }}
                onMouseOver={(e) => !(loading || !email) && (e.target.style.backgroundColor = AlphaShoutTheme.colors.primaryDark)}
                onMouseOut={(e) => !(loading || !email) && (e.target.style.backgroundColor = AlphaShoutTheme.colors.primary)}
              >
                {loading ? 'Sending...' : 'Send Reset Link'}
              </button>

              <div style={{ textAlign: 'center' }}>
                <button
                  type="button"
                  onClick={() => {
                    setIsForgotPassword(false);
                    setMessage('');
                  }}
                  style={{
                    fontWeight: '400',
                    color: AlphaShoutTheme.colors.primary,
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '14px',
                    textDecoration: 'underline',
                    transition: 'color 0.2s'
                  }}
                  onMouseOver={(e) => !loading && (e.target.style.color = AlphaShoutTheme.colors.primaryDark)}
                  onMouseOut={(e) => !loading && (e.target.style.color = AlphaShoutTheme.colors.primary)}
                  disabled={loading}
                >
                  Back to Sign In
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Login/Register form
  return (
    <div style={{
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: AlphaShoutTheme.colors.surface,
      padding: '48px 16px',
      fontFamily: AlphaShoutTheme.fonts.primary
    }}>
      {/* 🔥 新添加 - Apple设备配置指导 */}
      <AppleDeviceGuide />
      
      <div style={{
        maxWidth: '440px',
        width: '100%'
      }}>
        <div style={{ marginBottom: '40px', textAlign: 'center' }}>
          <h2 style={{
            fontSize: '32px',
            fontWeight: '300',
            color: AlphaShoutTheme.colors.primary,
            marginBottom: '12px',
            letterSpacing: '-0.5px'
          }}>
            {isLogin ? 'Sign In' : 'Create Account'}
          </h2>
          <p style={{
            fontSize: '14px',
            color: AlphaShoutTheme.colors.textSecondary,
            letterSpacing: '0.2px'
          }}>
            {isLogin ? 'Welcome back to AlphaShout' : 'Join AlphaShout and get 10 free tokens'}
          </p>
          
          {/* Security Badge */}
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            marginTop: '12px',
            padding: '4px 12px',
            backgroundColor: '#E8F5E9',
            borderRadius: '20px',
            fontSize: '12px',
            color: AlphaShoutTheme.colors.success
          }}>
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
            </svg>
            <span style={{ fontWeight: '500' }}>256-bit SSL Encryption</span>
          </div>
        </div>

        <div style={{
          backgroundColor: AlphaShoutTheme.colors.background,
          padding: '40px',
          boxShadow: AlphaShoutTheme.shadows.large,
          borderRadius: '8px',
          border: `1px solid ${AlphaShoutTheme.colors.borderLight}`
        }}>

          {/* 🔥 新添加 - Apple设备帮助提示 */}
          {showAppleHelp && (
            <div style={{
              backgroundColor: '#FFF3E0',
              border: '1px solid #FFB74D',
              borderLeft: '4px solid #FF8F00',
              padding: '16px',
              marginBottom: '20px',
              fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif'
            }}>
              <div style={{ 
                display: 'flex', 
                alignItems: 'flex-start',
                gap: '12px'
              }}>
                <div style={{
                  backgroundColor: '#FF8F00',
                  color: '#ffffff',
                  width: '24px',
                  height: '24px',
                  borderRadius: '50%',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: '14px',
                  fontWeight: '600',
                  flexShrink: 0
                }}>
                  !
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ 
                    fontWeight: '600',
                    fontSize: '14px',
                    color: '#E65100',
                    marginBottom: '8px'
                  }}>
                    Safari Browser Configuration Issue
                  </div>
                  <div style={{ 
                    fontSize: '13px', 
                    color: '#BF360C', 
                    lineHeight: '1.5',
                    marginBottom: '12px'
                  }}>
                    Your browser's privacy settings may be preventing secure authentication. 
                    Please review the configuration requirements above.
                  </div>
                  <button
                    onClick={() => setShowAppleHelp(false)}
                    style={{
                      fontSize: '12px',
                      padding: '6px 12px',
                      backgroundColor: '#005AA0',
                      color: '#ffffff',
                      border: 'none',
                      cursor: 'pointer',
                      fontFamily: 'inherit',
                      fontWeight: '500'
                    }}
                  >
                    Acknowledge
                  </button>
                </div>
              </div>
            </div>
          )}

          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            <div>
              <label htmlFor="email" style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: '500',
                color: AlphaShoutTheme.colors.textPrimary,
                marginBottom: '8px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Email Address
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={{
                  appearance: 'none',
                  display: 'block',
                  width: '100%',
                  padding: '10px 12px',
                  border: `1px solid ${AlphaShoutTheme.colors.border}`,
                  borderRadius: '4px',
                  fontSize: '14px',
                  outline: 'none',
                  backgroundColor: AlphaShoutTheme.colors.background,
                  color: AlphaShoutTheme.colors.textPrimary,
                  transition: 'border-color 0.2s',
                  fontFamily: AlphaShoutTheme.fonts.primary
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = AlphaShoutTheme.colors.primary;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = AlphaShoutTheme.colors.border;
                }}
                placeholder="you@example.com"
                disabled={loading}
              />
            </div>

            <div>
              <label htmlFor="password" style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: '500',
                color: AlphaShoutTheme.colors.textPrimary,
                marginBottom: '8px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete={isLogin ? 'current-password' : 'new-password'}
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
                style={{
                  appearance: 'none',
                  display: 'block',
                  width: '100%',
                  padding: '10px 12px',
                  border: `1px solid ${AlphaShoutTheme.colors.border}`,
                  borderRadius: '4px',
                  fontSize: '14px',
                  outline: 'none',
                  backgroundColor: AlphaShoutTheme.colors.background,
                  color: AlphaShoutTheme.colors.textPrimary,
                  transition: 'border-color 0.2s',
                  fontFamily: AlphaShoutTheme.fonts.primary
                }}
                onFocus={(e) => {
                  e.target.style.borderColor = AlphaShoutTheme.colors.primary;
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = AlphaShoutTheme.colors.border;
                }}
                placeholder="••••••••"
                disabled={loading}
              />
              {!isLogin && (
                <div style={{
                  marginTop: '8px',
                  padding: '8px',
                  backgroundColor: '#FFF3E0',
                  borderRadius: '4px',
                  fontSize: '11px',
                  color: AlphaShoutTheme.colors.textSecondary,
                  lineHeight: '1.4'
                }}>
                  <strong style={{ color: AlphaShoutTheme.colors.warning }}>Password Requirements:</strong>
                  <ul style={{ margin: '4px 0 0 16px', padding: 0 }}>
                    <li>Minimum 8 characters</li>
                    <li>Must include numbers and letters</li>
                  </ul>
                </div>
              )}
            </div>

            {/* Forgot password link */}
            {isLogin && (
              <div style={{ 
                display: 'flex', 
                justifyContent: 'flex-end',
                marginTop: '-16px'
              }}>
                <button
                  type="button"
                  onClick={() => {
                    setIsForgotPassword(true);
                    setMessage('');
                    setPassword('');
                  }}
                  style={{
                    fontWeight: '400',
                    color: AlphaShoutTheme.colors.primary,
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    fontSize: '13px',
                    textDecoration: 'none',
                    transition: 'color 0.2s'
                  }}
                  onMouseOver={(e) => {
                    e.target.style.color = AlphaShoutTheme.colors.primaryDark;
                    e.target.style.textDecoration = 'underline';
                  }}
                  onMouseOut={(e) => {
                    e.target.style.color = AlphaShoutTheme.colors.primary;
                    e.target.style.textDecoration = 'none';
                  }}
                  disabled={loading}
                >
                  Forgot password?
                </button>
              </div>
            )}

            {message && (
              <div style={{
                borderRadius: '4px',
                padding: '12px',
                backgroundColor: messageType === 'success' 
                  ? '#E6F4EA' 
                  : messageType === 'info'
                  ? '#E1F5FE'
                  : messageType === 'warning'
                  ? '#FFF3E0'
                  : '#FCE8E6',
                color: messageType === 'success' 
                  ? AlphaShoutTheme.colors.success 
                  : messageType === 'info'
                  ? AlphaShoutTheme.colors.secondary
                  : messageType === 'warning'
                  ? AlphaShoutTheme.colors.warning
                  : AlphaShoutTheme.colors.error,
                border: `1px solid ${
                  messageType === 'success' 
                    ? AlphaShoutTheme.colors.success 
                    : messageType === 'info'
                    ? AlphaShoutTheme.colors.secondary
                    : messageType === 'warning'
                    ? AlphaShoutTheme.colors.warning
                    : AlphaShoutTheme.colors.error
                }`
              }}>
                <p style={{ fontSize: '14px', margin: 0 }}>{message}</p>
              </div>
            )}

            <div>
              <button
                onClick={handleSubmit}
                disabled={loading || !email || !password}
                style={{
                  width: '100%',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  padding: '12px 16px',
                  border: 'none',
                  borderRadius: '4px',
                  fontSize: '14px',
                  fontWeight: '500',
                  color: AlphaShoutTheme.colors.background,
                  backgroundColor: loading || !email || !password ? AlphaShoutTheme.colors.textTertiary : AlphaShoutTheme.colors.primary,
                  cursor: loading || !email || !password ? 'not-allowed' : 'pointer',
                  opacity: loading || !email || !password ? 0.5 : 1,
                  transition: 'background-color 0.2s',
                  letterSpacing: '0.5px',
                  textTransform: 'uppercase'
                }}
                onMouseOver={(e) => !(loading || !email || !password) && (e.target.style.backgroundColor = AlphaShoutTheme.colors.primaryDark)}
                onMouseOut={(e) => !(loading || !email || !password) && (e.target.style.backgroundColor = AlphaShoutTheme.colors.primary)}
              >
                {loading ? (
                  <span style={{ display: 'flex', alignItems: 'center' }}>
                    <svg 
                      style={{
                        animation: 'spin 1s linear infinite',
                        marginLeft: '-4px',
                        marginRight: '12px',
                        height: '20px',
                        width: '20px'
                      }}
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle 
                        style={{ opacity: 0.25 }}
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path 
                        style={{ opacity: 0.75 }}
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      />
                    </svg>
                    Processing...
                  </span>
                ) : (
                  isLogin ? 'Sign In' : 'Register'
                )}
              </button>
            </div>

            <div style={{ textAlign: 'center' }}>
              <button
                type="button"
                onClick={() => {
                  setIsLogin(!isLogin);
                  setMessage('');
                  setEmail('');
                  setPassword('');
                  setShowAppleHelp(false);
                }}
                style={{
                  fontWeight: '400',
                  color: AlphaShoutTheme.colors.primary,
                  background: 'none',
                  border: 'none',
                  cursor: loading ? 'not-allowed' : 'pointer',
                  fontSize: '14px',
                  textDecoration: 'underline',
                  transition: 'color 0.2s'
                }}
                onMouseOver={(e) => !loading && (e.target.style.color = AlphaShoutTheme.colors.primaryDark)}
                onMouseOut={(e) => !loading && (e.target.style.color = AlphaShoutTheme.colors.primary)}
                disabled={loading}
              >
                {isLogin ? "Don't have an account? Register" : 'Already have an account? Sign In'}
              </button>
            </div>

            {/* 分隔线 */}
            <div style={{
              display: 'flex',
              alignItems: 'center',
              margin: '24px 0',
              gap: '16px'
            }}>
              <div style={{
                flex: 1,
                height: '1px',
                backgroundColor: AlphaShoutTheme.colors.border
              }}></div>
              <span style={{
                color: AlphaShoutTheme.colors.textTertiary,
                fontSize: '13px',
                fontWeight: '500',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>or</span>
              <div style={{
                flex: 1,
                height: '1px',
                backgroundColor: AlphaShoutTheme.colors.border
              }}></div>
            </div>

            {/* Google 登录按钮 - DigitalOcean Style */}
            <GoogleSignInButton
              onSuccess={handleGoogleLogin}
              onError={(error) => {
                setMessage(error.message || 'Google Login Failed!');
                setMessageType('error');
              }}
              loading={loading}
              setLoading={setLoading}
            />

          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          from {
            transform: rotate(0deg);
          }
          to {
            transform: rotate(360deg);
          }
        }
      `}</style>
    </div>
  );
};

// ==================== Self-contained LoginBox Component ====================
const LoginBox = () => {
  return (
    <AuthProvider>
      <LoginBoxInternal />
    </AuthProvider>
  );
};

// Default export self-contained LoginBox
export default LoginBox;

// Also export separated components for flexible use
export { LoginBoxInternal };