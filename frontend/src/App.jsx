import React, { useState, useEffect } from 'react'
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

function App() {
  const [currentPage, setCurrentPage] = useState('home')
  const [isAIAssistantOpen, setIsAIAssistantOpen] = useState(false)
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showLoginPage, setShowLoginPage] = useState(false)
  const [user, setUser] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

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
      setShowLoginPage(true)
      return
    }
    
    setCurrentPage(page)
    if (page === 'plan') {
      setIsAIAssistantOpen(true)
    }
  }

  const handleLogin = (userData) => {
    setUser(userData)
    setIsLoggedIn(true)
    setCurrentPage('dashboard')
    setShowLoginModal(false)
    setShowLoginPage(false)
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
      setCurrentPage('home')
    }
  }

  const handleBackFromLogin = () => {
    setShowLoginPage(false)
    setCurrentPage('home')
  }

  const handleShowLogin = () => {
    setShowLoginPage(true)
  }

  const toggleAIAssistant = () => {
    setIsAIAssistantOpen(!isAIAssistantOpen)
  }

  const renderMainContent = () => {
    switch (currentPage) {
      case 'plan':
        return <PlanningWizard />
      case 'market':
        return <MarketAnalysis />
      case 'tools':
        return <OverseasTools />
      case 'community':
        return <Community />
      case 'dashboard':
        return <DashboardPage user={user} onLogout={handleLogout} />
      case 'training':
        return <OverseasTraining />
      default:
        return (
          <>
            <HeroSection 
              onStartPlanning={() => handleNavigation('plan')}
              onStartTraining={() => handleNavigation('training')}
            />
            <FeaturesSection />
          </>
        )
    }
  }

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
        {currentPage !== 'dashboard' && (
          <Header 
            currentPage={currentPage} 
            onNavigate={handleNavigation}
            user={user}
            onLogout={handleLogout}
            onShowLogin={handleShowLogin}
          />
        )}
      
      <main className={`main-content ${currentPage === 'dashboard' ? 'dashboard-mode' : ''}`}>
        {renderMainContent()}
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

      {/* 登录页面 */}
      {showLoginPage && (
        <LoginPage
          onLogin={handleLogin}
          onBack={handleBackFromLogin}
        />
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

export default App
