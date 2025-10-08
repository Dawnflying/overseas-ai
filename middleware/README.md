# 出海AI平台 - 中间件服务

## 📦 包含的服务

本目录包含所有项目依赖的中间件服务配置：

- **MySQL 8.0** - 关系型数据库，存储业务数据
- **Elasticsearch 8.13.0** - 搜索引擎，支持向量检索和全文搜索
- **Kibana 8.13.0** - Elasticsearch 可视化管理界面
- **Redis 7** - 缓存服务，提高系统性能

## 🚀 快速开始

### 1. 启动所有服务

```bash
cd middleware
docker compose up -d
```

### 2. 启动特定服务

```bash
# 只启动 MySQL
docker compose up -d mysql

# 只启动 Elasticsearch 和 Kibana
docker compose up -d elasticsearch kibana

# 只启动 Redis
docker compose up -d redis
```

### 3. 查看服务状态

```bash
docker compose ps
```

### 4. 查看服务日志

```bash
# 查看所有服务日志
docker compose logs -f

# 查看特定服务日志
docker compose logs -f mysql
docker compose logs -f elasticsearch
docker compose logs -f kibana
docker compose logs -f redis
```

### 5. 停止服务

```bash
# 停止所有服务
docker compose down

# 停止并删除数据卷（谨慎使用！）
docker compose down -v
```

## 🔧 服务配置

### MySQL

- **端口**: 3306
- **数据库**: overseas-ai
- **用户**: overseas-ai
- **密码**: jarvis@888
- **Root密码**: jarvis@888
- **数据目录**: `./mysql/data`
- **配置文件**: `./mysql/config/my.cnf`
- **初始化脚本**: `./mysql/init/`

#### 连接字符串

```
mysql://overseas-ai:jarvis@888@localhost:3306/overseas-ai
```

#### 命令行连接

```bash
mysql -h 127.0.0.1 -P 3306 -u overseas-ai -p
# 密码: jarvis@888
```

### Elasticsearch

- **HTTP端口**: 9200
- **TCP端口**: 9300
- **集群名称**: overseas-ai-cluster
- **节点名称**: elasticsearch-master
- **数据目录**: `./elasticsearch/data`
- **配置文件**: `./elasticsearch/config/elasticsearch.yml`
- **日志目录**: `./elasticsearch/logs`

#### 访问地址

- REST API: http://localhost:9200
- 集群健康: http://localhost:9200/_cluster/health

#### 测试连接

```bash
curl http://localhost:9200
curl http://localhost:9200/_cluster/health?pretty
```

### Kibana

- **端口**: 5601
- **访问地址**: http://localhost:5601
- **配置文件**: `./kibana/config/kibana.yml`
- **语言**: 简体中文

#### 功能

- Elasticsearch 数据可视化
- 索引管理
- 查询分析
- 日志查看

### Redis

- **端口**: 6379
- **密码**: jarvis@888
- **数据目录**: `./redis/data`
- **配置文件**: `./redis/config/redis.conf`
- **最大内存**: 512MB
- **淘汰策略**: allkeys-lru

#### 连接字符串

```
redis://:jarvis@888@localhost:6379/0
```

#### 命令行连接

```bash
redis-cli -h 127.0.0.1 -p 6379 -a jarvis@888
```

## 📊 目录结构

```
middleware/
├── docker compose.yml          # Docker Compose 配置
├── README.md                   # 说明文档
├── mysql/
│   ├── config/
│   │   └── my.cnf             # MySQL 配置
│   ├── data/                  # MySQL 数据目录
│   └── init/
│       └── 01-init.sql        # 初始化脚本
├── elasticsearch/
│   ├── config/
│   │   └── elasticsearch.yml  # Elasticsearch 配置
│   ├── data/                  # Elasticsearch 数据目录
│   └── logs/                  # Elasticsearch 日志目录
├── kibana/
│   └── config/
│       └── kibana.yml         # Kibana 配置
└── redis/
    ├── config/
    │   └── redis.conf         # Redis 配置
    └── data/                  # Redis 数据目录
```

## 🔒 安全配置

### 开发环境（当前配置）

- MySQL: 使用简单密码，适合本地开发
- Elasticsearch: 禁用安全认证，方便开发调试
- Redis: 需要密码认证
- Kibana: 无需认证

### 生产环境建议

1. **修改所有默认密码**
2. **启用 Elasticsearch 安全认证**
3. **配置防火墙规则**
4. **使用 SSL/TLS 加密连接**
5. **定期备份数据**

## 💾 数据持久化

所有服务的数据都持久化到本地目录：

- MySQL: `./mysql/data`
- Elasticsearch: `./elasticsearch/data`
- Redis: `./redis/data`

**注意**: 这些目录会自动创建，首次启动需要等待初始化完成。

## 🔍 健康检查

所有服务都配置了健康检查：

