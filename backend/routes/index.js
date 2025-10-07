/**
 * 路由入口文件
 * 统一管理所有API路由
 */

const express = require('express');
const router = express.Router();

// 导入各个模块的路由
const authRoutes = require('./auth');
const aiRoutes = require('./ai');
const toolsRoutes = require('./tools');

// 健康检查路由
router.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage(),
    version: '1.0.0'
  });
});

// 注册各个模块的路由
router.use('/auth', authRoutes);
router.use('/ai', aiRoutes);
router.use('/tools', toolsRoutes);

// 其他业务路由可以在这里添加
// router.use('/dashboard', dashboardRoutes);
// router.use('/customer-service', customerServiceRoutes);
// router.use('/ecommerce', ecommerceRoutes);
// router.use('/independent-stores', independentStoreRoutes);
// router.use('/tiktok', tiktokRoutes);

module.exports = router;
