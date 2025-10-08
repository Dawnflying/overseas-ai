# 更新日志

## [Unreleased] - 2025-10-08

### ✨ 新增功能

#### 📊 仪表板图表增强
- 添加美观的销售趋势折线图
  - SVG 绘制的平滑曲线
  - 渐变填充效果
  - 交互式数据点
  - 7天/30天/90天周期切换
- 添加平台分布环形图
  - 彩色环形图展示
  - 平台销售占比可视化
  - 详细的销售数据和趋势
  - 悬停交互效果

#### 🗄️ MySQL 数据库集成
- 集成阿里云 RDS MySQL
- 实现 Sequelize ORM 模型
  - 用户模型
  - 知识库模型
  - 对话记录模型
  - 消息记录模型
  - 工具使用记录模型
  - 文件上传记录模型
  - 系统配置模型
- 创建数据库迁移和种子脚本
- 实现完整的数据库服务层

#### 🔍 Elasticsearch 向量检索
- 构建支持向量检索的 Elasticsearch 镜像
- 集成中文分词插件（SmartCN）
- 支持多语言分词（日文、韩文等）
- 实现向量搜索服务类
- 配置 kNN 搜索参数优化

#### 🔧 中间件统一管理
- 创建 `middleware/` 目录统一管理所有中间件
- 集成服务：
  - MySQL 8.0
  - Elasticsearch 8.13.0
  - Kibana 8.13.0
  - Redis 7
- 提供统一的 docker-compose.yml 配置
- 创建管理脚本 `start.sh`

#### 📁 资源文件管理
- 创建 `assets/` 目录
  - images/ - 图片资源
  - screenshots/ - 界面截图
  - videos/ - 演示视频
  - docs/ - 文档附件
- README 中添加界面截图展示区

#### 📚 文档重组
- 创建 `docs/` 目录，按功能分类
  - setup/ - 环境搭建文档
  - architecture/ - 架构设计文档
  - deployment/ - 部署文档
  - middleware/ - 中间件文档
- 根目录只保留核心文档

### 🔧 优化改进

#### Docker 配置
- 修复所有 Dockerfile 的平台配置
- 统一使用 `--platform=linux/amd64`
- 创建 `.dockerignore` 文件优化构建
- 修复 esbuild 跨平台构建问题

#### 命令升级
- 所有脚本从 `docker-compose` 更新为 `docker compose` (V2)
- 优化构建脚本错误处理
- 添加详细的日志输出

#### 配置管理
- 添加阿里云 OSS 配置
  - Bucket: overseas-ai
  - 区域: cn-hangzhou
- 更新后端配置文件结构
- 分离数据库配置到独立文件

### 🗑️ 清理工作

#### 删除的文件/目录
- `/elasticsearch/` - 已迁移到 `middleware/build/elasticsearch/`
- `/kibana/` - 已迁移到 `middleware/build/kibana/`

#### 归档的文件
- `docker-compose.elasticsearch.yml` → `.archive/`
- `docker-compose.vector-search.yml` → `.archive/`

#### 移动的脚本
- `build-elasticsearch.sh` → `middleware/`
- `build-vector-search.sh` → `middleware/`

### 📦 依赖更新

#### 后端新增依赖
- `mysql2` ^3.6.5 - MySQL 客户端
- `sequelize` ^6.35.2 - ORM 框架
- `ali-oss` ^6.23.0 - 阿里云 OSS SDK

### 🐛 修复问题

1. **Dockerfile 构建失败**
   - 修复 Elasticsearch 插件安装命令
   - 使用正确的用户权限
   - 修复配置文件复制问题

2. **前端构建失败**
   - 修复 esbuild 平台不匹配问题
   - 优化 npm ci 命令
   - 添加 .dockerignore 排除 node_modules

3. **Docker Compose 平台警告**
   - 移除 FROM 指令中多余的空格
   - 统一平台配置格式

### 📝 文档更新

#### 新增文档
- `middleware/README.md` - 中间件完整使用指南
- `middleware/STRUCTURE.md` - 目录结构说明
- `MYSQL_INTEGRATION_GUIDE.md` - MySQL 集成指南
- `VECTOR_SEARCH_GUIDE.md` - 向量检索指南
- `ELASTICSEARCH_BUILD_GUIDE.md` - ES 构建指南
- `DOCKER_PLATFORM_GUIDE.md` - Docker 平台配置
- `MIDDLEWARE_MIGRATION_GUIDE.md` - 迁移指南
- `CLEANUP_SUMMARY.md` - 清理总结
- `DOCS_ORGANIZATION.md` - 文档整理说明
- `assets/README.md` - 资源文件说明
- `assets/screenshots/README.md` - 截图说明

#### 更新文档
- `README.md` - 添加界面截图展示区

## 统计数据

### 文件变更
- 新增文件: 30+
- 修改文件: 15+
- 删除文件: 5+
- 移动文件: 10+

### 代码行数
- 新增代码: ~3000 行
- 新增文档: ~5000 行
- 新增样式: ~300 行

### 功能模块
- 数据库模型: 7 个
- 服务类: 3 个
- 迁移脚本: 3 个
- 管理脚本: 3 个
- Docker 配置: 5 个

## 下一步计划

### 待完成
- [ ] 添加实际界面截图
- [ ] 测试数据库连接
- [ ] 完善向量搜索功能
- [ ] 添加单元测试
- [ ] 性能优化

### 计划中
- [ ] 添加更多图表类型
- [ ] 实现实时数据更新
- [ ] 添加导出功能
- [ ] 多语言支持优化

---

**版本**: 2.0.0 (重构版)  
**发布日期**: 2025-10-08  
**维护团队**: Overseas AI Team

