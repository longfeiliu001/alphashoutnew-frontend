import React, { useState, useEffect } from 'react';
import { Wallet, Send, Download, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';
import {updateQuotaNewSolanaPaid } from './Supabasemanager';
import {checkUserEmail} from './Usermanager';

import { 
  Connection, 
  PublicKey, 
  Transaction, 
  SystemProgram, 
  sendAndConfirmTransaction,
  Keypair,
  LAMPORTS_PER_SOL
} from '@solana/web3.js';

// Setup connection to Solana network
//const connection = new Connection('https://api.devnet.solana.com');
const connection = new Connection('https://devnet.helius-rpc.com/?api-key=c6c4b24c-a6c1-4256-b8d9-ca243c61df90');

// CSS Styles
const styles = `
  .app-container {
    min-height: 100vh;
    background-color: white;
    margin: 0;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', 'Roboto', 'Oxygen', 'Ubuntu', 'Cantarell', sans-serif;
  }

  .banner {
    background-color: #2563eb;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    padding: 2rem 1.5rem;
  }

  .banner-content {
    max-width: 1200px;
    margin: 0 auto;
    text-align: center;
  }

  .banner-icon {
    width: 64px;
    height: 64px;
    background-color: white;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 0 auto 1rem auto;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
  }

  .banner-title {
    font-size: 2.5rem;
    font-weight: bold;
    color: white;
    margin: 0 0 0.5rem 0;
  }

  .banner-subtitle {
    color: #bfdbfe;
    font-size: 1.125rem;
    margin: 0;
  }

  .main-content {
    max-width: 768px;
    margin: 0 auto;
    padding: 3rem 1.5rem;
  }

  .card {
    background-color: white;
    border-radius: 1rem;
    box-shadow: 0 20px 25px rgba(0, 0, 0, 0.1), 0 10px 10px rgba(0, 0, 0, 0.04);
    border: 1px solid #f3f4f6;
    overflow: hidden;
  }

  .card-content {
    padding: 2rem;
  }

  .message {
    border-radius: 0.5rem;
    padding: 1rem;
    margin-bottom: 1.5rem;
    display: flex;
    align-items: center;
    gap: 0.75rem;
    box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
  }

  .message-success {
    background-color: #f0fdf4;
    border: 1px solid #bbf7d0;
    color: #15803d;
  }

  .message-error {
    background-color: #fef2f2;
    border: 1px solid #fecaca;
    color: #dc2626;
  }

  .message-info {
    background-color: #eff6ff;
    border: 1px solid #bfdbfe;
    color: #1d4ed8;
  }

  .section-title {
    font-size: 1.5rem;
    font-weight: 600;
    color: #374151;
    margin-bottom: 0.5rem;
    text-align: center;
  }

  .section-subtitle {
    color: #6b7280;
    text-align: center;
    margin-bottom: 2rem;
  }

  .wallet-list {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .wallet-button {
    width: 100%;
    background-color: #2563eb;
    color: white;
    font-weight: 600;
    padding: 1rem 1.5rem;
    border-radius: 0.75rem;
    border: none;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.75rem;
  }

  .wallet-button:hover {
    background-color: #1d4ed8;
    transform: scale(1.02);
    box-shadow: 0 10px 15px rgba(0, 0, 0, 0.15);
  }

  .no-wallet-container {
    text-align: center;
  }

  .no-wallet-card {
    background-color: #f9fafb;
    border-radius: 0.75rem;
    padding: 2rem;
    border: 1px solid #e5e7eb;
  }

  .no-wallet-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #374151;
    margin: 1rem 0 0.5rem 0;
  }

  .no-wallet-description {
    color: #6b7280;
    margin-bottom: 1.5rem;
  }

  .install-button {
    background-color: #2563eb;
    color: white;
    font-weight: 600;
    padding: 0.75rem 1.5rem;
    border-radius: 0.75rem;
    border: none;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    display: inline-flex;
    align-items: center;
    gap: 0.5rem;
  }

  .install-button:hover {
    background-color: #1d4ed8;
    box-shadow: 0 10px 15px rgba(0, 0, 0, 0.15);
  }

  .wallet-info {
    background-color: #f9fafb;
    border-radius: 0.75rem;
    padding: 1.5rem;
    border: 1px solid #e5e7eb;
    margin-bottom: 2rem;
  }

  .wallet-info-header {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin-bottom: 1.5rem;
  }

  .wallet-info-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #374151;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .disconnect-button {
    color: #dc2626;
    background-color: #fef2f2;
    border: none;
    padding: 0.25rem 0.75rem;
    border-radius: 0.5rem;
    font-size: 0.875rem;
    font-weight: 500;
    cursor: pointer;
    transition: all 0.2s;
  }

  .disconnect-button:hover {
    color: #b91c1c;
    background-color: #fee2e2;
  }

  .info-grid {
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  .info-item-label {
    color: #6b7280;
    font-size: 0.875rem;
    font-weight: 500;
    margin-bottom: 0.25rem;
  }

  .info-item-content {
    background-color: white;
    padding: 0.75rem;
    border-radius: 0.5rem;
    border: 1px solid #e5e7eb;
  }

  .public-key-short {
    color: #374151;
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    font-size: 0.875rem;
    word-break: break-all;
  }

  .public-key-full {
    color: #6b7280;
    font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
    font-size: 0.75rem;
    margin-top: 0.25rem;
  }

  .balance-amount {
    font-size: 1.5rem;
    font-weight: bold;
    color: #374151;
  }

  .transfer-section {
    background-color: #eff6ff;
    border-radius: 0.75rem;
    padding: 1.5rem;
    border: 1px solid #bfdbfe;
  }

  .transfer-title {
    font-size: 1.25rem;
    font-weight: 600;
    color: #374151;
    margin-bottom: 1.5rem;
    display: flex;
    align-items: center;
    gap: 0.5rem;
  }

  .form-group {
    margin-bottom: 1.25rem;
  }

  .form-label {
    display: block;
    color: #374151;
    font-size: 0.875rem;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }

  .form-input {
    width: 100%;
    background-color: white;
    border: 1px solid #d1d5db;
    border-radius: 0.5rem;
    padding: 0.75rem 1rem;
    color: #374151;
    font-size: 1rem;
    transition: all 0.2s;
    box-sizing: border-box;
  }

  .form-input:focus {
    outline: none;
    border-color: #2563eb;
    box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
  }

  .form-input::placeholder {
    color: #9ca3af;
  }

  .transfer-button {
    width: 100%;
    background-color: #059669;
    color: white;
    font-weight: 600;
    padding: 1rem 1.5rem;
    border-radius: 0.75rem;
    border: none;
    cursor: pointer;
    transition: all 0.2s;
    box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 0.5rem;
  }

  .transfer-button:hover:not(:disabled) {
    background-color: #047857;
    transform: scale(1.02);
    box-shadow: 0 10px 15px rgba(0, 0, 0, 0.15);
  }

  .transfer-button:disabled {
    background-color: #9ca3af;
    cursor: not-allowed;
    transform: none;
  }

  .icon {
    width: 20px;
    height: 20px;
  }

  .icon-large {
    width: 64px;
    height: 64px;
  }

  .icon-medium {
    width: 24px;
    height: 24px;
  }
`;

const SolanaWalletConnect = () => {
  const [wallet, setWallet] = useState(null);
  const [connected, setConnected] = useState(false);
  const [publicKey, setPublicKey] = useState('');
  const [balance, setBalance] = useState(0);
  const [recipient, setRecipient] = useState('');
  const [amount, setAmount] = useState('');
  const [isTransferring, setIsTransferring] = useState(false);
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [availableWallets, setAvailableWallets] = useState([]);

  useEffect(() => {
    checkWalletAvailability();
  }, []);

  const sendSol = async () => {
    if (!connected || !wallet) {
      setMessage('Please connect your wallet first');
      return;
    }

    if (!recipient) {
      setMessage('Please enter a recipient address');
      return;
    }

    setMessage('');

    try {
      // Validate recipient address
      const recipientPubkey = new PublicKey(recipient);
      
      // Create transaction
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey: wallet.publicKey,
          toPubkey: recipientPubkey,
          lamports: amount*LAMPORTS_PER_SOL, // 1 SOL
        })
      );

      // Get recent blockhash
      const { blockhash,lastValidBlockHeight } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      setMessage(`from ${recipientPubkey} to `+wallet.publicKey+` last blockhash: ${blockhash}`);
      
      transaction.feePayer = new PublicKey(publicKey);

      // Sign and send transaction
      const signedTransaction = await wallet.signTransaction(transaction);
      const signature = await connection.sendRawTransaction(signedTransaction.serialize());
      
      // Wait for confirmation
      //await connection.confirmTransaction(signature);
     const confirmation = await connection.confirmTransaction({
  signature: signature,
  blockhash: blockhash,
  lastValidBlockHeight: lastValidBlockHeight
});

            if (confirmation.value.err)
                {

                  setMessage('Transaction failed: ' + confirmation.value.err.message);
                } 
                else
                 {
                
            const var_user_email=await checkUserEmail();
          const var_message=  await updateQuotaNewSolanaPaid(var_user_email,amount);
               setMessage(`Transaction successful! Signature: ${signature}. ${var_message}`);

                }

      
    } catch (error) {
      setMessage('Transaction failed: ' + error.message);
    } finally {
   
    }
  };

  const checkWalletAvailability = () => {
    const wallets = [];
    
    if (window.phantom?.solana) {
      wallets.push({ name: 'Phantom', provider: window.phantom.solana });
    }
    
    if (window.solflare) {
      wallets.push({ name: 'Solflare', provider: window.solflare });
    }
    
    setAvailableWallets(wallets);
  };

  const connectWallet = async (walletProvider, walletName) => {
    try {
      const response = await walletProvider.connect();
      setWallet(walletProvider);
      setConnected(true);
      setPublicKey(response.publicKey.toString());
      setMessage(`Connected to ${walletName} successfully!`+walletProvider.publicKey);
      setMessageType('success');
      
      // Get balance
      await getBalance(walletProvider);
    } catch (error) {
      setMessage(`Failed to connect to ${walletName}: ${error.message}`);
      setMessageType('error');
    }
  };

  const getBalance = async (walletProvider) => {
    try {
      const publicKey1 = walletProvider.publicKey;
      const balance = await connection.getBalance(publicKey1);
      const solBalance = balance / 1000000000;
      setBalance(solBalance);
    } catch (error) {
      setMessage(`Error fetching balance:${error.message}`);
      setBalance(0);
    }
  };

  const disconnectWallet = () => {
    if (wallet) {
      wallet.disconnect();
    }
    setWallet(null);
    setConnected(false);
    setPublicKey('');
    setBalance(0);
    setMessage('Wallet disconnected');
    setMessageType('info');
  };

  const installPhantom = () => {
    window.open('https://phantom.app/', '_blank');
  };

  const renderMessage = () => {
    if (!message) return null;

    const messageClass = messageType === 'success' ? 'message-success' : 
                        messageType === 'error' ? 'message-error' : 
                        'message-info';

    const Icon = messageType === 'success' ? CheckCircle : AlertCircle;

    return (
      <div className={`message ${messageClass}`}>
        <Icon className="icon" />
        <p>{message}</p>
      </div>
    );
  };

  return (
    <>
      <style>{styles}</style>
      <div className="app-container">
        {/* Blue Banner Header */}
        <div className="banner">
          <div className="banner-content">
            <div className="banner-icon">
              <Wallet className="icon" style={{ color: '#2563eb' }} />
            </div>
            <h1 className="banner-title">Solana Wallet Manager</h1>
            <p className="banner-subtitle">Connect your wallet to manage SOL transactions securely</p>
          </div>
        </div>

        {/* Main Content */}
        <div className="main-content">
          <div className="card">
            <div className="card-content">
              {renderMessage()}

              {!connected ? (
                <div>
                  <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
                    <h2 className="section-title">Connect Your Wallet</h2>
                    <p className="section-subtitle">Choose a wallet to get started with Solana transactions</p>
                  </div>

                  {availableWallets.length > 0 ? (
                    <div className="wallet-list">
                      {availableWallets.map((walletOption, index) => (
                        <button
                          key={index}
                          onClick={() => connectWallet(walletOption.provider, walletOption.name)}
                          className="wallet-button"
                        >
                          <Wallet className="icon" />
                          Connect {walletOption.name}
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="no-wallet-container">
                      <div className="no-wallet-card">
                        <AlertCircle className="icon-large" style={{ color: '#f59e0b', margin: '0 auto' }} />
                        <h3 className="no-wallet-title">No Wallet Detected</h3>
                        <p className="no-wallet-description">
                          You need to install a Solana wallet extension to continue
                        </p>
                        <button onClick={installPhantom} className="install-button">
                          <Download className="icon" />
                          Install Phantom Wallet
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div>
                  {/* Wallet Info Section */}
                  <div className="wallet-info">
                    <div className="wallet-info-header">
                      <h3 className="wallet-info-title">
                        <CheckCircle className="icon-medium" style={{ color: '#10b981' }} />
                        Wallet Connected
                      </h3>
                      <button onClick={disconnectWallet} className="disconnect-button">
                        Disconnect
                      </button>
                    </div>
                    <div className="info-grid">
                      <div>
                        <p className="info-item-label">Public Key:</p>
                        <div className="info-item-content">
                          <p className="public-key-short">
                            {publicKey.slice(0, 20)}...{publicKey.slice(-20)}
                          </p>
                          <p className="public-key-full">{publicKey}</p>
                        </div>
                      </div>
                      <div>
                        <p className="info-item-label">Balance:</p>
                        <div className="info-item-content">
                          <p className="balance-amount">{balance.toFixed(4)} SOL</p>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Transfer Section */}
                  <div className="transfer-section">
                    <h3 className="transfer-title">
                      <Send className="icon-medium" style={{ color: '#2563eb' }} />
                      Transfer SOL
                    </h3>
                    <div>
                      <div className="form-group">
                        <label className="form-label">Recipient Address</label>
                        <input
                          type="text"
                          value={recipient}
                          onChange={(e) => setRecipient(e.target.value)}
                          placeholder="Enter recipient's public key"
                          className="form-input"
                        />
                      </div>
                      <div className="form-group">
                        <label className="form-label">Amount (SOL)</label>
                        <input
                          type="number"
                          value={amount}
                          onChange={(e) => setAmount(e.target.value)}
                          placeholder="0.0"
                          min="0"
                          step="0.001"
                          max={balance}
                          className="form-input"
                        />
                      </div>
                      <button
                        onClick={sendSol}
                        disabled={!recipient || !amount || isTransferring || parseFloat(amount) > balance}
                        className="transfer-button"
                      >
                        {isTransferring ? (
                          <>
                            <Loader2 className="icon" style={{ animation: 'spin 1s linear infinite' }} />
                            Processing Transaction...
                          </>
                        ) : (
                          <>
                            <Send className="icon" />
                            Transfer SOL
                          </>
                        )}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default SolanaWalletConnect;