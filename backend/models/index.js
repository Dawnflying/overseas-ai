/**
 * 数据库模型定义
 * 使用Sequelize ORM定义所有数据模型
 */

const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

// 用户模型
const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.STRING(50),
    allowNull: false,
    unique: true
  },
  email: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true
    }
  },
  password: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  fullName: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  avatar: {
    type: DataTypes.STRING(500),
    allowNull: true
  },
  role: {
    type: DataTypes.ENUM('admin', 'user', 'premium'),
    defaultValue: 'user'
  },
  status: {
    type: DataTypes.ENUM('active', 'inactive', 'suspended'),
    defaultValue: 'active'
  },
  lastLoginAt: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'users',
  indexes: [
    { fields: ['username'] },
    { fields: ['email'] },
    { fields: ['role'] },
    { fields: ['status'] }
  ]
});

// 知识库模型
const KnowledgeBase = sequelize.define('KnowledgeBase', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  summary: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  category: {
    type: DataTypes.STRING(50),
    allowNull: true
  },
  tags: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: []
  },
  source: {
    type: DataTypes.STRING(100),
    allowNull: true
  },
  language: {
    type: DataTypes.STRING(10),
    allowNull: true,
    defaultValue: 'zh-CN'
  },
  isPublic: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  viewCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  }
}, {
  tableName: 'knowledge_bases',
  indexes: [
    { fields: ['title'] },
    { fields: ['category'] },
    { fields: ['language'] },
    { fields: ['isPublic'] },
    { fields: ['userId'] },
    { fields: ['createdAt'] }
  ]
});

// 对话记录模型
const Conversation = sequelize.define('Conversation', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  title: {
    type: DataTypes.STRING(200),
    allowNull: true
  },
  type: {
    type: DataTypes.ENUM('chat', 'planning', 'analysis'),
    defaultValue: 'chat'
  },
  status: {
    type: DataTypes.ENUM('active', 'archived', 'deleted'),
    defaultValue: 'active'
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  metadata: {
    type: DataTypes.JSON,
    allowNull: true,
    defaultValue: {}
  }
}, {
  tableName: 'conversations',
  indexes: [
    { fields: ['type'] },
    { fields: ['status'] },
    { fields: ['userId'] },
    { fields: ['createdAt'] }
  ]
});

// 消息记录模型
const Message = sequelize.define('Message', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  role: {
    type: DataTypes.ENUM('user', 'assistant', 'system'),
    allowNull: false
  },
  content: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  tokenCount: {
    type: DataTypes.INTEGER,
    allowNull: true
  },
  conversationId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'conversations',
      key: 'id'
    }
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  }
}, {
  tableName: 'messages',
  indexes: [
    { fields: ['role'] },
    { fields: ['conversationId'] },
    { fields: ['userId'] },
    { fields: ['createdAt'] }
  ]
});

// 工具使用记录模型
const ToolUsage = sequelize.define('ToolUsage', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  toolName: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  toolType: {
    type: DataTypes.ENUM('analysis', 'planning', 'generation', 'search'),
    allowNull: false
  },
  input: {
    type: DataTypes.JSON,
    allowNull: true
  },
  output: {
    type: DataTypes.JSON,
    allowNull: true
  },
  status: {
    type: DataTypes.ENUM('success', 'error', 'pending'),
    defaultValue: 'pending'
  },
  executionTime: {
    type: DataTypes.INTEGER, // 执行时间（毫秒）
    allowNull: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  conversationId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'conversations',
      key: 'id'
    }
  }
}, {
  tableName: 'tool_usages',
  indexes: [
    { fields: ['toolName'] },
    { fields: ['toolType'] },
    { fields: ['status'] },
    { fields: ['userId'] },
    { fields: ['conversationId'] },
    { fields: ['createdAt'] }
  ]
});

// 文件上传记录模型
const FileUpload = sequelize.define('FileUpload', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  filename: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  originalName: {
    type: DataTypes.STRING(255),
    allowNull: false
  },
  mimeType: {
    type: DataTypes.STRING(100),
    allowNull: false
  },
  size: {
    type: DataTypes.INTEGER,
    allowNull: false
  },
  url: {
    type: DataTypes.STRING(500),
    allowNull: false
  },
  status: {
    type: DataTypes.ENUM('uploaded', 'processing', 'completed', 'failed'),
    defaultValue: 'uploaded'
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: 'users',
      key: 'id'
    }
  }
}, {
  tableName: 'file_uploads',
  indexes: [
    { fields: ['filename'] },
    { fields: ['mimeType'] },
    { fields: ['status'] },
    { fields: ['userId'] },
    { fields: ['createdAt'] }
  ]
});

// 系统配置模型
const SystemConfig = sequelize.define('SystemConfig', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  key: {
    type: DataTypes.STRING(100),
    allowNull: false,
    unique: true
  },
  value: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('string', 'number', 'boolean', 'json'),
    defaultValue: 'string'
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  isPublic: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  }
}, {
  tableName: 'system_configs',
  indexes: [
    { fields: ['key'] },
    { fields: ['type'] },
    { fields: ['isPublic'] }
  ]
});

// 定义模型关联关系
User.hasMany(KnowledgeBase, { foreignKey: 'userId', as: 'knowledgeBases' });
User.hasMany(Conversation, { foreignKey: 'userId', as: 'conversations' });
User.hasMany(ToolUsage, { foreignKey: 'userId', as: 'toolUsages' });
User.hasMany(FileUpload, { foreignKey: 'userId', as: 'fileUploads' });

KnowledgeBase.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Conversation.hasMany(Message, { foreignKey: 'conversationId', as: 'messages' });
Conversation.hasMany(ToolUsage, { foreignKey: 'conversationId', as: 'toolUsages' });
Conversation.belongsTo(User, { foreignKey: 'userId', as: 'user' });

Message.belongsTo(Conversation, { foreignKey: 'conversationId', as: 'conversation' });
Message.belongsTo(User, { foreignKey: 'userId', as: 'user' });

ToolUsage.belongsTo(User, { foreignKey: 'userId', as: 'user' });
ToolUsage.belongsTo(Conversation, { foreignKey: 'conversationId', as: 'conversation' });

FileUpload.belongsTo(User, { foreignKey: 'userId', as: 'user' });

// 导出所有模型
module.exports = {
  sequelize,
  User,
  KnowledgeBase,
  Conversation,
  Message,
  ToolUsage,
  FileUpload,
  SystemConfig
};
