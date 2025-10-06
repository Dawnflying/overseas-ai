const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const compression = require('compression');
const rateLimit = require('express-rate-limit');
const multer = require('multer');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// JWT配置
const JWT_SECRET = process.env.JWT_SECRET || 'overseas-ai-platform-secret-key-2024';
const JWT_EXPIRES_IN = '10h'; // 10小时过期

// 内存存储用户会话（生产环境应使用Redis或数据库）
const userSessions = new Map();
const userDatabase = new Map(); // 模拟用户数据库

// 初始化默认用户
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

// 初始化默认用户
initDefaultUsers();

// JWT认证中间件
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) {
    return res.status(401).json({ error: '访问令牌缺失' });
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
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
};

// 生成JWT令牌
const generateToken = (user) => {
  return jwt.sign(
    { 
      id: user.id, 
      email: user.email, 
      name: user.name,
      company: user.company,
      role: user.role 
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
};

// 创建用户会话
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

// 更新用户会话活动时间
const updateUserSession = (userId) => {
  const session = userSessions.get(userId);
  if (session) {
    session.lastActivity = Date.now();
    userSessions.set(userId, session);
  }
};

// 清理过期会话
const cleanupExpiredSessions = () => {
  const now = Date.now();
  for (const [userId, session] of userSessions.entries()) {
    if (session.expiresAt < now) {
      userSessions.delete(userId);
    }
  }
};

// 定期清理过期会话（每30分钟执行一次）
setInterval(cleanupExpiredSessions, 30 * 60 * 1000);

// Multer配置 - 用于文件上传
const storage = multer.memoryStorage();
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB限制
  },
  fileFilter: (req, file, cb) => {
    // 只允许图片文件
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('只允许上传图片文件'), false);
    }
  }
});

// 中间件配置
app.use(helmet({
  contentSecurityPolicy: false, // 在前端处理CSP
  crossOriginEmbedderPolicy: false
}));
app.use(cors({
  origin: [
    'http://localhost:5173',
    'http://localhost:3001',
    'http://localhost:3002',
    'http://localhost:80',
    process.env.FRONTEND_URL
  ].filter(Boolean),
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With']
}));
app.use(compression());
app.use(morgan('combined'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// 速率限制
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15分钟
  max: 100, // 限制每个IP 15分钟内最多100个请求
  message: {
    error: '请求过于频繁，请稍后再试'
  }
});
app.use(limiter);

// 健康检查端点
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage()
  });
});

