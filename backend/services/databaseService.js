/**
 * 数据库服务类
 * 封装常用的数据库操作
 */

const { Op } = require('sequelize');
const models = require('../models');
const bcrypt = require('bcryptjs');

class DatabaseService {
  constructor() {
    this.models = models;
  }

  // ==================== 用户相关操作 ====================

  /**
   * 创建用户
   * @param {Object} userData - 用户数据
   */
  async createUser(userData) {
    try {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      const user = await this.models.User.create({
        ...userData,
        password: hashedPassword
      });
      return user.toJSON();
    } catch (error) {
      console.error('创建用户失败:', error);
      throw error;
    }
  }

  /**
   * 根据用户名或邮箱查找用户
   * @param {string} identifier - 用户名或邮箱
   */
  async findUserByIdentifier(identifier) {
    try {
      const user = await this.models.User.findOne({
        where: {
          [Op.or]: [
            { username: identifier },
            { email: identifier }
          ]
        }
      });
      return user ? user.toJSON() : null;
    } catch (error) {
      console.error('查找用户失败:', error);
      throw error;
    }
  }

  /**
   * 验证用户密码
   * @param {string} password - 明文密码
   * @param {string} hashedPassword - 哈希密码
   */
  async validatePassword(password, hashedPassword) {
    return await bcrypt.compare(password, hashedPassword);
  }

  /**
   * 更新用户信息
   * @param {number} userId - 用户ID
   * @param {Object} updateData - 更新数据
   */
  async updateUser(userId, updateData) {
    try {
      const [updatedRowsCount] = await this.models.User.update(updateData, {
        where: { id: userId }
      });
      return updatedRowsCount > 0;
    } catch (error) {
      console.error('更新用户失败:', error);
      throw error;
    }
  }

  // ==================== 知识库相关操作 ====================

  /**
   * 创建知识库条目
   * @param {Object} knowledgeData - 知识库数据
   */
  async createKnowledge(knowledgeData) {
    try {
      const knowledge = await this.models.KnowledgeBase.create(knowledgeData);
      return knowledge.toJSON();
    } catch (error) {
      console.error('创建知识库条目失败:', error);
      throw error;
    }
  }

