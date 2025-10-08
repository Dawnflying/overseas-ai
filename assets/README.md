# 项目资源文件

本目录用于存放项目相关的资源文件。

## 📁 目录结构

```
assets/
├── images/          # 图片资源（Logo、图标等）
├── screenshots/     # 界面截图
├── videos/          # 演示视频
└── docs/           # 文档附件（PDF、PPT等）
```

## 📸 screenshots/ - 界面截图

用于存放项目界面截图，供 README 和文档使用。

### 命名规范

```
{模块}-{功能}-{序号}.png
```

### 示例

```
screenshots/
├── home-hero.png              # 首页英雄区
├── dashboard-overview.png     # 仪表盘概览
├── planning-wizard.png        # 规划向导
├── market-analysis.png        # 市场分析
├── tools-list.png            # 工具列表
└── ai-chat.png               # AI 对话
```

### 使用方法

在 Markdown 文档中引用：

```markdown
![首页](./assets/screenshots/home-hero.png)
```

## 🖼️ images/ - 图片资源

用于存放 Logo、图标、插图等静态图片资源。

### 子目录

```
images/
├── logo/           # Logo 文件
├── icons/          # 图标文件
└── illustrations/  # 插图
```

## 🎬 videos/ - 演示视频

用于存放产品演示视频、功能介绍视频等。

### 建议格式

- MP4 格式（最佳兼容性）
- GIF 动图（小功能演示）
- WebM 格式（网页优化）

## 📄 docs/ - 文档附件

用于存放 PDF、PPT、Excel 等文档类附件。

### 使用场景

- 产品介绍 PPT
- API 文档 PDF
- 数据表格 Excel
- 设计稿

## 📝 使用建议

### 1. 文件大小

- 截图: 建议 < 500KB，使用压缩工具优化
- 图片: 建议 < 200KB
- 视频: 建议 < 10MB，或使用外链

### 2. 图片优化

推荐工具：
- [TinyPNG](https://tinypng.com/) - PNG/JPG 压缩
- [Squoosh](https://squoosh.app/) - 通用图片优化
- [SVGOMG](https://jakearchibald.github.io/svgomg/) - SVG 优化

### 3. Git 管理

```bash
# 添加资源文件
git add assets/screenshots/new-feature.png

# 提交
git commit -m "docs: 添加新功能截图"
```

### 4. 大文件处理

对于大型文件（>1MB），建议使用：
- Git LFS（Large File Storage）
- 云存储外链（阿里云 OSS、七牛云等）

## 🚫 .gitignore 规则

以下文件类型会被忽略：
- 临时文件: `*.tmp`, `*.bak`
- 原始文件: `*.psd`, `*.sketch`, `*.fig`
- 过大文件: 超过 10MB 的文件

## 📋 清单

### 必需的截图

- [ ] 首页截图
- [ ] 仪表盘截图
- [ ] 主要功能截图
- [ ] 移动端截图（如果有）

### 可选资源

- [ ] Logo 文件（SVG + PNG）
- [ ] 演示视频
- [ ] 产品介绍 PPT
- [ ] API 文档

## 🔗 相关文档

- [README.md](../README.md) - 项目主文档
- [CONTRIBUTING.md](../CONTRIBUTING.md) - 贡献指南
- [docs/](../docs/) - 技术文档目录

---

**注意**: 请勿上传敏感信息或受版权保护的内容。

