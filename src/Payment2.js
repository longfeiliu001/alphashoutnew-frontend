// Payment2.js - 修复支付按钮初始禁用问题
import React, { useState, useEffect, useRef } from 'react';

const Payment2 = () => {
  // 用户状态
  const [user, setUser] = useState(null);
  const [quota, setQuota] = useState(0);
  const [loading, setLoading] = useState(true);
  
  // 支付状态
  const [paymentType, setPaymentType] = useState('stripe');
  const [amount, setAmount] = useState('10');
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('');
  const [processing, setProcessing] = useState(false);
  
  // Stripe 相关
  const [stripeReady, setStripeReady] = useState(false);
  const [cardMounted, setCardMounted] = useState(false); // 新增：跟踪卡片是否已挂载
  const stripeRef = useRef(null);
  const elementsRef = useRef(null);
  const cardElementRef = useRef(null);
  const cardContainerRef = useRef(null);
  
  // 汇率配置
  const [exchangeRates, setExchangeRates] = useState({
    USD: 10,
    SOL: 1500
  });
  const [minimumAmounts, setMinimumAmounts] = useState({
    USD: 10,
    SOL: 0.1
  });
  const [defaultSolanaAddress, setDefaultSolanaAddress] = useState('');
  
  // Solana 相关
  const [solanaWallet, setSolanaWallet] = useState(null);
  const [solAmount, setSolAmount] = useState('0.1');

  // 配置
  const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';
  const STRIPE_KEY = 'pk_test_51Rt1K541uegzirzzc3vXFOjx2rZZjlWfVIP2DUwXqD28PZc7Lr1BZolTO0A24MTzzlbaiPILrIZX4ykcp56JJOod00i8T6WPAy';

  // ==================== 导航函数 ====================
  const navigateToLogin = () => {
    console.log('Navigating to login...');
    // 方法1: 使用自定义事件
    const event = new CustomEvent('navigate-to-login', { 
      detail: { page: 'login' } 
    });
    window.dispatchEvent(event);
    
    // 方法2: 如果上面不工作，直接操作父组件
    // 查找菜单并点击登录选项
    setTimeout(() => {
      const loginMenuItem = document.querySelector('.ant-menu-item:nth-child(5)');
      if (loginMenuItem) {
        loginMenuItem.click();
      }
    }, 100);
  };

  // ==================== 初始化 ====================
  useEffect(() => {
    checkAuth();
    fetchExchangeRates();
    
    return () => {
      if (cardElementRef.current) {
        try {
          cardElementRef.current.destroy();
        } catch (e) {
          console.log('Card element already destroyed');
        }
        cardElementRef.current = null;
      }
    };
  }, []);

  // 获取汇率配置
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
      console.error('获取汇率配置失败:', error);
    }
  };

  // 处理支付方式切换
  useEffect(() => {
    if (paymentType === 'stripe') {
      if (!window.Stripe) {
        loadStripe();
      } else if (!stripeRef.current) {
        initializeStripe();
      }
    } else {
      if (cardElementRef.current) {
        try {
          cardElementRef.current.destroy();
        } catch (e) {
          console.log('Error destroying card element:', e);
        }
        cardElementRef.current = null;
        setCardMounted(false); // 重置卡片挂载状态
      }
    }
  }, [paymentType]);

  // 当 Stripe 准备好且在 Stripe 支付模式时，延迟3秒挂载卡片元素
  useEffect(() => {
    if (stripeReady && paymentType === 'stripe') {
      const timer = setTimeout(() => {
        requestAnimationFrame(() => {
          if (cardContainerRef.current && !cardElementRef.current) {
            mountCardElement();
          }
        });
      }, 3000); // 保留3秒延迟
      
      return () => clearTimeout(timer);
    }
  }, [stripeReady, paymentType]);

  // 检查用户认证
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

  // 加载 Stripe
  const loadStripe = () => {
    if (window.Stripe) {
      initializeStripe();
      return;
    }

    const existingScript = document.getElementById('stripe-js');
    if (existingScript) {
      if (!window.Stripe) {
        existingScript.onload = () => {
          initializeStripe();
        };
      }
      return;
    }

    const script = document.createElement('script');
    script.id = 'stripe-js';
    script.src = 'https://js.stripe.com/v3/';
    script.async = true;
    
    script.onload = () => {
      console.log('Stripe.js loaded successfully');
      initializeStripe();
    };
    
    script.onerror = () => {
      console.error('Failed to load Stripe.js');
      setMessage('无法加载 Stripe，请检查网络连接');
      setMessageType('error');
    };
    
    document.body.appendChild(script);
  };

  // 初始化 Stripe
  const initializeStripe = () => {
    if (!window.Stripe || stripeRef.current) {
      return;
    }
    
    try {
      const stripe = window.Stripe(STRIPE_KEY);
      const elements = stripe.elements({
        fonts: [
          {
            cssSrc: 'https://fonts.googleapis.com/css?family=Roboto',
          },
        ],
      });
      
      stripeRef.current = stripe;
      elementsRef.current = elements;
      setStripeReady(true);
    } catch (error) {
      console.error('Initialize Stripe error:', error);
      setMessage('Stripe 初始化失败');
      setMessageType('error');
    }
  };

  // 挂载卡片元素
  const mountCardElement = () => {
    if (cardElementRef.current) {
      return;
    }
    
    if (!elementsRef.current) {
      return;
    }
    
    const container = cardContainerRef.current;
    if (!container) {
      return;
    }
    
    try {
      const cardElement = elementsRef.current.create('card', {
        style: {
          base: {
            fontSize: '16px',
            color: '#424770',
            '::placeholder': {
              color: '#aab7c4',
            },
            fontFamily: '"Helvetica Neue", Helvetica, sans-serif',
            fontSmoothing: 'antialiased',
            ':-webkit-autofill': {
              color: '#424770',
            },
          },
          invalid: {
            color: '#9e2146',
            iconColor: '#9e2146'
          },
        },
        hidePostalCode: false,
      });
      
      container.innerHTML = '';
      cardElement.mount(container);
      cardElementRef.current = cardElement;
      setCardMounted(true); // 设置卡片已挂载
      
      cardElement.on('change', (event) => {
        if (event.error) {
          if (messageType !== 'success') {
            setMessage(event.error.message);
            setMessageType('error');
          }
        } else if (messageType === 'error' && message && !message.includes('✅')) {
          setMessage('');
          setMessageType('');
        }
      });
    } catch (error) {
      console.error('Mount card element error:', error);
      setMessage('无法创建支付卡片输入框');
      setMessageType('error');
    }
  };

  // ==================== Stripe 支付处理 ====================
  const handleStripePayment = async () => {
    if (!stripeRef.current || !cardElementRef.current) {
      setMessage('请等待支付系统加载完成');
      setMessageType('error');
      return;
    }

    const amountNum = parseFloat(amount);
    if (!amountNum || amountNum < minimumAmounts.USD) {
      setMessage(`最小支付金额为 ${minimumAmounts.USD} USD`);
      setMessageType('error');
      return;
    }

    setProcessing(true);
    setMessage('正在处理支付...');
    setMessageType('info');

    try {
      const { error, paymentMethod } = await stripeRef.current.createPaymentMethod({
        type: 'card',
        card: cardElementRef.current,
        billing_details: {
          email: user.email,
        },
      });

      if (error) {
        setMessage(`❌ 卡片错误: ${error.message}`);
        setMessageType('error');
        setProcessing(false);
        return;
      }

      const response = await fetch(`${API_URL}/api/confirm-payment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          paymentMethodId: paymentMethod.id,
          amount: amountNum,
          description: `配额充值 - ${user.email}`,
        }),
      });

      const result = await response.json();

      if (result.success === true) {
        const payment = result.payment || {};
        const successMsg = `✅ 支付成功！\n` +
          `支付金额: $${payment.amount || amountNum}\n` +
          `添加代币: ${payment.tokensAdded || Math.round(amountNum * exchangeRates.USD)} tokens\n` +
          `当前余额: ${payment.newQuota || quota} tokens`;
        
        setMessage(successMsg);
        setMessageType('success');
        
        if (payment.newQuota) {
          setQuota(payment.newQuota);
        }
        
        setTimeout(() => {
          if (cardElementRef.current) {
            cardElementRef.current.clear();
          }
          setAmount('10');
        }, 100);
        
      } else if (result.requiresAction === true) {
        setMessage('🔐 需要额外验证，请在弹出窗口中完成验证...');
        setMessageType('info');
        
        const { error: confirmError } = await stripeRef.current.confirmCardPayment(result.clientSecret);
        
        if (confirmError) {
          setMessage(`❌ 验证失败: ${confirmError.message}`);
          setMessageType('error');
        } else {
          const updateResponse = await fetch(`${API_URL}/api/stripe/update-quota-after-3ds`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            credentials: 'include',
            body: JSON.stringify({
              paymentIntentId: result.paymentIntentId,
              amount: amountNum,
            }),
          });

          const updateResult = await updateResponse.json();
          
          if (updateResult.success) {
            const payment = updateResult.payment || {};
            const successMsg = `✅ 支付验证成功！\n` +
              `支付金额: $${payment.amount || amountNum}\n` +
              `添加代币: ${payment.tokensAdded || Math.round(amountNum * exchangeRates.USD)} tokens\n` +
              `当前余额: ${payment.newQuota || quota} tokens`;
            
            setMessage(successMsg);
            setMessageType('success');
            
            if (payment.newQuota) {
              setQuota(payment.newQuota);
            }
            
            setTimeout(() => {
              if (cardElementRef.current) {
                cardElementRef.current.clear();
              }
              setAmount('10');
            }, 100);
          } else {
            setMessage('❌ 验证后更新失败，请联系客服');
            setMessageType('error');
          }
        }
        
      } else {
        const errorMsg = result.message || result.error || '支付失败';
        setMessage(`❌ ${errorMsg}`);
        setMessageType('error');
      }
      
    } catch (error) {
      console.error('支付异常:', error);
      setMessage(`❌ 支付处理失败: ${error.message}`);
      setMessageType('error');
    } finally {
      setProcessing(false);
    }
  };

  // ==================== Solana 支付处理 ====================
  const connectPhantomWallet = async () => {
    if (!window.phantom?.solana) {
      setMessage('请先安装 Phantom 钱包扩展');
      setMessageType('error');
      window.open('https://phantom.app/', '_blank');
      return;
    }

    try {
      const response = await window.phantom.solana.connect();
      setSolanaWallet(window.phantom.solana);
      setMessage('钱包连接成功！');
      setMessageType('success');
    } catch (error) {
      setMessage('钱包连接失败: ' + error.message);
      setMessageType('error');
    }
  };

  const handleSolanaPayment = async () => {
    if (!solanaWallet) {
      setMessage('请先连接钱包');
      setMessageType('error');
      return;
    }

    if (!defaultSolanaAddress) {
      setMessage('❌ 系统未配置收款地址，请联系管理员');
      setMessageType('error');
      return;
    }

    const solAmountNum = parseFloat(solAmount);
    if (!solAmountNum || solAmountNum < minimumAmounts.SOL) {
      setMessage(`最小支付金额为 ${minimumAmounts.SOL} SOL`);
      setMessageType('error');
      return;
    }

    setProcessing(true);
    setMessage('正在创建交易...');
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
      
      setMessage('请在钱包中确认交易...');
      setMessageType('info');
      
      const { signature } = await solanaWallet.signAndSendTransaction(transaction);
      
      if (!signature) {
        throw new Error('交易签名失败');
      }
      
      setMessage('交易已发送，等待确认...');
      setMessageType('info');
      
      const confirmation = await connection.confirmTransaction(signature, 'confirmed');
      
      if (confirmation.value.err) {
        throw new Error('交易确认失败');
      }
      
      setMessage('交易已确认，正在更新配额...');
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
          `✅ 支付成功！\n` +
          `支付金额: ${payment.amount} ${payment.currency}\n` +
          `添加代币: ${payment.tokensAdded} tokens\n` +
          `汇率: 1 ${payment.currency} = ${payment.ratio} tokens\n` +
          `当前余额: ${payment.newQuota} tokens\n` +
          `交易ID: ${payment.transactionId}`
        );
        setMessageType('success');
        setQuota(payment.newQuota);
        setSolAmount('0.1');
        
      } else if (result.error === 'INVALID_RECIPIENT') {
        setMessage(`❌ 支付验证失败！请联系客服`);
        setMessageType('error');
      } else if (result.error === 'This transaction has already been processed') {
        setMessage('⚠️ 此交易已经处理过，请勿重复提交');
        setMessageType('error');
      } else {
        setMessage(`❌ ${result.error || '支付确认失败'}`);
        setMessageType('error');
      }
    } catch (error) {
      console.error('Solana payment error:', error);
      
      if (error.message?.includes('User rejected')) {
        setMessage('您已取消交易');
        setMessageType('');
      } else if (error.message?.includes('insufficient')) {
        setMessage('❌ 余额不足，请确保钱包有足够的 SOL');
        setMessageType('error');
      } else if (error.message?.includes('@solana/web3.js')) {
        setMessage('❌ 无法加载 Solana 库，请刷新页面重试');
        setMessageType('error');
      } else {
        setMessage(`❌ ${error.message || '支付处理失败'}`);
        setMessageType('error');
      }
    } finally {
      setProcessing(false);
    }
  };

  // ==================== 渲染 ====================
  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingCard}>
          <h2>加载中...</h2>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div style={styles.container}>
        <div style={styles.authCard}>
          <h2>请先登录</h2>
          <p style={{ marginBottom: '20px', color: '#666' }}>
            您需要登录账户才能进行支付
          </p>
          <button 
            onClick={navigateToLogin}
            style={styles.btnPrimary}
          >
            前往登录页面
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      <div style={styles.header}>
        <h1>💳 支付中心</h1>
        <div style={styles.userInfo}>
          <span>👤 {user.email}</span>
          <span style={styles.quotaBadge}>💰 {quota} tokens</span>
        </div>
      </div>

      <div style={styles.tabs}>
        <button
          style={{
            ...styles.tab,
            ...(paymentType === 'stripe' ? styles.tabActive : {})
          }}
          onClick={() => setPaymentType('stripe')}
        >
          💳 信用卡支付
        </button>
        <button
          style={{
            ...styles.tab,
            ...(paymentType === 'solana' ? styles.tabActive : {})
          }}
          onClick={() => setPaymentType('solana')}
        >
          ⚡ Solana 支付
        </button>
      </div>

      <div style={{ minHeight: message ? 'auto' : '0' }}>
        {message && (
          <div style={{
            ...styles.alert,
            ...(messageType === 'success' ? styles.alertSuccess :
                messageType === 'error' ? styles.alertError :
                messageType === 'info' ? styles.alertInfo : {})
          }}>
            {message}
          </div>
        )}
      </div>

      <div style={styles.card}>
        {paymentType === 'stripe' ? (
          <>
            <h2>信用卡支付</h2>
            <p style={styles.subtitle}>汇率: 1 USD = {exchangeRates.USD} tokens</p>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>支付金额 (USD)</label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                style={styles.input}
                min={minimumAmounts.USD}
                step="1"
                placeholder={`最小 ${minimumAmounts.USD} USD`}
                disabled={processing}
              />
              <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
                最小支付金额：{minimumAmounts.USD} USD
              </div>
            </div>

            <div style={styles.preview}>
              <span>您将获得:</span>
              <strong style={styles.previewAmount}>
                {Math.round(parseFloat(amount || 0) * exchangeRates.USD)} tokens
              </strong>
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>卡片信息</label>
              <div 
                ref={cardContainerRef}
                style={{
                  ...styles.cardElement,
                  ...(processing ? styles.cardElementDisabled : {})
                }}
              >
                {!stripeReady && (
                  <div style={{ 
                    padding: '12px', 
                    color: '#aab7c4',
                    fontSize: '14px' 
                  }}>
                    正在加载支付系统...
                  </div>
                )}
              </div>
            </div>

            <button
              onClick={handleStripePayment}
              disabled={processing || !stripeReady || !cardMounted}
              style={{
                ...styles.btnPrimary,
                ...(processing || !stripeReady || !cardMounted ? styles.btnDisabled : {})
              }}
            >
              {processing ? '处理中...' : !cardMounted ? '正在加载支付系统...' : `支付 ${amount}`}
            </button>

            <div style={styles.testInfo}>
              <strong>测试卡号:</strong><br />
              4242 4242 4242 4242<br />
              有效期: 12/25 | CVV: 123 | 邮编: 12345
            </div>
          </>
        ) : (
          <>
            <h2>Solana 支付</h2>
            <p style={styles.subtitle}>汇率: 1 SOL = {exchangeRates.SOL} tokens</p>

            {!solanaWallet ? (
              <button
                onClick={connectPhantomWallet}
                style={styles.btnPrimary}
                disabled={processing}
              >
                连接 Phantom 钱包
              </button>
            ) : (
              <>
                <div style={styles.walletInfo}>
                  <span>✅ 钱包已连接</span>
                  <span style={{ fontSize: '12px' }}>
                    {solanaWallet.publicKey.toString().slice(0, 8)}...
                  </span>
                  <button
                    onClick={() => {
                      solanaWallet.disconnect();
                      setSolanaWallet(null);
                    }}
                    style={styles.btnSmall}
                  >
                    断开
                  </button>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>
                    接收地址
                    <span style={{ fontSize: '12px', color: '#666', marginLeft: '10px' }}>
                      (官方收款地址)
                    </span>
                  </label>
                  {defaultSolanaAddress ? (
                    <div style={{
                      ...styles.input,
                      backgroundColor: '#f5f5f5',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'space-between'
                    }}>
                      <span style={{ fontFamily: 'monospace', fontSize: '14px' }}>
                        {defaultSolanaAddress}
                      </span>
                      <button
                        onClick={() => {
                          navigator.clipboard.writeText(defaultSolanaAddress);
                          setMessage('✅ 地址已复制到剪贴板');
                          setMessageType('success');
                          setTimeout(() => {
                            if (messageType === 'success' && message.includes('已复制')) {
                              setMessage('');
                            }
                          }, 3000);
                        }}
                        style={{
                          padding: '4px 8px',
                          background: '#667eea',
                          color: 'white',
                          border: 'none',
                          borderRadius: '4px',
                          fontSize: '12px',
                          cursor: 'pointer',
                        }}
                        type="button"
                      >
                        复制
                      </button>
                    </div>
                  ) : (
                    <div style={{
                      ...styles.input,
                      backgroundColor: '#fff3cd',
                      color: '#856404',
                      border: '1px solid #ffeeba',
                    }}>
                      ⚠️ 未配置收款地址，请联系管理员
                    </div>
                  )}
                  <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
                    请确保向此官方地址转账，其他地址转账将不被确认
                  </div>
                </div>

                <div style={styles.formGroup}>
                  <label style={styles.label}>支付金额 (SOL)</label>
                  <input
                    type="number"
                    value={solAmount}
                    onChange={(e) => setSolAmount(e.target.value)}
                    style={styles.input}
                    min={minimumAmounts.SOL}
                    step="0.01"
                    placeholder={`最小 ${minimumAmounts.SOL} SOL`}
                    disabled={processing}
                  />
                  <div style={{ fontSize: '12px', color: '#666', marginTop: '5px' }}>
                    最小支付金额：{minimumAmounts.SOL} SOL
                  </div>
                </div>

                <div style={styles.preview}>
                  <div>
                    <span>支付金额: </span>
                    <strong>{parseFloat(solAmount || 0).toFixed(4)} SOL</strong>
                  </div>
                  <div>
                    <span>将获得: </span>
                    <strong style={styles.previewAmount}>
                      {Math.round(parseFloat(solAmount || 0) * exchangeRates.SOL)} tokens
                    </strong>
                  </div>
                </div>

                <button
                  onClick={handleSolanaPayment}
                  disabled={processing || !solAmount || parseFloat(solAmount) < minimumAmounts.SOL}
                  style={{
                    ...styles.btnPrimary,
                    ...(processing || !solAmount || parseFloat(solAmount) < minimumAmounts.SOL ? styles.btnDisabled : {})
                  }}
                >
                  {processing ? '处理中...' : `支付 ${parseFloat(solAmount || 0).toFixed(4)} SOL`}
                </button>
              </>
            )}

            <div style={styles.testInfo}>
              <strong>使用说明:</strong><br />
              1. 连接 Phantom 钱包<br />
              2. 输入要支付的 SOL 数量<br />
              3. 点击支付按钮<br />
              4. 在钱包中确认交易
            </div>
          </>
        )}
      </div>
    </div>
  );
};

// ==================== 样式 ====================
const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    padding: '20px',
    fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
  },
  header: {
    textAlign: 'center',
    color: 'white',
    marginBottom: '30px',
  },
  userInfo: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '20px',
    marginTop: '20px',
  },
  quotaBadge: {
    background: 'rgba(255,255,255,0.2)',
    padding: '8px 16px',
    borderRadius: '20px',
  },
  tabs: {
    display: 'flex',
    justifyContent: 'center',
    gap: '10px',
    marginBottom: '30px',
  },
  tab: {
    padding: '12px 30px',
    background: 'white',
    border: 'none',
    borderRadius: '10px',
    fontSize: '16px',
    cursor: 'pointer',
    transition: 'all 0.3s',
    opacity: 0.8,
  },
  tabActive: {
    opacity: 1,
    transform: 'scale(1.05)',
    boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
  },
  card: {
    maxWidth: '500px',
    margin: '0 auto',
    background: 'white',
    borderRadius: '20px',
    padding: '30px',
    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
  },
  authCard: {
    maxWidth: '400px',
    margin: '100px auto',
    background: 'white',
    borderRadius: '20px',
    padding: '40px',
    textAlign: 'center',
    boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
  },
  loadingCard: {
    maxWidth: '400px',
    margin: '100px auto',
    background: 'white',
    borderRadius: '20px',
    padding: '40px',
    textAlign: 'center',
  },
  subtitle: {
    color: '#666',
    marginBottom: '20px',
  },
  formGroup: {
    marginBottom: '20px',
  },
  label: {
    display: 'block',
    marginBottom: '8px',
    color: '#333',
    fontWeight: '500',
  },
  input: {
    width: '100%',
    padding: '12px',
    border: '2px solid #e0e0e0',
    borderRadius: '8px',
    fontSize: '16px',
    outline: 'none',
    transition: 'border 0.3s',
    boxSizing: 'border-box',
  },
  cardElement: {
    padding: '12px',
    border: '2px solid #e0e0e0',
    borderRadius: '8px',
    minHeight: '44px',
    transition: 'all 0.3s',
    backgroundColor: '#fff',
    boxSizing: 'border-box',
  },
  cardElementDisabled: {
    backgroundColor: '#f5f5f5',
    cursor: 'not-allowed',
  },
  preview: {
    background: '#f0f9ff',
    padding: '15px',
    borderRadius: '8px',
    marginBottom: '20px',
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  previewAmount: {
    fontSize: '20px',
    color: '#667eea',
  },
  btnPrimary: {
    width: '100%',
    padding: '15px',
    background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    color: 'white',
    border: 'none',
    borderRadius: '8px',
    fontSize: '16px',
    fontWeight: 'bold',
    cursor: 'pointer',
    transition: 'all 0.3s',
  },
  btnDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
  btnSmall: {
    padding: '4px 12px',
    background: '#ff4444',
    color: 'white',
    border: 'none',
    borderRadius: '4px',
    fontSize: '12px',
    cursor: 'pointer',
  },
  alert: {
    maxWidth: '500px',
    margin: '0 auto 20px',
    padding: '15px',
    borderRadius: '8px',
    textAlign: 'left',
    whiteSpace: 'pre-line',
    lineHeight: '1.6',
  },
  alertSuccess: {
    background: '#d4edda',
    color: '#155724',
  },
  alertError: {
    background: '#f8d7da',
    color: '#721c24',
  },
  alertInfo: {
    background: '#d1ecf1',
    color: '#0c5460',
  },
  walletInfo: {
    background: '#f0f9ff',
    padding: '12px',
    borderRadius: '8px',
    marginBottom: '20px',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  testInfo: {
    marginTop: '20px',
    padding: '15px',
    background: '#f5f5f5',
    borderRadius: '8px',
    fontSize: '14px',
    color: '#666',
    lineHeight: '1.6',
  },
};

export default Payment2;