import React, { useState, useEffect, useCallback } from 'react'
import TikTokShopManager from './TikTokShopManager'
import IndependentStorePlatform from './IndependentStorePlatform'
import GoogleAdsManager from './GoogleAdsManager'
import CustomerServiceManager from './CustomerServiceManager'
import KnowledgeBase from './KnowledgeBase'

const OverseasDashboard = () => {
  const [activeModule, setActiveModule] = useState('overview')
  const [activeSubModule, setActiveSubModule] = useState('dashboard')
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const [userConfig, setUserConfig] = useState({})
  const [integratedTools, setIntegratedTools] = useState([])

  // 控制台模块配置
  const modules = [
    {
      id: 'overview',
      name: '总览',
      icon: '📊',
      subModules: [
        { id: 'dashboard', name: '仪表板', icon: '📈' },
        { id: 'analytics', name: '数据分析', icon: '📊' },
        { id: 'reports', name: '报告中心', icon: '📋' }
      ]
    },
    {
      id: 'ecommerce',
      name: '电商平台',
      icon: '🛒',
      subModules: [
        { id: 'amazon', name: 'Amazon', icon: '🛒' },
        { id: 'shopify', name: 'Shopify', icon: '🏪' },
        { id: 'ebay', name: 'eBay', icon: '💙' },
        { id: 'aliexpress', name: '速卖通', icon: '🌏' },
        { id: 'lazada', name: 'Lazada', icon: '🛍️' },
        { id: 'tiktok', name: 'TikTok Shop', icon: '🎵' },
        { id: 'independent', name: '独立站平台', icon: '🏗️' }
      ]
    },
    {
      id: 'marketing',
      name: '营销推广',
      icon: '📈',
      subModules: [
        { id: 'google-ads', name: 'Google Ads', icon: '🔍' },
        { id: 'facebook-ads', name: 'Facebook Ads', icon: '📘' },
        { id: 'tiktok-ads', name: 'TikTok Ads', icon: '🎵' },
        { id: 'seo', name: 'SEO优化', icon: '🔍' },
        { id: 'social-media', name: '社媒管理', icon: '📱' }
      ]
    },
    {
      id: 'logistics',
      name: '物流仓储',
      icon: '🚚',
      subModules: [
        { id: 'shipping', name: '物流管理', icon: '🚚' },
        { id: 'warehouse', name: '仓储管理', icon: '📦' },
        { id: 'inventory', name: '库存管理', icon: '📊' },
        { id: 'fulfillment', name: '履约服务', icon: '✅' }
      ]
    },
    {
      id: 'finance',
      name: '财务管理',
      icon: '💰',
      subModules: [
        { id: 'payments', name: '支付管理', icon: '💳' },
        { id: 'accounting', name: '财务记账', icon: '📊' },
        { id: 'tax', name: '税务管理', icon: '📋' },
        { id: 'currency', name: '汇率管理', icon: '💱' }
      ]
    },
    {
      id: 'customer',
      name: '客户服务',
      icon: '🎧',
      subModules: [
        { id: 'service', name: '客户服务管理', icon: '🎧' },
        { id: 'support', name: '客服中心', icon: '💬' },
        { id: 'reviews', name: '评价管理', icon: '⭐' },
        { id: 'feedback', name: '反馈处理', icon: '💭' },
        { id: 'crm', name: '客户管理', icon: '👤' }
      ]
    },
    {
      id: 'tools',
      name: '工具集成',
      icon: '🔧',
      subModules: [
        { id: 'integrations', name: '已集成工具', icon: '🔗' },
        { id: 'available', name: '可用工具', icon: '➕' },
        { id: 'configurations', name: '配置管理', icon: '⚙️' },
        { id: 'api-keys', name: 'API密钥', icon: '🔑' }
      ]
    },
    {
      id: 'knowledge',
      name: '知识库',
      icon: '📚',
      subModules: [
        { id: 'knowledge-base', name: '知识库管理', icon: '📖' },
        { id: 'compliance', name: '合规认证', icon: '🛡️' },
        { id: 'market-guide', name: '市场指南', icon: '🗺️' },
        { id: 'best-practices', name: '最佳实践', icon: '⭐' }
      ]
    },
    {
      id: 'settings',
      name: '系统设置',
      icon: '⚙️',
      subModules: [
        { id: 'profile', name: '个人资料', icon: '👤' },
        { id: 'notifications', name: '消息通知', icon: '🔔' },
        { id: 'security', name: '安全设置', icon: '🔒' },
        { id: 'preferences', name: '偏好设置', icon: '🎨' }
      ]
    }
  ]

  // 工具集成配置
  const toolConfigs = {
    amazon: {
      name: 'Amazon Seller Central',
      icon: '🛒',
      description: 'Amazon卖家中心集成',
      status: 'connected',
      configFields: [
        { key: 'sellerId', label: 'Seller ID', type: 'text', required: true },
        { key: 'accessKey', label: 'Access Key', type: 'text', required: true },
        { key: 'secretKey', label: 'Secret Key', type: 'password', required: true },
        { key: 'marketplace', label: '市场', type: 'select', options: ['US', 'EU', 'JP', 'CA'], required: true }
      ]
    },
    shopify: {
      name: 'Shopify',
      icon: '🏪',
      description: 'Shopify店铺集成',
      status: 'disconnected',
      configFields: [
        { key: 'shopDomain', label: '店铺域名', type: 'text', required: true },
        { key: 'accessToken', label: 'Access Token', type: 'password', required: true },
        { key: 'apiVersion', label: 'API版本', type: 'select', options: ['2023-10', '2023-07', '2023-04'], required: true }
      ]
    },
    'google-ads': {
      name: 'Google Ads',
      icon: '🔍',
      description: 'Google广告账户集成',
      status: 'connected',
      configFields: [
        { key: 'customerId', label: 'Customer ID', type: 'text', required: true },
        { key: 'developerToken', label: 'Developer Token', type: 'text', required: true },
        { key: 'refreshToken', label: 'Refresh Token', type: 'password', required: true }
      ]
    },
    'facebook-ads': {
      name: 'Facebook Ads',
      icon: '📘',
      description: 'Facebook广告管理集成',
      status: 'disconnected',
      configFields: [
        { key: 'adAccountId', label: '广告账户ID', type: 'text', required: true },
        { key: 'accessToken', label: 'Access Token', type: 'password', required: true },
        { key: 'appId', label: 'App ID', type: 'text', required: true }
      ]
    }
  }

  // 获取当前模块
  const currentModule = modules.find(m => m.id === activeModule)
  const currentSubModule = currentModule?.subModules.find(sm => sm.id === activeSubModule)

  // 处理模块切换
  const handleModuleChange = (moduleId, subModuleId = null) => {
    setActiveModule(moduleId)
    if (subModuleId) {
      setActiveSubModule(subModuleId)
    } else {
      // 默认选择第一个子模块
      const module = modules.find(m => m.id === moduleId)
      if (module && module.subModules.length > 0) {
        setActiveSubModule(module.subModules[0].id)
      }
    }
  }

  // 处理工具连接
  const handleToolConnect = async (toolId) => {
    try {
      // 模拟API调用
      const response = await fetch(`/api/tools/${toolId}/connect`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ toolId })
      })

      if (response.ok) {
        setIntegratedTools(prev => [...prev, toolId])
        alert(`${toolConfigs[toolId].name} 连接成功！`)
      }
    } catch (error) {
      console.error('工具连接失败:', error)
      alert('工具连接失败，请稍后重试')
    }
  }

  // 处理工具断开
  const handleToolDisconnect = async (toolId) => {
    try {
      const response = await fetch(`/api/tools/${toolId}/disconnect`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ toolId })
      })

      if (response.ok) {
        setIntegratedTools(prev => prev.filter(id => id !== toolId))
        alert(`${toolConfigs[toolId].name} 已断开连接`)
      }
    } catch (error) {
      console.error('工具断开失败:', error)
      alert('工具断开失败，请稍后重试')
    }
  }

  // 渲染仪表板内容
  const renderDashboardContent = () => {
    switch (activeModule) {
      case 'overview':
        return renderOverviewContent()
      case 'ecommerce':
        return renderEcommerceContent()
      case 'marketing':
        return renderMarketingContent()
      case 'logistics':
        return renderLogisticsContent()
      case 'finance':
        return renderFinanceContent()
      case 'customer':
        return renderCustomerContent()
      case 'tools':
        return renderToolsContent()
      case 'knowledge':
        return renderKnowledgeContent()
      case 'settings':
        return renderSettingsContent()
      default:
        return renderOverviewContent()
    }
  }

  // 总览页面
  const renderOverviewContent = () => {
    if (activeSubModule === 'dashboard') {
      return (
        <div className="dashboard-overview">
          <h2>📊 总览仪表板</h2>
          
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon">💰</div>
              <div className="stat-content">
                <div className="stat-value">$12,450</div>
                <div className="stat-label">今日销售额</div>
                <div className="stat-change positive">+12.5%</div>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">📦</div>
              <div className="stat-content">
                <div className="stat-value">1,234</div>
                <div className="stat-label">今日订单</div>
                <div className="stat-change positive">+8.3%</div>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">👥</div>
              <div className="stat-content">
                <div className="stat-value">567</div>
                <div className="stat-label">新增客户</div>
                <div className="stat-change positive">+15.2%</div>
              </div>
            </div>
            
            <div className="stat-card">
              <div className="stat-icon">⭐</div>
              <div className="stat-content">
                <div className="stat-value">4.8</div>
                <div className="stat-label">平均评分</div>
                <div className="stat-change positive">+0.2</div>
              </div>
            </div>
          </div>

          <div className="charts-section">
            {/* 销售趋势图表 */}
            <div className="chart-card sales-trend-chart">
              <div className="chart-header">
                <h3>📈 销售趋势</h3>
                <div className="chart-period-selector">
                  <button className="period-btn active">7天</button>
                  <button className="period-btn">30天</button>
                  <button className="period-btn">90天</button>
                </div>
              </div>
              <div className="chart-content">
                <div className="sales-trend-chart-inner">
                  {/* Y轴标签 */}
                  <div className="chart-y-axis">
                    <span className="y-label">$15k</span>
                    <span className="y-label">$12k</span>
                    <span className="y-label">$9k</span>
                    <span className="y-label">$6k</span>
                    <span className="y-label">$3k</span>
                    <span className="y-label">$0</span>
                  </div>
                  {/* 图表区域 */}
                  <div className="chart-area">
                    {/* 背景网格线 */}
                    <div className="chart-grid">
                      <div className="grid-line"></div>
                      <div className="grid-line"></div>
                      <div className="grid-line"></div>
                      <div className="grid-line"></div>
                      <div className="grid-line"></div>
                    </div>
                    {/* 折线图数据点 */}
                    <svg className="chart-svg" viewBox="0 0 700 200" preserveAspectRatio="none">
                      {/* 渐变填充 */}
                      <defs>
                        <linearGradient id="salesGradient" x1="0%" y1="0%" x2="0%" y2="100%">
                          <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.3"/>
                          <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.05"/>
                        </linearGradient>
                      </defs>
                      {/* 面积填充 */}
                      <path 
                        d="M 0,160 L 100,140 L 200,130 L 300,110 L 400,95 L 500,85 L 600,70 L 700,60 L 700,200 L 0,200 Z" 
                        fill="url(#salesGradient)"
                      />
                      {/* 折线 */}
                      <path 
                        d="M 0,160 L 100,140 L 200,130 L 300,110 L 400,95 L 500,85 L 600,70 L 700,60" 
                        stroke="#3b82f6" 
                        strokeWidth="3" 
                        fill="none"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      {/* 数据点 */}
                      <circle cx="0" cy="160" r="5" fill="#3b82f6" />
                      <circle cx="100" cy="140" r="5" fill="#3b82f6" />
                      <circle cx="200" cy="130" r="5" fill="#3b82f6" />
                      <circle cx="300" cy="110" r="5" fill="#3b82f6" />
                      <circle cx="400" cy="95" r="5" fill="#3b82f6" />
                      <circle cx="500" cy="85" r="5" fill="#3b82f6" />
                      <circle cx="600" cy="70" r="5" fill="#3b82f6" />
                      <circle cx="700" cy="60" r="5" fill="#3b82f6" />
                    </svg>
                    {/* X轴标签 */}
                    <div className="chart-x-axis">
                      <span className="x-label">周一</span>
                      <span className="x-label">周二</span>
                      <span className="x-label">周三</span>
                      <span className="x-label">周四</span>
                      <span className="x-label">周五</span>
                      <span className="x-label">周六</span>
                      <span className="x-label">周日</span>
                    </div>
                  </div>
                </div>
                {/* 图表说明 */}
                <div className="chart-legend">
                  <div className="legend-item">
                    <span className="legend-color" style={{background: '#3b82f6'}}></span>
                    <span className="legend-text">销售额</span>
                  </div>
                  <div className="chart-summary">
                    <span className="summary-label">周总计:</span>
                    <span className="summary-value">$68,450</span>
                    <span className="summary-change positive">↑ 18.5%</span>
                  </div>
                </div>
              </div>
            </div>
            
            {/* 平台分布图表 */}
            <div className="chart-card platform-distribution-chart">
              <div className="chart-header">
                <h3>🏆 平台分布</h3>
                <div className="chart-info">
                  <span className="info-badge">本月数据</span>
                </div>
              </div>
              <div className="chart-content">
                <div className="platform-chart-container">
                  {/* 环形图 */}
                  <div className="donut-chart">
                    <svg viewBox="0 0 200 200" className="donut-svg">
                      {/* 背景圆环 */}
                      <circle cx="100" cy="100" r="80" fill="none" stroke="#f1f5f9" strokeWidth="30"/>
                      {/* Amazon - 40% (蓝色) */}
                      <circle 
                        cx="100" cy="100" r="80" 
                        fill="none" 
                        stroke="#3b82f6" 
                        strokeWidth="30"
                        strokeDasharray="201 503"
                        strokeDashoffset="0"
                        transform="rotate(-90 100 100)"
                      />
                      {/* TikTok - 30% (紫色) */}
                      <circle 
                        cx="100" cy="100" r="80" 
                        fill="none" 
                        stroke="#8b5cf6" 
                        strokeWidth="30"
                        strokeDasharray="151 503"
                        strokeDashoffset="-201"
                        transform="rotate(-90 100 100)"
                      />
                      {/* Shopify - 20% (绿色) */}
                      <circle 
                        cx="100" cy="100" r="80" 
                        fill="none" 
                        stroke="#10b981" 
                        strokeWidth="30"
                        strokeDasharray="100 503"
                        strokeDashoffset="-352"
                        transform="rotate(-90 100 100)"
                      />
                      {/* 其他 - 10% (橙色) */}
                      <circle 
                        cx="100" cy="100" r="80" 
                        fill="none" 
                        stroke="#f59e0b" 
                        strokeWidth="30"
                        strokeDasharray="50 503"
                        strokeDashoffset="-452"
                        transform="rotate(-90 100 100)"
                      />
                      {/* 中心文字 */}
                      <text x="100" y="95" textAnchor="middle" fontSize="24" fontWeight="bold" fill="#1e293b">
                        $245k
                      </text>
                      <text x="100" y="115" textAnchor="middle" fontSize="12" fill="#64748b">
                        总销售额
                      </text>
                    </svg>
                  </div>
                  {/* 图例 */}
                  <div className="platform-legend">
                    <div className="legend-item-platform">
                      <div className="legend-header">
                        <div className="legend-indicator">
                          <span className="legend-dot" style={{background: '#3b82f6'}}></span>
                          <span className="legend-name">Amazon</span>
                        </div>
                        <span className="legend-percentage">40%</span>
                      </div>
                      <div className="legend-details">
                        <span className="legend-amount">$98,000</span>
                        <span className="legend-trend positive">↑ 12%</span>
                      </div>
                    </div>
                    
                    <div className="legend-item-platform">
                      <div className="legend-header">
                        <div className="legend-indicator">
                          <span className="legend-dot" style={{background: '#8b5cf6'}}></span>
                          <span className="legend-name">TikTok Shop</span>
                        </div>
                        <span className="legend-percentage">30%</span>
                      </div>
                      <div className="legend-details">
                        <span className="legend-amount">$73,500</span>
                        <span className="legend-trend positive">↑ 25%</span>
                      </div>
                    </div>
                    
                    <div className="legend-item-platform">
                      <div className="legend-header">
                        <div className="legend-indicator">
                          <span className="legend-dot" style={{background: '#10b981'}}></span>
                          <span className="legend-name">Shopify</span>
                        </div>
                        <span className="legend-percentage">20%</span>
                      </div>
                      <div className="legend-details">
                        <span className="legend-amount">$49,000</span>
                        <span className="legend-trend positive">↑ 8%</span>
                      </div>
                    </div>
                    
                    <div className="legend-item-platform">
                      <div className="legend-header">
                        <div className="legend-indicator">
                          <span className="legend-dot" style={{background: '#f59e0b'}}></span>
                          <span className="legend-name">其他平台</span>
                        </div>
                        <span className="legend-percentage">10%</span>
                      </div>
                      <div className="legend-details">
                        <span className="legend-amount">$24,500</span>
                        <span className="legend-trend neutral">→ 0%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )
    }
    
    if (activeSubModule === 'analytics') {
      return (
        <div className="analytics-content">
          <h2>📊 数据分析</h2>
          <p>深度数据分析功能正在开发中...</p>
        </div>
      )
    }
    
    if (activeSubModule === 'reports') {
      return (
        <div className="reports-content">
          <h2>📋 报告中心</h2>
          <p>报告生成和管理功能正在开发中...</p>
        </div>
      )
    }
  }

  // 电商平台页面
  const renderEcommerceContent = () => {
    // 如果是TikTok Shop，显示专门的TikTok店铺管理组件
    if (activeSubModule === 'tiktok') {
      return <TikTokShopManager />
    }
    
    // 如果是独立站平台，显示独立站管理组件
    if (activeSubModule === 'independent') {
      return <IndependentStorePlatform />
    }
    const platformData = {
      amazon: {
        name: 'Amazon',
        icon: '🛒',
        stats: { orders: 456, revenue: '$8,900', growth: '+12%' },
        status: 'connected'
      },
      shopify: {
        name: 'Shopify',
        icon: '🏪',
        stats: { orders: 234, revenue: '$4,200', growth: '+8%' },
        status: 'disconnected'
      },
      ebay: {
        name: 'eBay',
        icon: '💙',
        stats: { orders: 123, revenue: '$2,100', growth: '+5%' },
        status: 'connected'
      }
    }

    return (
      <div className="ecommerce-content">
        <h2>🛒 电商平台管理</h2>
        
        <div className="platform-grid">
          {Object.entries(platformData).map(([key, platform]) => (
            <div key={key} className="platform-card">
              <div className="platform-header">
                <div className="platform-info">
                  <span className="platform-icon">{platform.icon}</span>
                  <div>
                    <h3>{platform.name}</h3>
                    <span className={`status-badge ${platform.status}`}>
                      {platform.status === 'connected' ? '已连接' : '未连接'}
                    </span>
                  </div>
                </div>
                <div className="platform-actions">
                  <button 
                    className="action-btn"
                    onClick={() => handleModuleChange('tools', 'integrations')}
                  >
                    {platform.status === 'connected' ? '管理' : '连接'}
                  </button>
                </div>
              </div>
              
              <div className="platform-stats">
                <div className="stat">
                  <span className="stat-value">{platform.stats.orders}</span>
                  <span className="stat-label">订单</span>
                </div>
                <div className="stat">
                  <span className="stat-value">{platform.stats.revenue}</span>
                  <span className="stat-label">收入</span>
                </div>
                <div className="stat">
                  <span className="stat-value">{platform.stats.growth}</span>
                  <span className="stat-label">增长</span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="quick-actions">
          <h3>🚀 快速操作</h3>
          <div className="action-grid">
            <button className="quick-action-btn">
              📦 同步库存
            </button>
            <button className="quick-action-btn">
              💰 更新价格
            </button>
            <button className="quick-action-btn">
              📊 查看报告
            </button>
            <button className="quick-action-btn">
              🔄 数据同步
            </button>
          </div>
        </div>
      </div>
    )
  }

  // 工具集成页面
  const renderToolsContent = () => {
    if (activeSubModule === 'integrations') {
      return (
        <div className="integrations-content">
          <h2>🔗 已集成工具</h2>
          
          <div className="integrated-tools">
            {Object.entries(toolConfigs).map(([key, tool]) => (
              <div key={key} className="tool-card">
                <div className="tool-header">
                  <div className="tool-info">
                    <span className="tool-icon">{tool.icon}</span>
                    <div>
                      <h3>{tool.name}</h3>
                      <p>{tool.description}</p>
                    </div>
                  </div>
                  <div className="tool-status">
                    <span className={`status-badge ${tool.status}`}>
                      {tool.status === 'connected' ? '已连接' : '未连接'}
                    </span>
                  </div>
                </div>
                
                <div className="tool-actions">
                  <button 
                    className="btn btn-primary"
                    onClick={() => handleModuleChange('tools', 'configurations')}
                  >
                    ⚙️ 配置
                  </button>
                  {tool.status === 'connected' ? (
                    <button 
                      className="btn btn-secondary"
                      onClick={() => handleToolDisconnect(key)}
                    >
                      🔌 断开
                    </button>
                  ) : (
                    <button 
                      className="btn btn-success"
                      onClick={() => handleToolConnect(key)}
                    >
                      🔗 连接
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    }
    
    if (activeSubModule === 'available') {
      return (
        <div className="available-tools-content">
          <h2>➕ 可用工具</h2>
          <p>发现和集成更多出海工具...</p>
        </div>
      )
    }
    
    if (activeSubModule === 'configurations') {
      return (
        <div className="configurations-content">
          <h2>⚙️ 配置管理</h2>
          <p>管理工具集成配置...</p>
        </div>
      )
    }
    
    if (activeSubModule === 'api-keys') {
      return (
        <div className="api-keys-content">
          <h2>🔑 API密钥管理</h2>
          <p>安全地管理API密钥...</p>
        </div>
      )
    }
  }

  // 其他模块的渲染函数
  const renderMarketingContent = () => {
    if (activeSubModule === 'google-ads') {
      return <GoogleAdsManager />
    }
    
    return (
      <div style={{
        padding: '32px',
        backgroundColor: '#f8fafc',
        minHeight: '100vh'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            padding: '32px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb'
          }}>
            <h2 style={{
              fontSize: '32px',
              fontWeight: 'bold',
              color: '#111827',
              marginBottom: '16px',
              margin: '0 0 16px 0'
            }}>📈 营销推广</h2>
            <p style={{
              fontSize: '16px',
              color: '#6b7280',
              marginBottom: '32px',
              margin: '0 0 32px 0'
            }}>选择下方的营销工具开始管理您的广告活动</p>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '24px'
            }}>
              <div
                onClick={() => setActiveSubModule('google-ads')}
                style={{
                  padding: '24px',
                  backgroundColor: '#f8fafc',
                  borderRadius: '12px',
                  border: '1px solid #e5e7eb',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  textAlign: 'center'
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
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
                <h3 style={{
                  fontSize: '20px',
                  fontWeight: '600',
                  color: '#111827',
                  marginBottom: '8px',
                  margin: '0 0 8px 0'
                }}>Google Ads</h3>
                <p style={{
                  fontSize: '14px',
                  color: '#6b7280',
                  margin: '0'
                }}>管理Google搜索、展示和视频广告活动</p>
              </div>

              <div style={{
                padding: '24px',
                backgroundColor: '#f8fafc',
                borderRadius: '12px',
                border: '1px solid #e5e7eb',
                textAlign: 'center',
                opacity: '0.6'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>📘</div>
                <h3 style={{
                  fontSize: '20px',
                  fontWeight: '600',
                  color: '#111827',
                  marginBottom: '8px',
                  margin: '0 0 8px 0'
                }}>Facebook Ads</h3>
                <p style={{
                  fontSize: '14px',
                  color: '#6b7280',
                  margin: '0'
                }}>即将推出 - Facebook和Instagram广告管理</p>
              </div>

              <div style={{
                padding: '24px',
                backgroundColor: '#f8fafc',
                borderRadius: '12px',
                border: '1px solid #e5e7eb',
                textAlign: 'center',
                opacity: '0.6'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎵</div>
                <h3 style={{
                  fontSize: '20px',
                  fontWeight: '600',
                  color: '#111827',
                  marginBottom: '8px',
                  margin: '0 0 8px 0'
                }}>TikTok Ads</h3>
                <p style={{
                  fontSize: '14px',
                  color: '#6b7280',
                  margin: '0'
                }}>即将推出 - TikTok广告活动管理</p>
              </div>

              <div style={{
                padding: '24px',
                backgroundColor: '#f8fafc',
                borderRadius: '12px',
                border: '1px solid #e5e7eb',
                textAlign: 'center',
                opacity: '0.6'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>🔍</div>
                <h3 style={{
                  fontSize: '20px',
                  fontWeight: '600',
                  color: '#111827',
                  marginBottom: '8px',
                  margin: '0 0 8px 0'
                }}>SEO优化</h3>
                <p style={{
                  fontSize: '14px',
                  color: '#6b7280',
                  margin: '0'
                }}>即将推出 - 搜索引擎优化工具</p>
              </div>

              <div style={{
                padding: '24px',
                backgroundColor: '#f8fafc',
                borderRadius: '12px',
                border: '1px solid #e5e7eb',
                textAlign: 'center',
                opacity: '0.6'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>📱</div>
                <h3 style={{
                  fontSize: '20px',
                  fontWeight: '600',
                  color: '#111827',
                  marginBottom: '8px',
                  margin: '0 0 8px 0'
                }}>社媒管理</h3>
                <p style={{
                  fontSize: '14px',
                  color: '#6b7280',
                  margin: '0'
                }}>即将推出 - 社交媒体内容管理</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderLogisticsContent = () => (
    <div className="logistics-content">
      <h2>🚚 物流仓储</h2>
      <p>物流管理功能正在开发中...</p>
    </div>
  )

  const renderFinanceContent = () => (
    <div className="finance-content">
      <h2>💰 财务管理</h2>
      <p>财务管理功能正在开发中...</p>
    </div>
  )

  const renderCustomerContent = () => {
    if (activeSubModule === 'service') {
      return <CustomerServiceManager />
    }
    
    return (
      <div style={{
        padding: '32px',
        backgroundColor: '#f8fafc',
        minHeight: '100vh'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            padding: '32px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb'
          }}>
            <h2 style={{
              fontSize: '32px',
              fontWeight: 'bold',
              color: '#111827',
              marginBottom: '16px',
              margin: '0 0 16px 0'
            }}>🎧 客户服务</h2>
            <p style={{
              fontSize: '16px',
              color: '#6b7280',
              marginBottom: '32px',
              margin: '0 0 32px 0'
            }}>选择下方的客户服务工具开始管理您的客户关系</p>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '24px'
            }}>
              <div
                onClick={() => setActiveSubModule('service')}
                style={{
                  padding: '24px',
                  backgroundColor: '#f8fafc',
                  borderRadius: '12px',
                  border: '1px solid #e5e7eb',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  textAlign: 'center'
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
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>🎧</div>
                <h3 style={{
                  fontSize: '20px',
                  fontWeight: '600',
                  color: '#111827',
                  marginBottom: '8px',
                  margin: '0 0 8px 0'
                }}>客户服务管理</h3>
                <p style={{
                  fontSize: '14px',
                  color: '#6b7280',
                  margin: '0'
                }}>AI智能客服、对话分析、客户管理</p>
              </div>

              <div style={{
                padding: '24px',
                backgroundColor: '#f8fafc',
                borderRadius: '12px',
                border: '1px solid #e5e7eb',
                textAlign: 'center',
                opacity: '0.6'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>💬</div>
                <h3 style={{
                  fontSize: '20px',
                  fontWeight: '600',
                  color: '#111827',
                  marginBottom: '8px',
                  margin: '0 0 8px 0'
                }}>客服中心</h3>
                <p style={{
                  fontSize: '14px',
                  color: '#6b7280',
                  margin: '0'
                }}>即将推出 - 在线客服系统</p>
              </div>

              <div style={{
                padding: '24px',
                backgroundColor: '#f8fafc',
                borderRadius: '12px',
                border: '1px solid #e5e7eb',
                textAlign: 'center',
                opacity: '0.6'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>⭐</div>
                <h3 style={{
                  fontSize: '20px',
                  fontWeight: '600',
                  color: '#111827',
                  marginBottom: '8px',
                  margin: '0 0 8px 0'
                }}>评价管理</h3>
                <p style={{
                  fontSize: '14px',
                  color: '#6b7280',
                  margin: '0'
                }}>即将推出 - 客户评价和反馈管理</p>
              </div>

              <div style={{
                padding: '24px',
                backgroundColor: '#f8fafc',
                borderRadius: '12px',
                border: '1px solid #e5e7eb',
                textAlign: 'center',
                opacity: '0.6'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>💭</div>
                <h3 style={{
                  fontSize: '20px',
                  fontWeight: '600',
                  color: '#111827',
                  marginBottom: '8px',
                  margin: '0 0 8px 0'
                }}>反馈处理</h3>
                <p style={{
                  fontSize: '14px',
                  color: '#6b7280',
                  margin: '0'
                }}>即将推出 - 客户反馈处理系统</p>
              </div>

              <div style={{
                padding: '24px',
                backgroundColor: '#f8fafc',
                borderRadius: '12px',
                border: '1px solid #e5e7eb',
                textAlign: 'center',
                opacity: '0.6'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>👤</div>
                <h3 style={{
                  fontSize: '20px',
                  fontWeight: '600',
                  color: '#111827',
                  marginBottom: '8px',
                  margin: '0 0 8px 0'
                }}>客户管理</h3>
                <p style={{
                  fontSize: '14px',
                  color: '#6b7280',
                  margin: '0'
                }}>即将推出 - CRM客户关系管理</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderKnowledgeContent = () => {
    if (activeSubModule === 'knowledge-base') {
      return <KnowledgeBase />
    }
    
    return (
      <div style={{
        padding: '32px',
        backgroundColor: '#f8fafc',
        minHeight: '100vh'
      }}>
        <div style={{
          maxWidth: '1200px',
          margin: '0 auto'
        }}>
          <div style={{
            backgroundColor: '#ffffff',
            borderRadius: '16px',
            padding: '32px',
            boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
            border: '1px solid #e5e7eb'
          }}>
            <h2 style={{
              fontSize: '32px',
              fontWeight: 'bold',
              color: '#111827',
              marginBottom: '16px',
              margin: '0 0 16px 0'
            }}>📚 知识库</h2>
            <p style={{
              fontSize: '16px',
              color: '#6b7280',
              marginBottom: '32px',
              margin: '0 0 32px 0'
            }}>选择下方的知识库功能开始管理您的出海知识</p>
            
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
              gap: '24px'
            }}>
              <div style={{
                padding: '24px',
                backgroundColor: '#f8fafc',
                borderRadius: '12px',
                border: '1px solid #e5e7eb',
                textAlign: 'center',
                cursor: 'pointer',
                transition: 'all 0.2s'
              }}
              onClick={() => setActiveSubModule('knowledge-base')}
              onMouseEnter={(e) => {
                e.target.style.backgroundColor = '#f0f9ff'
                e.target.style.borderColor = '#3b82f6'
              }}
              onMouseLeave={(e) => {
                e.target.style.backgroundColor = '#f8fafc'
                e.target.style.borderColor = '#e5e7eb'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>📖</div>
                <h3 style={{
                  fontSize: '20px',
                  fontWeight: '600',
                  color: '#111827',
                  marginBottom: '8px',
                  margin: '0 0 8px 0'
                }}>知识库管理</h3>
                <p style={{
                  fontSize: '14px',
                  color: '#6b7280',
                  margin: '0'
                }}>管理出海合规知识库，支持智能搜索和AI问答</p>
              </div>

              <div style={{
                padding: '24px',
                backgroundColor: '#f8fafc',
                borderRadius: '12px',
                border: '1px solid #e5e7eb',
                textAlign: 'center',
                opacity: '0.6'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>🛡️</div>
                <h3 style={{
                  fontSize: '20px',
                  fontWeight: '600',
                  color: '#111827',
                  marginBottom: '8px',
                  margin: '0 0 8px 0'
                }}>合规认证</h3>
                <p style={{
                  fontSize: '14px',
                  color: '#6b7280',
                  margin: '0'
                }}>即将推出 - 合规认证管理</p>
              </div>

              <div style={{
                padding: '24px',
                backgroundColor: '#f8fafc',
                borderRadius: '12px',
                border: '1px solid #e5e7eb',
                textAlign: 'center',
                opacity: '0.6'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>🗺️</div>
                <h3 style={{
                  fontSize: '20px',
                  fontWeight: '600',
                  color: '#111827',
                  marginBottom: '8px',
                  margin: '0 0 8px 0'
                }}>市场指南</h3>
                <p style={{
                  fontSize: '14px',
                  color: '#6b7280',
                  margin: '0'
                }}>即将推出 - 目标市场指南</p>
              </div>

              <div style={{
                padding: '24px',
                backgroundColor: '#f8fafc',
                borderRadius: '12px',
                border: '1px solid #e5e7eb',
                textAlign: 'center',
                opacity: '0.6'
              }}>
                <div style={{ fontSize: '48px', marginBottom: '16px' }}>⭐</div>
                <h3 style={{
                  fontSize: '20px',
                  fontWeight: '600',
                  color: '#111827',
                  marginBottom: '8px',
                  margin: '0 0 8px 0'
                }}>最佳实践</h3>
                <p style={{
                  fontSize: '14px',
                  color: '#6b7280',
                  margin: '0'
                }}>即将推出 - 出海最佳实践</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  const renderSettingsContent = () => (
    <div className="settings-content">
      <h2>⚙️ 系统设置</h2>
      <p>系统设置功能正在开发中...</p>
    </div>
  )

  return (
    <div className="overseas-dashboard">
      <div className="dashboard-container">
        {/* 侧边栏 */}
        <div className={`dashboard-sidebar ${sidebarCollapsed ? 'collapsed' : ''}`}>
          <div className="sidebar-header">
            <h2 className="sidebar-title">
              {!sidebarCollapsed && '🚀 出海控制台'}
            </h2>
            <button 
              className="collapse-btn"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
            >
              {sidebarCollapsed ? '▶️' : '◀️'}
            </button>
          </div>

          <div className="sidebar-content">
            {modules.map(module => (
              <div key={module.id} className="module-group">
                <div 
                  className={`module-header ${activeModule === module.id ? 'active' : ''}`}
                  onClick={() => handleModuleChange(module.id)}
                >
                  <span className="module-icon">{module.icon}</span>
                  {!sidebarCollapsed && (
                    <>
                      <span className="module-name">{module.name}</span>
                      <span className="module-arrow">
                        {activeModule === module.id ? '▼' : '▶'}
                      </span>
                    </>
                  )}
                </div>
                
                {!sidebarCollapsed && activeModule === module.id && (
                  <div className="sub-modules">
                    {module.subModules.map(subModule => (
                      <div
                        key={subModule.id}
                        className={`sub-module ${activeSubModule === subModule.id ? 'active' : ''}`}
                        onClick={() => setActiveSubModule(subModule.id)}
                      >
                        <span className="sub-module-icon">{subModule.icon}</span>
                        <span className="sub-module-name">{subModule.name}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* 主内容区 */}
        <div className="dashboard-main">
          <div className="main-header">
            <div className="breadcrumb">
              <span className="breadcrumb-item">{currentModule?.name}</span>
              <span className="breadcrumb-separator">/</span>
              <span className="breadcrumb-item active">{currentSubModule?.name}</span>
            </div>
            
            <div className="header-actions">
              <button className="action-btn">
                🔔 通知
              </button>
              <button className="action-btn">
                ⚙️ 设置
              </button>
              <button className="action-btn">
                👤 用户
              </button>
            </div>
          </div>

          <div className="main-content">
            {renderDashboardContent()}
          </div>
        </div>
      </div>

      <style>{`
        .overseas-dashboard {
          min-height: 100vh;
          background: #f8fafc;
        }

        .dashboard-container {
          display: flex;
          height: 100vh;
        }

        .dashboard-sidebar {
          width: 280px;
          background: white;
          border-right: 1px solid #e2e8f0;
          transition: width 0.3s ease;
          overflow: hidden;
        }

        .dashboard-sidebar.collapsed {
          width: 60px;
        }

        .sidebar-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 1.5rem 1rem;
          border-bottom: 1px solid #e2e8f0;
          background: #f8fafc;
        }

        .sidebar-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: #1a1a1a;
          margin: 0;
          white-space: nowrap;
        }

        .collapse-btn {
          background: none;
          border: none;
          cursor: pointer;
          padding: 0.5rem;
          border-radius: 4px;
          transition: background 0.2s;
        }

        .collapse-btn:hover {
          background: #e2e8f0;
        }

        .sidebar-content {
          padding: 1rem 0;
          overflow-y: auto;
          height: calc(100vh - 80px);
        }

        .module-group {
          margin-bottom: 0.5rem;
        }

        .module-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.75rem 1rem;
          cursor: pointer;
          transition: all 0.2s;
          color: #64748b;
        }

        .module-header:hover {
          background: #f1f5f9;
          color: #1a1a1a;
        }

        .module-header.active {
          background: #eff6ff;
          color: #2563eb;
          border-right: 3px solid #2563eb;
        }

        .module-icon {
          font-size: 1.25rem;
          min-width: 20px;
        }

        .module-name {
          font-weight: 500;
          flex: 1;
        }

        .module-arrow {
          font-size: 0.875rem;
          transition: transform 0.2s;
        }

        .sub-modules {
          background: #f8fafc;
          border-top: 1px solid #e2e8f0;
        }

        .sub-module {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding: 0.5rem 1rem 0.5rem 2.5rem;
          cursor: pointer;
          transition: all 0.2s;
          color: #64748b;
          font-size: 0.875rem;
        }

        .sub-module:hover {
          background: #e2e8f0;
          color: #1a1a1a;
        }

        .sub-module.active {
          background: #dbeafe;
          color: #2563eb;
          font-weight: 500;
        }

        .sub-module-icon {
          font-size: 1rem;
          min-width: 16px;
        }

        .dashboard-main {
          flex: 1;
          display: flex;
          flex-direction: column;
          overflow: hidden;
        }

        .main-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 2rem;
          background: white;
          border-bottom: 1px solid #e2e8f0;
        }

        .breadcrumb {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-size: 0.875rem;
        }

        .breadcrumb-item {
          color: #64748b;
        }

        .breadcrumb-item.active {
          color: #1a1a1a;
          font-weight: 500;
        }

        .breadcrumb-separator {
          color: #cbd5e1;
        }

        .header-actions {
          display: flex;
          gap: 0.5rem;
        }

        .action-btn {
          padding: 0.5rem 1rem;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.875rem;
          transition: all 0.2s;
        }

        .action-btn:hover {
          background: #e2e8f0;
          border-color: #cbd5e1;
        }

        .main-content {
          flex: 1;
          padding: 2rem;
          overflow-y: auto;
        }

        /* 仪表板样式 */
        .dashboard-overview h2,
        .ecommerce-content h2,
        .integrations-content h2,
        .analytics-content h2,
        .reports-content h2,
        .marketing-content h2,
        .logistics-content h2,
        .finance-content h2,
        .customer-content h2,
        .settings-content h2 {
          font-size: 1.5rem;
          font-weight: 600;
          color: #1a1a1a;
          margin-bottom: 2rem;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .stat-card {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .stat-icon {
          font-size: 2rem;
          width: 60px;
          height: 60px;
          background: #f8fafc;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .stat-content {
          flex: 1;
        }

        .stat-value {
          font-size: 1.5rem;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 0.25rem;
        }

        .stat-label {
          font-size: 0.875rem;
          color: #64748b;
          margin-bottom: 0.5rem;
        }

        .stat-change {
          font-size: 0.75rem;
          font-weight: 500;
        }

        .stat-change.positive {
          color: #059669;
        }

        .stat-change.negative {
          color: #dc2626;
        }

        .charts-section {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
          gap: 1.5rem;
        }

        .chart-card {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .chart-card h3 {
          font-size: 1.125rem;
          font-weight: 600;
          color: #1a1a1a;
          margin-bottom: 1rem;
        }

        .chart-placeholder {
          height: 200px;
          background: #f8fafc;
          border-radius: 8px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          color: #64748b;
          text-align: center;
        }

        .chart-placeholder p {
          font-size: 1rem;
          font-weight: 500;
          margin-bottom: 0.5rem;
        }

        .chart-placeholder small {
          font-size: 0.875rem;
        }

        /* 图表通用样式 */
        .chart-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 1.5rem;
        }

        .chart-period-selector {
          display: flex;
          gap: 0.5rem;
        }

        .period-btn {
          padding: 0.375rem 0.875rem;
          border: 1px solid #e2e8f0;
          background: white;
          border-radius: 6px;
          font-size: 0.875rem;
          cursor: pointer;
          transition: all 0.2s;
          color: #64748b;
        }

        .period-btn:hover {
          background: #f8fafc;
          border-color: #cbd5e1;
        }

        .period-btn.active {
          background: #3b82f6;
          border-color: #3b82f6;
          color: white;
        }

        .chart-info .info-badge {
          padding: 0.375rem 0.875rem;
          background: #eff6ff;
          color: #3b82f6;
          border-radius: 6px;
          font-size: 0.875rem;
          font-weight: 500;
        }

        /* 销售趋势图表样式 */
        .sales-trend-chart .chart-content {
          padding: 1rem 0;
        }

        .sales-trend-chart-inner {
          display: flex;
          gap: 1rem;
        }

        .chart-y-axis {
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          padding-right: 0.75rem;
          border-right: 1px solid #e2e8f0;
        }

        .y-label {
          font-size: 0.75rem;
          color: #94a3b8;
          text-align: right;
          line-height: 1;
        }

        .chart-area {
          flex: 1;
          position: relative;
          height: 200px;
        }

        .chart-grid {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 30px;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }

        .grid-line {
          height: 1px;
          background: #f1f5f9;
        }

        .chart-svg {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: calc(100% - 30px);
        }

        .chart-svg path {
          transition: all 0.3s ease;
        }

        .chart-svg circle {
          transition: all 0.3s ease;
        }

        .chart-svg circle:hover {
          r: 7;
          filter: drop-shadow(0 2px 4px rgba(59, 130, 246, 0.3));
        }

        .chart-x-axis {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          display: flex;
          justify-content: space-around;
          padding-top: 0.5rem;
        }

        .x-label {
          font-size: 0.75rem;
          color: #94a3b8;
          text-align: center;
        }

        .chart-legend {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-top: 1.5rem;
          padding-top: 1rem;
          border-top: 1px solid #f1f5f9;
        }

        .legend-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .legend-color {
          width: 12px;
          height: 12px;
          border-radius: 3px;
        }

        .legend-text {
          font-size: 0.875rem;
          color: #64748b;
        }

        .chart-summary {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .summary-label {
          font-size: 0.875rem;
          color: #64748b;
        }

        .summary-value {
          font-size: 1.125rem;
          font-weight: 600;
          color: #1e293b;
        }

        .summary-change {
          padding: 0.25rem 0.625rem;
          border-radius: 4px;
          font-size: 0.875rem;
          font-weight: 600;
        }

        .summary-change.positive {
          background: #dcfce7;
          color: #16a34a;
        }

        /* 平台分布图表样式 */
        .platform-distribution-chart .chart-content {
          padding: 1rem 0;
        }

        .platform-chart-container {
          display: flex;
          align-items: center;
          gap: 3rem;
        }

        .donut-chart {
          width: 200px;
          height: 200px;
          flex-shrink: 0;
        }

        .donut-svg {
          width: 100%;
          height: 100%;
          transform: scale(1);
          transition: transform 0.3s ease;
        }

        .donut-svg:hover {
          transform: scale(1.05);
        }

        .donut-svg circle {
          transition: all 0.3s ease;
        }

        .platform-legend {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .legend-item-platform {
          padding: 0.875rem;
          background: #f8fafc;
          border-radius: 8px;
          transition: all 0.2s;
        }

        .legend-item-platform:hover {
          background: #f1f5f9;
          transform: translateX(4px);
        }

        .legend-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 0.5rem;
        }

        .legend-indicator {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .legend-dot {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }

        .legend-name {
          font-size: 0.875rem;
          font-weight: 500;
          color: #1e293b;
        }

        .legend-percentage {
          font-size: 1.125rem;
          font-weight: 600;
          color: #1e293b;
        }

        .legend-details {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          padding-left: 1.5rem;
        }

        .legend-amount {
          font-size: 0.875rem;
          color: #64748b;
        }

        .legend-trend {
          padding: 0.125rem 0.5rem;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: 600;
        }

        .legend-trend.positive {
          background: #dcfce7;
          color: #16a34a;
        }

        .legend-trend.neutral {
          background: #f3f4f6;
          color: #6b7280;
        }

        .legend-trend.negative {
          background: #fee2e2;
          color: #dc2626;
        }

        /* 电商平台样式 */
        .platform-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .platform-card {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .platform-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .platform-info {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .platform-icon {
          font-size: 2rem;
        }

        .platform-info h3 {
          font-size: 1.125rem;
          font-weight: 600;
          color: #1a1a1a;
          margin: 0 0 0.25rem 0;
        }

        .status-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 500;
        }

        .status-badge.connected {
          background: #dcfce7;
          color: #166534;
        }

        .status-badge.disconnected {
          background: #fef2f2;
          color: #991b1b;
        }

        .platform-stats {
          display: flex;
          justify-content: space-between;
          margin-top: 1rem;
        }

        .stat {
          text-align: center;
        }

        .stat .stat-value {
          font-size: 1.25rem;
          font-weight: 600;
          color: #1a1a1a;
          display: block;
          margin-bottom: 0.25rem;
        }

        .stat .stat-label {
          font-size: 0.75rem;
          color: #64748b;
        }

        .quick-actions {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .quick-actions h3 {
          font-size: 1.125rem;
          font-weight: 600;
          color: #1a1a1a;
          margin-bottom: 1rem;
        }

        .action-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
          gap: 1rem;
        }

        .quick-action-btn {
          padding: 0.75rem 1rem;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          cursor: pointer;
          font-size: 0.875rem;
          transition: all 0.2s;
        }

        .quick-action-btn:hover {
          background: #e2e8f0;
          border-color: #cbd5e1;
        }

        /* 工具集成样式 */
        .integrated-tools {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .tool-card {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .tool-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .tool-info {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .tool-icon {
          font-size: 2rem;
        }

        .tool-info h3 {
          font-size: 1.125rem;
          font-weight: 600;
          color: #1a1a1a;
          margin: 0 0 0.25rem 0;
        }

        .tool-info p {
          font-size: 0.875rem;
          color: #64748b;
          margin: 0;
        }

        .tool-actions {
          display: flex;
          gap: 0.75rem;
        }

        .btn {
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 6px;
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

        .btn-success {
          background: #059669;
          color: white;
        }

        .btn-success:hover {
          background: #047857;
        }

        @media (max-width: 768px) {
          .dashboard-sidebar {
            position: fixed;
            left: -280px;
            z-index: 1000;
            height: 100vh;
            transition: left 0.3s ease;
          }

          .dashboard-sidebar.open {
            left: 0;
          }

          .dashboard-main {
            width: 100%;
          }

          .main-header {
            padding: 1rem;
          }

          .main-content {
            padding: 1rem;
          }

          .stats-grid {
            grid-template-columns: 1fr;
          }

          .charts-section {
            grid-template-columns: 1fr;
          }

          .platform-grid {
            grid-template-columns: 1fr;
          }

          .action-grid {
            grid-template-columns: repeat(2, 1fr);
          }
        }
      `}</style>
    </div>
  )
}

export default OverseasDashboard
