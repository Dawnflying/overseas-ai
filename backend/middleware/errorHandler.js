/**
 * 错误处理中间件
 * 统一处理应用错误和异常
 */

const config = require('../config');

/**
 * 自定义错误类
 */
class AppError extends Error {
  constructor(message, statusCode = 500, code = 'INTERNAL_ERROR') {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
    this.isOperational = true;
    
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * 处理JWT错误
 * @param {Error} err - 错误对象
 * @returns {AppError} 处理后的错误
 */
const handleJWTError = (err) => {
  return new AppError('无效的访问令牌', 401, 'INVALID_TOKEN');
};

/**
 * 处理JWT过期错误
 * @param {Error} err - 错误对象
 * @returns {AppError} 处理后的错误
 */
const handleJWTExpiredError = (err) => {
  return new AppError('访问令牌已过期', 401, 'TOKEN_EXPIRED');
};

/**
 * 处理验证错误
 * @param {Error} err - 错误对象
 * @returns {AppError} 处理后的错误
 */
const handleValidationError = (err) => {
  const errors = Object.values(err.errors).map(el => el.message);
  return new AppError(`数据验证失败: ${errors.join(', ')}`, 400, 'VALIDATION_ERROR');
};

/**
 * 处理重复键错误
 * @param {Error} err - 错误对象
 * @returns {AppError} 处理后的错误
 */
const handleDuplicateFieldsError = (err) => {
  const value = err.errmsg.match(/(["'])(\\?.)*?\1/)[0];
  return new AppError(`重复字段值: ${value}`, 400, 'DUPLICATE_FIELD');
};

/**
 * 处理文件上传错误
 * @param {Error} err - 错误对象
 * @returns {AppError} 处理后的错误
 */
const handleMulterError = (err) => {
  if (err.code === 'LIMIT_FILE_SIZE') {
    return new AppError('文件大小超出限制', 400, 'FILE_TOO_LARGE');
  }
  if (err.code === 'LIMIT_FILE_COUNT') {
    return new AppError('文件数量超出限制', 400, 'TOO_MANY_FILES');
  }
  return new AppError('文件上传失败', 400, 'UPLOAD_ERROR');
};

/**
 * 发送开发环境错误响应
 * @param {Error} err - 错误对象
 * @param {Object} res - Express响应对象
 */
const sendErrorDev = (err, res) => {
  res.status(err.statusCode).json({
    error: err.message,
    code: err.code,
    stack: err.stack,
    details: err.details || null
  });
};

/**
 * 发送生产环境错误响应
 * @param {Error} err - 错误对象
 * @param {Object} res - Express响应对象
 */
const sendErrorProd = (err, res) => {
  // 操作错误：发送消息给客户端
  if (err.isOperational) {
    res.status(err.statusCode).json({
      error: err.message,
      code: err.code
    });
  } else {
    // 编程错误：不泄露错误详情
    console.error('ERROR 💥', err);
    
    res.status(500).json({
      error: '服务器内部错误',
      code: 'INTERNAL_ERROR'
    });
  }
};

/**
 * 全局错误处理中间件
 * @param {Error} err - 错误对象
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 * @param {Function} next - Express next函数
 */
const globalErrorHandler = (err, req, res, next) => {
  err.statusCode = err.statusCode || 500;
  err.code = err.code || 'INTERNAL_ERROR';

  // 记录错误日志
  console.error(`[${new Date().toISOString()}] Error:`, {
    message: err.message,
    code: err.code,
    statusCode: err.statusCode,
    stack: err.stack,
    url: req.originalUrl,
    method: req.method,
    ip: req.ip,
    userAgent: req.get('User-Agent')
  });

  // 根据错误类型进行处理
  if (err.name === 'JsonWebTokenError') {
    err = handleJWTError(err);
  } else if (err.name === 'TokenExpiredError') {
    err = handleJWTExpiredError(err);
  } else if (err.name === 'ValidationError') {
    err = handleValidationError(err);
  } else if (err.code === 11000) {
    err = handleDuplicateFieldsError(err);
  } else if (err.name === 'MulterError') {
    err = handleMulterError(err);
  }

  // 根据环境发送不同的错误响应
  if (config.server.env === 'development') {
    sendErrorDev(err, res);
  } else {
    sendErrorProd(err, res);
  }
};

/**
 * 处理未捕获的异常
 */
const handleUncaughtException = () => {
  process.on('uncaughtException', (err) => {
    console.error('未捕获的异常 💥', err);
    console.log('正在关闭服务器...');
    process.exit(1);
  });
};

/**
 * 处理未处理的Promise拒绝
 */
const handleUnhandledRejection = () => {
  process.on('unhandledRejection', (err) => {
    console.error('未处理的Promise拒绝 💥', err);
    console.log('正在关闭服务器...');
    process.exit(1);
  });
};

/**
 * 404错误处理中间件
 * @param {Object} req - Express请求对象
 * @param {Object} res - Express响应对象
 */
const notFoundHandler = (req, res) => {
  res.status(404).json({
    error: '接口不存在',
    code: 'NOT_FOUND',
    path: req.originalUrl,
    method: req.method
  });
};

module.exports = {
  AppError,
  globalErrorHandler,
  handleUncaughtException,
  handleUnhandledRejection,
  notFoundHandler
};
