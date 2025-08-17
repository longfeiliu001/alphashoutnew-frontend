import React, { useEffect, useState } from 'react';
import { Avatar, Spin, Dropdown, Menu } from 'antd';
import { UserOutlined, ThunderboltOutlined, LogoutOutlined, CreditCardOutlined, BarChartOutlined } from '@ant-design/icons';

// API Configuration
const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

// AlphaShout Professional Theme
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
    surface: '#F8F9FA',
    textPrimary: '#1A1A1A',
    textSecondary: '#4A4A4A',
    textTertiary: '#767676',
    border: '#D4D7DC',
    borderLight: '#E8EAED',
  },
  fonts: {
    primary: "'Helvetica Neue', Helvetica, Arial, sans-serif",
  }
};

// API Functions
const fetchQuotaData = async () => {
  try {
    const response = await fetch(`${API_URL}/api/quota/details`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Failed to fetch quota');
    return await response.json();
  } catch (error) {
    console.error('Error fetching quota:', error);
    return null;
  }
};

const fetchCurrentUser = async () => {
  try {
    const response = await fetch(`${API_URL}/api/auth/me`, {
      method: 'GET',
      headers: { 'Content-Type': 'application/json' },
      credentials: 'include',
    });
    if (!response.ok) throw new Error('Not authenticated');
    return await response.json();
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
};

// Main Component
const Usersmallbox = () => {
  const [user, setUser] = useState(null);
  const [quota, setQuota] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshUserAndQuota = async () => {
    try {
      setLoading(true);
      const cachedUser = sessionStorage.getItem('auth_user');
      if (cachedUser) {
        setUser(JSON.parse(cachedUser));
      }

      const userData = await fetchCurrentUser();
      if (userData && userData.user) {
        setUser(userData.user);
        sessionStorage.setItem('auth_user', JSON.stringify(userData.user));
        if (userData.quota) {
          setQuota(userData.quota);
        }
      } else {
        setUser(null);
        setQuota(null);
        sessionStorage.removeItem('auth_user');
      }
    } catch (error) {
      console.error('Error refreshing user data:', error);
      setUser(null);
      setQuota(null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshUserAndQuota();

    const handleLogin = (event) => {
      if (event.detail) {
        const { user: eventUser, quota: eventQuota } = event.detail;
        if (eventUser) {
          setUser(eventUser);
          sessionStorage.setItem('auth_user', JSON.stringify(eventUser));
        }
        if (eventQuota !== undefined) {
          setQuota({ available_quota: eventQuota });
        }
      }
      refreshUserAndQuota();
    };

    const handleLogout = () => {
      setUser(null);
      setQuota(null);
      sessionStorage.removeItem('auth_user');
    };

    const handleQuotaUpdate = (event) => {
      if (event.detail && event.detail.quota !== undefined) {
        setQuota({ available_quota: event.detail.quota });
      }
    };

    window.addEventListener('user-login', handleLogin);
    window.addEventListener('user-logout', handleLogout);
    window.addEventListener('quota-update', handleQuotaUpdate);

    return () => {
      window.removeEventListener('user-login', handleLogin);
      window.removeEventListener('user-logout', handleLogout);
      window.removeEventListener('quota-update', handleQuotaUpdate);
    };
  }, []);

  // Loading state
  if (loading) {
    return (
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        padding: '6px 12px',
        background: 'rgba(255,255,255,0.1)',
        backdropFilter: 'blur(10px)',
        borderRadius: '20px',
        border: '1px solid rgba(255,255,255,0.2)',
        height: '36px'
      }}>
        <Spin size="small" style={{ color: 'white' }} />
      </div>
    );
  }

  // Not logged in state
  if (!user || !user.email) {
    return (
      <div 
        onClick={() => {
          // Method 1: Dispatch navigation event (primary)
          window.dispatchEvent(new CustomEvent('navigate-to-login', { detail: { page: 'login' } }));
          
          // Method 2: Directly click the login menu item (backup)
          setTimeout(() => {
            // The login menu is the 5th item (index 4) in the menu
            const loginMenuItem = document.querySelector('.ant-menu-item:nth-child(5)');
            if (loginMenuItem) {
              loginMenuItem.click();
            } else {
              // Alternative: find by text content
              const menuItems = document.querySelectorAll('.ant-menu-item');
              menuItems.forEach(item => {
                if (item.textContent.includes('Login') || item.textContent.includes('Profile')) {
                  item.click();
                }
              });
            }
          }, 100);
        }}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 16px',
          background: 'rgba(255,255,255,0.1)',
          backdropFilter: 'blur(10px)',
          borderRadius: '20px',
          border: '1px solid rgba(255,255,255,0.2)',
          cursor: 'pointer',
          transition: 'all 0.2s ease',
          fontFamily: AlphaShoutTheme.fonts.primary,
          color: 'white'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
        }}
      >
        <UserOutlined style={{ fontSize: '14px', color: 'white' }} />
        <span style={{ fontSize: '13px', fontWeight: '500', color: 'white' }}>Sign In</span>
      </div>
    );
  }

  // Logged in state
  const displayName = user.email.split('@')[0];
  const firstLetter = displayName.charAt(0).toUpperCase();
  const availableQuota = quota?.available_quota ?? 0;
  
  // Dropdown menu
  const menu = (
    <Menu
      style={{ 
        minWidth: '180px',
        fontFamily: AlphaShoutTheme.fonts.primary
      }}
      items={[
        {
          key: 'user',
          label: (
            <div style={{ padding: '4px 0' }}>
              <div style={{ fontSize: '12px', color: AlphaShoutTheme.colors.textTertiary }}>
                Signed in as
              </div>
              <div style={{ fontSize: '13px', fontWeight: '500', color: AlphaShoutTheme.colors.textPrimary }}>
                {user.email}
              </div>
            </div>
          ),
          disabled: true
        },
        { type: 'divider' },
        {
          key: 'quota',
          icon: <ThunderboltOutlined />,
          label: `${availableQuota} tokens available`,
          disabled: true
        },
        {
          key: 'billing',
          icon: <CreditCardOutlined />,
          label: 'Billing',
          onClick: () => window.dispatchEvent(new CustomEvent('navigate-to-payment', { detail: { page: 'payment2' } }))
        },
        {
          key: 'analysis',
          icon: <BarChartOutlined />,
          label: 'Stock Analysis',
          onClick: () => {
            const stockMenuItem = document.querySelector('.ant-menu-item:nth-child(1)');
            if (stockMenuItem) stockMenuItem.click();
          }
        },
        { type: 'divider' },
        {
          key: 'logout',
          icon: <LogoutOutlined />,
          label: 'Sign Out',
          onClick: async () => {
            try {
              const response = await fetch(`${API_URL}/api/auth/logout`, {
                method: 'POST',
                credentials: 'include',
              });
              if (response.ok) {
                window.dispatchEvent(new CustomEvent('user-logout'));
              }
            } catch (error) {
              console.error('Logout failed:', error);
            }
          }
        }
      ]}
    />
  );

  return (
    <Dropdown overlay={menu} trigger={['click']} placement="bottomRight">
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        padding: '6px 12px',
        background: 'rgba(255,255,255,0.1)',
        backdropFilter: 'blur(10px)',
        borderRadius: '20px',
        border: '1px solid rgba(255,255,255,0.2)',
        cursor: 'pointer',
        transition: 'all 0.2s ease',
        fontFamily: AlphaShoutTheme.fonts.primary
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.background = 'rgba(255,255,255,0.15)';
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.3)';
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.2)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.2)';
        e.currentTarget.style.boxShadow = 'none';
      }}>
        <Avatar 
          size={24} 
          style={{ 
            background: 'rgba(255,255,255,0.9)',
            color: AlphaShoutTheme.colors.primary,
            fontSize: '12px',
            fontWeight: '700',
            border: '1px solid rgba(255,255,255,0.3)'
          }}
        >
          {firstLetter}
        </Avatar>
        
        <span style={{ 
          fontSize: '13px',
          fontWeight: '500',
          color: 'white',
          maxWidth: '100px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap'
        }}>
          {displayName}
        </span>
        
        <div style={{
          padding: '2px 8px',
          background: availableQuota > 5 
            ? 'rgba(106, 191, 75, 0.2)' 
            : 'rgba(255, 184, 28, 0.2)',
          borderRadius: '12px',
          fontSize: '11px',
          fontWeight: '600',
          color: availableQuota > 5 
            ? '#7FFF00'  // Bright lime green for good contrast
            : '#FFD700', // Gold for warning
          display: 'flex',
          alignItems: 'center',
          gap: '3px',
          border: `1px solid ${availableQuota > 5 
            ? 'rgba(127, 255, 0, 0.3)' 
            : 'rgba(255, 215, 0, 0.3)'}`
        }}>
          <ThunderboltOutlined style={{ fontSize: '10px' }} />
          {availableQuota}
        </div>
      </div>
    </Dropdown>
  );
};

export default Usersmallbox;