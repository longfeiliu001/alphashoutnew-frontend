import React, { useState } from 'react';
import { User, Settings, LogOut, Bell, ChevronDown, Crown, Mail, Phone } from 'lucide-react';
import { Dropdown, Avatar, Badge, Button } from 'antd';
import { useAuth } from './AuthContext'; // 使用你现有的认证上下文

const EnhancedUserSection = () => {
  const { user, logout, isAuthenticated } = useAuth(); // 从你的认证上下文获取真实数据
  const [dropdownVisible, setDropdownVisible] = useState(false);

  // 如果用户未登录或没有用户数据，不显示任何内容
  if (!isAuthenticated || !user) {
    return null;
  }

  // 用户下拉菜单项
  const userMenuItems = [
    {
      key: 'profile',
      label: (
        <div style={{ 
          padding: '12px 8px',
          borderBottom: '1px solid rgba(255,255,255,0.1)',
          marginBottom: '8px'
        }}>
          <div style={{ 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px',
            marginBottom: '8px'
          }}>
            <Avatar 
              size={48} 
              src={user.avatar}
              style={{ 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: '2px solid rgba(255,255,255,0.3)'
              }}
            >
              {user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'}
            </Avatar>
            <div>
              <div style={{ 
                color: 'white', 
                fontWeight: '600',
                fontSize: '16px',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}>
                {user.name || 'User'}
                {user.isVip && <Crown size={14} color="#FFD700" />}
              </div>
              <div style={{ 
                color: 'rgba(255,255,255,0.7)', 
                fontSize: '12px',
                display: 'flex',
                alignItems: 'center',
                gap: '4px'
              }}>
                <div style={{
                  width: '6px',
                  height: '6px',
                  borderRadius: '50%',
                  background: user.isOnline ? '#10B981' : '#EF4444'
                }} />
                {user.isOnline ? 'Online' : 'Offline'}
              </div>
            </div>
          </div>
          {(user.email || user.phone) && (
            <div style={{ 
              fontSize: '12px', 
              color: 'rgba(255,255,255,0.6)',
              display: 'flex',
              flexDirection: 'column',
              gap: '4px'
            }}>
              {user.email && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Mail size={12} />
                  {user.email}
                </div>
              )}
              {user.phone && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <Phone size={12} />
                  {user.phone}
                </div>
              )}
            </div>
          )}
        </div>
      ),
      disabled: true
    },
    {
      key: 'settings',
      label: (
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px',
          color: 'white',
          fontSize: '14px'
        }}>
          <Settings size={16} />
          Account Settings
        </div>
      ),
    },
    {
      key: 'notifications',
      label: (
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px',
          color: 'white',
          justifyContent: 'space-between',
          fontSize: '14px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            <Bell size={16} />
            Notifications
          </div>
          {user.notifications > 0 && (
            <Badge 
              count={user.notifications} 
              size="small"
              style={{ 
                background: '#FF4500',
                fontSize: '10px'
              }}
            />
          )}
        </div>
      ),
    },
    {
      type: 'divider',
    },
    {
      key: 'logout',
      label: (
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '8px',
          color: '#FF6B6B',
          fontSize: '14px'
        }}>
          <LogOut size={16} />
          Sign Out
        </div>
      ),
      danger: true
    }
  ];

  // 处理菜单点击
  const handleMenuClick = ({ key }) => {
    switch (key) {
      case 'settings':
        // 触发设置页面导航
        console.log('Navigate to settings');
        break;
      case 'notifications':
        // 触发通知页面导航
        console.log('Navigate to notifications');
        break;
      case 'logout':
        // 调用登出函数
        if (logout) {
          logout();
        }
        break;
      default:
        break;
    }
    setDropdownVisible(false);
  };

  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      gap: '16px'
    }}>
      {/* 通知铃铛 */}
      <Badge count={user.notifications || 0} size="small">
        <Button
          type="text"
          icon={<Bell size={18} />}
          style={{
            color: 'rgba(255,255,255,0.8)',
            border: 'none',
            background: 'rgba(255,255,255,0.1)',
            borderRadius: '8px',
            width: '40px',
            height: '40px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            transition: 'all 0.3s ease'
          }}
          onMouseEnter={(e) => {
            e.target.style.background = 'rgba(255,255,255,0.2)';
            e.target.style.color = 'white';
          }}
          onMouseLeave={(e) => {
            e.target.style.background = 'rgba(255,255,255,0.1)';
            e.target.style.color = 'rgba(255,255,255,0.8)';
          }}
          onClick={() => {
            // 处理通知点击
            console.log('Show notifications');
          }}
        />
      </Badge>

      {/* 用户下拉菜单 */}
      <Dropdown
        menu={{
          items: userMenuItems,
          onClick: handleMenuClick,
          style: {
            background: 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
            border: '1px solid rgba(255,255,255,0.1)',
            borderRadius: '12px',
            boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
            backdropFilter: 'blur(10px)',
            minWidth: '280px',
            padding: '8px'
          }
        }}
        placement="bottomRight"
        arrow={{ pointAtCenter: true }}
        trigger={['click']}
        open={dropdownVisible}
        onOpenChange={setDropdownVisible}
      >
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          padding: '8px 12px',
          background: 'rgba(255,255,255,0.1)',
          borderRadius: '12px',
          cursor: 'pointer',
          transition: 'all 0.3s ease',
          border: '1px solid rgba(255,255,255,0.1)',
          backdropFilter: 'blur(10px)'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.background = 'rgba(255,255,255,0.2)';
          e.currentTarget.style.transform = 'translateY(-1px)';
          e.currentTarget.style.boxShadow = '0 4px 16px rgba(0,0,0,0.2)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.background = 'rgba(255,255,255,0.1)';
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow = 'none';
        }}>
          
          {/* 用户头像 */}
          <div style={{ position: 'relative' }}>
            <Avatar 
              size={36} 
              src={user.avatar}
              style={{ 
                background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                border: '2px solid rgba(255,255,255,0.3)',
                fontSize: '14px',
                fontWeight: '600'
              }}
            >
              {user.name ? user.name.split(' ').map(n => n[0]).join('').toUpperCase() : 'U'}
            </Avatar>
            
            {/* VIP 标识 */}
            {user.isVip && (
              <div style={{
                position: 'absolute',
                top: '-2px',
                right: '-2px',
                background: 'linear-gradient(135deg, #FFD700, #FFA500)',
                borderRadius: '50%',
                width: '16px',
                height: '16px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                border: '2px solid rgba(255,255,255,0.9)'
              }}>
                <Crown size={8} color="white" />
              </div>
            )}
            
            {/* 在线状态指示器 */}
            <div style={{
              position: 'absolute',
              bottom: '0px',
              right: '0px',
              width: '12px',
              height: '12px',
              borderRadius: '50%',
              background: user.isOnline ? '#10B981' : '#EF4444',
              border: '2px solid white',
              boxShadow: '0 0 0 1px rgba(0,0,0,0.1)'
            }} />
          </div>

          {/* 用户信息 */}
          <div style={{ 
            display: 'flex', 
            flexDirection: 'column',
            alignItems: 'flex-start'
          }}>
            <div style={{ 
              color: 'white', 
              fontWeight: '600',
              fontSize: '14px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              {user.name || 'User'}
              {user.isVip && <Crown size={12} color="#FFD700" />}
            </div>
            <div style={{ 
              color: 'rgba(255,255,255,0.7)', 
              fontSize: '12px',
              display: 'flex',
              alignItems: 'center',
              gap: '4px'
            }}>
              <div style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: user.isOnline ? '#10B981' : '#EF4444'
              }} />
              {user.isOnline ? 'Online' : 'Offline'}
            </div>
          </div>

          {/* 下拉箭头 */}
          <ChevronDown 
            size={16} 
            color="rgba(255,255,255,0.7)"
            style={{ 
              transition: 'transform 0.3s ease',
              marginLeft: 'auto',
              transform: dropdownVisible ? 'rotate(180deg)' : 'rotate(0deg)'
            }}
          />
        </div>
      </Dropdown>
    </div>
  );
};

export default EnhancedUserSection;