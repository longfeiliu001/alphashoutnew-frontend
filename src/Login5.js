// Login3.js - Professional authentication system with AlphaShout branding (with password reset)
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
    // 前端基礎驗證
    if (!email || !password) {
      throw new Error('Email and password are required');
    }
    
    // 郵箱格式驗證
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      throw new Error('Please enter a valid email address');
    }
    
    // 密碼強度驗證
    if (password.length < 8) {
      throw new Error('Password must be at least 8 characters long');
    }
    
    return this.request('/api/auth/register', {
      method: 'POST',
      body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
    });
  }

  static async login(email, password) {
    // 前端基礎驗證
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
////////////google login
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
      // 調用 API 註冊
      const data = await ApiService.register(email, password);
      
      // 只有在成功創建用戶後才更新狀態
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
      // 如果是重複註冊錯誤，拋出更友好的消息
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
// ==================== Google Sign-In Button Component ====================
const GoogleSignInButton = ({ onSuccess, onError, loading, setLoading }) => {
  const [gsiLoaded, setGsiLoaded] = useState(false);

  useEffect(() => {
    // 加载 Google Sign-In 脚本
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => setGsiLoaded(true);
    document.body.appendChild(script);

    return () => {
      const existingScript = document.querySelector('script[src="https://accounts.google.com/gsi/client"]');
      if (existingScript) {
        document.body.removeChild(existingScript);
      }
    };
  }, []);

  useEffect(() => {
    if (gsiLoaded && window.google) {
      window.google.accounts.id.initialize({
        client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
        callback: handleCredentialResponse,
      });

      window.google.accounts.id.renderButton(
        document.getElementById("googleSignInButton"),
        { 
          theme: "outline", 
          size: "large",
          width: "100%",
          text: "continue_with",
          shape: "rectangular"
        }
      );
    }
  }, [gsiLoaded]);

  const handleCredentialResponse = async (response) => {
    setLoading(true);
    try {
      await onSuccess(response.credential);
    } catch (error) {
      onError(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div id="googleSignInButton" style={{ width: '100%' }}></div>
      
      {!gsiLoaded && (
        <button
          disabled={loading}
          style={{
            width: '100%',
            padding: '12px 16px',
            border: `1px solid ${AlphaShoutTheme.colors.border}`,
            borderRadius: '4px',
            fontSize: '14px',
            fontWeight: '500',
            color: AlphaShoutTheme.colors.textPrimary,
            backgroundColor: AlphaShoutTheme.colors.background,
            cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            transition: 'all 0.2s'
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
          </svg>
          Continue with Google
        </button>
      )}
    </>
  );
};
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

  const handleSubmit = async () => {
    if (!email || !password) {
      setMessage('Please fill in all fields');
      setMessageType('error');
      return;
    }

    // 清理郵箱（去除空格，轉小寫）
    const cleanEmail = email.trim().toLowerCase();
    
    setLoading(true);
    setMessage('');

    try {
      const data = isLogin 
        ? await login(cleanEmail, password)
        : await register(cleanEmail, password);

      setMessage(data.message || (isLogin ? 'Login successful!' : 'Registration successful!'));
      setMessageType('success');
      
      if (isLogin || data.quota !== undefined) {
        setEmail('');
        setPassword('');
      }
    } catch (error) {
      // 處理重複註冊錯誤
      if (!isLogin && error.message && (
        error.message.includes('already registered') ||
        error.message.includes('already exists')
      )) {
        setMessage('This email is already registered. Switching to login...');
        setMessageType('warning');
        
        // 自動切換到登錄模式
        setTimeout(() => {
          setIsLogin(true);
          setMessage('Please enter your password to sign in');
          setMessageType('info');
        }, 2000);
      } else {
        setMessage(error.message || 'Operation failed');
        setMessageType('error');
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
      
      // 3秒後返回登入頁面
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

  // Logged in state
  if (user) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: AlphaShoutTheme.colors.surface,
        padding: '48px 16px',
        fontFamily: AlphaShoutTheme.fonts.primary
      }}>
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


{/* 在提交按钮的 </div> 之后添加 */}

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

{/* Google 登录按钮 */}
<GoogleSignInButton
  onSuccess={async (credential) => {
    try {
      const data = await loginWithGoogle(credential);
      setMessage(data.message || 'Google Login Successful！');
      setMessageType('success');
      setEmail('');
      setPassword('');
    } catch (error) {
      setMessage(error.message || 'Google Login Failed!');
      setMessageType('error');
    }
  }}
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