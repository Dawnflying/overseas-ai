/**
 * 请求验证中间件
 * 统一处理请求参数验证
 */

/**
 * 验证必填字段
 * @param {Array} requiredFields - 必填字段数组
 * @returns {Function} Express中间件函数
 */
const validateRequired = (requiredFields) => {
  return (req, res, next) => {
    const missingFields = [];
    
    for (const field of requiredFields) {
      if (!req.body[field] || req.body[field].toString().trim() === '') {
        missingFields.push(field);
      }
    }
    
    if (missingFields.length > 0) {
      return res.status(400).json({
        error: '缺少必填字段',
        missingFields: missingFields
      });
    }
    
    next();
  };
};

/**
 * 验证邮箱格式
 * @param {string} email - 邮箱地址
 * @returns {boolean} 是否有效
 */
const isValidEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

/**
 * 验证密码强度
 * @param {string} password - 密码
 * @returns {Object} 验证结果
 */
const validatePassword = (password) => {
  const result = {
    isValid: true,
    errors: []
  };
  
  if (password.length < 6) {
    result.isValid = false;
    result.errors.push('密码长度至少6位');
  }
  
  if (password.length > 50) {
    result.isValid = false;
    result.errors.push('密码长度不能超过50位');
  }
  
  return result;
};

/**
 * 验证查询参数
 * @param {Object} schema - 验证模式
 * @returns {Function} Express中间件函数
 */
const validateQuery = (schema) => {
  return (req, res, next) => {
    const errors = [];
    
    for (const [field, rules] of Object.entries(schema)) {
      const value = req.query[field];
      
      if (rules.required && (!value || value.toString().trim() === '')) {
        errors.push(`${field} 是必填参数`);
        continue;
      }
      
      if (value && rules.type) {
        if (rules.type === 'number' && isNaN(Number(value))) {
          errors.push(`${field} 必须是数字`);
        } else if (rules.type === 'boolean' && !['true', 'false'].includes(value)) {
          errors.push(`${field} 必须是布尔值`);
        }
      }
      
      if (value && rules.min && Number(value) < rules.min) {
        errors.push(`${field} 不能小于 ${rules.min}`);
      }
      
      if (value && rules.max && Number(value) > rules.max) {
        errors.push(`${field} 不能大于 ${rules.max}`);
      }
    }
    
    if (errors.length > 0) {
      return res.status(400).json({
        error: '查询参数验证失败',
        details: errors
      });
    }
    
    next();
  };
};

/**
 * 验证文件上传
 * @param {Object} options - 验证选项
 * @returns {Function} Express中间件函数
 */
const validateFileUpload = (options = {}) => {
  return (req, res, next) => {
    if (!req.file) {
      return res.status(400).json({
        error: '没有上传文件'
      });
    }
    
    const { maxSize = 5 * 1024 * 1024, allowedTypes = ['image/jpeg', 'image/png', 'image/gif'] } = options;
    
    if (req.file.size > maxSize) {
      return res.status(400).json({
        error: `文件大小不能超过 ${Math.round(maxSize / 1024 / 1024)}MB`
      });
    }
    
    if (!allowedTypes.includes(req.file.mimetype)) {
      return res.status(400).json({
        error: `不支持的文件类型，仅支持: ${allowedTypes.join(', ')}`
      });
    }
    
    next();
  };
};

/**
 * 验证分页参数
 * @returns {Function} Express中间件函数
 */
const validatePagination = () => {
  return (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 20;
    
    if (page < 1) {
      return res.status(400).json({
        error: '页码必须大于0'
      });
    }
    
    if (limit < 1 || limit > 100) {
      return res.status(400).json({
        error: '每页数量必须在1-100之间'
      });
    }
    
    req.pagination = { page, limit };
    next();
  };
};

module.exports = {
  validateRequired,
  isValidEmail,
  validatePassword,
  validateQuery,
  validateFileUpload,
  validatePagination
};
