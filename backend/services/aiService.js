/**
 * AI服务
 * 处理AI聊天、内容生成、市场分析等AI相关功能
 */

const axios = require('axios');
const config = require('../config');

/**
 * 调用DeepSeek API
 * @param {string} userMessage - 用户消息
 * @param {string} context - 上下文
 * @param {string} systemPrompt - 系统提示词
 * @returns {Promise<string>} AI回复
 */
const callDeepSeekAPI = async (userMessage, context = '', systemPrompt = '') => {
  try {
    const apiKey = config.ai.deepseek.apiKey;
    
    if (!apiKey) {
      console.warn('DeepSeek API密钥未配置，使用模拟回复');
      return generateAIResponse(userMessage);
    }

    const response = await axios.post(config.ai.deepseek.baseUrl, {
      model: config.ai.deepseek.model,
      messages: [
        {
          role: 'system',
          content: systemPrompt || `你是一个专业的跨境电商出海顾问，专门帮助中国企业制定出海策略。请用中文回答，提供专业、实用的建议。
          
你的专长包括：
1. 出海市场分析和选择
2. 跨境电商平台运营
3. 物流和供应链管理
4. 税务和合规要求
5. 营销和品牌建设
6. 风险管理和应对策略

请根据用户的问题提供具体、可操作的指导。`
        },
        {
          role: 'user',
          content: userMessage
        }
      ],
      max_tokens: config.ai.deepseek.maxTokens,
      temperature: config.ai.deepseek.temperature,
      stream: false
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      timeout: config.ai.deepseek.timeout
    });

    const data = response.data;
    
    if (data.choices && data.choices[0] && data.choices[0].message) {
      return data.choices[0].message.content;
    } else {
      throw new Error('DeepSeek API响应格式异常');
    }
  } catch (error) {
    console.error('DeepSeek API调用错误:', error.message);
    // 如果API调用失败，回退到模拟回复
    return generateAIResponse(userMessage);
  }
};

/**
 * 调用流式DeepSeek API
 * @param {string} userMessage - 用户消息
 * @param {Object} res - Express响应对象
 * @param {string} agent - AI代理类型
 */
const callStreamingDeepSeekAPI = async (userMessage, res, agent) => {
  try {
    const apiKey = config.ai.deepseek.apiKey;
    
    if (!apiKey) {
      console.warn('DeepSeek API密钥未配置，使用模拟流式回复');
      return simulateStreamingResponse(userMessage, res, agent);
    }

    const response = await axios.post(config.ai.deepseek.baseUrl, {
      model: config.ai.deepseek.model,
      messages: [
        {
          role: 'system',
          content: getAgentSystemPrompt(agent)
        },
        {
          role: 'user',
          content: userMessage
        }
      ],
      max_tokens: config.ai.deepseek.maxTokens,
      temperature: config.ai.deepseek.temperature,
      stream: true
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      timeout: 60000, // 60秒超时
      responseType: 'stream'
    });

    response.data.on('data', (chunk) => {
      const lines = chunk.toString().split('\n');
      
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') {
            res.write(`data: [DONE]\n\n`);
            res.end();
            return;
          }
          
          try {
            const parsed = JSON.parse(data);
            if (parsed.choices && parsed.choices[0] && parsed.choices[0].delta && parsed.choices[0].delta.content) {
              res.write(`data: ${JSON.stringify({ content: parsed.choices[0].delta.content })}\n\n`);
            }
          } catch (e) {
            // 忽略解析错误
          }
        }
      }
    });

    response.data.on('error', (error) => {
      console.error('DeepSeek流式API错误:', error);
      res.write(`data: ${JSON.stringify({ error: '流式响应中断' })}\n\n`);
      res.end();
    });

  } catch (error) {
    console.error('DeepSeek流式API调用错误:', error.message);
    // 如果API调用失败，回退到模拟流式回复
    await simulateStreamingResponse(userMessage, res, agent);
  }
};

/**
 * 调用流式市场分析API
 * @param {Object} formData - 表单数据
 * @param {Object} res - Express响应对象
 * @param {string} analysisType - 分析类型
 */
