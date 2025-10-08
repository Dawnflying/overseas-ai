# 🌍 AI-Powered Overseas E-commerce Platform

<div align="center">

![Platform Logo](https://img.shields.io/badge/AI-Powered%20Overseas%20E--commerce-blue?style=for-the-badge&logo=robot)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)
![React](https://img.shields.io/badge/React-18+-61DAFB?style=for-the-badge&logo=react)
![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=node.js)

**Empowering global e-commerce with AI intelligence**

[English](./README_EN.md) | [中文](./README.md)

</div>

---

## 📸 Screenshots

<div align="center">

### 🏠 Home Page
![Home](./assets/screenshots/home-hero.png)
*Intelligent overseas e-commerce platform homepage*

### 📊 AI Dashboard
![Dashboard](./assets/screenshots/dashboard-overview.png)
*Data-driven decision support system*

### 🎯 Planning Wizard
![Planning](./assets/screenshots/planning-wizard.png)
*AI-powered overseas planning assistant*

### 📈 Market Analysis
![Analysis](./assets/screenshots/market-analysis.png)
*Real-time market data analysis and insights*

</div>

---

## 🚀 Overview

The AI-Powered Overseas E-commerce Platform is a comprehensive solution designed to help businesses expand globally with intelligent automation and data-driven insights. Built with modern web technologies and powered by advanced AI, this platform provides everything needed for successful international e-commerce operations.

## ✨ Key Features

### 🤖 **AI-Powered Planning Wizard**
- Multi-agent AI system for comprehensive overseas planning
- Real-time market analysis and strategy recommendations
- Streaming AI responses with markdown rendering
- Export planning results as structured documents

### 📊 **Advanced Market Analysis**
- Target market identification and analysis
- Competitive landscape assessment
- Consumer behavior insights
- Market entry strategy recommendations

### 🛠️ **Comprehensive Tool Suite**
- Categorized overseas tools with detailed guides
- AI-powered Q&A for tool usage
- Multi-language support for global users
- Extensible search capabilities

### 🏪 **Seller Community Platform**
- Content publishing and management
- AI-powered content generation and moderation
- User interaction and engagement features
- Category-based organization

### 🎓 **Interactive Training System**
- 6 comprehensive training modules
- Progressive learning paths
- Interactive quizzes and assessments
- Progress tracking and completion certificates

### 📈 **Professional Dashboard**
- Multi-platform e-commerce management
- Beautiful sales trend charts with SVG rendering
- Platform distribution donut charts
- Customer service automation
- Marketing campaign management
- Analytics and reporting tools

## 🏗️ Architecture

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   Frontend      │    │   Backend       │    │   AI Services   │
│   (React)       │◄──►│   (Node.js)     │◄──►│   (DeepSeek)    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         ▼                       ▼                       ▼
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   UI Components │    │   API Gateway   │    │   LLM Agents    │
│   - Planning    │    │   - REST APIs   │    │   - Market      │
│   - Training    │    │   - MySQL       │    │   - Strategy    │
│   - Dashboard   │    │   - File Upload │    │   - Operations  │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 🛠️ Technology Stack

### Frontend
- **React 18** - Modern UI framework
- **Vite** - Fast build tool
- **SVG Charts** - Beautiful data visualization
- **CSS3** - Responsive design with animations

### Backend
- **Node.js + Express** - API server
- **MySQL** - Relational database
- **Sequelize** - ORM framework
- **Elasticsearch** - Vector search
- **Redis** - Caching service

### Middleware
- **MySQL 8.0** - Data storage
- **Elasticsearch 8.13.0** - Search engine with vector retrieval
- **Kibana 8.13.0** - Data visualization
- **Redis 7** - Cache and session management

### AI Integration
- **DeepSeek API** - Large Language Model
- **Multi-agent Architecture** - Specialized AI agents
- **Vector Search** - Semantic search capabilities

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Docker & Docker Compose
- Git

### Installation

1. **Clone the repository**
```bash
git clone https://github.com/Dawnflying/overseas-ai.git
cd overseas-ai
```

2. **Start middleware services**
```bash
cd middleware
./start.sh start
```

3. **Install dependencies**
```bash
# Backend
cd ../backend
npm install

# Frontend
cd ../frontend
npm install
```

4. **Configure environment**
```bash
# Copy and edit environment file
cp backend/.env.example backend/.env
# Edit with your API keys and database config
```

5. **Run database migrations**
```bash
cd backend
npm run db:migrate
npm run db:seed
```

6. **Start the application**
```bash
# Backend (Terminal 1)
cd backend
npm start

# Frontend (Terminal 2)
cd frontend
npm run dev
```

7. **Access the application**
- Frontend: http://localhost:5173
- Backend API: http://localhost:3000
- Kibana: http://localhost:5601

## 📁 Project Structure

```
overseas-ai/
├── frontend/              # Frontend application
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── Dockerfile
│   └── package.json
├── backend/               # Backend API server
│   ├── config/           # Configuration files
│   ├── models/           # Database models
│   ├── services/         # Business logic
│   ├── routes/           # API routes
│   ├── scripts/          # Utility scripts
│   ├── server.js
│   └── package.json
├── middleware/            # Middleware services
│   ├── docker-compose.yml
│   ├── start.sh
│   ├── mysql/
│   ├── elasticsearch/
│   ├── kibana/
│   └── redis/
├── docs/                  # Documentation
│   ├── setup/
│   ├── architecture/
│   ├── deployment/
│   └── middleware/
├── assets/                # Resource files
│   ├── screenshots/
│   ├── images/
│   └── videos/
└── docker-compose.yml     # Main docker compose
```

## 📚 Documentation

- [Setup Guide](./docs/setup/) - Environment setup
- [Architecture](./docs/architecture/) - System architecture
- [Deployment](./docs/deployment/) - Deployment guide
- [Middleware](./docs/middleware/) - Middleware documentation
- [API Documentation](./docs/api/) - API reference
- [Contributing](./CONTRIBUTING.md) - Contribution guidelines

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guidelines](./CONTRIBUTING.md).

### Development Workflow
1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **DeepSeek** for AI capabilities
- **React Community** for excellent tools
- **Open Source Contributors** for inspiration

## 📞 Support

- **Documentation**: [docs/](./docs/)
- **Issues**: [GitHub Issues](https://github.com/Dawnflying/overseas-ai/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Dawnflying/overseas-ai/discussions)

---

Made with ❤️ by Overseas AI Team

