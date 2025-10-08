# 🌍 AI-Powered Overseas E-commerce Platform | AI驱动的出海电商平台

<div align="center">

![Platform Logo](https://img.shields.io/badge/AI-Powered%20Overseas%20E--commerce-blue?style=for-the-badge&logo=robot)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)
![React](https://img.shields.io/badge/React-18+-61DAFB?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5+-3178C6?style=for-the-badge&logo=typescript)

**Empowering global e-commerce with AI intelligence | 用AI智能赋能全球电商出海**

[English](#english) | [中文](#中文)

</div>

---

## 📸 界面预览 | Screenshots

<div align="center">

### 🏠 首页 | Home Page
![首页](./assets/screenshots/home-hero.png)
*智能化的出海电商平台首页*

### 📊 智能仪表盘 | AI Dashboard
![仪表盘](./assets/screenshots/dashboard-overview.png)
*数据驱动的决策支持系统*

### 🎯 规划向导 | Planning Wizard
![规划向导](./assets/screenshots/planning-wizard.png)
*AI 驱动的出海规划助手*

### 📈 市场分析 | Market Analysis
![市场分析](./assets/screenshots/market-analysis.png)
*实时市场数据分析和洞察*

</div>

---

## English

### 🚀 Overview

The AI-Powered Overseas E-commerce Platform is a comprehensive solution designed to help businesses expand globally with intelligent automation and data-driven insights. Built with modern web technologies and powered by advanced AI, this platform provides everything needed for successful international e-commerce operations.

### ✨ Key Features

#### 🤖 **AI-Powered Planning Wizard**
- Multi-agent AI system for comprehensive overseas planning
- Real-time market analysis and strategy recommendations
- Streaming AI responses with markdown rendering
- Export planning results as structured documents

#### 📊 **Advanced Market Analysis**
- Target market identification and analysis
- Competitive landscape assessment
- Consumer behavior insights
- Market entry strategy recommendations

#### 🛠️ **Comprehensive Tool Suite**
- Categorized overseas tools with detailed guides
- AI-powered Q&A for tool usage
- Multi-language support for global users
- Extensible search capabilities

#### 🏪 **Seller Community Platform**
- Content publishing and management
- AI-powered content generation and moderation
- User interaction and engagement features
- Category-based organization

#### 🎓 **Interactive Training System**
- 6 comprehensive training modules
- Progressive learning paths
- Interactive quizzes and assessments
- Progress tracking and completion certificates

#### 📈 **Professional Dashboard**
- Multi-platform e-commerce management
- Customer service automation
- Marketing campaign management
- Analytics and reporting tools

### 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   AI Services   │
│   (React)       │◄──►│   (Node.js)     │◄──►│   (DeepSeek)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   UI Components │    │   API Gateway   │    │   LLM Agents    │
│   - Planning    │    │   - REST APIs   │    │   - Market      │
│   - Training    │    │   - WebSocket   │    │   - Strategy    │
│   - Dashboard   │    │   - File Upload │    │   - Operations  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### 🛠️ Technology Stack

#### Frontend
- **React 18** - Modern UI framework
- **Vite** - Fast build tool and dev server
- **React Markdown** - Rich content rendering
- **CSS3** - Responsive design with animations
- **JavaScript ES6+** - Modern JavaScript features

#### Backend
- **Node.js** - Runtime environment
- **Express.js** - Web application framework
- **CORS** - Cross-origin resource sharing
- **Helmet** - Security middleware
- **Morgan** - HTTP request logger
- **Multer** - File upload handling

#### AI Integration
- **DeepSeek API** - Large Language Model
- **Multi-agent Architecture** - Specialized AI agents
- **Streaming Responses** - Real-time AI output
- **Context-aware Processing** - Intelligent content generation

#### Development Tools
- **ESLint** - Code linting
- **Prettier** - Code formatting
- **Git** - Version control
- **Docker** - Containerization

### 🚀 Quick Start

#### Prerequisites
- Node.js 18+ 
- npm or yarn
- Git

#### Installation

1. **Clone the repository**
```bash
git clone https://github.com/your-username/overseas-ai.git
cd overseas-ai
```

2. **Install dependencies**
```bash
# Install frontend dependencies
npm install

# Install backend dependencies
cd backend
npm install
cd ..
```

3. **Environment Setup**
```bash
# Create environment file for backend
cp backend/.env.example backend/.env

# Edit the environment file with your API keys
# DEEPSEEK_API_KEY=your_deepseek_api_key_here
```

4. **Start the development servers**
```bash
# Start backend server (Terminal 1)
cd backend
npm start

# Start frontend server (Terminal 2)
npm run dev
```

5. **Access the application**
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000

### 📚 Usage Guide

#### 1. **Getting Started**
- Visit the homepage to explore available features
- Use the AI Planning Wizard for comprehensive overseas strategy
- Access training modules for step-by-step guidance

#### 2. **AI Planning Wizard**
- Click "开始出海规划" (Start Overseas Planning)
- Fill in your business information
- Watch as AI agents analyze and provide recommendations
- Export your personalized planning document

#### 3. **Market Analysis**
- Navigate to "市场分析" (Market Analysis)
- Select your target markets
- Review detailed market insights and recommendations

#### 4. **Training System**
- Access "出海培训" (Overseas Training)
- Complete modules progressively
- Take quizzes to test your knowledge
- Track your learning progress

#### 5. **Professional Dashboard**
- Login to access advanced features
- Manage multiple e-commerce platforms
- Configure AI customer service bots
- Monitor analytics and performance

### 🔧 Configuration

#### AI Services Configuration
```javascript
// backend/server.js
const DEEPSEEK_CONFIG = {
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: 'https://api.deepseek.com/v1',
  model: 'deepseek-chat',
  maxTokens: 4000,
  temperature: 0.7
};
```

#### Frontend Configuration
```javascript
// vite.config.js
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:3000'
    }
  }
});
```

### 📁 Project Structure

```
overseas-ai/
├── frontend/               # Frontend application
│   ├── src/
│   │   ├── components/     # React components
│   │   │   ├── PlanningWizard.jsx
│   │   │   ├── MarketAnalysis.jsx
│   │   │   ├── OverseasTools.jsx
│   │   │   ├── Community.jsx
│   │   │   ├── OverseasDashboard.jsx
│   │   │   ├── OverseasTraining.jsx
│   │   │   ├── CustomerServiceManager.jsx
│   │   │   └── ...
│   │   ├── App.jsx        # Main application
│   │   ├── main.jsx       # Application entry point
│   │   └── index.css      # Global styles
│   ├── public/            # Static assets
│   ├── package.json       # Frontend dependencies
│   ├── vite.config.js     # Vite configuration
│   ├── Dockerfile         # Frontend container
│   └── nginx.conf         # Frontend Nginx config
├── backend/               # Backend API server
│   ├── server.js          # Express server
│   ├── package.json       # Backend dependencies
│   └── Dockerfile         # Backend container
├── docker-compose.yml     # Multi-container setup
├── start-local.sh         # Local development script
├── restart-backend.sh     # Backend restart script
├── test-system.sh         # System testing script
├── deploy.sh              # Deployment script
├── README.md              # This file
├── LICENSE                # MIT License
├── CONTRIBUTING.md        # Contribution guidelines
└── .gitignore             # Git ignore rules
```

### 🌟 Features in Detail

#### AI Planning Wizard
- **Multi-Agent System**: Specialized AI agents for different aspects
- **Streaming Responses**: Real-time AI output with markdown rendering
- **Export Functionality**: Save planning results as markdown files
- **Context Awareness**: AI understands business context and requirements

#### Training System
- **6 Training Modules**: Comprehensive coverage of overseas e-commerce
- **Interactive Content**: Videos, guides, quizzes, and assessments
- **Progress Tracking**: Visual progress indicators and completion tracking
- **Adaptive Learning**: Personalized learning paths based on progress

#### Dashboard Features
- **Multi-Platform Integration**: Manage various e-commerce platforms
- **Customer Service Automation**: AI-powered customer support
- **Analytics & Reporting**: Comprehensive business insights
- **User Management**: Role-based access and permissions

### 🤝 Contributing

We welcome contributions from the community! Here's how you can help:

#### Ways to Contribute
1. **Bug Reports**: Report issues and bugs
2. **Feature Requests**: Suggest new features
3. **Code Contributions**: Submit pull requests
4. **Documentation**: Improve documentation
5. **Testing**: Help with testing and quality assurance

#### Development Guidelines
1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

#### Code Standards
- Follow ESLint configuration
- Use meaningful commit messages
- Add tests for new features
- Update documentation as needed

### 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

### 🙏 Acknowledgments

- **DeepSeek** for providing AI capabilities
- **React Community** for excellent documentation
- **Open Source Contributors** for inspiration and tools
- **E-commerce Experts** for domain knowledge

### 📞 Support

- **Documentation**: Check this README and code comments
- **Issues**: Use GitHub Issues for bug reports
- **Discussions**: Use GitHub Discussions for questions
- **Email**: Contact maintainers for urgent issues

---

## 中文

### 🚀 项目概述

AI驱动的出海电商平台是一个综合性解决方案，旨在通过智能自动化和数据驱动洞察帮助企业实现全球化扩张。该平台采用现代Web技术构建，由先进AI驱动，为成功的国际电商运营提供所需的一切功能。

### ✨ 核心功能

#### 🤖 **AI智能规划向导**
- 多智能体AI系统，提供全面的出海规划
- 实时市场分析和策略建议
- 流式AI响应与Markdown渲染
- 将规划结果导出为结构化文档

#### 📊 **高级市场分析**
- 目标市场识别和分析
- 竞争格局评估
- 消费者行为洞察
- 市场进入策略建议

#### 🛠️ **综合工具套件**
- 分类的出海工具及详细指南
- AI驱动的工具使用问答
- 全球用户的多语言支持
- 可扩展的搜索功能

#### 🏪 **卖家社区平台**
- 内容发布和管理
- AI驱动的内容生成和审核
- 用户互动和参与功能
- 基于分类的组织结构

#### 🎓 **交互式培训系统**
- 6个综合培训模块
- 渐进式学习路径
- 交互式测验和评估
- 进度跟踪和完成证书

#### 📈 **专业控制台**
- 多平台电商管理
- 客户服务自动化
- 营销活动管理
- 分析和报告工具

### 🏗️ 系统架构

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   前端界面      │    │   后端服务      │    │   AI服务        │
│   (React)       │◄──►│   (Node.js)     │◄──►│   (DeepSeek)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   UI组件库      │    │   API网关       │    │   大语言模型    │
│   - 规划向导    │    │   - REST API    │    │   - 市场分析    │
│   - 培训系统    │    │   - WebSocket   │    │   - 策略制定    │
│   - 控制台      │    │   - 文件上传    │    │   - 运营管理    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

### 🛠️ 技术栈

#### 前端技术
- **React 18** - 现代UI框架
- **Vite** - 快速构建工具和开发服务器
- **React Markdown** - 富文本内容渲染
- **CSS3** - 响应式设计和动画
- **JavaScript ES6+** - 现代JavaScript特性

#### 后端技术
- **Node.js** - 运行时环境
- **Express.js** - Web应用框架
- **CORS** - 跨域资源共享
- **Helmet** - 安全中间件
- **Morgan** - HTTP请求日志
- **Multer** - 文件上传处理

#### AI集成
- **DeepSeek API** - 大语言模型
- **多智能体架构** - 专业AI代理
- **流式响应** - 实时AI输出
- **上下文感知处理** - 智能内容生成

#### 开发工具
- **ESLint** - 代码检查
- **Prettier** - 代码格式化
- **Git** - 版本控制
- **Docker** - 容器化

### 🚀 快速开始

#### 环境要求
- Node.js 18+
- npm 或 yarn
- Git

#### 安装步骤

1. **克隆仓库**
```bash
git clone https://github.com/your-username/overseas-ai.git
cd overseas-ai
```

2. **安装依赖**
```bash
# 安装前端依赖
cd frontend
npm install
cd ..

# 安装后端依赖
cd backend
npm install
cd ..
```

3. **环境配置**
```bash
# 创建后端环境文件
cp backend/.env.example backend/.env

# 编辑环境文件，添加您的API密钥
# DEEPSEEK_API_KEY=your_deepseek_api_key_here
```

4. **启动开发服务器**
```bash
# 使用自动化脚本启动所有服务
./start-local.sh start

# 或者手动启动
# 启动后端服务器 (终端1)
cd backend
npm start

# 启动前端服务器 (终端2)
cd frontend
npm run dev
```

5. **访问应用**
- 前端界面: http://localhost:5173
- 后端API: http://localhost:3000

### 📚 使用指南

#### 1. **开始使用**
- 访问首页探索可用功能
- 使用AI规划向导获取全面的出海策略
- 访问培训模块获取分步指导

#### 2. **AI规划向导**
- 点击"开始出海规划"
- 填写您的业务信息
- 观看AI智能体分析和提供建议
- 导出您的个性化规划文档

#### 3. **市场分析**
- 导航至"市场分析"
- 选择您的目标市场
- 查看详细的市场洞察和建议

#### 4. **培训系统**
- 访问"出海培训"
- 逐步完成模块
- 参加测验测试您的知识
- 跟踪您的学习进度

#### 5. **专业控制台**
- 登录访问高级功能
- 管理多个电商平台
- 配置AI客服机器人
- 监控分析和性能

### 🔧 配置说明

#### AI服务配置
```javascript
// backend/server.js
const DEEPSEEK_CONFIG = {
  apiKey: process.env.DEEPSEEK_API_KEY,
  baseURL: 'https://api.deepseek.com/v1',
  model: 'deepseek-chat',
  maxTokens: 4000,
  temperature: 0.7
};
```

#### 前端配置
```javascript
// vite.config.js
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    proxy: {
      '/api': 'http://localhost:3000'
    }
  }
});
```

### 📁 项目结构

```
overseas-ai/
├── frontend/               # 前端应用
│   ├── src/
│   │   ├── components/     # React组件
│   │   │   ├── PlanningWizard.jsx
│   │   │   ├── MarketAnalysis.jsx
│   │   │   ├── OverseasTools.jsx
│   │   │   ├── Community.jsx
│   │   │   ├── OverseasDashboard.jsx
│   │   │   ├── OverseasTraining.jsx
│   │   │   ├── CustomerServiceManager.jsx
│   │   │   └── ...
│   │   ├── App.jsx        # 主应用
│   │   ├── main.jsx       # 应用入口
│   │   └── index.css      # 全局样式
│   ├── public/            # 静态资源
│   ├── package.json       # 前端依赖
│   ├── vite.config.js     # Vite配置
│   ├── Dockerfile         # 前端容器
│   └── nginx.conf         # 前端Nginx配置
├── backend/               # 后端API服务器
│   ├── server.js          # Express服务器
│   ├── package.json       # 后端依赖
│   └── Dockerfile         # 后端容器
├── docker-compose.yml     # 多容器设置
├── start-local.sh         # 本地开发脚本
├── restart-backend.sh     # 后端重启脚本
├── test-system.sh         # 系统测试脚本
├── deploy.sh              # 部署脚本
├── README.md              # 本文件
├── LICENSE                # MIT许可证
├── CONTRIBUTING.md        # 贡献指南
└── .gitignore             # Git忽略规则
```

### 🌟 功能详解

#### AI规划向导
- **多智能体系统**: 针对不同方面的专业AI代理
- **流式响应**: 实时AI输出与Markdown渲染
- **导出功能**: 将规划结果保存为Markdown文件
- **上下文感知**: AI理解业务上下文和需求

#### 培训系统
- **6个培训模块**: 全面覆盖出海电商
- **交互式内容**: 视频、指南、测验和评估
- **进度跟踪**: 可视化进度指示器和完成跟踪
- **自适应学习**: 基于进度的个性化学习路径

#### 控制台功能
- **多平台集成**: 管理各种电商平台
- **客户服务自动化**: AI驱动的客户支持
- **分析与报告**: 全面的业务洞察
- **用户管理**: 基于角色的访问和权限

### 🤝 贡献指南

我们欢迎社区贡献！以下是您可以提供帮助的方式：

#### 贡献方式
1. **错误报告**: 报告问题和错误
2. **功能请求**: 建议新功能
3. **代码贡献**: 提交拉取请求
4. **文档**: 改进文档
5. **测试**: 帮助测试和质量保证

#### 开发指南
1. Fork仓库
2. 创建功能分支 (`git checkout -b feature/amazing-feature`)
3. 提交更改 (`git commit -m 'Add amazing feature'`)
4. 推送到分支 (`git push origin feature/amazing-feature`)
5. 打开拉取请求

#### 代码标准
- 遵循ESLint配置
- 使用有意义的提交信息
- 为新功能添加测试
- 根据需要更新文档

### 📄 许可证

本项目采用MIT许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。

### 🙏 致谢

- **DeepSeek** 提供AI能力
- **React社区** 提供优秀文档
- **开源贡献者** 提供灵感和工具
- **电商专家** 提供领域知识

### 📞 支持

- **文档**: 查看本README和代码注释
- **问题**: 使用GitHub Issues报告错误
- **讨论**: 使用GitHub Discussions提问
- **邮箱**: 联系维护者处理紧急问题

---

<div align="center">

**⭐ 如果这个项目对您有帮助，请给我们一个星标！**

Made with ❤️ by the Overseas AI Team

</div>