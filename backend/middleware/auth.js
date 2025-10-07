/**
 * 认证中间件
 * 处理JWT令牌验证和用户会话管理
 */

const jwt = require('jsonwebtoken');
const config = require('../config');

// 内存存储用户会话（生产环境应使用Redis或数据库）
const userSessions = new Map();

/**
 * JWT认证中间件
 * 验证请求头中的Authorization令牌
 */
const authenticateToken = (req, res, next) => {
  try {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ error: '访问令牌缺失' });
    }

    jwt.verify(token, config.jwt.secret, (err, user) => {
      if (err) {
        return res.status(403).json({ error: '访问令牌无效或已过期' });
      }
      
      // 检查用户会话是否仍然有效
      const session = userSessions.get(user.id);
      if (!session || session.expiresAt < Date.now()) {
        userSessions.delete(user.id);
        return res.status(403).json({ error: '会话已过期，请重新登录' });
      }
      
      req.user = user;
      next();
    });
  } catch (error) {
    console.error('认证中间件错误:', error);
    res.status(500).json({ error: '认证服务异常' });
  }
};

/**
 * 生成JWT令牌
 * @param {Object} user - 用户信息
 * @returns {string} JWT令牌
 */
const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user.id, 
      email: user.email, 
      name: user.name,
      company: user.company,
      role: user.role 
    },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn }
  );
};

/**
 * 创建用户会话
 * @param {Object} user - 用户信息
 * @returns {Object} 会话信息
 */
const createUserSession = (user) => {
  const sessionId = `session_${user.id}_${Date.now()}`;
  const expiresAt = Date.now() + (10 * 60 * 60 * 1000); // 10小时后过期
  
  const session = {
    id: sessionId,
    userId: user.id,
    email: user.email,
    name: user.name,
    company: user.company,
    role: user.role,
    createdAt: new Date().toISOString(),
    expiresAt: expiresAt,
    lastActivity: Date.now()
  };
  
  userSessions.set(user.id, session);
  return session;
};

/**
 * 更新用户会话活动时间
 * @param {string} userId - 用户ID
 */
const updateUserSession = (userId) => {
  const session = userSessions.get(userId);
  if (session) {
    session.lastActivity = Date.now();
    userSessions.set(userId, session);
  }
};

/**
 * 清理过期会话
 */
const cleanupExpiredSessions = () => {
  const now = Date.now();
  for (const [userId, session] of userSessions.entries()) {
    if (session.expiresAt < now) {
      userSessions.delete(userId);
    }
  }
};

/**
 * 删除用户会话
 * @param {string} userId - 用户ID
 */
const deleteUserSession = (userId) => {
  userSessions.delete(userId);
};

/**
 * 获取用户会话
 * @param {string} userId - 用户ID
 * @returns {Object|null} 会话信息
 */
const getUserSession = (userId) => {
  return userSessions.get(userId);
};

// 定期清理过期会话（每30分钟执行一次）
setInterval(cleanupExpiredSessions, 30 * 60 * 1000);

module.exports = {
  authenticateToken,
  generateToken,
  createUserSession,
  updateUserSession,
  deleteUserSession,
  getUserSession,
  cleanupExpiredSessions
};
