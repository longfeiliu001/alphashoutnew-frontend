import React, { useState, useEffect } from 'react';
import { createClient } from '@supabase/supabase-js';
import {checkAvailableQuota} from './Supabasemanager'

const supabaseUrl = 'https://pyeiplmxftswzknpldgs.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InB5ZWlwbG14ZnRzd3prbnBsZGdzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTI3ODU3NTQsImV4cCI6MjA2ODM2MTc1NH0.5ulg0h3ZQ-Rd5PMmxN1S4P0ulfZtAg2VjOjJxZpSvBQ';

const supabase = createClient(supabaseUrl, supabaseKey);

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

 export  const checkUserEmail = async () => {
      try {
       
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          return session.user.email;
        } else {
          // Try to restore session from cookies
          const accessToken = getCookie('sb-access-token');
          const refreshToken = getCookie('sb-refresh-token');
          
                            if (accessToken && refreshToken) {
                                const { data: { session: restoredSession } } = await supabase.auth.setSession({
                                access_token: accessToken,
                                refresh_token: refreshToken
                                });
                                
                                                        if (restoredSession) {
                                                        return restoredSession.user.email;
                                                        }else
                                                    {return null;}
                            }else
                            {return null;}
        }
      } catch (error) {
        return null;
      } finally {
        
      }
    };


    export  const checkUserEmailandToken = async () => {
      try {
       
        const { data: { session } } = await supabase.auth.getSession();
        
        if (session) {
          
          const available_token = await checkAvailableQuota(session.user.email);

         return {
        email: session.user.email,
        userId: session.user.id,
        emailConfirmed: session.user.created_at,
        accessToken: session.access_token,
        availableToken: available_token};

        } else {
          // Try to restore session from cookies
          const accessToken = getCookie('sb-access-token');
          const refreshToken = getCookie('sb-refresh-token');
          
                            if (accessToken && refreshToken) {
                                const { data: { session: restoredSession } } = await supabase.auth.setSession({
                                access_token: accessToken,
                                refresh_token: refreshToken
                                });
                                
                                                        if (restoredSession) {
                                                           const available_token = await checkAvailableQuota(session.user.email);

                                                        return {
                                                          email: restoredSession.user.email,
        userId: restoredSession.user.id,
        emailConfirmed: restoredSession.user.created_at,
   
        accessToken: restoredSession.access_token,
        availableToken: available_token

                                                        };
                                                        }else
                                                    {return null;}
                            }else
                            {return null;}
        }
      } catch (error) {
        return null;
      } finally {
        
      }
    };