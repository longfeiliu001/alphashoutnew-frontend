// Payment.js - Professional Enterprise Style (保持原有业务逻辑完全不变)
import React, { useState, useEffect } from 'react';

const Payment = () => {
  // 用户状态
  const [user, setUser] = useState(null);
  const [quota, setQuota] = useState(0);
  const [loading, setLoading] = useState(true);
  
  // 支付状态
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [processing, setProcessing] = useState(false);
  
  // 汇率配置
  const [exchangeRates, setExchangeRates] = useState({
    SOL: 1500
  });
  const [minimumAmounts, setMinimumAmounts] = useState({
    SOL: 0.1
  });
  const [defaultSolanaAddress, setDefaultSolanaAddress] = useState('');
  
  // Solana 相关
  const [solanaWallet, setSolanaWallet] = useState(null);
  const [solAmount, setSolAmount] = useState('0.1');

  // 配置
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

  // ==================== Navigation Functions ====================
 const navigateToLogin = () => {
  console.log('Navigating to login...');
  window.dispatchEvent(new CustomEvent('navigate-to-login', { detail: { page: 'login' } }));
};
  // ==================== Initialization ====================
  useEffect(() => {
    checkAuth();
    fetchExchangeRates();
  }, []);

  // Fetch exchange rate configuration
  const fetchExchangeRates = async () => {
    try {
      const response = await fetch(`${API_URL}/api/exchange-rates`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          if (data.rates) {
            setExchangeRates(data.rates);
          }
          if (data.minimums) {
            setMinimumAmounts(data.minimums);
          }
          if (data.solanaAddress) {
            setDefaultSolanaAddress(data.solanaAddress);
          }
        }
      }
    } catch (error) {
      console.error('Failed to fetch exchange rate configuration:', error);
    }
  };

  // Check user authentication
  const checkAuth = async () => {
    try {
      const response = await fetch(`${API_URL}/api/auth/me`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setQuota(data.quota?.available_quota || 0);
      } else if (response.status === 401) {
        const refreshResponse = await fetch(`${API_URL}/api/auth/refresh`, {
          method: 'POST',
          credentials: 'include',
        });
        
        if (refreshResponse.ok) {
          checkAuth();
        }
      }
    } catch (error) {
      console.error('Auth check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  // ==================== Solana Payment Processing (Keep Original Logic) ====================
  const connectPhantomWallet = async () => {
    if (!window.phantom?.solana) {
      setMessage('Please install Phantom wallet extension first');
      setMessageType('error');
      window.open('https://phantom.app/', '_blank');
      return;
    }

    try {
      const response = await window.phantom.solana.connect();
      setSolanaWallet(window.phantom.solana);
      setMessage('Wallet connected successfully!');
      setMessageType('success');
    } catch (error) {
      setMessage('Wallet connection failed: ' + error.message);
      setMessageType('error');
    }
  };

  const handleSolanaPayment = async () => {
    if (!solanaWallet) {
      setMessage('Please connect your wallet first');
      setMessageType('error');
      return;
    }

    if (!defaultSolanaAddress) {
      setMessage('⚠ System has not configured receiving address, please contact administrator');
      setMessageType('error');
      return;
    }

    const solAmountNum = parseFloat(solAmount);
    if (!solAmountNum || solAmountNum < minimumAmounts.SOL) {
      setMessage(`Minimum payment amount is ${minimumAmounts.SOL} SOL`);
      setMessageType('error');
      return;
    }

    setProcessing(true);
    setMessage('Creating transaction...');
    setMessageType('info');

    try {
      const solanaWeb3 = await import('@solana/web3.js');
      const { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } = solanaWeb3;
      
      const connection = new Connection(
        'https://api.devnet.solana.com',
        'confirmed'
      );
      
      const transaction = new Transaction();
      
      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = new PublicKey(solanaWallet.publicKey.toString());
      
      transaction.add(
        SystemProgram.transfer({
          fromPubkey: new PublicKey(solanaWallet.publicKey.toString()),
          toPubkey: new PublicKey(defaultSolanaAddress),
          lamports: Math.floor(solAmountNum * LAMPORTS_PER_SOL),
        })
      );
      
      setMessage('Please confirm the transaction in your wallet...');
      setMessageType('info');
      
      const { signature } = await solanaWallet.signAndSendTransaction(transaction);
      
      if (!signature) {
        throw new Error('Transaction signing failed');
      }
      
      setMessage('Transaction sent, waiting for confirmation...');
      setMessageType('info');
      
      const confirmation = await connection.confirmTransaction(signature, 'confirmed');
      
      if (confirmation.value.err) {
        throw new Error('Transaction confirmation failed');
      }
      
      setMessage('Transaction confirmed, updating quota...');
      setMessageType('info');
      
      const response = await fetch(`${API_URL}/api/solana/confirm-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          signature: signature,
          amount: solAmountNum,
          fromPublicKey: solanaWallet.publicKey.toString(),
        }),
      });

      const result = await response.json();

      if (result.success && result.payment) {
        const { payment } = result;
        setMessage(
          `✅ Payment successful!\n` +
          `Payment amount: ${payment.amount} ${payment.currency}\n` +
          `Tokens added: ${payment.tokensAdded} tokens\n` +
          `Exchange rate: 1 ${payment.currency} = ${payment.ratio} tokens\n` +
          `Current balance: ${payment.newQuota} tokens\n` +
          `Transaction ID: ${payment.transactionId}`
        );
        setMessageType('success');
        setQuota(payment.newQuota);
        setSolAmount('0.1');
        
      } else if (result.error === 'INVALID_RECIPIENT') {
        setMessage(`⚠ Payment verification failed, please contact customer service`);
        setMessageType('error');
      } else if (result.error === 'This transaction has already been processed') {
        setMessage('⚠️ This transaction has already been processed, please do not submit again');
        setMessageType('error');
      } else {
        setMessage(`⚠ ${result.error || 'Payment confirmation failed'}`);
        setMessageType('error');
      }
    } catch (error) {
      console.error('Solana payment error:', error);
      
      if (error.message?.includes('User rejected')) {
        setMessage('You have cancelled the transaction');
        setMessageType('');
      } else if (error.message?.includes('insufficient')) {
        setMessage('⚠ Insufficient balance, please ensure your wallet has enough SOL');
        setMessageType('error');
      } else if (error.message?.includes('@solana/web3.js')) {
        setMessage('⚠ Unable to load Solana library, please refresh the page and try again');
        setMessageType('error');
      } else {
        setMessage(`⚠ ${error.message || 'Payment processing failed'}`);
        setMessageType('error');
      }
    } finally {
      setProcessing(false);
    }
  };

  // ==================== Rendering ====================
  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingContainer}>
          <div style={styles.loadingSpinner}></div>
          <div style={styles.loadingText}>Loading...</div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={styles.container}>
        <div style={styles.authContainer}>
          <div style={styles.authCard}>
            <h2 style={styles.authTitle}>Please Login First</h2>
            <p style={styles.authDescription}>
              You need to log in to your account to make a payment
            </p>
            <button 
              onClick={navigateToLogin}
              style={styles.authButton}
            >
              Go to Login Page
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <div style={styles.headerContent}>
          <h1 style={styles.title}>Payment Center</h1>
          <div style={styles.breadcrumb}>
            <span style={styles.breadcrumbItem}>Home</span>
            <span style={styles.breadcrumbSeparator}>/</span>
            <span style={styles.breadcrumbCurrent}>Payment</span>
          </div>
        </div>
        <div style={styles.userSection}>
          <div style={styles.userInfo}>
            <div style={styles.userLabel}>Logged in as</div>
            <div style={styles.userEmail}>{user.email}</div>
          </div>
          <div style={styles.balanceInfo}>
            <div style={styles.balanceLabel}>Available Balance</div>
            <div style={styles.balanceValue}>{quota.toLocaleString()} tokens</div>
          </div>
        </div>
      </header>

      <main style={styles.main}>
        {message && (
          <div style={{
            ...styles.alert,
            ...(messageType === 'success' ? styles.alertSuccess :
                messageType === 'error' ? styles.alertError :
                messageType === 'info' ? styles.alertInfo : {})
          }}>
            <div style={styles.alertIcon}>
              {messageType === 'success' && '✓'}
              {messageType === 'error' && '⚠'}
              {messageType === 'info' && 'ℹ'}
            </div>
            <div style={styles.alertContent}>
              <div style={styles.alertMessage}>{message}</div>
            </div>
          </div>
        )}

        <div style={styles.paymentSection}>
          <div style={styles.sectionHeader}>
            <h2 style={styles.sectionTitle}>Solana Payment</h2>
            <div style={styles.exchangeRate}>
              Exchange Rate: 1 SOL = {exchangeRates.SOL.toLocaleString()} tokens
            </div>
          </div>

          <div style={styles.paymentCard}>
            {!solanaWallet ? (
              <div style={styles.walletSection}>
                <div style={styles.walletHeader}>
                  <h3 style={styles.walletTitle}>Connect Wallet</h3>
                  <p style={styles.walletDescription}>
                    Connect your Phantom wallet to proceed with payment
                  </p>
                </div>
                <button
                  onClick={connectPhantomWallet}
                  style={styles.connectButton}
                  disabled={processing}
                >
                  Connect Phantom Wallet
                </button>
              </div>
            ) : (
              <div style={styles.paymentForm}>
                <div style={styles.walletConnected}>
                  <div style={styles.connectedInfo}>
                    <div style={styles.connectedStatus}>
                      <span style={styles.statusIndicator}>●</span>
                      <span style={styles.statusText}>Wallet Connected</span>
                    </div>
                    <div style={styles.walletAddress}>
                      {solanaWallet.publicKey.toString().slice(0, 8)}...{solanaWallet.publicKey.toString().slice(-8)}
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      solanaWallet.disconnect();
                      setSolanaWallet(null);
                    }}
                    style={styles.disconnectButton}
                  >
                    Disconnect
                  </button>
                </div>

                <div style={styles.formSection}>
                  <div style={styles.formRow}>
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Recipient Address</label>
                      {defaultSolanaAddress ? (
                        <div style={styles.addressField}>
                          <input
                            type="text"
                            value={defaultSolanaAddress}
                            readOnly
                            style={styles.addressInput}
                          />
                          <button
                            onClick={() => {
                              navigator.clipboard.writeText(defaultSolanaAddress);
                              setMessage('✅ Address copied to clipboard');
                              setMessageType('success');
                              setTimeout(() => {
                                if (messageType === 'success' && message.includes('copied')) {
                                  setMessage('');
                                }
                              }, 3000);
                            }}
                            style={styles.copyButton}
                            type="button"
                          >
                            Copy
                          </button>
                        </div>
                      ) : (
                        <div style={styles.errorField}>
                          ⚠️ No receiving address configured, please contact administrator
                        </div>
                      )}
                      <div style={styles.fieldNote}>
                        Please ensure you transfer to this official address, transfers to other addresses will not be confirmed
                      </div>
                    </div>
                  </div>

                  <div style={styles.formRow}>
                    <div style={styles.formGroup}>
                      <label style={styles.label}>Payment Amount</label>
                      <div style={styles.inputGroup}>
                        <input
                          type="number"
                          value={solAmount}
                          onChange={(e) => setSolAmount(e.target.value)}
                          style={styles.input}
                          min={minimumAmounts.SOL}
                          step="0.01"
                          placeholder={`Minimum ${minimumAmounts.SOL}`}
                          disabled={processing}
                        />
                        <span style={styles.inputSuffix}>SOL</span>
                      </div>
                      <div style={styles.fieldNote}>
                        Minimum payment amount: {minimumAmounts.SOL} SOL
                      </div>
                    </div>
                  </div>

                  <div style={styles.summarySection}>
                    <div style={styles.summaryTitle}>Transaction Summary</div>
                    <div style={styles.summaryRow}>
                      <span style={styles.summaryLabel}>Amount to pay:</span>
                      <span style={styles.summaryValue}>{parseFloat(solAmount || 0).toFixed(4)} SOL</span>
                    </div>
                    <div style={styles.summaryRow}>
                      <span style={styles.summaryLabel}>Tokens to receive:</span>
                      <span style={styles.summaryValueHighlight}>
                        {Math.round(parseFloat(solAmount || 0) * exchangeRates.SOL).toLocaleString()} tokens
                      </span>
                    </div>
                  </div>

                  <button
                    onClick={handleSolanaPayment}
                    disabled={processing || !solAmount || parseFloat(solAmount) < minimumAmounts.SOL}
                    style={{
                      ...styles.payButton,
                      ...(processing || !solAmount || parseFloat(solAmount) < minimumAmounts.SOL ? styles.payButtonDisabled : {})
                    }}
                  >
                    {processing ? (
                      <>
                        <div style={styles.buttonSpinner}></div>
                        Processing Payment...
                      </>
                    ) : (
                      `Pay ${parseFloat(solAmount || 0).toFixed(4)} SOL`
                    )}
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        <div style={styles.infoSection}>
          <div style={styles.infoCard}>
            <h3 style={styles.infoTitle}>Payment Process</h3>
            <ol style={styles.processList}>
              <li>Connect your Phantom wallet to the platform</li>
              <li>Enter the desired SOL amount to purchase tokens</li>
              <li>Review the transaction details and exchange rate</li>
              <li>Confirm the payment in your wallet</li>
              <li>Tokens will be added to your account balance</li>
            </ol>
          </div>
        </div>
      </main>
    </div>
  );
};

// ==================== Professional Enterprise Styles ====================
const styles = {
  container: {
    minHeight: '100vh',
    backgroundColor: '#f8f9fa',
    fontFamily: '"Segoe UI", Tahoma, Geneva, Verdana, sans-serif',
    color: '#212529',
  },
  header: {
    backgroundColor: '#ffffff',
    borderBottom: '1px solid #dee2e6',
    padding: '24px 32px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.05)',
  },
  headerContent: {
    flex: 1,
  },
  title: {
    fontSize: '28px',
    fontWeight: '600',
    color: '#212529',
    margin: '0 0 8px 0',
    letterSpacing: '-0.25px',
  },
  breadcrumb: {
    fontSize: '14px',
    color: '#6c757d',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  breadcrumbItem: {
    color: '#6c757d',
  },
  breadcrumbSeparator: {
    color: '#adb5bd',
  },
  breadcrumbCurrent: {
    color: '#495057',
    fontWeight: '500',
  },
  userSection: {
    display: 'flex',
    gap: '32px',
    alignItems: 'flex-start',
  },
  userInfo: {
    textAlign: 'right',
  },
  userLabel: {
    fontSize: '12px',
    color: '#6c757d',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '4px',
  },
  userEmail: {
    fontSize: '14px',
    color: '#495057',
    fontWeight: '500',
  },
  balanceInfo: {
    textAlign: 'right',
    padding: '16px 20px',
    backgroundColor: '#f8f9fa',
    border: '1px solid #dee2e6',
    borderRadius: '4px',
    minWidth: '160px',
  },
  balanceLabel: {
    fontSize: '12px',
    color: '#6c757d',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
    marginBottom: '4px',
  },
  balanceValue: {
    fontSize: '18px',
    color: '#212529',
    fontWeight: '600',
  },
  main: {
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '32px',
  },
  alert: {
    display: 'flex',
    alignItems: 'flex-start',
    gap: '12px',
    padding: '16px',
    marginBottom: '24px',
    borderRadius: '4px',
    border: '1px solid',
  },
  alertIcon: {
    fontSize: '16px',
    fontWeight: 'bold',
    marginTop: '1px',
  },
  alertContent: {
    flex: 1,
  },
  alertMessage: {
    fontSize: '14px',
    lineHeight: '1.5',
    whiteSpace: 'pre-line',
    wordBreak: 'break-all',
    overflowWrap: 'break-word',
  },
  alertSuccess: {
    backgroundColor: '#d4edda',
    borderColor: '#c3e6cb',
    color: '#155724',
  },
  alertError: {
    backgroundColor: '#f8d7da',
    borderColor: '#f5c6cb',
    color: '#721c24',
  },
  alertInfo: {
    backgroundColor: '#d1ecf1',
    borderColor: '#bee5eb',
    color: '#0c5460',
  },
  paymentSection: {
    marginBottom: '32px',
  },
  sectionHeader: {
    marginBottom: '24px',
    paddingBottom: '16px',
    borderBottom: '1px solid #dee2e6',
  },
  sectionTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: '#212529',
    margin: '0 0 8px 0',
  },
  exchangeRate: {
    fontSize: '14px',
    color: '#6c757d',
  },
  paymentCard: {
    backgroundColor: '#ffffff',
    border: '1px solid #dee2e6',
    borderRadius: '4px',
    padding: '32px',
  },
  walletSection: {
    textAlign: 'center',
    padding: '48px 32px',
  },
  walletHeader: {
    marginBottom: '32px',
  },
  walletTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: '#212529',
    margin: '0 0 12px 0',
  },
  walletDescription: {
    fontSize: '14px',
    color: '#6c757d',
    lineHeight: '1.5',
  },
  connectButton: {
    backgroundColor: '#007bff',
    color: '#ffffff',
    border: 'none',
    borderRadius: '4px',
    padding: '12px 24px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background-color 0.15s ease-in-out',
  },
  paymentForm: {
    display: 'flex',
    flexDirection: 'column',
    gap: '32px',
  },
  walletConnected: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '16px',
    backgroundColor: '#f8f9fa',
    border: '1px solid #dee2e6',
    borderRadius: '4px',
  },
  connectedInfo: {
    display: 'flex',
    flexDirection: 'column',
    gap: '4px',
  },
  connectedStatus: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  },
  statusIndicator: {
    color: '#28a745',
    fontSize: '12px',
  },
  statusText: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#495057',
  },
  walletAddress: {
    fontSize: '12px',
    fontFamily: 'monospace',
    color: '#6c757d',
  },
  disconnectButton: {
    backgroundColor: 'transparent',
    color: '#dc3545',
    border: '1px solid #dc3545',
    borderRadius: '4px',
    padding: '6px 12px',
    fontSize: '12px',
    cursor: 'pointer',
    fontWeight: '500',
  },
  formSection: {
    display: 'flex',
    flexDirection: 'column',
    gap: '24px',
  },
  formRow: {
    display: 'flex',
    flexDirection: 'column',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#495057',
  },
  addressField: {
    display: 'flex',
    gap: '8px',
  },
  addressInput: {
    flex: 1,
    padding: '8px 12px',
    border: '1px solid #ced4da',
    borderRadius: '4px',
    fontSize: '14px',
    fontFamily: 'monospace',
    backgroundColor: '#f8f9fa',
    color: '#495057',
  },
  copyButton: {
    backgroundColor: '#6c757d',
    color: '#ffffff',
    border: 'none',
    borderRadius: '4px',
    padding: '8px 16px',
    fontSize: '12px',
    cursor: 'pointer',
    fontWeight: '500',
    whiteSpace: 'nowrap',
  },
  errorField: {
    padding: '12px',
    backgroundColor: '#fff3cd',
    border: '1px solid #ffeaa7',
    borderRadius: '4px',
    color: '#856404',
    fontSize: '14px',
  },
  fieldNote: {
    fontSize: '12px',
    color: '#6c757d',
    lineHeight: '1.4',
  },
  inputGroup: {
    position: 'relative',
    display: 'flex',
    alignItems: 'center',
  },
  input: {
    width: '100%',
    padding: '12px 60px 12px 12px',
    border: '1px solid #ced4da',
    borderRadius: '4px',
    fontSize: '16px',
    outline: 'none',
    transition: 'border-color 0.15s ease-in-out',
    boxSizing: 'border-box',
  },
  inputSuffix: {
    position: 'absolute',
    right: '12px',
    fontSize: '14px',
    color: '#6c757d',
    fontWeight: '500',
  },
  summarySection: {
    padding: '20px',
    backgroundColor: '#f8f9fa',
    border: '1px solid #dee2e6',
    borderRadius: '4px',
  },
  summaryTitle: {
    fontSize: '14px',
    fontWeight: '600',
    color: '#495057',
    marginBottom: '12px',
    textTransform: 'uppercase',
    letterSpacing: '0.5px',
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: '8px',
  },
  summaryLabel: {
    fontSize: '14px',
    color: '#6c757d',
  },
  summaryValue: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#495057',
  },
  summaryValueHighlight: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#007bff',
  },
  payButton: {
    backgroundColor: '#007bff',
    color: '#ffffff',
    border: 'none',
    borderRadius: '4px',
    padding: '16px 24px',
    fontSize: '16px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background-color 0.15s ease-in-out',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: '8px',
  },
  payButtonDisabled: {
    backgroundColor: '#6c757d',
    cursor: 'not-allowed',
  },
  buttonSpinner: {
    width: '16px',
    height: '16px',
    border: '2px solid #ffffff40',
    borderTop: '2px solid #ffffff',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  infoSection: {
    marginTop: '32px',
  },
  infoCard: {
    backgroundColor: '#ffffff',
    border: '1px solid #dee2e6',
    borderRadius: '4px',
    padding: '24px',
  },
  infoTitle: {
    fontSize: '16px',
    fontWeight: '600',
    color: '#495057',
    margin: '0 0 16px 0',
  },
  processList: {
    fontSize: '14px',
    color: '#6c757d',
    lineHeight: '1.6',
    paddingLeft: '20px',
    margin: 0,
  },
  authContainer: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    padding: '32px',
  },
  authCard: {
    backgroundColor: '#ffffff',
    border: '1px solid #dee2e6',
    borderRadius: '4px',
    padding: '48px',
    textAlign: 'center',
    maxWidth: '400px',
    width: '100%',
  },
  authTitle: {
    fontSize: '24px',
    fontWeight: '600',
    color: '#212529',
    margin: '0 0 16px 0',
  },
  authDescription: {
    fontSize: '14px',
    color: '#6c757d',
    lineHeight: '1.5',
    marginBottom: '32px',
  },
  authButton: {
    backgroundColor: '#007bff',
    color: '#ffffff',
    border: 'none',
    borderRadius: '4px',
    padding: '12px 24px',
    fontSize: '14px',
    fontWeight: '500',
    cursor: 'pointer',
    transition: 'background-color 0.15s ease-in-out',
  },
  loadingContainer: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: '100vh',
    gap: '16px',
  },
  loadingSpinner: {
    width: '32px',
    height: '32px',
    border: '3px solid #e9ecef',
    borderTop: '3px solid #007bff',
    borderRadius: '50%',
    animation: 'spin 1s linear infinite',
  },
  loadingText: {
    fontSize: '14px',
    color: '#6c757d',
  },
};

// Add CSS animation
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes spin {
    0% { transform: rotate(0deg); }
    100% { transform: rotate(360deg); }
  }
`;
document.head.appendChild(styleSheet);

export default Payment;