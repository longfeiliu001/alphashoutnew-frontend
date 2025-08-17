import React, { useState, useEffect } from 'react';
import { Wallet, Send, Download, AlertCircle, CheckCircle, Loader2 } from 'lucide-react';

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
//const connection = new Connection('https://api.mainnet-beta.solana.com');
// const connection = new Connection('https://go.getblock.io/ef61b61b668740a694e8a434303d4022');




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
      const { blockhash,lastValidBlockHeight  } = await connection.getLatestBlockhash();//getRecentBlockhash();
      
      transaction.recentBlockhash = blockhash;
      setMessage(`from ${recipientPubkey} to `+wallet.publicKey+` last blockhash: ${blockhash}`);
      
      transaction.feePayer = new PublicKey(publicKey);

      // Sign and send transaction
      const signedTransaction = await wallet.signTransaction(transaction);
      const signature = await connection.sendRawTransaction(signedTransaction.serialize());
      
      // Wait for confirmation
      // await connection.confirmTransaction(signature);
      await connection.confirmTransaction({
  signature: signature,
  blockhash: blockhash,
  lastValidBlockHeight: lastValidBlockHeight
});
      setMessage(`Transaction successful! Signature: ${signature}`);
      
      
      
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
      // In a real app, you'd use @solana/web3.js to get the actual balance
      // For demo purposes, we'll simulate it
      // Create PublicKey object from wallet address
    const publicKey1 = walletProvider.publicKey;
    
    // Get balance in lamports (1 SOL = 1,000,000,000 lamports)
    const balance = await connection.getBalance(publicKey1);
    
    // Convert lamports to SOL
    const solBalance = balance / 1000000000;
    
   
     // const connection = new (window as any).solanaWeb3.Connection('https://api.mainnet-beta.solana.com');
      // const publicKey = new (window as any).solanaWeb3.PublicKey(walletProvider.publicKey);
     // const balance = await connection.getBalance(publicKey);
      setBalance(solBalance); // Convert lamports to SOL
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

    const bgColor = messageType === 'success' ? 'bg-green-50 border-green-200' : 
                   messageType === 'error' ? 'bg-red-50 border-red-200' : 
                   'bg-blue-50 border-blue-200';
    
    const textColor = messageType === 'success' ? 'text-green-800' : 
                     messageType === 'error' ? 'text-red-800' : 
                     'text-blue-800';

    const Icon = messageType === 'success' ? CheckCircle : AlertCircle;

    return (
      <div className={`${bgColor} border rounded-lg p-4 mb-6 flex items-center gap-3`}>
        <Icon className={`w-5 h-5 ${textColor}`} />
        <p className={textColor}>{message}</p>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-900 via-blue-900 to-indigo-900 p-6">
      <div className="max-w-md mx-auto">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/20">
          <div className="text-center mb-8">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-400 to-pink-400 rounded-full flex items-center justify-center mx-auto mb-4">
              <Wallet className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-white mb-2">Solana Wallet</h1>
            <p className="text-gray-300">Connect your wallet to manage SOL</p>
          </div>

          {renderMessage()}

          {!connected ? (
            <div className="space-y-4">
              {availableWallets.length > 0 ? (
                <div className="space-y-3">
                  <p className="text-white text-sm font-medium">Choose your wallet:</p>
                  {availableWallets.map((walletOption, index) => (
                    <button
                      key={index}
                      onClick={() => connectWallet(walletOption.provider, walletOption.name)}
                      className="w-full bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg"
                    >
                      Connect {walletOption.name}
                    </button>
                  ))}
                </div>
              ) : (
                <div className="text-center space-y-4">
                  <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                    <AlertCircle className="w-12 h-12 text-yellow-400 mx-auto mb-4" />
                    <p className="text-white mb-4">No Solana wallet detected</p>
                    <p className="text-gray-300 text-sm mb-6">
                      You need to install a Solana wallet to continue
                    </p>
                    <button
                      onClick={installPhantom}
                      className="w-full bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
                    >
                      <Download className="w-5 h-5" />
                      Install Phantom Wallet
                    </button>
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="space-y-6">
              {/* Wallet Info */}
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-white font-semibold">Wallet Connected</h3>
                  <button
                    onClick={disconnectWallet}
                    className="text-red-400 hover:text-red-300 text-sm font-medium"
                  >
                    Disconnect
                  </button>
                </div>
                <div className="space-y-3">
                  <div>
                    <p className="text-gray-400 text-sm">Public Key:</p>
                    <p className="text-white font-mono text-sm break-all">
                      {publicKey.slice(0, 20)}...{publicKey.slice(-20)}
                      <br />
                      {publicKey}
                    </p>
                  </div>
                  <div>
                    <p className="text-gray-400 text-sm">Balance:</p>
                    <p className="text-white font-semibold text-lg">{balance.toFixed(4)} SOL</p>
                  </div>
                </div>
              </div>

              {/* Transfer Section */}
              <div className="bg-white/5 rounded-xl p-6 border border-white/10">
                <h3 className="text-white font-semibold mb-4 flex items-center gap-2">
                  <Send className="w-5 h-5" />
                  Transfer SOL
                </h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      Recipient Address
                    </label>
                    <input
                      type="text"
                      value={recipient}
                      onChange={(e) => setRecipient(e.target.value)}
                      placeholder="Enter recipient's public key"
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20"
                    />
                  </div>
                  <div>
                    <label className="block text-gray-300 text-sm font-medium mb-2">
                      Amount (SOL)
                    </label>
                    <input
                      type="number"
                      value={amount}
                      onChange={(e) => setAmount(e.target.value)}
                      placeholder="0.0"
                      min="0"
                      step="0.001"
                      max={balance}
                      className="w-full bg-white/10 border border-white/20 rounded-lg px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:border-purple-400 focus:ring-2 focus:ring-purple-400/20"
                    />
                  </div>
                  <button
                    onClick={sendSol}
                    disabled={!recipient || !amount || isTransferring || parseFloat(amount) > balance}
                    className="w-full bg-gradient-to-r from-green-500 to-teal-500 hover:from-green-600 hover:to-teal-600 disabled:from-gray-500 disabled:to-gray-600 disabled:cursor-not-allowed text-white font-semibold py-3 px-6 rounded-xl transition-all duration-300 transform hover:scale-105 shadow-lg flex items-center justify-center gap-2"
                  >
                    {isTransferring ? (
                      <>
                        <Loader2 className="w-5 h-5 animate-spin" />
                        Processing...
                      </>
                    ) : (
                      <>
                        <Send className="w-5 h-5" />
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
  );
};

export default SolanaWalletConnect;