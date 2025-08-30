import React, { useState } from 'react';
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

const Aboutus2Mobile = () => {
  const [activeStrategy, setActiveStrategy] = useState(0);
  const [expandedFeature, setExpandedFeature] = useState(null);

  // AlphaShout inspired color palette
  const colors = {
    primary: '#003d7a',
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

  const features = [
    {
      icon: <BarChart2 size={24} />,
      title: "Equity Research & Analysis",
      shortDesc: "Real-time market data analysis with AI-powered risk assessment",
      fullDesc: "Real-time market data analysis with comprehensive financial statement interpretation. Deep-dive into quarterly earnings, revenue trends, and profitability metrics with AI-powered risk assessment.",
      points: [
        "Real-time price tracking",
        "Financial statement analysis",
        "AI risk identification",
        "Peer comparison analysis"
      ]
    },
    {
      icon: <PieChart size={24} />,
      title: "Portfolio Optimization",
      shortDesc: "Multi-asset portfolio construction with 8 strategies",
      fullDesc: "Multi-asset portfolio construction using advanced optimization algorithms. Coverage across US equities, European markets, and Asia-Pacific securities with customizable risk parameters.",
      points: [
        "8 optimization strategies",
        "Global asset coverage",
        "Monte Carlo simulation",
        "PDF report generation"
      ]
    },
    {
      icon: <Camera size={24} />,
      title: "Technical Analysis AI",
      shortDesc: "Screenshot-based chart analysis with AI interpretation",
      fullDesc: "Screenshot-based chart analysis with AI-powered technical indicator interpretation. Automated identification of support/resistance levels, MACD patterns, and volume anomalies.",
      points: [
        "Real-time screenshot capture",
        "MACD & momentum analysis",
        "Support/resistance detection",
        "Pattern recognition"
      ]
    }
  ];

  const techFeatures = [
    { icon: <Database size={28} />, title: "Real-Time Data", desc: "Direct market feeds" },
    { icon: <Brain size={28} />, title: "AI Models", desc: "Multi AI analysis" },
    { icon: <Lock size={28} />, title: "Bank Security", desc: "256-bit encryption" },
    { icon: <Cpu size={28} />, title: "Deep Analysis", desc: "30-second speed" }
  ];

  const getStrategyDetail = (index) => {
    const details = [
      "Risk Parity allocates capital such that each asset contributes equally to portfolio risk, ensuring balanced diversification.",
      "Sharpe Ratio optimization maximizes risk-adjusted returns by finding the optimal balance between returns and volatility.",
      "Minimum Variance strategy constructs portfolios with the lowest possible volatility for risk-averse investors.",
      "Target Return optimization identifies the minimum-risk portfolio that achieves specified return objectives.",
      "CAPM-adjusted optimization incorporates market beta and systematic risk factors into portfolio construction.",
      "Utility Maximization employs investor-specific utility functions to balance return objectives with risk aversion.",
      "Equal Weight strategy allocates capital uniformly across all assets for simple, unbiased diversification.",
      "Inverse Volatility weighting allocates capital inversely proportional to asset volatility for risk balance."
    ];
    return details[index];
  };

  return (
    <div style={{ 
      fontFamily: "'Helvetica Neue', Helvetica, Arial, sans-serif",
      backgroundColor: colors.gray[50],
      color: colors.gray[900],
      minHeight: '100vh'
    }}>
      
      {/* Hero Section - Mobile */}
      <section style={{
        backgroundColor: 'white',
        padding: '32px 16px 40px'
      }}>
        <h1 style={{
          fontSize: '30px',
          fontWeight: '300',
          lineHeight: '1.25',
          marginBottom: '16px',
          color: colors.gray[900]
        }}>
          Institutional-Grade
          <span style={{ 
            color: colors.primary,
            display: 'block',
            marginTop: '4px'
          }}>
            Investment Analytics
          </span>
          <span style={{
            fontSize: '26px',
            fontWeight: '300',
            display: 'block',
            marginTop: '4px'
          }}>
            for Everyone
          </span>
        </h1>
        
        <p style={{
          fontSize: '15px',
          lineHeight: '1.5',
          color: colors.gray[700],
          marginBottom: '24px'
        }}>
          Democratizing financial analysis with AI-powered tools previously exclusive to institutional investors. 
          Comprehensive equity research, portfolio optimization, and risk management at your fingertips.
        </p>
        
        <button 
          onClick={() => {
            window.dispatchEvent(new CustomEvent('navigate-to-stock-analysis', { 
              detail: { page: 'stockAnalysis' } 
            }));
          }}
          style={{
            backgroundColor: colors.primary,
            color: 'white',
            padding: '14px 24px',
            border: 'none',
            fontSize: '16px',
            fontWeight: '500',
            width: '100%',
            borderRadius: '6px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '8px'
          }}>
          Start Analysis
          <ChevronRight size={20} />
        </button>

        {/* Metrics - Mobile Grid */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: '1fr',
          gap: '16px',
          marginTop: '32px',
          paddingTop: '28px',
          borderTop: `1px solid ${colors.gray[300]}`
        }}>
          {metrics.map((metric, index) => (
            <div key={index} style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              padding: '12px 0',
              borderBottom: index < metrics.length - 1 ? `1px solid ${colors.gray[300]}` : 'none'
            }}>
              <div style={{
                fontSize: '13px',
                color: colors.gray[500],
                textTransform: 'uppercase',
                letterSpacing: '0.5px'
              }}>
                {metric.label}
              </div>
              <div style={{
                fontSize: '24px',
                fontWeight: '300',
                color: colors.primary
              }}>
                {metric.value}
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Core Features - Mobile Expandable Cards */}
      <section style={{
        padding: '32px 16px',
        backgroundColor: colors.gray[100]
      }}>
        <h2 style={{
          fontSize: '26px',
          fontWeight: '300',
          marginBottom: '8px',
          color: colors.gray[900]
        }}>
          Core Capabilities
        </h2>
        <p style={{
          fontSize: '14px',
          color: colors.gray[700],
          marginBottom: '24px'
        }}>
          Professional-grade tools powered by advanced algorithms
        </p>

        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '12px'
        }}>
          {features.map((feature, index) => (
            <div 
              key={index}
              style={{
                backgroundColor: 'white',
                borderRadius: '8px',
                overflow: 'hidden',
                border: `1px solid ${colors.gray[300]}`
              }}
            >
              <div 
                onClick={() => setExpandedFeature(expandedFeature === index ? null : index)}
                style={{
                  padding: '16px',
                  cursor: 'pointer'
                }}
              >
                <div style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '12px'
                }}>
                  <div style={{ color: colors.primary, marginTop: '2px' }}>
                    {feature.icon}
                  </div>
                  <div style={{ flex: 1 }}>
                    <h3 style={{
                      fontSize: '16px',
                      fontWeight: '500',
                      marginBottom: '6px',
                      color: colors.gray[900]
                    }}>
                      {feature.title}
                    </h3>
                    <p style={{
                      fontSize: '13px',
                      color: colors.gray[600],
                      lineHeight: '1.4'
                    }}>
                      {expandedFeature === index ? feature.fullDesc : feature.shortDesc}
                    </p>
                  </div>
                  <ChevronRight 
                    size={20} 
                    style={{
                      color: colors.gray[400],
                      transform: expandedFeature === index ? 'rotate(90deg)' : 'none',
                      transition: 'transform 0.2s'
                    }}
                  />
                </div>
              </div>
              
              {expandedFeature === index && (
                <div style={{
                  padding: '0 16px 16px 52px',
                  borderTop: `1px solid ${colors.gray[200]}`
                }}>
                  <ul style={{ listStyle: 'none', padding: 0, margin: '12px 0 0 0' }}>
                    {feature.points.map((point, pointIndex) => (
                      <li key={pointIndex} style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        gap: '8px', 
                        marginBottom: '8px' 
                      }}>
                        <CheckCircle size={14} style={{ color: colors.success, flexShrink: 0 }} />
                        <span style={{ fontSize: '13px', color: colors.gray[700] }}>{point}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Portfolio Strategies - Mobile Horizontal Scroll */}
      <section style={{
        padding: '32px 16px',
        backgroundColor: 'white'
      }}>
        <h2 style={{
          fontSize: '26px',
          fontWeight: '300',
          marginBottom: '8px',
          color: colors.gray[900]
        }}>
          Portfolio Optimization
        </h2>
        <p style={{
          fontSize: '14px',
          color: colors.gray[700],
          marginBottom: '20px'
        }}>
          8 institutional-grade strategies for different risk profiles
        </p>

        {/* Strategy pills - Wrappable Grid */}
        <div style={{
          display: 'flex',
          flexWrap: 'wrap',
          gap: '8px',
          marginBottom: '20px'
        }}>
          {strategies.map((strategy, index) => (
            <button
              key={index}
              onClick={() => setActiveStrategy(index)}
              style={{
                padding: '8px 16px',
                backgroundColor: activeStrategy === index ? colors.primary : 'white',
                color: activeStrategy === index ? 'white' : colors.gray[700],
                border: `1px solid ${activeStrategy === index ? colors.primary : colors.gray[300]}`,
                borderRadius: '20px',
                fontSize: '13px',
                fontWeight: activeStrategy === index ? '500' : '400',
                transition: 'all 0.2s',
                flex: '0 0 auto'
              }}
            >
              {strategy.name}
            </button>
          ))}
        </div>

        {/* Strategy Details Card */}
        <div style={{
          backgroundColor: colors.gray[50],
          padding: '20px',
          borderRadius: '8px',
          border: `1px solid ${colors.gray[300]}`
        }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: '500',
            marginBottom: '8px',
            color: colors.primary
          }}>
            {strategies[activeStrategy].name}
          </h3>
          <p style={{
            fontSize: '12px',
            color: colors.gray[500],
            marginBottom: '12px',
            fontStyle: 'italic'
          }}>
            {strategies[activeStrategy].description}
          </p>
          <p style={{
            fontSize: '14px',
            lineHeight: '1.6',
            color: colors.gray[700],
            marginBottom: '16px'
          }}>
            {getStrategyDetail(activeStrategy)}
          </p>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '16px',
            paddingTop: '16px',
            borderTop: `1px solid ${colors.gray[300]}`
          }}>
            <div>
              <div style={{ fontSize: '11px', color: colors.gray[500], marginBottom: '4px', textTransform: 'uppercase' }}>
                Best For
              </div>
              <div style={{ fontSize: '13px', color: colors.gray[900] }}>
                {activeStrategy === 0 && "Multi-asset portfolios"}
                {activeStrategy === 1 && "Performance maximization"}
                {activeStrategy === 2 && "Conservative investors"}
                {activeStrategy === 3 && "Income strategies"}
                {activeStrategy === 4 && "Market-aligned"}
                {activeStrategy === 5 && "Personalized allocation"}
                {activeStrategy === 6 && "Benchmark strategies"}
                {activeStrategy === 7 && "Risk-balanced"}
              </div>
            </div>
            <div>
              <div style={{ fontSize: '11px', color: colors.gray[500], marginBottom: '4px', textTransform: 'uppercase' }}>
                Risk Level
              </div>
              <div style={{ fontSize: '13px', color: colors.gray[900] }}>
                {activeStrategy === 0 && "Moderate"}
                {activeStrategy === 1 && "Moderate-High"}
                {activeStrategy === 2 && "Low"}
                {activeStrategy === 3 && "Variable"}
                {activeStrategy === 4 && "Market-dependent"}
                {activeStrategy === 5 && "Customizable"}
                {activeStrategy === 6 && "Moderate"}
                {activeStrategy === 7 && "Low-Moderate"}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Technology - Mobile Grid */}
      <section style={{
        padding: '32px 16px',
        backgroundColor: colors.gray[100]
      }}>
        <h2 style={{
          fontSize: '26px',
          fontWeight: '300',
          marginBottom: '8px',
          textAlign: 'center',
          color: colors.gray[900]
        }}>
          Technology Infrastructure
        </h2>
        <p style={{
          fontSize: '14px',
          color: colors.gray[700],
          marginBottom: '24px',
          textAlign: 'center'
        }}>
          Enterprise-grade infrastructure with institutional data sources
        </p>

        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(2, 1fr)',
          gap: '16px'
        }}>
          {techFeatures.map((tech, index) => (
            <div key={index} style={{
              backgroundColor: 'white',
              padding: '20px',
              borderRadius: '8px',
              textAlign: 'center',
              border: `1px solid ${colors.gray[300]}`
            }}>
              <div style={{ color: colors.primary, marginBottom: '12px' }}>
                {tech.icon}
              </div>
              <h4 style={{ 
                fontSize: '14px', 
                fontWeight: '500', 
                marginBottom: '4px',
                color: colors.gray[900]
              }}>
                {tech.title}
              </h4>
              <p style={{ 
                fontSize: '12px', 
                color: colors.gray[500] 
              }}>
                {tech.desc}
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* Pricing - Mobile */}
      <section style={{
        padding: '32px 16px 40px',
        backgroundColor: 'white'
      }}>
        <h2 style={{
          fontSize: '26px',
          fontWeight: '300',
          marginBottom: '8px',
          textAlign: 'center',
          color: colors.gray[900]
        }}>
          Transparent Pricing
        </h2>
        <p style={{
          fontSize: '14px',
          color: colors.gray[700],
          marginBottom: '24px',
          textAlign: 'center'
        }}>
          Pay only for what you use. No subscriptions, no hidden fees.
        </p>

        {/* Pricing Card */}
        <div style={{
          backgroundColor: colors.gray[50],
          padding: '24px',
          borderRadius: '8px',
          border: `1px solid ${colors.gray[300]}`,
          marginBottom: '20px'
        }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: '400',
            marginBottom: '16px',
            color: colors.gray[900],
            textAlign: 'center'
          }}>
            Token-Based Pricing
          </h3>
          
          <div style={{
            fontSize: '36px',
            fontWeight: '300',
            color: colors.primary,
            marginBottom: '4px',
            textAlign: 'center'
          }}>
            $0.10
          </div>
          <div style={{
            fontSize: '14px',
            color: colors.gray[500],
            marginBottom: '20px',
            textAlign: 'center'
          }}>
            per token
          </div>
          
          <p style={{
            fontSize: '13px',
            color: colors.gray[700],
            marginBottom: '20px',
            lineHeight: '1.5',
            textAlign: 'center'
          }}>
            Our mission is democratizing financial analysis, not profit maximization.
          </p>

          <div style={{
            backgroundColor: 'white',
            padding: '16px',
            borderRadius: '6px',
            marginBottom: '20px'
          }}>
            <div style={{ fontSize: '13px', fontWeight: '500', marginBottom: '12px', color: colors.gray[900] }}>
              Typical Usage:
            </div>
            {[
              { service: 'Stock Analysis', tokens: '~3 tokens' },
              { service: 'Deep Financial Report', tokens: '~2 tokens' },
              { service: 'Portfolio Optimization', tokens: '~5 tokens' },
              { service: 'Technical Chart Analysis', tokens: '~1 token' }
            ].map((item, index) => (
              <div key={index} style={{ 
                display: 'flex', 
                justifyContent: 'space-between',
                padding: '8px 0',
                fontSize: '12px',
                borderBottom: index < 3 ? `1px solid ${colors.gray[200]}` : 'none'
              }}>
                <span style={{ color: colors.gray[700] }}>{item.service}</span>
                <span style={{ fontWeight: '500', color: colors.gray[900] }}>{item.tokens}</span>
              </div>
            ))}
          </div>

          <button style={{
            backgroundColor: colors.primary,
            color: 'white',
            padding: '14px',
            border: 'none',
            fontSize: '16px',
            fontWeight: '500',
            width: '100%',
            borderRadius: '6px'
          }}>
            Start Free Trial
          </button>
        </div>

        {/* Features Card */}
        <div style={{
          padding: '24px',
          backgroundColor: colors.primary,
          color: 'white',
          borderRadius: '8px'
        }}>
          <h4 style={{
            fontSize: '16px',
            fontWeight: '400',
            marginBottom: '16px'
          }}>
            All Features Included
          </h4>
          <div style={{
            display: 'grid',
            gridTemplateColumns: '1fr',
            gap: '10px'
          }}>
            {[
              'Real-time market data',
              'AI-powered analysis',
              'PDF report exports',
              'Global market coverage',
              'Technical indicators',
              '24/7 availability'
            ].map((feature, index) => (
              <div key={index} style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '8px'
              }}>
                <CheckCircle size={16} />
                <span style={{ fontSize: '13px' }}>{feature}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Mission Statement */}
        <div style={{
          marginTop: '24px',
          padding: '20px',
          backgroundColor: colors.gray[50],
          border: `1px solid ${colors.gray[300]}`,
          borderRadius: '8px',
          textAlign: 'center'
        }}>
          <p style={{
            fontSize: '13px',
            color: colors.gray[700],
            lineHeight: '1.6'
          }}>
            <strong>Our Mission:</strong> Level the playing field between retail and institutional investors 
            by providing access to professional-grade analytical tools at accessible prices.
          </p>
        </div>
      </section>
    </div>
  );
};

export default Aboutus2Mobile;