# 📸 截图占位说明

## ⏳ 待添加的截图

以下截图目前使用占位图片，需要实际截图替换：

### 主要截图

1. **home-hero.png** - 首页英雄区
   - 尺寸: 1920x1080
   - 内容: 展示平台首页的主视觉区域
   - 要点: 突出 AI 功能和出海主题

2. **dashboard-overview.png** - 仪表盘概览
   - 尺寸: 1920x1080
   - 内容: 展示数据仪表盘界面
   - 要点: 显示各类数据卡片和图表

3. **planning-wizard.png** - 规划向导
   - 尺寸: 1920x1080
   - 内容: AI 规划向导的使用界面
   - 要点: 展示 AI 对话和规划流程

4. **market-analysis.png** - 市场分析
   - 尺寸: 1920x1080
   - 内容: 市场分析功能界面
   - 要点: 展示数据分析和图表

### 截图步骤

#### 1. 准备环境
```bash
# 启动应用
cd /path/to/project
npm run dev
```

#### 2. 访问页面
- 首页: http://localhost:5173/
- 仪表盘: http://localhost:5173/dashboard
- 规划向导: http://localhost:5173/dashboard (规划向导标签)
- 市场分析: http://localhost:5173/dashboard (市场分析标签)

#### 3. 截图设置
- 浏览器: Chrome (推荐)
- 窗口大小: 1920x1080 全屏
- 缩放比例: 100%
- 开发者工具: 关闭

#### 4. 截图内容
- 使用有意义的示例数据
- 确保界面完整
- 移除任何调试信息
- 检查无敏感信息

#### 5. 图片优化
```bash
# 使用 TinyPNG 压缩
# 或使用命令行工具
pngquant --quality=65-80 input.png -o output.png
```

#### 6. 保存截图
```bash
# 保存到当前目录
cp ~/Downloads/screenshot.png ./home-hero.png
```

## 🎨 截图技巧

### 推荐设置

1. **浏览器窗口**
   - 全屏模式 (F11)
   - 隐藏书签栏
   - 干净的界面

2. **数据展示**
   - 使用真实或仿真数据
   - 数据要有代表性
   - 避免空白或 Lorem Ipsum

3. **配色方案**
   - 确保主题一致
   - 亮色模式（默认）
   - 或暗色模式（如果支持）

### 截图工具

**macOS**:
```bash
# 全屏截图
Cmd + Shift + 3

# 区域截图
Cmd + Shift + 4

# 窗口截图
Cmd + Shift + 4 + Space
```

**Windows**:
```bash
# 截图工具
Win + Shift + S

# 全屏截图
PrtScn
```

### 后期处理

可选的后期处理：
- 添加设备边框
- 添加阴影效果
- 标注重点功能
- 添加说明文字

## 📝 提交截图

截图完成后：

```bash
# 1. 检查文件大小
ls -lh *.png

# 2. 添加到 Git
git add assets/screenshots/*.png

# 3. 提交
git commit -m "docs: 添加界面截图"

# 4. 推送
git push origin dev
```

## 🔗 引用截图

在 Markdown 文档中引用：

```markdown
# 相对路径（从 README.md）
![首页](./assets/screenshots/home-hero.png)

# 绝对路径（从子目录）
![首页](/assets/screenshots/home-hero.png)

# 带标题
![首页](./assets/screenshots/home-hero.png "出海AI平台首页")
```

## ✅ 完成检查清单

截图添加后，请检查：

- [ ] 所有必需截图已添加
- [ ] 图片已优化压缩（< 500KB）
- [ ] 文件命名规范
- [ ] README.md 中的引用正确
- [ ] 无敏感信息
- [ ] 图片清晰可见
- [ ] 已提交到 Git

---

**状态**: ⏳ 等待截图添加  
**更新**: 截图添加后请更新此文档

