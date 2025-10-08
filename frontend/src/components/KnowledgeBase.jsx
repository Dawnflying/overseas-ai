import React, { useState, useEffect } from 'react'

const KnowledgeBase = () => {
  const [activeTab, setActiveTab] = useState('browse')
  const [knowledgeList, setKnowledgeList] = useState([])
  const [categories, setCategories] = useState([])
  const [selectedCategory, setSelectedCategory] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedKnowledge, setSelectedKnowledge] = useState(null)
  const [isCreating, setIsCreating] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [loading, setLoading] = useState(false)
  const [ragQuestion, setRagQuestion] = useState('')
  const [ragAnswer, setRagAnswer] = useState('')
  const [ragLoading, setRagLoading] = useState(false)

  // 表单数据
  const [formData, setFormData] = useState({
    title: '',
    content: '',
    category: '',
    subcategory: '',
    tags: '',
    source: 'manual',
    priority: 1
  })

  // 预置分类
  const predefinedCategories = [
    { value: 'compliance', label: '合规认证', subcategories: ['product-safety', 'chemical-control', 'trade-compliance'] },
    { value: 'market-analysis', label: '市场分析', subcategories: ['regulations', 'platform-rules', 'policy-updates'] },
    { value: 'product-management', label: '商品管理', subcategories: ['product-classification', 'banned-products', 'special-requirements'] },
    { value: 'operations', label: '运营指南', subcategories: ['compliance-process', 'risk-control', 'best-practices'] }
  ]

  const subcategoryLabels = {
    'product-safety': '产品安全认证',
    'chemical-control': '化学品管控',
    'trade-compliance': '贸易合规',
    'regulations': '目标市场法规',
    'platform-rules': '平台规则',
    'policy-updates': '政策动态',
    'product-classification': '商品分类',
    'banned-products': '禁售清单',
    'special-requirements': '特殊要求',
    'compliance-process': '合规流程',
    'risk-control': '风险防控',
    'best-practices': '最佳实践'
  }

  // 获取认证令牌
  const getAuthToken = () => {
    return localStorage.getItem('authToken')
  }

  // 加载知识库列表
  const loadKnowledgeList = async () => {
    setLoading(true)
    try {
      const token = getAuthToken()
      const params = new URLSearchParams()
      if (selectedCategory) params.append('category', selectedCategory)
      if (searchQuery) params.append('q', searchQuery)
      
      const response = await fetch(`http://localhost:3000/api/knowledge/search?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      const result = await response.json()
      if (result.success) {
        setKnowledgeList(result.data)
      } else {
        console.error('加载知识库失败:', result.error)
      }
    } catch (error) {
      console.error('加载知识库失败:', error)
    } finally {
      setLoading(false)
    }
  }

  // 加载分类
  const loadCategories = async () => {
    try {
      const token = getAuthToken()
      const response = await fetch('http://localhost:3000/api/knowledge/categories', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      const result = await response.json()
      if (result.success) {
        setCategories(result.data.categories)
      }
    } catch (error) {
      console.error('加载分类失败:', error)
    }
  }

  // 搜索知识库
  const handleSearch = () => {
    loadKnowledgeList()
  }

  // 查看知识详情
  const viewKnowledge = async (id) => {
    try {
      const token = getAuthToken()
      const response = await fetch(`http://localhost:3000/api/knowledge/${id}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      const result = await response.json()
      if (result.success) {
        setSelectedKnowledge(result.data)
        setActiveTab('detail')
      }
    } catch (error) {
      console.error('获取知识详情失败:', error)
    }
  }

  // 创建知识条目
  const createKnowledge = async () => {
    try {
      const token = getAuthToken()
      const response = await fetch('http://localhost:3000/api/knowledge', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
      
      const result = await response.json()
      if (result.success) {
        setIsCreating(false)
        setFormData({
          title: '',
          content: '',
          category: '',
          subcategory: '',
          tags: '',
          source: 'manual',
          priority: 1
        })
        loadKnowledgeList()
        alert('创建成功！')
      } else {
        alert('创建失败: ' + result.error)
      }
    } catch (error) {
      console.error('创建知识条目失败:', error)
      alert('创建失败')
    }
  }

  // 更新知识条目
  const updateKnowledge = async () => {
    try {
      const token = getAuthToken()
      const response = await fetch(`http://localhost:3000/api/knowledge/${selectedKnowledge.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
      
      const result = await response.json()
      if (result.success) {
        setIsEditing(false)
        setSelectedKnowledge(result.data)
        loadKnowledgeList()
        alert('更新成功！')
      } else {
        alert('更新失败: ' + result.error)
      }
    } catch (error) {
      console.error('更新知识条目失败:', error)
      alert('更新失败')
    }
  }

  // 删除知识条目
  const deleteKnowledge = async (id) => {
    if (!confirm('确定要删除这个知识条目吗？')) return
    
    try {
      const token = getAuthToken()
      const response = await fetch(`http://localhost:3000/api/knowledge/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })
      
      const result = await response.json()
      if (result.success) {
        loadKnowledgeList()
        if (selectedKnowledge && selectedKnowledge.id === id) {
          setSelectedKnowledge(null)
          setActiveTab('browse')
        }
        alert('删除成功！')
      } else {
        alert('删除失败: ' + result.error)
      }
    } catch (error) {
      console.error('删除知识条目失败:', error)
      alert('删除失败')
    }
  }

  // RAG 问答
  const handleRagQuery = async () => {
    if (!ragQuestion.trim()) return
    
    setRagLoading(true)
    try {
      const token = getAuthToken()
      const response = await fetch('http://localhost:3000/api/knowledge/rag', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ question: ragQuestion })
      })
      
      const result = await response.json()
      if (result.success) {
        setRagAnswer(result.data.answer)
      } else {
        setRagAnswer('抱歉，无法回答您的问题：' + result.error)
      }
    } catch (error) {
      console.error('RAG 问答失败:', error)
      setRagAnswer('抱歉，问答服务暂时不可用')
    } finally {
      setRagLoading(false)
    }
  }

  // 组件挂载时加载数据
  useEffect(() => {
    loadKnowledgeList()
    loadCategories()
  }, [])

  // 分类或搜索变化时重新加载
  useEffect(() => {
    loadKnowledgeList()
  }, [selectedCategory])

  return (
    <div style={{ padding: '24px', backgroundColor: '#f8fafc', minHeight: '100vh' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        {/* 页面标题 */}
        <div style={{ marginBottom: '24px' }}>
          <h1 style={{ fontSize: '28px', fontWeight: 'bold', color: '#1f2937', marginBottom: '8px' }}>
            📚 出海知识库
          </h1>
          <p style={{ color: '#6b7280', fontSize: '16px' }}>
            专业的出海合规知识库，支持智能问答和精准搜索
          </p>
        </div>

        {/* 标签页导航 */}
        <div style={{ marginBottom: '24px' }}>
          <div style={{ borderBottom: '1px solid #e5e7eb' }}>
            <div style={{ display: 'flex', gap: '24px' }}>
              {[
                { id: 'browse', label: '浏览知识库', icon: '📖' },
                { id: 'search', label: '智能搜索', icon: '🔍' },
                { id: 'rag', label: 'AI 问答', icon: '🤖' },
                { id: 'create', label: '创建知识', icon: '➕' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => {
                    setActiveTab(tab.id)
                    if (tab.id === 'browse') {
                      setSelectedKnowledge(null)
                    }
                  }}
                  style={{
                    padding: '12px 24px',
                    border: 'none',
                    backgroundColor: 'transparent',
                    borderBottom: activeTab === tab.id ? '2px solid #3b82f6' : '2px solid transparent',
                    color: activeTab === tab.id ? '#3b82f6' : '#6b7280',
                    fontSize: '16px',
                    fontWeight: activeTab === tab.id ? '600' : '400',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px'
                  }}
                >
                  <span>{tab.icon}</span>
                  {tab.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* 浏览知识库 */}
        {activeTab === 'browse' && (
          <div>
            {/* 搜索和筛选 */}
            <div style={{ 
              display: 'flex', 
              gap: '16px', 
              marginBottom: '24px',
              padding: '20px',
              backgroundColor: 'white',
              borderRadius: '12px',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)'
            }}>
              <div style={{ flex: 1 }}>
                <input
                  type="text"
                  placeholder="搜索知识库..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '16px'
                  }}
                />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                style={{
                  padding: '12px 16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '16px',
                  minWidth: '200px'
                }}
              >
                <option value="">全部分类</option>
                {predefinedCategories.map(cat => (
                  <option key={cat.value} value={cat.value}>{cat.label}</option>
                ))}
              </select>
              <button
                onClick={handleSearch}
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                搜索
              </button>
            </div>

            {/* 知识库列表 */}
            <div style={{ 
              backgroundColor: 'white',
              borderRadius: '12px',
              boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
              overflow: 'hidden'
            }}>
              {loading ? (
                <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>
                  加载中...
                </div>
              ) : knowledgeList.length === 0 ? (
                <div style={{ padding: '40px', textAlign: 'center', color: '#6b7280' }}>
                  暂无知识条目
                </div>
              ) : (
                <div>
                  {knowledgeList.map((item, index) => (
                    <div
                      key={item.id}
                      style={{
                        padding: '20px',
                        borderBottom: index < knowledgeList.length - 1 ? '1px solid #f3f4f6' : 'none',
                        cursor: 'pointer',
                        transition: 'background-color 0.2s'
                      }}
                      onMouseEnter={(e) => e.target.style.backgroundColor = '#f9fafb'}
                      onMouseLeave={(e) => e.target.style.backgroundColor = 'transparent'}
                      onClick={() => viewKnowledge(item.id)}
                    >
                      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                        <div style={{ flex: 1 }}>
                          <h3 style={{ 
                            fontSize: '18px', 
                            fontWeight: '600', 
                            color: '#1f2937',
                            marginBottom: '8px'
                          }}>
                            {item.title}
                          </h3>
                          <p style={{ 
                            color: '#6b7280', 
                            fontSize: '14px',
                            marginBottom: '12px',
                            lineHeight: '1.5',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden'
                          }}>
                            {item.content}
                          </p>
                          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                            <span style={{
                              padding: '4px 8px',
                              backgroundColor: '#e0e7ff',
                              color: '#3730a3',
                              borderRadius: '4px',
                              fontSize: '12px',
                              fontWeight: '500'
                            }}>
                              {predefinedCategories.find(c => c.value === item.category)?.label || item.category}
                            </span>
                            {item.subcategory && (
                              <span style={{
                                padding: '4px 8px',
                                backgroundColor: '#f0f9ff',
                                color: '#0369a1',
                                borderRadius: '4px',
                                fontSize: '12px',
                                fontWeight: '500'
                              }}>
                                {subcategoryLabels[item.subcategory] || item.subcategory}
                              </span>
                            )}
                            <span style={{ color: '#9ca3af', fontSize: '12px' }}>
                              {new Date(item.lastUpdated).toLocaleDateString()}
                            </span>
                          </div>
                        </div>
                        <div style={{ display: 'flex', gap: '8px', marginLeft: '16px' }}>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              setSelectedKnowledge(item)
                              setIsEditing(true)
                              setFormData({
                                title: item.title,
                                content: item.content,
                                category: item.category,
                                subcategory: item.subcategory,
                                tags: item.tags?.join(',') || '',
                                source: item.source,
                                priority: item.priority
                              })
                            }}
                            style={{
                              padding: '8px 12px',
                              backgroundColor: '#f3f4f6',
                              color: '#374151',
                              border: 'none',
                              borderRadius: '6px',
                              fontSize: '12px',
                              cursor: 'pointer'
                            }}
                          >
                            编辑
                          </button>
                          <button
                            onClick={(e) => {
                              e.stopPropagation()
                              deleteKnowledge(item.id)
                            }}
                            style={{
                              padding: '8px 12px',
                              backgroundColor: '#fef2f2',
                              color: '#dc2626',
                              border: 'none',
                              borderRadius: '6px',
                              fontSize: '12px',
                              cursor: 'pointer'
                            }}
                          >
                            删除
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* 知识详情 */}
        {activeTab === 'detail' && selectedKnowledge && (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            padding: '24px'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '24px' }}>
              <div>
                <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', marginBottom: '8px' }}>
                  {selectedKnowledge.title}
                </h2>
                <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
                  <span style={{
                    padding: '6px 12px',
                    backgroundColor: '#e0e7ff',
                    color: '#3730a3',
                    borderRadius: '6px',
                    fontSize: '14px',
                    fontWeight: '500'
                  }}>
                    {predefinedCategories.find(c => c.value === selectedKnowledge.category)?.label || selectedKnowledge.category}
                  </span>
                  {selectedKnowledge.subcategory && (
                    <span style={{
                      padding: '6px 12px',
                      backgroundColor: '#f0f9ff',
                      color: '#0369a1',
                      borderRadius: '6px',
                      fontSize: '14px',
                      fontWeight: '500'
                    }}>
                      {subcategoryLabels[selectedKnowledge.subcategory] || selectedKnowledge.subcategory}
                    </span>
                  )}
                  <span style={{ color: '#9ca3af', fontSize: '14px' }}>
                    更新于 {new Date(selectedKnowledge.lastUpdated).toLocaleDateString()}
                  </span>
                </div>
              </div>
              <button
                onClick={() => setActiveTab('browse')}
                style={{
                  padding: '8px 16px',
                  backgroundColor: '#f3f4f6',
                  color: '#374151',
                  border: 'none',
                  borderRadius: '6px',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                返回列表
              </button>
            </div>
            
            <div style={{ 
              backgroundColor: '#f9fafb',
              padding: '20px',
              borderRadius: '8px',
              marginBottom: '24px'
            }}>
              <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: '12px' }}>
                内容详情
              </h3>
              <div style={{ 
                color: '#374151',
                fontSize: '16px',
                lineHeight: '1.6',
                whiteSpace: 'pre-wrap'
              }}>
                {selectedKnowledge.content}
              </div>
            </div>

            {selectedKnowledge.tags && selectedKnowledge.tags.length > 0 && (
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: '12px' }}>
                  标签
                </h3>
                <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
                  {selectedKnowledge.tags.map((tag, index) => (
                    <span
                      key={index}
                      style={{
                        padding: '4px 8px',
                        backgroundColor: '#e5e7eb',
                        color: '#374151',
                        borderRadius: '4px',
                        fontSize: '12px'
                      }}
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* AI 问答 */}
        {activeTab === 'rag' && (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            padding: '24px'
          }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', marginBottom: '24px' }}>
              🤖 AI 智能问答
            </h2>
            
            <div style={{ marginBottom: '24px' }}>
              <textarea
                placeholder="请输入您关于出海合规的问题..."
                value={ragQuestion}
                onChange={(e) => setRagQuestion(e.target.value)}
                style={{
                  width: '100%',
                  height: '120px',
                  padding: '16px',
                  border: '1px solid #d1d5db',
                  borderRadius: '8px',
                  fontSize: '16px',
                  resize: 'vertical'
                }}
              />
            </div>
            
            <button
              onClick={handleRagQuery}
              disabled={ragLoading || !ragQuestion.trim()}
              style={{
                padding: '12px 24px',
                backgroundColor: ragLoading || !ragQuestion.trim() ? '#9ca3af' : '#3b82f6',
                color: 'white',
                border: 'none',
                borderRadius: '8px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: ragLoading || !ragQuestion.trim() ? 'not-allowed' : 'pointer',
                marginBottom: '24px'
              }}
            >
              {ragLoading ? '思考中...' : '提问'}
            </button>

            {ragAnswer && (
              <div style={{
                backgroundColor: '#f0f9ff',
                padding: '20px',
                borderRadius: '8px',
                border: '1px solid #bae6fd'
              }}>
                <h3 style={{ fontSize: '18px', fontWeight: '600', color: '#1f2937', marginBottom: '12px' }}>
                  AI 回答
                </h3>
                <div style={{ 
                  color: '#374151',
                  fontSize: '16px',
                  lineHeight: '1.6',
                  whiteSpace: 'pre-wrap'
                }}>
                  {ragAnswer}
                </div>
              </div>
            )}
          </div>
        )}

        {/* 创建/编辑知识 */}
        {(activeTab === 'create' || isEditing) && (
          <div style={{
            backgroundColor: 'white',
            borderRadius: '12px',
            boxShadow: '0 1px 3px rgba(0, 0, 0, 0.1)',
            padding: '24px'
          }}>
            <h2 style={{ fontSize: '24px', fontWeight: 'bold', color: '#1f2937', marginBottom: '24px' }}>
              {isEditing ? '编辑知识条目' : '创建知识条目'}
            </h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                  标题 *
                </label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '16px'
                  }}
                />
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                  内容 *
                </label>
                <textarea
                  value={formData.content}
                  onChange={(e) => setFormData({ ...formData, content: e.target.value })}
                  style={{
                    width: '100%',
                    height: '200px',
                    padding: '12px 16px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '16px',
                    resize: 'vertical'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                    分类 *
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value, subcategory: '' })}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '16px'
                    }}
                  >
                    <option value="">请选择分类</option>
                    {predefinedCategories.map(cat => (
                      <option key={cat.value} value={cat.value}>{cat.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                    子分类
                  </label>
                  <select
                    value={formData.subcategory}
                    onChange={(e) => setFormData({ ...formData, subcategory: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '16px'
                    }}
                  >
                    <option value="">请选择子分类</option>
                    {formData.category && predefinedCategories
                      .find(c => c.value === formData.category)
                      ?.subcategories.map(sub => (
                        <option key={sub} value={sub}>{subcategoryLabels[sub]}</option>
                      ))}
                  </select>
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                  标签 (用逗号分隔)
                </label>
                <input
                  type="text"
                  value={formData.tags}
                  onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                  placeholder="例如: 欧盟,CE认证,电子产品"
                  style={{
                    width: '100%',
                    padding: '12px 16px',
                    border: '1px solid #d1d5db',
                    borderRadius: '8px',
                    fontSize: '16px'
                  }}
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                    来源
                  </label>
                  <select
                    value={formData.source}
                    onChange={(e) => setFormData({ ...formData, source: e.target.value })}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '16px'
                    }}
                  >
                    <option value="manual">手动创建</option>
                    <option value="official">官方文档</option>
                    <option value="platform">平台规则</option>
                    <option value="news">新闻资讯</option>
                  </select>
                </div>

                <div>
                  <label style={{ display: 'block', fontSize: '14px', fontWeight: '600', color: '#374151', marginBottom: '8px' }}>
                    优先级
                  </label>
                  <select
                    value={formData.priority}
                    onChange={(e) => setFormData({ ...formData, priority: parseInt(e.target.value) })}
                    style={{
                      width: '100%',
                      padding: '12px 16px',
                      border: '1px solid #d1d5db',
                      borderRadius: '8px',
                      fontSize: '16px'
                    }}
                  >
                    <option value={1}>低</option>
                    <option value={2}>中</option>
                    <option value={3}>高</option>
                  </select>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '12px', marginTop: '24px' }}>
              <button
                onClick={isEditing ? updateKnowledge : createKnowledge}
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#3b82f6',
                  color: 'white',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                {isEditing ? '更新' : '创建'}
              </button>
              <button
                onClick={() => {
                  setIsEditing(false)
                  setIsCreating(false)
                  setFormData({
                    title: '',
                    content: '',
                    category: '',
                    subcategory: '',
                    tags: '',
                    source: 'manual',
                    priority: 1
                  })
                  setActiveTab('browse')
                }}
                style={{
                  padding: '12px 24px',
                  backgroundColor: '#f3f4f6',
                  color: '#374151',
                  border: 'none',
                  borderRadius: '8px',
                  fontSize: '16px',
                  fontWeight: '600',
                  cursor: 'pointer'
                }}
              >
                取消
              </button>
            </div>
          </div>
        )}
      </div>

      <style>{`
        .knowledge-base {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        }
        
        .knowledge-base input:focus,
        .knowledge-base textarea:focus,
        .knowledge-base select:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
        }
        
        .knowledge-base button:hover {
          opacity: 0.9;
        }
      `}</style>
    </div>
  )
}

export default KnowledgeBase