  /**
   * 搜索知识库
   * @param {Object} searchParams - 搜索参数
   */
  async searchKnowledge(searchParams) {
    try {
      const {
        query,
        category,
        language,
        isPublic,
        userId,
        page = 1,
        limit = 20
      } = searchParams;

      const where = {};
      
      if (query) {
        where[Op.or] = [
          { title: { [Op.like]: `%${query}%` } },
          { content: { [Op.like]: `%${query}%` } },
          { summary: { [Op.like]: `%${query}%` } }
        ];
      }

      if (category) {
        where.category = category;
      }

      if (language) {
        where.language = language;
      }

      if (isPublic !== undefined) {
        where.isPublic = isPublic;
      }

      if (userId) {
        where.userId = userId;
      }

      const { count, rows } = await this.models.KnowledgeBase.findAndCountAll({
        where,
        include: [
          {
            model: this.models.User,
            as: 'user',
            attributes: ['id', 'username', 'fullName']
          }
        ],
        order: [['createdAt', 'DESC']],
        limit: parseInt(limit),
        offset: (parseInt(page) - 1) * parseInt(limit)
      });

      return {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / parseInt(limit)),
        data: rows.map(row => row.toJSON())
      };
    } catch (error) {
      console.error('搜索知识库失败:', error);
      throw error;
    }
  }

  /**
   * 获取知识库详情
   * @param {number} knowledgeId - 知识库ID
   */
  async getKnowledgeById(knowledgeId) {
    try {
      const knowledge = await this.models.KnowledgeBase.findByPk(knowledgeId, {
        include: [
          {
            model: this.models.User,
            as: 'user',
            attributes: ['id', 'username', 'fullName']
          }
        ]
      });
      return knowledge ? knowledge.toJSON() : null;
    } catch (error) {
      console.error('获取知识库详情失败:', error);
      throw error;
    }
  }

  // ==================== 对话相关操作 ====================

  /**
   * 创建对话
   * @param {Object} conversationData - 对话数据
   */
  async createConversation(conversationData) {
    try {
      const conversation = await this.models.Conversation.create(conversationData);
      return conversation.toJSON();
    } catch (error) {
      console.error('创建对话失败:', error);
      throw error;
    }
  }

  /**
   * 获取用户对话列表
   * @param {number} userId - 用户ID
   * @param {Object} options - 查询选项
   */
  async getUserConversations(userId, options = {}) {
    try {
      const {
        type,
        status = 'active',
        page = 1,
        limit = 20
      } = options;

      const where = { userId, status };
      if (type) {
        where.type = type;
      }

      const { count, rows } = await this.models.Conversation.findAndCountAll({
        where,
        include: [
          {
            model: this.models.Message,
            as: 'messages',
            limit: 1,
            order: [['createdAt', 'DESC']]
          }
        ],
        order: [['updatedAt', 'DESC']],
        limit: parseInt(limit),
        offset: (parseInt(page) - 1) * parseInt(limit)
      });

      return {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / parseInt(limit)),
        data: rows.map(row => row.toJSON())
      };
    } catch (error) {
      console.error('获取用户对话列表失败:', error);
      throw error;
    }
  }

  /**
   * 创建消息
   * @param {Object} messageData - 消息数据
   */
  async createMessage(messageData) {
    try {
      const message = await this.models.Message.create(messageData);
      return message.toJSON();
    } catch (error) {
      console.error('创建消息失败:', error);
      throw error;
    }
  }

  /**
   * 获取对话消息列表
   * @param {number} conversationId - 对话ID
   * @param {Object} options - 查询选项
   */
  async getConversationMessages(conversationId, options = {}) {
    try {
      const {
        page = 1,
        limit = 50
      } = options;

      const { count, rows } = await this.models.Message.findAndCountAll({
        where: { conversationId },
        include: [
          {
            model: this.models.User,
            as: 'user',
            attributes: ['id', 'username', 'fullName']
          }
        ],
        order: [['createdAt', 'ASC']],
        limit: parseInt(limit),
        offset: (parseInt(page) - 1) * parseInt(limit)
      });

      return {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / parseInt(limit)),
        data: rows.map(row => row.toJSON())
      };
    } catch (error) {
      console.error('获取对话消息失败:', error);
      throw error;
    }
  }

  // ==================== 工具使用记录相关操作 ====================

  /**
   * 记录工具使用
   * @param {Object} toolUsageData - 工具使用数据
   */
  async recordToolUsage(toolUsageData) {
    try {
      const toolUsage = await this.models.ToolUsage.create(toolUsageData);
      return toolUsage.toJSON();
    } catch (error) {
      console.error('记录工具使用失败:', error);
      throw error;
    }
  }

  /**
   * 更新工具使用状态
   * @param {number} toolUsageId - 工具使用记录ID
   * @param {Object} updateData - 更新数据
   */
  async updateToolUsage(toolUsageId, updateData) {
    try {
      const [updatedRowsCount] = await this.models.ToolUsage.update(updateData, {
        where: { id: toolUsageId }
      });
      return updatedRowsCount > 0;
    } catch (error) {
      console.error('更新工具使用记录失败:', error);
      throw error;
    }
  }

  // ==================== 文件上传相关操作 ====================

  /**
   * 记录文件上传
   * @param {Object} fileData - 文件数据
   */
  async recordFileUpload(fileData) {
    try {
      const fileUpload = await this.models.FileUpload.create(fileData);
      return fileUpload.toJSON();
    } catch (error) {
      console.error('记录文件上传失败:', error);
      throw error;
    }
  }

  /**
   * 获取用户文件列表
   * @param {number} userId - 用户ID
   * @param {Object} options - 查询选项
   */
  async getUserFiles(userId, options = {}) {
    try {
      const {
        status,
        page = 1,
        limit = 20
      } = options;

      const where = { userId };
      if (status) {
        where.status = status;
      }

      const { count, rows } = await this.models.FileUpload.findAndCountAll({
        where,
        order: [['createdAt', 'DESC']],
        limit: parseInt(limit),
        offset: (parseInt(page) - 1) * parseInt(limit)
      });

      return {
        total: count,
        page: parseInt(page),
        limit: parseInt(limit),
        totalPages: Math.ceil(count / parseInt(limit)),
        data: rows.map(row => row.toJSON())
      };
    } catch (error) {
      console.error('获取用户文件列表失败:', error);
      throw error;
    }
  }

  // ==================== 系统配置相关操作 ====================

  /**
   * 获取系统配置
   * @param {string} key - 配置键
   */
  async getSystemConfig(key) {
    try {
      const config = await this.models.SystemConfig.findOne({
        where: { key }
      });
      return config ? config.toJSON() : null;
    } catch (error) {
      console.error('获取系统配置失败:', error);
      throw error;
    }
  }

  /**
   * 设置系统配置
   * @param {string} key - 配置键
   * @param {*} value - 配置值
   * @param {string} type - 值类型
   */
  async setSystemConfig(key, value, type = 'string') {
    try {
      const configValue = type === 'json' ? JSON.stringify(value) : String(value);
      
      await this.models.SystemConfig.upsert({
        key,
        value: configValue,
        type,
        updatedAt: new Date()
      });

      return true;
    } catch (error) {
      console.error('设置系统配置失败:', error);
      throw error;
    }
  }

  /**
   * 获取所有公开配置
   */
  async getPublicConfigs() {
    try {
      const configs = await this.models.SystemConfig.findAll({
        where: { isPublic: true },
        attributes: ['key', 'value', 'type']
      });

      const result = {};
      configs.forEach(config => {
        let value = config.value;
        if (config.type === 'json') {
          try {
            value = JSON.parse(config.value);
          } catch (e) {
            value = config.value;
          }
        } else if (config.type === 'number') {
          value = Number(config.value);
        } else if (config.type === 'boolean') {
          value = config.value === 'true';
        }
        result[config.key] = value;
      });

      return result;
    } catch (error) {
      console.error('获取公开配置失败:', error);
      throw error;
    }
  }

  // ==================== 统计相关操作 ====================

  /**
   * 获取系统统计信息
   */
  async getSystemStats() {
    try {
      const [
        userCount,
        knowledgeCount,
        conversationCount,
        messageCount,
        toolUsageCount,
        fileUploadCount
      ] = await Promise.all([
        this.models.User.count(),
        this.models.KnowledgeBase.count(),
        this.models.Conversation.count(),
        this.models.Message.count(),
        this.models.ToolUsage.count(),
        this.models.FileUpload.count()
      ]);

      return {
        users: userCount,
        knowledge: knowledgeCount,
        conversations: conversationCount,
        messages: messageCount,
        toolUsages: toolUsageCount,
        fileUploads: fileUploadCount
      };
    } catch (error) {
      console.error('获取系统统计失败:', error);
      throw error;
    }
  }

  /**
   * 获取用户统计信息
   * @param {number} userId - 用户ID
   */
  async getUserStats(userId) {
    try {
      const [
        conversationCount,
        messageCount,
        toolUsageCount,
        fileUploadCount
      ] = await Promise.all([
        this.models.Conversation.count({ where: { userId } }),
        this.models.Message.count({ where: { userId } }),
        this.models.ToolUsage.count({ where: { userId } }),
        this.models.FileUpload.count({ where: { userId } })
      ]);

      return {
        conversations: conversationCount,
        messages: messageCount,
        toolUsages: toolUsageCount,
        fileUploads: fileUploadCount
      };
    } catch (error) {
      console.error('获取用户统计失败:', error);
      throw error;
    }
  }
}

module.exports = DatabaseService;
