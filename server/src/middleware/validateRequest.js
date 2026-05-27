const VALID_MODELS = ['gptimage2', 'nanobanana'];
const VALID_STYLES = [
  'anime', 'comic', 'fresh', 'cyberpunk',
  'sketch', 'oil_painting', 'watercolor', 'pixel',
];
const VALID_FILTERS = [
  'vintage', 'bw', 'contrast', 'warm',
  'cool', 'blur', 'sharpen', 'vignette',
];

function validateGenerateRequest(req, res, next) {
  const { imageId, model, style, filters } = req.body;

  if (!imageId) {
    return res.status(400).json({ error: true, message: '缺少图片 ID' });
  }
  // 防路径遍历：只允许字母、数字、短横线
  if (!/^[a-zA-Z0-9-]+$/.test(imageId)) {
    return res.status(400).json({ error: true, message: '图片 ID 格式无效' });
  }
  if (!model || !VALID_MODELS.includes(model)) {
    return res.status(400).json({ error: true, message: `无效的模型: ${model}，可选: ${VALID_MODELS.join(', ')}` });
  }
  if (!style || !VALID_STYLES.includes(style)) {
    return res.status(400).json({ error: true, message: `无效的风格: ${style}，可选: ${VALID_STYLES.join(', ')}` });
  }
  if (filters && !Array.isArray(filters)) {
    return res.status(400).json({ error: true, message: '滤镜参数格式错误' });
  }
  if (filters) {
    for (const f of filters) {
      if (!f.name || !VALID_FILTERS.includes(f.name)) {
        return res.status(400).json({ error: true, message: `无效的滤镜: ${f.name}` });
      }
      if (typeof f.intensity !== 'number' || f.intensity < 0 || f.intensity > 100) {
        return res.status(400).json({ error: true, message: `滤镜强度需在 0-100 之间: ${f.name}` });
      }
    }
  }

  next();
}

module.exports = { validateGenerateRequest, VALID_MODELS, VALID_STYLES, VALID_FILTERS };
