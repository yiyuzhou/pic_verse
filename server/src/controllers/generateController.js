const fs = require('fs');
const path = require('path');
const config = require('../config');
const { buildPrompt } = require('../services/promptBuilder');
const gptimage2Service = require('../services/gptimage2Service');
const nanobananaService = require('../services/nanobananaService');
const mockService = require('../services/mockService');

const UPLOADS_DIR = path.join(__dirname, '../../uploads');
const RESULTS_DIR = path.join(__dirname, '../../results');

async function handleGenerate(req, res, next) {
  const { imageId, model, style, filters } = req.body;

  try {

    // 1. 查找原图文件
    const imageFile = findImageFile(imageId);
    if (!imageFile) {
      return res.status(404).json({ error: true, message: '找不到上传的图片' });
    }

    // 2. 获取模型配置
    const modelConfig = config.getModelConfig(model);

    // 3. 构建提示词
    const prompt = buildPrompt(style, filters || []);

    // 4. 调用对应模型（无 API Key 时使用本地模拟生成）
    const imagePath = path.join(UPLOADS_DIR, imageFile);
    let resultBuffer;
    const useMock = !modelConfig || !modelConfig.url || !modelConfig.key;

    if (useMock) {
      resultBuffer = await mockService.generate(imagePath, prompt, modelConfig, style, filters || []);
    } else if (model === 'gptimage2') {
      resultBuffer = await gptimage2Service.generate(imagePath, prompt, modelConfig);
    } else {
      resultBuffer = await nanobananaService.generate(imagePath, prompt, modelConfig);
    }

    // 5. 保存结果
    const resultFilename = `result-${Date.now()}.png`;
    const resultPath = path.join(RESULTS_DIR, resultFilename);
    fs.writeFileSync(resultPath, resultBuffer);

    res.json({
      id: resultFilename.replace('.png', ''),
      status: 'done',
      resultUrl: `/results/${resultFilename}`,
    });
  } catch (err) {
    // 网络错误 / API 错误 / 超时
    if (err.name === 'AbortError') {
      return res.status(502).json({ error: true, message: 'AI 模型调用超时，请重试' });
    }
    if (err.message?.includes('fetch failed') || err.code === 'ECONNREFUSED') {
      return res.status(502).json({ error: true, message: `无法连接到 ${model} API，请检查 URL 配置` });
    }
    if (err.message?.includes('API 错误')) {
      return res.status(502).json({ error: true, message: err.message });
    }
    next(err);
  }
}

function findImageFile(imageId) {
  // 防路径遍历：只允许字母、数字、短横线、UUID 格式
  if (!/^[a-zA-Z0-9-]+$/.test(imageId)) return null;
  const files = fs.readdirSync(UPLOADS_DIR);
  return files.find((f) => f.startsWith(imageId)) || null;
}

module.exports = { handleGenerate };