const callStreamingMarketAnalysisAPI = async (formData, res, analysisType) => {
  try {
    const apiKey = config.ai.deepseek.apiKey;
    
    if (!apiKey) {
      console.warn('DeepSeek API密钥未配置，使用模拟流式市场分析');
      return simulateStreamingMarketAnalysis(formData, res, analysisType);
    }

    const prompt = generateMarketAnalysisPrompt(formData, analysisType);
    
    const response = await axios.post(config.ai.deepseek.baseUrl, {
      model: config.ai.deepseek.model,
      messages: [
        {
          role: 'system',
          content: getMarketAnalysisSystemPrompt(analysisType)
        },
        {
          role: 'user',
          content: prompt
        }
      ],
      max_tokens: config.ai.deepseek.maxTokens,
      temperature: config.ai.deepseek.temperature,
      stream: true
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      timeout: 60000,
      responseType: 'stream'
    });

    response.data.on('data', (chunk) => {
      const lines = chunk.toString().split('\n');
      
      for (const line of lines) {
        if (line.startsWith('data: ')) {
          const data = line.slice(6);
          if (data === '[DONE]') {
            res.write(`data: [DONE]\n\n`);
            res.end();
            return;
          }
          
          try {
            const parsed = JSON.parse(data);
            if (parsed.choices && parsed.choices[0] && parsed.choices[0].delta && parsed.choices[0].delta.content) {
              res.write(`data: ${JSON.stringify({ content: parsed.choices[0].delta.content })}\n\n`);
            }
          } catch (e) {
            // 忽略解析错误
          }
        }
      }
    });

    response.data.on('error', (error) => {
      console.error('DeepSeek流式市场分析API错误:', error);
      res.write(`data: ${JSON.stringify({ error: '流式响应中断' })}\n\n`);
      res.end();
    });

  } catch (error) {
    console.error('DeepSeek流式市场分析API调用错误:', error.message);
    // 如果API调用失败，回退到模拟流式回复
    await simulateStreamingMarketAnalysis(formData, res, analysisType);
  }
};

/**
 * 获取Agent系统提示词
 * @param {string} agent - AI代理类型
 * @returns {string} 系统提示词
 */
const getAgentSystemPrompt = (agent) => {
  const prompts = {
    market_analyst: `你是专业的跨境电商市场分析师。你的职责是：
- 分析目标市场的机会和挑战
- 评估竞争格局和消费者行为
- 识别市场准入要求
- 提供风险因素分析
请用专业、结构化的方式呈现分析结果。`,
    
    strategy_planner: `你是跨境电商战略规划专家。你的职责是：
- 制定市场进入策略
- 设计产品定位和品牌建设方案
- 规划渠道布局和营销策略
- 制定实施时间表和里程碑
请提供具体可执行的战略方案。`,
    
    operation_manager: `你是跨境电商运营专家。你的职责是：
- 设计供应链管理策略
- 制定物流配送方案
- 规划仓储和客服体系
- 优化订单处理和库存管理
请提供详细的操作指南和最佳实践。`,
    
    finance_advisor: `你是跨境电商财务顾问。你的职责是：
- 制定资金预算和成本分析
- 设计收入预测模型
- 规划现金流管理
- 处理税务合规和汇率风险
请提供具体的财务数据和风险控制措施。`
  };
  
  return prompts[agent] || prompts.market_analyst;
};

/**
 * 生成市场分析提示词
 * @param {Object} formData - 表单数据
 * @param {string} analysisType - 分析类型
 * @returns {string} 提示词
 */
const generateMarketAnalysisPrompt = (formData, analysisType) => {
  const marketNames = {
    'north-america': '北美市场（美国、加拿大）',
    'europe': '欧洲市场（欧盟、英国）',
    'southeast-asia': '东南亚市场（新加坡、马来西亚等）',
    'middle-east': '中东市场（阿联酋、沙特等）',
    'latin-america': '拉美市场（巴西、墨西哥等）',
    'africa': '非洲市场（南非、尼日利亚等）'
  };

  const productNames = {
    'electronics': '电子产品',
    'fashion': '服装服饰',
    'home': '家居用品',
    'beauty': '美妆个护',
    'food': '食品饮料',
    'sports': '运动户外'
  };

  const companyNames = {
    'startup': '初创企业',
    'small': '中小企业',
    'medium': '中型企业',
    'large': '大型企业'
  };

  return `请基于以下企业信息进行${analysisType}分析：

企业信息：
- 企业规模：${companyNames[formData.companySize] || formData.companySize}
- 产品类别：${productNames[formData.productCategory] || formData.productCategory}
- 目标市场：${marketNames[formData.targetMarket] || formData.targetMarket}
- 预算范围：${formData.budget || '未指定'}
- 时间计划：${formData.timeline || '未指定'}
- 出海经验：${formData.experience || '未指定'}

请提供专业、详细的分析报告，使用Markdown格式，包含数据、图表描述和具体建议。`;
};

/**
 * 获取市场分析系统提示词
 * @param {string} analysisType - 分析类型
 * @returns {string} 系统提示词
 */
