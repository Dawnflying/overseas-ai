import React, { useState, useEffect, useCallback } from 'react'

const TikTokShopManager = () => {
  const [activeTab, setActiveTab] = useState('shops') // shops, orders, logistics, settings
  const [shops, setShops] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [showAuthModal, setShowAuthModal] = useState(false)
  const [selectedShop, setSelectedShop] = useState(null)
  const [searchFilter, setSearchFilter] = useState({
    site: 'all',
    status: 'all',
    shopType: 'all'
  })

  // 支持的站点和店铺类型
  const supportedSites = [
    { id: 'us', name: '美国站', code: 'US' },
    { id: 'uk', name: '英国站', code: 'UK' },
    { id: 'my', name: '马来西亚站', code: 'MY' },
    { id: 'sg', name: '新加坡站', code: 'SG' },
    { id: 'id', name: '印度尼西亚站', code: 'ID' },
    { id: 'vn', name: '越南站', code: 'VN' },
    { id: 'ph', name: '菲律宾站', code: 'PH' },
    { id: 'th', name: '泰国站', code: 'TH' },
    { id: 'jp', name: '日本站', code: 'JP' },
    { id: 'de', name: '德国站', code: 'DE' },
    { id: 'es', name: '西班牙站', code: 'ES' },
    { id: 'it', name: '意大利站', code: 'IT' },
    { id: 'fr', name: '法国站', code: 'FR' },
    { id: 'mx', name: '墨西哥站', code: 'MX' },
    { id: 'ie', name: '爱尔兰站', code: 'IE' }
  ]

  const shopTypes = [
    { id: 'cross-border', name: '跨境店铺', description: '面向海外市场的店铺' },
    { id: 'local', name: '本土店铺', description: '面向本地市场的店铺' },
    { id: 'us-local', name: '美国本土店铺', description: '美国本土注册的店铺' },
    { id: 'us-cross-border', name: '美国跨境店铺', description: '非美国注册的跨境店铺' }
  ]

  // 模拟店铺数据
  const mockShops = [
    {
      id: '1',
      name: '我的TikTok美国店',
      platformName: 'TikTok Shop US',
      site: 'us',
      shopType: 'us-cross-border',
      status: 'connected',
      authStatus: 'authorized',
      tradingRate: 5.5,
      lastSync: '2024-01-15T10:30:00Z',
      stats: {
        orders: 156,
        revenue: 8950,
        products: 23,
        growth: 12.5
      },
      permissions: {
        orderSync: true,
        inventorySync: true,
        productManagement: true,
        reporting: true
      }
    },
    {
      id: '2',
      name: '英国精品店',
      platformName: 'TikTok Shop UK',
      site: 'uk',
      shopType: 'cross-border',
      status: 'connected',
      authStatus: 'authorized',
      tradingRate: 4.8,
      lastSync: '2024-01-15T09:15:00Z',
      stats: {
        orders: 89,
        revenue: 3420,
        products: 15,
        growth: 8.3
      },
      permissions: {
        orderSync: true,
        inventorySync: true,
        productManagement: true,
        reporting: true
      }
    },
    {
      id: '3',
      name: '东南亚店铺',
      platformName: 'TikTok Shop SG',
      site: 'sg',
      shopType: 'local',
      status: 'pending',
      authStatus: 'pending',
      tradingRate: 3.2,
      lastSync: null,
      stats: {
        orders: 0,
        revenue: 0,
        products: 0,
        growth: 0
      },
      permissions: {
        orderSync: false,
        inventorySync: false,
        productManagement: false,
        reporting: false
      }
    }
  ]

  // 获取店铺列表
  const fetchShops = useCallback(async () => {
    setIsLoading(true)
    try {
      // 模拟API调用
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      let filteredShops = mockShops
      
      // 应用筛选条件
      if (searchFilter.site !== 'all') {
        filteredShops = filteredShops.filter(shop => shop.site === searchFilter.site)
      }
      
      if (searchFilter.status !== 'all') {
        filteredShops = filteredShops.filter(shop => shop.status === searchFilter.status)
      }
      
      if (searchFilter.shopType !== 'all') {
        filteredShops = filteredShops.filter(shop => shop.shopType === searchFilter.shopType)
      }
      
      setShops(filteredShops)
    } catch (error) {
      console.error('获取店铺列表失败:', error)
    } finally {
      setIsLoading(false)
    }
  }, [searchFilter])

  useEffect(() => {
    fetchShops()
  }, [fetchShops])

  // 处理店铺授权
  const handleShopAuth = async (shopData) => {
    try {
      // 模拟授权流程
      const response = await fetch('/api/tiktok/shops/auth', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(shopData)
      })

      if (response.ok) {
        const result = await response.json()
        alert('店铺授权成功！')
        setShowAuthModal(false)
        fetchShops() // 刷新列表
      }
    } catch (error) {
      console.error('店铺授权失败:', error)
      alert('店铺授权失败，请稍后重试')
    }
  }

  // 处理店铺断开
  const handleShopDisconnect = async (shopId) => {
    if (!confirm('确定要断开该店铺的连接吗？')) return

    try {
      const response = await fetch(`/api/tiktok/shops/${shopId}/disconnect`, {
        method: 'POST'
      })

      if (response.ok) {
        alert('店铺已断开连接')
        fetchShops() // 刷新列表
      }
    } catch (error) {
      console.error('断开店铺连接失败:', error)
      alert('断开连接失败，请稍后重试')
    }
  }

  // 处理数据同步
  const handleSyncData = async (shopId) => {
    try {
      const response = await fetch(`/api/tiktok/shops/${shopId}/sync`, {
        method: 'POST'
      })

      if (response.ok) {
        alert('数据同步成功！')
        fetchShops() // 刷新列表
      }
    } catch (error) {
      console.error('数据同步失败:', error)
      alert('数据同步失败，请稍后重试')
    }
  }

  const getStatusBadge = (status) => {
    const badges = {
      connected: { text: '已连接', class: 'status-connected' },
      pending: { text: '待授权', class: 'status-pending' },
      error: { text: '连接异常', class: 'status-error' },
      disconnected: { text: '已断开', class: 'status-disconnected' }
    }
    return badges[status] || badges.disconnected
  }

  const getSiteName = (siteId) => {
    return supportedSites.find(site => site.id === siteId)?.name || siteId
  }

  const getShopTypeName = (typeId) => {
    return shopTypes.find(type => type.id === typeId)?.name || typeId
  }

  return (
    <div className="tiktok-shop-manager">
      <div className="manager-header">
        <h1>🎵 TikTok店铺管理</h1>
        <p>统一管理多个TikTok店铺的订单、库存、商品和报表数据</p>
        
        <div className="header-actions">
          <button 
            className="btn btn-primary"
            onClick={() => setShowAuthModal(true)}
          >
            ➕ 授权新店铺
          </button>
          <button 
            className="btn btn-secondary"
            onClick={() => handleSyncData('all')}
          >
            🔄 同步所有数据
          </button>
        </div>
      </div>

      {/* 标签页导航 */}
      <div className="tab-navigation">
        <button 
          className={`tab-btn ${activeTab === 'shops' ? 'active' : ''}`}
          onClick={() => setActiveTab('shops')}
        >
          🏪 店铺管理
        </button>
        <button 
          className={`tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
          onClick={() => setActiveTab('orders')}
        >
          📦 订单管理
        </button>
        <button 
          className={`tab-btn ${activeTab === 'logistics' ? 'active' : ''}`}
          onClick={() => setActiveTab('logistics')}
        >
          🚚 物流管理
        </button>
        <button 
          className={`tab-btn ${activeTab === 'settings' ? 'active' : ''}`}
          onClick={() => setActiveTab('settings')}
        >
          ⚙️ 设置管理
        </button>
      </div>

      {/* 内容区域 */}
      <div className="tab-content">
        {activeTab === 'shops' && (
          <div className="shops-content">
            {/* 筛选器 */}
            <div className="filters-section">
              <div className="filter-group">
                <label>站点筛选：</label>
                <select 
                  value={searchFilter.site} 
                  onChange={(e) => setSearchFilter(prev => ({...prev, site: e.target.value}))}
                >
                  <option value="all">全部站点</option>
                  {supportedSites.map(site => (
                    <option key={site.id} value={site.id}>{site.name}</option>
                  ))}
                </select>
              </div>

              <div className="filter-group">
                <label>连接状态：</label>
                <select 
                  value={searchFilter.status} 
                  onChange={(e) => setSearchFilter(prev => ({...prev, status: e.target.value}))}
                >
                  <option value="all">全部状态</option>
                  <option value="connected">已连接</option>
                  <option value="pending">待授权</option>
                  <option value="error">连接异常</option>
                  <option value="disconnected">已断开</option>
                </select>
              </div>

              <div className="filter-group">
                <label>店铺类型：</label>
                <select 
                  value={searchFilter.shopType} 
                  onChange={(e) => setSearchFilter(prev => ({...prev, shopType: e.target.value}))}
                >
                  <option value="all">全部类型</option>
                  {shopTypes.map(type => (
                    <option key={type.id} value={type.id}>{type.name}</option>
                  ))}
                </select>
              </div>

              <button 
                className="clear-filters-btn"
                onClick={() => setSearchFilter({ site: 'all', status: 'all', shopType: 'all' })}
              >
                清除筛选
              </button>
            </div>

            {/* 店铺列表 */}
            <div className="shops-grid">
              {isLoading ? (
                <div className="loading-state">
                  <div className="loading-spinner"></div>
                  <p>加载店铺数据中...</p>
                </div>
              ) : shops.length > 0 ? (
                shops.map(shop => (
                  <div key={shop.id} className="shop-card">
                    <div className="shop-header">
                      <div className="shop-info">
                        <h3 className="shop-name">{shop.name}</h3>
                        <p className="shop-platform">{shop.platformName}</p>
                        <div className="shop-meta">
                          <span className="site-badge">{getSiteName(shop.site)}</span>
                          <span className="type-badge">{getShopTypeName(shop.shopType)}</span>
                        </div>
                      </div>
                      <div className="shop-status">
                        <span className={`status-badge ${getStatusBadge(shop.status).class}`}>
                          {getStatusBadge(shop.status).text}
                        </span>
                      </div>
                    </div>

                    <div className="shop-stats">
                      <div className="stat-item">
                        <span className="stat-value">{shop.stats.orders}</span>
                        <span className="stat-label">订单</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-value">${shop.stats.revenue}</span>
                        <span className="stat-label">收入</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-value">{shop.stats.products}</span>
                        <span className="stat-label">商品</span>
                      </div>
                      <div className="stat-item">
                        <span className="stat-value">+{shop.stats.growth}%</span>
                        <span className="stat-label">增长</span>
                      </div>
                    </div>

                    <div className="shop-details">
                      <div className="detail-item">
                        <span className="detail-label">交易费率：</span>
                        <span className="detail-value">{shop.tradingRate}%</span>
                      </div>
                      <div className="detail-item">
                        <span className="detail-label">最后同步：</span>
                        <span className="detail-value">
                          {shop.lastSync ? new Date(shop.lastSync).toLocaleString('zh-CN') : '未同步'}
                        </span>
                      </div>
                    </div>

                    <div className="shop-actions">
                      {shop.status === 'connected' ? (
                        <>
                          <button 
                            className="action-btn primary"
                            onClick={() => handleSyncData(shop.id)}
                          >
                            🔄 同步数据
                          </button>
                          <button 
                            className="action-btn secondary"
                            onClick={() => setSelectedShop(shop)}
                          >
                            ⚙️ 管理
                          </button>
                          <button 
                            className="action-btn danger"
                            onClick={() => handleShopDisconnect(shop.id)}
                          >
                            🔌 断开
                          </button>
                        </>
                      ) : (
                        <button 
                          className="action-btn success"
                          onClick={() => setShowAuthModal(true)}
                        >
                          🔗 授权连接
                        </button>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="empty-state">
                  <h3>😔 没有找到匹配的店铺</h3>
                  <p>尝试调整筛选条件或授权新店铺</p>
                  <button 
                    className="btn btn-primary"
                    onClick={() => setShowAuthModal(true)}
                  >
                    ➕ 授权新店铺
                  </button>
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="orders-content">
            <h2>📦 订单管理</h2>
            <p>订单管理功能正在开发中...</p>
          </div>
        )}

        {activeTab === 'logistics' && (
          <div className="logistics-content">
            <h2>🚚 物流管理</h2>
            <p>物流管理功能正在开发中...</p>
          </div>
        )}

        {activeTab === 'settings' && (
          <div className="settings-content">
            <h2>⚙️ 设置管理</h2>
            <p>设置管理功能正在开发中...</p>
          </div>
        )}
      </div>

      {/* 授权弹窗 */}
      {showAuthModal && (
        <TikTokAuthModal
          onClose={() => setShowAuthModal(false)}
          onAuth={handleShopAuth}
          supportedSites={supportedSites}
          shopTypes={shopTypes}
        />
      )}

      {/* 店铺详情弹窗 */}
      {selectedShop && (
        <ShopDetailModal
          shop={selectedShop}
          onClose={() => setSelectedShop(null)}
          onUpdate={fetchShops}
        />
      )}

      <style jsx>{`
        .tiktok-shop-manager {
          min-height: 100vh;
          background: #f8fafc;
        }

        .manager-header {
          background: linear-gradient(135deg, #fe2c55 0%, #ff6b35 100%);
          color: white;
          padding: 2rem;
          text-align: center;
        }

        .manager-header h1 {
          font-size: 2rem;
          font-weight: 700;
          margin-bottom: 0.5rem;
        }

        .manager-header p {
          font-size: 1.125rem;
          opacity: 0.9;
          margin-bottom: 2rem;
        }

        .header-actions {
          display: flex;
          gap: 1rem;
          justify-content: center;
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
          background: rgba(255, 255, 255, 0.2);
          color: white;
          border: 2px solid rgba(255, 255, 255, 0.3);
          backdrop-filter: blur(10px);
        }

        .btn-primary:hover {
          background: rgba(255, 255, 255, 0.3);
          border-color: rgba(255, 255, 255, 0.5);
        }

        .btn-secondary {
          background: rgba(255, 255, 255, 0.1);
          color: white;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .btn-secondary:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        .tab-navigation {
          display: flex;
          background: white;
          border-bottom: 1px solid #e2e8f0;
          padding: 0 2rem;
        }

        .tab-btn {
          padding: 1rem 1.5rem;
          background: none;
          border: none;
          cursor: pointer;
          font-size: 0.875rem;
          font-weight: 500;
          color: #64748b;
          border-bottom: 3px solid transparent;
          transition: all 0.2s;
        }

        .tab-btn:hover {
          color: #1a1a1a;
          background: #f8fafc;
        }

        .tab-btn.active {
          color: #fe2c55;
          border-bottom-color: #fe2c55;
        }

        .tab-content {
          padding: 2rem;
        }

        .filters-section {
          display: flex;
          gap: 1rem;
          align-items: center;
          margin-bottom: 2rem;
          padding: 1.5rem;
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

        .shops-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(400px, 1fr));
          gap: 1.5rem;
        }

        .shop-card {
          background: white;
          border-radius: 12px;
          padding: 1.5rem;
          box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
          transition: all 0.2s;
        }

        .shop-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 8px 24px rgba(0, 0, 0, 0.15);
        }

        .shop-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
        }

        .shop-name {
          font-size: 1.125rem;
          font-weight: 600;
          color: #1a1a1a;
          margin: 0 0 0.25rem 0;
        }

        .shop-platform {
          font-size: 0.875rem;
          color: #64748b;
          margin: 0 0 0.75rem 0;
        }

        .shop-meta {
          display: flex;
          gap: 0.5rem;
        }

        .site-badge, .type-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 500;
        }

        .site-badge {
          background: #eff6ff;
          color: #2563eb;
        }

        .type-badge {
          background: #f0fdf4;
          color: #166534;
        }

        .status-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 6px;
          font-size: 0.75rem;
          font-weight: 500;
        }

        .status-connected {
          background: #dcfce7;
          color: #166534;
        }

        .status-pending {
          background: #fef3c7;
          color: #92400e;
        }

        .status-error {
          background: #fecaca;
          color: #991b1b;
        }

        .status-disconnected {
          background: #f3f4f6;
          color: #6b7280;
        }

        .shop-stats {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1rem;
          margin-bottom: 1rem;
          padding: 1rem;
          background: #f8fafc;
          border-radius: 8px;
        }

        .stat-item {
          text-align: center;
        }

        .stat-value {
          display: block;
          font-size: 1.25rem;
          font-weight: 600;
          color: #1a1a1a;
          margin-bottom: 0.25rem;
        }

        .stat-label {
          font-size: 0.75rem;
          color: #64748b;
        }

        .shop-details {
          margin-bottom: 1rem;
          padding: 1rem;
          background: #f8fafc;
          border-radius: 8px;
        }

        .detail-item {
          display: flex;
          justify-content: space-between;
          margin-bottom: 0.5rem;
        }

        .detail-item:last-child {
          margin-bottom: 0;
        }

        .detail-label {
          font-size: 0.875rem;
          color: #64748b;
        }

        .detail-value {
          font-size: 0.875rem;
          font-weight: 500;
          color: #1a1a1a;
        }

        .shop-actions {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .action-btn {
          padding: 0.5rem 1rem;
          border: none;
          border-radius: 6px;
          cursor: pointer;
          font-size: 0.875rem;
          font-weight: 500;
          transition: all 0.2s;
          flex: 1;
          min-width: 100px;
        }

        .action-btn.primary {
          background: #2563eb;
          color: white;
        }

        .action-btn.primary:hover {
          background: #1d4ed8;
        }

        .action-btn.secondary {
          background: #6b7280;
          color: white;
        }

        .action-btn.secondary:hover {
          background: #4b5563;
        }

        .action-btn.success {
          background: #059669;
          color: white;
        }

        .action-btn.success:hover {
          background: #047857;
        }

        .action-btn.danger {
          background: #dc2626;
          color: white;
        }

        .action-btn.danger:hover {
          background: #b91c1c;
        }

        .loading-state, .empty-state {
          text-align: center;
          padding: 4rem 2rem;
          color: #64748b;
        }

        .loading-spinner {
          width: 40px;
          height: 40px;
          border: 4px solid #e2e8f0;
          border-top: 4px solid #fe2c55;
          border-radius: 50%;
          animation: spin 1s linear infinite;
          margin: 0 auto 1rem;
        }

        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }

        .empty-state h3 {
          font-size: 1.5rem;
          margin-bottom: 1rem;
        }

        @media (max-width: 768px) {
          .manager-header {
            padding: 1.5rem 1rem;
          }

          .manager-header h1 {
            font-size: 1.5rem;
          }

          .header-actions {
            flex-direction: column;
            align-items: center;
          }

          .tab-navigation {
            padding: 0 1rem;
            overflow-x: auto;
          }

          .tab-content {
            padding: 1rem;
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

          .shops-grid {
            grid-template-columns: 1fr;
          }

          .shop-stats {
            grid-template-columns: repeat(2, 1fr);
          }

          .shop-actions {
            flex-direction: column;
          }

          .action-btn {
            min-width: auto;
          }
        }
      `}</style>
    </div>
  )
}

// TikTok授权弹窗组件
const TikTokAuthModal = ({ onClose, onAuth, supportedSites, shopTypes }) => {
  const [authData, setAuthData] = useState({
    shopName: '',
    tradingRate: '',
    site: '',
    shopType: ''
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!authData.shopName || !authData.tradingRate || !authData.site || !authData.shopType) {
      alert('请填写所有必填字段')
      return
    }
    onAuth(authData)
  }

  return (
    <div className="auth-modal-overlay" onClick={onClose}>
      <div className="auth-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>🔗 TikTok店铺授权</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label>店铺名称 *</label>
            <input
              type="text"
              placeholder="输入店铺名称（便于ERP识别）"
              value={authData.shopName}
              onChange={(e) => setAuthData(prev => ({...prev, shopName: e.target.value}))}
              required
            />
          </div>

          <div className="form-group">
            <label>交易费率 (%) *</label>
            <input
              type="number"
              placeholder="用于订单利润计算，必须 ≥ 0"
              min="0"
              step="0.1"
              value={authData.tradingRate}
              onChange={(e) => setAuthData(prev => ({...prev, tradingRate: e.target.value}))}
              required
            />
          </div>

          <div className="form-group">
            <label>选择站点 *</label>
            <select
              value={authData.site}
              onChange={(e) => setAuthData(prev => ({...prev, site: e.target.value}))}
              required
            >
              <option value="">请选择站点</option>
              {supportedSites.map(site => (
                <option key={site.id} value={site.id}>{site.name}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>店铺类型 *</label>
            <select
              value={authData.shopType}
              onChange={(e) => setAuthData(prev => ({...prev, shopType: e.target.value}))}
              required
            >
              <option value="">请选择店铺类型</option>
              {shopTypes.map(type => (
                <option key={type.id} value={type.id}>{type.name}</option>
              ))}
            </select>
          </div>

          <div className="form-actions">
            <button type="button" className="btn btn-secondary" onClick={onClose}>
              取消
            </button>
            <button type="submit" className="btn btn-primary">
              前往授权
            </button>
          </div>
        </form>

        <style jsx>{`
          .auth-modal-overlay {
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

          .auth-modal {
            background: white;
            border-radius: 16px;
            max-width: 500px;
            width: 100%;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.3);
          }

          .modal-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 1.5rem 2rem;
            border-bottom: 1px solid #e2e8f0;
          }

          .modal-header h2 {
            font-size: 1.25rem;
            font-weight: 600;
            color: #1a1a1a;
            margin: 0;
          }

          .close-btn {
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            color: #64748b;
            padding: 0.5rem;
            border-radius: 50%;
            transition: background 0.2s;
          }

          .close-btn:hover {
            background: #f1f5f9;
          }

          .auth-form {
            padding: 2rem;
          }

          .form-group {
            margin-bottom: 1.5rem;
          }

          .form-group label {
            display: block;
            margin-bottom: 0.5rem;
            font-weight: 500;
            color: #374151;
          }

          .form-group input,
          .form-group select {
            width: 100%;
            padding: 0.75rem;
            border: 1px solid #d1d5db;
            border-radius: 6px;
            font-size: 0.875rem;
            transition: border-color 0.2s;
          }

          .form-group input:focus,
          .form-group select:focus {
            outline: none;
            border-color: #fe2c55;
            box-shadow: 0 0 0 3px rgba(254, 44, 85, 0.1);
          }

          .form-actions {
            display: flex;
            gap: 1rem;
            justify-content: flex-end;
            margin-top: 2rem;
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

          .btn-secondary {
            background: #6b7280;
            color: white;
          }

          .btn-secondary:hover {
            background: #4b5563;
          }

          .btn-primary {
            background: #fe2c55;
            color: white;
          }

          .btn-primary:hover {
            background: #e91e63;
          }

          @media (max-width: 768px) {
            .auth-modal {
              margin: 1rem;
            }

            .modal-header,
            .auth-form {
              padding: 1.5rem;
            }

            .form-actions {
              flex-direction: column;
            }
          }
        `}</style>
      </div>
    </div>
  )
}

// 店铺详情弹窗组件
const ShopDetailModal = ({ shop, onClose, onUpdate }) => {
  const [shopSettings, setShopSettings] = useState({
    tradingRate: shop.tradingRate,
    autoSync: true,
    syncInterval: '1hour',
    notifications: true
  })

  const handleSave = async () => {
    try {
      // 模拟保存设置
      alert('设置保存成功！')
      onClose()
      onUpdate()
    } catch (error) {
      alert('保存失败，请稍后重试')
    }
  }

  return (
    <div className="detail-modal-overlay" onClick={onClose}>
      <div className="detail-modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>⚙️ {shop.name} - 店铺管理</h2>
          <button className="close-btn" onClick={onClose}>×</button>
        </div>

        <div className="modal-content">
          <div className="shop-overview">
            <h3>店铺概览</h3>
            <div className="overview-grid">
              <div className="overview-item">
                <span className="label">店铺名称：</span>
                <span className="value">{shop.name}</span>
              </div>
              <div className="overview-item">
                <span className="label">平台名称：</span>
                <span className="value">{shop.platformName}</span>
              </div>
              <div className="overview-item">
                <span className="label">连接状态：</span>
                <span className={`status-badge ${shop.status === 'connected' ? 'connected' : 'disconnected'}`}>
                  {shop.status === 'connected' ? '已连接' : '未连接'}
                </span>
              </div>
              <div className="overview-item">
                <span className="label">最后同步：</span>
                <span className="value">
                  {shop.lastSync ? new Date(shop.lastSync).toLocaleString('zh-CN') : '未同步'}
                </span>
              </div>
            </div>
          </div>

          <div className="shop-settings">
            <h3>店铺设置</h3>
            <div className="settings-form">
              <div className="setting-item">
                <label>交易费率 (%)：</label>
                <input
                  type="number"
                  min="0"
                  step="0.1"
                  value={shopSettings.tradingRate}
                  onChange={(e) => setShopSettings(prev => ({...prev, tradingRate: e.target.value}))}
                />
              </div>
              <div className="setting-item">
                <label>自动同步：</label>
                <input
                  type="checkbox"
                  checked={shopSettings.autoSync}
                  onChange={(e) => setShopSettings(prev => ({...prev, autoSync: e.target.checked}))}
                />
              </div>
              <div className="setting-item">
                <label>同步间隔：</label>
                <select
                  value={shopSettings.syncInterval}
                  onChange={(e) => setShopSettings(prev => ({...prev, syncInterval: e.target.value}))}
                >
                  <option value="30min">30分钟</option>
                  <option value="1hour">1小时</option>
                  <option value="2hours">2小时</option>
                  <option value="6hours">6小时</option>
                </select>
              </div>
              <div className="setting-item">
                <label>消息通知：</label>
                <input
                  type="checkbox"
                  checked={shopSettings.notifications}
                  onChange={(e) => setShopSettings(prev => ({...prev, notifications: e.target.checked}))}
                />
              </div>
            </div>
          </div>
        </div>

        <div className="modal-actions">
          <button className="btn btn-secondary" onClick={onClose}>
            取消
          </button>
          <button className="btn btn-primary" onClick={handleSave}>
            保存设置
          </button>
        </div>

        <style jsx>{`
          .detail-modal-overlay {
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

          .detail-modal {
            background: white;
            border-radius: 16px;
            max-width: 600px;
            width: 100%;
            max-height: 80vh;
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

          .modal-header h2 {
            font-size: 1.25rem;
            font-weight: 600;
            color: #1a1a1a;
            margin: 0;
          }

          .close-btn {
            background: none;
            border: none;
            font-size: 1.5rem;
            cursor: pointer;
            color: #64748b;
            padding: 0.5rem;
            border-radius: 50%;
            transition: background 0.2s;
          }

          .close-btn:hover {
            background: #f1f5f9;
          }

          .modal-content {
            padding: 2rem;
          }

          .shop-overview,
          .shop-settings {
            margin-bottom: 2rem;
          }

          .shop-overview h3,
          .shop-settings h3 {
            font-size: 1.125rem;
            font-weight: 600;
            color: #1a1a1a;
            margin-bottom: 1rem;
          }

          .overview-grid {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 1rem;
          }

          .overview-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0.75rem;
            background: #f8fafc;
            border-radius: 8px;
          }

          .overview-item .label {
            font-size: 0.875rem;
            color: #64748b;
          }

          .overview-item .value {
            font-size: 0.875rem;
            font-weight: 500;
            color: #1a1a1a;
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
            background: #f3f4f6;
            color: #6b7280;
          }

          .settings-form {
            display: flex;
            flex-direction: column;
            gap: 1rem;
          }

          .setting-item {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 0.75rem;
            background: #f8fafc;
            border-radius: 8px;
          }

          .setting-item label {
            font-size: 0.875rem;
            color: #374151;
          }

          .setting-item input,
          .setting-item select {
            padding: 0.5rem;
            border: 1px solid #d1d5db;
            border-radius: 6px;
            font-size: 0.875rem;
          }

          .modal-actions {
            display: flex;
            gap: 1rem;
            justify-content: flex-end;
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

          .btn-secondary {
            background: #6b7280;
            color: white;
          }

          .btn-secondary:hover {
            background: #4b5563;
          }

          .btn-primary {
            background: #fe2c55;
            color: white;
          }

          .btn-primary:hover {
            background: #e91e63;
          }

          @media (max-width: 768px) {
            .detail-modal {
              margin: 1rem;
            }

            .modal-header,
            .modal-content,
            .modal-actions {
              padding: 1.5rem;
            }

            .overview-grid {
              grid-template-columns: 1fr;
            }

            .modal-actions {
              flex-direction: column;
            }
          }
        `}</style>
      </div>
    </div>
  )
}

export default TikTokShopManager
