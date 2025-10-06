import React, { useState, useEffect } from 'react';

const ConversationAnalytics = () => {
  const [currentView, setCurrentView] = useState('overview');
  const [conversations, setConversations] = useState([]);
  const [analytics, setAnalytics] = useState(null);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [filters, setFilters] = useState({
    startDate: '',
    endDate: '',
    status: '',
    intent: '',
    satisfaction: '',
    search: ''
  });
  const [loading, setLoading] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);

  // 模拟数据初始化
  useEffect(() => {
    fetchConversations();
    fetchAnalytics();
  }, [filters, page]);

  const fetchConversations = async () => {
    setLoading(true);
    try {
      const queryParams = new URLSearchParams({
        page: page.toString(),
        limit: pageSize.toString(),
        ...filters
      });
      
      const response = await fetch(`/api/customer-service/conversations?${queryParams}`);
      const data = await response.json();
      
      if (data.success) {
        setConversations(data.conversations || []);
      }
    } catch (error) {
      console.error('获取对话记录失败:', error);
    } finally {
      setLoading(false);
    }
  };

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

  const handleFilterChange = (key, value) => {
    setFilters(prev => ({
      ...prev,
      [key]: value
    }));
    setPage(1);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'resolved': return { color: '#16a34a', backgroundColor: '#dcfce7' };
      case 'pending': return { color: '#ca8a04', backgroundColor: '#fef3c7' };
      case 'escalated': return { color: '#dc2626', backgroundColor: '#fee2e2' };
      default: return { color: '#6b7280', backgroundColor: '#f3f4f6' };
    }
  };

  const getSatisfactionColor = (satisfaction) => {
    if (satisfaction >= 4) return { color: '#16a34a', backgroundColor: '#dcfce7' };
    if (satisfaction >= 3) return { color: '#ca8a04', backgroundColor: '#fef3c7' };
    return { color: '#dc2626', backgroundColor: '#fee2e2' };
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
          }}>💬 对话记录分析</h2>
          <p style={{ color: '#6b7280', margin: '0' }}>查看和分析客户问答记录</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => setCurrentView('conversations')}
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
            📋 查看对话记录
          </button>
          <button
            onClick={() => setCurrentView('analytics')}
            style={{
              padding: '12px 24px',
              backgroundColor: '#10b981',
              color: '#ffffff',
              border: 'none',
              borderRadius: '8px',
              cursor: 'pointer',
              fontWeight: '500',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#059669';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#10b981';
            }}
          >
            📊 数据分析
          </button>
        </div>
      </div>

      {/* 关键指标 */}
      {analytics && (
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
                💬
              </div>
              <div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e40af' }}>
                  {analytics.summary.totalConversations}
                </div>
                <div style={{ fontSize: '14px', color: '#6b7280' }}>总对话数</div>
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
                ✅
              </div>
              <div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#16a34a' }}>
                  {analytics.summary.resolvedConversations}
                </div>
                <div style={{ fontSize: '14px', color: '#6b7280' }}>已解决对话</div>
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
                ⏱️
              </div>
              <div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ca8a04' }}>
                  {analytics.summary.avgResponseTime}秒
                </div>
                <div style={{ fontSize: '14px', color: '#6b7280' }}>平均响应时间</div>
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
                ⭐
              </div>
              <div>
                <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#8b5cf6' }}>
                  {analytics.summary.customerSatisfaction}
                </div>
                <div style={{ fontSize: '14px', color: '#6b7280' }}>平均满意度</div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 趋势图表 */}
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
          }}>📈 对话趋势</h3>
          
          <div style={{
            display: 'grid',
            gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
            gap: '16px'
          }}>
            {analytics.dailyStats.map((stat, index) => (
              <div key={index} style={{
                padding: '16px',
                backgroundColor: '#f8fafc',
                borderRadius: '8px',
                border: '1px solid #e5e7eb',
                textAlign: 'center'
              }}>
                <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>
                  {stat.date}
                </div>
                <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#111827', marginBottom: '4px' }}>
                  {stat.conversations}
                </div>
                <div style={{ fontSize: '12px', color: '#6b7280' }}>
                  对话 | 满意度 {stat.satisfaction}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 问题类型分析 */}
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
          }}>🎯 问题类型分析</h3>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {analytics.intentAnalysis.map((intent, index) => (
              <div key={index} style={{
                display: 'flex',
                alignItems: 'center',
                padding: '12px',
                backgroundColor: '#f8fafc',
                borderRadius: '8px',
                border: '1px solid #e5e7eb'
              }}>
                <div style={{ flex: '0 0 120px' }}>
                  <div style={{ fontSize: '14px', fontWeight: '500', color: '#111827' }}>
                    {intent.intent}
                  </div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>
                    满意度 {intent.avgSatisfaction}
                  </div>
                </div>
                <div style={{ flex: 1, margin: '0 16px' }}>
                  <div style={{
                    width: '100%',
                    height: '8px',
                    backgroundColor: '#e5e7eb',
                    borderRadius: '4px',
                    overflow: 'hidden'
                  }}>
                    <div style={{
                      width: `${intent.percentage}%`,
                      height: '100%',
                      backgroundColor: '#3b82f6',
                      borderRadius: '4px'
                    }} />
                  </div>
                </div>
                <div style={{ flex: '0 0 80px', textAlign: 'right' }}>
                  <div style={{ fontSize: '14px', fontWeight: '500', color: '#111827' }}>
                    {intent.count}
                  </div>
                  <div style={{ fontSize: '12px', color: '#6b7280' }}>
                    {intent.percentage}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );

  const renderConversations = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{
            fontSize: '32px',
            fontWeight: 'bold',
            color: '#111827',
            marginBottom: '8px',
            margin: '0 0 8px 0'
          }}>📋 对话记录</h2>
          <p style={{ color: '#6b7280', margin: '0' }}>查看和管理客户对话记录</p>
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

      {/* 筛选器 */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        padding: '24px',
        border: '1px solid #e5e7eb',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
      }}>
        <h3 style={{
          fontSize: '18px',
          fontWeight: '600',
          color: '#111827',
          marginBottom: '16px',
          margin: '0 0 16px 0'
        }}>🔍 筛选条件</h3>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px'
        }}>
          <div>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '6px'
            }}>
              开始日期
            </label>
            <input
              type="date"
              value={filters.startDate}
              onChange={(e) => handleFilterChange('startDate', e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            />
          </div>

          <div>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '6px'
            }}>
              结束日期
            </label>
            <input
              type="date"
              value={filters.endDate}
              onChange={(e) => handleFilterChange('endDate', e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            />
          </div>

          <div>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '6px'
            }}>
              状态
            </label>
            <select
              value={filters.status}
              onChange={(e) => handleFilterChange('status', e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            >
              <option value="">全部状态</option>
              <option value="resolved">已解决</option>
              <option value="pending">处理中</option>
              <option value="escalated">已升级</option>
            </select>
          </div>

          <div>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '6px'
            }}>
              问题类型
            </label>
            <select
              value={filters.intent}
              onChange={(e) => handleFilterChange('intent', e.target.value)}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            >
              <option value="">全部类型</option>
              <option value="售后咨询">售后咨询</option>
              <option value="产品咨询">产品咨询</option>
              <option value="物流查询">物流查询</option>
              <option value="账户问题">账户问题</option>
            </select>
          </div>

          <div>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '6px'
            }}>
              搜索客户
            </label>
            <input
              type="text"
              value={filters.search}
              onChange={(e) => handleFilterChange('search', e.target.value)}
              placeholder="输入客户姓名或ID"
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            />
          </div>
        </div>
      </div>

      {/* 对话列表 */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {loading ? (
          <div style={{
            textAlign: 'center',
            padding: '48px',
            color: '#6b7280'
          }}>
            <div style={{ fontSize: '18px' }}>加载中...</div>
          </div>
        ) : conversations.length > 0 ? (
          conversations.map((conversation) => (
            <div key={conversation.id} style={{
              backgroundColor: '#ffffff',
              borderRadius: '12px',
              padding: '24px',
              border: '1px solid #e5e7eb',
              boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
            }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginBottom: '8px' }}>
                    <h3 style={{
                      fontSize: '18px',
                      fontWeight: '600',
                      color: '#111827',
                      margin: '0'
                    }}>
                      {conversation.customerName} (#{conversation.id})
                    </h3>
                    <span style={{
                      padding: '4px 8px',
                      fontSize: '12px',
                      fontWeight: '500',
                      borderRadius: '6px',
                      ...getStatusColor(conversation.status)
                    }}>
                      {conversation.status === 'resolved' ? '已解决' :
                       conversation.status === 'pending' ? '处理中' : '已升级'}
                    </span>
                    <span style={{
                      padding: '4px 8px',
                      fontSize: '12px',
                      fontWeight: '500',
                      borderRadius: '6px',
                      ...getSatisfactionColor(conversation.satisfaction)
                    }}>
                      满意度: {conversation.satisfaction}/5
                    </span>
                  </div>
                  
                  <div style={{ display: 'flex', gap: '16px', marginBottom: '12px' }}>
                    <span style={{ fontSize: '14px', color: '#6b7280' }}>
                      📅 {new Date(conversation.startTime).toLocaleString()}
                    </span>
                    <span style={{ fontSize: '14px', color: '#6b7280' }}>
                      ⏱️ 时长: {conversation.duration}分钟
                    </span>
                    <span style={{ fontSize: '14px', color: '#6b7280' }}>
                      🎯 {conversation.intent}
                    </span>
                  </div>
                  
                  <div style={{
                    backgroundColor: '#f8fafc',
                    borderRadius: '8px',
                    padding: '12px',
                    marginBottom: '12px'
                  }}>
                    <div style={{ fontSize: '14px', fontWeight: '500', color: '#111827', marginBottom: '4px' }}>
                      对话摘要:
                    </div>
                    <div style={{ fontSize: '14px', color: '#6b7280', lineHeight: '1.5' }}>
                      {conversation.messages[0]?.content} → {conversation.messages[conversation.messages.length - 1]?.content}
                    </div>
                  </div>
                  
                  {conversation.resolution && (
                    <div style={{
                      backgroundColor: '#f0fdf4',
                      borderRadius: '8px',
                      padding: '12px',
                      border: '1px solid #bbf7d0'
                    }}>
                      <div style={{ fontSize: '14px', fontWeight: '500', color: '#16a34a', marginBottom: '4px' }}>
                        解决方案:
                      </div>
                      <div style={{ fontSize: '14px', color: '#15803d' }}>
                        {conversation.resolution}
                      </div>
                    </div>
                  )}
                </div>
                
                <button
                  onClick={() => setSelectedConversation(conversation)}
                  style={{
                    padding: '8px 16px',
                    backgroundColor: '#3b82f6',
                    color: '#ffffff',
                    border: 'none',
                    borderRadius: '6px',
                    cursor: 'pointer',
                    fontSize: '14px',
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
                  查看详情
                </button>
              </div>
            </div>
          ))
        ) : (
          <div style={{
            textAlign: 'center',
            padding: '48px',
            color: '#6b7280'
          }}>
            <div style={{ fontSize: '18px', marginBottom: '8px' }}>📭</div>
            <div style={{ fontSize: '16px' }}>暂无对话记录</div>
          </div>
        )}
      </div>
    </div>
  );

  const renderConversationDetail = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{
            fontSize: '32px',
            fontWeight: 'bold',
            color: '#111827',
            marginBottom: '8px',
            margin: '0 0 8px 0'
          }}>💬 对话详情</h2>
          <p style={{ color: '#6b7280', margin: '0' }}>
            {selectedConversation?.customerName} - {new Date(selectedConversation?.startTime).toLocaleString()}
          </p>
        </div>
        <button
          onClick={() => setSelectedConversation(null)}
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
          ← 返回列表
        </button>
      </div>

      {selectedConversation && (
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          padding: '24px',
          border: '1px solid #e5e7eb',
          boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
        }}>
          {/* 对话信息 */}
          <div style={{ marginBottom: '24px' }}>
            <div style={{ display: 'flex', gap: '16px', marginBottom: '16px' }}>
              <span style={{
                padding: '6px 12px',
                fontSize: '14px',
                fontWeight: '500',
                borderRadius: '6px',
                ...getStatusColor(selectedConversation.status)
              }}>
                {selectedConversation.status === 'resolved' ? '已解决' :
                 selectedConversation.status === 'pending' ? '处理中' : '已升级'}
              </span>
              <span style={{
                padding: '6px 12px',
                fontSize: '14px',
                fontWeight: '500',
                borderRadius: '6px',
                ...getSatisfactionColor(selectedConversation.satisfaction)
              }}>
                满意度: {selectedConversation.satisfaction}/5
              </span>
              <span style={{
                padding: '6px 12px',
                backgroundColor: '#eff6ff',
                color: '#1e40af',
                fontSize: '14px',
                fontWeight: '500',
                borderRadius: '6px'
              }}>
                {selectedConversation.intent}
              </span>
            </div>
            
            <div style={{ display: 'flex', gap: '24px', fontSize: '14px', color: '#6b7280' }}>
              <span>⏱️ 时长: {selectedConversation.duration}分钟</span>
              <span>📅 开始: {new Date(selectedConversation.startTime).toLocaleString()}</span>
              <span>📅 结束: {new Date(selectedConversation.endTime).toLocaleString()}</span>
            </div>
          </div>

          {/* 对话内容 */}
          <div style={{ marginBottom: '24px' }}>
            <h3 style={{
              fontSize: '18px',
              fontWeight: '600',
              color: '#111827',
              marginBottom: '16px',
              margin: '0 0 16px 0'
            }}>💬 对话内容</h3>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
              {selectedConversation.messages.map((message, index) => (
                <div key={index} style={{
                  display: 'flex',
                  justifyContent: message.type === 'customer' ? 'flex-end' : 'flex-start'
                }}>
                  <div style={{
                    maxWidth: '70%',
                    padding: '12px 16px',
                    borderRadius: '12px',
                    backgroundColor: message.type === 'customer' ? '#3b82f6' : '#f3f4f6',
                    color: message.type === 'customer' ? '#ffffff' : '#111827'
                  }}>
                    <div style={{ fontSize: '14px', lineHeight: '1.5' }}>
                      {message.content}
                    </div>
                    <div style={{
                      fontSize: '12px',
                      opacity: 0.7,
                      marginTop: '4px'
                    }}>
                      {new Date(message.timestamp).toLocaleTimeString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* 解决方案 */}
          {selectedConversation.resolution && (
            <div>
              <h3 style={{
                fontSize: '18px',
                fontWeight: '600',
                color: '#111827',
                marginBottom: '12px',
                margin: '0 0 12px 0'
              }}>✅ 解决方案</h3>
              <div style={{
                backgroundColor: '#f0fdf4',
                borderRadius: '8px',
                padding: '16px',
                border: '1px solid #bbf7d0'
              }}>
                <div style={{ fontSize: '14px', color: '#15803d', lineHeight: '1.5' }}>
                  {selectedConversation.resolution}
                </div>
              </div>
            </div>
          )}
        </div>
      )}
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
        {currentView === 'conversations' && renderConversations()}
        {currentView === 'analytics' && renderOverview()}
        {selectedConversation && renderConversationDetail()}
      </div>
    </div>
  );
};

export default ConversationAnalytics;
