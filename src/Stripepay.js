import React, { useState } from 'react';
import { Send, AlertCircle, CheckCircle, CreditCard, Loader2 } from 'lucide-react';

// 配置
const STRIPE_PUBLISHABLE_KEY = 'pk_test_51Rt1K541uegzirzzc3vXFOjx2rZZjlWfVIP2DUwXqD28PZc7Lr1BZolTO0A24MTzzlbaiPILrIZX4ykcp56JJOod00i8T6WPAy';
const API_BASE_URL = 'http://localhost:3001'; // 后端地址

// 添加CSS样式
const styleSheet = document.createElement("style");
styleSheet.textContent = `
  /* 全局样式 */
  * {
    box-sizing: border-box;
  }

  /* 容器样式 */
  .payment-container {
    min-height: 100vh;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 20px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  }

  .payment-wrapper {
    max-width: 450px;
    margin: 50px auto 0;
  }

  .payment-card {
    background-color: white;
    border-radius: 16px;
    box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    overflow: hidden;
  }

  /* 头部样式 */
  .payment-header {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    padding: 24px;
    color: white;
  }

  .payment-title {
    font-size: 24px;
    font-weight: bold;
    display: flex;
    align-items: center;
    gap: 8px;
    margin: 0;
  }

  .payment-subtitle {
    color: rgba(255, 255, 255, 0.9);
    margin-top: 4px;
    font-size: 14px;
  }

  /* 表单样式 */
  .payment-form {
    padding: 24px;
  }

  .field-group {
    margin-bottom: 20px;
  }

  .field-label {
    display: block;
    font-size: 14px;
    font-weight: 500;
    color: #374151;
    margin-bottom: 8px;
  }

  .field-label-icon {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .required-star {
    color: #ef4444;
  }

  /* 输入框样式 */
  .field-input {
    width: 100%;
    padding: 10px 16px;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    font-size: 16px;
    transition: all 0.2s;
    outline: none;
  }

  .field-input:focus {
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  /* Stripe Card Element 样式 */
  .stripe-card-element {
    padding: 12px;
    border: 1px solid #d1d5db;
    border-radius: 8px;
    transition: all 0.2s;
    min-height: 44px;
  }

  .stripe-card-element.StripeElement--focus {
    border-color: #667eea;
    box-shadow: 0 0 0 3px rgba(102, 126, 234, 0.1);
  }

  .stripe-card-element.loading {
    background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
    background-size: 200% 100%;
    animation: loading 1.5s infinite;
  }

  /* 帮助文字 */
  .help-text {
    margin-top: 8px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size: 12px;
    color: #6b7280;
  }

  .help-text-icon {
    display: flex;
    align-items: center;
    gap: 4px;
  }

  /* 按钮样式 */
  .submit-button {
    width: 100%;
    padding: 12px 24px;
    border-radius: 8px;
    font-size: 16px;
    font-weight: 500;
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
    color: white;
    border: none;
    cursor: pointer;
    transition: all 0.2s;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
  }

  .submit-button:hover:not(:disabled) {
    transform: translateY(-1px);
    box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
  }

  .submit-button:disabled {
    background: #9ca3af;
    cursor: not-allowed;
  }

  /* 提示框样式 */
  .alert {
    padding: 16px;
    border-radius: 8px;
    display: flex;
    align-items: flex-start;
    gap: 8px;
    margin-bottom: 20px;
    font-size: 14px;
  }

  .alert-success {
    background-color: #d1fae5;
    color: #065f46;
  }

  .alert-error {
    background-color: #fee2e2;
    color: #991b1b;
  }

  .alert-warning {
    background-color: #fef3c7;
    color: #92400e;
  }

  .alert-info {
    background-color: #dbeafe;
    color: #1e40af;
  }

  .alert-content {
    flex: 1;
  }

  .alert-subtitle {
    font-size: 12px;
    margin-top: 4px;
  }

  /* 加载框 */
  .loading-box {
    padding: 16px;
    background-color: #dbeafe;
    border-radius: 8px;
    color: #1e40af;
    font-size: 14px;
    margin-bottom: 20px;
    display: flex;
    align-items: center;
    gap: 8px;
  }

  /* 交易详情 */
  .transaction-details {
    margin-top: 12px;
    padding: 12px;
    background-color: #f3f4f6;
    border-radius: 6px;
    font-size: 12px;
  }

  .transaction-title {
    font-weight: 500;
    margin-bottom: 8px;
  }

  .detail-row {
    display: flex;
    justify-content: space-between;
    margin-bottom: 4px;
  }

  .detail-value {
    font-family: monospace;
    font-size: 11px;
  }

  .detail-status {
    color: #059669;
  }

  /* 测试卡片信息 */
  .test-cards {
    margin-top: 20px;
    padding: 16px;
    background-color: #f9fafb;
    border-radius: 8px;
  }

  .test-cards-title {
    font-size: 14px;
    font-weight: 500;
    color: #374151;
    margin-bottom: 8px;
  }

  .test-cards-list {
    font-size: 12px;
    color: #4b5563;
    line-height: 1.6;
    list-style: none;
    padding: 0;
    margin: 0;
  }

  .test-example {
    margin-top: 12px;
    padding: 12px;
    background-color: white;
    border: 1px solid #e5e7eb;
    border-radius: 6px;
  }

  .test-example-title {
    font-size: 12px;
    font-weight: 500;
    color: #374151;
    margin-bottom: 4px;
  }

  .test-example-content {
    font-size: 12px;
    color: #4b5563;
    margin: 0;
  }

  .test-example-hint {
    font-size: 12px;
    color: #6b7280;
    margin-top: 4px;
  }

  /* 页脚 */
  .payment-footer {
    text-align: center;
    font-size: 12px;
    color: #6b7280;
    margin-top: 16px;
  }

  .payment-footer p {
    margin: 0 0 4px 0;
  }

  /* 动画 */
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }

  @keyframes loading {
    0% { background-position: 200% 0; }
    100% { background-position: -200% 0; }
  }

  .spinner {
    animation: spin 1s linear infinite;
    width: 20px;
    height: 20px;
  }
`;
document.head.appendChild(styleSheet);

