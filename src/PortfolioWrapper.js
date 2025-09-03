import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Spin } from 'antd';

// 导入各个组件
import Portfoliocapm7 from './Portfoliocapm7';
import Portfoliocapm7Demo from './Portfoliocapm7Demo';
import PortfoliocapmMobileDemo from './PortfoliocapmMobileDemo';
// 如果有移动端的正式版本，也导入进来
 import PortfoliocapmMobile from './PortfoliocapmMobile';

// Configure axios defaults
axios.defaults.withCredentials = true;
axios.defaults.baseURL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

export default function PortfolioWrapper() {
  const [isAuthenticated, setIsAuthenticated] = useState(null); // null 表示正在检查
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // 检测是否为移动设备
  const checkIfMobile = () => {
    const userAgent = navigator.userAgent || navigator.vendor || window.opera;
    const mobileRegex = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i;
    const isMobileDevice = mobileRegex.test(userAgent) || window.innerWidth <= 768;
    setIsMobile(isMobileDevice);
  };

  // 检查认证状态
  const checkAuthStatus = async () => {
    try {
      const response = await axios.get('/api/auth/me');
      if (response.data.user) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    } catch (error) {
      console.log('User not authenticated');
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
  };

  // 初始化
  useEffect(() => {
    checkIfMobile();
    checkAuthStatus();

    // 监听窗口大小变化
    const handleResize = () => {
      checkIfMobile();
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 正在加载时显示加载动画
  if (isLoading) {
    return (
      <div style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '100vh',
        background: 'linear-gradient(135deg, #f5f7fa 0%, #e9ecef 100%)'
      }}>
        <Spin size="large" tip="Loading..." />
      </div>
    );
  }

  // 根据设备类型和认证状态返回相应组件
  if (isMobile) {
    // 移动端
    if (isAuthenticated) {
      // 已登录 - 显示移动端正式版本
      return <PortfoliocapmMobile />;
    } else {
      // 未登录 - 显示移动端 Demo
      return <PortfoliocapmMobileDemo />;
    }
  } else {
    // 桌面端
    if (isAuthenticated) {
      // 已登录 - 显示正式版本
      return <Portfoliocapm7 />;
    } else {
      // 未登录 - 显示桌面端 Demo
      return <Portfoliocapm7Demo />;
    }
  }
}