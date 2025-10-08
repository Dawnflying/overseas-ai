-- 初始化数据库脚本
-- 创建数据库（如果不存在）
CREATE DATABASE IF NOT EXISTS `overseas-ai` DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- 使用数据库
USE `overseas-ai`;

-- 设置时区
SET time_zone = '+08:00';

-- 创建用户（如果不存在）
CREATE USER IF NOT EXISTS 'overseas-ai'@'%' IDENTIFIED BY 'jarvis@888';

-- 授予权限
GRANT ALL PRIVILEGES ON `overseas-ai`.* TO 'overseas-ai'@'%';
GRANT SELECT ON mysql.* TO 'overseas-ai'@'%';

-- 刷新权限
FLUSH PRIVILEGES;

-- 显示数据库信息
SELECT 'Database overseas-ai created successfully' AS message;
SHOW DATABASES;

