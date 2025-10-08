/**
 * 数据库连接配置
 * 使用Sequelize ORM管理MySQL连接
 */

const { Sequelize } = require('sequelize');
const config = require('./index');

// 创建Sequelize实例
const sequelize = new Sequelize(
  config.database.mysql.database,
  config.database.mysql.username,
  config.database.mysql.password,
  {
    host: config.database.mysql.host,
    port: config.database.mysql.port,
    dialect: config.database.mysql.dialect,
    pool: config.database.mysql.pool,
    logging: config.database.mysql.logging,
    define: config.database.mysql.define,
    timezone: '+08:00', // 设置时区为中国标准时间
    dialectOptions: {
      charset: 'utf8mb4',
      // SSL配置（如果需要）
      ssl: process.env.NODE_ENV === 'production' ? {
        require: true,
        rejectUnauthorized: false
      } : false
    }
  }
);

// 测试数据库连接
const testConnection = async () => {
  try {
    await sequelize.authenticate();
    console.log('✅ MySQL数据库连接成功');
    return true;
  } catch (error) {
    console.error('❌ MySQL数据库连接失败:', error.message);
    return false;
  }
};

// 同步数据库模型
const syncDatabase = async (force = false) => {
  try {
    await sequelize.sync({ force });
    console.log(`✅ 数据库同步完成 (force: ${force})`);
    return true;
  } catch (error) {
    console.error('❌ 数据库同步失败:', error.message);
    return false;
  }
};

// 关闭数据库连接
const closeConnection = async () => {
  try {
    await sequelize.close();
    console.log('✅ MySQL数据库连接已关闭');
  } catch (error) {
    console.error('❌ 关闭数据库连接失败:', error.message);
  }
};

module.exports = {
  sequelize,
  testConnection,
  syncDatabase,
  closeConnection
};
