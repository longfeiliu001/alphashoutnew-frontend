import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  BarChart2, 
  Shield, 
  Globe, 
  FileText, 
  Camera, 
  ChevronRight,
  Download,
  PieChart,
  Activity,
  Target,
  Briefcase,
  Award,
  ArrowUpRight,
  CheckCircle,
  Brain,
  Database,
  Lock,
  Users,
  Cpu,
  LineChart
} from 'lucide-react';

const LandingPage = () => {
  const [activeStrategy, setActiveStrategy] = useState(0);
  const [hoveredCard, setHoveredCard] = useState(null);

  // AlphaShout inspired color palette
  const colors = {
    primary: '#003d7a',      // Deep blue
    primaryLight: '#005eb8', 
    secondary: '#0084d4',    
    accent: '#00b4e5',       
    success: '#6abf4b',      
    gray: {
      900: '#1a1a1a',
      700: '#4a4a4a',
      500: '#767676',
      300: '#d4d7dc',
      100: '#f5f5f5',
      50: '#fafafa'
    }
  };

  const strategies = [
    { name: "Risk Parity", description: "Equal risk contribution across assets" },
    { name: "Sharpe Optimization", description: "Maximize risk-adjusted returns" },
    { name: "Minimum Variance", description: "Minimize portfolio volatility" },
    { name: "Target Return", description: "Optimize for specific return objectives" },
    { name: "CAPM Adjusted", description: "Market benchmark optimization" },
    { name: "Utility Maximization", description: "Risk-averse utility function" },
    { name: "Equal Weight", description: "Simple balanced allocation" },
    { name: "Inverse Volatility", description: "Volatility-weighted distribution" }
  ];

  const metrics = [
    { value: "$50B+", label: "Assets Analyzed" },
    { value: "99.9%", label: "Uptime" },
    { value: "30s", label: "Deep Analysis Speed" }
  ];

  return (
    <div style={{ 
      fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
      backgroundColor: colors.gray[50],
      color: colors.gray[900],
      minHeight: '100vh'
    }}>
      
      {/* Hero Section */}
      <section style={{
        backgroundColor: 'white',
        padding: '80px 24px'
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto'
        }}>
          <div style={{
            maxWidth: '800px'
          }}>
            <h1 style={{
              fontSize: '56px',
              fontWeight: '300',
              lineHeight: '1.2',
              marginBottom: '24px',
              color: colors.gray[900]
            }}>
              Institutional-Grade Investment
              <span style={{ color: colors.primary }}> Analytics for Everyone</span>
            </h1>
            <p style={{
              fontSize: '20px',
              lineHeight: '1.6',
              color: colors.gray[700],
              marginBottom: '40px',
              fontWeight: '300'
            }}>
              Democratizing financial analysis with AI-powered tools previously exclusive to institutional investors. 
              Comprehensive equity research, portfolio optimization, and risk management at your fingertips.
            </p>
            <div style={{ marginBottom: '60px' }}>
              <button 
                onClick={() => {
                  // Navigate to Stock Analysis page
                  window.dispatchEvent(new CustomEvent('navigate-to-stock-analysis', { 
                    detail: { page: 'stockAnalysis' } 
                  }));
                }}
                style={{
                  backgroundColor: colors.primary,
                  color: 'white',
                  padding: '14px 32px',
                  border: 'none',
                  fontSize: '16px',
                  fontWeight: '500',
                  cursor: 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}>
                Start Analysis
                <ChevronRight size={20} />
              </button>
            </div>
          </div>

          {/* Metrics */}
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '40px',
            paddingTop: '40px',
            borderTop: `1px solid ${colors.gray[300]}`
          }}>
            {metrics.map((metric, index) => (
              <div key={index}>
                <div style={{
                  fontSize: '36px',
                  fontWeight: '300',
                  color: colors.primary,
                  marginBottom: '8px'
                }}>
                  {metric.value}
                </div>
                <div style={{
                  fontSize: '14px',
                  color: colors.gray[500],
                  textTransform: 'uppercase',
                  letterSpacing: '0.5px'
                }}>
                  {metric.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Core Features */}
      <section id="features" style={{
        padding: '80px 24px',
        backgroundColor: colors.gray[100]
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto'
        }}>
          <div style={{ marginBottom: '60px' }}>
            <h2 style={{
              fontSize: '40px',
              fontWeight: '300',
              marginBottom: '16px',
              color: colors.gray[900]
            }}>
              Core Capabilities
            </h2>
            <p style={{
              fontSize: '18px',
              color: colors.gray[700],
              maxWidth: '600px'
            }}>
              Professional-grade tools powered by advanced algorithms and machine learning
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(3, 1fr)',
            gap: '32px'
          }}>
            {/* Feature 1 */}
            <div 
              style={{
                backgroundColor: 'white',
                padding: '40px',
                border: `1px solid ${colors.gray[300]}`,
                transition: 'all 0.3s',
                cursor: 'pointer',
                transform: hoveredCard === 0 ? 'translateY(-4px)' : 'none',
                boxShadow: hoveredCard === 0 ? '0 8px 24px rgba(0,0,0,0.08)' : 'none'
              }}
              onMouseEnter={() => setHoveredCard(0)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <BarChart2 size={32} style={{ color: colors.primary, marginBottom: '24px' }} />
              <h3 style={{
                fontSize: '24px',
                fontWeight: '400',
                marginBottom: '16px',
                color: colors.gray[900]
              }}>
                Equity Research & Analysis
              </h3>
              <p style={{
                fontSize: '15px',
                lineHeight: '1.6',
                color: colors.gray[700],
                marginBottom: '24px'
              }}>
                Real-time market data analysis with comprehensive financial statement interpretation. 
                Deep-dive into quarterly earnings, revenue trends, and profitability metrics with AI-powered risk assessment.
              </p>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <CheckCircle size={16} style={{ color: colors.success }} />
                  <span style={{ fontSize: '14px', color: colors.gray[700] }}>Real-time price tracking</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <CheckCircle size={16} style={{ color: colors.success }} />
                  <span style={{ fontSize: '14px', color: colors.gray[700] }}>Financial statement analysis</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <CheckCircle size={16} style={{ color: colors.success }} />
                  <span style={{ fontSize: '14px', color: colors.gray[700] }}>AI risk identification</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle size={16} style={{ color: colors.success }} />
                  <span style={{ fontSize: '14px', color: colors.gray[700] }}>Peer comparison analysis</span>
                </li>
              </ul>
            </div>

            {/* Feature 2 */}
            <div 
              style={{
                backgroundColor: 'white',
                padding: '40px',
                border: `1px solid ${colors.gray[300]}`,
                transition: 'all 0.3s',
                cursor: 'pointer',
                transform: hoveredCard === 1 ? 'translateY(-4px)' : 'none',
                boxShadow: hoveredCard === 1 ? '0 8px 24px rgba(0,0,0,0.08)' : 'none'
              }}
              onMouseEnter={() => setHoveredCard(1)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <PieChart size={32} style={{ color: colors.primary, marginBottom: '24px' }} />
              <h3 style={{
                fontSize: '24px',
                fontWeight: '400',
                marginBottom: '16px',
                color: colors.gray[900]
              }}>
                Portfolio Optimization
              </h3>
              <p style={{
                fontSize: '15px',
                lineHeight: '1.6',
                color: colors.gray[700],
                marginBottom: '24px'
              }}>
                Multi-asset portfolio construction using advanced optimization algorithms. 
                Coverage across US equities, European markets, and Asia-Pacific securities with customizable risk parameters.
              </p>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <CheckCircle size={16} style={{ color: colors.success }} />
                  <span style={{ fontSize: '14px', color: colors.gray[700] }}>8 optimization strategies</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <CheckCircle size={16} style={{ color: colors.success }} />
                  <span style={{ fontSize: '14px', color: colors.gray[700] }}>Global asset coverage</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <CheckCircle size={16} style={{ color: colors.success }} />
                  <span style={{ fontSize: '14px', color: colors.gray[700] }}>Monte Carlo simulation</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle size={16} style={{ color: colors.success }} />
                  <span style={{ fontSize: '14px', color: colors.gray[700] }}>PDF report generation</span>
                </li>
              </ul>
            </div>

            {/* Feature 3 */}
            <div 
              style={{
                backgroundColor: 'white',
                padding: '40px',
                border: `1px solid ${colors.gray[300]}`,
                transition: 'all 0.3s',
                cursor: 'pointer',
                transform: hoveredCard === 2 ? 'translateY(-4px)' : 'none',
                boxShadow: hoveredCard === 2 ? '0 8px 24px rgba(0,0,0,0.08)' : 'none'
              }}
              onMouseEnter={() => setHoveredCard(2)}
              onMouseLeave={() => setHoveredCard(null)}
            >
              <Camera size={32} style={{ color: colors.primary, marginBottom: '24px' }} />
              <h3 style={{
                fontSize: '24px',
                fontWeight: '400',
                marginBottom: '16px',
                color: colors.gray[900]
              }}>
                Technical Analysis AI
              </h3>
              <p style={{
                fontSize: '15px',
                lineHeight: '1.6',
                color: colors.gray[700],
                marginBottom: '24px'
              }}>
                Screenshot-based chart analysis with AI-powered technical indicator interpretation. 
                Automated identification of support/resistance levels, MACD patterns, and volume anomalies.
              </p>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <CheckCircle size={16} style={{ color: colors.success }} />
                  <span style={{ fontSize: '14px', color: colors.gray[700] }}>Real-time screenshot capture</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <CheckCircle size={16} style={{ color: colors.success }} />
                  <span style={{ fontSize: '14px', color: colors.gray[700] }}>MACD & momentum analysis</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '12px' }}>
                  <CheckCircle size={16} style={{ color: colors.success }} />
                  <span style={{ fontSize: '14px', color: colors.gray[700] }}>Support/resistance detection</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle size={16} style={{ color: colors.success }} />
                  <span style={{ fontSize: '14px', color: colors.gray[700] }}>Pattern recognition</span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Portfolio Strategies */}
      <section id="strategies" style={{
        padding: '80px 24px',
        backgroundColor: 'white'
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto'
        }}>
          <div style={{ marginBottom: '60px' }}>
            <h2 style={{
              fontSize: '40px',
              fontWeight: '300',
              marginBottom: '16px',
              color: colors.gray[900]
            }}>
              Portfolio Optimization Strategies
            </h2>
            <p style={{
              fontSize: '18px',
              color: colors.gray[700],
              maxWidth: '600px'
            }}>
              Institutional-grade optimization methodologies tailored to different risk profiles
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 2fr',
            gap: '40px'
          }}>
            <div>
              {strategies.map((strategy, index) => (
                <div
                  key={index}
                  onClick={() => setActiveStrategy(index)}
                  style={{
                    padding: '20px',
                    marginBottom: '8px',
                    backgroundColor: activeStrategy === index ? colors.gray[100] : 'transparent',
                    borderLeft: activeStrategy === index ? `3px solid ${colors.primary}` : '3px solid transparent',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  <h4 style={{
                    fontSize: '16px',
                    fontWeight: '500',
                    marginBottom: '4px',
                    color: activeStrategy === index ? colors.primary : colors.gray[900]
                  }}>
                    {strategy.name}
                  </h4>
                  <p style={{
                    fontSize: '14px',
                    color: colors.gray[500]
                  }}>
                    {strategy.description}
                  </p>
                </div>
              ))}
            </div>

            <div style={{
              backgroundColor: colors.gray[50],
              padding: '40px',
              border: `1px solid ${colors.gray[300]}`
            }}>
              <h3 style={{
                fontSize: '28px',
                fontWeight: '400',
                marginBottom: '24px',
                color: colors.primary
              }}>
                {strategies[activeStrategy].name}
              </h3>
              <p style={{
                fontSize: '16px',
                lineHeight: '1.8',
                color: colors.gray[700],
                marginBottom: '32px'
              }}>
                {activeStrategy === 0 && "Risk Parity allocates capital such that each asset contributes equally to portfolio risk. This approach ensures diversification by balancing risk contributions rather than capital weights, particularly effective in multi-asset portfolios."}
                {activeStrategy === 1 && "Sharpe Ratio optimization maximizes risk-adjusted returns by finding the optimal balance between expected returns and volatility. This methodology identifies the portfolio composition that delivers the highest return per unit of risk taken."}
                {activeStrategy === 2 && "Minimum Variance strategy constructs portfolios with the lowest possible volatility for a given set of assets. Ideal for risk-averse investors seeking capital preservation while maintaining market exposure."}
                {activeStrategy === 3 && "Target Return optimization identifies the minimum-risk portfolio that achieves a specified return objective. This constraint-based approach is suitable for investors with specific income requirements or return targets."}
                {activeStrategy === 4 && "CAPM-adjusted optimization incorporates market beta and systematic risk factors into portfolio construction. This approach aligns portfolio weights with market equilibrium while considering individual asset alphas."}
                {activeStrategy === 5 && "Utility Maximization employs investor-specific utility functions to balance return objectives with risk aversion. This personalized approach incorporates individual risk tolerance into the optimization process."}
                {activeStrategy === 6 && "Equal Weight strategy allocates capital uniformly across all assets, providing simple diversification without optimization bias. This approach serves as a robust benchmark for more sophisticated strategies."}
                {activeStrategy === 7 && "Inverse Volatility weighting allocates capital inversely proportional to asset volatility. Lower volatility assets receive higher weights, creating a risk-balanced portfolio without correlation assumptions."}
              </p>
              
              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(2, 1fr)',
                gap: '24px',
                paddingTop: '24px',
                borderTop: `1px solid ${colors.gray[300]}`
              }}>
                <div>
                  <div style={{ fontSize: '14px', color: colors.gray[500], marginBottom: '8px' }}>BEST FOR</div>
                  <div style={{ fontSize: '15px', color: colors.gray[900] }}>
                    {activeStrategy === 0 && "Multi-asset portfolios"}
                    {activeStrategy === 1 && "Performance maximization"}
                    {activeStrategy === 2 && "Conservative investors"}
                    {activeStrategy === 3 && "Income-focused strategies"}
                    {activeStrategy === 4 && "Market-aligned portfolios"}
                    {activeStrategy === 5 && "Personalized allocation"}
                    {activeStrategy === 6 && "Benchmark strategies"}
                    {activeStrategy === 7 && "Risk-balanced allocation"}
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: '14px', color: colors.gray[500], marginBottom: '8px' }}>RISK LEVEL</div>
                  <div style={{ fontSize: '15px', color: colors.gray[900] }}>
                    {activeStrategy === 0 && "Moderate"}
                    {activeStrategy === 1 && "Moderate to High"}
                    {activeStrategy === 2 && "Low"}
                    {activeStrategy === 3 && "Variable"}
                    {activeStrategy === 4 && "Market-dependent"}
                    {activeStrategy === 5 && "Customizable"}
                    {activeStrategy === 6 && "Moderate"}
                    {activeStrategy === 7 && "Low to Moderate"}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technology */}
      <section style={{
        padding: '80px 24px',
        backgroundColor: colors.gray[100]
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{
              fontSize: '40px',
              fontWeight: '300',
              marginBottom: '16px',
              color: colors.gray[900]
            }}>
              Technology Infrastructure
            </h2>
            <p style={{
              fontSize: '18px',
              color: colors.gray[700],
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              Built on enterprise-grade infrastructure with institutional data sources
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(4, 1fr)',
            gap: '32px'
          }}>
            <div style={{ textAlign: 'center' }}>
              <Database size={40} style={{ color: colors.primary, marginBottom: '16px' }} />
              <h4 style={{ fontSize: '16px', fontWeight: '500', marginBottom: '8px' }}>Real-Time Data</h4>
              <p style={{ fontSize: '14px', color: colors.gray[500] }}>
                Direct market feeds with sub-second latency
              </p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <Brain size={40} style={{ color: colors.primary, marginBottom: '16px' }} />
              <h4 style={{ fontSize: '16px', fontWeight: '500', marginBottom: '8px' }}>AI Models</h4>
              <p style={{ fontSize: '14px', color: colors.gray[500] }}>
                Multi AI model powered analysis and insights
              </p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <Lock size={40} style={{ color: colors.primary, marginBottom: '16px' }} />
              <h4 style={{ fontSize: '16px', fontWeight: '500', marginBottom: '8px' }}>Bank-Grade Security</h4>
              <p style={{ fontSize: '14px', color: colors.gray[500] }}>
                256-bit encryption and SOC 2 compliance
              </p>
            </div>
            <div style={{ textAlign: 'center' }}>
              <Cpu size={40} style={{ color: colors.primary, marginBottom: '16px' }} />
              <h4 style={{ fontSize: '16px', fontWeight: '500', marginBottom: '8px' }}>Deep Analysis</h4>
              <p style={{ fontSize: '14px', color: colors.gray[500] }}>
                30-second comprehensive analysis
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section id="pricing" style={{
        padding: '80px 24px',
        backgroundColor: 'white'
      }}>
        <div style={{
          maxWidth: '1280px',
          margin: '0 auto'
        }}>
          <div style={{ textAlign: 'center', marginBottom: '60px' }}>
            <h2 style={{
              fontSize: '40px',
              fontWeight: '300',
              marginBottom: '16px',
              color: colors.gray[900]
            }}>
              Transparent Usage-Based Pricing
            </h2>
            <p style={{
              fontSize: '18px',
              color: colors.gray[700],
              maxWidth: '600px',
              margin: '0 auto'
            }}>
              Pay only for what you use. No subscriptions, no hidden fees.
            </p>
          </div>

          <div style={{
            display: 'grid',
            gridTemplateColumns: '2fr 1fr',
            gap: '40px',
            maxWidth: '900px',
            margin: '0 auto'
          }}>
            <div style={{
              backgroundColor: colors.gray[50],
              padding: '40px',
              border: `1px solid ${colors.gray[300]}`
            }}>
              <h3 style={{
                fontSize: '24px',
                fontWeight: '400',
                marginBottom: '24px',
                color: colors.gray[900]
              }}>
                Token-Based Pricing Model
              </h3>
              
              <div style={{
                fontSize: '36px',
                fontWeight: '300',
                color: colors.primary,
                marginBottom: '8px'
              }}>
                $0.10
                <span style={{ fontSize: '18px', color: colors.gray[500], marginLeft: '8px' }}>per token</span>
              </div>
              
              <p style={{
                fontSize: '15px',
                color: colors.gray[700],
                marginBottom: '32px',
                lineHeight: '1.6'
              }}>
                Our mission is democratizing financial analysis, not profit maximization. 
                Pricing covers infrastructure costs while keeping professional tools accessible to individual investors.
              </p>

              <div style={{ marginBottom: '32px' }}>
                <h4 style={{ fontSize: '16px', fontWeight: '500', marginBottom: '16px' }}>Typical Usage</h4>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: `1px solid ${colors.gray[300]}` }}>
                    <span style={{ color: colors.gray[700] }}>Stock Analysis</span>
                    <span style={{ fontWeight: '500' }}>~3 tokens</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: `1px solid ${colors.gray[300]}` }}>
                    <span style={{ color: colors.gray[700] }}>Deep Financial Report</span>
                    <span style={{ fontWeight: '500' }}>~2 tokens</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: `1px solid ${colors.gray[300]}` }}>
                    <span style={{ color: colors.gray[700] }}>Portfolio Optimization</span>
                    <span style={{ fontWeight: '500' }}>~5 tokens</span>
                  </div>
                  <div style={{ display: 'flex', justifyContent: 'space-between', paddingBottom: '8px', borderBottom: `1px solid ${colors.gray[300]}` }}>
                    <span style={{ color: colors.gray[700] }}>Technical Chart Analysis</span>
                    <span style={{ fontWeight: '500' }}>~1 token</span>
                  </div>
                </div>
              </div>

              <button style={{
                backgroundColor: colors.primary,
                color: 'white',
                padding: '12px 32px',
                border: 'none',
                fontSize: '16px',
                fontWeight: '500',
                cursor: 'pointer',
                width: '100%'
              }}>
                Start Free Trial
              </button>
            </div>

            <div style={{
              padding: '40px',
              backgroundColor: colors.primary,
              color: 'white'
            }}>
              <h4 style={{
                fontSize: '20px',
                fontWeight: '400',
                marginBottom: '24px'
              }}>
                Included Features
              </h4>
              <ul style={{ listStyle: 'none', padding: 0 }}>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                  <CheckCircle size={18} />
                  <span style={{ fontSize: '14px' }}>Real-time market data</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                  <CheckCircle size={18} />
                  <span style={{ fontSize: '14px' }}>AI-powered analysis</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                  <CheckCircle size={18} />
                  <span style={{ fontSize: '14px' }}>PDF report exports</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                  <CheckCircle size={18} />
                  <span style={{ fontSize: '14px' }}>Global market coverage</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '16px' }}>
                  <CheckCircle size={18} />
                  <span style={{ fontSize: '14px' }}>Technical indicators</span>
                </li>
                <li style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <CheckCircle size={18} />
                  <span style={{ fontSize: '14px' }}>24/7 availability</span>
                </li>
              </ul>
            </div>
          </div>

          <div style={{
            textAlign: 'center',
            marginTop: '40px',
            padding: '24px',
            backgroundColor: colors.gray[50],
            border: `1px solid ${colors.gray[300]}`,
            maxWidth: '600px',
            margin: '40px auto 0'
          }}>
            <p style={{
              fontSize: '15px',
              color: colors.gray[700],
              lineHeight: '1.6'
            }}>
              <strong>Our Mission:</strong> Level the playing field between retail and institutional investors 
              by providing access to professional-grade analytical tools at accessible prices.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default LandingPage;