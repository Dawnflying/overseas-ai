# 环境变量配置说明

## 📝 概述

中间件服务支持通过环境变量配置敏感信息，避免硬编码到代码中。

## 🔧 配置方法

### 方法1: 使用 .env 文件（推荐）

在 `middleware/` 目录下创建 `.env` 文件：

```bash
cd middleware
cat > .env << 'EOF'
# MySQL 配置
MYSQL_ROOT_PASSWORD=your_secure_password
MYSQL_DATABASE=overseas-ai  
MYSQL_USER=dbuser
MYSQL_PASSWORD=your_db_password

# Redis 配置
REDIS_PASSWORD=your_redis_password
EOF
```

### 方法2: 导出环境变量

```bash
export MYSQL_ROOT_PASSWORD=your_secure_password
export MYSQL_PASSWORD=your_db_password
export REDIS_PASSWORD=your_redis_password
```

### 方法3: 在命令行中指定

```bash
MYSQL_ROOT_PASSWORD=xxx MYSQL_PASSWORD=xxx docker compose up -d
```

## 📋 完整配置项

### MySQL

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| `MYSQL_ROOT_PASSWORD` | Root用户密码 | rootpassword |
| `MYSQL_DATABASE` | 数据库名称 | overseas-ai |
| `MYSQL_USER` | 普通用户名 | dbuser |
| `MYSQL_PASSWORD` | 普通用户密码 | dbpassword |

### Redis

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| `REDIS_PASSWORD` | Redis密码 | redispassword |

### 其他可选配置

| 变量名 | 说明 | 默认值 |
|--------|------|--------|
| `ELASTICSEARCH_URL` | ES连接地址 | http://localhost:9200 |
| `MYSQL_PORT` | MySQL端口 | 3306 |
| `REDIS_PORT` | Redis端口 | 6379 |

## 🔒 安全建议

### 1. 密码强度

建议使用强密码：
- 至少12个字符
- 包含大小写字母、数字和特殊字符
- 不使用常见密码

### 2. 环境隔离

不同环境使用不同的密码：

```bash
# 开发环境
.env.development

# 测试环境
.env.testing

# 生产环境
.env.production
```

### 3. 密钥管理

- ⚠️ 绝对不要提交 `.env` 文件到 Git
- ✅ 使用密钥管理服务（如 AWS Secrets Manager）
- ✅ 定期轮换密码
- ✅ 最小权限原则

## 📚 使用示例

### 开发环境

创建 `.env` 文件：

```env
MYSQL_ROOT_PASSWORD=dev_root_pass
MYSQL_PASSWORD=dev_db_pass
REDIS_PASSWORD=dev_redis_pass
```

启动服务：

```bash
docker compose up -d
```

### 生产环境

使用系统环境变量：

```bash
# 在服务器上设置环境变量
export MYSQL_ROOT_PASSWORD=$(cat /secure/mysql_root_pass)
export MYSQL_PASSWORD=$(cat /secure/mysql_pass)
export REDIS_PASSWORD=$(cat /secure/redis_pass)

# 启动服务
docker compose -f docker-compose.prod.yml up -d
```

## 🔍 验证配置

### 检查环境变量

```bash
# 查看是否设置
echo $MYSQL_PASSWORD

# 在docker compose中验证
docker compose config | grep MYSQL_PASSWORD
```

### 测试连接

```bash
# MySQL
mysql -h 127.0.0.1 -P 3306 -u dbuser -p$MYSQL_PASSWORD

# Redis  
redis-cli -h 127.0.0.1 -p 6379 -a $REDIS_PASSWORD ping
```

## ⚠️ 常见问题

### 问题1: 环境变量未生效

**原因**: .env 文件位置错误或格式问题

**解决**:
```bash
# 确保 .env 在 middleware/ 目录下
ls -la middleware/.env

# 检查格式（不要有空格）
cat middleware/.env
```

### 问题2: 密码包含特殊字符

**解决**: 使用引号包裹

```env
MYSQL_PASSWORD="pass@word#123"
```

### 问题3: Docker Compose 读取不到

**解决**: 确保使用正确的语法

```yaml
environment:
  MYSQL_PASSWORD: ${MYSQL_PASSWORD:-default_value}
```

## 📖 相关文档

- [Docker Compose 环境变量](https://docs.docker.com/compose/environment-variables/)
- [中间件 README](./README.md)
- [安全最佳实践](../docs/security/)

---

**重要提示**: 
- 🔒 永远不要提交包含真实密码的文件到 Git
- 🔒 使用环境变量管理敏感信息
- 🔒 定期更新和轮换密码