const MoneyTransferPage = () => {
  // 状态管理
  const [amount, setAmount] = useState('');
  const [recipientEmail, setRecipientEmail] = useState('');
  const [description, setDescription] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });
  const [stripe, setStripe] = useState(null);
  const [elements, setElements] = useState(null);
  const [isStripeLoaded, setIsStripeLoaded] = useState(false);
  const [transactionDetails, setTransactionDetails] = useState(null);
  const [connectionError, setConnectionError] = useState(false);

  // 加载 Stripe
  React.useEffect(() => {
    if (window.Stripe) {
      initializeStripe();
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://js.stripe.com/v3/';
    script.async = true;
    script.onload = () => {
      initializeStripe();
    };
    script.onerror = () => {
      setMessage({ type: 'error', text: '无法加载 Stripe。请检查网络连接。' });
    };
    document.body.appendChild(script);

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  const initializeStripe = () => {
    if (window.Stripe && STRIPE_PUBLISHABLE_KEY !== 'pk_test_YOUR_PUBLISHABLE_KEY_HERE') {
      const stripeInstance = window.Stripe(STRIPE_PUBLISHABLE_KEY);
      setStripe(stripeInstance);
      
      const elementsInstance = stripeInstance.elements();
      setElements(elementsInstance);
      setIsStripeLoaded(true);
    }
  };

  // 挂载 Card Element
  React.useEffect(() => {
    if (elements && isStripeLoaded) {
      const cardElement = elements.create('card', {
        style: {
          base: {
            fontSize: '16px',
            color: '#424770',
            '::placeholder': {
              color: '#aab7c4',
            },
            padding: '10px 12px',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          },
          invalid: {
            color: '#9e2146',
            iconColor: '#9e2146'
          },
        },
        hidePostalCode: false,
      });
      
      const cardContainer = document.getElementById('card-element');
      if (cardContainer) {
        cardElement.mount('#card-element');
        
        cardElement.on('change', (event) => {
          if (event.error) {
            setMessage({ type: 'error', text: event.error.message });
          } else if (event.complete) {
            setMessage({ type: '', text: '' });
          }
        });

        cardElement.on('focus', () => {
          document.getElementById('card-element').classList.add('StripeElement--focus');
        });

        cardElement.on('blur', () => {
          document.getElementById('card-element').classList.remove('StripeElement--focus');
        });
      }
    }
  }, [elements, isStripeLoaded]);

  // 检查后端连接
  React.useEffect(() => {
    checkBackendConnection();
  }, []);

  const checkBackendConnection = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/health`);
      const data = await response.json();
      if (data.status === 'ok') {
        setConnectionError(false);
      } else {
        setConnectionError(true);
      }
    } catch (error) {
      setConnectionError(true);
      console.error('后端连接失败:', error);
    }
  };

  // 处理支付
  const handleSubmit = async () => {
    setMessage({ type: '', text: '' });
    setTransactionDetails(null);

    if (!stripe || !elements) {
      setMessage({ type: 'error', text: 'Stripe 尚未加载完成，请稍候...' });
      return;
    }

    if (!recipientEmail || !amount) {
      setMessage({ type: 'error', text: '请填写所有必填字段' });
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(recipientEmail)) {
      setMessage({ type: 'error', text: '请输入有效的电子邮件地址' });
      return;
    }

    if (parseFloat(amount) <= 0) {
      setMessage({ type: 'error', text: '金额必须大于 0' });
      return;
    }

    if (parseFloat(amount) > 999999) {
      setMessage({ type: 'error', text: '金额超过最大限制' });
      return;
    }

    setIsProcessing(true);

    try {
      const cardElement = elements.getElement('card');

      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: {
          email: recipientEmail,
        },
      });

      if (error) {
        setMessage({ type: 'error', text: error.message });
        setIsProcessing(false);
        return;
      }

      console.log('Payment Method 创建成功:', paymentMethod.id);

      try {
        const response = await fetch(`${API_BASE_URL}/api/confirm-payment`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            paymentMethodId: paymentMethod.id,
            amount: parseFloat(amount),
            customerEmail: recipientEmail,
            description: description || `转账给 ${recipientEmail}`
          })
        });

        const result = await response.json();
        console.log('后端响应:', result);

        if (result.success) {
          setMessage({
            type: 'success',
            text: '支付成功！'
          });
          
          setTransactionDetails({
            id: result.paymentIntent.id,
            amount: result.paymentIntent.amount,
            currency: result.paymentIntent.currency.toUpperCase(),
            created: result.paymentIntent.created,
            status: result.paymentIntent.status
          });
          
          setAmount('');
          setRecipientEmail('');
          setDescription('');
          elements.getElement('card').clear();
          
        } else if (result.requiresAction) {
          const { error: confirmError } = await stripe.confirmCardPayment(result.clientSecret);
          
          if (confirmError) {
            setMessage({
              type: 'error',
              text: confirmError.message
            });
          } else {
            setMessage({
              type: 'success',
              text: '支付已通过验证并成功完成！'
            });
          }
        } else {
          setMessage({
            type: 'error',
            text: result.error || '支付失败，请重试'
          });
        }
      } catch (fetchError) {
        console.error('后端调用失败:', fetchError);
        setMessage({
          type: 'error',
          text: '无法连接到支付服务器。请确保后端服务正在运行。'
        });
      }
      
    } catch (err) {
      setMessage({ type: 'error', text: `错误: ${err.message}` });
      console.error('Stripe 错误:', err);
    }

    setIsProcessing(false);
  };

  return (
    <div className="payment-container">
      <div className="payment-wrapper">
        <div className="payment-card">
          <div className="payment-header">
            <h1 className="payment-title">
              <Send size={24} />
              Stripe 支付系统
            </h1>
            <p className="payment-subtitle">安全快速的在线支付</p>
          </div>

          <div className="payment-form">
            {/* Stripe 加载状态 */}
            {!isStripeLoaded && STRIPE_PUBLISHABLE_KEY !== 'pk_test_YOUR_PUBLISHABLE_KEY_HERE' && (
              <div className="loading-box">
                <Loader2 size={20} className="spinner" />
                正在加载 Stripe...
              </div>
            )}

            {/* 配置警告 */}
            {STRIPE_PUBLISHABLE_KEY === 'pk_test_YOUR_PUBLISHABLE_KEY_HERE' && (
              <div className="alert alert-warning">
                <AlertCircle size={20} />
                <span>请在代码中配置你的 Stripe Publishable Key</span>
              </div>
            )}

            {/* 后端连接警告 */}
            {connectionError && (
              <div className="alert alert-info">
                <AlertCircle size={20} />
                <div className="alert-content">
                  <div>后端服务未连接</div>
                  <div className="alert-subtitle">
                    请确保后端服务运行在 {API_BASE_URL}
                  </div>
                </div>
              </div>
            )}

            {/* 消息提示 */}
            {message.text && (
              <div className={`alert ${message.type === 'success' ? 'alert-success' : 'alert-error'}`}>
                {message.type === 'success' ? (
                  <CheckCircle size={20} />
                ) : (
                  <AlertCircle size={20} />
                )}
                <span>{message.text}</span>
              </div>
            )}

            {/* 交易详情 */}
            {transactionDetails && (
              <div className="transaction-details">
                <div className="transaction-title">交易详情</div>
                <div className="detail-row">
                  <span>交易 ID:</span>
                  <span className="detail-value">{transactionDetails.id}</span>
                </div>
                <div className="detail-row">
                  <span>金额:</span>
                  <span>${transactionDetails.amount} {transactionDetails.currency}</span>
                </div>
                <div className="detail-row">
                  <span>状态:</span>
                  <span className="detail-status">{transactionDetails.status}</span>
                </div>
                <div className="detail-row">
                  <span>时间:</span>
                  <span>{new Date(transactionDetails.created).toLocaleString('zh-CN')}</span>
                </div>
              </div>
            )}

            {/* 收款人邮箱 */}
            <div className="field-group">
              <label className="field-label">
                收款人邮箱 <span className="required-star">*</span>
              </label>
              <input
                type="email"
                value={recipientEmail}
                onChange={(e) => setRecipientEmail(e.target.value)}
                className="field-input"
                placeholder="recipient@example.com"
              />
            </div>

            {/* 金额 */}
            <div className="field-group">
              <label className="field-label">
                金额 (USD) <span className="required-star">*</span>
              </label>
              <input
                type="number"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                className="field-input"
                placeholder="0.00"
                step="0.01"
                min="0.01"
              />
            </div>

            {/* 描述 */}
            <div className="field-group">
              <label className="field-label">
                付款说明（可选）
              </label>
              <input
                type="text"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="field-input"
                placeholder="例如：咨询费、商品购买等"
              />
            </div>

            {/* 卡片信息 */}
            <div className="field-group">
              <label className="field-label field-label-icon">
                <CreditCard size={16} />
                卡片信息 <span className="required-star">*</span>
              </label>
              <div 
                id="card-element" 
                className={`stripe-card-element ${!isStripeLoaded ? 'loading' : ''}`}
              >
                {/* Stripe Card Element 将在此挂载 */}
              </div>
              <div className="help-text">
                <span>输入顺序：卡号 → 有效期 → CVV → 邮编</span>
                <span className="help-text-icon">
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor">
                    <rect x="3" y="6" width="18" height="12" rx="2" />
                    <rect x="7" y="12" width="5" height="3" />
                  </svg>
                  CVV 在卡背面
                </span>
              </div>
            </div>

            {/* 提交按钮 */}
            <button
              onClick={handleSubmit}
              disabled={isProcessing || !isStripeLoaded || connectionError}
              className="submit-button"
            >
              {isProcessing ? (
                <>
                  <Loader2 size={20} className="spinner" />
                  处理中...
                </>
              ) : (
                <>
                  <Send size={20} />
                  确认支付
                </>
              )}
            </button>

            {/* 测试卡片信息 */}
            <div className="test-cards">
              <h4 className="test-cards-title">测试卡号：</h4>
              <ul className="test-cards-list">
                <li>• 成功: 4242 4242 4242 4242</li>
                <li>• 需要验证: 4000 0025 0000 3155</li>
                <li>• 拒绝: 4000 0000 0000 0002</li>
                <li>• 资金不足: 4000 0000 0000 9995</li>
              </ul>
              <div className="test-example">
                <p className="test-example-title">测试输入示例：</p>
                <p className="test-example-content">
                  4242 4242 4242 4242 | 12/25 | 123 | 12345
                </p>
                <p className="test-example-hint">
                  卡号 | 有效期 | CVV | 邮编（美国卡需要）
                </p>
              </div>
            </div>

            {/* 页脚信息 */}
            <div className="payment-footer">
              <p><strong>安全提示：</strong>支付信息通过 Stripe 加密传输</p>
              <p>本页面仅供测试使用，不会产生真实扣款</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MoneyTransferPage;