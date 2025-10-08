import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom'
import Header from './components/Header'
import HeroSection from './components/HeroSection'
import FeaturesSection from './components/FeaturesSection'
import AISidebar from './components/AISidebar'
import PlanningWizard from './components/PlanningWizard'
import MarketAnalysis from './components/MarketAnalysis'
import OverseasTools from './components/OverseasTools'
import Community from './components/Community'
import OverseasDashboard from './components/OverseasDashboard'
import OverseasTraining from './components/OverseasTraining'
import LoginModal from './components/LoginModal'
import LoginPage from './components/LoginPage'
import DashboardPage from './components/DashboardPage'
import Footer from './components/Footer'
import './App.css'

// 主应用组件，包含路由逻辑
function AppContent() {
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const navigate = useNavigate()
  const location = useLocation()

  // 检查登录状态
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = localStorage.getItem('authToken')
        const savedUser = localStorage.getItem('user')
        
        if (token && savedUser) {
          // 验证token是否有效
          const response = await fetch('http://localhost:3000/api/auth/verify', {
            method: 'GET',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
            },
          })
          
          if (response.ok) {
            const result = await response.json()
            if (result.success) {
              setUser(JSON.parse(savedUser))
              setIsLoggedIn(true)
            } else {
              // token无效，清除本地存储
              localStorage.removeItem('authToken')
              localStorage.removeItem('user')
            }
          } else {
            // token无效，清除本地存储
            localStorage.removeItem('authToken')
            localStorage.removeItem('user')
          }
        }
      } catch (error) {
        console.error('检查登录状态失败:', error)
        // 清除可能无效的本地存储
        localStorage.removeItem('authToken')
        localStorage.removeItem('user')
      } finally {
        setIsLoading(false)
      }
    }

    checkAuthStatus()
  }, [])

  const handleNavigation = (page) => {
    // 检查是否需要登录
    if (page === 'dashboard' && !isLoggedIn) {
      navigate('/login')
      return
    }
    
    // 使用路由导航
    switch (page) {
      case 'dashboard':
        navigate('/dashboard')
        break
      case 'plan':
        navigate('/plan')
        setIsAIAssistantOpen(true)
        break
      case 'market':
        navigate('/market')
        break
      case 'tools':
        navigate('/tools')
        break
      case 'community':
        navigate('/community')
        break
      case 'training':
        navigate('/training')
        break
      default:
        navigate('/')
    }
  }

  const handleLogin = (userData) => {
    setUser(userData)
    setIsLoggedIn(true)
    navigate('/dashboard')
    setShowLoginModal(false)
  }

  const handleLogout = async () => {
    try {
      const token = localStorage.getItem('authToken')
      if (token) {
        // 调用后端登出API
        await fetch('http://localhost:3000/api/auth/logout', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
          },
        })
      }
    } catch (error) {
      console.error('登出API调用失败:', error)
    } finally {
      // 清除本地存储
      localStorage.removeItem('authToken')
      localStorage.removeItem('user')
      
      // 更新状态
      setUser(null)
      setIsLoggedIn(false)
      navigate('/')
    }
  }

  const handleBackFromLogin = () => {
    navigate('/')
  }

  const handleShowLogin = () => {
    navigate('/login')
  }

  const toggleAIAssistant = () => {
    setIsAIAssistantOpen(!isAIAssistantOpen)
  }

  // 获取当前路径
  const currentPath = location.pathname

  // 显示加载状态
  if (isLoading) {
    return (
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
        fontSize: '18px',
        color: '#666'
      }}>
        正在检查登录状态...
      </div>
    )
  }

  return (
    <div className="app">
      {/* 只在非出海控制台页面显示原导航栏 */}
      {currentPath !== '/dashboard' && (
        <Header 
          currentPage={currentPath === '/' ? 'home' : currentPath.substring(1)} 
          onNavigate={handleNavigation}
          user={user}
          onLogout={handleLogout}
          onShowLogin={handleShowLogin}
        />
      )}
    
      <main className={`main-content ${currentPath === '/dashboard' ? 'dashboard-mode' : ''}`}>
        <Routes>
          <Route path="/" element={
            <>
              <HeroSection 
                onStartPlanning={() => handleNavigation('plan')}
                onStartTraining={() => handleNavigation('training')}
              />
              <FeaturesSection />
            </>
          } />
          <Route path="/plan" element={<PlanningWizard />} />
          <Route path="/market" element={<MarketAnalysis />} />
          <Route path="/tools" element={<OverseasTools />} />
          <Route path="/community" element={<Community />} />
          <Route path="/training" element={<OverseasTraining />} />
          <Route 
            path="/dashboard" 
            element={
              isLoggedIn ? (
                <DashboardPage user={user} onLogout={handleLogout} />
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />
          <Route path="/login" element={
            <LoginPage
              onLogin={handleLogin}
              onBack={handleBackFromLogin}
            />
          } />
        </Routes>
      </main>

      <Footer />

      {/* AI助手侧边栏 */}
      <AISidebar 
        isOpen={isAIAssistantOpen}
        onClose={() => setIsAIAssistantOpen(false)}
      />

      {/* AI助手悬浮按钮 */}
      {!isAIAssistantOpen && (
        <button 
          className="ai-toggle-btn"
          onClick={toggleAIAssistant}
        >
          <span className="ai-toggle-icon">🤖</span>
        </button>
      )}
      
      {/* 登录模态框 */}
      {showLoginModal && (
        <LoginModal
          isOpen={showLoginModal}
          onClose={() => setShowLoginModal(false)}
          onLogin={handleLogin}
        />
      )}
    </div>
  )
}

// 主App组件，包装Router
function App() {
  return (
    <Router>
      <AppContent />
    </Router>
  )
}

export default App
