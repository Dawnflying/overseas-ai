# 出海AI平台 Docker 部署指南

## 项目概述

出海AI平台是一个为跨境电商企业提供智能规划和市场分析的平台，包含前端静态网站和后端API服务。

## 系统架构

```
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   前端服务      │    │   后端API服务   │    │   反向代理      │
│   (Nginx)       │◄───┤   (Node.js)     │◄───┤   (Nginx)       │
│   Port: 80      │    │   Port: 3000    │    │   Port: 8080    │
└─────────────────┘    └─────────────────┘    └─────────────────┘
```

## 快速开始

### 前提条件

- Docker 20.10+
- Docker Compose 2.0+

### 一键部署

```bash
# 给部署脚本执行权限
chmod +x deploy.sh

# 完整部署（构建镜像 + 启动服务）
./deploy.sh deploy
```

### 分步部署

```bash
# 1. 构建镜像
./deploy.sh build

# 2. 启动服务
./deploy.sh start

# 3. 查看状态
./deploy.sh status
```

## 服务说明

### 前端服务 (Frontend)

- **镜像**: `overseas-ai-frontend:latest`
- **端口**: 80
- **技术栈**: HTML/CSS/JavaScript + Nginx
- **健康检查**: http://localhost/health

### 后端服务 (Backend)

- **镜像**: `overseas-ai-backend:latest`
- **端口**: 3000
- **技术栈**: Node.js + Express
- **健康检查**: http://localhost:3000/health

### API 接口

#### AI聊天接口
```http
POST /ai/chat
Content-Type: application/json

{
  "message": "我想了解出海规划",
  "conversationId": "optional"
}
```

#### 出海规划接口
```http
POST /api/planning
Content-Type: application/json

{
  "companyName": "示例公司",
  "industry": "electronics",
  "businessScale": "startup",
  "productTypes": ["consumer", "fashion"],
  "targetMarkets": ["southeastAsia", "europe"]
}
```

#### 市场分析接口
```http
GET /api/market-analysis?market=southeastAsia&industry=electronics
```

## 管理命令

### 查看服务状态
```bash
./deploy.sh status
```

### 查看日志
```bash
# 查看所有服务日志
./deploy.sh logs

# 查看特定服务日志
./deploy.sh logs frontend
./deploy.sh logs backend
```

### 重启服务
```bash
./deploy.sh restart
```

### 停止服务
```bash
./deploy.sh stop
```

### 清理资源
```bash
./deploy.sh cleanup
```

## 环境配置

### 后端环境变量

复制环境变量模板：
```bash
cp backend/.env.example backend/.env
```

编辑 `backend/.env` 文件：
```env
# 后端服务配置
PORT=3000
NODE_ENV=production

# 前端服务地址
FRONTEND_URL=http://localhost:80

# 安全配置
JWT_SECRET=your_jwt_secret_here

# 日志配置
LOG_LEVEL=info
```

### 自定义端口

如果需要修改默认端口，编辑 `docker-compose.yml`：

```yaml
services:
  frontend:
    ports:
      - "8080:80"  # 主机端口:容器端口
  
  backend:
    ports:
      - "3001:3000"  # 主机端口:容器端口
```

同时更新前端Nginx配置中的代理设置。

## 生产环境部署

### 1. 安全配置

```bash
# 生成强密码
openssl rand -base64 32

# 更新环境变量中的密钥
JWT_SECRET=生成的强密码
```

### 2. 使用HTTPS

配置SSL证书：
```yaml
# 在docker-compose.yml中添加
services:
  frontend:
    volumes:
      - ./ssl/cert.pem:/etc/ssl/certs/cert.pem
      - ./ssl/key.pem:/etc/ssl/private/key.pem
```

### 3. 数据库集成（可选）

添加数据库服务：
```yaml
services:
  database:
    image: postgres:15
    environment:
      POSTGRES_DB: overseas_ai
      POSTGRES_USER: user
      POSTGRES_PASSWORD: password
    volumes:
      - postgres_data:/var/lib/postgresql/data
    networks:
      - overseas-ai-network

volumes:
  postgres_data:
```

### 4. 监控和日志

启用日志收集：
```bash
# 查看容器资源使用
docker stats

# 导出日志
docker-compose logs > logs.txt
```

## 故障排除

### 常见问题

1. **端口被占用**
   ```bash
   # 检查端口占用
   lsof -i :80
   lsof -i :3000
   
   # 停止占用进程或修改端口
   ```

2. **镜像构建失败**
   ```bash
   # 清理缓存重新构建
   docker system prune
   ./deploy.sh build
   ```

3. **服务无法启动**
   ```bash
   # 查看详细日志
   ./deploy.sh logs
   
   # 检查Docker服务状态
   systemctl status docker
   ```

4. **健康检查失败**
   ```bash
   # 手动检查服务
   curl http://localhost/health
   curl http://localhost:3000/health
   ```

### 性能优化

1. **增加资源限制**
   ```yaml
   services:
     backend:
       deploy:
         resources:
           limits:
             memory: 512M
             cpus: '1.0'
   ```

2. **配置缓存**
   ```yaml
   services:
     frontend:
       environment:
         - NGINX_CACHE_ENABLED=true
   ```

## 开发模式

### 本地开发

```bash
# 后端开发
cd backend
npm install
npm run dev

# 前端开发
# 直接打开 index.html 或使用本地服务器
python3 -m http.server 8000
```

### 开发环境Docker

```yaml
# docker-compose.dev.yml
version: '3.8'
services:
  backend:
    build:
      context: ./backend
      dockerfile: Dockerfile.dev
    volumes:
      - ./backend:/app
      - /app/node_modules
    environment:
      - NODE_ENV=development
```

## 技术支持

如有问题，请检查：
1. Docker和Docker Compose版本
2. 系统资源是否充足
3. 防火墙和端口配置
4. 查看详细错误日志

## 版本信息

- 前端版本: 1.0.0
- 后端版本: 1.0.0
- 最后更新: 2024年
