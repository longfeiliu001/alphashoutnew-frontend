// MobileLogin.js - Professional Mobile Login Component
import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from './Login3';
import { ApiService } from './Login5';

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

// Mobile Google Sign-In Button
const MobileGoogleButton = ({ onSuccess, onError, loading, setLoading }) => {
  const [isGoogleLoading, setIsGoogleLoading] = useState(true);
  const googleButtonRef = useRef(null);

  useEffect(() => {
    const initGoogle = async () => {
      setIsGoogleLoading(true);
      
      if (!window.google) {
        const script = document.createElement('script');
        script.src = 'https://accounts.google.com/gsi/client';
        script.async = true;
        document.head.appendChild(script);
        
        await new Promise((resolve) => {
          script.onload = resolve;
          setTimeout(resolve, 5000);
        });
      }

      // Wait for Google to be ready
      let attempts = 0;
      while (!window.google?.accounts?.id && attempts < 20) {
        await new Promise(resolve => setTimeout(resolve, 100));
        attempts++;
      }

      if (window.google?.accounts?.id && googleButtonRef.current) {
        try {
          window.google.accounts.id.initialize({
            client_id: process.env.REACT_APP_GOOGLE_CLIENT_ID,
            callback: async (response) => {
              setLoading(true);
              try {
                await onSuccess(response.credential);
              } catch (error) {
                onError(error);
              } finally {
                setLoading(false);
              }
            },
            auto_select: false,
            cancel_on_tap_outside: true,
          });

          googleButtonRef.current.innerHTML = '';
          window.google.accounts.id.renderButton(googleButtonRef.current, {
            theme: "outline",
            size: "large",
            text: "signin_with",
            shape: "rectangular",
            width: "100%",
          });
          
          setIsGoogleLoading(false);
        } catch (error) {
          console.error('Google button render failed:', error);
          setIsGoogleLoading(false);
        }
      } else {
        setIsGoogleLoading(false);
      }
    };

    initGoogle();
  }, [onSuccess, onError, setLoading]);

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
    </div>
  );
};

// Main Mobile Login Component
const MobileLogin = () => {
  const { user, quota, login, loginWithGoogle, register, logout } = useAuth();
  const navigate = useNavigate();
  
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isForgotPassword, setIsForgotPassword] = useState(false);

  const handleSubmit = async () => {
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
      
      // Clear form on success
      setEmail('');
      setPassword('');
      
      // Navigate to home after successful login
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
  };

  const handleGoogleLogin = async (credential) => {
    try {
      const data = await loginWithGoogle(credential);
      setMessage('Google login successful!');
      setMessageType('success');
      
      setTimeout(() => {
        navigate('/');
      }, 1500);
    } catch (error) {
      setMessage(error.message || 'Google login failed');
      setMessageType('error');
    }
  };

  const handleForgotPassword = async () => {
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
  };

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout();
      setMessage('Logged out successfully');
      setMessageType('success');
    } catch (error) {
      setMessage('Logout failed');
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  // Logged in state - Mobile optimized
  if (user) {
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
              {user.email[0].toUpperCase()}
            </div>
            <div style={{ marginLeft: '16px', flex: 1 }}>
              <div style={{ fontSize: '16px', fontWeight: '600', color: MobileTheme.colors.textPrimary }}>
                {user.email}
              </div>
              <div style={{ fontSize: '13px', color: MobileTheme.colors.textSecondary }}>
                ID: {user.id}
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
              style={{
                width: '100%',
                padding: '12px',
                backgroundColor: MobileTheme.colors.success,
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '8px'
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
              opacity: loading ? 0.5 : 1
            }}
          >
            {loading ? 'Logging out...' : 'Sign Out'}
          </button>
        </div>

        {message && (
          <div style={{
            margin: '16px',
            padding: '12px',
            borderRadius: '8px',
            backgroundColor: messageType === 'success' ? '#E6F4EA' : '#FCE8E6',
            color: messageType === 'success' ? MobileTheme.colors.success : MobileTheme.colors.error
          }}>
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
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Email address"
              style={{
                width: '100%',
                padding: '16px',
                fontSize: '16px',
                border: `1px solid ${MobileTheme.colors.border}`,
                borderRadius: '8px',
                outline: 'none'
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
              opacity: loading || !email ? 0.5 : 1
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
              fontSize: '16px'
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
              transition: 'all 0.2s'
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
              transition: 'all 0.2s'
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
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="you@example.com"
            autoComplete="email"
            style={{
              width: '100%',
              padding: '14px',
              fontSize: '16px',
              border: `1px solid ${MobileTheme.colors.border}`,
              borderRadius: '8px',
              outline: 'none',
              WebkitAppearance: 'none'
            }}
            onFocus={(e) => e.target.style.borderColor = MobileTheme.colors.primary}
            onBlur={(e) => e.target.style.borderColor = MobileTheme.colors.border}
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
              type={showPassword ? 'text' : 'password'}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
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
                WebkitAppearance: 'none'
              }}
              onFocus={(e) => e.target.style.borderColor = MobileTheme.colors.primary}
              onBlur={(e) => e.target.style.borderColor = MobileTheme.colors.border}
              onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              style={{
                position: 'absolute',
                right: '12px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                padding: '8px',
                color: MobileTheme.colors.textTertiary
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
                padding: 0
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
            opacity: loading || !email || !password ? 0.5 : 1
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
          onError={(error) => {
            setMessage(error.message || 'Google login failed');
            setMessageType('error');
          }}
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