import React from 'react'

const Footer = () => {
  const currentYear = new Date().getFullYear()

  const footerLinks = {
    product: [
      { label: '出海规划', href: '#plan' },
      { label: '市场分析', href: '#market' },
      { label: '出海工具', href: '#tools' },
      { label: '卖家社区', href: '#community' }
    ],
    resources: [
      { label: '帮助文档', href: '#docs' },
      { label: 'API文档', href: '#api' },
      { label: '使用教程', href: '#tutorials' },
      { label: '常见问题', href: '#faq' }
    ],
    company: [
      { label: '关于我们', href: '#about' },
      { label: '联系我们', href: '#contact' },
      { label: '服务条款', href: '#terms' },
      { label: '隐私政策', href: '#privacy' }
    ]
  }

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-content">
          {/* 品牌信息 */}
          <div className="footer-brand">
            <div className="logo">
              <div className="logo-icon">🚀</div>
              <div className="logo-text">
                <span className="logo-title">AI出海平台</span>
                <span className="logo-subtitle">跨境电商智能助手</span>
              </div>
            </div>
            <p className="brand-description">
              让AI为您的跨境电商出海之旅保驾护航，提供从市场分析到运营优化的全链路智能解决方案。
            </p>
            <div className="social-links">
              <a href="#" className="social-link">📘</a>
              <a href="#" className="social-link">🐦</a>
              <a href="#" className="social-link">📷</a>
              <a href="#" className="social-link">💼</a>
            </div>
          </div>

          {/* 产品链接 */}
          <div className="footer-links">
            <div className="link-group">
              <h4>产品功能</h4>
              <ul>
                {footerLinks.product.map((link, index) => (
                  <li key={index}>
                    <a href={link.href}>{link.label}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="link-group">
              <h4>资源中心</h4>
              <ul>
                {footerLinks.resources.map((link, index) => (
                  <li key={index}>
                    <a href={link.href}>{link.label}</a>
                  </li>
                ))}
              </ul>
            </div>

            <div className="link-group">
              <h4>关于我们</h4>
              <ul>
                {footerLinks.company.map((link, index) => (
                  <li key={index}>
                    <a href={link.href}>{link.label}</a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        {/* 底部版权 */}
        <div className="footer-bottom">
          <div className="copyright">
            © {currentYear} AI出海平台. 保留所有权利.
          </div>
          <div className="footer-extra">
            <span>Made with ❤️ for global e-commerce</span>
          </div>
        </div>
      </div>

      <style>{`
        .footer {
          background: #1a1a1a;
          color: white;
          padding: 3rem 0 1rem;
          margin-top: auto;
        }

        .footer-content {
          display: grid;
          grid-template-columns: 1fr 2fr;
          gap: 3rem;
          margin-bottom: 2rem;
        }

        .footer-brand {
          max-width: 400px;
        }

        .logo {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1rem;
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
          color: white;
          line-height: 1.2;
        }

        .logo-subtitle {
          font-size: 0.75rem;
          color: #94a3b8;
          line-height: 1.2;
        }

        .brand-description {
          color: #94a3b8;
          line-height: 1.6;
          margin-bottom: 1.5rem;
        }

        .social-links {
          display: flex;
          gap: 1rem;
        }

        .social-link {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          font-size: 1.25rem;
          transition: all 0.2s ease;
        }

        .social-link:hover {
          background: rgba(255, 255, 255, 0.2);
          transform: translateY(-2px);
        }

        .footer-links {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 2rem;
        }

        .link-group h4 {
          font-size: 1rem;
          font-weight: 600;
          margin-bottom: 1rem;
          color: white;
        }

        .link-group ul {
          list-style: none;
          padding: 0;
          margin: 0;
        }

        .link-group li {
          margin-bottom: 0.5rem;
        }

        .link-group a {
          color: #94a3b8;
          text-decoration: none;
          transition: color 0.2s ease;
          font-size: 0.875rem;
        }

        .link-group a:hover {
          color: white;
        }

        .footer-bottom {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 2rem;
          border-top: 1px solid rgba(255, 255, 255, 0.1);
        }

        .copyright {
          color: #94a3b8;
          font-size: 0.875rem;
        }

        .footer-extra {
          color: #64748b;
          font-size: 0.75rem;
        }

        /* 响应式设计 */
        @media (max-width: 1024px) {
          .footer-content {
            grid-template-columns: 1fr;
            gap: 2rem;
          }

          .footer-links {
            grid-template-columns: repeat(2, 1fr);
          }
        }

        @media (max-width: 768px) {
          .footer {
            padding: 2rem 0 1rem;
          }

          .footer-content {
            gap: 1.5rem;
          }

          .footer-links {
            grid-template-columns: 1fr;
            gap: 1.5rem;
          }

          .footer-bottom {
            flex-direction: column;
            gap: 1rem;
            text-align: center;
          }

          .social-links {
            justify-content: center;
          }
        }

        @media (max-width: 640px) {
          .footer {
            padding: 1.5rem 0 1rem;
          }

          .logo {
            justify-content: center;
            text-align: center;
          }

          .brand-description {
            text-align: center;
          }
        }
      `}</style>
    </footer>
  )
}

export default Footer