```bash
# 检查服务健康状态
docker compose ps

# 查看详细健康信息
docker inspect overseas-ai-mysql | grep -A 10 Health
docker inspect overseas-ai-elasticsearch | grep -A 10 Health
docker inspect overseas-ai-redis | grep -A 10 Health
```

## 🐛 故障排除

### MySQL 无法启动

```bash
# 检查日志
docker compose logs mysql

# 检查数据目录权限
ls -la ./mysql/data

# 删除数据重新初始化（会丢失数据！）
rm -rf ./mysql/data
docker compose up -d mysql
```

### Elasticsearch 内存不足

```bash
# 调整 ES_JAVA_OPTS
# 编辑 docker compose.yml
- "ES_JAVA_OPTS=-Xms1g -Xmx1g"  # 减少内存
```

### Redis 连接被拒绝

```bash
# 测试连接
redis-cli -h 127.0.0.1 -p 6379 -a jarvis@888 ping

# 检查日志
docker compose logs redis
```

### Kibana 无法连接 Elasticsearch

```bash
# 确保 Elasticsearch 先启动
docker compose up -d elasticsearch
# 等待 Elasticsearch 健康
docker compose logs -f elasticsearch
# 再启动 Kibana
docker compose up -d kibana
```

## 📈 性能监控

### MySQL 性能

```sql
-- 连接 MySQL
SHOW PROCESSLIST;
SHOW STATUS LIKE 'Threads_connected';
SHOW VARIABLES LIKE 'max_connections';
```

### Elasticsearch 性能

```bash
# 集群状态
curl http://localhost:9200/_cluster/stats?pretty

# 节点状态
curl http://localhost:9200/_nodes/stats?pretty

# 索引状态
curl http://localhost:9200/_cat/indices?v
```

### Redis 性能

```bash
redis-cli -h 127.0.0.1 -p 6379 -a jarvis@888 INFO
redis-cli -h 127.0.0.1 -p 6379 -a jarvis@888 INFO stats
```

## 🔄 备份和恢复

### MySQL 备份

```bash
# 备份数据库
docker exec overseas-ai-mysql mysqldump -u overseas-ai -pjarvis@888 overseas-ai > backup.sql

# 恢复数据库
docker exec -i overseas-ai-mysql mysql -u overseas-ai -pjarvis@888 overseas-ai < backup.sql
```

### Elasticsearch 备份

```bash
# 创建快照仓库
curl -X PUT "localhost:9200/_snapshot/my_backup" -H 'Content-Type: application/json' -d'
{
  "type": "fs",
  "settings": {
    "location": "/usr/share/elasticsearch/backup"
  }
}
'

# 创建快照
curl -X PUT "localhost:9200/_snapshot/my_backup/snapshot_1?wait_for_completion=true"
```

### Redis 备份

```bash
# 手动保存
redis-cli -h 127.0.0.1 -p 6379 -a jarvis@888 SAVE

# 复制 RDB 文件
cp ./redis/data/dump.rdb ./redis/data/dump.rdb.backup
```

## 🌐 网络配置

所有服务都在同一个 Docker 网络中：

- **网络名称**: overseas-ai-network
- **子网**: 172.25.0.0/16
- **驱动**: bridge

服务之间可以通过服务名相互访问：

- MySQL: `mysql:3306`
- Elasticsearch: `elasticsearch:9200`
- Redis: `redis:6379`

## 📝 更新配置

修改配置文件后需要重启服务：

```bash
# 重启单个服务
docker compose restart mysql
docker compose restart elasticsearch

# 重启所有服务
docker compose restart

# 重新加载配置（不中断服务）
docker compose up -d --force-recreate
```

## 🎯 与主应用集成

在主应用中使用这些服务：

### 后端配置 (backend/.env)

```env
# MySQL
MYSQL_HOST=localhost
MYSQL_PORT=3306
MYSQL_DATABASE=overseas-ai
MYSQL_USERNAME=overseas-ai
MYSQL_PASSWORD=jarvis@888

# Elasticsearch
ELASTICSEARCH_URL=http://localhost:9200

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=jarvis@888
```

### Docker Compose 服务依赖

在主 docker compose.yml 中：

```yaml
services:
  backend:
    depends_on:
      - mysql
      - elasticsearch
      - redis
    networks:
      - overseas-ai-network

networks:
  overseas-ai-network:
    external: true
```

## 📚 相关文档

- [MySQL 官方文档](https://dev.mysql.com/doc/)
- [Elasticsearch 官方文档](https://www.elastic.co/guide/en/elasticsearch/reference/current/index.html)
- [Redis 官方文档](https://redis.io/documentation)
- [向量搜索指南](../VECTOR_SEARCH_GUIDE.md)
- [MySQL 集成指南](../MYSQL_INTEGRATION_GUIDE.md)

## 🆘 获取帮助

如有问题，请：

1. 查看服务日志：`docker compose logs [service]`
2. 检查健康状态：`docker compose ps`
3. 查阅相关文档
4. 联系技术支持团队