// 认证相关API端点
// 用户登录
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: '邮箱和密码不能为空' });
    }

    // 查找用户
    const user = userDatabase.get(email);
    if (!user) {
      return res.status(401).json({ error: '邮箱或密码错误' });
    }

    // 验证密码
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return res.status(401).json({ error: '邮箱或密码错误' });
    }

    // 生成JWT令牌
    const token = generateToken(user);
    
    // 创建用户会话
    const session = createUserSession(user);

    // 返回用户信息和令牌
    res.json({
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
    });
  } catch (error) {
    console.error('登录错误:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

// 用户注册
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password, name, company } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: '邮箱、密码和姓名不能为空' });
    }

    // 检查用户是否已存在
    if (userDatabase.has(email)) {
      return res.status(409).json({ error: '该邮箱已被注册' });
    }

    // 密码强度检查
    if (password.length < 6) {
      return res.status(400).json({ error: '密码长度至少6位' });
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

    res.status(201).json({
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
    });
  } catch (error) {
    console.error('注册错误:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

// 验证令牌
app.get('/api/auth/verify', authenticateToken, (req, res) => {
  try {
    // 更新用户会话活动时间
    updateUserSession(req.user.id);
    
    res.json({
      success: true,
      message: '令牌有效',
      data: {
        user: {
          id: req.user.id,
          email: req.user.email,
          name: req.user.name,
          company: req.user.company,
          role: req.user.role
        }
      }
    });
  } catch (error) {
    console.error('令牌验证错误:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

// 用户登出
app.post('/api/auth/logout', authenticateToken, (req, res) => {
  try {
    // 删除用户会话
    userSessions.delete(req.user.id);
    
    res.json({
      success: true,
      message: '登出成功'
    });
  } catch (error) {
    console.error('登出错误:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

// 获取用户信息
app.get('/api/auth/profile', authenticateToken, (req, res) => {
  try {
    // 更新用户会话活动时间
    updateUserSession(req.user.id);
    
    res.json({
      success: true,
      data: {
        user: {
          id: req.user.id,
          email: req.user.email,
          name: req.user.name,
          company: req.user.company,
          role: req.user.role
        }
      }
    });
  } catch (error) {
    console.error('获取用户信息错误:', error);
    res.status(500).json({ error: '服务器内部错误' });
  }
});

// AI聊天API
app.post('/ai/chat', async (req, res) => {
  try {
    const { message, conversationId, context } = req.body;
    
    if (!message) {
      return res.status(400).json({
        error: '消息内容不能为空'
      });
    }

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

    // 调用真实的DeepSeek API
    const aiResponse = await callDeepSeekAPI(message, context, systemPrompt);
    
    res.json({
      response: aiResponse,
      conversationId: conversationId || generateConversationId(),
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('AI聊天错误:', error);
    res.status(500).json({
      error: 'AI服务暂时不可用，请稍后再试'
    });
  }
});

// AI流式聊天API
app.post('/ai/stream', async (req, res) => {
  try {
    const { message, agent, conversationId } = req.body;
    
    if (!message) {
      return res.status(400).json({
        error: '消息内容不能为空'
      });
    }

    // 设置SSE响应头
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Cache-Control'
    });

    // 调用流式DeepSeek API
    await callStreamingDeepSeekAPI(message, res, agent);
    
  } catch (error) {
    console.error('AI流式聊天错误:', error);
    res.write(`data: ${JSON.stringify({ error: 'AI服务暂时不可用，请稍后再试' })}\n\n`);
    res.end();
  }
});

// 出海规划API
app.post('/api/planning', async (req, res) => {
  try {
    const { 
      companyName, 
      industry, 
      businessScale, 
      productTypes, 
      targetMarkets 
    } = req.body;

    // 验证必填字段
    if (!companyName || !industry || !businessScale) {
      return res.status(400).json({
        error: '请填写必填字段'
      });
    }

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
    console.error('规划生成错误:', error);
    res.status(500).json({
      error: '规划生成失败，请稍后再试'
    });
  }
});

// 市场分析API (GET - 兼容旧版本)
app.get('/api/market-analysis', async (req, res) => {
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
    console.error('市场分析错误:', error);
    res.status(500).json({
      error: '市场分析服务暂时不可用'
    });
  }
});

// 市场分析API (POST - 流式版本)
app.post('/api/market-analysis', async (req, res) => {
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
    
    if (!targetMarket || !productCategory || !analysisType) {
      return res.status(400).json({
        error: '缺少必要参数：targetMarket, productCategory, analysisType'
      });
    }

    // 设置SSE响应头
    res.writeHead(200, {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Cache-Control'
    });

    // 调用流式市场分析API
    await callStreamingMarketAnalysisAPI(req.body, res, analysisType);
    
  } catch (error) {
    console.error('市场分析错误:', error);
    res.write(`data: ${JSON.stringify({ error: '市场分析服务暂时不可用' })}\n\n`);
    res.end();
  }
});

// 模拟AI回复生成
function generateAIResponse(userMessage) {
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
}

// 生成出海规划
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

// 生成市场分析
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

// 调用DeepSeek API
async function callDeepSeekAPI(userMessage) {
  try {
    const apiKey = process.env.DEEPSEEK_API_KEY;
    
    if (!apiKey) {
      console.warn('DeepSeek API密钥未配置，使用模拟回复');
      return generateAIResponse(userMessage);
    }

    const axios = require('axios');
    
    const response = await axios.post('https://api.deepseek.com/chat/completions', {
      model: 'deepseek-chat',
      messages: [
        {
          role: 'system',
          content: `你是一个专业的跨境电商出海顾问，专门帮助中国企业制定出海策略。请用中文回答，提供专业、实用的建议。
          
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
      max_tokens: 2000,
      temperature: 0.7,
      stream: false
    }, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${apiKey}`
      },
      timeout: 30000 // 30秒超时
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
}

// 调用流式市场分析API
async function callStreamingMarketAnalysisAPI(formData, res, analysisType) {
  try {
    const apiKey = process.env.DEEPSEEK_API_KEY;
    
    if (!apiKey) {
      console.warn('DeepSeek API密钥未配置，使用模拟流式市场分析');
      return simulateStreamingMarketAnalysis(formData, res, analysisType);
    }

    const axios = require('axios');
    
    const prompt = generateMarketAnalysisPrompt(formData, analysisType);
    
    const response = await axios.post('https://api.deepseek.com/chat/completions', {
      model: 'deepseek-chat',
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
      max_tokens: 2000,
      temperature: 0.7,
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
}

// 调用流式DeepSeek API
async function callStreamingDeepSeekAPI(userMessage, res, agent) {
  try {
    const apiKey = process.env.DEEPSEEK_API_KEY;
    
    if (!apiKey) {
      console.warn('DeepSeek API密钥未配置，使用模拟流式回复');
      return simulateStreamingResponse(userMessage, res, agent);
    }

    const axios = require('axios');

    console.log('call deepseek api');
    
    const response = await axios.post('https://api.deepseek.com/chat/completions', {
      model: 'deepseek-chat',
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
      max_tokens: 2000,
      temperature: 0.7,
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
}

// 获取Agent系统提示词
function getAgentSystemPrompt(agent) {
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
}

// 模拟流式响应（当API不可用时）
async function simulateStreamingResponse(userMessage, res, agent) {
  const mockResponse = generateAgentMockResponse(userMessage, agent);
  const words = mockResponse.split('');
  
  for (let i = 0; i < words.length; i++) {
    res.write(`data: ${JSON.stringify({ content: words[i] })}\n\n`);
    await new Promise(resolve => setTimeout(resolve, 50)); // 模拟打字效果
  }
  
  res.write(`data: [DONE]\n\n`);
  res.end();
}

// 生成市场分析提示词
function generateMarketAnalysisPrompt(formData, analysisType) {
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
}

// 获取市场分析系统提示词
function getMarketAnalysisSystemPrompt(analysisType) {
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
}

// 模拟流式市场分析响应
async function simulateStreamingMarketAnalysis(formData, res, analysisType) {
  const mockResponse = generateMarketAnalysisMockResponse(formData, analysisType);
  const words = mockResponse.split('');
  
  for (let i = 0; i < words.length; i++) {
    res.write(`data: ${JSON.stringify({ content: words[i] })}\n\n`);
    await new Promise(resolve => setTimeout(resolve, 30)); // 模拟打字效果
  }
  
  res.write(`data: [DONE]\n\n`);
  res.end();
}

// 生成市场分析模拟回复
function generateMarketAnalysisMockResponse(formData, analysisType) {
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
}

// 生成Agent模拟回复
function generateAgentMockResponse(userMessage, agent) {
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
}

// 工具函数
function generateConversationId() {
  return 'conv_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
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

// 错误处理中间件
app.use((error, req, res, next) => {
  console.error('服务器错误:', error);
  res.status(500).json({
    error: '服务器内部错误',
    message: process.env.NODE_ENV === 'development' ? error.message : '请稍后再试'
  });
});

// 出海工具API
app.get('/api/tools', async (req, res) => {
  try {
    const { category, search, filters } = req.query;
    
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
      }
      // 可以添加更多工具数据
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

    res.json({
      tools: filteredTools,
      total: filteredTools.length,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('获取工具列表错误:', error);
    res.status(500).json({
      error: '获取工具列表失败'
    });
  }
});

// 获取工具详情
app.get('/api/tools/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // 这里可以从数据库获取具体工具详情
    const tool = {
      id: id,
      name: '示例工具',
      // ... 其他工具信息
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
    console.error('获取工具详情错误:', error);
    res.status(500).json({
      error: '获取工具详情失败'
    });
  }
});

// AI内容生成API
app.post('/api/ai/generate-content', async (req, res) => {
  try {
    const { prompt, type, context } = req.body;
    
    if (!prompt) {
      return res.status(400).json({
        error: '提示词不能为空'
      });
    }

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

    // 调用AI API
    const aiResponse = await callDeepSeekAPI(prompt, context, systemPrompt);
    
    res.json({
      content: aiResponse,
      type: type,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('AI内容生成错误:', error);
    res.status(500).json({
      error: 'AI内容生成失败，请稍后再试'
    });
  }
});

// 图片上传API
app.post('/api/upload/image', upload.single('image'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({
        error: '没有上传图片文件'
      });
    }

    // 这里应该上传到阿里云OSS
    // 暂时返回模拟URL
    const imageUrl = `https://example.oss-cn-hangzhou.aliyuncs.com/images/${Date.now()}-${req.file.originalname}`;
    
    res.json({
      url: imageUrl,
      filename: req.file.originalname,
      size: req.file.size,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('图片上传错误:', error);
    res.status(500).json({
      error: '图片上传失败'
    });
  }
});

// 社区帖子API
app.get('/api/posts', async (req, res) => {
  try {
    const { category, search, page = 1, limit = 20 } = req.query;
    
    // 这里应该从数据库获取帖子数据
    // 暂时返回模拟数据
    const posts = [
      {
        id: '1',
        title: 'Amazon选品实战经验分享：如何找到爆款产品',
        author: {
          id: '1',
          username: '出海小王',
          avatar: '👨‍💼',
          level: '资深卖家',
          points: 1250
        },
        content: '这是一篇关于Amazon选品的经验分享...',
        summary: '分享Amazon选品的实战经验，包括市场调研、产品分析等',
        tags: ['Amazon', '选品', '新手', '经验分享'],
        category: 'experience',
        platform: 'amazon',
        likes: 156,
        comments: 23,
        views: 1250,
        isPinned: true,
        isFeatured: true,
        createdAt: '2024-01-15T10:30:00Z'
      }
    ];

    res.json({
      posts: posts,
      total: posts.length,
      page: parseInt(page),
      limit: parseInt(limit),
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('获取帖子列表错误:', error);
    res.status(500).json({
      error: '获取帖子列表失败'
    });
  }
});

// 创建帖子API
app.post('/api/posts', async (req, res) => {
  try {
    const { title, content, summary, tags, category, platform } = req.body;
    
    if (!title || !content) {
      return res.status(400).json({
        error: '标题和内容不能为空'
      });
    }

    // 这里应该进行AI内容审核
    const moderationResult = await moderateContent(content);
    if (!moderationResult.approved) {
      return res.status(400).json({
        error: '内容审核未通过',
        reason: moderationResult.reason
      });
    }

    // 这里应该保存到数据库
    const newPost = {
      id: Date.now().toString(),
      title,
      content,
      summary,
      tags,
      category,
      platform,
      author: {
        id: 'current_user',
        username: '当前用户',
        avatar: '👤',
        level: '新手卖家',
        points: 100
      },
      likes: 0,
      comments: 0,
      views: 0,
      isPinned: false,
      isFeatured: false,
      createdAt: new Date().toISOString()
    };

    res.json({
      post: newPost,
      message: '帖子创建成功',
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('创建帖子错误:', error);
    res.status(500).json({
      error: '创建帖子失败'
    });
  }
});

// AI内容审核函数
async function moderateContent(content) {
  try {
    // 这里应该调用AI内容审核API
    // 暂时返回模拟结果
    const moderationPrompt = `请审核以下内容是否适合在出海电商社区发布：
    
内容：${content}

请从以下维度进行审核：
1. 是否包含违法违规内容
2. 是否包含敏感政治内容
3. 是否包含商业推广内容
4. 是否包含虚假信息
5. 内容质量是否达标

请返回审核结果：通过/不通过，以及原因。`;

    // 模拟AI审核结果
    const isApproved = Math.random() > 0.1; // 90%通过率
    
    return {
      approved: isApproved,
      reason: isApproved ? null : '内容质量需要改进',
      score: Math.random() * 100
    };
  } catch (error) {
    console.error('内容审核错误:', error);
    return {
      approved: true, // 审核失败时默认通过
      reason: null,
      score: 50
    };
  }
}

// 出海控制台API
app.get('/api/dashboard/overview', async (req, res) => {
  try {
    // 模拟仪表板数据
    const overviewData = {
      stats: {
        todaySales: { value: 12450, change: 12.5, trend: 'up' },
        todayOrders: { value: 1234, change: 8.3, trend: 'up' },
        newCustomers: { value: 567, change: 15.2, trend: 'up' },
        avgRating: { value: 4.8, change: 0.2, trend: 'up' }
      },
      charts: {
        salesTrend: {
          labels: ['1月', '2月', '3月', '4月', '5月', '6月'],
          data: [8500, 9200, 10100, 11800, 12500, 12450]
        },
        platformDistribution: {
          labels: ['Amazon', 'Shopify', 'eBay', '其他'],
          data: [45, 30, 15, 10]
        }
      },
      recentActivity: [
        {
          id: '1',
          type: 'order',
          message: '新订单 #12345 来自 Amazon',
          time: '2分钟前',
          amount: '$89.99'
        },
        {
          id: '2',
          type: 'review',
          message: '收到5星评价',
          time: '15分钟前',
          product: '智能蓝牙耳机'
        },
        {
          id: '3',
          type: 'stock',
          message: '库存预警：智能手表库存不足',
          time: '1小时前',
          product: '智能手表'
        }
      ]
    };

    res.json({
      data: overviewData,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('获取仪表板数据错误:', error);
    res.status(500).json({
      error: '获取仪表板数据失败'
    });
  }
});

// 工具连接API
app.post('/api/tools/:toolId/connect', async (req, res) => {
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
    console.error('工具连接错误:', error);
    res.status(500).json({
      error: '工具连接失败'
    });
  }
});

// 工具断开API
app.post('/api/tools/:toolId/disconnect', async (req, res) => {
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
    console.error('工具断开错误:', error);
    res.status(500).json({
      error: '工具断开失败'
    });
  }
});

// 获取工具配置API
app.get('/api/tools/:toolId/config', async (req, res) => {
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
    console.error('获取工具配置错误:', error);
    res.status(500).json({
      error: '获取工具配置失败'
    });
  }
});

// 更新工具配置API
app.put('/api/tools/:toolId/config', async (req, res) => {
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
    console.error('更新工具配置错误:', error);
    res.status(500).json({
      error: '更新工具配置失败'
    });
  }
});

// 获取电商平台数据API
app.get('/api/ecommerce/platforms', async (req, res) => {
  try {
    // 模拟电商平台数据
    const platforms = [
      {
        id: 'amazon',
        name: 'Amazon',
        icon: '🛒',
        status: 'connected',
        stats: {
          orders: 456,
          revenue: 8900,
          growth: 12,
          products: 23
        },
        lastSync: new Date(Date.now() - 1000 * 60 * 30).toISOString() // 30分钟前
      },
      {
        id: 'shopify',
        name: 'Shopify',
        icon: '🏪',
        status: 'disconnected',
        stats: {
          orders: 0,
          revenue: 0,
          growth: 0,
          products: 0
        },
        lastSync: null
      },
      {
        id: 'ebay',
        name: 'eBay',
        icon: '💙',
        status: 'connected',
        stats: {
          orders: 123,
          revenue: 2100,
          growth: 5,
          products: 15
        },
        lastSync: new Date(Date.now() - 1000 * 60 * 60).toISOString() // 1小时前
      }
    ];

    res.json({
      data: platforms,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('获取电商平台数据错误:', error);
    res.status(500).json({
      error: '获取电商平台数据失败'
    });
  }
});

// 同步平台数据API
app.post('/api/ecommerce/:platformId/sync', async (req, res) => {
  try {
    const { platformId } = req.params;

    // 这里应该调用相应平台的API同步数据
    // 暂时返回成功结果
    const result = {
      platformId: platformId,
      status: 'synced',
      syncedAt: new Date().toISOString(),
      itemsSynced: {
        orders: 15,
        products: 3,
        customers: 8
      }
    };

    res.json({
      message: '数据同步成功',
      data: result,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('数据同步错误:', error);
    res.status(500).json({
      error: '数据同步失败'
    });
  }
});

// Google Ads API endpoints
app.post('/api/google-ads/auth', async (req, res) => {
  try {
    const { developerToken, clientId, clientSecret, refreshToken, customerId, loginCustomerId } = req.body;
    
    // 验证必要参数
    if (!developerToken || !clientId || !clientSecret || !refreshToken || !customerId) {
      return res.status(400).json({ 
        success: false, 
        message: '缺少必要的API凭证参数' 
      });
    }

    // 模拟Google Ads API认证
    // 在实际实现中，这里会调用Google Ads API进行认证
    const authResult = {
      success: true,
      message: 'Google Ads API连接成功',
      credentials: {
        developerToken,
        clientId,
        customerId,
        loginCustomerId,
        expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000) // 24小时后过期
      }
    };

    res.json(authResult);
  } catch (error) {
    console.error('Google Ads认证失败:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Google Ads API认证失败' 
    });
  }
});

app.get('/api/google-ads/accounts', async (req, res) => {
  try {
    // 模拟获取Google Ads账户列表
    const accounts = [
      {
        id: '1234567890',
        name: '我的电商店铺',
        currency: 'USD',
        timeZone: 'America/New_York',
        status: 'active',
        budget: 1000,
        spend: 350,
        impressions: 125000,
        clicks: 2500,
        conversions: 45,
        lastSyncTime: new Date().toISOString()
      },
      {
        id: '2345678901',
        name: '品牌推广账户',
        currency: 'USD',
        timeZone: 'America/Los_Angeles',
        status: 'active',
        budget: 2000,
        spend: 680,
        impressions: 280000,
        clicks: 5600,
        conversions: 112,
        lastSyncTime: new Date().toISOString()
      }
    ];

    res.json({ success: true, accounts });
  } catch (error) {
    console.error('获取Google Ads账户失败:', error);
    res.status(500).json({ 
      success: false, 
      message: '获取账户信息失败' 
    });
  }
});

app.get('/api/google-ads/campaigns', async (req, res) => {
  try {
    const { customerId } = req.query;
    
    // 模拟获取广告活动列表
    const campaigns = [
      {
        id: '1001',
        name: '夏季促销活动',
        status: 'active',
        type: 'Search',
        budget: 500,
        spend: 180,
        impressions: 45000,
        clicks: 900,
        conversions: 18,
        ctr: 2.0,
        cpc: 0.20,
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        keywords: ['summer sale', 'discount', 'promotion'],
        adGroups: 5,
        ads: 15
      },
      {
        id: '1002',
        name: '品牌展示广告',
        status: 'active',
        type: 'Display',
        budget: 300,
        spend: 95,
        impressions: 35000,
        clicks: 420,
        conversions: 8,
        ctr: 1.2,
        cpc: 0.23,
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        keywords: ['brand awareness', 'display'],
        adGroups: 3,
        ads: 9
      },
      {
        id: '1003',
        name: '视频广告活动',
        status: 'paused',
        type: 'Video',
        budget: 800,
        spend: 245,
        impressions: 120000,
        clicks: 1800,
        conversions: 25,
        ctr: 1.5,
        cpc: 0.14,
        startDate: '2024-01-01',
        endDate: '2024-12-31',
        keywords: ['video ads', 'youtube'],
        adGroups: 2,
        ads: 6
      }
    ];

    res.json({ success: true, campaigns });
  } catch (error) {
    console.error('获取Google Ads广告活动失败:', error);
    res.status(500).json({ 
      success: false, 
      message: '获取广告活动失败' 
    });
  }
});

app.post('/api/google-ads/campaigns', async (req, res) => {
  try {
    const { name, type, budget, targetKeywords, startDate, endDate, customerId } = req.body;
    
    // 验证必要参数
    if (!name || !type || !budget || !customerId) {
      return res.status(400).json({ 
        success: false, 
        message: '缺少必要的广告活动参数' 
      });
    }

    // 模拟创建广告活动
    const newCampaign = {
      id: Date.now().toString(),
      name,
      status: 'active',
      type,
      budget: parseFloat(budget),
      spend: 0,
      impressions: 0,
      clicks: 0,
      conversions: 0,
      ctr: 0,
      cpc: 0,
      startDate: startDate || new Date().toISOString().split('T')[0],
      endDate: endDate || new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      keywords: targetKeywords || [],
      adGroups: 0,
      ads: 0,
      createdAt: new Date().toISOString()
    };

    res.json({ 
      success: true, 
      message: '广告活动创建成功',
      campaign: newCampaign
    });
  } catch (error) {
    console.error('创建Google Ads广告活动失败:', error);
    res.status(500).json({ 
      success: false, 
      message: '创建广告活动失败' 
    });
  }
});

app.get('/api/google-ads/reports', async (req, res) => {
  try {
    const { customerId, startDate, endDate, metrics } = req.query;
    
    // 模拟获取报告数据
    const report = {
      summary: {
        impressions: 450000,
        clicks: 9000,
        conversions: 180,
        spend: 1350,
        ctr: 2.0,
        cpc: 0.15,
        conversionRate: 2.0,
        costPerConversion: 7.50
      },
      dailyData: [
        { date: '2024-01-01', impressions: 15000, clicks: 300, conversions: 6, spend: 45 },
        { date: '2024-01-02', impressions: 18000, clicks: 360, conversions: 7, spend: 54 },
        { date: '2024-01-03', impressions: 12000, clicks: 240, conversions: 5, spend: 36 }
      ],
      campaignPerformance: [
        { campaignId: '1001', campaignName: '夏季促销活动', impressions: 150000, clicks: 3000, conversions: 60, spend: 450 },
        { campaignId: '1002', campaignName: '品牌展示广告', impressions: 200000, clicks: 4000, conversions: 80, spend: 600 },
        { campaignId: '1003', campaignName: '视频广告活动', impressions: 100000, clicks: 2000, conversions: 40, spend: 300 }
      ]
    };

    res.json({ success: true, report });
  } catch (error) {
    console.error('获取Google Ads报告失败:', error);
    res.status(500).json({ 
      success: false, 
      message: '获取报告数据失败' 
    });
  }
});

// 客户服务 API endpoints
app.get('/api/customer-service/knowledge-base', async (req, res) => {
  try {
    // 模拟获取知识库数据
    const knowledgeBase = [
      {
        id: 1,
        title: '产品退换货政策',
        content: '我们提供30天无理由退换货服务，商品需保持原包装完好。',
        category: '售后政策',
        keywords: ['退货', '换货', '退款', '售后'],
        usage: 45,
        lastUpdated: '2024-01-15',
        status: 'active'
      },
      {
        id: 2,
        title: '物流配送时间',
        content: '国内配送3-7个工作日，海外配送7-15个工作日。',
        category: '物流配送',
        keywords: ['配送', '物流', '时间', '快递'],
        usage: 32,
        lastUpdated: '2024-01-10',
        status: 'active'
      },
      {
        id: 3,
        title: '支付方式说明',
        content: '支持支付宝、微信支付、信用卡、PayPal等多种支付方式。',
        category: '支付相关',
        keywords: ['支付', '付款', '支付宝', '微信'],
        usage: 28,
        lastUpdated: '2024-01-12',
        status: 'active'
      }
    ];

    res.json({ success: true, knowledgeBase });
  } catch (error) {
    console.error('获取知识库失败:', error);
    res.status(500).json({ 
      success: false, 
      message: '获取知识库失败' 
    });
  }
});

app.post('/api/customer-service/knowledge-base', async (req, res) => {
  try {
    const { title, content, category, keywords } = req.body;
    
    // 验证必要参数
    if (!title || !content || !category) {
      return res.status(400).json({ 
        success: false, 
        message: '缺少必要的知识库参数' 
      });
    }

    // 模拟创建知识库条目
    const newItem = {
      id: Date.now(),
      title,
      content,
      category,
      keywords: keywords ? keywords.split(',').map(k => k.trim()) : [],
      usage: 0,
      lastUpdated: new Date().toISOString().split('T')[0],
      status: 'active'
    };

    res.json({ 
      success: true, 
      message: '知识库条目创建成功',
      item: newItem
    });
  } catch (error) {
    console.error('创建知识库条目失败:', error);
    res.status(500).json({ 
      success: false, 
      message: '创建知识库条目失败' 
    });
  }
});

app.get('/api/customer-service/conversations', async (req, res) => {
  try {
    const { startDate, endDate, customerId, status } = req.query;
    
    // 模拟获取对话记录
    const conversations = [
      {
        id: 1,
        customerId: 'cust_001',
        customerName: '张三',
        startTime: '2024-01-20T10:30:00Z',
        endTime: '2024-01-20T10:45:00Z',
        duration: 15,
        messages: [
          { type: 'customer', content: '你好，我想了解一下退货政策', timestamp: '2024-01-20T10:30:00Z' },
          { type: 'bot', content: '您好！我们提供30天无理由退换货服务。请问您遇到什么问题了吗？', timestamp: '2024-01-20T10:30:15Z' },
          { type: 'customer', content: '我买的产品有质量问题', timestamp: '2024-01-20T10:32:00Z' },
          { type: 'bot', content: '很抱歉给您带来不便。请提供您的订单号，我来为您处理退款。', timestamp: '2024-01-20T10:32:20Z' }
        ],
        intent: '售后咨询',
        satisfaction: 4,
        status: 'resolved',
        resolution: '已处理退款申请'
      },
      {
        id: 2,
        customerId: 'cust_002',
        customerName: '李四',
        startTime: '2024-01-20T14:20:00Z',
        endTime: '2024-01-20T14:35:00Z',
        duration: 15,
        messages: [
          { type: 'customer', content: '你们的产品什么时候发货？', timestamp: '2024-01-20T14:20:00Z' },
          { type: 'bot', content: '您好！国内订单3-7个工作日发货，海外订单7-15个工作日发货。', timestamp: '2024-01-20T14:20:10Z' },
          { type: 'customer', content: '好的，谢谢', timestamp: '2024-01-20T14:25:00Z' }
        ],
        intent: '物流咨询',
        satisfaction: 5,
        status: 'resolved',
        resolution: '已解答物流问题'
      }
    ];

    res.json({ success: true, conversations });
  } catch (error) {
    console.error('获取对话记录失败:', error);
    res.status(500).json({ 
      success: false, 
      message: '获取对话记录失败' 
    });
  }
});

app.get('/api/customer-service/customers', async (req, res) => {
  try {
    const { page = 1, limit = 20, search, tags, status, location } = req.query;
    
    // 模拟获取客户列表
    let customers = [
      {
        id: 'cust_001',
        name: '张三',
        email: 'zhangsan@example.com',
        phone: '+86 138****1234',
        registrationDate: '2023-12-01',
        lastActiveDate: '2024-01-20',
        totalOrders: 5,
        totalSpent: 1250.00,
        conversationCount: 3,
        satisfaction: 4.2,
        tags: ['VIP', '活跃用户'],
        status: 'active',
        location: '北京',
        preferredLanguage: 'zh-CN',
        notes: '优质客户，经常购买电子产品'
      },
      {
        id: 'cust_002',
        name: '李四',
        email: 'lisi@example.com',
        phone: '+86 139****5678',
        registrationDate: '2024-01-05',
        lastActiveDate: '2024-01-19',
        totalOrders: 2,
        totalSpent: 580.00,
        conversationCount: 1,
        satisfaction: 5.0,
        tags: ['新用户'],
        status: 'active',
        location: '上海',
        preferredLanguage: 'zh-CN',
        notes: '新注册用户，首次购买体验良好'
      },
      {
        id: 'cust_003',
        name: 'John Smith',
        email: 'john@example.com',
        phone: '+1 555****1234',
        registrationDate: '2023-11-15',
        lastActiveDate: '2024-01-18',
        totalOrders: 8,
        totalSpent: 2100.00,
        conversationCount: 5,
        satisfaction: 4.8,
        tags: ['VIP', '海外用户'],
        status: 'active',
        location: 'New York',
        preferredLanguage: 'en-US',
        notes: '海外VIP客户，购买力强'
      },
      {
        id: 'cust_004',
        name: '王五',
        email: 'wangwu@example.com',
        phone: '+86 137****9999',
        registrationDate: '2023-10-20',
        lastActiveDate: '2024-01-15',
        totalOrders: 3,
        totalSpent: 450.00,
        conversationCount: 2,
        satisfaction: 3.8,
        tags: ['普通用户'],
        status: 'inactive',
        location: '广州',
        preferredLanguage: 'zh-CN',
        notes: '偶尔购买，对价格敏感'
      },
      {
        id: 'cust_005',
        name: 'Sarah Johnson',
        email: 'sarah@example.com',
        phone: '+44 20****1234',
        registrationDate: '2023-09-10',
        lastActiveDate: '2024-01-17',
        totalOrders: 12,
        totalSpent: 3200.00,
        conversationCount: 8,
        satisfaction: 4.9,
        tags: ['VIP', '海外用户'],
        status: 'active',
        location: 'London',
        preferredLanguage: 'en-US',
        notes: '英国客户，品牌忠实度高'
      }
    ];

    // 应用筛选条件
    if (search) {
      customers = customers.filter(customer => 
        customer.name.toLowerCase().includes(search.toLowerCase()) ||
        customer.email.toLowerCase().includes(search.toLowerCase()) ||
        customer.phone.includes(search)
      );
    }

    if (tags) {
      customers = customers.filter(customer => 
        customer.tags.includes(tags)
      );
    }

    if (status) {
      customers = customers.filter(customer => 
        customer.status === status
      );
    }

    if (location) {
      customers = customers.filter(customer => 
        customer.location === location
      );
    }

    // 分页
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedCustomers = customers.slice(startIndex, endIndex);

    res.json({ 
      success: true, 
      customers: paginatedCustomers, 
      total: customers.length,
      page: parseInt(page),
      totalPages: Math.ceil(customers.length / limit)
    });
  } catch (error) {
    console.error('获取客户列表失败:', error);
    res.status(500).json({ 
      success: false, 
      message: '获取客户列表失败' 
    });
  }
});

app.post('/api/customer-service/customers', async (req, res) => {
  try {
    const { name, email, phone, location, tags, notes } = req.body;
    
    // 验证必要参数
    if (!name || !email) {
      return res.status(400).json({ 
        success: false, 
        message: '姓名和邮箱是必填项' 
      });
    }

    // 模拟创建客户
    const newCustomer = {
      id: `cust_${Date.now()}`,
      name,
      email,
      phone: phone || '',
      location: location || '',
      tags: tags || [],
      notes: notes || '',
      registrationDate: new Date().toISOString().split('T')[0],
      lastActiveDate: new Date().toISOString().split('T')[0],
      totalOrders: 0,
      totalSpent: 0,
      conversationCount: 0,
      satisfaction: 0,
      status: 'active',
      preferredLanguage: 'zh-CN'
    };

    res.json({ 
      success: true, 
      message: '客户创建成功',
      customer: newCustomer
    });
  } catch (error) {
    console.error('创建客户失败:', error);
    res.status(500).json({ 
      success: false, 
      message: '创建客户失败' 
    });
  }
});

app.put('/api/customer-service/customers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, phone, location, tags, notes } = req.body;
    
    // 验证必要参数
    if (!name || !email) {
      return res.status(400).json({ 
        success: false, 
        message: '姓名和邮箱是必填项' 
      });
    }

    // 模拟更新客户
    const updatedCustomer = {
      id,
      name,
      email,
      phone: phone || '',
      location: location || '',
      tags: tags || [],
      notes: notes || '',
      updatedAt: new Date().toISOString()
    };

    res.json({ 
      success: true, 
      message: '客户信息更新成功',
      customer: updatedCustomer
    });
  } catch (error) {
    console.error('更新客户失败:', error);
    res.status(500).json({ 
      success: false, 
      message: '更新客户失败' 
    });
  }
});

app.delete('/api/customer-service/customers/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // 模拟删除客户
    res.json({ 
      success: true, 
      message: '客户删除成功'
    });
  } catch (error) {
    console.error('删除客户失败:', error);
    res.status(500).json({ 
      success: false, 
      message: '删除客户失败' 
    });
  }
});

// 对话流程管理 API endpoints
app.get('/api/customer-service/conversation-flows', async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;
    
    // 模拟获取对话流程列表
    const flows = [
      {
        id: 'flow_001',
        name: '售后问题处理流程',
        description: '处理用户售后问题，包括退货、退款、质量问题等',
        trigger: 'keyword',
        steps: [
          {
            id: 'step_1',
            type: 'intent',
            name: '意图识别',
            order: 1,
            config: {
              condition: '包含"退货"或"退款"关键词',
              confidence: 0.8,
              fallback: 'continue'
            }
          },
          {
            id: 'step_2',
            type: 'collect',
            name: '收集信息',
            order: 2,
            config: {
              fields: ['订单号', '问题描述', '联系方式'],
              validation: 'basic',
              required: true
            }
          },
          {
            id: 'step_3',
            type: 'solution',
            name: '提供解决方案',
            order: 3,
            config: {
              template: '根据您的问题，我为您提供以下解决方案...',
              source: 'knowledge_base',
              conditions: []
            }
          },
          {
            id: 'step_4',
            type: 'confirm',
            name: '确认处理',
            order: 4,
            config: {
              message: '请问这个解决方案对您有帮助吗？',
              options: ['有帮助', '需要更多帮助'],
              validation: 'required'
            }
          }
        ],
        settings: {
          maxSteps: 10,
          timeout: 30,
          fallbackAction: 'transfer_to_human'
        },
        status: 'active',
        usage: 156,
        successRate: 87.5,
        createdAt: '2024-01-15T10:30:00Z',
        updatedAt: '2024-01-20T14:45:00Z'
      },
      {
        id: 'flow_002',
        name: '产品咨询流程',
        description: '帮助用户了解产品信息，推荐合适的产品',
        trigger: 'intent',
        steps: [
          {
            id: 'step_1',
            type: 'intent',
            name: '识别咨询意图',
            order: 1,
            config: {
              condition: '产品咨询类问题',
              confidence: 0.9,
              fallback: 'continue'
            }
          },
          {
            id: 'step_2',
            type: 'collect',
            name: '了解需求',
            order: 2,
            config: {
              fields: ['使用场景', '预算范围', '特殊要求'],
              validation: 'basic',
              required: false
            }
          },
          {
            id: 'step_3',
            type: 'recommend',
            name: '产品推荐',
            order: 3,
            config: {
              source: 'product_database',
              criteria: {},
              limit: 3
            }
          },
          {
            id: 'step_4',
            type: 'guide',
            name: '购买指导',
            order: 4,
            config: {
              action: '引导购买流程',
              steps: ['选择规格', '加入购物车', '结算'],
              help: '如需帮助，可随时联系客服'
            }
          }
        ],
        settings: {
          maxSteps: 8,
          timeout: 45,
          fallbackAction: 'show_help'
        },
        status: 'active',
        usage: 89,
        successRate: 92.1,
        createdAt: '2024-01-10T09:15:00Z',
        updatedAt: '2024-01-18T16:20:00Z'
      },
      {
        id: 'flow_003',
        name: '技术支持流程',
        description: '提供产品使用和技术支持服务',
        trigger: 'condition',
        steps: [
          {
            id: 'step_1',
            type: 'intent',
            name: '技术问题识别',
            order: 1,
            config: {
              condition: '技术问题或使用困难',
              confidence: 0.85,
              fallback: 'continue'
            }
          },
          {
            id: 'step_2',
            type: 'collect',
            name: '收集技术信息',
            order: 2,
            config: {
              fields: ['产品型号', '问题现象', '错误信息', '操作步骤'],
              validation: 'strict',
              required: true
            }
          },
          {
            id: 'step_3',
            type: 'analyze',
            name: '问题分析',
            order: 3,
            config: {
              method: 'keyword_match',
              parameters: {},
              rules: []
            }
          },
          {
            id: 'step_4',
            type: 'solution',
            name: '技术解决方案',
            order: 4,
            config: {
              template: '根据您的技术问题，建议您尝试以下解决方案...',
              source: 'technical_knowledge_base',
              conditions: []
            }
          },
          {
            id: 'step_5',
            type: 'confirm',
            name: '确认解决',
            order: 5,
            config: {
              message: '问题是否已解决？',
              options: ['已解决', '需要进一步帮助', '问题依然存在'],
              validation: 'required'
            }
          },
          {
            id: 'step_6',
            type: 'transfer',
            name: '转接专家',
            order: 6,
            config: {
              reason: '复杂技术问题需要专家支持',
              queue: 'technical_support',
              priority: 'high'
            }
          }
        ],
        settings: {
          maxSteps: 15,
          timeout: 60,
          fallbackAction: 'transfer_to_human'
        },
        status: 'active',
        usage: 234,
        successRate: 78.6,
        createdAt: '2024-01-05T14:20:00Z',
        updatedAt: '2024-01-22T11:30:00Z'
      }
    ];

    // 分页
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + parseInt(limit);
    const paginatedFlows = flows.slice(startIndex, endIndex);

    res.json({ 
      success: true, 
      flows: paginatedFlows, 
      total: flows.length,
      page: parseInt(page),
      totalPages: Math.ceil(flows.length / limit)
    });
  } catch (error) {
    console.error('获取对话流程列表失败:', error);
    res.status(500).json({ 
      success: false, 
      message: '获取对话流程列表失败' 
    });
  }
});

app.post('/api/customer-service/conversation-flows', async (req, res) => {
  try {
    const { name, description, trigger, steps, settings } = req.body;
    
    // 验证必要参数
    if (!name || !description || !steps || steps.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: '流程名称、描述和步骤是必填项' 
      });
    }

    // 模拟创建对话流程
    const newFlow = {
      id: `flow_${Date.now()}`,
      name,
      description,
      trigger: trigger || 'manual',
      steps: steps.map((step, index) => ({
        ...step,
        id: step.id || `step_${Date.now()}_${index}`,
        order: index + 1
      })),
      settings: {
        maxSteps: 10,
        timeout: 30,
        fallbackAction: 'transfer_to_human',
        ...settings
      },
      status: 'active',
      usage: 0,
      successRate: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    res.json({ 
      success: true, 
      message: '对话流程创建成功',
      flow: newFlow
    });
  } catch (error) {
    console.error('创建对话流程失败:', error);
    res.status(500).json({ 
      success: false, 
      message: '创建对话流程失败' 
    });
  }
});

app.put('/api/customer-service/conversation-flows/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, trigger, steps, settings, status } = req.body;
    
    // 验证必要参数
    if (!name || !description || !steps || steps.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: '流程名称、描述和步骤是必填项' 
      });
    }

    // 模拟更新对话流程
    const updatedFlow = {
      id,
      name,
      description,
      trigger: trigger || 'manual',
      steps: steps.map((step, index) => ({
        ...step,
        id: step.id || `step_${Date.now()}_${index}`,
        order: index + 1
      })),
      settings: {
        maxSteps: 10,
        timeout: 30,
        fallbackAction: 'transfer_to_human',
        ...settings
      },
      status: status || 'active',
      updatedAt: new Date().toISOString()
    };

    res.json({ 
      success: true, 
      message: '对话流程更新成功',
      flow: updatedFlow
    });
  } catch (error) {
    console.error('更新对话流程失败:', error);
    res.status(500).json({ 
      success: false, 
      message: '更新对话流程失败' 
    });
  }
});

app.delete('/api/customer-service/conversation-flows/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // 模拟删除对话流程
    res.json({ 
      success: true, 
      message: '对话流程删除成功'
    });
  } catch (error) {
    console.error('删除对话流程失败:', error);
    res.status(500).json({ 
      success: false, 
      message: '删除对话流程失败' 
    });
  }
});

app.get('/api/customer-service/analytics', async (req, res) => {
  try {
    const { startDate, endDate, metric } = req.query;
    
    // 模拟获取分析数据
    const analytics = {
      summary: {
        totalConversations: 1250,
        resolvedConversations: 1180,
        avgResponseTime: 2.5,
        customerSatisfaction: 4.6,
        botResolutionRate: 85.2
      },
      dailyStats: [
        { date: '2024-01-15', conversations: 45, resolved: 42, satisfaction: 4.5 },
        { date: '2024-01-16', conversations: 52, resolved: 48, satisfaction: 4.7 },
        { date: '2024-01-17', conversations: 38, resolved: 35, satisfaction: 4.4 },
        { date: '2024-01-18', conversations: 61, resolved: 58, satisfaction: 4.8 },
        { date: '2024-01-19', conversations: 48, resolved: 44, satisfaction: 4.6 },
        { date: '2024-01-20', conversations: 55, resolved: 52, satisfaction: 4.7 }
      ],
      intentAnalysis: [
        { intent: '售后咨询', count: 450, percentage: 36.0, avgSatisfaction: 4.2 },
        { intent: '产品咨询', count: 380, percentage: 30.4, avgSatisfaction: 4.8 },
        { intent: '物流查询', count: 200, percentage: 16.0, avgSatisfaction: 4.6 },
        { intent: '账户问题', count: 120, percentage: 9.6, avgSatisfaction: 4.4 },
        { intent: '其他', count: 100, percentage: 8.0, avgSatisfaction: 4.3 }
      ],
      peakHours: [
        { hour: 9, conversations: 45 },
        { hour: 10, conversations: 52 },
        { hour: 11, conversations: 48 },
        { hour: 14, conversations: 38 },
        { hour: 15, conversations: 41 },
        { hour: 16, conversations: 44 }
      ]
    };

    res.json({ success: true, analytics });
  } catch (error) {
    console.error('获取分析数据失败:', error);
    res.status(500).json({ 
      success: false, 
      message: '获取分析数据失败' 
    });
  }
});

app.get('/api/customer-service/profiles', async (req, res) => {
  try {
    const { customerId, segment } = req.query;
    
    // 模拟获取用户画像数据
    const profiles = [
      {
        customerId: 'cust_001',
        basicInfo: {
          age: 28,
          gender: 'male',
          location: '北京',
          occupation: '软件工程师',
          income: 'high'
        },
        behaviorProfile: {
          shoppingFrequency: 'high',
          avgOrderValue: 250.00,
          preferredCategories: ['电子产品', '数码配件'],
          preferredBrands: ['Apple', 'Samsung'],
          shoppingTime: 'evening',
          deviceType: 'mobile'
        },
        serviceProfile: {
          inquiryFrequency: 'medium',
          preferredChannel: 'online_chat',
          avgSatisfaction: 4.2,
          commonIssues: ['产品咨询', '售后服务'],
          language: 'zh-CN',
          responseTime: 'fast'
        },
        engagementScore: 85,
        lifetimeValue: 1250.00,
        riskLevel: 'low',
        lastUpdated: '2024-01-20T10:30:00Z'
      }
    ];

    res.json({ success: true, profiles });
  } catch (error) {
    console.error('获取用户画像失败:', error);
    res.status(500).json({ 
      success: false, 
      message: '获取用户画像失败' 
    });
  }
});

// 独立站平台 API endpoints
app.get('/api/independent-stores', (req, res) => {
  try {
    const stores = [
      {
        id: 1,
        name: 'My Fashion Store',
        domain: 'myfashionstore.com',
        status: 'active',
        template: 'fashion-template',
        region: 'us-east-1',
        createdAt: '2024-01-15T10:00:00Z',
        revenue: 15420,
        orders: 89,
        awsResources: {
          s3Bucket: 'myfashionstore-static',
          cloudfrontDistribution: 'E1234567890123',
          lambdaFunctions: ['product-api', 'order-api'],
          rdsInstance: 'myfashionstore-db'
        }
      },
      {
        id: 2,
        name: 'Tech Gadgets Hub',
        domain: 'techgadgets.shop',
        status: 'deploying',
        template: 'tech-template',
        region: 'eu-west-1',
        createdAt: '2024-01-20T14:30:00Z',
        revenue: 0,
        orders: 0,
        awsResources: null
      }
    ];
    
    res.json({ success: true, stores });
  } catch (error) {
    console.error('获取独立站列表失败:', error);
    res.status(500).json({ success: false, message: '获取独立站列表失败' });
  }
});

app.post('/api/independent-stores', async (req, res) => {
  try {
    const { name, domain, template, region, paymentMethods } = req.body;
    
    // 模拟创建独立站
    const newStore = {
      id: Date.now(),
      name,
      domain,
      status: 'pending',
      template,
      region,
      paymentMethods,
      createdAt: new Date().toISOString(),
      revenue: 0,
      orders: 0,
      awsResources: null
    };
    
    // 这里应该调用AWS API创建资源
    console.log('创建独立站:', newStore);
    
    res.json({ success: true, data: newStore });
  } catch (error) {
    console.error('创建独立站失败:', error);
    res.status(500).json({ success: false, message: '创建独立站失败' });
  }
});

app.delete('/api/independent-stores/:id', async (req, res) => {
  try {
    const { id } = req.params;
    
    // 模拟删除独立站
    console.log('删除独立站:', id);
    
    res.json({ success: true, message: '独立站删除成功' });
  } catch (error) {
    console.error('删除独立站失败:', error);
    res.status(500).json({ success: false, message: '删除独立站失败' });
  }
});

app.post('/api/independent-stores/:id/deploy', async (req, res) => {
  try {
    const { id } = req.params;
    
    // 模拟开始部署流程
    console.log('开始部署独立站:', id);
    
    res.json({ success: true, message: '部署已开始' });
  } catch (error) {
    console.error('部署失败:', error);
    res.status(500).json({ success: false, message: '部署失败' });
  }
});

app.get('/api/store-templates', (req, res) => {
  try {
    const templates = [
      {
        id: 'fashion-template',
        name: '时尚服装模板',
        category: 'fashion',
        description: '专为服装、配饰、美妆品牌设计，包含产品展示、购物车、用户中心等功能',
        preview: '/images/templates/fashion-preview.jpg',
        features: ['响应式设计', '产品轮播', '购物车', '用户注册', '支付集成'],
        awsServices: ['S3', 'CloudFront', 'Lambda', 'RDS'],
        estimatedCost: 50,
        awsConfig: {
          s3: { storage: '10GB', requests: '10000' },
          cloudfront: { transfer: '1TB' },
          lambda: { requests: '100000', duration: '1000000ms' },
          rds: { instance: 'db.t3.micro', storage: '20GB' }
        }
      },
      {
        id: 'tech-template',
        name: '科技数码模板',
        category: 'electronics',
        description: '适合电子产品、数码配件销售，包含产品对比、技术规格展示等功能',
        preview: '/images/templates/tech-preview.jpg',
        features: ['产品对比', '技术规格', '库存管理', '订单跟踪', '客服系统'],
        awsServices: ['S3', 'CloudFront', 'Lambda', 'DynamoDB', 'SNS'],
        estimatedCost: 75,
        awsConfig: {
          s3: { storage: '15GB', requests: '15000' },
          cloudfront: { transfer: '2TB' },
          lambda: { requests: '150000', duration: '1500000ms' },
          dynamodb: { readCapacity: 5, writeCapacity: 5, storage: '1GB' },
          sns: { requests: '1000' }
        }
      },
      {
        id: 'food-template',
        name: '食品饮料模板',
        category: 'food',
        description: '专为食品、饮料、保健品设计，包含营养信息、保质期管理等功能',
        preview: '/images/templates/food-preview.jpg',
        features: ['营养标签', '保质期提醒', '订阅服务', '配送跟踪', '评价系统'],
        awsServices: ['S3', 'CloudFront', 'Lambda', 'RDS', 'SES'],
        estimatedCost: 60,
        awsConfig: {
          s3: { storage: '12GB', requests: '12000' },
          cloudfront: { transfer: '1.5TB' },
          lambda: { requests: '120000', duration: '1200000ms' },
          rds: { instance: 'db.t3.small', storage: '30GB' },
          ses: { emails: '1000' }
        }
      }
    ];
    
    res.json({ success: true, templates });
  } catch (error) {
    console.error('获取模板列表失败:', error);
    res.status(500).json({ success: false, message: '获取模板列表失败' });
  }
});

app.get('/api/store-deployments', (req, res) => {
  try {
    const deployments = [
      {
        id: 1,
        storeId: 1,
        status: 'completed',
        startTime: '2024-01-15T10:00:00Z',
        endTime: '2024-01-15T10:15:00Z',
        template: 'fashion-template',
        region: 'us-east-1',
        steps: [
          { name: '创建S3存储桶', status: 'completed', duration: 30, logs: 'S3存储桶创建成功' },
          { name: '配置CloudFront CDN', status: 'completed', duration: 45, logs: 'CDN配置完成' },
          { name: '部署Lambda函数', status: 'completed', duration: 60, logs: 'Lambda函数部署成功' },
          { name: '配置RDS数据库', status: 'completed', duration: 90, logs: '数据库配置完成' },
          { name: '设置Route 53域名', status: 'completed', duration: 120, logs: '域名解析配置成功' },
          { name: '集成PayPal支付', status: 'completed', duration: 45, logs: '支付接口集成完成' }
        ],
        awsResources: {
          s3Bucket: 'myfashionstore-static',
          cloudfrontDistribution: 'E1234567890123',
          lambdaFunctions: ['product-api', 'order-api'],
          rdsInstance: 'myfashionstore-db',
          route53Record: 'myfashionstore.com'
        }
      },
      {
        id: 2,
        storeId: 2,
        status: 'in-progress',
        startTime: '2024-01-20T14:30:00Z',
        template: 'tech-template',
        region: 'eu-west-1',
        currentStep: 3,
        steps: [
          { name: '创建S3存储桶', status: 'completed', duration: 35, logs: 'S3存储桶创建成功' },
          { name: '配置CloudFront CDN', status: 'completed', duration: 50, logs: 'CDN配置完成' },
          { name: '部署Lambda函数', status: 'in-progress', duration: 0, logs: '正在部署Lambda函数...' },
          { name: '配置DynamoDB数据库', status: 'pending', duration: 0, logs: '' },
          { name: '设置Route 53域名', status: 'pending', duration: 0, logs: '' },
          { name: '集成支付接口', status: 'pending', duration: 0, logs: '' }
        ],
        awsResources: null
      }
    ];
    
    res.json({ success: true, deployments });
  } catch (error) {
    console.error('获取部署记录失败:', error);
    res.status(500).json({ success: false, message: '获取部署记录失败' });
  }
});

app.post('/api/store-deployments', async (req, res) => {
  try {
    const { storeId, template, region } = req.body;
    
    // 模拟创建部署任务
    const deployment = {
      id: Date.now(),
      storeId,
      status: 'pending',
      startTime: new Date().toISOString(),
      template,
      region,
      currentStep: 0,
      steps: [
        { name: '创建S3存储桶', status: 'pending', duration: 0, logs: '' },
        { name: '配置CloudFront CDN', status: 'pending', duration: 0, logs: '' },
        { name: '部署Lambda函数', status: 'pending', duration: 0, logs: '' },
        { name: '配置数据库', status: 'pending', duration: 0, logs: '' },
        { name: '设置Route 53域名', status: 'pending', duration: 0, logs: '' },
        { name: '集成支付接口', status: 'pending', duration: 0, logs: '' }
      ],
      awsResources: null
    };
    
    console.log('创建部署任务:', deployment);
    
    res.json({ success: true, data: deployment });
  } catch (error) {
    console.error('创建部署任务失败:', error);
    res.status(500).json({ success: false, message: '创建部署任务失败' });
  }
});

// AWS服务集成API
app.get('/api/aws/services', (req, res) => {
  try {
    const services = [
      {
        id: 's3',
        name: 'Amazon S3',
        description: '对象存储服务',
        icon: '🗄️',
        features: ['静态网站托管', '文件存储', 'CDN源站'],
        pricing: '$0.023/GB/月'
      },
      {
        id: 'cloudfront',
        name: 'CloudFront',
        description: '全球CDN服务',
        icon: '🌍',
        features: ['全球加速', '缓存优化', 'HTTPS支持'],
        pricing: '$0.085/GB传输'
      },
      {
        id: 'lambda',
        name: 'AWS Lambda',
        description: '无服务器计算',
        icon: '⚡',
        features: ['自动扩缩容', '按需付费', '多种语言支持'],
        pricing: '$0.0000166667/GB-秒'
      },
      {
        id: 'rds',
        name: 'Amazon RDS',
        description: '关系型数据库',
        icon: '🗃️',
        features: ['自动备份', '多可用区', '监控告警'],
        pricing: '$0.017/小时起'
      },
      {
        id: 'dynamodb',
        name: 'DynamoDB',
        description: 'NoSQL数据库',
        icon: '📊',
        features: ['无服务器', '自动扩缩容', '毫秒级延迟'],
        pricing: '$0.25/百万读取请求'
      },
      {
        id: 'route53',
        name: 'Route 53',
        description: 'DNS服务',
        icon: '🌐',
        features: ['域名注册', 'DNS解析', '健康检查'],
        pricing: '$0.50/托管区域/月'
      }
    ];
    
    res.json({ success: true, services });
  } catch (error) {
    console.error('获取AWS服务列表失败:', error);
    res.status(500).json({ success: false, message: '获取AWS服务列表失败' });
  }
});

app.get('/api/aws/regions', (req, res) => {
  try {
    const regions = [
      { id: 'us-east-1', name: '美国东部 (弗吉尼亚)', flag: '🇺🇸', latency: '低' },
      { id: 'us-west-2', name: '美国西部 (俄勒冈)', flag: '🇺🇸', latency: '中' },
      { id: 'eu-west-1', name: '欧洲 (爱尔兰)', flag: '🇪🇺', latency: '中' },
      { id: 'eu-central-1', name: '欧洲 (法兰克福)', flag: '🇩🇪', latency: '中' },
      { id: 'ap-southeast-1', name: '亚太 (新加坡)', flag: '🇸🇬', latency: '中' },
      { id: 'ap-northeast-1', name: '亚太 (东京)', flag: '🇯🇵', latency: '中' },
      { id: 'ap-southeast-2', name: '亚太 (悉尼)', flag: '🇦🇺', latency: '高' }
    ];
    
    res.json({ success: true, regions });
  } catch (error) {
    console.error('获取AWS区域列表失败:', error);
    res.status(500).json({ success: false, message: '获取AWS区域列表失败' });
  }
});

// TikTok店铺管理API
app.get('/api/tiktok/shops', async (req, res) => {
  try {
    const { site, status, shopType } = req.query;
    
    // 模拟TikTok店铺数据
    const shops = [
      {
        id: '1',
        name: '我的TikTok美国店',
        platformName: 'TikTok Shop US',
        site: 'us',
        shopType: 'us-cross-border',
        status: 'connected',
        authStatus: 'authorized',
        tradingRate: 5.5,
        lastSync: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30分钟前
        stats: {
          orders: 156,
          revenue: 8950,
          products: 23,
          growth: 12.5
        },
        permissions: {
          orderSync: true,
          inventorySync: true,
          productManagement: true,
          reporting: true
        }
      },
      {
        id: '2',
        name: '英国精品店',
        platformName: 'TikTok Shop UK',
        site: 'uk',
        shopType: 'cross-border',
        status: 'connected',
        authStatus: 'authorized',
        tradingRate: 4.8,
        lastSync: new Date(Date.now() - 1000 * 60 * 60).toISOString(), // 1小时前
        stats: {
          orders: 89,
          revenue: 3420,
          products: 15,
          growth: 8.3
        },
        permissions: {
          orderSync: true,
          inventorySync: true,
          productManagement: true,
          reporting: true
        }
      },
      {
        id: '3',
        name: '东南亚店铺',
        platformName: 'TikTok Shop SG',
        site: 'sg',
        shopType: 'local',
        status: 'pending',
        authStatus: 'pending',
        tradingRate: 3.2,
        lastSync: null,
        stats: {
          orders: 0,
          revenue: 0,
          products: 0,
          growth: 0
        },
        permissions: {
          orderSync: false,
          inventorySync: false,
          productManagement: false,
          reporting: false
        }
      }
    ];

    // 应用筛选条件
    let filteredShops = shops;
    
    if (site && site !== 'all') {
      filteredShops = filteredShops.filter(shop => shop.site === site);
    }
    
    if (status && status !== 'all') {
      filteredShops = filteredShops.filter(shop => shop.status === status);
    }
    
    if (shopType && shopType !== 'all') {
      filteredShops = filteredShops.filter(shop => shop.shopType === shopType);
    }

    res.json({
      data: filteredShops,
      total: filteredShops.length,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('获取TikTok店铺列表错误:', error);
    res.status(500).json({
      error: '获取TikTok店铺列表失败'
    });
  }
});

// TikTok店铺授权API
app.post('/api/tiktok/shops/auth', async (req, res) => {
  try {
    const { shopName, tradingRate, site, shopType } = req.body;
    
    if (!shopName || !tradingRate || !site || !shopType) {
      return res.status(400).json({
        error: '缺少必要参数：shopName, tradingRate, site, shopType'
      });
    }

    // 这里应该实现真实的TikTok授权流程
    // 1. 验证店铺名称是否重复
    // 2. 验证交易费率是否合理
    // 3. 跳转到TikTok授权页面
    // 4. 处理授权回调
    // 5. 保存店铺配置

    // 模拟授权成功
    const newShop = {
      id: Date.now().toString(),
      name: shopName,
      platformName: `TikTok Shop ${site.toUpperCase()}`,
      site: site,
      shopType: shopType,
      status: 'connected',
      authStatus: 'authorized',
      tradingRate: parseFloat(tradingRate),
      lastSync: new Date().toISOString(),
      stats: {
        orders: 0,
        revenue: 0,
        products: 0,
        growth: 0
      },
      permissions: {
        orderSync: true,
        inventorySync: true,
        productManagement: true,
        reporting: true
      }
    };

    res.json({
      message: 'TikTok店铺授权成功',
      data: newShop,
      authUrl: `https://tiktok.com/oauth/authorize?shop_id=${newShop.id}&redirect_uri=${encodeURIComponent('http://localhost:3000/api/tiktok/auth/callback')}`,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('TikTok店铺授权错误:', error);
    res.status(500).json({
      error: 'TikTok店铺授权失败'
    });
  }
});

// TikTok授权回调API
app.get('/api/tiktok/auth/callback', async (req, res) => {
  try {
    const { code, state, shop_id } = req.query;
    
    if (!code || !shop_id) {
      return res.status(400).json({
        error: '授权回调参数不完整'
      });
    }

    // 这里应该：
    // 1. 验证state参数
    // 2. 使用code换取access_token
    // 3. 获取店铺信息
    // 4. 保存授权信息到数据库
    // 5. 返回成功页面

    res.send(`
      <html>
        <head>
          <title>TikTok店铺授权成功</title>
          <style>
            body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
            .success { color: #059669; font-size: 24px; margin-bottom: 20px; }
            .message { color: #374151; font-size: 16px; }
          </style>
        </head>
        <body>
          <div class="success">✅ TikTok店铺授权成功！</div>
          <div class="message">店铺已成功连接到出海控制台，您可以关闭此页面返回控制台。</div>
          <script>
            setTimeout(() => {
              window.close();
            }, 3000);
          </script>
        </body>
      </html>
    `);
    
  } catch (error) {
    console.error('TikTok授权回调错误:', error);
    res.status(500).send(`
      <html>
        <head>
          <title>TikTok店铺授权失败</title>
          <style>
            body { font-family: Arial, sans-serif; text-align: center; padding: 50px; }
            .error { color: #dc2626; font-size: 24px; margin-bottom: 20px; }
            .message { color: #374151; font-size: 16px; }
          </style>
        </head>
        <body>
          <div class="error">❌ TikTok店铺授权失败！</div>
          <div class="message">请重试或联系客服支持。</div>
        </body>
      </html>
    `);
  }
});

// TikTok店铺断开连接API
app.post('/api/tiktok/shops/:shopId/disconnect', async (req, res) => {
  try {
    const { shopId } = req.params;

    // 这里应该：
    // 1. 验证店铺是否存在
    // 2. 撤销TikTok授权
    // 3. 清理相关数据
    // 4. 更新店铺状态

    res.json({
      message: 'TikTok店铺已断开连接',
      data: {
        shopId: shopId,
        status: 'disconnected',
        disconnectedAt: new Date().toISOString()
      },
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('TikTok店铺断开连接错误:', error);
    res.status(500).json({
      error: 'TikTok店铺断开连接失败'
    });
  }
});

// TikTok店铺数据同步API
app.post('/api/tiktok/shops/:shopId/sync', async (req, res) => {
  try {
    const { shopId } = req.params;

    // 这里应该：
    // 1. 验证店铺连接状态
    // 2. 调用TikTok API同步数据
    // 3. 处理订单、库存、商品等数据
    // 4. 更新同步时间

    // 模拟同步结果
    const syncResult = {
      shopId: shopId,
      status: 'synced',
      syncedAt: new Date().toISOString(),
      itemsSynced: {
        orders: Math.floor(Math.random() * 50) + 10,
        products: Math.floor(Math.random() * 20) + 5,
        inventory: Math.floor(Math.random() * 100) + 20,
        customers: Math.floor(Math.random() * 30) + 5
      }
    };

    res.json({
      message: 'TikTok店铺数据同步成功',
      data: syncResult,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('TikTok店铺数据同步错误:', error);
    res.status(500).json({
      error: 'TikTok店铺数据同步失败'
    });
  }
});

// TikTok店铺设置更新API
app.put('/api/tiktok/shops/:shopId/settings', async (req, res) => {
  try {
    const { shopId } = req.params;
    const { tradingRate, autoSync, syncInterval, notifications } = req.body;

    // 这里应该：
    // 1. 验证店铺存在
    // 2. 验证设置参数
    // 3. 更新店铺配置
    // 4. 保存到数据库

    const updatedSettings = {
      shopId: shopId,
      tradingRate: tradingRate,
      autoSync: autoSync,
      syncInterval: syncInterval,
      notifications: notifications,
      updatedAt: new Date().toISOString()
    };

    res.json({
      message: 'TikTok店铺设置更新成功',
      data: updatedSettings,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('TikTok店铺设置更新错误:', error);
    res.status(500).json({
      error: 'TikTok店铺设置更新失败'
    });
  }
});

// TikTok订单管理API
app.get('/api/tiktok/shops/:shopId/orders', async (req, res) => {
  try {
    const { shopId } = req.params;
    const { status, page = 1, limit = 20 } = req.query;

    // 模拟订单数据
    const orders = Array.from({ length: limit }, (_, index) => ({
      id: `order_${shopId}_${(page - 1) * limit + index + 1}`,
      orderNumber: `TK${Date.now()}${index}`,
      customerName: `客户${index + 1}`,
      customerEmail: `customer${index + 1}@example.com`,
      status: ['pending', 'processing', 'shipped', 'delivered', 'cancelled'][Math.floor(Math.random() * 5)],
      totalAmount: (Math.random() * 500 + 10).toFixed(2),
      currency: 'USD',
      items: [
        {
          productId: `product_${index + 1}`,
          productName: `商品${index + 1}`,
          quantity: Math.floor(Math.random() * 5) + 1,
          price: (Math.random() * 100 + 10).toFixed(2)
        }
      ],
      shippingAddress: {
        name: `客户${index + 1}`,
        address: `地址${index + 1}`,
        city: '城市',
        state: '州',
        zipCode: '12345',
        country: 'US'
      },
      createdAt: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString()
    }));

    res.json({
      data: orders,
      total: 100,
      page: parseInt(page),
      limit: parseInt(limit),
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('获取TikTok订单列表错误:', error);
    res.status(500).json({
      error: '获取TikTok订单列表失败'
    });
  }
});

// TikTok物流管理API
app.get('/api/tiktok/shops/:shopId/logistics', async (req, res) => {
  try {
    const { shopId } = req.params;

    // 模拟物流数据
    const logisticsData = {
      shopId: shopId,
      carriers: [
        {
          id: 'usps',
          name: 'USPS',
          type: 'standard',
          supported: true,
          estimatedDays: '3-5',
          cost: '$5.99'
        },
        {
          id: 'fedex',
          name: 'FedEx',
          type: 'express',
          supported: true,
          estimatedDays: '1-2',
          cost: '$12.99'
        },
        {
          id: 'ups',
          name: 'UPS',
          type: 'standard',
          supported: true,
          estimatedDays: '2-4',
          cost: '$8.99'
        }
      ],
      trackingInfo: {
        autoTracking: true,
        trackingNotifications: true,
        trackingPage: true
      },
      lastUpdated: new Date().toISOString()
    };

    res.json({
      data: logisticsData,
      timestamp: new Date().toISOString()
    });
    
  } catch (error) {
    console.error('获取TikTok物流信息错误:', error);
    res.status(500).json({
      error: '获取TikTok物流信息失败'
    });
  }
});

// 404处理
app.use('*', (req, res) => {
  res.status(404).json({
    error: '接口不存在',
    path: req.originalUrl
  });
});

// 启动服务器
app.listen(PORT, () => {
  console.log(`🚀 出海AI后端服务运行在端口 ${PORT}`);
  console.log(`📊 健康检查: http://localhost:${PORT}/health`);
  console.log(`🤖 AI聊天API: http://localhost:${PORT}/ai/chat`);
  console.log(`📋 规划API: http://localhost:${PORT}/api/planning`);
});

module.exports = app;
