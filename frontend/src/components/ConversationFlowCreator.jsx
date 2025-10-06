import React, { useState, useEffect } from 'react';

const ConversationFlowCreator = ({ onClose, onSave }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [flowData, setFlowData] = useState({
    name: '',
    description: '',
    trigger: '',
    steps: [],
    settings: {
      maxSteps: 10,
      timeout: 30,
      fallbackAction: 'transfer_to_human'
    }
  });
  const [selectedStep, setSelectedStep] = useState(null);
  const [showStepEditor, setShowStepEditor] = useState(false);
  const [loading, setLoading] = useState(false);

  // 步骤类型配置
  const stepTypes = [
    {
      id: 'intent',
      name: '意图识别',
      icon: '🎯',
      description: '识别用户意图和问题类型',
      fields: ['condition', 'confidence', 'fallback']
    },
    {
      id: 'collect',
      name: '信息收集',
      icon: '📝',
      description: '收集用户信息或需求',
      fields: ['fields', 'validation', 'required']
    },
    {
      id: 'analyze',
      name: '分析处理',
      icon: '🔍',
      description: '分析用户输入并处理',
      fields: ['method', 'parameters', 'rules']
    },
    {
      id: 'solution',
      name: '解决方案',
      icon: '💡',
      description: '提供解决方案或答案',
      fields: ['template', 'source', 'conditions']
    },
    {
      id: 'recommend',
      name: '推荐建议',
      icon: '⭐',
      description: '推荐产品或服务',
      fields: ['source', 'criteria', 'limit']
    },
    {
      id: 'guide',
      name: '引导操作',
      icon: '👆',
      description: '引导用户完成操作',
      fields: ['action', 'steps', 'help']
    },
    {
      id: 'confirm',
      name: '确认反馈',
      icon: '✅',
      description: '确认信息或获取反馈',
      fields: ['message', 'options', 'validation']
    },
    {
      id: 'transfer',
      name: '转接人工',
      icon: '👨‍💼',
      description: '转接到人工客服',
      fields: ['reason', 'queue', 'priority']
    }
  ];

  // 触发器类型
  const triggerTypes = [
    { id: 'keyword', name: '关键词触发', description: '当用户输入包含特定关键词时触发' },
    { id: 'intent', name: '意图触发', description: '当识别到特定意图时触发' },
    { id: 'condition', name: '条件触发', description: '当满足特定条件时触发' },
    { id: 'manual', name: '手动触发', description: '客服手动启动流程' }
  ];

  const addStep = (stepType) => {
    const newStep = {
      id: `step_${Date.now()}`,
      type: stepType.id,
      name: stepType.name,
      order: flowData.steps.length + 1,
      config: {},
      conditions: [],
      actions: []
    };

    // 根据步骤类型设置默认配置
    switch (stepType.id) {
      case 'intent':
        newStep.config = {
          condition: '',
          confidence: 0.8,
          fallback: 'continue'
        };
        break;
      case 'collect':
        newStep.config = {
          fields: [],
          validation: 'basic',
          required: true
        };
        break;
      case 'analyze':
        newStep.config = {
          method: 'keyword_match',
          parameters: {},
          rules: []
        };
        break;
      case 'solution':
        newStep.config = {
          template: '',
          source: 'knowledge_base',
          conditions: []
        };
        break;
      case 'recommend':
        newStep.config = {
          source: 'product_database',
          criteria: {},
          limit: 5
        };
        break;
      case 'guide':
        newStep.config = {
          action: '',
          steps: [],
          help: ''
        };
        break;
      case 'confirm':
        newStep.config = {
          message: '',
          options: ['是', '否'],
          validation: 'required'
        };
        break;
      case 'transfer':
        newStep.config = {
          reason: '',
          queue: 'general',
          priority: 'normal'
        };
        break;
    }

    setFlowData(prev => ({
      ...prev,
      steps: [...prev.steps, newStep]
    }));
  };

  const updateStep = (stepId, updates) => {
    setFlowData(prev => ({
      ...prev,
      steps: prev.steps.map(step =>
        step.id === stepId ? { ...step, ...updates } : step
      )
    }));
  };

  const deleteStep = (stepId) => {
    setFlowData(prev => ({
      ...prev,
      steps: prev.steps.filter(step => step.id !== stepId)
        .map((step, index) => ({ ...step, order: index + 1 }))
    }));
  };

  const moveStep = (stepId, direction) => {
    const steps = [...flowData.steps];
    const index = steps.findIndex(step => step.id === stepId);
    
    if (direction === 'up' && index > 0) {
      [steps[index], steps[index - 1]] = [steps[index - 1], steps[index]];
    } else if (direction === 'down' && index < steps.length - 1) {
      [steps[index], steps[index + 1]] = [steps[index + 1], steps[index]];
    }

    // 更新order
    steps.forEach((step, idx) => {
      step.order = idx + 1;
    });

    setFlowData(prev => ({
      ...prev,
      steps
    }));
  };

  const handleSave = async () => {
    setLoading(true);
    try {
      // 验证流程数据
      if (!flowData.name || !flowData.description || flowData.steps.length === 0) {
        alert('请填写流程名称、描述并至少添加一个步骤');
        return;
      }

      const response = await fetch('/api/customer-service/conversation-flows', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(flowData)
      });

      if (response.ok) {
        const result = await response.json();
        if (onSave) onSave(result.flow);
        if (onClose) onClose();
      }
    } catch (error) {
      console.error('保存对话流程失败:', error);
      alert('保存失败，请重试');
    } finally {
      setLoading(false);
    }
  };

  const renderStepSelector = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
      <h3 style={{
        fontSize: '18px',
        fontWeight: '600',
        color: '#111827',
        marginBottom: '16px',
        margin: '0 0 16px 0'
      }}>选择步骤类型</h3>
      
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '12px'
      }}>
        {stepTypes.map((type) => (
          <button
            key={type.id}
            onClick={() => addStep(type)}
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
            <div style={{ fontSize: '24px', marginBottom: '8px' }}>{type.icon}</div>
            <div style={{ fontSize: '14px', fontWeight: '500', color: '#111827', marginBottom: '4px' }}>
              {type.name}
            </div>
            <div style={{ fontSize: '12px', color: '#6b7280' }}>
              {type.description}
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  const renderStepEditor = () => {
    if (!selectedStep) return null;

    const stepType = stepTypes.find(type => type.id === selectedStep.type);

    return (
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
        zIndex: 100,
        padding: '16px'
      }}>
        <div style={{
          backgroundColor: '#ffffff',
          borderRadius: '12px',
          boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
          padding: '24px',
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
              fontSize: '20px',
              fontWeight: '600',
              color: '#111827',
              margin: '0'
            }}>
              {stepType?.icon} 编辑步骤: {stepType?.name}
            </h3>
            <button
              onClick={() => {
                setShowStepEditor(false);
                setSelectedStep(null);
              }}
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

          <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
            <div>
              <label style={{
                display: 'block',
                fontSize: '14px',
                fontWeight: '500',
                color: '#374151',
                marginBottom: '6px'
              }}>
                步骤名称
              </label>
              <input
                type="text"
                value={selectedStep.name}
                onChange={(e) => {
                  const updated = { ...selectedStep, name: e.target.value };
                  setSelectedStep(updated);
                  updateStep(selectedStep.id, { name: e.target.value });
                }}
                style={{
                  width: '100%',
                  padding: '8px 12px',
                  border: '1px solid #d1d5db',
                  borderRadius: '6px',
                  fontSize: '14px'
                }}
              />
            </div>

            {/* 根据步骤类型渲染不同的配置字段 */}
            {selectedStep.type === 'intent' && (
              <>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '6px'
                  }}>
                    识别条件
                  </label>
                  <input
                    type="text"
                    value={selectedStep.config.condition || ''}
                    onChange={(e) => {
                      const updated = {
                        ...selectedStep,
                        config: { ...selectedStep.config, condition: e.target.value }
                      };
                      setSelectedStep(updated);
                      updateStep(selectedStep.id, { config: updated.config });
                    }}
                    placeholder="例如: 包含'退货'或'退款'关键词"
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
                    置信度阈值
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={selectedStep.config.confidence || 0.8}
                    onChange={(e) => {
                      const updated = {
                        ...selectedStep,
                        config: { ...selectedStep.config, confidence: parseFloat(e.target.value) }
                      };
                      setSelectedStep(updated);
                      updateStep(selectedStep.id, { config: updated.config });
                    }}
                    style={{ width: '100%' }}
                  />
                  <div style={{ fontSize: '12px', color: '#6b7280', marginTop: '4px' }}>
                    当前值: {(selectedStep.config.confidence || 0.8).toFixed(1)}
                  </div>
                </div>
              </>
            )}

            {selectedStep.type === 'collect' && (
              <>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '6px'
                  }}>
                    收集字段
                  </label>
                  <textarea
                    value={selectedStep.config.fields?.join('\n') || ''}
                    onChange={(e) => {
                      const fields = e.target.value.split('\n').filter(f => f.trim());
                      const updated = {
                        ...selectedStep,
                        config: { ...selectedStep.config, fields }
                      };
                      setSelectedStep(updated);
                      updateStep(selectedStep.id, { config: updated.config });
                    }}
                    placeholder="每行一个字段，例如:&#10;订单号&#10;问题描述&#10;联系方式"
                    rows={4}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px',
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
                    验证方式
                  </label>
                  <select
                    value={selectedStep.config.validation || 'basic'}
                    onChange={(e) => {
                      const updated = {
                        ...selectedStep,
                        config: { ...selectedStep.config, validation: e.target.value }
                      };
                      setSelectedStep(updated);
                      updateStep(selectedStep.id, { config: updated.config });
                    }}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  >
                    <option value="basic">基础验证</option>
                    <option value="strict">严格验证</option>
                    <option value="custom">自定义验证</option>
                  </select>
                </div>
              </>
            )}

            {selectedStep.type === 'solution' && (
              <>
                <div>
                  <label style={{
                    display: 'block',
                    fontSize: '14px',
                    fontWeight: '500',
                    color: '#374151',
                    marginBottom: '6px'
                  }}>
                    回复模板
                  </label>
                  <textarea
                    value={selectedStep.config.template || ''}
                    onChange={(e) => {
                      const updated = {
                        ...selectedStep,
                        config: { ...selectedStep.config, template: e.target.value }
                      };
                      setSelectedStep(updated);
                      updateStep(selectedStep.id, { config: updated.config });
                    }}
                    placeholder="例如: 根据您的问题'{question}'，我为您提供以下解决方案..."
                    rows={4}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px',
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
                    数据源
                  </label>
                  <select
                    value={selectedStep.config.source || 'knowledge_base'}
                    onChange={(e) => {
                      const updated = {
                        ...selectedStep,
                        config: { ...selectedStep.config, source: e.target.value }
                      };
                      setSelectedStep(updated);
                      updateStep(selectedStep.id, { config: updated.config });
                    }}
                    style={{
                      width: '100%',
                      padding: '8px 12px',
                      border: '1px solid #d1d5db',
                      borderRadius: '6px',
                      fontSize: '14px'
                    }}
                  >
                    <option value="knowledge_base">知识库</option>
                    <option value="product_database">产品数据库</option>
                    <option value="ai_generated">AI生成</option>
                    <option value="custom">自定义</option>
                  </select>
                </div>
              </>
            )}

            {/* 其他步骤类型的配置字段可以类似添加 */}
          </div>

          <div style={{
            marginTop: '24px',
            display: 'flex',
            gap: '12px',
            justifyContent: 'flex-end'
          }}>
            <button
              onClick={() => {
                setShowStepEditor(false);
                setSelectedStep(null);
              }}
              style={{
                padding: '8px 16px',
                color: '#6b7280',
                backgroundColor: '#ffffff',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              取消
            </button>
            <button
              onClick={() => {
                setShowStepEditor(false);
                setSelectedStep(null);
              }}
              style={{
                padding: '8px 16px',
                backgroundColor: '#3b82f6',
                color: '#ffffff',
                border: 'none',
                borderRadius: '6px',
                cursor: 'pointer',
                fontSize: '14px'
              }}
            >
              保存
            </button>
          </div>
        </div>
      </div>
    );
  };

  const renderFlowDesigner = () => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
      {/* 流程基本信息 */}
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
        }}>流程基本信息</h3>
        
        <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
          <div>
            <label style={{
              display: 'block',
              fontSize: '14px',
              fontWeight: '500',
              color: '#374151',
              marginBottom: '6px'
            }}>
              流程名称 *
            </label>
            <input
              type="text"
              value={flowData.name}
              onChange={(e) => setFlowData(prev => ({ ...prev, name: e.target.value }))}
              placeholder="例如: 售后问题处理流程"
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
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
              流程描述 *
            </label>
            <textarea
              value={flowData.description}
              onChange={(e) => setFlowData(prev => ({ ...prev, description: e.target.value }))}
              placeholder="描述这个对话流程的用途和处理逻辑"
              rows={3}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px',
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
              触发条件
            </label>
            <select
              value={flowData.trigger}
              onChange={(e) => setFlowData(prev => ({ ...prev, trigger: e.target.value }))}
              style={{
                width: '100%',
                padding: '12px',
                border: '1px solid #d1d5db',
                borderRadius: '8px',
                fontSize: '14px'
              }}
            >
              <option value="">选择触发条件</option>
              {triggerTypes.map((trigger) => (
                <option key={trigger.id} value={trigger.id}>
                  {trigger.name} - {trigger.description}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* 流程步骤设计 */}
      <div style={{
        backgroundColor: '#ffffff',
        borderRadius: '12px',
        padding: '24px',
        border: '1px solid #e5e7eb',
        boxShadow: '0 1px 3px 0 rgba(0, 0, 0, 0.1)'
      }}>
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          marginBottom: '20px'
        }}>
          <h3 style={{
            fontSize: '18px',
            fontWeight: '600',
            color: '#111827',
            margin: '0'
          }}>流程步骤设计</h3>
          <button
            onClick={() => setCurrentStep(2)}
            style={{
              padding: '8px 16px',
              backgroundColor: '#3b82f6',
              color: '#ffffff',
              border: 'none',
              borderRadius: '6px',
              cursor: 'pointer',
              fontSize: '14px'
            }}
          >
            添加步骤
          </button>
        </div>

        {flowData.steps.length === 0 ? (
          <div style={{
            textAlign: 'center',
            padding: '48px',
            color: '#6b7280',
            backgroundColor: '#f8fafc',
            borderRadius: '8px',
            border: '1px dashed #d1d5db'
          }}>
            <div style={{ fontSize: '24px', marginBottom: '12px' }}>🔄</div>
            <div style={{ fontSize: '16px', marginBottom: '8px' }}>暂无流程步骤</div>
            <div style={{ fontSize: '14px' }}>点击"添加步骤"开始设计对话流程</div>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {flowData.steps.map((step, index) => {
              const stepType = stepTypes.find(type => type.id === step.type);
              return (
                <div key={step.id} style={{
                  display: 'flex',
                  alignItems: 'center',
                  padding: '16px',
                  backgroundColor: '#f8fafc',
                  borderRadius: '8px',
                  border: '1px solid #e5e7eb'
                }}>
                  <div style={{
                    width: '32px',
                    height: '32px',
                    backgroundColor: '#3b82f6',
                    color: '#ffffff',
                    borderRadius: '50%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '14px',
                    fontWeight: '500',
                    marginRight: '12px',
                    flexShrink: 0
                  }}>
                    {index + 1}
                  </div>
                  
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '4px' }}>
                      <span style={{ fontSize: '20px' }}>{stepType?.icon}</span>
                      <span style={{ fontSize: '16px', fontWeight: '500', color: '#111827' }}>
                        {step.name || stepType?.name}
                      </span>
                      <span style={{
                        padding: '2px 6px',
                        backgroundColor: '#eff6ff',
                        borderRadius: '4px',
                        fontSize: '10px',
                        fontWeight: '500',
                        color: '#1e40af'
                      }}>
                        {stepType?.name}
                      </span>
                    </div>
                    <div style={{ fontSize: '14px', color: '#6b7280' }}>
                      {stepType?.description}
                    </div>
                  </div>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button
                      onClick={() => {
                        setSelectedStep(step);
                        setShowStepEditor(true);
                      }}
                      style={{
                        padding: '6px 12px',
                        backgroundColor: '#3b82f6',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      编辑
                    </button>
                    <button
                      onClick={() => moveStep(step.id, 'up')}
                      disabled={index === 0}
                      style={{
                        padding: '6px 12px',
                        backgroundColor: index === 0 ? '#f3f4f6' : '#6b7280',
                        color: index === 0 ? '#9ca3af' : '#ffffff',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: index === 0 ? 'not-allowed' : 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      上移
                    </button>
                    <button
                      onClick={() => moveStep(step.id, 'down')}
                      disabled={index === flowData.steps.length - 1}
                      style={{
                        padding: '6px 12px',
                        backgroundColor: index === flowData.steps.length - 1 ? '#f3f4f6' : '#6b7280',
                        color: index === flowData.steps.length - 1 ? '#9ca3af' : '#ffffff',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: index === flowData.steps.length - 1 ? 'not-allowed' : 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      下移
                    </button>
                    <button
                      onClick={() => deleteStep(step.id)}
                      style={{
                        padding: '6px 12px',
                        backgroundColor: '#dc2626',
                        color: '#ffffff',
                        border: 'none',
                        borderRadius: '6px',
                        cursor: 'pointer',
                        fontSize: '12px'
                      }}
                    >
                      删除
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {/* 流程设置 */}
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
        }}>流程设置</h3>
        
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
              最大步骤数
            </label>
            <input
              type="number"
              min="1"
              max="20"
              value={flowData.settings.maxSteps}
              onChange={(e) => setFlowData(prev => ({
                ...prev,
                settings: { ...prev.settings, maxSteps: parseInt(e.target.value) }
              }))}
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
              超时时间(秒)
            </label>
            <input
              type="number"
              min="10"
              max="300"
              value={flowData.settings.timeout}
              onChange={(e) => setFlowData(prev => ({
                ...prev,
                settings: { ...prev.settings, timeout: parseInt(e.target.value) }
              }))}
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
              兜底操作
            </label>
            <select
              value={flowData.settings.fallbackAction}
              onChange={(e) => setFlowData(prev => ({
                ...prev,
                settings: { ...prev.settings, fallbackAction: e.target.value }
              }))}
              style={{
                width: '100%',
                padding: '8px 12px',
                border: '1px solid #d1d5db',
                borderRadius: '6px',
                fontSize: '14px'
              }}
            >
              <option value="transfer_to_human">转接人工</option>
              <option value="end_conversation">结束对话</option>
              <option value="restart_flow">重新开始</option>
              <option value="show_help">显示帮助</option>
            </select>
          </div>
        </div>
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
          maxWidth: '900px',
          maxHeight: '90vh',
          overflowY: 'auto'
        }}>
          <div style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            marginBottom: '24px'
          }}>
            <div>
              <h2 style={{
                fontSize: '24px',
                fontWeight: 'bold',
                color: '#111827',
                marginBottom: '4px',
                margin: '0 0 4px 0'
              }}>🔄 创建对话流程</h2>
              <p style={{
                fontSize: '14px',
                color: '#6b7280',
                margin: '0'
              }}>设计AI客服的对话逻辑和处理流程</p>
            </div>
            <button
              onClick={onClose}
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

          {currentStep === 1 && renderStepSelector()}
          {currentStep === 2 && renderFlowDesigner()}

          <div style={{
            marginTop: '32px',
            display: 'flex',
            gap: '12px',
            justifyContent: 'flex-end'
          }}>
            <button
              onClick={onClose}
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
            {currentStep === 1 && (
              <button
                onClick={() => setCurrentStep(2)}
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#3b82f6',
                  color: '#ffffff',
                  border: 'none',
                  borderRadius: '8px',
                  cursor: 'pointer',
                  fontWeight: '500'
                }}
              >
                下一步
              </button>
            )}
            {currentStep === 2 && (
              <button
                onClick={handleSave}
                disabled={loading}
                style={{
                  padding: '12px 24px',
                  backgroundColor: loading ? '#9ca3af' : '#10b981',
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
                保存流程
              </button>
            )}
          </div>
        </div>
      </div>

      {showStepEditor && renderStepEditor()}
    </>
  );
};

export default ConversationFlowCreator;
