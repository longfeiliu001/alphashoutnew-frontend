// ResetPasswordPage.js
import React, { useState, useEffect } from 'react';

import { createClient } from '@supabase/supabase-js';

const ResetPasswordPage = () => {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [isValidToken, setIsValidToken] = useState(false);
  const [checkingToken, setCheckingToken] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStrength, setPasswordStrength] = useState(0);

  const [supabase, setSupabase] = useState(null);
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
  // 初始化 Supabase client
  useEffect(() => {
    const supabaseUrl = process.env.REACT_APP_SUPABASE_URL || 'https://pyeiplmxftswzknpldgs.supabase.co';
    const supabaseAnonKey = process.env.REACT_APP_SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB5ZWlwbG14ZnRzd3prbnBsZGdzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3ODU3NTQsImV4cCI6MjA2ODM2MTc1NH0.5ulg0h3ZQ-Rd5PMmxN1S4P0ulfZtAg2VjOjJxZpSvBQ';
    
    const supabaseClient = createClient(supabaseUrl, supabaseAnonKey);
    setSupabase(supabaseClient);
  }, []);

  useEffect(() => {
    if (!supabase) return;

    // 調試信息
    console.log('Current URL:', window.location.href);
    console.log('Hash:', window.location.hash);
    console.log('Search:', window.location.search);
    
    // Supabase 會自動處理 URL 中的 token
    const checkSession = async () => {
      try {
        // 首先嘗試從 URL 獲取 session
        const { data: { session }, error } = await supabase.auth.getSession();
        
        console.log('Session check:', { 
          hasSession: !!session, 
          error,
          sessionType: session?.user?.recovery_sent_at ? 'recovery' : 'normal'
        });

        if (session && session.access_token) {
          console.log('Valid session found!');
          setIsValidToken(true);
          
          // 保存 token 以便使用
          window.resetPasswordToken = session.access_token;
          window.resetPasswordRefreshToken = session.refresh_token;
          
          // 設置 cookies
          const cookieOptions = 'path=/; max-age=3600; SameSite=Lax';
          document.cookie = `access_token=${session.access_token}; ${cookieOptions}`;
          if (session.refresh_token) {
            document.cookie = `refresh_token=${session.refresh_token}; ${cookieOptions}`;
          }
        } else {
          // 如果沒有 session，檢查 URL hash
          const hashParams = new URLSearchParams(window.location.hash.substring(1));
          const accessToken = hashParams.get('access_token');
          const type = hashParams.get('type');
          
          console.log('Checking hash params:', { hasToken: !!accessToken, type });
          
          if (accessToken && type === 'recovery') {
            // 手動設置 session
            const { error: setSessionError } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: hashParams.get('refresh_token') || accessToken
            });
            
            if (!setSessionError) {
              console.log('Session set from URL params');
              setIsValidToken(true);
              window.resetPasswordToken = accessToken;
              
              // 設置 cookies
              const cookieOptions = 'path=/; max-age=3600; SameSite=Lax';
              document.cookie = `access_token=${accessToken}; ${cookieOptions}`;
            } else {
              console.error('Failed to set session:', setSessionError);
              setMessage('Invalid or expired reset link. Please request a new one.');
              setMessageType('error');
            }
          } else {
            console.log('No valid recovery token found');
            setMessage('Invalid or expired reset link. Please request a new one.');
            setMessageType('error');
          }
        }
      } catch (error) {
        console.error('Session check error:', error);
        setMessage('Error validating reset link. Please try again.');
        setMessageType('error');
      } finally {
        setCheckingToken(false);
      }
    };

    // 等待 Supabase 處理 URL
    setTimeout(checkSession, 100);
    
    // 監聽認證狀態變化
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      console.log('Auth state change:', event, { hasSession: !!session });
      
      if (event === 'PASSWORD_RECOVERY' && session) {
        console.log('Password recovery session detected');
        setIsValidToken(true);
        window.resetPasswordToken = session.access_token;
      }
    });

    return () => {
      authListener?.subscription?.unsubscribe();
    };
  }, [supabase]);

  // 密碼強度檢查
  const checkPasswordStrength = (password) => {
    let strength = 0;
    if (password.length >= 8) strength++;
    if (password.length >= 12) strength++;
    if (/[a-z]/.test(password) && /[A-Z]/.test(password)) strength++;
    if (/[0-9]/.test(password)) strength++;
    if (/[^a-zA-Z0-9]/.test(password)) strength++;
    setPasswordStrength(strength);
  };

  const handlePasswordChange = (e) => {
    const pwd = e.target.value;
    setNewPassword(pwd);
    checkPasswordStrength(pwd);
  };

  const getPasswordStrengthColor = () => {
    if (passwordStrength <= 1) return '#E31E24';
    if (passwordStrength <= 2) return '#FFB81C';
    if (passwordStrength <= 3) return '#0089CC';
    return '#6ABF4B';
  };

  const getPasswordStrengthText = () => {
    if (passwordStrength <= 1) return 'Weak';
    if (passwordStrength <= 2) return 'Fair';
    if (passwordStrength <= 3) return 'Good';
    return 'Strong';
  };

  const validatePassword = () => {
    if (!newPassword || !confirmPassword) {
      setMessage('Please fill in all fields');
      setMessageType('error');
      return false;
    }

    if (newPassword !== confirmPassword) {
      setMessage('Passwords do not match');
      setMessageType('error');
      return false;
    }

    if (newPassword.length < 8) {
      setMessage('Password must be at least 8 characters long');
      setMessageType('error');
      return false;
    }

    // 建議但不強制的密碼要求
    if (!/[a-zA-Z]/.test(newPassword) || !/[0-9]/.test(newPassword)) {
      setMessage('Password should contain both letters and numbers');
      setMessageType('warning');
      // 不返回 false，只是警告
    }

    return true;
  };

  const handleResetPassword = async () => {
    if (!validatePassword()) {
      return;
    }

    setLoading(true);
    setMessage('');

    try {
      if (!supabase) {
        throw new Error('Supabase client not initialized');
      }

      // 使用 Supabase 直接更新密碼
      const { error: updateError } = await supabase.auth.updateUser({
        password: newPassword
      });

      if (updateError) {
        console.error('Update password error:', updateError);
        throw updateError;
      }

      setMessage('✅ Password reset successfully! Redirecting to login...');
      setMessageType('success');
      
      // 登出並清除 session
      await supabase.auth.signOut();
      
      // 清除 cookies
      document.cookie = 'access_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      document.cookie = 'refresh_token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
      
      // 3秒後跳轉到登入頁面
      setTimeout(() => {
        window.location.href = '/';
        const event = new CustomEvent('navigate-to-login', { detail: { page: 'login' } });
        window.dispatchEvent(event);
      }, 3000);
      
    } catch (error) {
      console.error('Reset password error:', error);
      
      let errorMessage = error.message || 'Failed to reset password. Please try again.';
      
      // 提供更友好的錯誤信息
      if (errorMessage.includes('expired') || errorMessage.includes('Invalid')) {
        errorMessage = 'Your reset link has expired. Please request a new password reset.';
      } else if (errorMessage.includes('not authenticated')) {
        errorMessage = 'Authentication session not found. Please request a new password reset link.';
      }
      
      setMessage(errorMessage);
      setMessageType('error');
    } finally {
      setLoading(false);
    }
  };

  // 正在檢查 token
  if (checkingToken) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: AlphaShoutTheme.colors.surface,
        fontFamily: AlphaShoutTheme.fonts.primary
      }}>
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: '40px',
            height: '40px',
            border: `3px solid ${AlphaShoutTheme.colors.border}`,
            borderTopColor: AlphaShoutTheme.colors.primary,
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 16px'
          }}></div>
          <p style={{ color: AlphaShoutTheme.colors.textSecondary }}>Verifying reset link...</p>
        </div>

        <style jsx>{`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}</style>
      </div>
    );
  }

  // Token 無效
  if (!isValidToken) {
    return (
      <div style={{
        minHeight: '100vh',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: AlphaShoutTheme.colors.surface,
        fontFamily: AlphaShoutTheme.fonts.primary,
        padding: '48px 16px'
      }}>
        <div style={{
          maxWidth: '440px',
          width: '100%',
          textAlign: 'center'
        }}>
          <div style={{
            backgroundColor: AlphaShoutTheme.colors.background,
            padding: '40px',
            boxShadow: AlphaShoutTheme.shadows.large,
            borderRadius: '8px',
            border: `1px solid ${AlphaShoutTheme.colors.borderLight}`
          }}>
            <svg
              width="64"
              height="64"
              viewBox="0 0 24 24"
              fill="none"
              stroke={AlphaShoutTheme.colors.error}
              strokeWidth="2"
              style={{ margin: '0 auto 24px' }}
            >
              <circle cx="12" cy="12" r="10"></circle>
              <line x1="15" y1="9" x2="9" y2="15"></line>
              <line x1="9" y1="9" x2="15" y2="15"></line>
            </svg>
            
            <h2 style={{
              fontSize: '24px',
              fontWeight: '500',
              color: AlphaShoutTheme.colors.textPrimary,
              marginBottom: '16px'
            }}>
              Invalid Reset Link
            </h2>
            
            <p style={{
              color: AlphaShoutTheme.colors.textSecondary,
              marginBottom: '24px',
              lineHeight: '1.5'
            }}>
              {message || 'This password reset link is invalid or has expired.'}
            </p>

            <p style={{
              color: AlphaShoutTheme.colors.textTertiary,
              marginBottom: '24px',
              fontSize: '14px'
            }}>
              Password reset links expire after 1 hour for security reasons.
            </p>
            
            <button
              onClick={() => {
                window.location.href = '/';
                const event = new CustomEvent('navigate-to-login', { detail: { page: 'login' } });
                window.dispatchEvent(event);
              }}
              style={{
                padding: '12px 24px',
                backgroundColor: AlphaShoutTheme.colors.primary,
                color: AlphaShoutTheme.colors.background,
                borderRadius: '4px',
                border: 'none',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                letterSpacing: '0.5px',
                transition: 'background-color 0.2s'
              }}
              onMouseOver={(e) => e.target.style.backgroundColor = AlphaShoutTheme.colors.primaryDark}
              onMouseOut={(e) => e.target.style.backgroundColor = AlphaShoutTheme.colors.primary}
            >
              Back to Login
            </button>
          </div>
        </div>
      </div>
    );
  }

  // 重置密碼表單
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
            Set New Password
          </h2>
          <p style={{
            fontSize: '14px',
            color: AlphaShoutTheme.colors.textSecondary,
            letterSpacing: '0.2px'
          }}>
            Please enter your new password below
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
              <label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: '500',
                color: AlphaShoutTheme.colors.textPrimary,
                marginBottom: '8px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                New Password
              </label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={newPassword}
                  onChange={handlePasswordChange}
                  style={{
                    appearance: 'none',
                    display: 'block',
                    width: '100%',
                    padding: '10px 40px 10px 12px',
                    border: `1px solid ${AlphaShoutTheme.colors.border}`,
                    borderRadius: '4px',
                    fontSize: '14px',
                    outline: 'none',
                    backgroundColor: AlphaShoutTheme.colors.background,
                    color: AlphaShoutTheme.colors.textPrimary,
                    transition: 'border-color 0.2s',
                    fontFamily: AlphaShoutTheme.fonts.primary
                  }}
                  placeholder="Enter new password"
                  disabled={loading}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '10px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'none',
                    border: 'none',
                    cursor: 'pointer',
                    padding: '4px',
                    color: AlphaShoutTheme.colors.textTertiary
                  }}
                >
                  {showPassword ? '👁️' : '👁️‍🗨️'}
                </button>
              </div>
              
              {newPassword && (
                <div style={{ marginTop: '8px' }}>
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    marginBottom: '4px'
                  }}>
                    <div style={{
                      flex: 1,
                      height: '4px',
                      backgroundColor: AlphaShoutTheme.colors.borderLight,
                      borderRadius: '2px',
                      overflow: 'hidden'
                    }}>
                      <div style={{
                        width: `${(passwordStrength / 5) * 100}%`,
                        height: '100%',
                        backgroundColor: getPasswordStrengthColor(),
                        transition: 'width 0.3s, background-color 0.3s'
                      }}></div>
                    </div>
                    <span style={{
                      fontSize: '12px',
                      color: getPasswordStrengthColor(),
                      fontWeight: '500'
                    }}>
                      {getPasswordStrengthText()}
                    </span>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label style={{
                display: 'block',
                fontSize: '13px',
                fontWeight: '500',
                color: AlphaShoutTheme.colors.textPrimary,
                marginBottom: '8px',
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                Confirm Password
              </label>
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && handleResetPassword()}
                style={{
                  appearance: 'none',
                  display: 'block',
                  width: '100%',
                  padding: '10px 12px',
                  border: `1px solid ${
                    confirmPassword && newPassword !== confirmPassword 
                      ? AlphaShoutTheme.colors.error 
                      : AlphaShoutTheme.colors.border
                  }`,
                  borderRadius: '4px',
                  fontSize: '14px',
                  outline: 'none',
                  backgroundColor: AlphaShoutTheme.colors.background,
                  color: AlphaShoutTheme.colors.textPrimary,
                  transition: 'border-color 0.2s',
                  fontFamily: AlphaShoutTheme.fonts.primary
                }}
                placeholder="Confirm new password"
                disabled={loading}
              />
              {confirmPassword && newPassword !== confirmPassword && (
                <p style={{
                  marginTop: '4px',
                  fontSize: '12px',
                  color: AlphaShoutTheme.colors.error,
                  margin: '4px 0 0 0'
                }}>
                  Passwords do not match
                </p>
              )}
            </div>

            <div style={{
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
                <li>Should include numbers and letters</li>
                <li>Special characters recommended for better security</li>
              </ul>
            </div>

            {message && (
              <div style={{
                borderRadius: '4px',
                padding: '12px',
                backgroundColor: 
                  messageType === 'success' ? '#E6F4EA' : 
                  messageType === 'warning' ? '#FFF3E0' : 
                  '#FCE8E6',
                color: 
                  messageType === 'success' ? AlphaShoutTheme.colors.success : 
                  messageType === 'warning' ? AlphaShoutTheme.colors.warning : 
                  AlphaShoutTheme.colors.error,
                border: `1px solid ${
                  messageType === 'success' ? AlphaShoutTheme.colors.success : 
                  messageType === 'warning' ? AlphaShoutTheme.colors.warning : 
                  AlphaShoutTheme.colors.error
                }`
              }}>
                <p style={{ fontSize: '14px', margin: 0 }}>{message}</p>
              </div>
            )}

            <button
              onClick={handleResetPassword}
              disabled={loading || !newPassword || !confirmPassword}
              style={{
                width: '100%',
                padding: '12px 16px',
                border: 'none',
                borderRadius: '4px',
                fontSize: '14px',
                fontWeight: '500',
                color: AlphaShoutTheme.colors.background,
                backgroundColor: loading || !newPassword || !confirmPassword ? 
                  AlphaShoutTheme.colors.textTertiary : 
                  AlphaShoutTheme.colors.primary,
                cursor: loading || !newPassword || !confirmPassword ? 'not-allowed' : 'pointer',
                opacity: loading || !newPassword || !confirmPassword ? 0.5 : 1,
                transition: 'background-color 0.2s',
                letterSpacing: '0.5px',
                textTransform: 'uppercase'
              }}
              onMouseOver={(e) => !(loading || !newPassword || !confirmPassword) && 
                (e.target.style.backgroundColor = AlphaShoutTheme.colors.primaryDark)}
              onMouseOut={(e) => !(loading || !newPassword || !confirmPassword) && 
                (e.target.style.backgroundColor = AlphaShoutTheme.colors.primary)}
            >
              {loading ? (
                <span style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <svg 
                    style={{
                      animation: 'spin 1s linear infinite',
                      marginRight: '8px',
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
                  Resetting...
                </span>
              ) : (
                'Reset Password'
              )}
            </button>

            <div style={{ 
              textAlign: 'center',
              paddingTop: '8px',
              borderTop: `1px solid ${AlphaShoutTheme.colors.borderLight}`
            }}>
              <p style={{
                fontSize: '13px',
                color: AlphaShoutTheme.colors.textTertiary,
                margin: 0
              }}>
                Remember your password?{' '}
                <a
                  href="#"
                  onClick={(e) => {
                    e.preventDefault();
                    window.location.href = '/';
                    const event = new CustomEvent('navigate-to-login', { detail: { page: 'login' } });
                    window.dispatchEvent(event);
                  }}
                  style={{
                    color: AlphaShoutTheme.colors.primary,
                    textDecoration: 'underline',
                    cursor: 'pointer'
                  }}
                  onMouseOver={(e) => e.target.style.color = AlphaShoutTheme.colors.primaryDark}
                  onMouseOut={(e) => e.target.style.color = AlphaShoutTheme.colors.primary}
                >
                  Back to login
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
};

export default ResetPasswordPage;