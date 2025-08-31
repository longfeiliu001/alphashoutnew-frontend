// MobileLogin.js - Professional Mobile Login Component (FIXED)
import React, { useState, useEffect, useRef, useCallback, memo } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth, ApiService } from './Login5';

// Mobile-optimized theme
const MobileTheme = {
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
    googleBlue: '#4285F4',
  },
  fonts: {
    primary: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif",
  }
};

// Mobile Google Sign-In Button Component - Memoized to prevent re-renders
const MobileGoogleButton = memo(({ onSuccess, onError, loading, setLoading }) => {
  const [isGoogleLoading, setIsGoogleLoading] = useState(true);
  const googleButtonRef = useRef(null);
  const mountedRef = useRef(true);

  useEffect(() => {
    mountedRef.current = true;
    
    const initGoogle = async () => {
      if (!mountedRef.current) return;
      setIsGoogleLoading(true);
      
      // Load Google script if not already loaded
      if (!window.google) {
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        document.head.appendChild(script);
        
        await new Promise((resolve, reject) => {
          script.onload = resolve;
          script.onerror = reject;
          setTimeout(() => resolve(), 5000);
        }).catch((err) => {
          console.error('Failed to load Google script:', err);
        });
      }

      // Wait for Google to be ready
      let attempts = 0;
      while (!window.google?.accounts?.id && attempts < 20) {
        if (!mountedRef.current) return;
        await new Promise(resolve => setTimeout(resolve, 100));
        attempts++;
      }

      if (window.google?.accounts?.id && googleButtonRef.current && mountedRef.current) {
        try {
          // Define the credential response handler
          const handleCredentialResponse = async (response) => {
            if (!response || !response.credential) {
              if (typeof onError === 'function') {
                onError(new Error('No credential received from Google'));
              }
              return;
            }

            if (typeof setLoading === 'function') {
              setLoading(true);
            }
            
            try {
              if (typeof onSuccess === 'function') {
                await onSuccess(response.credential);
              }
            } catch (error) {
              if (typeof onError === 'function') {
                onError(error);
              }
            } finally {
              if (typeof setLoading === 'function') {
                setLoading(false);
              }
            }
          };

          window.google.accounts.id.initialize({
            client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
            callback: handleCredentialResponse,
            auto_select: false,
            cancel_on_tap_outside: true,
          });

          if (googleButtonRef.current) {
            googleButtonRef.current.innerHTML = '';
            window.google.accounts.id.renderButton(googleButtonRef.current, {
              theme: "outline",
              size: "large",
              text: "signin_with",
              shape: "rectangular",
              width: "100%",
            });
          }
          
          if (mountedRef.current) setIsGoogleLoading(false);
        } catch (error) {
          console.error('Google button render failed:', error);
          if (mountedRef.current) setIsGoogleLoading(false);
        }
      } else {
        if (mountedRef.current) setIsGoogleLoading(false);
      }
    };

    initGoogle();
    
    return () => {
      mountedRef.current = false;
    };
  }, [onSuccess, onError, setLoading]);

  // Fallback button handler
  const handleFallbackClick = useCallback(() => {
    const params = new URLSearchParams({
      client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
      redirect_uri: window.location.origin,
      response_type: 'code',
      scope: 'openid email profile',
      state: Math.random().toString(36).substring(7)
    });
    window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?${params}`;
  }, []);

  return (
    <div style={{ position: 'relative', width: '100%' }}>
      {isGoogleLoading && (
        <button style={{
          width: '100%',
          padding: '14px',
          border: '1px solid #dadce0',
          borderRadius: '8px',
          fontSize: '16px',
          backgroundColor: '#fff',
          color: '#3c4043',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '8px',
          opacity: 0.6
        }}>
          Loading Google...
        </button>
      )}
      
      <div 
        ref={googleButtonRef} 
        style={{ 
          width: '100%',
          display: isGoogleLoading ? 'none' : 'block'
        }} 
      />
      
      {/* Fallback button if Google fails to load */}
      {!isGoogleLoading && !googleButtonRef.current?.firstChild && (
        <button
          onClick={handleFallbackClick}
          style={{
            width: '100%',
            padding: '14px',
            border: '1px solid #dadce0',
            borderRadius: '8px',
            fontSize: '16px',
            backgroundColor: '#fff',
            color: '#3c4043',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px',
            cursor: 'pointer',
            transition: 'background-color 0.2s'
          }}
          onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#f8f9fa'}
          onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#fff'}
        >
          <svg width="18" height="18" viewBox="0 0 18 18">
            <path d="M17.64 9.205c0-.639-.057-1.252-.164-1.841H9v3.481h4.844a4.14 4.14 0 01-1.796 2.716v2.259h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
            <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332A8.997 8.997 0 009 18z" fill="#34A853"/>
            <path d="M3.964 10.71A5.41 5.41 0 013.682 9c0-.593.102-1.17.282-1.71V4.958H.957A8.996 8.996 0 000 9c0 1.452.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
            <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0A8.997 8.997 0 00.957 4.958L3.964 7.29C4.672 5.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
          </svg>
          Sign in with Google
        </button>
      )}
    </div>
  );
});

// Main Mobile Login Component
const MobileLogin = () => {
  const navigate = useNavigate();
  
  // Get all auth functions from context
  const { 
    user, 
    quota, 
    login, 
    loginWithGoogle, 
    register, 
    logout, 
    refreshQuota 
  } = useAuth();
  
  // All state declarations together
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);
  const [isLoggedOut, setIsLoggedOut] = useState(false);
  
  // Use refs for input elements to maintain focus
  const emailInputRef = useRef(null);
  const passwordInputRef = useRef(null);

  // Listen for logout event from Uservarify
  useEffect(() => {
    const handleUserLogout = () => {
      console.log('MobileLogin: Received logout event');
      setIsLoggedOut(true);
      setMessage('');
      setMessageType('');
      setEmail('');
      setPassword('');
      setIsLogin(true);
      setShowPassword(false);
      setIsForgotPassword(false);
    };
    
    const handleUserLogin = () => {
      console.log('MobileLogin: Received login event');
      setIsLoggedOut(false);
    };
    
    window.addEventListener('user-logout', handleUserLogout);
    window.addEventListener('user-login', handleUserLogin);
    
    return () => {
      window.removeEventListener('user-logout', handleUserLogout);
      window.removeEventListener('user-login', handleUserLogin);
    };
  }, []);

  // Reset isLoggedOut when user changes
  useEffect(() => {
    if (user && user.id && user.email) {
      setIsLoggedOut(false);
    }
  }, [user]);

  // Memoized handlers to prevent re-renders
  const handleEmailChange = useCallback((e) => {
    setEmail(e.target.value);
  }, []);

  const handlePasswordChange = useCallback((e) => {
    setPassword(e.target.value);
  }, []);

  const handleTogglePassword = useCallback(() => {
    setShowPassword(prev => !prev);
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!email || !password) {
      setMessage('Please fill in all fields');
      setMessageType('error');
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      const cleanEmail = email.trim().toLowerCase();
      
      const data = isLogin 
        ? await login(cleanEmail, password)
        : await register(cleanEmail, password);

      setMessage(data.message || (isLogin ? 'Welcome back!' : 'Account created successfully!'));
      setMessageType('success');
      setIsLoggedOut(false);
      setEmail('');
      setPassword('');
      
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (error) {
      if (!isLogin && error.message?.includes('already registered')) {
        setMessage('Email already registered. Switching to login...');
        setMessageType('warning');
        setTimeout(() => {
          setIsLogin(true);
          setMessage('');
        }, 2000);
      } else {
        setMessage(error.message || 'Operation failed');
        setMessageType('error');
      }
    } finally {
      setLoading(false);
    }
  }, [email, password, isLogin, login, register, navigate]);

  const handleGoogleLogin = useCallback(async (credential) => {
    try {
      const data = await loginWithGoogle(credential);
      setMessage('Google login successful!');
      setMessageType('success');
      setIsLoggedOut(false);
      
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (error) {
      console.error('Google login error:', error);
      setMessage(error.message || 'Google login failed');
      setMessageType('error');
    }
  }, [loginWithGoogle, navigate]);

  const handleForgotPassword = useCallback(async () => {
    if (!email) {
      setMessage('Please enter your email');
      setMessageType('error');
      return;
    }

    setLoading(true);
    try {
      const data = await ApiService.forgotPassword(email.trim());
      setMessage('Password reset link sent to your email');
      setMessageType('success');
      
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
  }, [email]);

  const handleLogout = useCallback(async () => {
    setLoading(true);
    setMessage('');
    
    try {
      setIsLoggedOut(true);
      setEmail('');
      setPassword('');
      setIsLogin(true);
      setShowPassword(false);
      setIsForgotPassword(false);
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
      setIsLoggedOut(true);
    } finally {
      setLoading(false);
    }
  }, [logout]);

  const handleGoogleError = useCallback((error) => {
    setMessage(error.message || 'Google login failed');
    setMessageType('error');
  }, []);

  // Check if user is logged in
  const isUserLoggedIn = !isLoggedOut && user && user.id && user.email;

  // Logged in state - Mobile optimized
  if (isUserLoggedIn) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: MobileTheme.colors.surface,
        fontFamily: MobileTheme.fonts.primary,
        paddingBottom: '80px'
      }}>
        {/* Header */}
        <div style={{
          backgroundColor: MobileTheme.colors.primary,
          padding: '20px',
          color: 'white'
        }}>
          <h1 style={{
            fontSize: '24px',
            fontWeight: '600',
            margin: 0
          }}>AlphaShout</h1>
          <p style={{
            fontSize: '14px',
            opacity: 0.9,
            marginTop: '4px'
          }}>Welcome back!</p>
        </div>

        {/* User Info Card */}
        <div style={{
          backgroundColor: 'white',
          margin: '16px',
          borderRadius: '12px',
          padding: '20px',
          boxShadow: '0 2px 8px rgba(0,0,0,0.08)'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            marginBottom: '20px'
          }}>
            <div style={{
              width: '48px',
              height: '48px',
              borderRadius: '50%',
              backgroundColor: MobileTheme.colors.primaryLight,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontSize: '20px',
              fontWeight: '600'
            }}>
              {user.email ? user.email[0].toUpperCase() : 'U'}
            </div>
            <div style={{ marginLeft: '16px', flex: 1 }}>
              <div style={{ fontSize: '16px', fontWeight: '600', color: MobileTheme.colors.textPrimary }}>
                {user.email || 'User'}
              </div>
              <div style={{ fontSize: '13px', color: MobileTheme.colors.textSecondary }}>
                ID: {user.id || 'N/A'}
              </div>
            </div>
          </div>

          {/* Quota Display */}
          <div style={{
            backgroundColor: MobileTheme.colors.surface,
            borderRadius: '8px',
            padding: '16px',
            marginBottom: '16px'
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: '12px'
            }}>
              <span style={{ fontSize: '14px', color: MobileTheme.colors.textSecondary }}>
                Available Tokens
              </span>
              <span style={{ fontSize: '24px', fontWeight: '600', color: MobileTheme.colors.primary }}>
                {quota?.available_quota ?? 0}
              </span>
            </div>
            
            <button
              onClick={() => navigate('/billing')}
              disabled={loading}
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: loading ? MobileTheme.colors.textTertiary : MobileTheme.colors.success,
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px',
                opacity: loading ? 0.5 : 1,
                cursor: loading ? 'not-allowed' : 'pointer'
              }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="12" cy="12" r="10"/>
                <line x1="12" y1="8" x2="12" y2="16"/>
                <line x1="8" y1="12" x2="16" y2="12"/>
              </svg>
              Add Tokens
            </button>
          </div>

          {/* Logout Button */}
          <button
            onClick={handleLogout}
            disabled={loading}
            style={{
              width: '100%',
              padding: '14px',
              backgroundColor: 'transparent',
              color: MobileTheme.colors.error,
              border: `1px solid ${MobileTheme.colors.error}`,
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '500',
              opacity: loading ? 0.5 : 1,
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s'
            }}
          >
            {loading ? 'Signing out...' : 'Sign Out'}
          </button>
        </div>

        {/* Message Display */}
        {message && (
          <div style={{
            margin: '16px',
            padding: '12px',
            borderRadius: '8px',
            backgroundColor: 
              messageType === 'success' ? '#E6F4EA' : 
              messageType === 'warning' ? '#FFF3E0' : '#FCE8E6',
            color: 
              messageType === 'success' ? MobileTheme.colors.success : 
              messageType === 'warning' ? MobileTheme.colors.warning : MobileTheme.colors.error,
            fontSize: '14px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            {messageType === 'success' && (
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <polyline points="20 6 9 17 4 12"/>
              </svg>
            )}
            {message}
          </div>
        )}
      </div>
    );
  }

  // Forgot Password Screen
  if (isForgotPassword) {
    return (
      <div style={{
        minHeight: '100vh',
        backgroundColor: MobileTheme.colors.background,
        fontFamily: MobileTheme.fonts.primary,
        padding: '20px'
      }}>
        <div style={{
          maxWidth: '400px',
          margin: '0 auto',
          paddingTop: '40px'
        }}>
          <h1 style={{
            fontSize: '28px',
            fontWeight: '600',
            color: MobileTheme.colors.primary,
            marginBottom: '8px',
            textAlign: 'center'
          }}>Reset Password</h1>
          
          <p style={{
            fontSize: '14px',
            color: MobileTheme.colors.textSecondary,
            textAlign: 'center',
            marginBottom: '32px'
          }}>
            Enter your email to receive a reset link
          </p>

          <div style={{ marginBottom: '20px' }}>
            <input
              ref={emailInputRef}
              type="email"
              value={email}
              onChange={handleEmailChange}
              placeholder="Email address"
              autoComplete="email"
              style={{
                width: '100%',
                padding: '16px',
                fontSize: '16px',
                border: `1px solid ${MobileTheme.colors.border}`,
                borderRadius: '8px',
                outline: 'none',
                WebkitAppearance: 'none'
              }}
            />
          </div>

          {message && (
            <div style={{
              padding: '12px',
              borderRadius: '8px',
              marginBottom: '16px',
              backgroundColor: messageType === 'success' ? '#E6F4EA' : '#FCE8E6',
              color: messageType === 'success' ? MobileTheme.colors.success : MobileTheme.colors.error
            }}>
              {message}
            </div>
          )}

          <button
            onClick={handleForgotPassword}
            disabled={loading || !email}
            style={{
              width: '100%',
              padding: '16px',
              backgroundColor: MobileTheme.colors.primary,
              color: 'white',
              border: 'none',
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: '500',
              marginBottom: '16px',
              opacity: loading || !email ? 0.5 : 1,
              cursor: loading || !email ? 'not-allowed' : 'pointer'
            }}
          >
            {loading ? 'Sending...' : 'Send Reset Link'}
          </button>

          <button
            onClick={() => {
              setIsForgotPassword(false);
              setMessage('');
            }}
            style={{
              width: '100%',
              padding: '16px',
              backgroundColor: 'transparent',
              color: MobileTheme.colors.primary,
              border: 'none',
              fontSize: '16px',
              cursor: 'pointer'
            }}
          >
            Back to Sign In
          </button>
        </div>
      </div>
    );
  }

  // Login/Register Screen - Mobile optimized
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: MobileTheme.colors.background,
      fontFamily: MobileTheme.fonts.primary,
      display: 'flex',
      flexDirection: 'column'
    }}>
      {/* Header */}
      <div style={{
        backgroundColor: MobileTheme.colors.primary,
        padding: '32px 20px',
        textAlign: 'center',
        color: 'white'
      }}>
        <h1 style={{
          fontSize: '32px',
          fontWeight: '600',
          margin: 0,
          marginBottom: '8px'
        }}>AlphaShout</h1>
        <p style={{
          fontSize: '14px',
          opacity: 0.9
        }}>
          {isLogin ? 'Welcome back' : 'Start with 10 free tokens'}
        </p>
      </div>

      {/* Form Container */}
      <div style={{
        flex: 1,
        padding: '24px 20px',
        backgroundColor: 'white'
      }}>
        {/* Toggle Tabs */}
        <div style={{
          display: 'flex',
          marginBottom: '24px',
          backgroundColor: MobileTheme.colors.surface,
          borderRadius: '8px',
          padding: '4px'
        }}>
          <button
            onClick={() => {
              setIsLogin(true);
              setMessage('');
            }}
            style={{
              flex: 1,
              padding: '12px',
              backgroundColor: isLogin ? 'white' : 'transparent',
              border: 'none',
              borderRadius: '6px',
              fontSize: '16px',
              fontWeight: '500',
              color: isLogin ? MobileTheme.colors.primary : MobileTheme.colors.textSecondary,
              transition: 'all 0.2s',
              cursor: 'pointer'
            }}
          >
            Sign In
          </button>
          <button
            onClick={() => {
              setIsLogin(false);
              setMessage('');
            }}
            style={{
              flex: 1,
              padding: '12px',
              backgroundColor: !isLogin ? 'white' : 'transparent',
              border: 'none',
              borderRadius: '6px',
              fontSize: '16px',
              fontWeight: '500',
              color: !isLogin ? MobileTheme.colors.primary : MobileTheme.colors.textSecondary,
              transition: 'all 0.2s',
              cursor: 'pointer'
            }}
          >
            Register
          </button>
        </div>

        {/* Email Input */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{
            display: 'block',
            fontSize: '14px',
            color: MobileTheme.colors.textSecondary,
            marginBottom: '8px',
            fontWeight: '500'
          }}>
            Email
          </label>
          <input
            ref={emailInputRef}
            type="email"
            value={email}
            onChange={handleEmailChange}
            placeholder="you@example.com"
            autoComplete="email"
            autoCapitalize="none"
            autoCorrect="off"
            spellCheck="false"
            style={{
              width: '100%',
              padding: '14px',
              fontSize: '16px',
              border: `1px solid ${MobileTheme.colors.border}`,
              borderRadius: '8px',
              outline: 'none',
              WebkitAppearance: 'none',
              transition: 'border-color 0.2s'
            }}
            onFocus={(e) => {
              e.target.style.borderColor = MobileTheme.colors.primary;
            }}
            onBlur={(e) => {
              e.target.style.borderColor = MobileTheme.colors.border;
            }}
          />
        </div>

        {/* Password Input */}
        <div style={{ marginBottom: '16px' }}>
          <label style={{
            display: 'block',
            fontSize: '14px',
            color: MobileTheme.colors.textSecondary,
            marginBottom: '8px',
            fontWeight: '500'
          }}>
            Password
          </label>
          <div style={{ position: 'relative' }}>
            <input
              ref={passwordInputRef}
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={handlePasswordChange}
              placeholder="••••••••"
              autoComplete={isLogin ? 'current-password' : 'new-password'}
              style={{
                width: '100%',
                padding: '14px',
                paddingRight: '48px',
                fontSize: '16px',
                border: `1px solid ${MobileTheme.colors.border}`,
                borderRadius: '8px',
                outline: 'none',
                WebkitAppearance: 'none',
                transition: 'border-color 0.2s'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = MobileTheme.colors.primary;
              }}
              onBlur={(e) => {
                e.target.style.borderColor = MobileTheme.colors.border;
              }}
              onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
            />
            <button
              type="button"
              onClick={handleTogglePassword}
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                padding: '8px',
                color: MobileTheme.colors.textTertiary,
                cursor: 'pointer'
              }}
            >
              {showPassword ? (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M17.94 17.94A10.07 10.07 0 0112 20c-7 0-11-8-11-8a18.45 18.45 0 015.06-5.94M9.9 4.24A9.12 9.12 0 0112 4c7 0 11 8 11 8a18.5 18.5 0 01-2.16 3.19m-6.72-1.07a3 3 0 11-4.24-4.24"/>
                  <line x1="1" y1="1" x2="23" y2="23"/>
                </svg>
              ) : (
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
                  <circle cx="12" cy="12" r="3"/>
                </svg>
              )}
            </button>
          </div>
        </div>

        {/* Forgot Password Link */}
        {isLogin && (
          <div style={{ textAlign: 'right', marginBottom: '20px' }}>
            <button
              onClick={() => {
                setIsForgotPassword(true);
                setMessage('');
              }}
              style={{
                background: 'none',
                border: 'none',
                color: MobileTheme.colors.primary,
                fontSize: '14px',
                padding: 0,
                cursor: 'pointer'
              }}
            >
              Forgot password?
            </button>
          </div>
        )}

        {/* Message */}
        {message && (
          <div style={{
            padding: '12px',
            borderRadius: '8px',
            marginBottom: '16px',
            backgroundColor: messageType === 'success' ? '#E6F4EA' : 
                           messageType === 'warning' ? '#FFF3E0' : '#FCE8E6',
            color: messageType === 'success' ? MobileTheme.colors.success : 
                   messageType === 'warning' ? MobileTheme.colors.warning : MobileTheme.colors.error,
            fontSize: '14px'
          }}>
            {message}
          </div>
        )}

        {/* Submit Button */}
        <button
          onClick={handleSubmit}
          disabled={loading || !email || !password}
          style={{
            width: '100%',
            padding: '16px',
            backgroundColor: loading || !email || !password ? 
              MobileTheme.colors.textTertiary : MobileTheme.colors.primary,
            color: 'white',
            border: 'none',
            borderRadius: '8px',
            fontSize: '16px',
            fontWeight: '600',
            marginBottom: '20px',
            opacity: loading || !email || !password ? 0.5 : 1,
            cursor: loading || !email || !password ? 'not-allowed' : 'pointer'
          }}
        >
          {loading ? 'Processing...' : (isLogin ? 'Sign In' : 'Create Account')}
        </button>

        {/* Divider */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          margin: '24px 0',
          gap: '16px'
        }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: MobileTheme.colors.border }}/>
          <span style={{ color: MobileTheme.colors.textTertiary, fontSize: '14px' }}>OR</span>
          <div style={{ flex: 1, height: '1px', backgroundColor: MobileTheme.colors.border }}/>
        </div>

        {/* Google Sign In */}
        <MobileGoogleButton
          onSuccess={handleGoogleLogin}
          onError={handleGoogleError}
          loading={loading}
          setLoading={setLoading}
        />

        {/* Password Requirements for Register */}
        {!isLogin && (
          <div style={{
            marginTop: '20px',
            padding: '12px',
            backgroundColor: '#FFF3E0',
            borderRadius: '8px',
            fontSize: '13px',
            color: MobileTheme.colors.textSecondary
          }}>
            <strong>Password Requirements:</strong>
            <ul style={{ margin: '8px 0 0 20px', padding: 0 }}>
              <li>Minimum 8 characters</li>
              <li>Include numbers and letters</li>
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default MobileLogin;