/**
 * 认证服务
 * 处理用户认证、注册、会话管理等业务逻辑
 */

const bcrypt = require('bcryptjs');
const { generateToken, createUserSession, updateUserSession, deleteUserSession } = require('../middleware/auth');

// 模拟用户数据库（生产环境应使用真实数据库）
const userDatabase = new Map();

/**
 * 初始化默认用户
 */
const initDefaultUsers = () => {
  const defaultUsers = [
    {
      id: '1',
      email: 'admin@overseas.com',
      password: bcrypt.hashSync('admin123', 10),
      name: '管理员',
      company: '出海AI平台',
      role: 'admin',
      createdAt: new Date().toISOString()
    },
    {
      id: '2',
      email: 'user@overseas.com',
      password: bcrypt.hashSync('user123', 10),
      name: '测试用户',
      company: '测试公司',
      role: 'user',
      createdAt: new Date().toISOString()
    }
  ];
  
  defaultUsers.forEach(user => {
    userDatabase.set(user.email, user);
  });
};

/**
 * 用户登录
 * @param {string} email - 邮箱
 * @param {string} password - 密码
 * @returns {Object} 登录结果
 */
const loginUser = async (email, password) => {
  try {
    // 查找用户
    const user = userDatabase.get(email);
    if (!user) {
      throw new Error('邮箱或密码错误');
    }

    // 验证密码
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new Error('邮箱或密码错误');
    }

    // 生成JWT令牌
    const token = generateToken(user);
    
    // 创建用户会话
    const session = createUserSession(user);

    return {
      success: true,
      message: '登录成功',
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          company: user.company,
          role: user.role
        },
        token: token,
        session: {
          id: session.id,
          expiresAt: session.expiresAt
        }
      }
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

/**
 * 用户注册
 * @param {Object} userData - 用户数据
 * @returns {Object} 注册结果
 */
const registerUser = async (userData) => {
  try {
    const { email, password, name, company } = userData;

    // 检查用户是否已存在
    if (userDatabase.has(email)) {
      throw new Error('该邮箱已被注册');
    }

    // 密码强度检查
    if (password.length < 6) {
      throw new Error('密码长度至少6位');
    }

    // 创建新用户
    const userId = `user_${Date.now()}`;
    const hashedPassword = await bcrypt.hash(password, 10);
    
    const newUser = {
      id: userId,
      email: email,
      password: hashedPassword,
      name: name,
      company: company || '',
      role: 'user',
      createdAt: new Date().toISOString()
    };

    userDatabase.set(email, newUser);

    // 生成JWT令牌
    const token = generateToken(newUser);
    
    // 创建用户会话
    const session = createUserSession(newUser);

    return {
      success: true,
      message: '注册成功',
      data: {
        user: {
          id: newUser.id,
          email: newUser.email,
          name: newUser.name,
          company: newUser.company,
          role: newUser.role
        },
        token: token,
        session: {
          id: session.id,
          expiresAt: session.expiresAt
        }
      }
    };
  } catch (error) {
    throw new Error(error.message);
  }
};

/**
 * 验证用户令牌
 * @param {Object} user - 用户信息
 * @returns {Object} 验证结果
 */
const verifyUserToken = (user) => {
  try {
    // 更新用户会话活动时间
    updateUserSession(user.id);
    
    return {
      success: true,
      message: '令牌有效',
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          company: user.company,
          role: user.role
        }
      }
    };
  } catch (error) {
    throw new Error('令牌验证失败');
  }
};

/**
 * 用户登出
 * @param {string} userId - 用户ID
 * @returns {Object} 登出结果
 */
const logoutUser = (userId) => {
  try {
    // 删除用户会话
    deleteUserSession(userId);
    
    return {
      success: true,
      message: '登出成功'
    };
  } catch (error) {
    throw new Error('登出失败');
  }
};

/**
 * 获取用户信息
 * @param {Object} user - 用户信息
 * @returns {Object} 用户信息
 */
const getUserProfile = (user) => {
  try {
    // 更新用户会话活动时间
    updateUserSession(user.id);
    
    return {
      success: true,
      data: {
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          company: user.company,
          role: user.role
        }
      }
    };
  } catch (error) {
    throw new Error('获取用户信息失败');
  }
};

/**
 * 根据邮箱查找用户
 * @param {string} email - 邮箱
 * @returns {Object|null} 用户信息
 */
const findUserByEmail = (email) => {
  return userDatabase.get(email);
};

/**
 * 根据ID查找用户
 * @param {string} id - 用户ID
 * @returns {Object|null} 用户信息
 */
const findUserById = (id) => {
  for (const user of userDatabase.values()) {
    if (user.id === id) {
      return user;
    }
  }
  return null;
};

// 初始化默认用户
initDefaultUsers();

module.exports = {
  loginUser,
  registerUser,
  verifyUserToken,
  logoutUser,
  getUserProfile,
  findUserByEmail,
  findUserById
};
