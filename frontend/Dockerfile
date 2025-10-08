# 前端Docker镜像 - 构建阶段
FROM --platform=linux/amd64 node:18-alpine AS builder

# 设置工作目录
WORKDIR /app

# 复制package文件
COPY package*.json ./

# 安装依赖（包含开发依赖，因为构建需要）
RUN npm ci

# 复制源代码（排除 node_modules）
COPY . .

# 构建应用
RUN npm run build

# 生产阶段
FROM --platform=linux/amd64 nginx:alpine

# 复制构建结果到nginx目录
COPY --from=builder /app/dist /usr/share/nginx/html

# 复制nginx配置文件
COPY nginx.conf /etc/nginx/nginx.conf

# 暴露端口
EXPOSE 80

# 启动nginx
CMD ["nginx", "-g", "daemon off;"]
