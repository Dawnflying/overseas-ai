/**
 * 数据库种子脚本
 * 初始化系统基础数据
 */

const bcrypt = require('bcryptjs');
const { sequelize } = require('../config/database');
const { User, SystemConfig, KnowledgeBase } = require('../models');

async function seed() {
  console.log('🌱 开始初始化种子数据...');
  
  try {
    // 测试数据库连接
    await sequelize.authenticate();
    console.log('✅ 数据库连接成功');

    // 创建默认管理员用户
    console.log('👤 创建默认管理员用户...');
    const adminExists = await User.findOne({ where: { username: 'admin' } });
    
    if (!adminExists) {
      const hashedPassword = await bcrypt.hash('admin123', 10);
      await User.create({
        username: 'admin',
        email: 'admin@overseas-ai.com',
        password: hashedPassword,
        fullName: '系统管理员',
        role: 'admin',
        status: 'active'
      });
      console.log('✅ 管理员用户创建成功 (用户名: admin, 密码: admin123)');
    } else {
      console.log('ℹ️  管理员用户已存在');
    }

    // 创建默认测试用户
    console.log('👤 创建默认测试用户...');
    const userExists = await User.findOne({ where: { username: 'testuser' } });
    
    if (!userExists) {
      const hashedPassword = await bcrypt.hash('test123', 10);
      await User.create({
        username: 'testuser',
        email: 'test@overseas-ai.com',
        password: hashedPassword,
        fullName: '测试用户',
        role: 'user',
        status: 'active'
      });
      console.log('✅ 测试用户创建成功 (用户名: testuser, 密码: test123)');
    } else {
      console.log('ℹ️  测试用户已存在');
    }

    // 创建系统配置
    console.log('⚙️  初始化系统配置...');
    const defaultConfigs = [
      {
        key: 'site_name',
        value: '出海AI平台',
        type: 'string',
        description: '网站名称',
        isPublic: true
      },
      {
        key: 'site_description',
        value: '专业的出海AI服务平台',
        type: 'string',
        description: '网站描述',
        isPublic: true
      },
      {
        key: 'max_conversations_per_user',
        value: '100',
        type: 'number',
        description: '每个用户最大对话数量',
        isPublic: false
      },
      {
        key: 'max_messages_per_conversation',
        value: '1000',
        type: 'number',
        description: '每个对话最大消息数量',
        isPublic: false
      },
      {
        key: 'file_upload_max_size',
        value: '10485760',
        type: 'number',
        description: '文件上传最大大小（字节）',
        isPublic: false
      },
      {
        key: 'supported_languages',
        value: JSON.stringify(['zh-CN', 'en-US', 'ja-JP', 'ko-KR']),
        type: 'json',
        description: '支持的语言列表',
        isPublic: true
      },
      {
        key: 'ai_model_config',
        value: JSON.stringify({
          default_model: 'deepseek-chat',
          max_tokens: 2000,
          temperature: 0.7
        }),
        type: 'json',
        description: 'AI模型配置',
        isPublic: false
      }
    ];

    for (const config of defaultConfigs) {
      const exists = await SystemConfig.findOne({ where: { key: config.key } });
      if (!exists) {
        await SystemConfig.create(config);
        console.log(`✅ 配置项 ${config.key} 创建成功`);
      } else {
        console.log(`ℹ️  配置项 ${config.key} 已存在`);
      }
    }

    // 创建示例知识库数据
    console.log('📚 创建示例知识库数据...');
    const sampleKnowledge = [
      {
        title: '出海营销策略基础',
        content: '出海营销是指企业将产品或服务推广到海外市场的营销活动。成功的出海营销需要考虑文化差异、法律法规、市场环境等多个因素。',
        summary: '出海营销的基本概念和关键要素',
        category: 'marketing',
        tags: ['营销', '出海', '策略'],
        source: 'manual',
        language: 'zh-CN',
        isPublic: true,
        userId: 1
      },
      {
        title: '海外市场分析要点',
        content: '海外市场分析需要从市场规模、竞争格局、消费者行为、政策环境等多个维度进行深入分析。数据驱动的市场分析能够帮助企业做出更准确的决策。',
        summary: '海外市场分析的方法和要点',
        category: 'analysis',
        tags: ['市场分析', '海外', '数据'],
        source: 'manual',
        language: 'zh-CN',
        isPublic: true,
        userId: 1
      },
      {
        title: '跨境电商运营指南',
        content: '跨境电商运营涉及选品、定价、物流、客服等多个环节。需要建立完善的运营体系，包括供应链管理、订单处理、客户服务等。',
        summary: '跨境电商运营的核心要素',
        category: 'ecommerce',
        tags: ['电商', '运营', '跨境'],
        source: 'manual',
        language: 'zh-CN',
        isPublic: true,
        userId: 1
      }
    ];

    for (const knowledge of sampleKnowledge) {
      const exists = await KnowledgeBase.findOne({ where: { title: knowledge.title } });
      if (!exists) {
        await KnowledgeBase.create(knowledge);
        console.log(`✅ 知识库条目 "${knowledge.title}" 创建成功`);
      } else {
        console.log(`ℹ️  知识库条目 "${knowledge.title}" 已存在`);
      }
    }

    console.log('🎉 种子数据初始化完成！');
    console.log('\n📋 初始化摘要:');
    console.log('   - 创建了管理员用户 (admin/admin123)');
    console.log('   - 创建了测试用户 (testuser/test123)');
    console.log('   - 初始化了系统配置');
    console.log('   - 创建了示例知识库数据');

  } catch (error) {
    console.error('❌ 种子数据初始化失败:', error.message);
    throw error;
  } finally {
    await sequelize.close();
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  seed().catch(console.error);
}

module.exports = seed;
