/**
 * 出海AI平台后端服务
 * 重构后的主服务器文件，采用模块化架构
 */

const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const multer = require('multer');

// 导入配置和中间件
const config = require('./config');
const { globalErrorHandler, handleUncaughtException, handleUnhandledRejection, notFoundHandler } = require('./middleware/errorHandler');
const { validateFileUpload } = require('./middleware/validation');

// 导入路由
const routes = require('./routes');

const app = express();

// 处理未捕获的异常和未处理的Promise拒绝
handleUncaughtException();
handleUnhandledRejection();

// Multer配置 - 用于文件上传
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: config.upload.maxFileSize,
  },
  fileFilter: (req, file, cb) => {
    if (config.upload.allowedMimeTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error('不支持的文件类型'), false);
    }
  }
});

// 中间件配置
app.use(helmet({
  contentSecurityPolicy: false, // 在前端处理CSP
  crossOriginEmbedderPolicy: false
}));

app.use(cors(config.cors));

app.use(compression());

app.use(morgan(config.logging.format));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// 速率限制
const limiter = rateLimit(config.rateLimit);
app.use(limiter);

// 注册路由
app.use('/api', routes);

// 图片上传API
app.post('/api/upload/image', upload.single('image'), validateFileUpload(), async (req, res, next) => {
  try {
    // 这里应该上传到阿里云OSS
    // 暂时返回模拟URL
    const imageUrl = `https://example.oss-cn-hangzhou.aliyuncs.com/images/${Date.now()}-${req.file.originalname}`;
    
    res.json({
      url: imageUrl,
      filename: req.file.originalname,
      size: req.file.size,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    next(error);
  }
});

// 注册AI路由（兼容旧版本路径）
app.use('/ai', require('./routes/ai'));

// 404处理
app.use('*', notFoundHandler);

// 全局错误处理中间件
app.use(globalErrorHandler);

// 启动服务器
const PORT = config.server.port;
app.listen(PORT, () => {
  console.log(`🚀 出海AI后端服务运行在端口 ${PORT}`);
  console.log(`📊 健康检查: http://localhost:${PORT}/health`);
  console.log(`🤖 AI聊天API: http://localhost:${PORT}/ai/chat`);
  console.log(`📋 规划API: http://localhost:${PORT}/api/planning`);
  console.log(`🔧 工具API: http://localhost:${PORT}/api/tools`);
  console.log(`🔐 认证API: http://localhost:${PORT}/api/auth`);
});

module.exports = app;