const getMarketAnalysisSystemPrompt = (analysisType) => {
  const prompts = {
    market_size: `你是专业的市场分析师。你的职责是：
- 分析目标市场的规模、增长趋势和市场潜力
- 提供TAM/SAM/SOM分析
- 评估市场成熟度和发展阶段
- 识别新兴机会和增长点
请用专业、结构化的方式呈现市场规模分析结果。`,
    
    competition: `你是竞争分析专家。你的职责是：
- 识别主要竞争对手和市场参与者
- 评估竞争强度和竞争格局
- 分析市场份额分布
- 发现差异化机会和竞争壁垒
请提供详细的竞争环境分析报告。`,
    
    consumer: `你是消费者洞察专家。你的职责是：
- 构建目标用户画像
- 分析消费者购买行为和决策路径
- 研究消费偏好和需求趋势
- 评估价格敏感度和消费能力
请提供深入的消费者洞察分析。`,
    
    access: `你是市场准入专家。你的职责是：
- 分析法规合规要求和认证标准
- 解读税务政策和关税情况
- 评估物流基础设施和配送网络
- 识别准入壁垒和解决方案
请提供全面的市场准入分析。`,
    
    risk: `你是风险评估专家。你的职责是：
- 识别政治、经济、竞争、运营等多维度风险
- 量化风险等级和影响程度
- 分析风险关联性和传导机制
- 提供风险缓解和应对策略
请提供专业的风险评估报告。`
  };
  
  return prompts[analysisType] || prompts.market_size;
};

/**
 * 模拟AI回复生成
 * @param {string} userMessage - 用户消息
 * @returns {string} 模拟回复
 */
const generateAIResponse = (userMessage) => {
  const responses = {
    '出海规划': '我可以帮您制定出海规划！请告诉我：\n1. 您的公司/个人名称\n2. 主营行业\n3. 当前业务规模\n4. 主要产品类型\n5. 目标市场偏好\n\n我会基于这些信息为您生成个性化的出海路线图。',

    '市场分析': '市场分析需要考虑多个维度：\n- 市场规模和增长趋势\n- 竞争格局分析\n- 消费者行为特点\n- 政策法规环境\n- 物流和支付基础设施\n\n请告诉我您关注的具体市场或行业，我可以为您提供详细分析。',

    '物流方案': '跨境电商物流方案主要有：\n1. 国际快递（DHL、FedEx、UPS）- 时效快，成本高\n2. 专线物流 - 性价比高，时效适中\n3. 海外仓 - 本地发货，体验好\n4. 邮政小包 - 成本低，时效慢\n\n根据您的产品特性和预算，我可以推荐最适合的方案。',

    'default': `感谢您的咨询！关于"${userMessage}"，这是一个很好的问题。\n\n基于跨境电商的最佳实践，我建议：\n1. 先进行详细的市场调研，了解目标市场的消费习惯和竞争情况\n2. 了解目标市场的准入要求和合规标准\n3. 制定具体的实施计划和时间表\n4. 准备相应的资源和预算\n\n您想深入了解哪个方面？我可以为您提供更具体的指导。`
  };

  // 关键词匹配
  for (const [keyword, response] of Object.entries(responses)) {
    if (userMessage.includes(keyword) && keyword !== 'default') {
      return response;
    }
  }

  return responses.default;
};

/**
 * 模拟流式响应（当API不可用时）
 * @param {string} userMessage - 用户消息
 * @param {Object} res - Express响应对象
 * @param {string} agent - AI代理类型
 */
const simulateStreamingResponse = async (userMessage, res, agent) => {
  const mockResponse = generateAgentMockResponse(userMessage, agent);
  const words = mockResponse.split('');
  
  for (let i = 0; i < words.length; i++) {
    res.write(`data: ${JSON.stringify({ content: words[i] })}\n\n`);
    await new Promise(resolve => setTimeout(resolve, 50)); // 模拟打字效果
  }
  
  res.write(`data: [DONE]\n\n`);
  res.end();
};

/**
 * 模拟流式市场分析响应
 * @param {Object} formData - 表单数据
 * @param {Object} res - Express响应对象
 * @param {string} analysisType - 分析类型
 */
const simulateStreamingMarketAnalysis = async (formData, res, analysisType) => {
  const mockResponse = generateMarketAnalysisMockResponse(formData, analysisType);
  const words = mockResponse.split('');
  
  for (let i = 0; i < words.length; i++) {
    res.write(`data: ${JSON.stringify({ content: words[i] })}\n\n`);
    await new Promise(resolve => setTimeout(resolve, 30)); // 模拟打字效果
  }
  
  res.write(`data: [DONE]\n\n`);
  res.end();
};

