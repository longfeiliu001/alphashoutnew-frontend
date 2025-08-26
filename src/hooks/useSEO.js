// src/hooks/useSEO.js
// 版本: 最终修正版 (价格修正 + 路径优化)
// 更新日期: 2025-08-26

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
    setMetaTag('og:image', `${url}${image}`, true);
    setMetaTag('og:image:width', '1200', true);
    setMetaTag('og:image:height', '630', true);
    setMetaTag('og:site_name', 'ALPHASHOUT', true);
    setMetaTag('og:locale', 'en_US', true);

    // Twitter 标签
    setMetaTag('twitter:card', 'summary_large_image', true);
    setMetaTag('twitter:url', url, true);
    setMetaTag('twitter:title', fullTitle, true);
    setMetaTag('twitter:description', description, true);
    setMetaTag('twitter:image', `${url}${image}`, true);

    // Lucide Clover SVG Favicon
    const createLucideCloverFavicon = () => {
      const svgContent = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32">
  <rect width="24" height="24" fill="#334155" rx="3"/>
  <g fill="none" stroke="#FF4500" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
    <path d="M16.17 7.83 2 22"/>
    <path d="M4.02 12a2.827 2.827 0 1 1 3.81-4.17A2.827 2.827 0 1 1 12 4.02a2.827 2.827 0 1 1 4.17 3.81A2.827 2.827 0 1 1 19.98 12a2.827 2.827 0 1 1-3.81 4.17A2.827 2.827 0 1 1 12 19.98a2.827 2.827 0 1 1-4.17-3.81A1 1 0 1 1 4 12"/>
    <path d="m7.83 7.83 8.34 8.34"/>
  </g>
</svg>`.trim();
      
      const base64 = btoa(unescape(encodeURIComponent(svgContent)));
      return `data:image/svg+xml;base64,${base64}`;
    };

    // Favicon links
    const cloverFaviconURL = createLucideCloverFavicon();
    setLinkTag('icon', cloverFaviconURL, null, 'image/svg+xml');
    setLinkTag('icon', '/favicon.ico', null, 'image/x-icon');
    setLinkTag('apple-touch-icon', '/logo192.png');
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
        "description": "Token-based pricing - pay only for what you use"
      },
      "featureList": [
        "Real-time Stock Analysis",
        "Portfolio Optimization with 8 Strategies",
        "Technical Chart Analysis AI", 
        "AI-Powered Financial Reports",
        "Historical Market Data Analysis",
        "Risk Management Tools",
        "CAPM Analysis",
        "Monte Carlo Simulation"
      ],
      "creator": {
        "@type": "Organization",
        "name": "ALPHASHOUT",
        "url": url
      },
      // 移除screenshot字段 - 不需要应用截图
      "softwareVersion": "2.0"
    }, 'webapp');

    // FinancialService 结构化数据 (修正价格)
    addStructuredData({
      "@context": "https://schema.org",
      "@type": "FinancialService",
      "name": "ALPHASHOUT Investment Analytics",
      "description": "Institutional-grade investment analytics and portfolio optimization tools",
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
              "description": "Comprehensive financial statement analysis with AI insights"
            },
            "price": "0.30",
            "priceCurrency": "USD"
          },
          {
            "@type": "Offer", 
            "itemOffered": {
              "@type": "Service",
              "name": "Portfolio Optimization",
              "description": "Multi-strategy portfolio optimization with risk management"
            },
            "price": "0.50",
            "priceCurrency": "USD"
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service", 
              "name": "Technical Analysis",
              "description": "AI-powered chart analysis and pattern recognition"
            },
            "price": "0.20",
            "priceCurrency": "USD"
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service", 
              "name": "Historical Data Analysis",
              "description": "Comprehensive historical market data with backtesting"
            },
            "price": "0.20",
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

    // Organization 结构化数据
    addStructuredData({
      "@context": "https://schema.org",
      "@type": "Organization",
      "name": "ALPHASHOUT",
      "url": url,
      "logo": `${url}/logo512.png`,
      "description": "Democratizing institutional-grade investment analytics",
      "foundingDate": "2024",
      "industry": "Financial Technology",
      "numberOfEmployees": "1-10",
      "address": {
        "@type": "PostalAddress",
        "addressCountry": "SG"
      },
      "contactPoint": {
        "@type": "ContactPoint",
        "contactType": "Customer Service",
        "availableLanguage": "English"
      }
    }, 'organization');

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
            "text": "ALPHASHOUT uses a transparent token-based pricing model at $0.10 per token. Stock analysis costs 3 tokens ($0.30), portfolio optimization costs 5 tokens ($0.50), and technical analysis costs 2 tokens ($0.20)."
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
          "name": "Is my data secure on ALPHASHOUT?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, ALPHASHOUT implements bank-grade security measures including SSL encryption, secure authentication, and does not store sensitive personal financial information."
          }
        }
      ]
    }, 'faq');

    // BreadcrumbList 结构化数据
    const currentPath = window.location.pathname;
    const breadcrumbItems = [];
    
    breadcrumbItems.push({
      "@type": "ListItem",
      "position": 1,
      "name": "Home",
      "item": url
    });

    if (currentPath !== '/') {
      const pathSegments = currentPath.split('/').filter(segment => segment);
      const pageName = pathSegments[0]?.split('-').map(word => 
        word.charAt(0).toUpperCase() + word.slice(1)
      ).join(' ') || 'Page';
      
      breadcrumbItems.push({
        "@type": "ListItem",
        "position": 2,
        "name": pageName,
        "item": `${url}${currentPath}`
      });
    }

    addStructuredData({
      "@context": "https://schema.org",
      "@type": "BreadcrumbList",
      "itemListElement": breadcrumbItems
    }, 'breadcrumb');

  }, [title, description, keywords, image, url, type]);
};

export default useSEO;