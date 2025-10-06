import React, { useState, useEffect } from 'react';
import AIRobotConfig from './AIRobotConfig';
import ConversationAnalytics from './ConversationAnalytics';
import CustomerManagement from './CustomerManagement';

const CustomerServiceManager = () => {
  const [currentView, setCurrentView] = useState('overview');
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(false);

  // 模拟数据
  const [stats] = useState({
    totalCustomers: 1250,
    activeConversations: 45,
    avgSatisfaction: 4.6,
    botResolutionRate: 85.2
  });

  useEffect(() => {
    fetchAnalytics();
  }, []);

  const fetchAnalytics = async () => {
    try {
      const response = await fetch('/api/customer-service/analytics');
      const data = await response.json();
      if (data.success) {
        setAnalytics(data.analytics);
      }
    } catch (error) {
      console.error('获取分析数据失败:', error);
    }
  };

  const renderOverview = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{
            fontSize: '32px',
            fontWeight: 'bold',
            color: '#111827',
            marginBottom: '8px',
            margin: '0 0 8px 0'
          }}>🎧 客户服务管理</h2>
          <p style={{ color: '#6b7280', margin: '0' }}>管理您的客户服务系统和AI智能客服</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => setCurrentView('ai-robot')}
            style={{
              padding: '12px 24px',
              backgroundColor: '#3b82f6',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '500',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#2563eb';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#3b82f6';
            }}
          >
            🤖 配置AI机器人
          </button>
        </div>
      </div>

      {/* 统计卡片 */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
        gap: '20px'
      }}>
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          padding: '24px',
          border: '1px solid #e5e7eb',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              backgroundColor: '#dbeafe',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px'
            }}>
              👥
            </div>
            <div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e40af' }}>
                {stats.totalCustomers.toLocaleString()}
              </div>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>总客户数</div>
            </div>
          </div>
        </div>

        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          padding: '24px',
          border: '1px solid #e5e7eb',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              backgroundColor: '#dcfce7',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px'
            }}>
              💬
            </div>
            <div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#16a34a' }}>
                {stats.activeConversations}
              </div>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>活跃对话</div>
            </div>
          </div>
        </div>

        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          padding: '24px',
          border: '1px solid #e5e7eb',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              backgroundColor: '#fef3c7',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px'
            }}>
              ⭐
            </div>
            <div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ca8a04' }}>
                {stats.avgSatisfaction}
              </div>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>平均满意度</div>
            </div>
          </div>
        </div>

        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          padding: '24px',
          border: '1px solid #e5e7eb',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div style={{
              width: '48px',
              height: '48px',
              backgroundColor: '#f3e8ff',
              borderRadius: '12px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px'
            }}>
              🤖
            </div>
            <div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#8b5cf6' }}>
                {stats.botResolutionRate}%
              </div>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>机器人解决率</div>
            </div>
          </div>
        </div>
      </div>

      {/* 功能模块 */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        padding: '24px',
        border: '1px solid #e5e7eb',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
      }}>
        <h3 style={{
          fontSize: '20px',
          fontWeight: '600',
          color: '#111827',
          marginBottom: '20px',
          margin: '0 0 20px 0'
        }}>🚀 功能模块</h3>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '20px'
        }}>
          <button
            onClick={() => setCurrentView('ai-robot')}
            style={{
              padding: '20px',
              backgroundColor: '#f8fafc',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              textAlign: 'left'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#eff6ff';
              e.currentTarget.style.borderColor = '#3b82f6';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#f8fafc';
              e.currentTarget.style.borderColor = '#e5e7eb';
            }}
          >
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>🤖</div>
            <h4 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#111827',
              marginBottom: '8px',
              margin: '0 0 8px 0'
            }}>AI智能机器人</h4>
            <p style={{
              fontSize: '14px',
              color: '#6b7280',
              margin: '0',
              lineHeight: '1.5'
            }}>配置知识库、对话流程和AI模型参数</p>
          </button>

          <button
            onClick={() => setCurrentView('conversations')}
            style={{
              padding: '20px',
              backgroundColor: '#f8fafc',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              textAlign: 'left'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f0fdf4';
              e.currentTarget.style.borderColor = '#10b981';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#f8fafc';
              e.currentTarget.style.borderColor = '#e5e7eb';
            }}
          >
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>💬</div>
            <h4 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#111827',
              marginBottom: '8px',
              margin: '0 0 8px 0'
            }}>对话记录分析</h4>
            <p style={{
              fontSize: '14px',
              color: '#6b7280',
              margin: '0',
              lineHeight: '1.5'
            }}>查看和分析客户问答记录</p>
          </button>

          <button
            onClick={() => setCurrentView('customers')}
            style={{
              padding: '20px',
              backgroundColor: '#f8fafc',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              textAlign: 'left'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#fef3c7';
              e.currentTarget.style.borderColor = '#ca8a04';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#f8fafc';
              e.currentTarget.style.borderColor = '#e5e7eb';
            }}
          >
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>👥</div>
            <h4 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#111827',
              marginBottom: '8px',
              margin: '0 0 8px 0'
            }}>客户管理</h4>
            <p style={{
              fontSize: '14px',
              color: '#6b7280',
              margin: '0',
              lineHeight: '1.5'
            }}>管理客户信息和标签</p>
          </button>

          <button
            onClick={() => setCurrentView('profiles')}
            style={{
              padding: '20px',
              backgroundColor: '#f8fafc',
              border: '1px solid #e5e7eb',
              borderRadius: '12px',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              textAlign: 'left'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#f3e8ff';
              e.currentTarget.style.borderColor = '#8b5cf6';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#f8fafc';
              e.currentTarget.style.borderColor = '#e5e7eb';
            }}
          >
            <div style={{ fontSize: '32px', marginBottom: '12px' }}>🎭</div>
            <h4 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#111827',
              marginBottom: '8px',
              margin: '0 0 8px 0'
            }}>用户画像分析</h4>
            <p style={{
              fontSize: '14px',
              color: '#6b7280',
              margin: '0',
              lineHeight: '1.5'
            }}>分析客户行为和特征</p>
          </button>
        </div>
      </div>

      {/* 实时数据 */}
      {analytics && (
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          padding: '24px',
          border: '1px solid #e5e7eb',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
        }}>
          <h3 style={{
            fontSize: '20px',
            fontWeight: '600',
            color: '#111827',
            marginBottom: '20px',
            margin: '0 0 20px 0'
          }}>📊 实时数据概览</h3>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
            gap: '16px'
          }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#3b82f6' }}>
                {analytics.summary.totalConversations}
              </div>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>总对话数</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#10b981' }}>
                {analytics.summary.resolvedConversations}
              </div>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>已解决对话</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#f59e0b' }}>
                {analytics.summary.avgResponseTime}秒
              </div>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>平均响应时间</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: '20px', fontWeight: 'bold', color: '#8b5cf6' }}>
                {analytics.summary.botResolutionRate}%
              </div>
              <div style={{ fontSize: '12px', color: '#6b7280' }}>机器人解决率</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );

  const renderConversationAnalytics = () => (
    <ConversationAnalytics />
  );

  const renderCustomerManagement = () => (
    <CustomerManagement />
  );

  const renderPlaceholder = (title, description) => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{
            fontSize: '32px',
            fontWeight: 'bold',
            color: '#111827',
            marginBottom: '8px',
            margin: '0 0 8px 0'
          }}>{title}</h2>
          <p style={{ color: '#6b7280', margin: '0' }}>{description}</p>
        </div>
        <button
          onClick={() => setCurrentView('overview')}
          style={{
            padding: '12px 24px',
            color: '#6b7280',
            backgroundColor: '#ffffff',
            border: '1px solid #d1d5db',
            borderRadius: '8px',
            cursor: 'pointer',
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
          ← 返回概览
        </button>
      </div>

      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        padding: '48px',
        border: '1px solid #e5e7eb',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)',
        textAlign: 'center'
      }}>
        <div style={{ fontSize: '64px', marginBottom: '24px' }}>🚧</div>
        <h3 style={{
          fontSize: '24px',
          fontWeight: '600',
          color: '#111827',
          marginBottom: '12px',
          margin: '0 0 12px 0'
        }}>功能开发中</h3>
        <p style={{
          fontSize: '16px',
          color: '#6b7280',
          margin: '0',
          lineHeight: '1.5'
        }}>
          该功能正在开发中，敬请期待！
        </p>
      </div>
    </div>
  );

  return (
    <div style={{
      minHeight: '100vh',
      backgroundColor: '#f8fafc',
      padding: '32px'
    }}>
      <div style={{
        maxWidth: '1200px',
        margin: '0 auto'
      }}>
        {currentView === 'overview' && renderOverview()}
        {currentView === 'ai-robot' && <AIRobotConfig />}
        {currentView === 'conversations' && renderConversationAnalytics()}
        {currentView === 'customers' && renderCustomerManagement()}
        {currentView === 'profiles' && renderPlaceholder('🎭 用户画像分析', '分析客户行为和特征')}
      </div>
    </div>
  );
};

export default CustomerServiceManager;
