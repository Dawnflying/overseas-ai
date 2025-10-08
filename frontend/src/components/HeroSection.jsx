import React from 'react'

const HeroSection = ({ onStartPlanning, onStartTraining }) => {
  return (
    <section className="hero-section">
      <div className="container">
        <div className="hero-content">
          {/* 左侧内容 */}
          <div className="hero-text">
            <h1 className="hero-title">
              让AI为您的
              <span className="gradient-text">跨境电商</span>
              出海之旅保驾护航
            </h1>
            <p className="hero-description">
              基于深度学习的AI助手，为您提供从市场分析、出海规划到运营优化的全链路智能解决方案。
              无论您是初创团队还是成熟企业，都能找到最适合的出海路径。
            </p>
            
            <div className="hero-actions">
              <button 
                className="btn btn-primary btn-large"
                onClick={onStartPlanning}
              >
                <span>🚀</span>
                <span>开始出海规划</span>
              </button>
              <button 
                className="btn btn-secondary btn-large"
                onClick={onStartTraining}
              >
                <span>🎓</span>
                <span>出海培训课程</span>
              </button>
            </div>

            {/* 统计数据 */}
            <div className="hero-stats">
              <div className="stat-item">
                <div className="stat-number">10,000+</div>
                <div className="stat-label">成功案例</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">95%</div>
                <div className="stat-label">用户满意度</div>
              </div>
              <div className="stat-item">
                <div className="stat-number">50+</div>
                <div className="stat-label">覆盖市场</div>
              </div>
            </div>
          </div>

          {/* 右侧插图 */}
          <div className="hero-visual">
            <div className="floating-cards">
              <div className="card card-1">
                <div className="card-icon">🌏</div>
                <div className="card-text">全球市场覆盖</div>
              </div>
              <div className="card card-2">
                <div className="card-icon">🤖</div>
                <div className="card-text">AI智能规划</div>
              </div>
              <div className="card card-3">
                <div className="card-icon">📈</div>
                <div className="card-text">数据驱动决策</div>
              </div>
              <div className="card card-4">
                <div className="card-icon">⚡</div>
                <div className="card-text">快速部署</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .hero-section {
          padding: 4rem 0;
          background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
          min-height: 600px;
          display: flex;
          align-items: center;
        }

        .hero-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 4rem;
          align-items: center;
        }

        .hero-text {
          max-width: 600px;
        }

        .hero-title {
          font-size: 3.5rem;
          font-weight: 700;
          line-height: 1.1;
          margin-bottom: 1.5rem;
          color: #1a1a1a;
        }

        .gradient-text {
          background: linear-gradient(135deg, #2563eb, #10b981);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }

        .hero-description {
          font-size: 1.25rem;
          line-height: 1.6;
          color: #64748b;
          margin-bottom: 2.5rem;
        }

        .hero-actions {
          display: flex;
          gap: 1rem;
          margin-bottom: 3rem;
        }

        .btn-large {
          padding: 1rem 2rem;
          font-size: 1rem;
        }

        .hero-stats {
          display: flex;
          gap: 3rem;
        }

        .stat-item {
          text-align: center;
        }

        .stat-number {
          font-size: 2rem;
          font-weight: 700;
          color: #2563eb;
          margin-bottom: 0.25rem;
        }

        .stat-label {
          font-size: 0.875rem;
          color: #64748b;
          font-weight: 500;
        }

        .hero-visual {
          position: relative;
          height: 400px;
        }

        .floating-cards {
          position: relative;
          width: 100%;
          height: 100%;
        }

        .card {
          position: absolute;
          background: white;
          padding: 1.5rem;
          border-radius: 16px;
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.1);
          border: 1px solid #e2e8f0;
          display: flex;
          align-items: center;
          gap: 1rem;
          animation: float 6s ease-in-out infinite;
        }

        .card-1 {
          top: 10%;
          left: 10%;
          animation-delay: 0s;
        }

        .card-2 {
          top: 30%;
          right: 10%;
          animation-delay: 1.5s;
        }

        .card-3 {
          bottom: 30%;
          left: 5%;
          animation-delay: 3s;
        }

        .card-4 {
          bottom: 10%;
          right: 15%;
          animation-delay: 4.5s;
        }

        .card-icon {
          font-size: 2rem;
        }

        .card-text {
          font-weight: 600;
          color: #1a1a1a;
          white-space: nowrap;
        }

        @keyframes float {
          0%, 100% {
            transform: translateY(0px);
          }
          50% {
            transform: translateY(-20px);
          }
        }

        /* 响应式设计 */
        @media (max-width: 1024px) {
          .hero-content {
            grid-template-columns: 1fr;
            gap: 3rem;
            text-align: center;
          }

          .hero-title {
            font-size: 2.5rem;
          }

          .hero-visual {
            height: 300px;
          }
        }

        @media (max-width: 768px) {
          .hero-section {
            padding: 3rem 0;
            min-height: auto;
          }

          .hero-title {
            font-size: 2rem;
          }

          .hero-description {
            font-size: 1.125rem;
          }

          .hero-actions {
            flex-direction: column;
            align-items: center;
          }

          .btn-large {
            width: 100%;
            max-width: 300px;
          }

          .hero-stats {
            justify-content: center;
            gap: 2rem;
          }

          .stat-number {
            font-size: 1.5rem;
          }

          .floating-cards {
            display: none;
          }
        }

        @media (max-width: 640px) {
          .hero-stats {
            flex-direction: column;
            gap: 1.5rem;
          }

          .hero-title {
            font-size: 1.75rem;
          }
        }
      `}</style>
    </section>
  )
}

export default HeroSection
