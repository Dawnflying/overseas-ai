import React, { useState, useCallback, useEffect } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

const MarketAnalysis = () => {
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState({
    targetMarket: '',
    productCategory: '',
    companySize: '',
    budget: '',
    timeline: '',
    experience: ''
  })
  const [isAnalyzing, setIsAnalyzing] = useState(false)
  const [analysisResult, setAnalysisResult] = useState(null)
  const [currentAnalysis, setCurrentAnalysis] = useState('')

  const steps = [
    { id: 1, title: '基础信息', description: '输入企业基本信息' },
    { id: 2, title: '市场选择', description: '选择目标市场' },
    { id: 3, title: '深度分析', description: 'AI智能分析' },
    { id: 4, title: '分析报告', description: '查看详细报告' }
  ]

  const companySizes = [
    { value: 'startup', label: '初创企业', icon: '🚀' },
    { value: 'small', label: '中小企业', icon: '🏢' },
    { value: 'medium', label: '中型企业', icon: '🏭' },
    { value: 'large', label: '大型企业', icon: '🏬' }
  ]

  const productCategories = [
    { value: 'electronics', label: '电子产品', icon: '📱' },
    { value: 'fashion', label: '服装服饰', icon: '👕' },
    { value: 'home', label: '家居用品', icon: '🏠' },
    { value: 'beauty', label: '美妆个护', icon: '💄' },
    { value: 'food', label: '食品饮料', icon: '🍎' },
    { value: 'sports', label: '运动户外', icon: '⚽' }
  ]

  const targetMarkets = [
    { value: 'north-america', label: '北美市场', flag: '🇺🇸', description: '美国、加拿大' },
    { value: 'europe', label: '欧洲市场', flag: '🇪🇺', description: '欧盟、英国' },
    { value: 'southeast-asia', label: '东南亚市场', flag: '🇸🇬', description: '新加坡、马来西亚等' },
    { value: 'middle-east', label: '中东市场', flag: '🇦🇪', description: '阿联酋、沙特等' },
    { value: 'latin-america', label: '拉美市场', flag: '🇧🇷', description: '巴西、墨西哥等' },
    { value: 'africa', label: '非洲市场', flag: '🇿🇦', description: '南非、尼日利亚等' }
  ]

  const analysisTypes = [
    {
      id: 'market_size',
      name: '市场规模分析',
      icon: '📊',
      description: '分析目标市场的规模、增长趋势和潜力'
    },
    {
      id: 'competition',
      name: '竞争环境分析',
      icon: '⚔️',
      description: '评估竞争强度、识别主要竞争对手'
    },
    {
      id: 'consumer',
      name: '消费者洞察',
      icon: '👥',
      description: '分析目标用户画像和购买行为'
    },
    {
      id: 'access',
      name: '市场准入分析',
      icon: '🚪',
      description: '了解法规要求、认证标准和准入条件'
    },
    {
      id: 'risk',
      name: '风险评估',
      icon: '⚠️',
      description: '识别潜在风险并提供应对策略'
    }
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

  // 调用市场分析API
  const callMarketAnalysisAPI = useCallback(async (analysisType) => {
    try {
      const response = await fetch('/api/market-analysis', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          analysisType: analysisType,
          conversationId: 'market-analysis-stream'
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
                setCurrentAnalysis(content)
              }
            } catch (e) {
              // 忽略解析错误
            }
          }
        }
      }
      
      return content
    } catch (error) {
      console.error('市场分析API调用错误:', error)
      throw error
    }
  }, [formData])

  // 开始市场分析
  const handleStartAnalysis = useCallback(async () => {
    setIsAnalyzing(true)
    setAnalysisResult(null)
    setCurrentAnalysis('')

    try {
      const results = {}

      // 依次进行不同类型的分析
      for (const analysisType of analysisTypes) {
        setCurrentAnalysis('')
        const content = await callMarketAnalysisAPI(analysisType.id)
        results[analysisType.id] = {
          name: analysisType.name,
          icon: analysisType.icon,
          content: content
        }
      }

      setAnalysisResult(results)
      setCurrentStep(4)
    } catch (error) {
      console.error('市场分析失败:', error)
      alert('市场分析时出现错误，请稍后重试。')
    } finally {
      setIsAnalyzing(false)
      setCurrentAnalysis('')
    }
  }, [formData, analysisTypes, callMarketAnalysisAPI])

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="step-content">
            <h3 className="step-title">企业基础信息</h3>
            
            <div className="form-group">
              <label className="form-label">企业规模</label>
              <div className="option-grid">
                {companySizes.map(size => (
                  <button
                    key={size.value}
                    className={`option-card ${formData.companySize === size.value ? 'selected' : ''}`}
                    onClick={() => handleInputChange('companySize', size.value)}
                  >
                    <span className="option-icon">{size.icon}</span>
                    <span className="option-label">{size.label}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">产品类别</label>
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
              <label className="form-label">出海预算 (人民币)</label>
              <select
                value={formData.budget}
                onChange={(e) => handleInputChange('budget', e.target.value)}
                className="form-select"
              >
                <option value="">请选择预算范围</option>
                <option value="under-100k">10万以下</option>
                <option value="100k-500k">10-50万</option>
                <option value="500k-1m">50-100万</option>
                <option value="1m-5m">100-500万</option>
                <option value="over-5m">500万以上</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">出海时间计划</label>
              <select
                value={formData.timeline}
                onChange={(e) => handleInputChange('timeline', e.target.value)}
                className="form-select"
              >
                <option value="">请选择时间计划</option>
                <option value="3months">3个月内</option>
                <option value="6months">6个月内</option>
                <option value="1year">1年内</option>
                <option value="over-1year">1年以上</option>
              </select>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="step-content">
            <h3 className="step-title">目标市场选择</h3>
            
            <div className="form-group">
              <label className="form-label">选择目标市场</label>
              <div className="market-grid">
                {targetMarkets.map(market => (
                  <button
                    key={market.value}
                    className={`market-card ${formData.targetMarket === market.value ? 'selected' : ''}`}
                    onClick={() => handleInputChange('targetMarket', market.value)}
                  >
                    <div className="market-header">
                      <span className="market-flag">{market.flag}</span>
                      <span className="market-label">{market.label}</span>
                    </div>
                    <span className="market-description">{market.description}</span>
                  </button>
                ))}
              </div>
            </div>

            <div className="form-group">
              <label className="form-label">跨境电商经验</label>
              <select
                value={formData.experience}
                onChange={(e) => handleInputChange('experience', e.target.value)}
                className="form-select"
              >
                <option value="">请选择经验水平</option>
                <option value="beginner">新手（首次出海）</option>
                <option value="intermediate">有经验（有国内电商经验）</option>
                <option value="expert">专家（有跨境电商经验）</option>
              </select>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="step-content">
            {!isAnalyzing ? (
              <>
                <h3 className="step-title">市场分析准备</h3>
                
                <div className="summary-section">
                  <h4>分析配置</h4>
                  <div className="summary-grid">
                    <div className="summary-item">
                      <span className="summary-label">企业规模:</span>
                      <span className="summary-value">
                        {companySizes.find(s => s.value === formData.companySize)?.label || '未选择'}
                      </span>
                    </div>
                    <div className="summary-item">
                      <span className="summary-label">产品类别:</span>
                      <span className="summary-value">
                        {productCategories.find(c => c.value === formData.productCategory)?.label || '未选择'}
                      </span>
                    </div>
                    <div className="summary-item">
                      <span className="summary-label">目标市场:</span>
                      <span className="summary-value">
                        {targetMarkets.find(m => m.value === formData.targetMarket)?.label || '未选择'}
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

                <div className="analysis-types">
                  <h4>分析维度</h4>
                  <div className="analysis-grid">
                    {analysisTypes.map(type => (
                      <div key={type.id} className="analysis-type-card">
                        <span className="analysis-icon">{type.icon}</span>
                        <div className="analysis-info">
                          <h5>{type.name}</h5>
                          <p>{type.description}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="action-section">
                  <button 
                    className="btn btn-primary btn-large" 
                    onClick={handleStartAnalysis}
                    disabled={!formData.targetMarket || !formData.productCategory}
                  >
                    🔍 开始市场分析
                  </button>
                  <p className="action-note">
                    AI将为您进行全面的市场分析，请耐心等待
                  </p>
                </div>
              </>
            ) : (
              <div className="analysis-section">
                <h3 className="step-title">AI正在分析市场数据...</h3>
                
                {currentAnalysis && (
                  <div className="current-analysis">
                    <div className="analysis-content">
                      <ReactMarkdown
                        remarkPlugins={[remarkGfm]}
                        components={{
                          h1: ({children}) => <h1 className="markdown-h1">{children}</h1>,
                          h2: ({children}) => <h2 className="markdown-h2">{children}</h2>,
                          h3: ({children}) => <h3 className="markdown-h3">{children}</h3>,
                          h4: ({children}) => <h4 className="markdown-h4">{children}</h4>,
                          p: ({children}) => <p className="markdown-p">{children}</p>,
                          ul: ({children}) => <ul className="markdown-ul">{children}</ul>,
                          ol: ({children}) => <ol className="markdown-ol">{children}</ol>,
                          li: ({children}) => <li className="markdown-li">{children}</li>,
                          strong: ({children}) => <strong className="markdown-strong">{children}</strong>,
                          em: ({children}) => <em className="markdown-em">{children}</em>,
                          table: ({children}) => <table className="markdown-table">{children}</table>,
                          th: ({children}) => <th className="markdown-th">{children}</th>,
                          td: ({children}) => <td className="markdown-td">{children}</td>,
                        }}
                      >
                        {currentAnalysis}
                      </ReactMarkdown>
                      <span className="cursor">|</span>
                    </div>
                  </div>
                )}

                <div className="progress-indicator">
                  {analysisTypes.map((type, index) => (
                    <div key={type.id} className="progress-step">
                      <div className="step-icon">{type.icon}</div>
                      <div className="step-name">{type.name}</div>
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
            <h3 className="step-title">市场分析报告</h3>
            
            {analysisResult && (
              <div className="analysis-results">
                {Object.entries(analysisResult).map(([key, section]) => (
                  <div key={key} className="analysis-section">
                    <div className="section-header">
                      <span className="section-icon">{section.icon}</span>
                      <h4 className="section-title">{section.name}</h4>
                    </div>
                    <div className="section-content">
                      <div className="content-markdown">
                        <ReactMarkdown
                          remarkPlugins={[remarkGfm]}
                          components={{
                            h1: ({children}) => <h1 className="markdown-h1">{children}</h1>,
                            h2: ({children}) => <h2 className="markdown-h2">{children}</h2>,
                            h3: ({children}) => <h3 className="markdown-h3">{children}</h3>,
                            h4: ({children}) => <h4 className="markdown-h4">{children}</h4>,
                            p: ({children}) => <p className="markdown-p">{children}</p>,
                            ul: ({children}) => <ul className="markdown-ul">{children}</ul>,
                            ol: ({children}) => <ol className="markdown-ol">{children}</ol>,
                            li: ({children}) => <li className="markdown-li">{children}</li>,
                            blockquote: ({children}) => <blockquote className="markdown-blockquote">{children}</blockquote>,
                            strong: ({children}) => <strong className="markdown-strong">{children}</strong>,
                            em: ({children}) => <em className="markdown-em">{children}</em>,
                            table: ({children}) => <table className="markdown-table">{children}</table>,
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
                
                <div className="analysis-actions">
                  <button 
                    className="btn btn-secondary"
                    onClick={() => {
                      setCurrentStep(1)
                      setAnalysisResult(null)
                      setFormData({
                        targetMarket: '',
                        productCategory: '',
                        companySize: '',
                        budget: '',
                        timeline: '',
                        experience: ''
                      })
                    }}
                  >
                    重新分析
                  </button>
                  <button 
                    className="btn btn-primary"
                    onClick={() => {
                      const reportText = Object.entries(analysisResult)
                        .map(([key, section]) => `# ${section.icon} ${section.name}\n\n${section.content}`)
                        .join('\n\n---\n\n')
                      
                      const blob = new Blob([reportText], { type: 'text/markdown' })
                      const url = URL.createObjectURL(blob)
                      const a = document.createElement('a')
                      a.href = url
                      a.download = '市场分析报告.md'
                      a.click()
                      URL.revokeObjectURL(url)
                    }}
                  >
                    📄 导出报告
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
    <div className="market-analysis">
      <div className="analysis-container">
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

        <div className="analysis-content">
          {renderStepContent()}
        </div>

        <div className="analysis-navigation">
          {currentStep > 1 && currentStep < 3 && (
            <button className="btn btn-secondary" onClick={handleBack}>
              上一步
            </button>
          )}
          {currentStep < 3 && (
            <button 
              className="btn btn-primary" 
              onClick={handleNext}
              disabled={
                (currentStep === 1 && (!formData.companySize || !formData.productCategory)) ||
                (currentStep === 2 && !formData.targetMarket)
              }
            >
              下一步
            </button>
          )}
        </div>
      </div>

      <style>{`
        .market-analysis {
          padding: 2rem 0;
          background: #f8fafc;
          min-height: 100vh;
        }

        .analysis-container {
          max-width: 1000px;
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

        .analysis-content {
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

        .market-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
        }

        .market-card {
          background: white;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          padding: 1.5rem;
          cursor: pointer;
          transition: all 0.2s ease;
          text-align: left;
        }

        .market-card:hover {
          border-color: #cbd5e1;
          transform: translateY(-2px);
        }

        .market-card.selected {
          border-color: #2563eb;
          background: #eff6ff;
        }

        .market-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 0.5rem;
        }

        .market-flag {
          font-size: 1.5rem;
        }

        .market-label {
          font-weight: 600;
          color: #1a1a1a;
        }

        .market-description {
          font-size: 0.875rem;
          color: #64748b;
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

        .analysis-types {
          margin-bottom: 2rem;
        }

        .analysis-types h4 {
          margin-bottom: 1rem;
          color: #1a1a1a;
          font-weight: 600;
        }

        .analysis-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1rem;
        }

        .analysis-type-card {
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 12px;
          padding: 1.5rem;
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .analysis-icon {
          font-size: 2rem;
        }

        .analysis-info h5 {
          margin: 0 0 0.5rem 0;
          color: #1a1a1a;
          font-weight: 600;
        }

        .analysis-info p {
          margin: 0;
          color: #64748b;
          font-size: 0.875rem;
          line-height: 1.4;
        }

        .action-section {
          text-align: center;
          padding: 2rem 0;
        }

        .btn {
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 8px;
          font-size: 0.875rem;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s ease;
          margin: 0 0.5rem;
        }

        .btn-primary {
          background: #2563eb;
          color: white;
        }

        .btn-primary:hover:not(:disabled) {
          background: #1d4ed8;
        }

        .btn-secondary {
          background: #6b7280;
          color: white;
        }

        .btn-secondary:hover {
          background: #4b5563;
        }

        .btn:disabled {
          background: #cbd5e1;
          cursor: not-allowed;
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

        .analysis-section {
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

        .content-markdown {
          font-size: 0.875rem;
          line-height: 1.6;
          color: #374151;
        }

        .markdown-h1, .markdown-h2, .markdown-h3, .markdown-h4 {
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

        .markdown-blockquote {
          margin: 1rem 0;
          padding: 1rem;
          background: #f8fafc;
          border-left: 4px solid #2563eb;
          border-radius: 0 8px 8px 0;
          font-style: italic;
          color: #64748b;
        }

        .current-analysis {
          background: white;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          padding: 1.5rem;
          margin-bottom: 2rem;
          min-height: 200px;
          max-height: 400px;
          overflow-y: auto;
        }

        .analysis-content {
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

        .step-icon {
          font-size: 1.5rem;
        }

        .step-name {
          font-size: 0.75rem;
          font-weight: 500;
          color: #64748b;
          text-align: center;
        }

        .analysis-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
          margin-top: 2rem;
          padding-top: 2rem;
          border-top: 1px solid #e2e8f0;
        }

        .analysis-navigation {
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

          .analysis-content {
            padding: 1.5rem;
          }

          .option-grid, .market-grid {
            grid-template-columns: 1fr;
          }

          .analysis-grid {
            grid-template-columns: 1fr;
          }

          .analysis-navigation {
            flex-direction: column;
            gap: 1rem;
            padding: 1rem;
          }

          .analysis-navigation .btn {
            width: 100%;
          }
        }
      `}</style>
    </div>
  )
}

export default MarketAnalysis
