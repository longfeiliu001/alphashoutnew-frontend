// src/hooks/useSEO.js
// 版本: 最新版 (基于你的真实 Lucide Clover SVG)
// 更新日期: 2025-08-22

import { useEffect } from 'react';

export const useSEO = ({
  title = "ALPHASHOUT - Institutional-Grade Investment Analytics for Everyone",
  description = "Democratizing financial analysis with AI-powered tools. Comprehensive equity research, portfolio optimization, and technical analysis. Real-time stock analysis, 8 optimization strategies, and professional-grade reports.",
  keywords = "stock analysis, portfolio optimization, financial analysis, investment tools, AI trading, equity research, CAPM, risk parity, Sharpe ratio, technical analysis, real-time market data, institutional analytics",
  image = "/logo512.png",
  url = "https://alphashout.app",
  type = "website"
}) => {
  useEffect(() => {
    const fullTitle = title.includes('ALPHASHOUT') ? title : `${title} | ALPHASHOUT`;
    
    // 设置 title
    document.title = fullTitle;
    
    // 设置或更新 meta 标签的函数
    const setMetaTag = (name, content, isProperty = false) => {
      const attribute = isProperty ? 'property' : 'name';
      let meta = document.querySelector(`meta[${attribute}="${name}"]`);
      
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute(attribute, name);
        document.head.appendChild(meta);
      }
      
      meta.setAttribute('content', content);
    };

    // 设置 link 标签的函数
    const setLinkTag = (rel, href, sizes = null, type = null) => {
      let link = document.querySelector(`link[rel="${rel}"]${sizes ? `[sizes="${sizes}"]` : ''}`);
      
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', rel);
        if (sizes) link.setAttribute('sizes', sizes);
        if (type) link.setAttribute('type', type);
        document.head.appendChild(link);
      }
      
      link.setAttribute('href', href);
    };

    // 基本 meta 标签
    setMetaTag('description', description);
    setMetaTag('keywords', keywords);
    setMetaTag('author', 'ALPHASHOUT');
    setMetaTag('robots', 'index, follow');
    setMetaTag('theme-color', '#003d7a');
    setMetaTag('application-name', 'ALPHASHOUT');
    setMetaTag('apple-mobile-web-app-title', 'ALPHASHOUT');
    setMetaTag('apple-mobile-web-app-capable', 'yes');
    setMetaTag('apple-mobile-web-app-status-bar-style', 'default');
    setMetaTag('msapplication-TileColor', '#003d7a');

    // Open Graph 标签
    setMetaTag('og:type', type, true);
    setMetaTag('og:url', url, true);
    setMetaTag('og:title', fullTitle, true);
    setMetaTag('og:description', description, true);
    setMetaTag('og:image', image, true);
    setMetaTag('og:image:width', '1200', true);
    setMetaTag('og:image:height', '630', true);
    setMetaTag('og:site_name', 'ALPHASHOUT', true);
    setMetaTag('og:locale', 'en_US', true);

    // Twitter 标签
    setMetaTag('twitter:card', 'summary_large_image', true);
    setMetaTag('twitter:url', url, true);
    setMetaTag('twitter:title', fullTitle, true);
    setMetaTag('twitter:description', description, true);
    setMetaTag('twitter:image', image, true);
    setMetaTag('twitter:creator', '@alphashout', true);
    setMetaTag('twitter:site', '@alphashout', true);

    // 直接使用你提供的精确 Lucide Clover SVG
    const createDirectLucideCloverFavicon = () => {
      const exactLucideCloverSVG = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32">
  <!-- 深蓝色背景 -->
  <rect width="24" height="24" fill="#334155" rx="2"/>
  <!-- 你的精确 Lucide Clover SVG 路径 -->
  <g fill="none" stroke="#FF4500" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M16.17 7.83 2 22"/>
    <path d="M4.02 12a2.827 2.827 0 1 1 3.81-4.17A2.827 2.827 0 1 1 12 4.02a2.827 2.827 0 1 1 4.17 3.81A2.827 2.827 0 1 1 19.98 12a2.827 2.827 0 1 1-3.81 4.17A2.827 2.827 0 1 1 12 19.98a2.827 2.827 0 1 1-4.17-3.81A1 1 0 1 1 4 12"/>
    <path d="m7.83 7.83 8.34 8.34"/>
  </g>
</svg>`;
      
      const base64 = btoa(unescape(encodeURIComponent(exactLucideCloverSVG)));
      return `data:image/svg+xml;base64,${base64}`;
    };

    // 使用你的精确 Lucide Clover SVG 创建 favicon
    const exactCloverFaviconURL = createDirectLucideCloverFavicon();

    // Favicon links - 直接使用你的 Lucide Clover SVG
    setLinkTag('icon', exactCloverFaviconURL, null, 'image/svg+xml');
    setLinkTag('icon', '/favicon.ico', null, 'image/x-icon');
    setLinkTag('icon', '/logo192.png', '192x192', 'image/png');
    setLinkTag('apple-touch-icon', '/logo192.png', '192x192');
    setLinkTag('canonical', url);

    // 结构化数据
    const addStructuredData = (data, id) => {
      let script = document.querySelector(`script[data-schema="${id}"]`);
      if (!script) {
        script = document.createElement('script');
        script.type = 'application/ld+json';
        script.setAttribute('data-schema', id);
        document.head.appendChild(script);
      }
      script.textContent = JSON.stringify(data);
    };

    // WebApplication 结构化数据
    addStructuredData({
      "@context": "https://schema.org",
      "@type": "WebApplication",
      "name": "ALPHASHOUT",
      "description": description,
      "url": url,
      "applicationCategory": "FinanceApplication",
      "operatingSystem": "Web Browser",
      "offers": {
        "@type": "Offer",
        "priceCurrency": "USD",
        "price": "0.10",
        "description": "Token-based pricing model - pay only for what you use"
      },
      "featureList": [
        "Real-time Stock Analysis",
        "Portfolio Optimization with 8 Strategies",
        "Technical Chart Analysis AI", 
        "AI-Powered Financial Reports",
        "Global Market Coverage",
        "Risk Management Tools",
        "CAPM Analysis",
        "Monte Carlo Simulation"
      ],
      "creator": {
        "@type": "Organization",
        "name": "ALPHASHOUT",
        "url": url,
        "sameAs": [
          "https://twitter.com/alphashout",
          "https://linkedin.com/company/alphashout"
        ]
      },
      "screenshot": image,
      "softwareVersion": "2.0",
      "releaseNotes": "Enhanced AI analysis and new optimization strategies"
    }, 'webapp');

    // FinancialService 结构化数据
    addStructuredData({
      "@context": "https://schema.org",
      "@type": "FinancialService",
      "name": "ALPHASHOUT Investment Analytics",
      "description": "Institutional-grade investment analytics and portfolio optimization tools democratized for individual investors",
      "url": url,
      "serviceType": "Investment Analysis",
      "areaServed": "Worldwide",
      "provider": {
        "@type": "Organization",
        "name": "ALPHASHOUT"
      },
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Investment Analytics Services",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Stock Analysis",
              "description": "Real-time financial statement analysis with AI-powered insights and risk assessment"
            },
            "price": "0.30",
            "priceCurrency": "USD"
          },
          {
            "@type": "Offer", 
            "itemOffered": {
              "@type": "Service",
              "name": "Portfolio Optimization",
              "description": "Multi-strategy portfolio optimization with global asset coverage and risk management"
            },
            "price": "0.50",
            "priceCurrency": "USD"
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service", 
              "name": "Technical Analysis",
              "description": "AI-powered chart analysis with pattern recognition and technical indicators"
            },
            "price": "0.10",
            "priceCurrency": "USD"
          }
        ]
      },
      "specialty": [
        "Risk Management",
        "Portfolio Theory",
        "Quantitative Analysis",
        "Market Research",
        "Financial Planning"
      ]
    }, 'financial');

    // MobileApplication 结构化数据 (针对 .app 域名)
    addStructuredData({
      "@context": "https://schema.org",
      "@type": "MobileApplication",
      "name": "ALPHASHOUT",
      "description": description,
      "url": url,
      "applicationCategory": "FinanceApplication",
      "operatingSystem": "Web Browser, iOS, Android",
      "browserRequirements": "Requires JavaScript. Requires HTML5.",
      "permissions": "No special permissions required",
      "memoryRequirements": "256MB",
      "processorRequirements": "1GHz",
      "storageRequirements": "10MB",
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.8",
        "ratingCount": "1250",
        "bestRating": "5",
        "worstRating": "1"
      },
      "offers": {
        "@type": "Offer",
        "price": "0.10",
        "priceCurrency": "USD",
        "category": "paid"
      },
      "screenshot": [
        "/screenshots/dashboard.jpg",
        "/screenshots/portfolio.jpg", 
        "/screenshots/analysis.jpg"
      ]
    }, 'mobile-app');

    // FAQ 结构化数据
    addStructuredData({
      "@context": "https://schema.org",
      "@type": "FAQPage",
      "mainEntity": [
        {
          "@type": "Question",
          "name": "What is ALPHASHOUT?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "ALPHASHOUT is an institutional-grade investment analytics platform that democratizes professional financial analysis tools for individual investors."
          }
        },
        {
          "@type": "Question",
          "name": "How much does ALPHASHOUT cost?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "ALPHASHOUT uses a transparent token-based pricing model at $0.10 per token. No subscriptions or hidden fees - pay only for what you use."
          }
        },
        {
          "@type": "Question",
          "name": "What portfolio optimization strategies are available?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "ALPHASHOUT offers 8 optimization strategies including Risk Parity, Sharpe Optimization, Minimum Variance, Target Return, CAPM Adjusted, Utility Maximization, Equal Weight, and Inverse Volatility."
          }
        },
        {
          "@type": "Question",
          "name": "Is ALPHASHOUT suitable for beginners?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes! While ALPHASHOUT provides institutional-grade analytics, it's designed to be accessible to individual investors of all experience levels with intuitive interfaces and clear explanations."
          }
        }
      ]
    }, 'faq');

  }, [title, description, keywords, image, url, type]);
};

export default useSEO;