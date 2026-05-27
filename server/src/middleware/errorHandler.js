const multer = require('multer');

function errorHandler(err, req, res, _next) {
  console.error('[Error]', err.message);

  // multer 文件格式/大小错误
  if (err instanceof multer.MulterError) {
    if (err.code === 'LIMIT_FILE_SIZE') {
      return res.status(400).json({ error: true, message: '文件大小不能超过 10MB' });
    }
    return res.status(400).json({ error: true, message: err.message });
  }

  // 自定义业务错误
  if (err.statusCode) {
    return res.status(err.statusCode).json({
      error: true,
      message: err.message,
    });
  }

  // 默认 500
  res.status(500).json({
    error: true,
    message: '服务器内部错误',
  });
}

// 辅助：创建业务错误
function createError(statusCode, message) {
  const err = new Error(message);
  err.statusCode = statusCode;
  return err;
}

module.exports = { errorHandler, createError };
