/**
 * 数据库迁移脚本
 * 创建所有必要的数据库表
 */

const { sequelize, testConnection, syncDatabase } = require('../config/database');
const models = require('../models');

async function migrate() {
  console.log('🚀 开始数据库迁移...');
  
  try {
    // 测试数据库连接
    const connected = await testConnection();
    if (!connected) {
      console.error('❌ 数据库连接失败，迁移终止');
      process.exit(1);
    }

    // 同步数据库模型（创建表）
    console.log('📋 正在创建数据库表...');
    const synced = await syncDatabase(false); // false = 不强制重建表
    
    if (synced) {
      console.log('✅ 数据库迁移完成！');
      console.log('📊 已创建的表:');
      console.log('   - users (用户表)');
      console.log('   - knowledge_bases (知识库表)');
      console.log('   - conversations (对话记录表)');
      console.log('   - messages (消息记录表)');
      console.log('   - tool_usages (工具使用记录表)');
      console.log('   - file_uploads (文件上传记录表)');
      console.log('   - system_configs (系统配置表)');
    } else {
      console.error('❌ 数据库迁移失败');
      process.exit(1);
    }

  } catch (error) {
    console.error('❌ 迁移过程中发生错误:', error.message);
    process.exit(1);
  } finally {
    await sequelize.close();
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  migrate();
}

module.exports = migrate;
