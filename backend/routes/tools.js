/**
 * 工具路由
 * 处理出海工具相关的API
 */

const express = require('express');
const router = express.Router();
const { validatePagination } = require('../middleware/validation');

/**
 * 获取工具列表
 * GET /api/tools
 */
router.get('/', validatePagination(), async (req, res, next) => {
  try {
    const { category, search, filters } = req.query;
    const { page, limit } = req.pagination;
    
    // 这里可以从数据库获取工具数据，现在返回静态数据
    const tools = [
      // 电商平台
      {
        id: 'amazon',
        name: 'Amazon Seller Central',
        category: 'ecommerce',
        icon: '🛒',
        description: '全球最大的电商平台，覆盖全球多个市场',
        price: 'free',
        difficulty: 'medium',
        languages: ['en', 'zh'],
        features: ['多市场', 'FBA', '广告'],
        pros: ['流量巨大', '品牌影响力强', '完善的物流体系'],
        cons: ['竞争激烈', '费用较高', '规则复杂'],
        setupGuide: '注册亚马逊卖家账户，完成身份验证，设置支付方式',
        chineseGuide: '详细的中文注册和设置教程',
        vpnRequired: true,
        rating: 4.5,
        users: '500万+'
      },
      {
        id: 'shopify',
        name: 'Shopify',
        category: 'ecommerce',
        icon: '🏪',
        description: '专业的电商建站平台，适合独立站卖家',
        price: 'paid',
        difficulty: 'easy',
        languages: ['en', 'zh'],
        features: ['建站', '支付', '主题'],
        pros: ['易于使用', '主题丰富', '生态完善'],
        cons: ['月费较高', '交易手续费', '依赖第三方'],
        setupGuide: '选择套餐，注册账户，选择主题，添加产品',
        chineseGuide: 'Shopify中文建站完整教程',
        vpnRequired: false,
        rating: 4.7,
        users: '200万+'
      },
      {
        id: 'tiktok-shop',
        name: 'TikTok Shop',
        category: 'ecommerce',
        icon: '🎵',
        description: '短视频电商平台，适合年轻用户群体',
        price: 'free',
        difficulty: 'medium',
        languages: ['en', 'zh'],
        features: ['短视频', '直播', '社交'],
        pros: ['用户活跃度高', '内容营销', '年轻用户群体'],
        cons: ['平台规则变化快', '需要内容创作能力', '竞争激烈'],
        setupGuide: '注册TikTok Shop账户，完成商家认证，设置店铺',
        chineseGuide: 'TikTok Shop开店完整指南',
        vpnRequired: true,
        rating: 4.2,
        users: '100万+'
      },
      // 营销工具
      {
        id: 'google-ads',
        name: 'Google Ads',
        category: 'marketing',
        icon: '🔍',
        description: '谷歌广告平台，覆盖全球搜索流量',
        price: 'paid',
        difficulty: 'hard',
        languages: ['en', 'zh'],
        features: ['搜索广告', '展示广告', '视频广告'],
        pros: ['流量精准', '覆盖全球', '数据丰富'],
        cons: ['竞争激烈', '成本较高', '需要专业知识'],
        setupGuide: '注册Google Ads账户，设置支付方式，创建广告系列',
        chineseGuide: 'Google Ads投放完整教程',
        vpnRequired: true,
        rating: 4.3,
        users: '300万+'
      },
      {
        id: 'facebook-ads',
        name: 'Facebook Ads',
        category: 'marketing',
        icon: '📘',
        description: 'Facebook广告平台，适合社交营销',
        price: 'paid',
        difficulty: 'medium',
        languages: ['en', 'zh'],
        features: ['社交广告', '精准定向', '创意工具'],
        pros: ['用户基数大', '精准定向', '创意丰富'],
        cons: ['政策变化', '竞争激烈', '需要创意能力'],
        setupGuide: '注册Facebook Business账户，设置广告账户，创建广告',
        chineseGuide: 'Facebook Ads投放指南',
        vpnRequired: true,
        rating: 4.1,
        users: '250万+'
      },
      // 物流工具
      {
        id: 'dhl',
        name: 'DHL Express',
        category: 'logistics',
        icon: '📦',
        description: '国际快递服务，全球覆盖',
        price: 'paid',
        difficulty: 'easy',
        languages: ['en', 'zh'],
        features: ['全球配送', '快速时效', '跟踪服务'],
        pros: ['时效快', '覆盖广', '服务好'],
        cons: ['成本高', '限制多', '需要认证'],
        setupGuide: '注册DHL账户，完成认证，设置发货地址',
        chineseGuide: 'DHL发货完整流程',
        vpnRequired: false,
        rating: 4.4,
        users: '50万+'
      },
      {
        id: 'fedex',
        name: 'FedEx',
        category: 'logistics',
        icon: '🚚',
        description: '联邦快递，专业物流服务',
        price: 'paid',
        difficulty: 'easy',
        languages: ['en', 'zh'],
        features: ['国际快递', '仓储服务', '清关服务'],
        pros: ['服务专业', '时效稳定', '清关能力强'],
        cons: ['成本较高', '限制较多', '需要认证'],
        setupGuide: '注册FedEx账户，完成认证，设置发货信息',
        chineseGuide: 'FedEx使用指南',
        vpnRequired: false,
        rating: 4.2,
        users: '30万+'
      }
    ];

    // 简单的过滤逻辑
    let filteredTools = tools;
    
    if (category && category !== 'all') {
      filteredTools = filteredTools.filter(tool => tool.category === category);
    }
    
    if (search) {
      const searchLower = search.toLowerCase();
      filteredTools = filteredTools.filter(tool => 
        tool.name.toLowerCase().includes(searchLower) ||
        tool.description.toLowerCase().includes(searchLower) ||
        tool.features.some(feature => feature.toLowerCase().includes(searchLower))
      );
    }

    // 分页
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedTools = filteredTools.slice(startIndex, endIndex);

    res.json({
      tools: paginatedTools,
      total: filteredTools.length,
      page: page,
      limit: limit,
      totalPages: Math.ceil(filteredTools.length / limit),
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    next(error);
  }
});

/**
 * 获取工具详情
 * GET /api/tools/:id
 */
router.get('/:id', async (req, res, next) => {
  try {
    const { id } = req.params;
    
    // 这里可以从数据库获取具体工具详情
    const tool = {
      id: id,
      name: '示例工具',
      category: 'ecommerce',
      icon: '🛒',
      description: '这是一个示例工具的描述',
      price: 'free',
      difficulty: 'medium',
      languages: ['en', 'zh'],
      features: ['功能1', '功能2', '功能3'],
      pros: ['优势1', '优势2', '优势3'],
      cons: ['劣势1', '劣势2', '劣势3'],
      setupGuide: '设置指南',
      chineseGuide: '中文指南',
      vpnRequired: false,
      rating: 4.5,
      users: '100万+',
      // 详细配置信息
      configuration: {
        apiKey: '需要API密钥',
        webhook: '支持Webhook',
        integration: '支持多种集成方式'
      },
      // 使用案例
      useCases: [
        '案例1：如何使用该工具进行选品',
        '案例2：如何优化广告投放效果',
        '案例3：如何提高转化率'
      ],
      // 常见问题
      faq: [
        {
          question: '如何注册账户？',
          answer: '访问官网，点击注册按钮，填写相关信息即可。'
        },
        {
          question: '是否需要VPN？',
          answer: '根据地区不同，可能需要VPN访问。'
        }
      ]
    };

    if (!tool) {
      return res.status(404).json({
        error: '工具不存在'
      });
    }

    res.json({
      tool: tool,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    next(error);
  }
});

/**
 * 工具连接API
 * POST /api/tools/:toolId/connect
 */
router.post('/:toolId/connect', async (req, res, next) => {
  try {
    const { toolId } = req.params;
    const { config } = req.body;

    // 这里应该验证配置并连接工具
    // 暂时返回成功结果
    const result = {
      toolId: toolId,
      status: 'connected',
      connectedAt: new Date().toISOString(),
      config: config
    };

    res.json({
      message: '工具连接成功',
      data: result,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    next(error);
  }
});

/**
 * 工具断开API
 * POST /api/tools/:toolId/disconnect
 */
router.post('/:toolId/disconnect', async (req, res, next) => {
  try {
    const { toolId } = req.params;

    // 这里应该断开工具连接并清理配置
    // 暂时返回成功结果
    const result = {
      toolId: toolId,
      status: 'disconnected',
      disconnectedAt: new Date().toISOString()
    };

    res.json({
      message: '工具断开成功',
      data: result,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    next(error);
  }
});

/**
 * 获取工具配置API
 * GET /api/tools/:toolId/config
 */
router.get('/:toolId/config', async (req, res, next) => {
  try {
    const { toolId } = req.params;

    // 这里应该从数据库获取工具配置
    // 暂时返回模拟配置
    const config = {
      toolId: toolId,
      status: 'connected',
      lastSync: new Date().toISOString(),
      settings: {
        autoSync: true,
        syncInterval: '1hour',
        notifications: true
      }
    };

    res.json({
      data: config,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    next(error);
  }
});

/**
 * 更新工具配置API
 * PUT /api/tools/:toolId/config
 */
router.put('/:toolId/config', async (req, res, next) => {
  try {
    const { toolId } = req.params;
    const { config } = req.body;

    // 这里应该更新工具配置到数据库
    // 暂时返回成功结果
    const result = {
      toolId: toolId,
      config: config,
      updatedAt: new Date().toISOString()
    };

    res.json({
      message: '工具配置更新成功',
      data: result,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    next(error);
  }
});

module.exports = router;
