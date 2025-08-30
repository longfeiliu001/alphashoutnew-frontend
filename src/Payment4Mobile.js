// Payment4Mobile.js - Final version with only Solana info, no payment options
import React, { useState, useEffect } from 'react';
import solanaLogo from './logo/Solana_logo.png';

const Payment4Mobile = () => {
 const [user, setUser] = useState(null);
 const [quota, setQuota] = useState(0);
 const [loading, setLoading] = useState(true);
 
 const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

 useEffect(() => {
   checkAuth();
 }, []);

 const checkAuth = async () => {
   try {
     const response = await fetch(`${API_URL}/api/auth/me`, {
       method: 'GET',
       credentials: 'include',
       headers: { 'Content-Type': 'application/json' }
     });
     
     if (response.ok) {
       const data = await response.json();
       setUser(data.user);
       setQuota(data.quota?.available_quota || 0);
     }
   } catch (error) {
     console.error('Auth check failed:', error);
   } finally {
     setLoading(false);
   }
 };

 const navigateToLogin = () => {
   window.dispatchEvent(new CustomEvent('navigate-to-login', { detail: { page: 'login' } }));
 };

 const styles = {
   container: {
     minHeight: '100vh',
     backgroundColor: '#f8f9fa',
     paddingBottom: '80px'
   },
   header: {
     backgroundColor: '#ffffff',
     padding: '16px',
     borderBottom: '1px solid #dee2e6',
     boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
   },
   headerTitle: {
     fontSize: '20px',
     fontWeight: '600',
     color: '#212529',
     margin: 0
   },
   userInfo: {
     display: 'flex',
     justifyContent: 'space-between',
     alignItems: 'center',
     padding: '12px 16px',
     backgroundColor: '#e7f3ff',
     borderBottom: '1px solid #b3d7ff'
   },
   content: {
     padding: '16px'
   },
   card: {
     backgroundColor: 'white',
     borderRadius: '12px',
     padding: '20px',
     marginBottom: '16px',
     boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
   },
   button: {
     width: '100%',
     padding: '14px',
     backgroundColor: '#007bff',
     color: 'white',
     border: 'none',
     borderRadius: '8px',
     fontSize: '16px',
     fontWeight: '600',
     cursor: 'pointer'
   },
   warningBox: {
     backgroundColor: '#fff3cd',
     border: '1px solid #ffc107',
     borderRadius: '8px',
     padding: '16px',
     marginBottom: '16px'
   },
   warningTitle: {
     color: '#856404',
     fontSize: '16px',
     fontWeight: '600',
     marginBottom: '8px',
     display: 'flex',
     alignItems: 'center',
     gap: '8px'
   },
   warningText: {
     color: '#856404',
     fontSize: '14px',
     lineHeight: '1.5'
   },
   instructionStep: {
     display: 'flex',
     alignItems: 'flex-start',
     marginBottom: '16px'
   },
   stepNumber: {
     width: '28px',
     height: '28px',
     backgroundColor: '#007bff',
     color: 'white',
     borderRadius: '50%',
     display: 'flex',
     alignItems: 'center',
     justifyContent: 'center',
     fontSize: '14px',
     fontWeight: 'bold',
     flexShrink: 0,
     marginRight: '12px'
   },
   stepText: {
     fontSize: '15px',
     color: '#495057',
     lineHeight: '1.5',
     paddingTop: '3px'
   },
   authCard: {
     padding: '40px 20px',
     textAlign: 'center'
   },
   authTitle: {
     fontSize: '20px',
     fontWeight: '600',
     marginBottom: '12px'
   },
   authDesc: {
     fontSize: '14px',
     color: '#6c757d',
     marginBottom: '24px'
   }
 };

 if (loading) {
   return (
     <div style={styles.container}>
       <div style={{ padding: '40px', textAlign: 'center' }}>
         <div>Loading...</div>
       </div>
     </div>
   );
 }

 if (!user) {
   return (
     <div style={styles.container}>
       <div style={styles.authCard}>
         <h2 style={styles.authTitle}>Please Login First</h2>
         <p style={styles.authDesc}>You need to log in to make payments</p>
         <button onClick={navigateToLogin} style={styles.button}>
           Go to Login
         </button>
       </div>
     </div>
   );
 }

 return (
   <div style={styles.container}>
     

     <div style={styles.userInfo}>
       <div>
         <div style={{ fontSize: '12px', color: '#6c757d' }}>Logged in as</div>
         <div style={{ fontSize: '14px', fontWeight: '500' }}>{user.email}</div>
       </div>
       <div style={{ textAlign: 'right' }}>
         <div style={{ fontSize: '12px', color: '#6c757d' }}>Balance</div>
         <div style={{ fontSize: '16px', fontWeight: '600', color: '#007bff' }}>
           {quota} tokens
         </div>
       </div>
     </div>

     <div style={styles.content}>
       <div style={styles.warningBox}>
         <div style={styles.warningTitle}>
           <img src={solanaLogo} alt="Solana" style={{ width: '24px', height: '24px' }} />
           Desktop Browser Required
         </div>
         <div style={styles.warningText}>
           Solana wallet payments require desktop browser extensions. 
           Mobile browsers cannot connect to Phantom, Bitget, or Solflare wallets.
         </div>
       </div>

       <div style={styles.card}>
         <h3 style={{ fontSize: '18px', marginBottom: '20px', color: '#212529' }}>
           How to Pay with Solana
         </h3>

         <div style={styles.instructionStep}>
           <span style={styles.stepNumber}>1</span>
           <span style={styles.stepText}>
             Open this website on a desktop computer or laptop
           </span>
         </div>

         <div style={styles.instructionStep}>
           <span style={styles.stepNumber}>2</span>
           <span style={styles.stepText}>
             Install Phantom, Bitget Wallet, or Solflare browser extension
           </span>
         </div>

         <div style={styles.instructionStep}>
           <span style={styles.stepNumber}>3</span>
           <span style={styles.stepText}>
             Connect your wallet and complete the payment
           </span>
         </div>

         <div style={styles.instructionStep}>
           <span style={styles.stepNumber}>4</span>
           <span style={styles.stepText}>
             Tokens will be instantly added to your account
           </span>
         </div>
       </div>

       <div style={styles.card}>
         <p style={{ fontSize: '14px', color: '#6c757d', textAlign: 'center', margin: 0 }}>
           Please use a desktop browser to access all payment options including credit card and Solana wallet payments.
         </p>
       </div>
     </div>
   </div>
 );
};

export default Payment4Mobile;