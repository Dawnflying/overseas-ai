import React, { useState, useEffect, useCallback } from 'react'
import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import PostEditor from './PostEditor'

const Community = () => {
  const [currentView, setCurrentView] = useState('posts') // posts, categories, users
  const [selectedCategory, setSelectedCategory] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [posts, setPosts] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [showPostEditor, setShowPostEditor] = useState(false)
  const [selectedPost, setSelectedPost] = useState(null)

  // 分类数据
  const categories = [
    { id: 'all', name: '全部', icon: '🏠', count: 0 },
    { id: 'experience', name: '经验分享', icon: '💡', count: 0 },
    { id: 'question', name: '问题求助', icon: '❓', count: 0 },
    { id: 'resource', name: '资源分享', icon: '📚', count: 0 },
    { id: 'news', name: '行业资讯', icon: '📰', count: 0 },
    { id: 'job', name: '招聘求职', icon: '💼', count: 0 }
  ]

  // 平台标签
  const platforms = [
    { id: 'amazon', name: 'Amazon', color: 'orange' },
    { id: 'shopify', name: 'Shopify', color: 'green' },
    { id: 'ebay', name: 'eBay', color: 'blue' },
    { id: 'aliexpress', name: '速卖通', color: 'red' },
    { id: 'lazada', name: 'Lazada', color: 'purple' }
  ]

  // 模拟帖子数据
  const mockPosts = [
    {
      id: '1',
      title: 'Amazon选品实战经验分享：如何找到爆款产品',
      author: {
        id: '1',
        username: '出海小王',
        avatar: '👨‍💼',
        level: '资深卖家',
        points: 1250
      },
      content: `# Amazon选品实战经验分享

作为一名在Amazon上经营3年的卖家，我想分享一些选品的实战经验。

## 选品前的准备工作

### 1. 市场调研
- 分析目标市场的消费习惯
- 研究竞争对手的产品和定价
- 了解当地的法律法规要求

### 2. 产品分析
- 产品生命周期评估
- 供应链稳定性分析
- 利润率计算

## 我的选品策略

### 阶段一：大品类筛选
通过Jungle Scout等工具分析：
- 市场需求量 > 1000/月
- 竞争强度 < 中等
- 平均售价 > $20

### 阶段二：细分市场挖掘
- 寻找长尾关键词
- 分析用户评价痛点
- 发现产品改进机会

### 阶段三：供应链验证
- 联系至少3家供应商
- 索要样品进行测试
- 确认质量和交期

## 成功案例分析

以我最近的一个成功产品为例：
- 产品：智能蓝牙耳机
- 市场：美国
- 月销量：500+ 单
- 利润率：35%

关键成功因素：
1. 差异化设计
2. 优质供应商合作
3. 精准的市场定位

## 常见误区

❌ 盲目跟风热门产品
❌ 忽视知识产权风险
❌ 过度依赖单一供应商
❌ 忽视售后服务质量

## 给新手的建议

1. **从小做起**：先选择1-2个产品深度运营
2. **数据驱动**：用数据说话，不要凭感觉
3. **持续学习**：关注行业动态和平台政策
4. **建立护城河**：通过品牌、供应链等建立竞争优势

希望这些经验对大家有帮助！有问题欢迎在评论区交流。`,
      summary: '分享Amazon选品的实战经验，包括市场调研、产品分析、选品策略和成功案例，适合新手卖家学习。',
      tags: ['Amazon', '选品', '新手', '经验分享'],
      platform: 'amazon',
      category: 'experience',
      likes: 156,
      comments: 23,
      views: 1250,
      isPinned: true,
      isFeatured: true,
      createdAt: '2024-01-15T10:30:00Z'
    },
    {
      id: '2',
      title: 'Shopify建站遇到的技术问题，求大神解答',
      author: {
        id: '2',
        username: '技术小白',
        avatar: '👩‍💻',
        level: '新手卖家',
        points: 120
      },
      content: `大家好，我在搭建Shopify独立站时遇到了几个技术问题，希望有经验的朋友能帮忙解答：

## 问题1：支付集成
我正在集成PayPal和Stripe支付，但是：
- PayPal测试环境可以正常支付
- 但是Stripe一直报错：Invalid API key
- 检查了API密钥设置，应该是正确的

## 问题2：主题自定义
- 想要修改产品页面的布局
- 但是修改后移动端显示异常
- 不知道如何做响应式适配

## 问题3：SEO优化
- 产品页面的meta description没有显示
- 网站地图生成有问题
- 不知道如何优化页面加载速度

## 问题4：库存同步
- 使用第三方ERP系统同步库存
- 但是同步经常失败
- 不知道有什么稳定的解决方案

希望有经验的朋友能提供一些建议和解决方案，谢谢大家！

如果有好的教程或者工具推荐，也欢迎分享。`,
      summary: 'Shopify建站过程中遇到支付集成、主题自定义、SEO优化、库存同步等技术问题，寻求解决方案。',
      tags: ['Shopify', '技术问题', '支付', 'SEO'],
      platform: 'shopify',
      category: 'question',
      likes: 45,
      comments: 12,
      views: 380,
      isPinned: false,
      isFeatured: false,
      createdAt: '2024-01-14T15:20:00Z'
    },
    {
      id: '3',
      title: '2024年出海政策解读：跨境电商新规汇总',
      author: {
        id: '3',
        username: '政策解读员',
        avatar: '📊',
        level: '专家卖家',
        points: 2800
      },
      content: `# 2024年出海政策解读

随着跨境电商的快速发展，各国政策也在不断调整。本文汇总了2024年最新的跨境电商政策变化。

## 美国市场政策变化

### 1. 税务合规要求
- 各州销售税要求更加严格
- 需要及时注册销售税许可证
- 建议使用自动化税务软件

### 2. 产品安全认证
- CPSC监管更加严格
- 儿童产品需要额外认证
- 建议提前准备相关证书

## 欧洲市场政策变化

### 1. 数字服务法案(DSA)
- 大型平台需要承担更多责任
- 内容审核要求提高
- 需要建立申诉机制

### 2. 可持续包装要求
- 包装材料环保要求提高
- 需要提供包装回收方案
- 建议使用可回收包装材料

## 东南亚市场政策变化

### 1. 数字税政策
- 部分国家开始征收数字税
- 需要了解当地税务政策
- 建议咨询专业税务顾问

### 2. 数据本地化要求
- 用户数据需要本地存储
- 需要建立数据保护机制
- 建议使用本地云服务

## 应对建议

1. **及时关注政策变化**
   - 订阅相关官方通知
   - 关注行业媒体资讯
   - 加入专业交流群

2. **建立合规体系**
   - 制定合规检查清单
   - 建立定期审查机制
   - 培训团队合规意识

3. **寻求专业支持**
   - 咨询专业律师
   - 委托合规服务机构
   - 购买相关保险

## 总结

政策变化是跨境电商面临的常态，关键是要：
- 保持敏感度
- 建立应对机制
- 持续学习更新

希望这些信息对大家有帮助！`,
      summary: '汇总2024年各国跨境电商政策变化，包括税务、认证、数据保护等方面，提供应对建议。',
      tags: ['政策解读', '合规', '2024', '全球'],
      platform: 'all',
      category: 'news',
      likes: 89,
      comments: 15,
      views: 890,
      isPinned: false,
      isFeatured: true,
      createdAt: '2024-01-13T09:15:00Z'
    }
  ]

  // 获取帖子列表
  const fetchPosts = useCallback(async () => {
    setIsLoading(true)
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      let filteredPosts = mockPosts
      
      // 分类过滤
      if (selectedCategory !== 'all') {
        filteredPosts = filteredPosts.filter(post => post.category === selectedCategory)
      }
      
      // 搜索过滤
      if (searchQuery) {
        const query = searchQuery.toLowerCase()
        filteredPosts = filteredPosts.filter(post => 
          post.title.toLowerCase().includes(query) ||
          post.content.toLowerCase().includes(query) ||
          post.tags.some(tag => tag.toLowerCase().includes(query))
        )
      }
      
      setPosts(filteredPosts)
    } catch (error) {
      console.error('获取帖子列表失败:', error)
    } finally {
      setIsLoading(false)
    }
  }, [selectedCategory, searchQuery])

  useEffect(() => {
    fetchPosts()
  }, [fetchPosts])

  // 点赞功能
  const handleLike = async (postId) => {
    try {
      // 模拟API调用
      setPosts(prev => prev.map(post => 
        post.id === postId 
          ? { ...post, likes: post.likes + 1 }
          : post
      ))
    } catch (error) {
      console.error('点赞失败:', error)
    }
  }

  // 收藏功能
  const handleCollect = async (postId) => {
    try {
      // 模拟API调用
      console.log('收藏帖子:', postId)
    } catch (error) {
      console.error('收藏失败:', error)
    }
  }

  // 保存新帖子
  const handleSavePost = (newPost) => {
    setPosts(prev => [newPost, ...prev])
    setShowPostEditor(false)
  }

  const renderPostCard = (post) => (
    <div key={post.id} className="post-card">
      <div className="post-header">
        <div className="author-info">
          <div className="author-avatar">{post.author.avatar}</div>
          <div className="author-details">
            <div className="author-name">{post.author.username}</div>
            <div className="author-level">
              <span className="level-badge">{post.author.level}</span>
              <span className="points">{post.author.points} 积分</span>
            </div>
          </div>
        </div>
        <div className="post-meta">
          <span className="post-time">
            {new Date(post.createdAt).toLocaleDateString('zh-CN')}
          </span>
          {post.isPinned && <span className="pinned-badge">📌 置顶</span>}
          {post.isFeatured && <span className="featured-badge">⭐ 精华</span>}
        </div>
      </div>

      <div className="post-content" onClick={() => setSelectedPost(post)}>
        <h3 className="post-title">{post.title}</h3>
        <p className="post-summary">{post.summary}</p>
        
        <div className="post-tags">
          {post.tags.map(tag => (
            <span key={tag} className="tag">{tag}</span>
          ))}
          <span className={`platform-tag ${post.platform}`}>
            {platforms.find(p => p.id === post.platform)?.name || post.platform}
          </span>
        </div>
      </div>

      <div className="post-stats">
        <div className="stat-item">
          <span className="stat-icon">👀</span>
          <span className="stat-count">{post.views}</span>
        </div>
        <div className="stat-item">
          <span className="stat-icon">👍</span>
          <span className="stat-count">{post.likes}</span>
        </div>
        <div className="stat-item">
          <span className="stat-icon">💬</span>
          <span className="stat-count">{post.comments}</span>
        </div>
      </div>

      <div className="post-actions">
        <button 
          className="action-btn like-btn"
          onClick={(e) => {
            e.stopPropagation()
            handleLike(post.id)
          }}
        >
          👍 点赞 ({post.likes})
        </button>
        <button 
          className="action-btn collect-btn"
          onClick={(e) => {
            e.stopPropagation()
            handleCollect(post.id)
          }}
        >
          ⭐ 收藏
        </button>
        <button 
          className="action-btn share-btn"
          onClick={(e) => {
            e.stopPropagation()
            // 分享功能
          }}
        >
          📤 分享
        </button>
      </div>
    </div>
  )

  return (
    <div className="community">
      <div className="community-container">
        {/* 头部区域 */}
        <div className="community-header">
          <div className="header-content">
            <h1 className="page-title">🏘️ 卖家社区</h1>
            <p className="page-subtitle">与全球出海卖家交流经验，分享心得</p>
            
            <div className="header-actions">
              <div className="search-bar">
                <input
                  type="text"
                  placeholder="搜索帖子、用户..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="search-input"
                />
                <button className="search-btn">🔍</button>
              </div>
              
              <button 
                className="create-post-btn"
                onClick={() => setShowPostEditor(true)}
              >
                ✍️ 发布帖子
              </button>
            </div>
          </div>
        </div>

        {/* 导航和分类 */}
        <div className="community-nav">
          <div className="nav-tabs">
            <button 
              className={`nav-tab ${currentView === 'posts' ? 'active' : ''}`}
              onClick={() => setCurrentView('posts')}
            >
              📝 最新帖子
            </button>
            <button 
              className={`nav-tab ${currentView === 'categories' ? 'active' : ''}`}
              onClick={() => setCurrentView('categories')}
            >
              📂 分类浏览
            </button>
            <button 
              className={`nav-tab ${currentView === 'users' ? 'active' : ''}`}
              onClick={() => setCurrentView('users')}
            >
              👥 活跃用户
            </button>
          </div>

          <div className="category-filters">
            {categories.map(category => (
              <button
                key={category.id}
                className={`category-btn ${selectedCategory === category.id ? 'active' : ''}`}
                onClick={() => setSelectedCategory(category.id)}
              >
                <span className="category-icon">{category.icon}</span>
                <span className="category-name">{category.name}</span>
                <span className="category-count">({category.count})</span>
              </button>
            ))}
          </div>
        </div>

        {/* 主内容区域 */}
        <div className="community-content">
          <div className="posts-section">
            {isLoading ? (
              <div className="loading-state">
                <div className="loading-spinner"></div>
                <p>加载中...</p>
              </div>
            ) : posts.length > 0 ? (
              <div className="posts-list">
                {posts.map(renderPostCard)}
              </div>
            ) : (
              <div className="empty-state">
                <h3>😔 暂无相关内容</h3>
                <p>尝试调整搜索条件或分类筛选</p>
              </div>
            )}
          </div>

          {/* 侧边栏 */}
          <div className="sidebar">
            <div className="sidebar-section">
              <h3>🔥 热门标签</h3>
              <div className="tag-cloud">
                {['Amazon', 'Shopify', '选品', '运营', '推广', '物流', '客服', 'SEO'].map(tag => (
                  <span key={tag} className="tag-item">{tag}</span>
                ))}
              </div>
            </div>

            <div className="sidebar-section">
              <h3>👑 活跃用户</h3>
              <div className="active-users">
                {[
                  { name: '出海小王', points: 1250, avatar: '👨‍💼' },
                  { name: '技术小白', points: 120, avatar: '👩‍💻' },
                  { name: '政策解读员', points: 2800, avatar: '📊' }
                ].map(user => (
                  <div key={user.name} className="user-item">
                    <span className="user-avatar">{user.avatar}</span>
                    <div className="user-info">
                      <div className="user-name">{user.name}</div>
                      <div className="user-points">{user.points} 积分</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="sidebar-section">
              <h3>📊 社区统计</h3>
              <div className="community-stats">
                <div className="stat-item">
                  <span className="stat-label">总帖子</span>
                  <span className="stat-value">1,234</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">活跃用户</span>
                  <span className="stat-value">567</span>
                </div>
                <div className="stat-item">
                  <span className="stat-label">今日新增</span>
                  <span className="stat-value">23</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 帖子详情弹窗 */}
      {selectedPost && (
        <div className="post-modal-overlay" onClick={() => setSelectedPost(null)}>
          <div className="post-modal" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <div className="modal-title">
                <span className="modal-icon">📝</span>
                <h2>{selectedPost.title}</h2>
              </div>
              <button className="close-btn" onClick={() => setSelectedPost(null)}>×</button>
            </div>

            <div className="modal-content">
              <div className="post-author">
                <div className="author-avatar">{selectedPost.author.avatar}</div>
                <div className="author-info">
                  <div className="author-name">{selectedPost.author.username}</div>
                  <div className="author-meta">
                    <span className="author-level">{selectedPost.author.level}</span>
                    <span className="post-time">
                      {new Date(selectedPost.createdAt).toLocaleString('zh-CN')}
                    </span>
                  </div>
                </div>
              </div>

              <div className="post-content-full">
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
                    blockquote: ({children}) => <blockquote className="markdown-blockquote">{children}</blockquote>,
                  }}
                >
                  {selectedPost.content}
                </ReactMarkdown>
              </div>

              <div className="post-tags-full">
                {selectedPost.tags.map(tag => (
                  <span key={tag} className="tag">{tag}</span>
                ))}
              </div>
            </div>

            <div className="modal-actions">
              <button className="btn btn-primary">
                💬 评论 ({selectedPost.comments})
              </button>
              <button 
                className="btn btn-secondary"
                onClick={() => handleLike(selectedPost.id)}
              >
                👍 点赞 ({selectedPost.likes})
              </button>
              <button 
                className="btn btn-secondary"
                onClick={() => handleCollect(selectedPost.id)}
              >
                ⭐ 收藏
              </button>
              <button className="btn btn-secondary">
                📤 分享
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 发帖编辑器 */}
      {showPostEditor && (
        <PostEditor
          onClose={() => setShowPostEditor(false)}
          onSave={handleSavePost}
        />
      )}

      <style jsx>{`
        .community {
          min-height: 100vh;
          background: #f8fafc;
        }

        .community-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem 1rem;
        }

        .community-header {
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

        .header-actions {
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
        }

        .create-post-btn {
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

        .create-post-btn:hover {
          background: rgba(255, 255, 255, 0.3);
          border-color: rgba(255, 255, 255, 0.5);
        }

        .community-nav {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          margin-bottom: 2rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .nav-tabs {
          display: flex;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .nav-tab {
          padding: 0.75rem 1.5rem;
          background: #f8fafc;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-size: 0.875rem;
          font-weight: 500;
          transition: all 0.2s;
        }

        .nav-tab.active {
          background: #2563eb;
          color: white;
        }

        .category-filters {
          display: flex;
          gap: 0.5rem;
          overflow-x: auto;
          padding-bottom: 0.5rem;
        }

        .category-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          background: #f8fafc;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
          white-space: nowrap;
          font-size: 0.875rem;
        }

        .category-btn:hover {
          background: #e2e8f0;
        }

        .category-btn.active {
          background: #2563eb;
          color: white;
          border-color: #2563eb;
        }

        .category-icon {
          font-size: 1rem;
        }

        .community-content {
          display: grid;
          grid-template-columns: 1fr 300px;
          gap: 2rem;
        }

        .posts-section {
          min-height: 600px;
        }

        .posts-list {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .post-card {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          cursor: pointer;
          transition: all 0.2s;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          border: 2px solid transparent;
        }

        .post-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
          border-color: #2563eb;
        }

        .post-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
        }

        .author-info {
          display: flex;
          gap: 0.75rem;
          align-items: center;
        }

        .author-avatar {
          width: 40px;
          height: 40px;
          background: #f8fafc;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.5rem;
        }

        .author-name {
          font-weight: 600;
          color: #1a1a1a;
        }

        .author-level {
          display: flex;
          gap: 0.5rem;
          align-items: center;
          margin-top: 0.25rem;
        }

        .level-badge {
          background: #eff6ff;
          color: #2563eb;
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: 500;
        }

        .points {
          font-size: 0.75rem;
          color: #64748b;
        }

        .post-meta {
          display: flex;
          gap: 0.5rem;
          align-items: center;
        }

        .post-time {
          font-size: 0.875rem;
          color: #64748b;
        }

        .pinned-badge, .featured-badge {
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: 500;
        }

        .pinned-badge {
          background: #fef3c7;
          color: #92400e;
        }

        .featured-badge {
          background: #fecaca;
          color: #991b1b;
        }

        .post-content {
          margin-bottom: 1rem;
        }

        .post-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: #1a1a1a;
          margin-bottom: 0.75rem;
          line-height: 1.4;
        }

        .post-summary {
          color: #64748b;
          line-height: 1.6;
          margin-bottom: 1rem;
        }

        .post-tags {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
          margin-bottom: 1rem;
        }

        .tag {
          padding: 0.25rem 0.75rem;
          background: #f1f5f9;
          color: #475569;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 500;
        }

        .platform-tag {
          padding: 0.25rem 0.75rem;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 500;
          color: white;
        }

        .platform-tag.amazon { background: #ff9900; }
        .platform-tag.shopify { background: #96bf48; }
        .platform-tag.ebay { background: #0064d2; }
        .platform-tag.aliexpress { background: #ff6600; }
        .platform-tag.lazada { background: #0f146d; }

        .post-stats {
          display: flex;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .stat-item {
          display: flex;
          align-items: center;
          gap: 0.25rem;
          font-size: 0.875rem;
          color: #64748b;
        }

        .stat-icon {
          font-size: 1rem;
        }

        .post-actions {
          display: flex;
          gap: 0.75rem;
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
        }

        .like-btn:hover {
          background: #fef2f2;
          border-color: #fecaca;
        }

        .collect-btn:hover {
          background: #fef3c7;
          border-color: #fde68a;
        }

        .share-btn:hover {
          background: #eff6ff;
          border-color: #dbeafe;
        }

        .sidebar {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .sidebar-section {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
        }

        .sidebar-section h3 {
          font-size: 1.125rem;
          font-weight: 600;
          color: #1a1a1a;
          margin-bottom: 1rem;
        }

        .tag-cloud {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .tag-item {
          padding: 0.25rem 0.75rem;
          background: #f1f5f9;
          color: #475569;
          border-radius: 6px;
          font-size: 0.75rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .tag-item:hover {
          background: #e2e8f0;
        }

        .active-users {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .user-item {
          display: flex;
          gap: 0.75rem;
          align-items: center;
        }

        .user-avatar {
          width: 32px;
          height: 32px;
          background: #f8fafc;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 1.2rem;
        }

        .user-name {
          font-weight: 500;
          color: #1a1a1a;
          font-size: 0.875rem;
        }

        .user-points {
          font-size: 0.75rem;
          color: #64748b;
        }

        .community-stats {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
        }

        .stat-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .stat-label {
          font-size: 0.875rem;
          color: #64748b;
        }

        .stat-value {
          font-weight: 600;
          color: #1a1a1a;
          font-size: 0.875rem;
        }

        .loading-state {
          text-align: center;
          padding: 4rem 2rem;
          color: #64748b;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #e2e8f0;
          border-top: 4px solid #2563eb;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 1rem;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .empty-state {
          text-align: center;
          padding: 4rem 2rem;
          color: #64748b;
        }

        .empty-state h3 {
          font-size: 1.5rem;
          margin-bottom: 1rem;
        }

        /* 弹窗样式 */
        .post-modal-overlay {
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

        .post-modal {
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

        .post-author {
          display: flex;
          gap: 1rem;
          align-items: center;
          margin-bottom: 2rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid #e2e8f0;
        }

        .post-content-full {
          margin-bottom: 2rem;
          line-height: 1.7;
          color: #374151;
        }

        .post-tags-full {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
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

        /* Markdown样式 */
        .markdown-h1, .markdown-h2, .markdown-h3 {
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

        .markdown-blockquote {
          margin: 1rem 0;
          padding: 1rem;
          background: #f8fafc;
          border-left: 4px solid #2563eb;
          border-radius: 0 8px 8px 0;
          font-style: italic;
          color: #64748b;
        }

        @media (max-width: 768px) {
          .community-container {
            padding: 1rem 0.5rem;
          }

          .community-header {
            padding: 2rem 1rem;
          }

          .page-title {
            font-size: 2rem;
          }

          .header-actions {
            flex-direction: column;
            gap: 1rem;
          }

          .search-bar {
            width: 100%;
          }

          .community-content {
            grid-template-columns: 1fr;
          }

          .sidebar {
            order: -1;
          }

          .nav-tabs {
            flex-wrap: wrap;
          }

          .category-filters {
            flex-wrap: wrap;
          }

          .modal-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  )
}

export default Community
