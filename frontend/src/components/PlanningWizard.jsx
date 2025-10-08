import React, { useState, useCallback } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import rehypeHighlight from 'rehype-highlight'
import 'highlight.js/styles/github.css'

const PlanningWizard = () => {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    businessType: '',
    experienceLevel: '',
    budget: '',
    productCategory: '',
    targetMarket: ''
  })
  const [isGenerating, setIsGenerating] = useState(false)
  const [streamingContent, setStreamingContent] = useState('')
  const [currentAgent, setCurrentAgent] = useState('')
  const [generatedPlan, setGeneratedPlan] = useState(null)

  const steps = [
    { id: 1, title: '基础信息', description: '了解您的业务背景' },
    { id: 2, title: '产品信息', description: '选择您的产品类型' },
    { id: 3, title: '生成规划', description: '获取AI建议' },
    { id: 4, title: '规划结果', description: '查看详细方案' }
  ]

  const businessTypes = [
    { value: 'startup', label: '初创企业', icon: '🚀' },
    { value: 'sme', label: '中小企业', icon: '🏢' },
    { value: 'enterprise', label: '大型企业', icon: '🏭' },
    { value: 'individual', label: '个人卖家', icon: '👤' }
  ]

  const experienceLevels = [
    { value: 'beginner', label: '新手', description: '第一次尝试跨境电商' },
    { value: 'intermediate', label: '有经验', description: '有国内电商经验' },
    { value: 'expert', label: '专家', description: '有跨境电商经验' }
  ]

  const productCategories = [
    { value: 'fashion', label: '服装服饰', icon: '👕' },
    { value: 'electronics', label: '电子产品', icon: '📱' },
    { value: 'home', label: '家居用品', icon: '🏠' },
    { value: 'beauty', label: '美妆个护', icon: '💄' }
  ]

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
  }

  const handleNext = () => {
    if (currentStep < steps.length) {
      setCurrentStep(currentStep + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1)
    }
  }

  // AI Agent 配置
  const aiAgents = [
    {
      id: 'market_analyst',
      name: '市场分析师',
      icon: '📊',
      description: '正在分析目标市场...',
      prompt: `作为专业的跨境电商市场分析师，请基于以下信息进行深度市场分析：

企业信息：
- 企业类型：${businessTypes.find(t => t.value === formData.businessType)?.label || '未选择'}
- 经验水平：${experienceLevels.find(l => l.value === formData.experienceLevel)?.label || '未选择'}
- 产品品类：${productCategories.find(c => c.value === formData.productCategory)?.label || '未选择'}
- 目标市场：${formData.targetMarket || '未选择'}
- 预算范围：${formData.budget || '未选择'}

请提供：
1. 目标市场机会分析
2. 竞争格局评估
3. 消费者行为洞察
4. 市场准入要求
5. 风险因素识别

请以结构化的方式呈现分析结果。`
    },
    {
      id: 'strategy_planner',
      name: '战略规划师',
      icon: '🎯',
      description: '正在制定出海策略...',
      prompt: `作为跨境电商战略规划专家，基于市场分析结果，制定详细的出海策略：

请制定：
1. 市场进入策略（优先市场选择）
2. 产品定位策略
3. 品牌建设规划
4. 渠道布局方案
5. 营销推广策略
6. 6个月实施时间表
7. 关键里程碑设定

请提供具体可执行的战略方案。`
    },
    {
      id: 'operation_manager',
      name: '运营专家',
      icon: '⚙️',
      description: '正在设计运营方案...',
      prompt: `作为跨境电商运营专家，请设计详细的运营执行方案：

运营方案包括：
1. 供应链管理策略
2. 物流配送方案
3. 仓储管理规划
4. 客服体系建设
5. 订单处理流程
6. 库存管理策略
7. 质量管控体系

请提供具体的操作指南和最佳实践。`
    },
    {
      id: 'finance_advisor',
      name: '财务顾问',
      icon: '💰',
      description: '正在制定财务规划...',
      prompt: `作为跨境电商财务顾问，请制定详细的财务规划：

财务规划包括：
1. 启动资金预算
2. 运营成本分析
3. 收入预测模型
4. 现金流管理
5. 税务合规方案
6. 汇率风险管理
7. 投资回报分析

请提供具体的财务数据和风险控制措施。`
    }
  ]

  // 流式 API 调用
  const callStreamingAPI = useCallback(async (agent, prompt) => {
    try {
      const response = await fetch('/ai/stream', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: prompt,
          agent: agent.id,
          conversationId: 'planning-wizard-stream'
        })
      })

      if (!response.ok) {
        throw new Error(`API请求失败: ${response.status}`)
      }

      const reader = response.body.getReader()
      const decoder = new TextDecoder()
      let content = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        const lines = chunk.split('\n')
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const data = line.slice(6)
            if (data === '[DONE]') {
              return content
            }
            try {
              const parsed = JSON.parse(data)
              if (parsed.content) {
                content += parsed.content
                setStreamingContent(content)
              }
            } catch (e) {
              // 忽略解析错误，继续处理下一行
            }
          }
        }
      }
      
      return content
    } catch (error) {
      console.error('流式API调用错误:', error)
      throw error
    }
  }, [])

  // 生成出海规划
  const handleSubmit = useCallback(async () => {
    setIsGenerating(true)
    setStreamingContent('')
    setCurrentAgent('')
    setGeneratedPlan(null)

    try {
      const planSections = {}

      // 依次调用不同的 AI Agent
      for (const agent of aiAgents) {
        setCurrentAgent(agent)
        setStreamingContent('')
        
        const content = await callStreamingAPI(agent, agent.prompt)
        planSections[agent.id] = {
          title: agent.name,
          icon: agent.icon,
          content: content
        }
      }

      setGeneratedPlan(planSections)
      setCurrentStep(4) // 跳转到结果页面
    } catch (error) {
      console.error('生成规划失败:', error)
      alert('生成出海规划时出现错误，请稍后重试。')
    } finally {
      setIsGenerating(false)
      setCurrentAgent('')
      setStreamingContent('')
    }
  }, [formData, aiAgents, callStreamingAPI])

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="step-content">
            <h3 className="step-title">请告诉我们您的基本情况</h3>
            
            <div className="form-group">
              <label className="form-label">企业类型</label>
              <div className="option-grid">
                {businessTypes.map(type => (
                  <button
                    key={type.value}
                    className={`option-card ${formData.businessType === type.value ? 'selected' : ''}`}
                    onClick={() => handleInputChange('businessType', type.value)}
                  >
                    <span className="option-icon">{type.icon}</span>
                    <span className="option-label">{type.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">跨境电商经验</label>
              <div className="option-list">
                {experienceLevels.map(level => (
                  <button
                    key={level.value}
                    className={`option-item ${formData.experienceLevel === level.value ? 'selected' : ''}`}
                    onClick={() => handleInputChange('experienceLevel', level.value)}
                  >
                    <div className="option-header">
                      <span className="option-title">{level.label}</span>
                    </div>
                    <span className="option-description">{level.description}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">初始预算 (人民币)</label>
              <select
                value={formData.budget}
                onChange={(e) => handleInputChange('budget', e.target.value)}
                className="form-select"
              >
                <option value="">请选择预算范围</option>
                <option value="under-50k">5万以下</option>
                <option value="50k-200k">5-20万</option>
                <option value="200k-500k">20-50万</option>
                <option value="500k-1m">50-100万</option>
                <option value="over-1m">100万以上</option>
              </select>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="step-content">
            <h3 className="step-title">请选择您的产品类型</h3>
            
            <div className="form-group">
              <label className="form-label">产品品类</label>
              <div className="option-grid">
                {productCategories.map(category => (
                  <button
                    key={category.value}
                    className={`option-card ${formData.productCategory === category.value ? 'selected' : ''}`}
                    onClick={() => handleInputChange('productCategory', category.value)}
                  >
                    <span className="option-icon">{category.icon}</span>
                    <span className="option-label">{category.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">目标市场</label>
              <select
                value={formData.targetMarket}
                onChange={(e) => handleInputChange('targetMarket', e.target.value)}
                className="form-select"
              >
                <option value="">请选择目标市场</option>
                <option value="north-america">北美市场</option>
                <option value="europe">欧洲市场</option>
                <option value="southeast-asia">东南亚市场</option>
                <option value="middle-east">中东市场</option>
                <option value="latin-america">拉美市场</option>
              </select>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="step-content">
            {!isGenerating ? (
              <>
                <h3 className="step-title">出海规划生成</h3>
                <div className="summary-section">
                  <h4>您的配置信息</h4>
                  <div className="summary-grid">
                    <div className="summary-item">
                      <span className="summary-label">企业类型:</span>
                      <span className="summary-value">
                        {businessTypes.find(t => t.value === formData.businessType)?.label || '未选择'}
                      </span>
                    </div>
                    <div className="summary-item">
                      <span className="summary-label">经验水平:</span>
                      <span className="summary-value">
                        {experienceLevels.find(l => l.value === formData.experienceLevel)?.label || '未选择'}
                      </span>
                    </div>
                    <div className="summary-item">
                      <span className="summary-label">产品品类:</span>
                      <span className="summary-value">
                        {productCategories.find(c => c.value === formData.productCategory)?.label || '未选择'}
                      </span>
                    </div>
                    <div className="summary-item">
                      <span className="summary-label">目标市场:</span>
                      <span className="summary-value">
                        {formData.targetMarket || '未选择'}
                      </span>
                    </div>
                    <div className="summary-item">
                      <span className="summary-label">预算范围:</span>
                      <span className="summary-value">
                        {formData.budget || '未选择'}
                      </span>
                    </div>
                  </div>
                </div>
                
                <div className="action-section">
                  <button className="btn btn-primary btn-large" onClick={handleSubmit}>
                    🚀 生成出海规划
                  </button>
                  <p className="action-note">
                    点击生成后，AI专家团队将为您创建详细的出海规划方案
                  </p>
                </div>
              </>
            ) : (
              <div className="generation-section">
                <h3 className="step-title">AI专家团队正在为您制定方案...</h3>
                
                {/* 显示当前工作的 Agent */}
                {currentAgent && (
                  <div className="current-agent">
                    <div className="agent-info">
                      <span className="agent-icon">{currentAgent.icon}</span>
                      <span className="agent-name">{currentAgent.name}</span>
                      <span className="agent-status">{currentAgent.description}</span>
                    </div>
                  </div>
                )}
                
                {/* 流式内容显示 */}
                {streamingContent && (
                  <div className="streaming-content">
                    <div className="streaming-text">
                      {streamingContent}
                      <span className="cursor">|</span>
                    </div>
                  </div>
                )}
                
                {/* 进度指示器 */}
                <div className="progress-indicator">
                  {aiAgents.map((agent, index) => (
                    <div 
                      key={agent.id} 
                      className={`progress-step ${
                        currentAgent?.id === agent.id ? 'active' : 
                        (currentAgent && aiAgents.indexOf(currentAgent) > index) ? 'completed' : ''
                      }`}
                    >
                      <div className="step-icon">{agent.icon}</div>
                      <div className="step-name">{agent.name}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )

      case 4:
        return (
          <div className="step-content">
            <h3 className="step-title">您的专属出海规划方案</h3>
            
            {generatedPlan && (
              <div className="plan-results">
                {Object.entries(generatedPlan).map(([key, section]) => (
                  <div key={key} className="plan-section">
                    <div className="section-header">
                      <span className="section-icon">{section.icon}</span>
                      <h4 className="section-title">{section.title}</h4>
                    </div>
                    <div className="section-content">
                      <div className="content-markdown">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          rehypePlugins={[rehypeHighlight]}
                          components={{
                            // 自定义组件样式
                            h1: ({children}) => <h1 className="markdown-h1">{children}</h1>,
                            h2: ({children}) => <h2 className="markdown-h2">{children}</h2>,
                            h3: ({children}) => <h3 className="markdown-h3">{children}</h3>,
                            h4: ({children}) => <h4 className="markdown-h4">{children}</h4>,
                            h5: ({children}) => <h5 className="markdown-h5">{children}</h5>,
                            h6: ({children}) => <h6 className="markdown-h6">{children}</h6>,
                            p: ({children}) => <p className="markdown-p">{children}</p>,
                            ul: ({children}) => <ul className="markdown-ul">{children}</ul>,
                            ol: ({children}) => <ol className="markdown-ol">{children}</ol>,
                            li: ({children}) => <li className="markdown-li">{children}</li>,
                            blockquote: ({children}) => <blockquote className="markdown-blockquote">{children}</blockquote>,
                            code: ({children}) => <code className="markdown-code">{children}</code>,
                            pre: ({children}) => <pre className="markdown-pre">{children}</pre>,
                            strong: ({children}) => <strong className="markdown-strong">{children}</strong>,
                            em: ({children}) => <em className="markdown-em">{children}</em>,
                            table: ({children}) => <table className="markdown-table">{children}</table>,
                            thead: ({children}) => <thead className="markdown-thead">{children}</thead>,
                            tbody: ({children}) => <tbody className="markdown-tbody">{children}</tbody>,
                            tr: ({children}) => <tr className="markdown-tr">{children}</tr>,
                            th: ({children}) => <th className="markdown-th">{children}</th>,
                            td: ({children}) => <td className="markdown-td">{children}</td>,
                          }}
                        >
                          {section.content}
                        </ReactMarkdown>
                      </div>
                    </div>
                  </div>
                ))}
                
                <div className="plan-actions">
                  <button 
                    className="btn btn-secondary"
                    onClick={() => {
                      setCurrentStep(1)
                      setGeneratedPlan(null)
                      setFormData({
                        businessType: '',
                        experienceLevel: '',
                        budget: '',
                        productCategory: '',
                        targetMarket: ''
                      })
                    }}
                  >
                    重新规划
                  </button>
                  <button 
                    className="btn btn-primary"
                    onClick={() => {
                      // 导出规划功能 - Markdown格式
                      const planText = Object.entries(generatedPlan)
                        .map(([key, section]) => `# ${section.icon} ${section.title}\n\n${section.content}`)
                        .join('\n\n---\n\n')
                      
                      const blob = new Blob([planText], { type: 'text/markdown' })
                      const url = URL.createObjectURL(blob)
                      const a = document.createElement('a')
                      a.href = url
                      a.download = '出海规划方案.md'
                      a.click()
                      URL.revokeObjectURL(url)
                    }}
                  >
                    📄 导出方案
                  </button>
                </div>
              </div>
            )}
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="planning-wizard">
      <div className="wizard-container">
        <div className="steps-indicator">
          {steps.map((step, index) => (
            <div key={step.id} className="step-item">
              <div className={`step-number ${currentStep >= step.id ? 'active' : ''}`}>
                {step.id}
              </div>
              <div className="step-info">
                <div className="step-title">{step.title}</div>
                <div className="step-description">{step.description}</div>
              </div>
              {index < steps.length - 1 && (
                <div className={`step-connector ${currentStep > step.id ? 'active' : ''}`}></div>
              )}
            </div>
          ))}
        </div>

        <div className="wizard-content">
          {renderStepContent()}
        </div>

        <div className="wizard-navigation">
          {currentStep > 1 && (
            <button className="btn btn-secondary" onClick={handleBack}>
              上一步
            </button>
          )}
          {currentStep < steps.length && (
            <button className="btn btn-primary" onClick={handleNext}>
              下一步
            </button>
          )}
        </div>
      </div>

      <style>{`
        .planning-wizard {
          padding: 2rem 0;
          background: #f8fafc;
          min-height: 100vh;
        }

        .wizard-container {
          max-width: 800px;
          margin: 0 auto;
          background: white;
          border-radius: 16px;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
          overflow: hidden;
        }

        .steps-indicator {
          display: flex;
          padding: 2rem;
          background: #f8fafc;
          border-bottom: 1px solid #e2e8f0;
        }

        .step-item {
          display: flex;
          align-items: center;
          flex: 1;
          position: relative;
        }

        .step-number {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #e2e8f0;
          color: #64748b;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: 600;
          font-size: 0.875rem;
          transition: all 0.3s ease;
          z-index: 2;
        }

        .step-number.active {
          background: #2563eb;
          color: white;
        }

        .step-info {
          margin-left: 1rem;
        }

        .step-title {
          font-weight: 600;
          color: #1a1a1a;
          font-size: 0.875rem;
        }

        .step-description {
          font-size: 0.75rem;
          color: #64748b;
          margin-top: 0.25rem;
        }

        .step-connector {
          flex: 1;
          height: 2px;
          background: #e2e8f0;
          margin: 0 1rem;
          position: absolute;
          right: -1rem;
          top: 50%;
          transform: translateY(-50%);
          width: calc(100% - 80px);
        }

        .step-connector.active {
          background: #2563eb;
        }

        .wizard-content {
          padding: 2rem;
        }

        .step-content .step-title {
          font-size: 1.5rem;
          font-weight: 600;
          color: #1a1a1a;
          margin-bottom: 2rem;
          text-align: center;
        }

        .form-group {
          margin-bottom: 2rem;
        }

        .form-label {
          display: block;
          margin-bottom: 0.75rem;
          font-weight: 600;
          color: #374151;
        }

        .option-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 1rem;
        }

        .option-card {
          background: white;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          padding: 1.5rem 1rem;
          cursor: pointer;
          transition: all 0.2s ease;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.75rem;
        }

        .option-card:hover {
          border-color: #cbd5e1;
          transform: translateY(-2px);
        }

        .option-card.selected {
          border-color: #2563eb;
          background: #eff6ff;
        }

        .option-icon {
          font-size: 2rem;
        }

        .option-label {
          font-weight: 500;
          color: #374151;
        }

        .option-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .option-item {
          background: white;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          padding: 1rem 1.5rem;
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: left;
        }

        .option-item:hover {
          border-color: #cbd5e1;
          transform: translateY(-1px);
        }

        .option-item.selected {
          border-color: #2563eb;
          background: #eff6ff;
        }

        .option-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 0.5rem;
        }

        .option-title {
          font-weight: 600;
          color: #1a1a1a;
        }

        .option-description {
          font-size: 0.875rem;
          color: #64748b;
          line-height: 1.4;
        }

        .form-select {
          width: 100%;
          padding: 0.75rem 1rem;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          font-size: 0.875rem;
          background: white;
          cursor: pointer;
          transition: all 0.2s ease;
        }

        .form-select:focus {
          outline: none;
          border-color: #2563eb;
          box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.1);
        }

        .summary-section {
          background: #f8fafc;
          border-radius: 12px;
          padding: 1.5rem;
          margin-bottom: 2rem;
        }

        .summary-section h4 {
          margin-bottom: 1rem;
          color: #1a1a1a;
          font-weight: 600;
        }

        .summary-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
        }

        .summary-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.75rem;
          background: white;
          border-radius: 8px;
          border: 1px solid #e2e8f0;
        }

        .summary-label {
          font-weight: 500;
          color: #64748b;
          font-size: 0.875rem;
        }

        .summary-value {
          font-weight: 600;
          color: #1a1a1a;
          font-size: 0.875rem;
        }

        .action-section {
          text-align: center;
          padding: 2rem 0;
        }

        .btn-large {
          padding: 1rem 2rem;
          font-size: 1rem;
          font-weight: 600;
        }

        .action-note {
          margin-top: 1rem;
          color: #64748b;
          font-size: 0.875rem;
        }

        .wizard-navigation {
          display: flex;
          justify-content: space-between;
          padding: 1.5rem 2rem;
          border-top: 1px solid #e2e8f0;
          background: #f8fafc;
        }

        @media (max-width: 768px) {
          .steps-indicator {
            flex-direction: column;
            gap: 1rem;
            padding: 1.5rem;
          }

          .step-item {
            flex-direction: column;
            text-align: center;
            gap: 0.5rem;
          }

          .step-info {
            margin-left: 0;
          }

          .step-connector {
            display: none;
          }

          .wizard-content {
            padding: 1.5rem;
          }

          .option-grid {
            grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
          }

          .summary-grid {
            grid-template-columns: 1fr;
          }

          .wizard-navigation {
            flex-direction: column;
            gap: 1rem;
            padding: 1rem;
          }

          .wizard-navigation .btn {
            width: 100%;
          }
        }

        /* 流式生成相关样式 */
        .generation-section {
          padding: 1rem 0;
        }

        .current-agent {
          background: #f8fafc;
          border-radius: 12px;
          padding: 1.5rem;
          margin-bottom: 2rem;
          border: 2px solid #e2e8f0;
        }

        .agent-info {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .agent-icon {
          font-size: 2rem;
        }

        .agent-name {
          font-size: 1.25rem;
          font-weight: 600;
          color: #1a1a1a;
        }

        .agent-status {
          font-size: 0.875rem;
          color: #64748b;
        }

        .streaming-content {
          background: white;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          padding: 1.5rem;
          margin-bottom: 2rem;
          min-height: 200px;
          max-height: 400px;
          overflow-y: auto;
        }

        .streaming-text {
          font-size: 0.875rem;
          line-height: 1.6;
          color: #374151;
          white-space: pre-wrap;
        }

        .cursor {
          animation: blink 1s infinite;
          color: #2563eb;
          font-weight: bold;
        }

        @keyframes blink {
          0%, 50% { opacity: 1; }
          51%, 100% { opacity: 0; }
        }

        .progress-indicator {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-top: 2rem;
          padding: 1rem;
          background: #f8fafc;
          border-radius: 12px;
        }

        .progress-step {
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 0.5rem;
          flex: 1;
          opacity: 0.4;
          transition: all 0.3s ease;
        }

        .progress-step.active {
          opacity: 1;
          transform: scale(1.1);
        }

        .progress-step.completed {
          opacity: 0.8;
        }

        .progress-step.active .step-icon {
          animation: pulse 2s infinite;
        }

        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.1); }
          100% { transform: scale(1); }
        }

        .step-icon {
          font-size: 1.5rem;
        }

        .step-name {
          font-size: 0.75rem;
          font-weight: 500;
          color: #64748b;
          text-align: center;
        }

        /* 规划结果样式 */
        .plan-results {
          padding: 1rem 0;
        }

        .plan-section {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          margin-bottom: 2rem;
          overflow: hidden;
        }

        .section-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 1.5rem;
          background: #f8fafc;
          border-bottom: 1px solid #e2e8f0;
        }

        .section-icon {
          font-size: 1.5rem;
        }

        .section-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: #1a1a1a;
          margin: 0;
        }

        .section-content {
          padding: 1.5rem;
        }

        .content-text {
          font-size: 0.875rem;
          line-height: 1.6;
          color: #374151;
        }

        /* Markdown 样式 */
        .content-markdown {
          font-size: 0.875rem;
          line-height: 1.6;
          color: #374151;
        }

        .markdown-h1, .markdown-h2, .markdown-h3, .markdown-h4, .markdown-h5, .markdown-h6 {
          margin: 1.5rem 0 1rem 0;
          font-weight: 600;
          color: #1a1a1a;
          line-height: 1.3;
        }

        .markdown-h1 {
          font-size: 1.5rem;
          border-bottom: 2px solid #e2e8f0;
          padding-bottom: 0.5rem;
        }

        .markdown-h2 {
          font-size: 1.25rem;
          border-bottom: 1px solid #e2e8f0;
          padding-bottom: 0.25rem;
        }

        .markdown-h3 {
          font-size: 1.125rem;
        }

        .markdown-h4 {
          font-size: 1rem;
        }

        .markdown-h5, .markdown-h6 {
          font-size: 0.875rem;
        }

        .markdown-p {
          margin: 1rem 0;
          line-height: 1.7;
        }

        .markdown-ul, .markdown-ol {
          margin: 1rem 0;
          padding-left: 1.5rem;
        }

        .markdown-li {
          margin: 0.5rem 0;
          line-height: 1.6;
        }

        .markdown-blockquote {
          margin: 1rem 0;
          padding: 1rem;
          background: #f8fafc;
          border-left: 4px solid #2563eb;
          border-radius: 0 8px 8px 0;
          font-style: italic;
          color: #64748b;
        }

        .markdown-code {
          background: #f1f5f9;
          color: #e11d48;
          padding: 0.125rem 0.25rem;
          border-radius: 4px;
          font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
          font-size: 0.8em;
        }

        .markdown-pre {
          background: #1e293b;
          color: #e2e8f0;
          padding: 1rem;
          border-radius: 8px;
          overflow-x: auto;
          margin: 1rem 0;
          font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
          font-size: 0.8rem;
          line-height: 1.5;
        }

        .markdown-pre code {
          background: transparent;
          color: inherit;
          padding: 0;
          border-radius: 0;
        }

        .markdown-strong {
          font-weight: 600;
          color: #1a1a1a;
        }

        .markdown-em {
          font-style: italic;
          color: #64748b;
        }

        .markdown-table {
          width: 100%;
          border-collapse: collapse;
          margin: 1rem 0;
          background: white;
          border-radius: 8px;
          overflow: hidden;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }

        .markdown-th, .markdown-td {
          padding: 0.75rem 1rem;
          text-align: left;
          border-bottom: 1px solid #e2e8f0;
        }

        .markdown-th {
          background: #f8fafc;
          font-weight: 600;
          color: #374151;
        }

        .markdown-tr:hover {
          background: #f8fafc;
        }

        .plan-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
          margin-top: 2rem;
          padding-top: 2rem;
          border-top: 1px solid #e2e8f0;
        }

        @media (max-width: 640px) {
          .planning-wizard {
            padding: 1rem 0;
          }

          .wizard-container {
            border-radius: 8px;
          }

          .step-content .step-title {
            font-size: 1.25rem;
          }

          .option-grid {
            grid-template-columns: 1fr;
          }

          .progress-indicator {
            flex-direction: column;
            gap: 1rem;
          }

          .progress-step {
            flex-direction: row;
            width: 100%;
            justify-content: flex-start;
          }

          .plan-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  )
}

export default PlanningWizard
