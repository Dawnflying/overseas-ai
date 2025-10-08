import React from 'react'

const FeaturesSection = () => {
  const features = [
    {
      icon: '🤖',
      title: 'AI智能规划',
      description: '基于深度学习的AI算法，为您量身定制出海战略规划',
      details: ['市场分析', '产品定位', '渠道选择', '风险评估']
    },
    {
      icon: '📊',
      title: '数据洞察',
      description: '实时市场数据监控，提供精准的决策支持',
      details: ['竞品分析', '趋势预测', '用户画像', '价格策略']
    },
    {
      icon: '🌏',
      title: '全球覆盖',
      description: '支持50+国家和地区，覆盖主流电商平台',
      details: ['亚马逊', 'Shopify', '速卖通', 'Lazada']
    },
    {
      icon: '⚡',
      title: '快速部署',
      description: '一站式解决方案，快速启动您的出海业务',
      details: ['店铺搭建', '物流方案', '支付集成', '客服系统']
    },
    {
      icon: '🛡️',
      title: '风险控制',
      description: '全方位的风险预警和合规指导',
      details: ['税务合规', '法律风险', '汇率波动', '供应链风险']
    },
    {
      icon: '📈',
      title: '持续优化',
      description: '基于运营数据的持续优化建议',
      details: ['广告优化', '库存管理', '客户留存', '复购提升']
    }
  ]

  return (
    <section className="features-section">
      <div className="container">
        <div className="section-header">
          <h2 className="section-title">核心功能</h2>
          <p className="section-description">
            从市场分析到运营优化，我们提供全方位的跨境电商出海解决方案
          </p>
        </div>

        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
              <div className="feature-details">
                {feature.details.map((detail, idx) => (
                  <span key={idx} className="feature-tag">
                    {detail}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* 技术优势 */}
        <div className="tech-advantages">
          <div className="tech-card">
            <div className="tech-icon">🔬</div>
            <div className="tech-content">
              <h4>先进技术架构</h4>
              <p>基于React + Node.js的现代化技术栈，确保系统稳定性和扩展性</p>
            </div>
          </div>
          <div className="tech-card">
            <div className="tech-icon">🔒</div>
            <div className="tech-content">
              <h4>数据安全保障</h4>
              <p>端到端加密传输，严格的数据隐私保护机制</p>
            </div>
          </div>
          <div className="tech-card">
            <div className="tech-icon">🚀</div>
            <div className="tech-content">
              <h4>高性能处理</h4>
              <p>支持海量数据处理，毫秒级响应速度</p>
            </div>
          </div>
        </div>
      </div>

      <style>{`
        .features-section {
          padding: 4rem 0;
          background: white;
        }

        .section-header {
          text-align: center;
          margin-bottom: 4rem;
        }

        .section-title {
          font-size: 2.5rem;
          font-weight: 700;
          color: #1a1a1a;
          margin-bottom: 1rem;
        }

        .section-description {
          font-size: 1.125rem;
          color: #64748b;
          max-width: 600px;
          margin: 0 auto;
          line-height: 1.6;
        }

        .features-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(350px, 1fr));
          gap: 2rem;
          margin-bottom: 4rem;
        }

        .feature-card {
          background: white;
          padding: 2rem;
          border-radius: 16px;
          border: 1px solid #e2e8f0;
          box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
          transition: all 0.3s ease;
          position: relative;
          overflow: hidden;
        }

        .feature-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(135deg, #2563eb, #10b981);
          transform: scaleX(0);
          transition: transform 0.3s ease;
        }

        .feature-card:hover {
          transform: translateY(-4px);
          box-shadow: 0 10px 25px rgba(0, 0, 0, 0.15);
        }

        .feature-card:hover::before {
          transform: scaleX(1);
        }

        .feature-icon {
          font-size: 3rem;
          margin-bottom: 1rem;
        }

        .feature-title {
          font-size: 1.25rem;
          font-weight: 600;
          color: #1a1a1a;
          margin-bottom: 0.75rem;
        }

        .feature-description {
          color: #64748b;
          line-height: 1.6;
          margin-bottom: 1.5rem;
        }

        .feature-details {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
        }

        .feature-tag {
          background: #f8fafc;
          color: #374151;
          padding: 0.375rem 0.75rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 500;
          border: 1px solid #e2e8f0;
        }

        .tech-advantages {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          gap: 2rem;
          background: #f8fafc;
          padding: 3rem;
          border-radius: 16px;
          border: 1px solid #e2e8f0;
        }

        .tech-card {
          display: flex;
          align-items: flex-start;
          gap: 1rem;
        }

        .tech-icon {
          font-size: 2rem;
          flex-shrink: 0;
        }

        .tech-content h4 {
          font-size: 1.125rem;
          font-weight: 600;
          color: #1a1a1a;
          margin-bottom: 0.5rem;
        }

        .tech-content p {
          color: #64748b;
          line-height: 1.6;
          margin: 0;
        }

        /* 响应式设计 */
        @media (max-width: 1024px) {
          .features-grid {
            grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
          }
        }

        @media (max-width: 768px) {
          .features-section {
            padding: 3rem 0;
          }

          .section-title {
            font-size: 2rem;
          }

          .section-description {
            font-size: 1rem;
          }

          .features-grid {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }

          .feature-card {
            padding: 1.5rem;
          }

          .tech-advantages {
            grid-template-columns: 1fr;
            padding: 2rem;
            gap: 1.5rem;
          }

          .tech-card {
            flex-direction: column;
            text-align: center;
          }
        }

        @media (max-width: 640px) {
          .section-title {
            font-size: 1.75rem;
          }

          .features-grid {
            grid-template-columns: 1fr;
          }

          .feature-card {
            padding: 1.25rem;
          }

          .tech-advantages {
            padding: 1.5rem;
          }
        }
      `}</style>
    </section>
  )
}

export default FeaturesSection
