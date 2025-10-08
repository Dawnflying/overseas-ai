import React from 'react';
import { useNavigate } from 'react-router-dom';
import OverseasDashboard from './OverseasDashboard';

const DashboardPage = ({ user, onLogout }) => {
  const navigate = useNavigate();

  const handleBackToHome = () => {
    navigate('/');
  };
  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8fafc'
    }}>
      {/* 顶部导航栏 */}
      <div style={{
        backgroundColor: '#ffffff',
        borderBottom: '1px solid #e5e7eb',
        padding: '16px 0',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto',
          padding: '0 32px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '40px',
              height: '40px',
              backgroundColor: '#3b82f6',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px'
            }}>
              📊
            </div>
            <div>
              <h1 style={{
                fontSize: '20px',
                fontWeight: '600',
                color: '#111827',
                margin: '0'
              }}>
                出海控制台
              </h1>
              <p style={{
                fontSize: '14px',
                color: '#6b7280',
                margin: '0'
              }}>
                专业出海业务管理平台
              </p>
            </div>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            {/* 返回首页按钮 */}
            <button
              onClick={handleBackToHome}
              style={{
                padding: '8px 16px',
                backgroundColor: '#f8fafc',
                color: '#6b7280',
                border: '1px solid #e5e7eb',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'all 0.2s ease',
                display: 'flex',
                alignItems: 'center',
                gap: '6px'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#3b82f6';
                e.currentTarget.style.backgroundColor = '#eff6ff';
                e.currentTarget.style.borderColor = '#3b82f6';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#6b7280';
                e.currentTarget.style.backgroundColor = '#f8fafc';
                e.currentTarget.style.borderColor = '#e5e7eb';
              }}
            >
              <span>🏠</span>
              返回首页
            </button>

            <div style={{
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              padding: '8px 12px',
              backgroundColor: '#f8fafc',
              borderRadius: '6px',
              border: '1px solid #e5e7eb'
            }}>
              <div style={{
                width: '24px',
                height: '24px',
                backgroundColor: '#3b82f6',
                borderRadius: '50%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#ffffff',
                fontSize: '12px',
                fontWeight: '500'
              }}>
                {user?.name?.charAt(0)?.toUpperCase() || 'U'}
              </div>
              <span style={{
                fontSize: '14px',
                color: '#374151',
                fontWeight: '500'
              }}>
                {user?.name || '用户'}
              </span>
            </div>
            
            <button
              onClick={onLogout}
              style={{
                padding: '8px 16px',
                backgroundColor: '#ffffff',
                color: '#6b7280',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px',
                fontWeight: '500',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.color = '#111827';
                e.currentTarget.style.backgroundColor = '#f9fafb';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = '#6b7280';
                e.currentTarget.style.backgroundColor = '#ffffff';
              }}
            >
              退出登录
            </button>
          </div>
        </div>
      </div>

      {/* 主要内容区域 */}
      <div style={{
        padding: '32px',
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        <OverseasDashboard />
      </div>

      {/* 欢迎横幅 */}
      <div style={{
        position: 'fixed',
        top: '80px',
        right: '32px',
        backgroundColor: '#10b981',
        color: '#ffffff',
        padding: '12px 16px',
        borderRadius: '8px',
        boxShadow: '0 4px 12px 0 rgba(0, 0, 0, 0.15)',
        fontSize: '14px',
        fontWeight: '500',
        zIndex: 1000,
        animation: 'slideInRight 0.5s ease-out'
      }}>
        🎉 欢迎回来，{user?.name || '用户'}！
      </div>

      <style>
        {`
          @keyframes slideInRight {
            from {
              transform: translateX(100%);
              opacity: 0;
            }
            to {
              transform: translateX(0);
              opacity: 1;
            }
          }
        `}
      </style>
    </div>
  );
};

export default DashboardPage;
