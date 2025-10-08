# 中间件目录结构说明

## 📁 完整目录结构

```
middleware/
├── docker-compose.yml              # 统一的 Docker Compose 配置
├── start.sh                        # 中间件管理脚本（使用 docker compose V2）
├── README.md                       # 详细使用文档
├── STRUCTURE.md                    # 本文件 - 目录结构说明
├── .gitignore                      # Git 忽略规则
│
├── build/                          # 🏗️ 镜像构建目录
│   ├── README.md                   # 构建说明文档
│   │
│   ├── elasticsearch/              # Elasticsearch 镜像构建
│   │   ├── Dockerfile              # ES Dockerfile（包含插件）
│   │   ├── elasticsearch.yml       # ES 配置文件
│   │   └── custom/                 # 自定义配置和模板
│   │       └── vector-search-templates.json
│   │
│   └── kibana/                     # Kibana 镜像构建
│       └── Dockerfile              # Kibana Dockerfile
│
├── build-elasticsearch.sh          # 🔧 Elasticsearch 构建脚本
├── build-vector-search.sh          # 🔧 向量搜索构建脚本（ES + Kibana）
│
├── mysql/                          # 💾 MySQL 数据库
│   ├── config/
│   │   └── my.cnf                  # MySQL 配置文件
│   ├── init/
│   │   └── 01-init.sql             # 数据库初始化脚本
│   └── data/                       # 数据目录（Git 忽略）
│       └── .gitkeep
│
├── elasticsearch/                   # 🔍 Elasticsearch 运行时
│   ├── config/
│   │   └── elasticsearch.yml       # ES 运行时配置
│   ├── data/                       # 数据目录（Git 忽略）
│   │   └── .gitkeep
│   └── logs/                       # 日志目录（Git 忽略）
│       └── .gitkeep
│
├── kibana/                         # 📊 Kibana 运行时
│   └── config/
│       └── kibana.yml              # Kibana 配置文件
│
└── redis/                          # 🚀 Redis 缓存
    ├── config/
    │   └── redis.conf              # Redis 配置文件
    └── data/                       # 数据目录（Git 忽略）
        └── .gitkeep
```

## 📝 目录说明

### 根目录文件

| 文件 | 说明 |
|------|------|
| `docker-compose.yml` | 定义所有中间件服务的配置 |
| `start.sh` | 统一的管理脚本，提供启动/停止/日志等功能 |
| `README.md` | 完整的使用文档和故障排除指南 |
| `.gitignore` | 忽略数据目录和日志文件 |

### build/ - 镜像构建目录

用于构建**自定义 Docker 镜像**的源文件：

