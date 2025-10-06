import React, { useState, useCallback, useEffect, useMemo } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'

const OverseasTools = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [selectedFilters, setSelectedFilters] = useState({
    price: 'all',
    difficulty: 'all',
    language: 'all',
    features: []
  })
  const [selectedTool, setSelectedTool] = useState(null)
  const [isAIModalOpen, setIsAIModalOpen] = useState(false)
  const [aiQuery, setAiQuery] = useState('')
  const [aiResponse, setAiResponse] = useState('')
  const [isAILoading, setIsAILoading] = useState(false)

  // 工具分类
  const categories = [
    { id: 'all', name: '全部工具', icon: '🔧', count: 0 },
    { id: 'ecommerce', name: '电商平台', icon: '🛒', count: 0 },
    { id: 'analytics', name: '数据分析', icon: '📊', count: 0 },
    { id: 'design', name: '设计工具', icon: '🎨', count: 0 },
    { id: 'social', name: '社媒营销', icon: '📱', count: 0 },
    { id: 'payment', name: '支付收款', icon: '💰', count: 0 },
    { id: 'logistics', name: '物流仓储', icon: '🚚', count: 0 },
    { id: 'advertising', name: '广告投放', icon: '📈', count: 0 },
    { id: 'seo', name: 'SEO优化', icon: '🔍', count: 0 },
    { id: 'content', name: '内容创作', icon: '📝', count: 0 },
    { id: 'compliance', name: '合规工具', icon: '🛡️', count: 0 }
  ]

  // 工具数据
  const tools = [
    // 电商平台
    {
      id: 'amazon',
      name: 'Amazon Seller Central',
      category: 'ecommerce',
      icon: '🛒',
      description: '全球最大的电商平台，覆盖全球多个市场',
      price: 'free',
      difficulty: 'medium',
      languages: ['en', 'zh'],
      features: ['多市场', 'FBA', '广告'],
      pros: ['流量巨大', '品牌影响力强', '完善的物流体系'],
      cons: ['竞争激烈', '费用较高', '规则复杂'],
      setupGuide: '注册亚马逊卖家账户，完成身份验证，设置支付方式',
      chineseGuide: '详细的中文注册和设置教程',
      vpnRequired: true,
      rating: 4.5,
      users: '500万+'
    },
    {
      id: 'shopify',
      name: 'Shopify',
      category: 'ecommerce',
      icon: '🏪',
      description: '专业的电商建站平台，适合独立站卖家',
      price: 'paid',
      difficulty: 'easy',
      languages: ['en', 'zh'],
      features: ['建站', '支付', '主题'],
      pros: ['易于使用', '主题丰富', '生态完善'],
      cons: ['月费较高', '交易手续费', '依赖第三方'],
      setupGuide: '选择套餐，注册账户，选择主题，添加产品',
      chineseGuide: 'Shopify中文建站完整教程',
      vpnRequired: false,
      rating: 4.7,
      users: '200万+'
    },
    {
      id: 'aliexpress',
      name: 'AliExpress',
      category: 'ecommerce',
      icon: '🌏',
      description: '阿里巴巴旗下的全球B2C平台',
      price: 'free',
      difficulty: 'easy',
      languages: ['en', 'zh'],
      features: ['批发', '一件代发', '全球配送'],
      pros: ['门槛低', '产品丰富', '中文支持'],
      cons: ['利润较低', '质量控制难', '竞争激烈'],
      setupGuide: '注册账户，选择产品，设置价格，开始销售',
      chineseGuide: '速卖通开店和运营指南',
      vpnRequired: false,
      rating: 4.2,
      users: '1000万+'
    },
    // 数据分析
    {
      id: 'google-analytics',
      name: 'Google Analytics',
      category: 'analytics',
      icon: '📊',
      description: '谷歌网站流量分析工具',
      price: 'free',
      difficulty: 'medium',
      languages: ['en', 'zh'],
      features: ['流量分析', '转化跟踪', '用户行为'],
      pros: ['功能强大', '免费使用', '数据准确'],
      cons: ['学习曲线陡峭', '需要技术知识', '隐私限制'],
      setupGuide: '创建GA账户，添加跟踪代码，设置目标',
      chineseGuide: 'Google Analytics中文使用教程',
      vpnRequired: true,
      rating: 4.6,
      users: '5000万+'
    },
    {
      id: 'hotjar',
      name: 'Hotjar',
      category: 'analytics',
      icon: '🔥',
      description: '用户行为分析和热力图工具',
      price: 'freemium',
      difficulty: 'easy',
      languages: ['en', 'zh'],
      features: ['热力图', '录屏', '反馈'],
      pros: ['可视化强', '易于理解', '免费版功能丰富'],
      cons: ['免费版限制', '数据隐私', '需要流量'],
      setupGuide: '注册账户，安装代码，开始收集数据',
      chineseGuide: 'Hotjar用户行为分析教程',
      vpnRequired: false,
      rating: 4.4,
      users: '100万+'
    },
    // 设计工具
    {
      id: 'canva',
      name: 'Canva',
      category: 'design',
      icon: '🎨',
      description: '在线设计平台，提供丰富的模板',
      price: 'freemium',
      difficulty: 'easy',
      languages: ['en', 'zh'],
      features: ['模板', '协作', '品牌套件'],
      pros: ['模板丰富', '易于使用', '中文支持'],
      cons: ['高级功能需付费', '创意限制', '文件格式限制'],
      setupGuide: '注册账户，选择模板，开始设计',
      chineseGuide: 'Canva中文设计教程',
      vpnRequired: false,
      rating: 4.8,
      users: '1亿+'
    },
    {
      id: 'figma',
      name: 'Figma',
      category: 'design',
      icon: '🎯',
      description: '专业的UI/UX设计工具',
      price: 'freemium',
      difficulty: 'medium',
      languages: ['en', 'zh'],
      features: ['协作设计', '原型', '组件库'],
      pros: ['协作功能强', '云端同步', '插件丰富'],
      cons: ['学习成本高', '网络要求高', '免费版限制'],
      setupGuide: '注册账户，学习基础操作，开始设计',
      chineseGuide: 'Figma UI设计入门教程',
      vpnRequired: true,
      rating: 4.7,
      users: '500万+'
    },
    // 社媒营销
    {
      id: 'facebook-ads',
      name: 'Facebook Ads',
      category: 'social',
      icon: '📘',
      description: 'Facebook广告投放平台',
      price: 'paid',
      difficulty: 'medium',
      languages: ['en', 'zh'],
      features: ['精准投放', '多种格式', '数据分析'],
      pros: ['用户基数大', '精准定向', '效果可追踪'],
      cons: ['竞争激烈', '成本上升', '政策严格'],
      setupGuide: '创建广告账户，设置支付方式，创建广告',
      chineseGuide: 'Facebook广告投放完整教程',
      vpnRequired: true,
      rating: 4.3,
      users: '1000万+'
    },
    {
      id: 'instagram',
      name: 'Instagram',
      category: 'social',
      icon: '📷',
      description: '图片和视频社交平台',
      price: 'free',
      difficulty: 'easy',
      languages: ['en', 'zh'],
      features: ['图片分享', '视频', '故事'],
      pros: ['视觉效果好', '年轻用户多', '互动性强'],
      cons: ['算法变化', '需要持续更新', '竞争激烈'],
      setupGuide: '注册账户，完善资料，开始发布内容',
      chineseGuide: 'Instagram营销策略指南',
      vpnRequired: true,
      rating: 4.5,
      users: '10亿+'
    },
    // 支付收款
    {
      id: 'paypal',
      name: 'PayPal',
      category: 'payment',
      icon: '💳',
      description: '全球领先的在线支付平台',
      price: 'paid',
      difficulty: 'easy',
      languages: ['en', 'zh'],
      features: ['全球支付', '安全', '易用'],
      pros: ['全球接受度高', '安全性强', '易于集成'],
      cons: ['手续费较高', '汇率损失', '冻结风险'],
      setupGuide: '注册账户，验证身份，设置银行账户',
      chineseGuide: 'PayPal注册和使用教程',
      vpnRequired: false,
      rating: 4.4,
      users: '3亿+'
    },
    {
      id: 'stripe',
      name: 'Stripe',
      category: 'payment',
      icon: '💙',
      description: '面向开发者的支付处理平台',
      price: 'paid',
      difficulty: 'hard',
      languages: ['en', 'zh'],
      features: ['API集成', '订阅', '多货币'],
      pros: ['技术先进', '费率透明', '文档完善'],
      cons: ['技术门槛高', '需要开发', '国内支持有限'],
      setupGuide: '注册账户，集成API，测试支付',
      chineseGuide: 'Stripe支付集成教程',
      vpnRequired: true,
      rating: 4.6,
      users: '100万+'
    }
  ]

  // 计算每个分类的工具数量
  const categoryCounts = useMemo(() => {
    const counts = {}
    categories.forEach(cat => {
      if (cat.id === 'all') {
        counts[cat.id] = tools.length
      } else {
        counts[cat.id] = tools.filter(tool => tool.category === cat.id).length
      }
    })
    return counts
  }, [tools])

  // 过滤工具
  const filteredTools = useMemo(() => {
    return tools.filter(tool => {
      // 分类过滤
      if (selectedCategory !== 'all' && tool.category !== selectedCategory) {
        return false
      }

      // 搜索过滤
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        const searchableText = `${tool.name} ${tool.description} ${tool.features.join(' ')}`.toLowerCase()
        if (!searchableText.includes(query)) {
          return false
        }
      }

      // 价格过滤
      if (selectedFilters.price !== 'all' && tool.price !== selectedFilters.price) {
        return false
      }

      // 难度过滤
      if (selectedFilters.difficulty !== 'all' && tool.difficulty !== selectedFilters.difficulty) {
        return false
      }

      // 语言过滤
      if (selectedFilters.language !== 'all' && !tool.languages.includes(selectedFilters.language)) {
        return false
      }

      // 功能过滤
      if (selectedFilters.features.length > 0) {
        const hasFeature = selectedFilters.features.some(feature => 
          tool.features.includes(feature)
        )
        if (!hasFeature) {
          return false
        }
      }

      return true
    })
  }, [tools, selectedCategory, searchQuery, selectedFilters])

  // AI问答处理
  const handleAIQuery = useCallback(async () => {
    if (!aiQuery.trim()) return

    setIsAILoading(true)
    setAiResponse('')

    try {
      const response = await fetch('/api/ai/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          message: `关于出海工具的问题：${aiQuery}`,
          context: 'tools'
        })
      })

      if (response.ok) {
        const data = await response.json()
        setAiResponse(data.response)
      } else {
        setAiResponse('抱歉，AI助手暂时无法回答您的问题，请稍后再试。')
      }
    } catch (error) {
      console.error('AI问答错误:', error)
      setAiResponse('网络错误，请检查网络连接后重试。')
    } finally {
      setIsAILoading(false)
    }
  }, [aiQuery])

  // 获取价格标签
  const getPriceLabel = (price) => {
    switch (price) {
      case 'free': return { label: '免费', color: 'green' }
      case 'freemium': return { label: '免费+付费', color: 'blue' }
      case 'paid': return { label: '付费', color: 'orange' }
      default: return { label: '未知', color: 'gray' }
    }
  }

  // 获取难度标签
  const getDifficultyLabel = (difficulty) => {
    switch (difficulty) {
      case 'easy': return { label: '简单', color: 'green' }
      case 'medium': return { label: '中等', color: 'yellow' }
      case 'hard': return { label: '困难', color: 'red' }
      default: return { label: '未知', color: 'gray' }
    }
  }

  return (
    <div className="overseas-tools">
      <div className="tools-container">
        {/* 头部搜索区域 */}
        <div className="tools-header">
          <div className="header-content">
            <h1 className="page-title">🚀 出海工具大全</h1>
            <p className="page-subtitle">为国内出海用户精选的实用工具集合</p>
            
            <div className="search-section">
              <div className="search-bar">
                <input
                  type="text"
                  placeholder="搜索工具名称、功能或描述..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
                <button className="search-btn">🔍</button>
              </div>
              
              <button 
                className="ai-helper-btn"
                onClick={() => setIsAIModalOpen(true)}
              >
                🤖 AI工具助手
              </button>
            </div>
          </div>
        </div>

        {/* 分类导航 */}
        <div className="categories-nav">
          {categories.map(category => (
            <button
              key={category.id}
              className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
              onClick={() => setSelectedCategory(category.id)}
            >
              <span className="category-icon">{category.icon}</span>
              <span className="category-name">{category.name}</span>
              <span className="category-count">({categoryCounts[category.id] || 0})</span>
            </button>
          ))}
        </div>

        {/* 筛选器 */}
        <div className="filters-section">
          <div className="filter-group">
            <label>价格类型：</label>
            <select 
              value={selectedFilters.price} 
              onChange={(e) => setSelectedFilters(prev => ({...prev, price: e.target.value}))}
            >
              <option value="all">全部</option>
              <option value="free">免费</option>
              <option value="freemium">免费+付费</option>
              <option value="paid">付费</option>
            </select>
          </div>

          <div className="filter-group">
            <label>使用难度：</label>
            <select 
              value={selectedFilters.difficulty} 
              onChange={(e) => setSelectedFilters(prev => ({...prev, difficulty: e.target.value}))}
            >
              <option value="all">全部</option>
              <option value="easy">简单</option>
              <option value="medium">中等</option>
              <option value="hard">困难</option>
            </select>
          </div>

          <div className="filter-group">
            <label>中文支持：</label>
            <select 
              value={selectedFilters.language} 
              onChange={(e) => setSelectedFilters(prev => ({...prev, language: e.target.value}))}
            >
              <option value="all">全部</option>
              <option value="zh">支持中文</option>
              <option value="en">仅英文</option>
            </select>
          </div>

          <button 
            className="clear-filters-btn"
            onClick={() => setSelectedFilters({
              price: 'all',
              difficulty: 'all',
              language: 'all',
              features: []
            })}
          >
            清除筛选
          </button>
        </div>

        {/* 工具列表 */}
        <div className="tools-grid">
          {filteredTools.map(tool => (
            <div key={tool.id} className="tool-card" onClick={() => setSelectedTool(tool)}>
              <div className="tool-header">
                <div className="tool-icon">{tool.icon}</div>
                <div className="tool-info">
                  <h3 className="tool-name">{tool.name}</h3>
                  <p className="tool-description">{tool.description}</p>
                </div>
              </div>

              <div className="tool-meta">
                <span className={`price-tag ${getPriceLabel(tool.price).color}`}>
                  {getPriceLabel(tool.price).label}
                </span>
                <span className={`difficulty-tag ${getDifficultyLabel(tool.difficulty).color}`}>
                  {getDifficultyLabel(tool.difficulty).label}
                </span>
                {tool.vpnRequired && <span className="vpn-tag">需要翻墙</span>}
              </div>

              <div className="tool-features">
                {tool.features.map(feature => (
                  <span key={feature} className="feature-tag">{feature}</span>
                ))}
              </div>

              <div className="tool-stats">
                <span className="rating">⭐ {tool.rating}</span>
                <span className="users">{tool.users} 用户</span>
              </div>
            </div>
          ))}
        </div>

        {filteredTools.length === 0 && (
          <div className="no-results">
            <h3>😔 没有找到匹配的工具</h3>
            <p>尝试调整搜索条件或筛选器</p>
          </div>
        )}
      </div>

      {/* 工具详情弹窗 */}
      {selectedTool && (
        <div className="tool-modal-overlay" onClick={() => setSelectedTool(null)}>
          <div className="tool-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">
                <span className="modal-icon">{selectedTool.icon}</span>
                <h2>{selectedTool.name}</h2>
              </div>
              <button className="close-btn" onClick={() => setSelectedTool(null)}>×</button>
            </div>

            <div className="modal-content">
              <div className="tool-overview">
                <p className="tool-description">{selectedTool.description}</p>
                
                <div className="tool-tags">
                  <span className={`price-tag ${getPriceLabel(selectedTool.price).color}`}>
                    {getPriceLabel(selectedTool.price).label}
                  </span>
                  <span className={`difficulty-tag ${getDifficultyLabel(selectedTool.difficulty).color}`}>
                    {getDifficultyLabel(selectedTool.difficulty).label}
                  </span>
                  {selectedTool.vpnRequired && <span className="vpn-tag">需要翻墙</span>}
                </div>

                <div className="tool-stats">
                  <div className="stat-item">
                    <span className="stat-label">评分：</span>
                    <span className="stat-value">⭐ {selectedTool.rating}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">用户数：</span>
                    <span className="stat-value">{selectedTool.users}</span>
                  </div>
                  <div className="stat-item">
                    <span className="stat-label">语言支持：</span>
                    <span className="stat-value">
                      {selectedTool.languages.map(lang => 
                        lang === 'zh' ? '中文' : '英文'
                      ).join(', ')}
                    </span>
                  </div>
                </div>
              </div>

              <div className="tool-details">
                <div className="detail-section">
                  <h3>✅ 优势</h3>
                  <ul>
                    {selectedTool.pros.map((pro, index) => (
                      <li key={index}>{pro}</li>
                    ))}
                  </ul>
                </div>

                <div className="detail-section">
                  <h3>⚠️ 注意事项</h3>
                  <ul>
                    {selectedTool.cons.map((con, index) => (
                      <li key={index}>{con}</li>
                    ))}
                  </ul>
                </div>

                <div className="detail-section">
                  <h3>🚀 快速开始</h3>
                  <p>{selectedTool.setupGuide}</p>
                </div>

                <div className="detail-section">
                  <h3>📚 中文教程</h3>
                  <p>{selectedTool.chineseGuide}</p>
                </div>
              </div>
            </div>

            <div className="modal-actions">
              <button className="btn btn-primary">
                🌐 访问官网
              </button>
              <button className="btn btn-secondary">
                📖 查看教程
              </button>
              <button 
                className="btn btn-ai"
                onClick={() => {
                  setSelectedTool(null)
                  setIsAIModalOpen(true)
                  setAiQuery(`关于${selectedTool.name}的使用问题：`)
                }}
              >
                🤖 AI助手
              </button>
            </div>
          </div>
        </div>
      )}

      {/* AI助手弹窗 */}
      {isAIModalOpen && (
        <div className="ai-modal-overlay" onClick={() => setIsAIModalOpen(false)}>
          <div className="ai-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h2>🤖 AI工具助手</h2>
              <button className="close-btn" onClick={() => setIsAIModalOpen(false)}>×</button>
            </div>

            <div className="modal-content">
              <div className="ai-query-section">
                <textarea
                  placeholder="问我任何关于出海工具的问题，比如：如何选择适合我的电商平台？"
                  value={aiQuery}
                  onChange={(e) => setAiQuery(e.target.value)}
                  className="ai-query-input"
                  rows={4}
                />
                <button 
                  className="ai-submit-btn"
                  onClick={handleAIQuery}
                  disabled={isAILoading || !aiQuery.trim()}
                >
                  {isAILoading ? '思考中...' : '提问'}
                </button>
              </div>

              {aiResponse && (
                <div className="ai-response-section">
                  <h3>AI回答：</h3>
                  <div className="ai-response">
                    <ReactMarkdown
                      remarkPlugins={[remarkGfm]}
                      components={{
                        h1: ({children}) => <h1 className="markdown-h1">{children}</h1>,
                        h2: ({children}) => <h2 className="markdown-h2">{children}</h2>,
                        h3: ({children}) => <h3 className="markdown-h3">{children}</h3>,
                        p: ({children}) => <p className="markdown-p">{children}</p>,
                        ul: ({children}) => <ul className="markdown-ul">{children}</ul>,
                        ol: ({children}) => <ol className="markdown-ol">{children}</ol>,
                        li: ({children}) => <li className="markdown-li">{children}</li>,
                        strong: ({children}) => <strong className="markdown-strong">{children}</strong>,
                        em: ({children}) => <em className="markdown-em">{children}</em>,
                      }}
                    >
                      {aiResponse}
                    </ReactMarkdown>
                  </div>
                </div>
              )}

              <div className="ai-suggestions">
                <h4>常见问题：</h4>
                <div className="suggestion-tags">
                  {[
                    '我是新手，应该选择哪个电商平台？',
                    '如何降低广告投放成本？',
                    '哪些工具适合中小卖家？',
                    '如何设置Google Analytics？',
                    'PayPal提现流程是什么？'
                  ].map((suggestion, index) => (
                    <button
                      key={index}
                      className="suggestion-tag"
                      onClick={() => setAiQuery(suggestion)}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .overseas-tools {
          min-height: 100vh;
          background: #f8fafc;
        }

        .tools-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem 1rem;
        }

        .tools-header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          border-radius: 16px;
          padding: 3rem 2rem;
          margin-bottom: 2rem;
          color: white;
          text-align: center;
        }

        .page-title {
          font-size: 2.5rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }

        .page-subtitle {
          font-size: 1.125rem;
          opacity: 0.9;
          margin-bottom: 2rem;
        }

        .search-section {
          display: flex;
          gap: 1rem;
          max-width: 600px;
          margin: 0 auto;
          align-items: center;
        }

        .search-bar {
          display: flex;
          flex: 1;
          background: white;
          border-radius: 12px;
          overflow: hidden;
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }

        .search-input {
          flex: 1;
          padding: 1rem 1.5rem;
          border: none;
          outline: none;
          font-size: 1rem;
          color: #374151;
        }

        .search-btn {
          padding: 1rem 1.5rem;
          background: #2563eb;
          color: white;
          border: none;
          cursor: pointer;
          font-size: 1.2rem;
          transition: background 0.2s;
        }

        .search-btn:hover {
          background: #1d4ed8;
        }

        .ai-helper-btn {
          padding: 1rem 1.5rem;
          background: rgba(255, 255, 255, 0.2);
          color: white;
          border: 2px solid rgba(255, 255, 255, 0.3);
          border-radius: 12px;
          cursor: pointer;
          font-size: 1rem;
          font-weight: 500;
          transition: all 0.2s;
          backdrop-filter: blur(10px);
        }

        .ai-helper-btn:hover {
          background: rgba(255, 255, 255, 0.3);
          border-color: rgba(255, 255, 255, 0.5);
        }

        .categories-nav {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 2rem;
          overflow-x: auto;
          padding-bottom: 0.5rem;
        }

        .category-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          background: white;
          border: 2px solid #e2e8f0;
          border-radius: 12px;
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
          font-size: 0.875rem;
          font-weight: 500;
        }

        .category-btn:hover {
          border-color: #cbd5e1;
          transform: translateY(-2px);
        }

        .category-btn.active {
          background: #2563eb;
          color: white;
          border-color: #2563eb;
        }

        .category-icon {
          font-size: 1.2rem;
        }

        .category-count {
          background: rgba(0, 0, 0, 0.1);
          padding: 0.25rem 0.5rem;
          border-radius: 6px;
          font-size: 0.75rem;
        }

        .category-btn.active .category-count {
          background: rgba(255, 255, 255, 0.2);
        }

        .filters-section {
          display: flex;
          gap: 1rem;
          align-items: center;
          margin-bottom: 2rem;
          padding: 1rem;
          background: white;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          flex-wrap: wrap;
        }

        .filter-group {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .filter-group label {
          font-weight: 500;
          color: #374151;
          font-size: 0.875rem;
        }

        .filter-group select {
          padding: 0.5rem;
          border: 1px solid #d1d5db;
          border-radius: 6px;
          font-size: 0.875rem;
          background: white;
        }

        .clear-filters-btn {
          padding: 0.5rem 1rem;
          background: #6b7280;
          color: white;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.875rem;
          transition: background 0.2s;
        }

        .clear-filters-btn:hover {
          background: #4b5563;
        }

        .tools-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
          gap: 1.5rem;
        }

        .tool-card {
          background: white;
          border-radius: 16px;
          padding: 1.5rem;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          border: 2px solid transparent;
        }

        .tool-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
          border-color: #2563eb;
        }

        .tool-header {
          display: flex;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .tool-icon {
          font-size: 2.5rem;
          width: 60px;
          height: 60px;
          display: flex;
          align-items: center;
          justify-content: center;
          background: #f8fafc;
          border-radius: 12px;
        }

        .tool-info {
          flex: 1;
        }

        .tool-name {
          font-size: 1.25rem;
          font-weight: 600;
          color: #1a1a1a;
          margin-bottom: 0.5rem;
        }

        .tool-description {
          color: #64748b;
          font-size: 0.875rem;
          line-height: 1.4;
        }

        .tool-meta {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1rem;
          flex-wrap: wrap;
        }

        .price-tag, .difficulty-tag, .vpn-tag {
          padding: 0.25rem 0.75rem;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 500;
        }

        .price-tag.green { background: #dcfce7; color: #166534; }
        .price-tag.blue { background: #dbeafe; color: #1e40af; }
        .price-tag.orange { background: #fed7aa; color: #9a3412; }
        
        .difficulty-tag.green { background: #dcfce7; color: #166534; }
        .difficulty-tag.yellow { background: #fef3c7; color: #92400e; }
        .difficulty-tag.red { background: #fecaca; color: #991b1b; }
        
        .vpn-tag {
          background: #fef2f2;
          color: #991b1b;
        }

        .tool-features {
          display: flex;
          gap: 0.5rem;
          margin-bottom: 1rem;
          flex-wrap: wrap;
        }

        .feature-tag {
          padding: 0.25rem 0.5rem;
          background: #f1f5f9;
          color: #475569;
          border-radius: 4px;
          font-size: 0.75rem;
        }

        .tool-stats {
          display: flex;
          justify-content: space-between;
          align-items: center;
          font-size: 0.875rem;
          color: #64748b;
        }

        .no-results {
          text-align: center;
          padding: 4rem 2rem;
          color: #64748b;
        }

        .no-results h3 {
          font-size: 1.5rem;
          margin-bottom: 1rem;
        }

        /* 弹窗样式 */
        .tool-modal-overlay, .ai-modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 2rem;
        }

        .tool-modal, .ai-modal {
          background: white;
          border-radius: 16px;
          max-width: 800px;
          width: 100%;
          max-height: 90vh;
          overflow-y: auto;
          box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.5rem 2rem;
          border-bottom: 1px solid #e2e8f0;
        }

        .modal-title {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .modal-icon {
          font-size: 2rem;
        }

        .close-btn {
          background: none;
          border: none;
          font-size: 2rem;
          cursor: pointer;
          color: #64748b;
          padding: 0;
          width: 40px;
          height: 40px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: background 0.2s;
        }

        .close-btn:hover {
          background: #f1f5f9;
        }

        .modal-content {
          padding: 2rem;
        }

        .tool-overview {
          margin-bottom: 2rem;
        }

        .tool-tags {
          display: flex;
          gap: 0.5rem;
          margin: 1rem 0;
          flex-wrap: wrap;
        }

        .tool-stats {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 1rem;
          margin-top: 1rem;
        }

        .stat-item {
          display: flex;
          justify-content: space-between;
          padding: 0.75rem;
          background: #f8fafc;
          border-radius: 8px;
        }

        .stat-label {
          font-weight: 500;
          color: #64748b;
        }

        .stat-value {
          font-weight: 600;
          color: #1a1a1a;
        }

        .detail-section {
          margin-bottom: 2rem;
        }

        .detail-section h3 {
          font-size: 1.125rem;
          font-weight: 600;
          color: #1a1a1a;
          margin-bottom: 1rem;
        }

        .detail-section ul {
          padding-left: 1.5rem;
        }

        .detail-section li {
          margin-bottom: 0.5rem;
          color: #374151;
          line-height: 1.5;
        }

        .modal-actions {
          display: flex;
          gap: 1rem;
          padding: 1.5rem 2rem;
          border-top: 1px solid #e2e8f0;
        }

        .btn {
          padding: 0.75rem 1.5rem;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 0.875rem;
          font-weight: 500;
          transition: all 0.2s;
        }

        .btn-primary {
          background: #2563eb;
          color: white;
        }

        .btn-primary:hover {
          background: #1d4ed8;
        }

        .btn-secondary {
          background: #6b7280;
          color: white;
        }

        .btn-secondary:hover {
          background: #4b5563;
        }

        .btn-ai {
          background: #10b981;
          color: white;
        }

        .btn-ai:hover {
          background: #059669;
        }

        /* AI弹窗特定样式 */
        .ai-query-section {
          margin-bottom: 2rem;
        }

        .ai-query-input {
          width: 100%;
          padding: 1rem;
          border: 2px solid #e2e8f0;
          border-radius: 8px;
          font-size: 1rem;
          resize: vertical;
          margin-bottom: 1rem;
        }

        .ai-query-input:focus {
          outline: none;
          border-color: #2563eb;
        }

        .ai-submit-btn {
          padding: 0.75rem 2rem;
          background: #2563eb;
          color: white;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 1rem;
          font-weight: 500;
          transition: background 0.2s;
        }

        .ai-submit-btn:hover:not(:disabled) {
          background: #1d4ed8;
        }

        .ai-submit-btn:disabled {
          background: #9ca3af;
          cursor: not-allowed;
        }

        .ai-response-section {
          margin-bottom: 2rem;
          padding: 1.5rem;
          background: #f8fafc;
          border-radius: 12px;
        }

        .ai-response-section h3 {
          margin-bottom: 1rem;
          color: #1a1a1a;
        }

        .ai-response {
          line-height: 1.6;
          color: #374151;
        }

        .ai-suggestions h4 {
          margin-bottom: 1rem;
          color: #1a1a1a;
        }

        .suggestion-tags {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .suggestion-tag {
          padding: 0.5rem 1rem;
          background: #eff6ff;
          color: #2563eb;
          border: 1px solid #dbeafe;
          border-radius: 20px;
          cursor: pointer;
          font-size: 0.875rem;
          transition: all 0.2s;
        }

        .suggestion-tag:hover {
          background: #dbeafe;
          border-color: #93c5fd;
        }

        /* Markdown样式 */
        .markdown-h1, .markdown-h2, .markdown-h3 {
          margin: 1rem 0 0.5rem 0;
          font-weight: 600;
          color: #1a1a1a;
        }

        .markdown-p {
          margin: 0.5rem 0;
          line-height: 1.6;
          color: #374151;
        }

        .markdown-ul, .markdown-ol {
          margin: 0.5rem 0;
          padding-left: 1.5rem;
        }

        .markdown-li {
          margin: 0.25rem 0;
          line-height: 1.5;
        }

        .markdown-strong {
          font-weight: 600;
          color: #1a1a1a;
        }

        .markdown-em {
          font-style: italic;
          color: #64748b;
        }

        @media (max-width: 768px) {
          .tools-container {
            padding: 1rem 0.5rem;
          }

          .tools-header {
            padding: 2rem 1rem;
          }

          .page-title {
            font-size: 2rem;
          }

          .search-section {
            flex-direction: column;
            gap: 1rem;
          }

          .search-bar {
            width: 100%;
          }

          .categories-nav {
            flex-wrap: wrap;
          }

          .filters-section {
            flex-direction: column;
            align-items: stretch;
            gap: 1rem;
          }

          .filter-group {
            flex-direction: column;
            align-items: stretch;
            gap: 0.5rem;
          }

          .tools-grid {
            grid-template-columns: 1fr;
          }

          .modal-actions {
            flex-direction: column;
          }

          .suggestion-tags {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  )
}

export default OverseasTools
