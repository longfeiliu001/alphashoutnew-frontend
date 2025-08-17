import React, { createContext, useContext, useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';

// Initialize Supabase client
const supabaseUrl = 'https://pyeiplmxftswzknpldgs.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB5ZWlwbG14ZnRzd3prbnBsZGdzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3ODU3NTQsImV4cCI6MjA2ODM2MTc1NH0.5ulg0h3ZQ-Rd5PMmxN1S4P0ulfZtAg2VjOjJxZpSvBQ';

const supabase = createClient(supabaseUrl, supabaseKey);

// Create Auth Context
const AuthContext = createContext();

// Custom hook to use auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider');
  }
  return context;
};

// Cookie utility functions
const getCookie = (name) => {
  const nameEQ = name + "=";
  const ca = document.cookie.split(';');
  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];
    while (c.charAt(0) === ' ') c = c.substring(1, c.length);
    if (c.indexOf(nameEQ) === 0) return c.substring(nameEQ.length, c.length);
  }
  return null;
};

const setCookie = (name, value, days = 7) => {
  const expires = new Date();
  expires.setTime(expires.getTime() + (days * 24 * 60 * 60 * 1000));
  document.cookie = `${name}=${value};expires=${expires.toUTCString()};path=/;SameSite=Strict;Secure`;
};

const deleteCookie = (name) => {
  document.cookie = `${name}=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;`;
};

// Auth Provider Component
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [authReady, setAuthReady] = useState(false);

  // Force refresh function
  const refreshAuth = async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      console.log('Refreshing auth, session:', session);
      if (session) {
        setUser(session.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Error refreshing auth:', error);
      setUser(null);
    }
  };

  useEffect(() => {
    let isMounted = true;
    
    const initializeAuth = async () => {
      try {
        console.log('Initializing auth...');
        setLoading(true);
        
        // Check for existing session
        const { data: { session } } = await supabase.auth.getSession();
        console.log('Initial session check:', session);
        
        if (session && isMounted) {
          setUser(session.user);
          setCookie('sb-access-token', session.access_token);
          setCookie('sb-refresh-token', session.refresh_token);
        } else {
          // Try to restore session from cookies
          const accessToken = getCookie('sb-access-token');
          const refreshToken = getCookie('sb-refresh-token');
          
          if (accessToken && refreshToken) {
            console.log('Attempting to restore session from cookies');
            try {
              const { data: { session: restoredSession } } = await supabase.auth.setSession({
                access_token: accessToken,
                refresh_token: refreshToken
              });
              
              if (restoredSession && isMounted) {
                console.log('Session restored successfully');
                setUser(restoredSession.user);
              } else if (isMounted) {
                console.log('Failed to restore session, clearing cookies');
                deleteCookie('sb-access-token');
                deleteCookie('sb-refresh-token');
                setUser(null);
              }
            } catch (restoreError) {
              console.error('Error restoring session:', restoreError);
              if (isMounted) {
                deleteCookie('sb-access-token');
                deleteCookie('sb-refresh-token');
                setUser(null);
              }
            }
          } else if (isMounted) {
            setUser(null);
          }
        }
      } catch (error) {
        console.error('Auth initialization error:', error);
        if (isMounted) {
          setUser(null);
        }
      } finally {
        if (isMounted) {
          setLoading(false);
          setAuthReady(true);
        }
      }
    };

    initializeAuth();

    // Listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('AuthContext - Auth state changed:', event, session);
      
      if (!isMounted) return;

      if (event === 'SIGNED_IN' && session) {
        console.log('AuthContext - User signed in:', session.user);
        setUser(session.user);
        setCookie('sb-access-token', session.access_token);
        setCookie('sb-refresh-token', session.refresh_token);
      } else if (event === 'SIGNED_OUT') {
        console.log('AuthContext - User signed out');
        setUser(null);
        deleteCookie('sb-access-token');
        deleteCookie('sb-refresh-token');
      } else if (event === 'TOKEN_REFRESHED' && session) {
        console.log('AuthContext - Token refreshed');
        setUser(session.user);
        setCookie('sb-access-token', session.access_token);
        setCookie('sb-refresh-token', session.refresh_token);
      } else if (event === 'USER_UPDATED' && session) {
        console.log('AuthContext - User updated');
        setUser(session.user);
      }
      
      setLoading(false);
      setAuthReady(true);
    });

    // Listen for custom auth change events from Login component
    const handleCustomAuthChange = (event) => {
      console.log('AuthContext - Custom auth change event received:', event.detail);
      // Force refresh auth state
      setTimeout(refreshAuth, 50);
    };

    window.addEventListener('auth-change', handleCustomAuthChange);

    return () => {
      isMounted = false;
      subscription.unsubscribe();
      window.removeEventListener('auth-change', handleCustomAuthChange);
    };
  }, []);

  const value = {
    user,
    loading,
    authReady,
    refreshAuth,
    supabase // Provide supabase instance
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};