/**
 * 生成Agent模拟回复
 * @param {string} userMessage - 用户消息
 * @param {string} agent - AI代理类型
 * @returns {string} 模拟回复
 */
const generateAgentMockResponse = (userMessage, agent) => {
  const responses = {
    market_analyst: `基于您提供的信息，我为您进行以下市场分析：

## 🎯 目标市场机会分析

根据您的产品类型和预算范围，我建议重点关注以下市场：

### 🌏 东南亚市场
- **优势**：消费增长迅速，电商渗透率不断提升
- **特点**：年轻人口红利，移动互联网普及
- **建议**：本地化运营，移动端优化

### 🇪🇺 欧洲市场
- **优势**：消费能力强，对品质要求高
- **特点**：高客单价，品牌溢价空间大
- **建议**：注重产品认证，建立品牌形象

### 🇺🇸 北美市场
- **优势**：市场规模大，基础设施完善
- **特点**：成熟的电商生态，高消费能力
- **建议**：差异化竞争，内容营销

## ⚔️ 竞争格局评估

当前市场竞争激烈，建议采用以下策略：

| 策略类型 | 具体措施 | 预期效果 |
|---------|---------|---------|
| 产品创新 | 突出独特卖点 | 提升竞争力 |
| 价格策略 | 根据目标市场定位 | 优化利润空间 |
| 服务优势 | 提供优质客户体验 | 增强用户粘性 |

## 👥 消费者行为洞察

目标消费者特征分析：

- **购买偏好**：注重产品质量和品牌信誉
- **价格敏感度**：适中，愿意为品质付费
- **购物习惯**：偏好便捷的购物体验
- **决策因素**：产品评价 > 价格 > 品牌

## 📋 市场准入要求

### 合规要求
- 产品认证和合规要求
- 税务和关税政策
- 支付和物流基础设施

### 技术标准
- CE认证（欧洲）
- FCC认证（美国）
- 当地安全标准

## ⚠️ 风险因素识别

> **重要提醒**：出海前务必制定完善的风险应对策略

### 主要风险类型
1. **汇率波动风险** - 影响成本和利润
2. **政策变化风险** - 影响市场准入
3. **竞争加剧风险** - 影响市场份额
4. **供应链中断风险** - 影响产品供应

### 风险应对建议
- 建立多元化市场布局
- 购买相关保险产品
- 建立应急资金储备
- 与当地合作伙伴建立关系`,

    strategy_planner: `基于市场分析，我为您制定以下出海策略：

## 🚀 市场进入策略

建议采用**渐进式进入策略**，分三个阶段实施：

### 第一阶段：试点验证 (1-2个月)
- 选择1-2个核心市场进行试点
- 验证产品市场适配性
- 测试运营流程和成本结构

### 第二阶段：市场扩展 (3-4个月)
- 根据试点结果扩展市场
- 优化产品和运营策略
- 建立稳定的供应链体系

### 第三阶段：全面布局 (5-6个月)
- 全面布局目标市场
- 建立品牌影响力
- 实现规模化运营

## 🎯 产品定位策略

### 核心定位
- **品质定位**：高品质、高性价比
- **差异化优势**：独特设计、优质服务
- **目标客群**：中高端消费者

### 竞争策略

**优势分析：**
✅ 产品创新能力强
✅ 供应链成本优势
✅ 服务响应速度快

**挑战应对：**
⚠️ 品牌知名度不足 → 加大营销投入
⚠️ 本地化程度低 → 建立本地团队
⚠️ 合规要求复杂 → 聘请专业顾问

## 🏷️ 品牌建设规划

### 品牌理念
- **专业**：行业专业知识和服务能力
- **可靠**：稳定的产品质量和服务
- **创新**：持续的产品和技术创新

### 传播策略
| 渠道类型 | 具体平台 | 目标效果 |
|---------|---------|---------|
| 社交媒体 | Facebook, Instagram, TikTok | 品牌曝光 |
| 搜索引擎 | Google Ads, SEO | 流量获取 |
| 内容营销 | 博客, 视频, 案例 | 用户教育 |

## 📊 渠道布局方案

### 线上渠道
- **主流电商平台**：Amazon, eBay, Shopify
- **本地电商平台**：根据目标市场选择
- **自建官网**：品牌展示和直接销售

### 线下渠道
- **合作伙伴**：与当地分销商合作
- **零售渠道**：入驻当地零售店铺
- **展会营销**：参加行业展会

## 📈 营销推广策略

### 内容营销
> 通过优质内容建立品牌权威性和用户信任

- **社交媒体推广**：定期发布产品资讯
- **KOL合作**：与当地意见领袖合作
- **用户案例**：展示成功案例和用户反馈

### 搜索引擎优化
- **关键词优化**：针对目标市场关键词
- **本地化SEO**：优化本地搜索排名
- **技术SEO**：提升网站性能和体验

## ⏰ 6个月实施时间表

### 第1-2月：基础建设期
- [ ] 完成市场调研报告
- [ ] 产品合规认证申请
- [ ] 建立供应链体系
- [ ] 制定详细运营计划

### 第3-4月：平台入驻期
- [ ] 成功入驻目标平台
- [ ] 完成品牌注册和设计
- [ ] 建立客服体系
- [ ] 开始试运营

### 第5-6月：营销推广期
- [ ] 启动营销推广活动
- [ ] 优化运营流程
- [ ] 分析数据并调整策略
- [ ] 准备下一阶段扩张

## 🎯 关键里程碑设定

### 短期目标 (3个月内)
- ✅ 完成市场调研报告
- ✅ 成功入驻目标平台
- ✅ 实现首月销售目标

### 中期目标 (6个月内)
- 🎯 建立稳定供应链
- 🎯 实现盈亏平衡
- 🎯 建立品牌知名度

### 长期目标 (12个月内)
- 🚀 成为细分市场领导者
- 🚀 实现规模化盈利
- 🚀 准备新市场扩张`,

    operation_manager: `作为运营专家，我为您设计以下运营方案：

## 供应链管理策略
- 供应商选择：建立多元化供应商体系
- 质量控制：实施严格的质检流程
- 库存管理：采用JIT库存管理模式
- 成本控制：优化采购成本结构

## 物流配送方案
- 国际物流：选择可靠的物流合作伙伴
- 仓储布局：在目标市场设立海外仓
- 配送时效：承诺3-7天配送时效
- 退换货：建立便捷的退换货流程

## 仓储管理规划
- 仓库选址：靠近主要消费城市
- 库存系统：使用先进的WMS系统
- 分拣效率：优化分拣和包装流程
- 安全措施：确保货物安全存储

## 客服体系建设
- 多语言支持：提供当地语言客服
- 响应时间：承诺24小时内回复
- 服务标准：制定统一的服务标准
- 培训体系：定期培训客服人员

## 订单处理流程
- 订单接收：自动化订单处理系统
- 库存检查：实时库存状态更新
- 发货通知：及时发送物流信息
- 售后服务：完善的售后服务体系

## 库存管理策略
- 安全库存：设定合理的安全库存水平
- 补货机制：建立自动补货机制
- 滞销处理：制定滞销商品处理方案
- 盘点制度：定期进行库存盘点

## 质量管控体系
- 供应商审核：严格的供应商准入标准
- 产品检验：多层次的质量检验
- 客户反馈：建立客户反馈机制
- 持续改进：定期优化质量管理流程`,

    finance_advisor: `作为财务顾问，我为您制定以下财务规划：

## 启动资金预算
基于您的预算范围，建议资金分配：
- 产品采购：40-50%
- 营销推广：20-30%
- 运营成本：15-20%
- 应急资金：10-15%

## 运营成本分析
月度运营成本预估：
- 平台费用：销售额的3-8%
- 物流成本：订单金额的10-15%
- 营销费用：销售额的5-10%
- 人员成本：固定支出
- 其他费用：2-3%

## 收入预测模型
基于市场分析，预期收入增长：
- 第1-3月：建立基础，收入较低
- 第4-6月：快速增长期
- 第7-12月：稳定增长期
预期12个月内实现盈亏平衡

## 现金流管理
- 收款周期：平台结算周期7-15天
- 付款管理：优化供应商付款周期
- 资金预测：建立现金流预测模型
- 风险控制：保持3个月运营资金储备

## 税务合规方案
- 注册要求：在目标市场注册公司
- 税务申报：按时申报各类税费
- 合规成本：预算税务合规成本
- 专业服务：聘请当地税务顾问

## 汇率风险管理
- 汇率监控：实时监控汇率变化
- 对冲策略：使用金融工具对冲风险
- 定价策略：考虑汇率波动的定价
- 资金管理：分散货币风险

## 投资回报分析
预期投资回报：
- 投资回收期：12-18个月
- 年化收益率：20-30%
- 风险等级：中等风险
- 退出策略：持续运营或转让

建议定期评估财务表现，及时调整策略。`
  };
  
  return responses[agent] || responses.market_analyst;
};

