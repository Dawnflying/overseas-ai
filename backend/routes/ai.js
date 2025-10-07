/**
 * AI路由
 * 处理AI聊天、内容生成、市场分析等AI相关API
 */

const express = require('express');
const router = express.Router();
const { validateRequired } = require('../middleware/validation');
const aiService = require('../services/aiService');

/**
 * AI聊天API
 * POST /ai/chat
 */
router.post('/chat', 
  validateRequired(['message']),
  async (req, res, next) => {
    try {
      const { message, conversationId, context } = req.body;

      // 根据上下文生成不同的系统提示
      let systemPrompt = '';
      if (context === 'tools') {
        systemPrompt = `你是专业的出海工具顾问，专门为国内出海用户提供工具选择和使用建议。你的回答应该：
- 用中文回答，但保留英文工具名称
- 提供详细的使用步骤和注意事项
- 考虑国内用户的特殊需求（如翻墙、支付方式等）
- 推荐适合不同规模和经验的工具
- 提供具体的操作指导
请基于你的专业知识回答关于出海工具的问题。`;
      } else {
        systemPrompt = `你是一个专业的出海业务顾问，专门帮助中国企业进行海外市场拓展。你的回答应该专业、实用，并且针对中国企业的特点。`;
      }

      // 调用AI服务
      const aiResponse = await aiService.callDeepSeekAPI(message, context, systemPrompt);
      
      res.json({
        response: aiResponse,
        conversationId: conversationId || generateConversationId(),
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * AI流式聊天API
 * POST /ai/stream
 */
router.post('/stream', 
  validateRequired(['message']),
  async (req, res, next) => {
    try {
      const { message, agent, conversationId } = req.body;

      // 设置SSE响应头
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Cache-Control'
      });

      // 调用流式AI服务
      await aiService.callStreamingDeepSeekAPI(message, res, agent);
      
    } catch (error) {
      console.error('AI流式聊天错误:', error);
      res.write(`data: ${JSON.stringify({ error: 'AI服务暂时不可用，请稍后再试' })}\n\n`);
      res.end();
    }
  }
);

/**
 * AI内容生成API
 * POST /api/ai/generate-content
 */
router.post('/generate-content',
  validateRequired(['prompt', 'type']),
  async (req, res, next) => {
    try {
      const { prompt, type, context } = req.body;

      // 根据类型生成不同的系统提示
      let systemPrompt = '';
      switch (type) {
        case 'title':
          systemPrompt = `你是专业的出海电商内容创作助手。请为帖子生成一个吸引人的标题，要求：
- 简洁明了，不超过30字
- 包含关键词，便于搜索
- 吸引目标读者点击
- 适合国内出海卖家阅读`;
          break;
        case 'content':
          systemPrompt = `你是专业的出海电商经验分享专家。请生成一篇高质量的文章，要求：
- 内容实用、专业、易懂
- 包含具体的操作步骤和建议
- 使用Markdown格式
- 适合国内出海卖家阅读
- 包含实际案例和数据`;
          break;
        case 'summary':
          systemPrompt = `请为文章生成一个简洁的摘要，要求：
- 不超过100字
- 概括文章核心内容
- 吸引读者阅读全文
- 语言简洁明了`;
          break;
        case 'tags':
          systemPrompt = `请为文章推荐相关标签，要求：
- 推荐3-5个标签
- 包含平台标签（Amazon、Shopify等）
- 包含业务分类（选品、运营、推广等）
- 包含难度等级（新手、进阶、专家）
- 用逗号分隔返回`;
          break;
        case 'outline':
          systemPrompt = `请为文章生成详细大纲，要求：
- 使用Markdown格式
- 包含多个章节
- 每个章节有具体内容要点
- 结构清晰，逻辑性强`;
          break;
        default:
          systemPrompt = `你是专业的出海电商顾问，请根据用户需求生成相关内容。`;
      }

      // 调用AI服务
      const aiResponse = await aiService.callDeepSeekAPI(prompt, context, systemPrompt);
      
      res.json({
        content: aiResponse,
        type: type,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      next(error);
    }
  }
);

/**
 * 市场分析API (GET - 兼容旧版本)
 * GET /api/market-analysis
 */
router.get('/market-analysis', async (req, res, next) => {
  try {
    const { market, industry } = req.query;
    
    const analysis = generateMarketAnalysis(market, industry);
    
    res.json({
      market: market || 'general',
      industry: industry || 'general',
      analysis: analysis,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    next(error);
  }
});

/**
 * 市场分析API (POST - 流式版本)
 * POST /api/market-analysis
 */
router.post('/market-analysis',
  validateRequired(['targetMarket', 'productCategory', 'analysisType']),
  async (req, res, next) => {
    try {
      const { 
        targetMarket, 
        productCategory, 
        companySize, 
        budget, 
        timeline, 
        experience,
        analysisType,
        conversationId 
      } = req.body;

      // 设置SSE响应头
      res.writeHead(200, {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        'Connection': 'keep-alive',
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Headers': 'Cache-Control'
      });

      // 调用流式市场分析API
      await aiService.callStreamingMarketAnalysisAPI(req.body, res, analysisType);
      
    } catch (error) {
      console.error('市场分析错误:', error);
      res.write(`data: ${JSON.stringify({ error: '市场分析服务暂时不可用' })}\n\n`);
      res.end();
    }
  }
);

/**
 * 出海规划API
 * POST /api/planning
 */
router.post('/planning',
  validateRequired(['companyName', 'industry', 'businessScale']),
  async (req, res, next) => {
    try {
      const { 
        companyName, 
        industry, 
        businessScale, 
        productTypes, 
        targetMarkets 
      } = req.body;

      // 生成出海规划
      const plan = generateOverseasPlan({
        companyName,
        industry,
        businessScale,
        productTypes: productTypes || [],
        targetMarkets: targetMarkets || []
      });

      res.json({
        success: true,
        plan: plan,
        timestamp: new Date().toISOString()
      });
    } catch (error) {
      next(error);
    }
  }
);

// 工具函数
function generateConversationId() {
  return 'conv_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
}

function generateMarketAnalysis(market, industry) {
  const analyses = {
    'southeastAsia': {
      overview: '东南亚市场消费增长迅速，电商渗透率不断提升',
      opportunities: ['年轻人口红利', '移动互联网普及', '中产阶级崛起'],
      challenges: ['物流基础设施差异', '支付习惯多样', '语言文化多元'],
      recommendations: ['本地化运营', '移动端优化', '社交电商布局']
    },
    'europe': {
      overview: '欧洲市场消费能力强，对品质和合规要求高',
      opportunities: ['高客单价', '品牌溢价空间', '稳定政策环境'],
      challenges: ['严格合规要求', '高运营成本', '激烈市场竞争'],
      recommendations: ['注重产品认证', '建立品牌形象', '优化客户服务']
    },
    'northAmerica': {
      overview: '北美市场规模大，电商基础设施完善',
      opportunities: ['成熟的电商生态', '高消费能力', '完善的物流网络'],
      challenges: ['激烈市场竞争', '高营销成本', '复杂的税务法规'],
      recommendations: ['差异化竞争', '内容营销', '本地仓储布局']
    },
    'general': {
      overview: '全球跨境电商市场持续增长，数字化趋势明显',
      opportunities: ['市场多元化', '技术赋能', '政策支持'],
      challenges: ['供应链管理', '文化差异', '合规风险'],
      recommendations: ['数据驱动决策', '敏捷运营', '生态合作']
    }
  };

  return analyses[market] || analyses.general;
}

function generateOverseasPlan(data) {
  const { companyName, industry, businessScale, productTypes, targetMarkets } = data;
  
  return {
    summary: {
      companyName,
      industry: getIndustryName(industry),
      businessScale: getBusinessScaleName(businessScale),
      productTypes: productTypes.map(getProductTypeName),
      targetMarkets: targetMarkets.map(getMarketName)
    },
    recommendations: {
      priorityMarkets: getPriorityMarkets(productTypes, targetMarkets),
      timeline: '6个月',
      budget: '20-50万元',
      keyTasks: [
        '市场调研与竞品分析 (第1-2周)',
        '产品合规认证申请 (第3-6周)',
        '物流方案设计与测试 (第7-8周)',
        '电商平台账号注册与优化 (第9-12周)',
        '营销推广计划制定 (第13-16周)',
        '客户服务体系建立 (第17-20周)',
        '数据监控与分析系统搭建 (第21-24周)'
      ]
    },
    riskAssessment: {
      marketRisks: ['竞争激烈', '政策变化', '汇率波动'],
      operationalRisks: ['物流延迟', '库存管理', '支付风险'],
      mitigationStrategies: [
        '多元化市场布局',
        '建立本地合作伙伴关系',
        '购买相关保险',
        '建立应急资金储备'
      ]
    }
  };
}

function getIndustryName(industry) {
  const industries = {
    'electronics': '电子产品',
    'clothing': '服装服饰',
    'home': '家居用品',
    'beauty': '美妆个护',
    'food': '食品饮料',
    'other': '其他'
  };
  return industries[industry] || industry;
}

function getBusinessScaleName(scale) {
  const scales = {
    'startup': '初创团队',
    'small': '中小规模',
    'medium': '成熟企业'
  };
  return scales[scale] || scale;
}

function getProductTypeName(product) {
  const products = {
    'consumer': '消费电子',
    'fashion': '时尚服饰',
    'home': '家居用品',
    'beauty': '美妆护肤',
    'sports': '运动户外'
  };
  return products[product] || product;
}

function getMarketName(market) {
  const markets = {
    'southeastAsia': '东南亚',
    'europe': '欧洲',
    'northAmerica': '北美',
    'middleEast': '中东'
  };
  return markets[market] || market;
}

function getPriorityMarkets(productTypes, targetMarkets) {
  if (targetMarkets.length > 0) {
    return targetMarkets.slice(0, 2).map(getMarketName);
  }
  
  // 默认推荐
  return ['东南亚', '欧洲'];
}

module.exports = router;
