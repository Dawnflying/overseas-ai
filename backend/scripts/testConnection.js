/**
 * 数据库连接测试脚本
 */

const mysql = require('mysql2/promise');

async function testConnection() {
  console.log('🔗 测试MySQL数据库连接...');
  
  const connectionConfig = {
    host: process.env.MYSQL_HOST || 'localhost',
    port: process.env.MYSQL_PORT || 3306,
    user: process.env.MYSQL_USERNAME || 'root',
    password: process.env.MYSQL_PASSWORD || 'password',
    database: process.env.MYSQL_DATABASE || 'overseas-ai',
    connectTimeout: 10000,
    acquireTimeout: 10000,
    timeout: 10000
  };

  try {
    console.log('连接配置:', {
      host: connectionConfig.host,
      port: connectionConfig.port,
      user: connectionConfig.user,
      database: connectionConfig.database
    });

    const connection = await mysql.createConnection(connectionConfig);
    console.log('✅ MySQL连接成功！');
    
    // 测试查询
    const [rows] = await connection.execute('SELECT 1 as test');
    console.log('✅ 查询测试成功:', rows);
    
    await connection.end();
    console.log('✅ 连接已关闭');
    
    return true;
  } catch (error) {
    console.error('❌ MySQL连接失败:', error.message);
    console.error('错误详情:', error);
    return false;
  }
}

// 如果直接运行此脚本
if (require.main === module) {
  testConnection().then(success => {
    process.exit(success ? 0 : 1);
  });
}

module.exports = testConnection;
