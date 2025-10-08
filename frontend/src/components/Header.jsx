import React, { useState, useRef, useEffect } from 'react'

const Header = ({ currentPage, onNavigate, user, onLogout, onShowLogin }) => {
  const [showUserMenu, setShowUserMenu] = useState(false)
  const userMenuRef = useRef(null)

  // 点击外部关闭下拉菜单
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (userMenuRef.current && !userMenuRef.current.contains(event.target)) {
        setShowUserMenu(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])
  const navItems = [
    { id: 'home', label: '首页', icon: '🏠' },
    { id: 'training', label: '出海培训', icon: '🎓' },
    { id: 'plan', label: '出海规划', icon: '🗺️' },
    { id: 'market', label: '市场分析', icon: '📈' },
    { id: 'tools', label: '出海工具', icon: '🛠️' },
    { id: 'community', label: '卖家社区', icon: '👥' },
    { id: 'dashboard', label: '出海控制台', icon: '📊', requiresAuth: true }
  ]

  return (
    <header className="header">
      <div className="container">
        <div className="header-content">
          {/* Logo */}
          <div className="logo">
            <div className="logo-icon">🚀</div>
            <div className="logo-text">
              <span className="logo-title">AI出海平台</span>
              <span className="logo-subtitle">跨境电商智能助手</span>
            </div>
          </div>

          {/* 主导航 */}
          <nav className="main-nav">
            {navItems.map(item => (
              <button
                key={item.id}
                className={`nav-item ${currentPage === item.id ? 'active' : ''}`}
                onClick={() => onNavigate(item.id)}
              >
                <span className="nav-icon">{item.icon}</span>
                <span className="nav-label">{item.label}</span>
              </button>
            ))}
          </nav>

          {/* 用户操作 */}
          <div className="user-actions">
            {user ? (
              <div className="user-menu" ref={userMenuRef}>
                <button 
                  className="user-avatar-btn"
                  onClick={() => setShowUserMenu(!showUserMenu)}
                >
                  <div className="user-avatar">
                    {user.name?.charAt(0)?.toUpperCase() || 'U'}
                  </div>
                  <span className="user-name">{user.name}</span>
                  <span className="dropdown-arrow">▼</span>
                </button>
                
                {showUserMenu && (
                  <div className="user-dropdown">
                    <div className="user-info">
                      <div className="user-email">{user.email}</div>
                      {user.company && (
                        <div className="user-company">{user.company}</div>
                      )}
                    </div>
                    <div className="dropdown-divider"></div>
                    <button 
                      className="dropdown-item"
                      onClick={() => {
                        setShowUserMenu(false)
                        // TODO: 实现设置功能
                      }}
                    >
                      <span className="item-icon">⚙️</span>
                      <span>设置</span>
                    </button>
                    <button 
                      className="dropdown-item logout"
                      onClick={() => {
                        setShowUserMenu(false)
                        onLogout()
                      }}
                    >
                      <span className="item-icon">🚪</span>
                      <span>退出登录</span>
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <button 
                className="btn btn-primary"
                onClick={onShowLogin}
              >
                <span>👤</span>
                <span>登录/注册</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <style>{`
        .header {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          background: rgba(255, 255, 255, 0.95);
          backdrop-filter: blur(10px);
          border-bottom: 1px solid #e2e8f0;
          z-index: 50;
          height: 80px;
        }

        .header-content {
          display: flex;
          align-items: center;
          justify-content: space-between;
          height: 80px;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .logo-icon {
          font-size: 2rem;
        }

        .logo-text {
          display: flex;
          flex-direction: column;
        }

        .logo-title {
          font-size: 1.25rem;
          font-weight: 700;
          color: #1a1a1a;
          line-height: 1.2;
        }

        .logo-subtitle {
          font-size: 0.75rem;
          color: #64748b;
          line-height: 1.2;
        }

        .main-nav {
          display: flex;
          align-items: center;
          gap: 0.5rem;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.75rem 1rem;
          border: none;
          background: transparent;
          border-radius: 8px;
          font-size: 0.875rem;
          font-weight: 500;
          color: #64748b;
          cursor: pointer;
          transition: all 0.2s ease;
          text-decoration: none;
        }

        .nav-item:hover {
          background: #f8fafc;
          color: #374151;
        }

        .nav-item.active {
          background: #eff6ff;
          color: #2563eb;
        }

        .nav-icon {
          font-size: 1rem;
        }

        .nav-label {
          white-space: nowrap;
        }

        .user-actions {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .user-menu {
          position: relative;
        }

        .user-avatar-btn {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.5rem 0.75rem;
          background: transparent;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s ease;
          font-size: 0.875rem;
        }

        .user-avatar-btn:hover {
          background: #f8fafc;
          border-color: #cbd5e1;
        }

        .user-avatar {
          width: 32px;
          height: 32px;
          background: #3b82f6;
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 0.875rem;
          font-weight: 600;
        }

        .user-name {
          font-weight: 500;
          color: #374151;
          white-space: nowrap;
        }

        .dropdown-arrow {
          font-size: 0.75rem;
          color: #6b7280;
          transition: transform 0.2s ease;
        }

        .user-dropdown {
          position: absolute;
          top: 100%;
          right: 0;
          margin-top: 0.5rem;
          background: white;
          border: 1px solid #e2e8f0;
          border-radius: 8px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          min-width: 200px;
          z-index: 1000;
          overflow: hidden;
        }

        .user-info {
          padding: 0.75rem;
          background: #f8fafc;
          border-bottom: 1px solid #e2e8f0;
        }

        .user-email {
          font-size: 0.875rem;
          color: #374151;
          font-weight: 500;
        }

        .user-company {
          font-size: 0.75rem;
          color: #6b7280;
          margin-top: 0.25rem;
        }

        .dropdown-divider {
          height: 1px;
          background: #e2e8f0;
        }

        .dropdown-item {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          width: 100%;
          padding: 0.75rem;
          background: transparent;
          border: none;
          cursor: pointer;
          font-size: 0.875rem;
          color: #374151;
          transition: background-color 0.2s ease;
          text-align: left;
        }

        .dropdown-item:hover {
          background: #f8fafc;
        }

        .dropdown-item.logout {
          color: #dc2626;
        }

        .dropdown-item.logout:hover {
          background: #fef2f2;
        }

        .item-icon {
          font-size: 1rem;
        }

        /* 响应式设计 */
        @media (max-width: 1024px) {
          .nav-label {
            display: none;
          }
          
          .nav-item {
            padding: 0.75rem;
          }
          
          .user-actions .btn span:last-child {
            display: none;
          }
          
          .user-name {
            display: none;
          }
          
          .user-dropdown {
            min-width: 180px;
          }
        }

        @media (max-width: 768px) {
          .header {
            height: 70px;
          }
          
          .header-content {
            height: 70px;
          }
          
          .logo-subtitle {
            display: none;
          }
          
          .main-nav {
            gap: 0.25rem;
          }
          
          .nav-item {
            padding: 0.5rem;
          }
          
          .user-actions {
            gap: 0.5rem;
          }
          
          .user-actions .btn {
            padding: 0.5rem;
          }
          
          .user-avatar-btn {
            padding: 0.5rem;
          }
          
          .user-dropdown {
            min-width: 160px;
          }
        }

        @media (max-width: 640px) {
          .logo-text {
            display: none;
          }
          
          .main-nav {
            display: none;
          }
        }
      `}</style>
    </header>
  )
}

export default Header
