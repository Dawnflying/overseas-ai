/**
 * 应用配置管理
 * 统一管理环境变量和应用配置
 */

require('dotenv').config();

const config = {
  // 服务器配置
  server: {
    port: process.env.PORT || 3000,
    host: process.env.HOST || 'localhost',
    env: process.env.NODE_ENV || 'development'
  },

  // JWT配置
  jwt: {
    secret: process.env.JWT_SECRET || 'overseas-ai-platform-secret-key-2024',
    expiresIn: '10h'
  },

  // CORS配置
  cors: {
    origins: [
      'http://localhost:5173',
      'http://localhost:3001',
      'http://localhost:3002',
      'http://localhost:80',
      process.env.FRONTEND_URL
    ].filter(Boolean),
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
  },

  // 速率限制配置
  rateLimit: {
    windowMs: 15 * 60 * 1000, // 15分钟
    max: 100, // 限制每个IP 15分钟内最多100个请求
    message: {
      error: '请求过于频繁，请稍后再试'
    }
  },

  // 文件上传配置
  upload: {
    maxFileSize: 5 * 1024 * 1024, // 5MB
    allowedMimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
  },

  // AI服务配置
  ai: {
    deepseek: {
      apiKey: process.env.DEEPSEEK_API_KEY,
      baseUrl: 'https://api.deepseek.com/chat/completions',
      model: 'deepseek-chat',
      maxTokens: 2000,
      temperature: 0.7,
      timeout: 30000
    }
  },

  // MySQL数据库配置
  database: {
    mysql: {
      host: process.env.MYSQL_HOST || 'rm-uf625c9d22j18o6579o.mysql.rds.aliyuncs.com',
      port: process.env.MYSQL_PORT || 3306,
      database: process.env.MYSQL_DATABASE || 'overseas-ai',
      username: process.env.MYSQL_USERNAME || 'overseas-ai',
      password: process.env.MYSQL_PASSWORD || 'jarvis@888',
      dialect: 'mysql',
      pool: {
        max: 10,
        min: 0,
        acquire: 30000,
        idle: 10000
      },
      logging: process.env.NODE_ENV === 'development' ? console.log : false,
      define: {
        timestamps: true,
        underscored: false,
        freezeTableName: true
      }
    }
  },

  // Elasticsearch配置（保留用于向量搜索）
  elasticsearch: {
    url: process.env.ELASTICSEARCH_URL || 'http://localhost:9200',
    indexPrefix: process.env.ELASTICSEARCH_INDEX_PREFIX || 'overseas_',
    vectorDimension: parseInt(process.env.VECTOR_DIMENSION) || 768
  },

  // 日志配置
  logging: {
    level: process.env.LOG_LEVEL || 'info',
    format: process.env.LOG_FORMAT || 'combined'
  }
};

module.exports = config;
