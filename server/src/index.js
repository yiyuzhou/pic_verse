require('dotenv').config();

const express = require('express');
const cors = require('cors');
const path = require('path');
const config = require('./config');
const { errorHandler } = require('./middleware/errorHandler');

const app = express();
const PORT = config.get().server.port;

// 中间件
app.use(cors());
app.use(express.json());

// 静态文件服务
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));
app.use('/results', express.static(path.join(__dirname, '../results')));

// API 路由
app.use('/api/upload', require('./routes/upload'));
app.use('/api/generate', require('./routes/generate'));
app.use('/api/config', require('./routes/config'));
app.use('/api/meta', require('./routes/meta'));

// 健康检查
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: Date.now() });
});

// 统一错误处理
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`PicVerse server running on http://localhost:${PORT}`);
});