/**
 * 生成市场分析模拟回复
 * @param {Object} formData - 表单数据
 * @param {string} analysisType - 分析类型
 * @returns {string} 模拟回复
 */
const generateMarketAnalysisMockResponse = (formData, analysisType) => {
  const marketNames = {
    'north-america': '北美市场',
    'europe': '欧洲市场',
    'southeast-asia': '东南亚市场',
    'middle-east': '中东市场',
    'latin-america': '拉美市场',
    'africa': '非洲市场'
  };

  const productNames = {
    'electronics': '电子产品',
    'fashion': '服装服饰',
    'home': '家居用品',
    'beauty': '美妆个护',
    'food': '食品饮料',
    'sports': '运动户外'
  };

  const responses = {
    market_size: `## 📊 市场规模分析报告

基于您提供的信息，我为您分析${marketNames[formData.targetMarket]}的${productNames[formData.productCategory]}市场规模：

### 🎯 市场容量评估

**总体可服务市场 (TAM)**
- 市场规模：约 **150亿美元**
- 年增长率：**8-12%**
- 主要驱动因素：消费升级、电商普及

**可服务可获得市场 (SAM)**
- 目标市场：约 **45亿美元**
- 占比TAM：**30%**
- 增长潜力：**高**

**可服务可获得市场 (SOM)**
- 可获取份额：约 **2-5亿美元**
- 占比SAM：**5-10%**
- 进入难度：**中等**

### 📈 增长趋势分析

| 年份 | 市场规模(亿美元) | 增长率 | 主要趋势 |
|------|----------------|--------|----------|
| 2023 | 135 | 9.5% | 电商渗透率提升 |
| 2024 | 148 | 9.6% | 消费升级加速 |
| 2025 | 163 | 10.1% | 新兴渠道增长 |

### 🌟 市场机会识别

**高增长细分领域：**
- ✅ 智能家居产品：年增长15%+
- ✅ 个性化定制：年增长20%+
- ✅ 环保产品：年增长18%+

**新兴趋势：**
- 🔥 直播电商崛起
- 🔥 社交购物增长
- 🔥 可持续发展需求

### 💡 市场进入建议

基于市场规模分析，建议：

1. **优先级市场**：重点关注高增长细分领域
2. **进入时机**：当前市场处于成长期，适合进入
3. **规模预期**：3年内可实现2-3亿美元收入目标
4. **投资建议**：建议投资预算的40-50%用于市场拓展`,

    competition: `## ⚔️ 竞争环境分析报告

针对${marketNames[formData.targetMarket]}的${productNames[formData.productCategory]}市场竞争分析：

### 🏆 主要竞争对手

**第一梯队（市场份额>20%）**
- **Amazon**：市场份额35%，优势：平台生态、物流网络
- **Shopify**：市场份额25%，优势：商家工具、支付系统

**第二梯队（市场份额5-20%）**
- **Walmart**：市场份额12%，优势：线下资源、供应链
- **Target**：市场份额8%，优势：品牌定位、客户体验

**第三梯队（市场份额<5%）**
- 众多中小型平台和独立站
- 新兴垂直电商平台

### 📊 竞争强度评估

**竞争强度：中等偏上**

| 维度 | 评分(1-10) | 说明 |
|------|-----------|------|
| 市场集中度 | 7 | 头部企业占据主要份额 |
| 价格竞争 | 6 | 价格战较为激烈 |
| 产品差异化 | 8 | 产品创新空间较大 |
| 进入壁垒 | 7 | 需要一定资源投入 |

### 🎯 竞争策略分析

**头部企业优势：**
- 强大的资金实力和品牌影响力
- 完善的供应链和物流网络
- 丰富的用户数据和营销资源

**中小型竞争者劣势：**
- 资源有限，难以大规模投入
- 品牌知名度不足
- 供应链成本较高

### 💡 差异化机会

**产品层面：**
- 🎨 个性化定制服务
- 🌱 环保可持续发展产品
- 🚀 技术创新和智能化

**服务层面：**
- 📞 24/7客户服务
- 🚚 快速配送服务
- 💬 多语言客服支持

**营销层面：**
- 📱 社交媒体营销
- 🎬 内容营销和KOL合作
- 🎁 会员体系和忠诚度计划

### 🚨 竞争风险预警

**主要风险：**
1. **价格战风险**：大型平台可能发起价格战
2. **资源竞争**：优质供应商资源争夺激烈
3. **技术壁垒**：头部企业技术优势明显

**应对策略：**
- 建立差异化产品定位
- 培养核心供应商关系
- 持续技术创新投入`,

    consumer: `## 👥 消费者洞察分析报告

${marketNames[formData.targetMarket]}的${productNames[formData.productCategory]}消费者深度分析：

### 🎭 目标用户画像

**核心用户群体：**
- **年龄分布**：25-45岁（占比65%）
- **收入水平**：中高收入（月收入$3000-8000）
- **教育背景**：大专及以上学历（占比78%）
- **职业特征**：白领、专业人士、小企业主

**消费行为特征：**
- 💳 **支付偏好**：信用卡(45%) > 数字钱包(35%) > 银行转账(20%)
- 📱 **购物渠道**：移动端(60%) > 桌面端(40%)
- 🕒 **购物时间**：工作日晚上(35%) > 周末(40%) > 工作日白天(25%)

### 🛒 购买决策路径

**发现阶段：**
1. 社交媒体推荐 (40%)
2. 搜索引擎搜索 (30%)
3. 朋友推荐 (20%)
4. 广告推送 (10%)

**考虑阶段：**
- 产品评价和评分 (权重35%)
- 价格对比 (权重25%)
- 品牌信誉 (权重20%)
- 配送服务 (权重20%)

**购买阶段：**
- 促销活动影响 (45%)
- 库存紧张感 (30%)
- 客服响应速度 (25%)

### 💰 价格敏感度分析

**价格敏感度：中等**

| 价格区间 | 接受度 | 主要用户群体 |
|----------|--------|-------------|
| 低端($10-50) | 85% | 学生、初入职场 |
| 中端($50-200) | 70% | 中产阶级、白领 |
| 高端($200+) | 45% | 高收入群体、专业人士 |

**价格弹性：-0.8**（价格下降10%，需求增长8%）

### 🎯 消费偏好研究

**产品偏好：**
- 🏆 **品质优先**：78%用户愿意为品质支付溢价
- 🌱 **环保意识**：65%用户关注产品环保性
- 🎨 **个性化**：52%用户偏好定制化产品
- 🚀 **科技感**：45%用户喜欢智能化产品

**服务偏好：**
- 📞 **客服支持**：多语言客服需求强烈
- 🚚 **配送服务**：快速配送(2-3天)期望值高
- 💬 **沟通方式**：在线聊天、邮件、电话
- 🔄 **退换货**：便捷的退换货政策

### 📊 消费者满意度指标

**关键指标：**
- 产品满意度：4.2/5.0
- 服务质量：4.0/5.0
- 配送速度：3.8/5.0
- 价格合理性：4.1/5.0

**改进建议：**
- 提升配送服务体验
- 优化产品包装和说明
- 加强售后服务响应速度
- 提供更多个性化选择`,

    access: `## 🚪 市场准入分析报告

${marketNames[formData.targetMarket]}的${productNames[formData.productCategory]}市场准入详细分析：

### 📋 法规合规要求

**产品认证标准：**
- **CE认证**（欧洲）：强制性产品安全认证
- **FCC认证**（美国）：电子产品电磁兼容认证
- **RoHS认证**：环保材料使用标准
- **ISO认证**：质量管理体系认证

**合规时间周期：**
- CE认证：3-6个月
- FCC认证：2-4个月
- RoHS认证：1-2个月
- ISO认证：6-12个月

### 💰 税务政策解读

**关税税率：**
- 基础税率：5-15%
- 优惠税率：0-8%（自由贸易协定）
- 反倾销税：可能额外征收15-25%

**增值税政策：**
- 标准税率：20-25%
- 跨境电商税率：10-15%
- 小包免税额度：$150-800

**税务合规要求：**
- 📊 定期税务申报（月度/季度）
- 🏢 在当地设立税务实体
- 📝 保持完整的交易记录
- 🤝 与当地税务顾问合作

### 🚚 物流基础设施

**主要物流渠道：**

| 渠道类型 | 时效 | 成本 | 适用产品 |
|----------|------|------|----------|
| 国际快递 | 3-7天 | 高 | 高价值、紧急 |
| 专线物流 | 7-15天 | 中 | 标准产品 |
| 海运 | 20-40天 | 低 | 大宗货物 |
| 空运 | 5-10天 | 中高 | 时效要求高 |

**仓储网络：**
- 🏢 **主要城市**：覆盖率85%
- 📦 **仓储容量**：总容量500万平米
- 🚚 **配送范围**：2-3天覆盖主要城市
- 💾 **库存管理**：支持实时库存查询

### 🛡️ 准入壁垒分析

**技术壁垒：**
- 产品认证要求严格
- 技术标准门槛较高
- 需要本地技术支持

**资金壁垒：**
- 认证费用：$10,000-50,000
- 仓储费用：$5,000-20,000/月
- 营销投入：$50,000-200,000/年

**渠道壁垒：**
- 优质渠道资源稀缺
- 需要建立本地合作关系
- 品牌认知度要求高

### 💡 准入策略建议

**分阶段进入策略：**
1. **第一阶段**：产品认证和合规准备（3-6个月）
2. **第二阶段**：建立物流和仓储网络（2-4个月）
3. **第三阶段**：渠道合作和品牌建设（3-6个月）
4. **第四阶段**：市场推广和运营优化（持续）

**关键成功因素：**
- ✅ 提前进行产品认证
- ✅ 建立可靠的物流伙伴关系
- ✅ 聘请当地合规顾问
- ✅ 制定详细的准入时间表`,

    risk: `## ⚠️ 风险评估报告

${marketNames[formData.targetMarket]}的${productNames[formData.productCategory]}市场风险全面评估：

### 🏛️ 政治风险 (风险等级：中等)

**主要风险因素：**
- **政策变化风险**：贸易政策可能调整
- **汇率波动风险**：货币汇率不稳定
- **地缘政治风险**：国际关系紧张

**风险影响评估：**
- 影响程度：中等
- 发生概率：30-40%
- 应对难度：中等

**缓解措施：**
- 🔄 建立多元化市场布局
- 💱 使用汇率对冲工具
- 📊 持续监控政策变化

### 💰 经济风险 (风险等级：中等)

**主要风险因素：**
- **经济衰退风险**：消费需求下降
- **通胀风险**：成本上升压力
- **利率风险**：融资成本变化

**风险量化分析：**
- GDP增长预期：2-3%（低于历史平均）
- 通胀率：3-5%（高于目标值）
- 失业率：5-7%（相对稳定）

**应对策略：**
- 💰 建立应急资金储备
- 📈 优化成本结构
- 🎯 调整产品定价策略

### ⚔️ 竞争风险 (风险等级：高)

**主要风险因素：**
- **新进入者威胁**：市场门槛相对较低
- **价格战风险**：大平台可能发起价格战
- **技术颠覆风险**：新技术可能改变竞争格局

**竞争强度评估：**
- 市场集中度：中等
- 产品差异化：较高
- 进入壁垒：中等
- 退出壁垒：较低

**竞争策略：**
- 🎯 建立差异化优势
- 💪 提升核心竞争力
- 🤝 建立战略合作关系

### 🏭 运营风险 (风险等级：中等)

**供应链风险：**
- **供应商依赖**：关键供应商集中度较高
- **质量控制**：产品质量稳定性要求高
- **物流中断**：运输和配送可能受影响

**运营效率风险：**
- **库存管理**：库存周转率要求高
- **客户服务**：服务质量标准严格
- **技术系统**：IT系统稳定性重要

**风险控制措施：**
- 📦 建立多元化供应商体系
- 🔍 实施严格的质量控制
- 🚚 建立备用物流方案
- 💻 投资IT基础设施

### 📊 综合风险评分

| 风险类型 | 影响程度 | 发生概率 | 综合评分 | 优先级 |
|----------|----------|----------|----------|--------|
| 政治风险 | 6 | 4 | 5.0 | 中等 |
| 经济风险 | 7 | 5 | 6.0 | 高 |
| 竞争风险 | 8 | 6 | 7.0 | 高 |
| 运营风险 | 6 | 5 | 5.5 | 中等 |

**总体风险等级：中等偏高**

### 🛡️ 风险应对框架

**风险监控：**
- 📊 建立风险监控指标体系
- 🔔 设置风险预警机制
- 📅 定期风险评估和更新

**风险缓解：**
- 💰 购买相关保险产品
- 🤝 建立风险分担机制
- 🔄 制定应急预案

**风险转移：**
- 🏢 与保险公司合作
- 🤝 建立战略合作伙伴关系
- 💼 考虑风险投资或融资

### 💡 风险管控建议

**短期措施（1-6个月）：**
- 建立基础风险监控体系
- 购买必要的保险产品
- 建立应急资金储备

**中期措施（6-18个月）：**
- 完善供应链风险管理
- 建立多元化市场布局
- 提升核心竞争力

**长期措施（18个月以上）：**
- 建立完善的风险管理体系
- 实现风险智能化管理
- 构建风险应对生态圈`
  };

  return responses[analysisType] || responses.market_size;
};

module.exports = {
  callDeepSeekAPI,
  callStreamingDeepSeekAPI,
  callStreamingMarketAnalysisAPI,
  generateAIResponse
};
