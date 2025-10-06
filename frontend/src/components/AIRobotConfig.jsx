import React, { useState, useEffect } from 'react';
import ConversationFlowCreator from './ConversationFlowCreator';

const AIRobotConfig = () => {
  const [currentView, setCurrentView] = useState('overview');
  const [knowledgeBase, setKnowledgeBase] = useState([]);
  const [conversationFlows, setConversationFlows] = useState([]);
  const [aiModels, setAiModels] = useState([]);
  const [replyTemplates, setReplyTemplates] = useState([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showFlowCreator, setShowFlowCreator] = useState(false);
  const [modalType, setModalType] = useState('');
  const [loading, setLoading] = useState(false);

  // 表单数据
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    keywords: '',
    model: '',
    temperature: 0.7,
    maxTokens: 1000,
    language: 'zh-CN',
    templateType: '',
    templateContent: ''
  });

  // 模拟数据初始化
  useEffect(() => {
    // 知识库数据
    setKnowledgeBase([
      {
        id: 1,
        title: '产品退换货政策',
        content: '我们提供30天无理由退换货服务，商品需保持原包装完好。',
        category: '售后政策',
        keywords: ['退货', '换货', '退款', '售后'],
        usage: 45,
        lastUpdated: '2024-01-15',
        status: 'active'
      },
      {
        id: 2,
        title: '物流配送时间',
        content: '国内配送3-7个工作日，海外配送7-15个工作日。',
        category: '物流配送',
        keywords: ['配送', '物流', '时间', '快递'],
        usage: 32,
        lastUpdated: '2024-01-10',
        status: 'active'
      },
      {
        id: 3,
        title: '支付方式说明',
        content: '支持支付宝、微信支付、信用卡、PayPal等多种支付方式。',
        category: '支付相关',
        keywords: ['支付', '付款', '支付宝', '微信'],
        usage: 28,
        lastUpdated: '2024-01-12',
        status: 'active'
      }
    ]);

    // 对话流程数据
    setConversationFlows([
      {
        id: 1,
        name: '售后咨询流程',
        description: '处理客户售后问题的标准流程',
        steps: [
          { id: 1, name: '问题识别', type: 'intent', condition: '售后相关' },
          { id: 2, name: '收集信息', type: 'collect', fields: ['订单号', '问题描述'] },
          { id: 3, name: '解决方案', type: 'solution', template: '售后解决方案模板' },
          { id: 4, name: '满意度确认', type: 'confirm', action: '发送满意度调查' }
        ],
        usage: 156,
        successRate: 92.5,
        status: 'active'
      },
      {
        id: 2,
        name: '产品咨询流程',
        description: '处理产品相关咨询的流程',
        steps: [
          { id: 1, name: '产品识别', type: 'intent', condition: '产品相关' },
          { id: 2, name: '需求分析', type: 'analyze', method: '关键词匹配' },
          { id: 3, name: '产品推荐', type: 'recommend', source: '产品数据库' },
          { id: 4, name: '购买引导', type: 'guide', action: '引导下单' }
        ],
        usage: 203,
        successRate: 88.7,
        status: 'active'
      }
    ]);

    // AI模型数据
    setAiModels([
      {
        id: 'deepseek-chat',
        name: 'DeepSeek Chat',
        provider: 'DeepSeek',
        description: '强大的中文对话模型，适合客服场景',
        temperature: 0.7,
        maxTokens: 1000,
        cost: 0.001,
        accuracy: 95,
        speed: 'fast',
        status: 'active'
      },
      {
        id: 'gpt-4',
        name: 'GPT-4',
        provider: 'OpenAI',
        description: '通用型AI模型，多语言支持',
        temperature: 0.7,
        maxTokens: 2000,
        cost: 0.002,
        accuracy: 92,
        speed: 'medium',
        status: 'active'
      }
    ]);

    // 回复模板数据
    setReplyTemplates([
      {
        id: 1,
        name: '欢迎模板',
        type: 'greeting',
        content: '您好！我是您的专属客服助手，有什么可以帮助您的吗？',
        language: 'zh-CN',
        usage: 1205,
        lastUsed: '2024-01-20'
      },
      {
        id: 2,
        name: '问题确认模板',
        type: 'confirmation',
        content: '我理解您的问题是：{question}。请问我的理解是否正确？',
        language: 'zh-CN',
        usage: 856,
        lastUsed: '2024-01-20'
      },
      {
        id: 3,
        name: '转人工模板',
        type: 'transfer',
        content: '很抱歉，我需要为您转接到人工客服。请稍等片刻，我们的客服代表将为您提供更专业的帮助。',
        language: 'zh-CN',
        usage: 234,
        lastUsed: '2024-01-19'
      }
    ]);
  }, []);

  const handleCreate = async () => {
    setLoading(true);
    try {
      const response = await fetch(`/api/customer-service/${modalType}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        // 刷新数据
        setShowCreateModal(false);
        setFormData({
          title: '',
          content: '',
          category: '',
          keywords: '',
          model: '',
          temperature: 0.7,
          maxTokens: 1000,
          language: 'zh-CN',
          templateType: '',
          templateContent: ''
        });
      }
    } catch (error) {
      console.error('创建失败:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'active': return { color: '#16a34a', backgroundColor: '#dcfce7' };
      case 'inactive': return { color: '#6b7280', backgroundColor: '#f3f4f6' };
      case 'testing': return { color: '#ca8a04', backgroundColor: '#fef3c7' };
      default: return { color: '#6b7280', backgroundColor: '#f3f4f6' };
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
          }}>🤖 AI智能机器人配置</h2>
          <p style={{ color: '#6b7280', margin: '0' }}>配置和管理您的AI客服机器人</p>
        </div>
        <div style={{ display: 'flex', gap: '12px' }}>
          <button
            onClick={() => {
              setModalType('knowledge-base');
              setShowCreateModal(true);
            }}
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
            📚 添加知识库
          </button>
          <button
            onClick={() => setShowFlowCreator(true)}
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
            🔄 创建对话流程
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
              📚
            </div>
            <div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#1e40af' }}>
                {knowledgeBase.length}
              </div>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>知识库条目</div>
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
              🔄
            </div>
            <div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#16a34a' }}>
                {conversationFlows.length}
              </div>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>对话流程</div>
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
              🧠
            </div>
            <div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#ca8a04' }}>
                {aiModels.length}
              </div>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>AI模型</div>
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
              📝
            </div>
            <div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#8b5cf6' }}>
                {replyTemplates.length}
              </div>
              <div style={{ fontSize: '14px', color: '#6b7280' }}>回复模板</div>
            </div>
          </div>
        </div>
      </div>

      {/* 快速操作 */}
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
        }}>🚀 快速操作</h3>
        
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '16px'
        }}>
          <button
            onClick={() => setCurrentView('knowledge-base')}
            style={{
              padding: '16px',
              backgroundColor: '#f8fafc',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
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
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>📚</div>
            <div style={{ fontWeight: '500', color: '#111827' }}>知识库管理</div>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>管理FAQ和知识条目</div>
          </button>

          <button
            onClick={() => setCurrentView('conversation-flows')}
            style={{
              padding: '16px',
              backgroundColor: '#f8fafc',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
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
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>🔄</div>
            <div style={{ fontWeight: '500', color: '#111827' }}>对话流程</div>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>设计对话流程和逻辑</div>
          </button>

          <button
            onClick={() => setCurrentView('ai-models')}
            style={{
              padding: '16px',
              backgroundColor: '#f8fafc',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
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
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>🧠</div>
            <div style={{ fontWeight: '500', color: '#111827' }}>AI模型配置</div>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>配置AI模型参数</div>
          </button>

          <button
            onClick={() => setCurrentView('reply-templates')}
            style={{
              padding: '16px',
              backgroundColor: '#f8fafc',
              border: '1px solid #e5e7eb',
              borderRadius: '8px',
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
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>📝</div>
            <div style={{ fontWeight: '500', color: '#111827' }}>回复模板</div>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>管理回复模板库</div>
          </button>
        </div>
      </div>
    </div>
  );

  const renderKnowledgeBase = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{
            fontSize: '32px',
            fontWeight: 'bold',
            color: '#111827',
            marginBottom: '8px',
            margin: '0 0 8px 0'
          }}>📚 知识库管理</h2>
          <p style={{ color: '#6b7280', margin: '0' }}>管理FAQ和知识条目</p>
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

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {knowledgeBase.map((item) => (
          <div key={item.id} style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            padding: '24px',
            border: '1px solid #e5e7eb',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div style={{ flex: 1 }}>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#111827',
                  marginBottom: '8px',
                  margin: '0 0 8px 0'
                }}>{item.title}</h3>
                <p style={{
                  fontSize: '14px',
                  color: '#6b7280',
                  marginBottom: '12px',
                  margin: '0 0 12px 0',
                  lineHeight: '1.5'
                }}>{item.content}</p>
                
                <div style={{ display: 'flex', gap: '16px', marginBottom: '12px' }}>
                  <span style={{
                    padding: '4px 8px',
                    backgroundColor: '#f3f4f6',
                    borderRadius: '6px',
                    fontSize: '12px',
                    color: '#374151'
                  }}>分类: {item.category}</span>
                  <span style={{
                    padding: '4px 8px',
                    backgroundColor: '#eff6ff',
                    borderRadius: '6px',
                    fontSize: '12px',
                    color: '#1e40af'
                  }}>使用: {item.usage}次</span>
                </div>
                
                <div style={{ fontSize: '12px', color: '#9ca3af' }}>
                  关键词: {item.keywords.join(', ')} | 更新: {item.lastUpdated}
                </div>
              </div>
              
              <span style={{
                padding: '6px 12px',
                fontSize: '14px',
                fontWeight: '500',
                borderRadius: '9999px',
                ...getStatusColor(item.status)
              }}>
                {item.status === 'active' ? '活跃' : '停用'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderConversationFlows = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{
            fontSize: '32px',
            fontWeight: 'bold',
            color: '#111827',
            marginBottom: '8px',
            margin: '0 0 8px 0'
          }}>🔄 对话流程管理</h2>
          <p style={{ color: '#6b7280', margin: '0' }}>设计和配置AI对话流程</p>
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

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {conversationFlows.map((flow) => (
          <div key={flow.id} style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            padding: '24px',
            border: '1px solid #e5e7eb',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div style={{ flex: 1 }}>
                <h3 style={{
                  fontSize: '18px',
                  fontWeight: '600',
                  color: '#111827',
                  marginBottom: '8px',
                  margin: '0 0 8px 0'
                }}>{flow.name}</h3>
                <p style={{
                  fontSize: '14px',
                  color: '#6b7280',
                  marginBottom: '16px',
                  margin: '0 0 16px 0',
                  lineHeight: '1.5'
                }}>{flow.description}</p>
                
                {/* 流程步骤 */}
                <div style={{ marginBottom: '16px' }}>
                  <h4 style={{
                    fontSize: '14px',
                    fontWeight: '600',
                    color: '#374151',
                    marginBottom: '8px',
                    margin: '0 0 8px 0'
                  }}>流程步骤:</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    {flow.steps.map((step, index) => (
                      <div key={index} style={{
                        display: 'flex',
                        alignItems: 'center',
                        gap: '12px',
                        padding: '8px 12px',
                        backgroundColor: '#f8fafc',
                        borderRadius: '6px',
                        border: '1px solid #e5e7eb'
                      }}>
                        <div style={{
                          width: '24px',
                          height: '24px',
                          backgroundColor: '#3b82f6',
                          color: '#ffffff',
                          borderRadius: '50%',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: '12px',
                          fontWeight: '500',
                          flexShrink: 0
                        }}>
                          {index + 1}
                        </div>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: '14px', fontWeight: '500', color: '#111827' }}>
                            {step.name}
                          </div>
                          <div style={{ fontSize: '12px', color: '#6b7280' }}>
                            类型: {step.type} | 条件: {step.condition || step.method || step.template || step.action}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div style={{ display: 'flex', gap: '16px' }}>
                  <span style={{
                    padding: '4px 8px',
                    backgroundColor: '#eff6ff',
                    borderRadius: '6px',
                    fontSize: '12px',
                    color: '#1e40af'
                  }}>使用: {flow.usage}次</span>
                  <span style={{
                    padding: '4px 8px',
                    backgroundColor: '#f0fdf4',
                    borderRadius: '6px',
                    fontSize: '12px',
                    color: '#16a34a'
                  }}>成功率: {flow.successRate}%</span>
                </div>
              </div>
              
              <span style={{
                padding: '6px 12px',
                fontSize: '14px',
                fontWeight: '500',
                borderRadius: '9999px',
                ...getStatusColor(flow.status)
              }}>
                {flow.status === 'active' ? '活跃' : '停用'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderAIModels = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{
            fontSize: '32px',
            fontWeight: 'bold',
            color: '#111827',
            marginBottom: '8px',
            margin: '0 0 8px 0'
          }}>🧠 AI模型配置</h2>
          <p style={{ color: '#6b7280', margin: '0' }}>配置和管理AI模型参数</p>
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

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {aiModels.map((model) => (
          <div key={model.id} style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            padding: '24px',
            border: '1px solid #e5e7eb',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: '600',
                    color: '#111827',
                    margin: '0'
                  }}>{model.name}</h3>
                  <span style={{
                    padding: '2px 6px',
                    backgroundColor: '#f3f4f6',
                    borderRadius: '4px',
                    fontSize: '10px',
                    fontWeight: '500',
                    color: '#374151'
                  }}>
                    {model.provider}
                  </span>
                </div>
                <p style={{
                  fontSize: '14px',
                  color: '#6b7280',
                  marginBottom: '16px',
                  margin: '0 0 16px 0',
                  lineHeight: '1.5'
                }}>{model.description}</p>
                
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                  gap: '16px',
                  marginBottom: '16px'
                }}>
                  <div>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>温度</div>
                    <div style={{ fontSize: '14px', fontWeight: '500', color: '#111827' }}>{model.temperature}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>最大Token</div>
                    <div style={{ fontSize: '14px', fontWeight: '500', color: '#111827' }}>{model.maxTokens}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>成本</div>
                    <div style={{ fontSize: '14px', fontWeight: '500', color: '#111827' }}>${model.cost}/1K</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>准确率</div>
                    <div style={{ fontSize: '14px', fontWeight: '500', color: '#111827' }}>{model.accuracy}%</div>
                  </div>
                  <div>
                    <div style={{ fontSize: '12px', color: '#6b7280', marginBottom: '4px' }}>速度</div>
                    <div style={{ fontSize: '14px', fontWeight: '500', color: '#111827' }}>
                      {model.speed === 'fast' ? '快速' : model.speed === 'medium' ? '中等' : '慢速'}
                    </div>
                  </div>
                </div>
              </div>
              
              <span style={{
                padding: '6px 12px',
                fontSize: '14px',
                fontWeight: '500',
                borderRadius: '9999px',
                ...getStatusColor(model.status)
              }}>
                {model.status === 'active' ? '活跃' : '停用'}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const renderReplyTemplates = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        <div>
          <h2 style={{
            fontSize: '32px',
            fontWeight: 'bold',
            color: '#111827',
            marginBottom: '8px',
            margin: '0 0 8px 0'
          }}>📝 回复模板管理</h2>
          <p style={{ color: '#6b7280', margin: '0' }}>管理AI回复模板库</p>
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

      <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        {replyTemplates.map((template) => (
          <div key={template.id} style={{
            backgroundColor: '#ffffff',
            borderRadius: '12px',
            padding: '24px',
            border: '1px solid #e5e7eb',
            boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
          }}>
            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between' }}>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '8px' }}>
                  <h3 style={{
                    fontSize: '18px',
                    fontWeight: '600',
                    color: '#111827',
                    margin: '0'
                  }}>{template.name}</h3>
                  <span style={{
                    padding: '2px 6px',
                    backgroundColor: '#f3f4f6',
                    borderRadius: '4px',
                    fontSize: '10px',
                    fontWeight: '500',
                    color: '#374151'
                  }}>
                    {template.type}
                  </span>
                  <span style={{
                    padding: '2px 6px',
                    backgroundColor: '#eff6ff',
                    borderRadius: '4px',
                    fontSize: '10px',
                    fontWeight: '500',
                    color: '#1e40af'
                  }}>
                    {template.language}
                  </span>
                </div>
                
                <div style={{
                  backgroundColor: '#f8fafc',
                  borderRadius: '8px',
                  padding: '12px',
                  marginBottom: '12px',
                  border: '1px solid #e5e7eb'
                }}>
                  <div style={{ fontSize: '14px', color: '#374151', lineHeight: '1.5' }}>
                    {template.content}
                  </div>
                </div>
                
                <div style={{ display: 'flex', gap: '16px' }}>
                  <span style={{
                    padding: '4px 8px',
                    backgroundColor: '#eff6ff',
                    borderRadius: '6px',
                    fontSize: '12px',
                    color: '#1e40af'
                  }}>使用: {template.usage}次</span>
                  <span style={{
                    padding: '4px 8px',
                    backgroundColor: '#f3f4f6',
                    borderRadius: '6px',
                    fontSize: '12px',
                    color: '#6b7280'
                  }}>最后使用: {template.lastUsed}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <>
      <style>
        {`
          @keyframes spin {
            from { transform: rotate(0deg); }
            to { transform: rotate(360deg); }
          }
        `}
      </style>
      
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
          {currentView === 'knowledge-base' && renderKnowledgeBase()}
          {currentView === 'conversation-flows' && renderConversationFlows()}
          {currentView === 'ai-models' && renderAIModels()}
          {currentView === 'reply-templates' && renderReplyTemplates()}

          {/* 创建模态框 */}
          {showCreateModal && (
            <div style={{
              position: 'fixed',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
              backgroundColor: 'rgba(0, 0, 0, 0.5)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              zIndex: 50,
              padding: '16px'
            }}>
              <div style={{
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
                padding: '32px',
                width: '100%',
                maxWidth: '600px',
                maxHeight: '90vh',
                overflowY: 'auto'
              }}>
                <div style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  marginBottom: '24px'
                }}>
                  <h3 style={{
                    fontSize: '24px',
                    fontWeight: 'bold',
                    color: '#111827',
                    margin: '0'
                  }}>
                    {modalType === 'knowledge-base' ? '📚 添加知识库条目' :
                     modalType === 'conversation-flow' ? '🔄 创建对话流程' :
                     modalType === 'ai-model' ? '🧠 配置AI模型' :
                     '📝 添加回复模板'}
                  </h3>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    style={{
                      color: '#9ca3af',
                      padding: '8px',
                      backgroundColor: 'transparent',
                      border: 'none',
                      cursor: 'pointer',
                      fontSize: '20px'
                    }}
                  >
                    ×
                  </button>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                  {modalType === 'knowledge-base' && (
                    <>
                      <div>
                        <label style={{
                          display: 'block',
                          fontSize: '14px',
                          fontWeight: '500',
                          color: '#374151',
                          marginBottom: '6px'
                        }}>
                          标题
                        </label>
                        <input
                          type="text"
                          value={formData.title}
                          onChange={(e) => setFormData({...formData, title: e.target.value})}
                          placeholder="输入知识库条目标题"
                          style={{
                            width: '100%',
                            padding: '12px',
                            border: '1px solid #d1d5db',
                            borderRadius: '8px',
                            fontSize: '14px',
                            backgroundColor: '#ffffff'
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
                          内容
                        </label>
                        <textarea
                          value={formData.content}
                          onChange={(e) => setFormData({...formData, content: e.target.value})}
                          placeholder="输入知识库条目内容"
                          rows={4}
                          style={{
                            width: '100%',
                            padding: '12px',
                            border: '1px solid #d1d5db',
                            borderRadius: '8px',
                            fontSize: '14px',
                            backgroundColor: '#ffffff',
                            resize: 'vertical'
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
                          分类
                        </label>
                        <select
                          value={formData.category}
                          onChange={(e) => setFormData({...formData, category: e.target.value})}
                          style={{
                            width: '100%',
                            padding: '12px',
                            border: '1px solid #d1d5db',
                            borderRadius: '8px',
                            fontSize: '14px',
                            backgroundColor: '#ffffff'
                          }}
                        >
                          <option value="">选择分类</option>
                          <option value="售后政策">售后政策</option>
                          <option value="物流配送">物流配送</option>
                          <option value="支付相关">支付相关</option>
                          <option value="产品信息">产品信息</option>
                          <option value="账户管理">账户管理</option>
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
                          关键词
                        </label>
                        <input
                          type="text"
                          value={formData.keywords}
                          onChange={(e) => setFormData({...formData, keywords: e.target.value})}
                          placeholder="用逗号分隔关键词"
                          style={{
                            width: '100%',
                            padding: '12px',
                            border: '1px solid #d1d5db',
                            borderRadius: '8px',
                            fontSize: '14px',
                            backgroundColor: '#ffffff'
                          }}
                        />
                      </div>
                    </>
                  )}
                </div>

                <div style={{
                  marginTop: '32px',
                  display: 'flex',
                  gap: '12px',
                  justifyContent: 'flex-end'
                }}>
                  <button
                    onClick={() => setShowCreateModal(false)}
                    style={{
                      padding: '12px 24px',
                      color: '#6b7280',
                      backgroundColor: '#ffffff',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      cursor: 'pointer',
                      fontWeight: '500'
                    }}
                  >
                    取消
                  </button>
                  <button
                    onClick={handleCreate}
                    disabled={loading}
                    style={{
                      padding: '12px 24px',
                      backgroundColor: loading ? '#9ca3af' : '#3b82f6',
                      color: '#ffffff',
                      border: 'none',
                      borderRadius: '8px',
                      cursor: loading ? 'not-allowed' : 'pointer',
                      fontWeight: '500',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '8px'
                    }}
                  >
                    {loading && (
                      <div style={{
                        width: '16px',
                        height: '16px',
                        border: '2px solid #ffffff',
                        borderTop: '2px solid transparent',
                        borderRadius: '50%',
                        animation: 'spin 1s linear infinite'
                      }} />
                    )}
                    创建
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 对话流程创建器 */}
      {showFlowCreator && (
        <ConversationFlowCreator
          onClose={() => setShowFlowCreator(false)}
          onSave={(newFlow) => {
            setConversationFlows(prev => [...prev, newFlow]);
            setShowFlowCreator(false);
          }}
        />
      )}
    </>
  );
};

export default AIRobotConfig;
