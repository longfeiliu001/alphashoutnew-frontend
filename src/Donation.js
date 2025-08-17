import React, { useState } from 'react';

export default function PayPalDonationBox() {
  const [selectedAmount, setSelectedAmount] = useState(10);
  const [customAmount, setCustomAmount] = useState('');
  const [isCustom, setIsCustom] = useState(false);
  const [currency, setCurrency] = useState('EUR');

  const currencySymbols = {
    USD: '$',
    EUR: '€'
  };

  const presetAmounts = {
    USD: [5, 10, 20, 100],
    EUR: [5, 10, 20, 100]
  };

  const handleAmountSelect = (amount) => {
    setSelectedAmount(amount);
    setIsCustom(false);
    setCustomAmount('');
  };

  const handleCustomAmount = (value) => {
    setCustomAmount(value);
    setIsCustom(true);
    setSelectedAmount(0);
  };

  const handleCurrencyChange = (newCurrency) => {
    setCurrency(newCurrency);
    setSelectedAmount(10);
    setCustomAmount('');
    setIsCustom(false);
  };

  const getDonationAmount = () => {
    return isCustom ? parseFloat(customAmount) || 0 : selectedAmount;
  };

  const getCurrentSymbol = () => {
    return currencySymbols[currency];
  };

  const handleDonate = () => {
    const amount = getDonationAmount();
    if (amount > 0) {
      // In a real implementation, you would integrate with PayPal's SDK
      // For now, we'll show an alert
      alert(`Redirecting to PayPal for ${getCurrentSymbol()}${amount.toFixed(2)} ${currency} donation...`);
      
      // Example PayPal redirect (you'd replace with actual PayPal integration)
       window.open(`https://www.paypal.com/donate/?hosted_button_id=RHGR72GMN6GZW&amount=10&currency_code=EUR`, '_blank');
    }
  };

  const styles = {
    container: {
      maxWidth: '400px',
      margin: '0 auto',
      padding: '20px',
      fontFamily: 'Arial, sans-serif'
    },
    card: {
      borderRadius: '8px',
      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
      overflow: 'hidden',
      backgroundColor: 'white',
      border: '1px solid #e8e8e8'
    },
    header: {
      background: 'linear-gradient(135deg, #1890ff 0%, #096dd9 100%)',
      color: 'white',
      padding: '20px 24px'
    },
    headerTitle: {
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      marginBottom: '8px',
      fontSize: '20px',
      fontWeight: 'bold',
      margin: '0'
    },
    headerSubtitle: {
      color: 'rgba(255, 255, 255, 0.85)',
      fontSize: '14px',
      margin: '0'
    },
    content: {
      padding: '24px'
    },
    amountHeader: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '16px'
    },
    amountTitle: {
      fontSize: '16px',
      fontWeight: 'bold',
      margin: '0'
    },
    currencySelect: {
      padding: '6px 12px',
      borderRadius: '6px',
      border: '1px solid #d9d9d9',
      fontSize: '14px',
      backgroundColor: 'white',
      cursor: 'pointer'
    },
    presetGrid: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: '12px',
      marginBottom: '16px'
    },
    presetButton: {
      padding: '20px',
      fontSize: '18px',
      fontWeight: 'bold',
      border: '1px solid #d9d9d9',
      borderRadius: '6px',
      backgroundColor: 'white',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      textAlign: 'center'
    },
    presetButtonSelected: {
      border: '2px solid #1890ff',
      backgroundColor: '#f0f9ff',
      color: '#1890ff'
    },
    customInput: {
      width: '100%',
      padding: '12px 16px',
      fontSize: '16px',
      border: '1px solid #d9d9d9',
      borderRadius: '6px',
      marginBottom: '24px',
      boxSizing: 'border-box'
    },
    customInputActive: {
      borderColor: '#1890ff',
      backgroundColor: '#f0f9ff'
    },
    summaryCard: {
      backgroundColor: '#fafafa',
      border: '1px solid #f0f0f0',
      borderRadius: '6px',
      padding: '16px',
      marginBottom: '24px'
    },
    summaryRow: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    summaryLabel: {
      color: '#8c8c8c',
      fontSize: '14px'
    },
    summaryAmount: {
      fontSize: '24px',
      fontWeight: 'bold',
      color: '#1890ff',
      margin: '0'
    },
    donateButton: {
      width: '100%',
      padding: '16px',
      fontSize: '16px',
      fontWeight: 'bold',
      border: 'none',
      borderRadius: '6px',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      marginBottom: '16px'
    },
    donateButtonActive: {
      backgroundColor: '#faad14',
      color: 'white'
    },
    donateButtonDisabled: {
      backgroundColor: '#d9d9d9',
      color: '#8c8c8c',
      cursor: 'not-allowed'
    },
    securityNotice: {
      textAlign: 'center',
      marginBottom: '16px'
    },
    securityText: {
      fontSize: '12px',
      color: '#8c8c8c'
    },
    footer: {
      backgroundColor: '#fafafa',
      padding: '16px 24px',
      borderTop: '1px solid #f0f0f0',
      textAlign: 'center'
    },
    footerText: {
      margin: '0',
      fontSize: '12px',
      color: '#8c8c8c'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        {/* Header */}
        <div style={styles.header}>
          <h2 style={styles.headerTitle}>
            ❤️ Support Our Cause
          </h2>
          <p style={styles.headerSubtitle}>
            Your donation helps us continue our mission and make a difference.
          </p>
        </div>

        {/* Content */}
        <div style={styles.content}>
          {/* Amount Selection Header */}
          <div style={styles.amountHeader}>
            <h3 style={styles.amountTitle}>Select Donation Amount</h3>
            <select
              value={currency}
              onChange={(e) => handleCurrencyChange(e.target.value)}
              style={styles.currencySelect}
            >
              <option value="EUR">EUR</option>
              <option value="USD">USD</option>
            </select>
          </div>

          {/* Preset Amounts */}
          <div style={styles.presetGrid}>
            {presetAmounts[currency].map((amount) => (
              <button
                key={amount}
                onClick={() => handleAmountSelect(amount)}
                style={{
                  ...styles.presetButton,
                  ...(selectedAmount === amount && !isCustom ? styles.presetButtonSelected : {})
                }}
              >
                {getCurrentSymbol()}{amount}
              </button>
            ))}
          </div>

          {/* Custom Amount */}
          <input
            type="number"
            value={customAmount}
            onChange={(e) => handleCustomAmount(e.target.value)}
            placeholder={`Enter custom amount in ${getCurrentSymbol()}`}
            min="1"
            step="0.01"
            style={{
              ...styles.customInput,
              ...(isCustom ? styles.customInputActive : {})
            }}
          />

          {/* Donation Summary */}
          <div style={styles.summaryCard}>
            <div style={styles.summaryRow}>
              <span style={styles.summaryLabel}>Donation Amount:</span>
              <h3 style={styles.summaryAmount}>
                {getCurrentSymbol()}{getDonationAmount().toFixed(2)} {currency}
              </h3>
            </div>
          </div>

          {/* Donate Button */}
          <button
            onClick={handleDonate}
            disabled={getDonationAmount() <= 0}
            style={{
              ...styles.donateButton,
              ...(getDonationAmount() > 0 ? styles.donateButtonActive : styles.donateButtonDisabled)
            }}
          >
            💳 Donate with PayPal
          </button>

          {/* Security Notice */}
          <div style={styles.securityNotice}>
            <p style={styles.securityText}>
              🔒 Secure donation powered by PayPal
            </p>
          </div>
        </div>

        {/* Footer */}
        <div style={styles.footer}>
          <p style={styles.footerText}>
            Thank you for your generous support! Your donation makes a real impact.
          </p>
        </div>
      </div>
    </div>
  );
}