- **elasticsearch/**: 包含 Elasticsearch Dockerfile 和插件配置
  - 用于构建支持向量检索和中文分词的自定义镜像
  - 包含 smartcn、icu、kuromoji、nori 等分词插件
  
- **kibana/**: 包含 Kibana Dockerfile
  - 用于构建配置了健康检查的 Kibana 镜像

### 运行时配置目录

每个服务都有独立的运行时目录：

#### mysql/
- **config/**: MySQL 配置文件（字符集、缓冲区、日志等）
- **init/**: 数据库初始化 SQL 脚本
- **data/**: MySQL 数据文件（不提交到 Git）

#### elasticsearch/
- **config/**: Elasticsearch 运行时配置
- **data/**: 索引数据（不提交到 Git）
- **logs/**: 日志文件（不提交到 Git）

#### kibana/
- **config/**: Kibana 配置文件

#### redis/
- **config/**: Redis 配置文件
- **data/**: Redis 持久化数据（不提交到 Git）

## 🔄 区分：构建 vs 运行时

### 构建时（build/）
```bash
# 用于构建自定义镜像
cd middleware
./build-elasticsearch.sh      # 构建并推送到镜像仓库
```

### 运行时（各服务目录）
```bash
# 用于运行服务
cd middleware
./start.sh start               # 启动服务（使用配置文件）
```

## 🎯 工作流程

### 1. 首次设置

```bash
# 1. 如果需要自定义镜像，先构建
cd middleware
./build-vector-search.sh

# 2. 启动服务
./start.sh start

# 3. 验证服务
./start.sh health
```

### 2. 日常使用

```bash
# 启动服务
./start.sh start

# 查看状态
./start.sh status

# 查看日志
./start.sh logs mysql

# 停止服务
./start.sh stop
```

### 3. 修改配置

```bash
# 1. 修改配置文件
vim mysql/config/my.cnf

# 2. 重启服务
./start.sh restart
```

## 📦 数据持久化

所有数据都持久化到本地目录：

| 服务 | 数据路径 | 说明 |
|------|---------|------|
| MySQL | `mysql/data/` | 数据库文件 |
| Elasticsearch | `elasticsearch/data/` | 索引数据 |
| Elasticsearch | `elasticsearch/logs/` | 日志文件 |
| Redis | `redis/data/` | RDB 和 AOF 文件 |

**注意**: 这些目录被 `.gitignore` 忽略，不会提交到版本控制。

## 🔧 配置文件位置

### 服务配置

| 服务 | 配置文件 | 用途 |
|------|---------|------|
| MySQL | `mysql/config/my.cnf` | MySQL 服务器配置 |
| MySQL | `mysql/init/01-init.sql` | 数据库初始化 |
| Elasticsearch | `elasticsearch/config/elasticsearch.yml` | ES 服务配置 |
| Kibana | `kibana/config/kibana.yml` | Kibana 配置 |
| Redis | `redis/config/redis.conf` | Redis 配置 |

### 镜像构建配置

| 服务 | 配置文件 | 用途 |
|------|---------|------|
| Elasticsearch | `build/elasticsearch/Dockerfile` | 镜像构建 |
| Elasticsearch | `build/elasticsearch/elasticsearch.yml` | 构建时配置 |
| Kibana | `build/kibana/Dockerfile` | 镜像构建 |

## 🌐 网络和端口

### 对外暴露端口

| 服务 | 端口 | 说明 |
|------|------|------|
| MySQL | 3306 | 数据库连接 |
| Elasticsearch | 9200 | HTTP API |
| Elasticsearch | 9300 | 节点通信 |
| Kibana | 5601 | Web 界面 |
| Redis | 6379 | 缓存连接 |

### Docker 网络

- **网络名称**: `overseas-ai-network`
- **子网**: `172.25.0.0/16`
- **类型**: bridge

## 🔒 安全配置

### 默认凭据

| 服务 | 用户名 | 密码 | 数据库/说明 |
|------|--------|------|------------|
| MySQL | overseas-ai | jarvis@888 | overseas-ai |
| MySQL | root | jarvis@888 | - |
| Redis | - | jarvis@888 | - |
| Elasticsearch | - | - | 禁用认证（开发） |
| Kibana | - | - | 禁用认证（开发） |

**⚠️ 生产环境请修改默认密码！**

## 🚀 快速命令参考

```bash
# 管理服务
./start.sh start              # 启动所有服务
./start.sh start mysql        # 启动单个服务
./start.sh stop               # 停止所有服务
./start.sh restart            # 重启所有服务
./start.sh status             # 查看状态
./start.sh health             # 健康检查

# 查看日志
./start.sh logs               # 所有服务日志
./start.sh logs mysql         # 单个服务日志

# 构建镜像
./build-elasticsearch.sh      # 构建 ES 镜像
./build-vector-search.sh      # 构建 ES + Kibana 镜像

# 清理（危险操作）
./start.sh clean              # 删除所有数据
```

## 📚 相关文档

- [中间件使用文档](README.md) - 完整使用指南
- [镜像构建文档](build/README.md) - 构建自定义镜像
- [迁移指南](../MIDDLEWARE_MIGRATION_GUIDE.md) - 从旧配置迁移
- [MySQL 集成](../MYSQL_INTEGRATION_GUIDE.md) - MySQL 详细配置
- [向量搜索](../VECTOR_SEARCH_GUIDE.md) - Elasticsearch 向量检索

## ✅ 最佳实践

1. **数据备份**: 定期备份 `*/data/` 目录
2. **配置管理**: 将配置文件纳入版本控制
3. **环境隔离**: 开发/测试/生产使用不同配置
4. **日志监控**: 定期查看服务日志
5. **资源限制**: 根据需要调整 Docker 资源限制
6. **安全加固**: 生产环境启用认证和 SSL

## 🐛 故障排除

### 服务无法启动

```bash
# 查看详细日志
./start.sh logs [service]

# 检查端口占用
lsof -i :3306
lsof -i :9200
lsof -i :6379
```

### 数据丢失

数据目录位置：
- `mysql/data/`
- `elasticsearch/data/`
- `redis/data/`

确保这些目录有正确的读写权限。

### 配置不生效

```bash
# 重新加载配置
./start.sh restart

# 或强制重建
docker compose up -d --force-recreate
```

---

**文档版本**: 1.0.0  
**最后更新**: 2025-10-08  
**维护团队**: Overseas AI Team

