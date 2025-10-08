# 界面截图说明

## 📸 截图清单

本目录用于存放项目的界面截图，供 README 和文档展示使用。

### 必需截图

以下截图用于主 README 展示：

| 文件名 | 说明 | 尺寸建议 | 状态 |
|--------|------|---------|------|
| `home-hero.png` | 首页英雄区 | 1920x1080 | ⏳ 待添加 |
| `dashboard-overview.png` | 仪表盘概览 | 1920x1080 | ⏳ 待添加 |
| `planning-wizard.png` | 规划向导 | 1920x1080 | ⏳ 待添加 |
| `market-analysis.png` | 市场分析 | 1920x1080 | ⏳ 待添加 |

### 功能截图（可选）

| 功能模块 | 文件名 | 说明 |
|---------|--------|------|
| AI 对话 | `ai-chat.png` | AI 助手对话界面 |
| 知识库 | `knowledge-base.png` | 知识库管理 |
| 工具列表 | `tools-list.png` | 出海工具列表 |
| 社区 | `community.png` | 卖家社区 |
| 客服管理 | `customer-service.png` | 客服机器人配置 |
| 店铺管理 | `store-manager.png` | 多平台店铺管理 |

### 移动端截图

| 文件名 | 说明 | 尺寸建议 |
|--------|------|---------|
| `mobile-home.png` | 移动端首页 | 375x812 |
| `mobile-dashboard.png` | 移动端仪表盘 | 375x812 |

## 📐 截图规范

### 尺寸要求

- **桌面端**: 1920x1080 或 1440x900
- **移动端**: 375x812 (iPhone) 或 360x740 (Android)
- **平板端**: 1024x768 或 768x1024

### 格式要求

- **格式**: PNG (推荐) 或 JPG
- **大小**: < 500KB
- **优化**: 使用工具压缩后再上传

### 内容要求

- ✅ 清晰的界面展示
- ✅ 包含有意义的示例数据
- ✅ 移除敏感信息（账号、密码等）
- ✅ 使用真实或仿真数据
- ❌ 避免空白页面
- ❌ 避免模糊或失焦

## 🛠️ 截图工具推荐

### macOS
- **系统截图**: `Cmd + Shift + 4`
- **CleanShot X**: 专业截图工具
- **Xnapper**: 美化截图工具

### Windows
- **系统截图**: `Win + Shift + S`
- **Snipaste**: 功能强大的截图工具
- **ShareX**: 开源截图工具

### 浏览器插件
- **Awesome Screenshot**: 网页全屏截图
- **GoFullPage**: 完整页面截图

## 🎨 图片优化

### 在线工具
- [TinyPNG](https://tinypng.com/) - PNG/JPG 压缩
- [Squoosh](https://squoosh.app/) - 图片优化
- [Compressor.io](https://compressor.io/) - 在线压缩

### 命令行工具
```bash
# ImageMagick
convert input.png -quality 85 -resize 1920x1080 output.png

# pngquant
pngquant --quality=65-80 input.png -o output.png

# jpegoptim
jpegoptim --max=85 --strip-all input.jpg
```

## 📝 添加截图步骤

### 1. 截取界面
```bash
# 确保界面处于最佳状态
# 清除调试信息
# 使用真实或示例数据
```

### 2. 优化图片
```bash
# 调整大小
# 压缩文件
# 检查文件大小
```

### 3. 保存文件
```bash
# 使用规范的命名
# 保存到正确的目录
cp ~/screenshot.png ./assets/screenshots/feature-name.png
```

### 4. 更新文档
```markdown
![功能名称](./assets/screenshots/feature-name.png)
```

### 5. 提交 Git
```bash
git add assets/screenshots/feature-name.png
git commit -m "docs: 添加功能名称截图"
```

## 🔄 更新截图

当界面更新时，需要重新截图：

```bash
# 1. 删除旧截图
rm assets/screenshots/old-feature.png

# 2. 添加新截图
cp ~/new-screenshot.png assets/screenshots/feature-name.png

# 3. 提交更新
git add assets/screenshots/
git commit -m "docs: 更新界面截图"
```

## 📋 截图检查清单

拍摄截图前请确认：

- [ ] 界面完整无遮挡
- [ ] 数据真实有意义
- [ ] 无敏感信息
- [ ] 图片清晰
- [ ] 文件已优化
- [ ] 命名规范
- [ ] 大小合适（< 500KB）

## 🎯 最佳实践

1. **统一风格**: 所有截图使用相同的浏览器和分辨率
2. **数据真实**: 使用有代表性的示例数据
3. **定期更新**: 界面变更后及时更新截图
4. **文件管理**: 删除不再使用的旧截图
5. **版本控制**: 重大版本更新可保留历史截图

## 📌 占位截图

在截图未完成前，可以使用占位图片：

```markdown
![待添加](https://via.placeholder.com/1920x1080.png?text=Screenshot+Coming+Soon)
```

---

**提示**: 截图准备就绪后，请移除此 README 中的 ⏳ 标记，改为 ✅。

