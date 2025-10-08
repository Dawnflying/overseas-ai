/**
 * 数据库重置脚本
 * 清空所有数据并重新创建表结构
 */

const readline = require('readline');
const { sequelize, testConnection, syncDatabase } = require('../config/database');
const models = require('../models');

// 创建命令行接口
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function askQuestion(question) {
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      resolve(answer);
    });
  });
}

async function resetDatabase() {
  console.log('⚠️  数据库重置工具');
  console.log('⚠️  此操作将删除所有数据并重新创建表结构！');
  console.log('⚠️  请确保您已经备份了重要数据！\n');

  try {
    // 确认操作
    const confirm = await askQuestion('您确定要继续吗？输入 "YES" 确认: ');
    if (confirm !== 'YES') {
      console.log('❌ 操作已取消');
      process.exit(0);
    }

    // 测试数据库连接
    console.log('\n🔗 测试数据库连接...');
    const connected = await testConnection();
    if (!connected) {
      console.error('❌ 数据库连接失败，重置终止');
      process.exit(1);
    }

    // 再次确认
    const finalConfirm = await askQuestion('\n最后确认：这将删除所有数据！输入 "RESET" 继续: ');
    if (finalConfirm !== 'RESET') {
      console.log('❌ 操作已取消');
      process.exit(0);
    }

    // 执行重置
    console.log('\n🗑️  正在重置数据库...');
    const synced = await syncDatabase(true); // true = 强制重建表
    
    if (synced) {
      console.log('✅ 数据库重置完成！');
      console.log('📊 已重建的表:');
      console.log('   - users');
      console.log('   - knowledge_bases');
      console.log('   - conversations');
      console.log('   - messages');
      console.log('   - tool_usages');
      console.log('   - file_uploads');
      console.log('   - system_configs');
      
      console.log('\n💡 下一步操作建议:');
      console.log('   1. 运行 npm run db:seed 初始化种子数据');
      console.log('   2. 测试应用程序功能');
    } else {
      console.error('❌ 数据库重置失败');
      process.exit(1);
    }

  } catch (error) {
    console.error('❌ 重置过程中发生错误:', error.message);
    process.exit(1);
  } finally {
    rl.close();
    await sequelize.close();
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  resetDatabase();
}

module.exports = resetDatabase;
