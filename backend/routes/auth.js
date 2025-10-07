/**
 * 认证路由
 * 处理用户登录、注册、验证等认证相关API
 */

const express = require('express');
const router = express.Router();
const { authenticateToken } = require('../middleware/auth');
const { validateRequired, isValidEmail, validatePassword } = require('../middleware/validation');
const authService = require('../services/authService');

/**
 * 用户登录
 * POST /api/auth/login
 */
router.post('/login', 
  validateRequired(['email', 'password']),
  async (req, res, next) => {
    try {
      const { email, password } = req.body;

      // 验证邮箱格式
      if (!isValidEmail(email)) {
        return res.status(400).json({ error: '邮箱格式不正确' });
      }

      const result = await authService.loginUser(email, password);
      res.json(result);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * 用户注册
 * POST /api/auth/register
 */
router.post('/register',
  validateRequired(['email', 'password', 'name']),
  async (req, res, next) => {
    try {
      const { email, password, name, company } = req.body;

      // 验证邮箱格式
      if (!isValidEmail(email)) {
        return res.status(400).json({ error: '邮箱格式不正确' });
      }

      // 验证密码强度
      const passwordValidation = validatePassword(password);
      if (!passwordValidation.isValid) {
        return res.status(400).json({ 
          error: '密码验证失败',
          details: passwordValidation.errors
        });
      }

      const result = await authService.registerUser({ email, password, name, company });
      res.status(201).json(result);
    } catch (error) {
      next(error);
    }
  }
);

/**
 * 验证令牌
 * GET /api/auth/verify
 */
router.get('/verify', authenticateToken, (req, res, next) => {
  try {
    const result = authService.verifyUserToken(req.user);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

/**
 * 用户登出
 * POST /api/auth/logout
 */
router.post('/logout', authenticateToken, (req, res, next) => {
  try {
    const result = authService.logoutUser(req.user.id);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

/**
 * 获取用户信息
 * GET /api/auth/profile
 */
router.get('/profile', authenticateToken, (req, res, next) => {
  try {
    const result = authService.getUserProfile(req.user);
    res.json(result);
  } catch (error) {
    next(error);
  }
});

module.exports = router;
