const fs = require('fs');
const path = require('path');

/**
 * GPTimage2 模型调用服务
 *
 * 支持两种 API 格式：
 * 1. JSON 格式（OpenAI /v1/images/generations 风格）
 * 2. FormData 格式（OpenAI /v1/images/edits 风格）
 *
 * 根据 URL 自动判断使用哪种格式：
 * - URL 包含 "edits" → FormData
 * - 其他 → JSON
 */
async function generate(imagePath, prompt, modelConfig) {
  const imageBuffer = fs.readFileSync(imagePath);
  const mimeType = detectMimeType(imagePath);

  // 判断使用哪种请求格式
  const useFormData = modelConfig.url.includes('/edits');

  if (useFormData) {
    return await generateWithFormData(imagePath, imageBuffer, mimeType, prompt, modelConfig);
  } else {
    return await generateWithJson(imageBuffer, mimeType, prompt, modelConfig);
  }
}

async function generateWithJson(imageBuffer, mimeType, prompt, modelConfig) {
  const base64Image = imageBuffer.toString('base64');

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 60000);

  try {
    const res = await fetch(modelConfig.url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${modelConfig.key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'gpt-image-2',
        prompt: prompt,
        image: `data:${mimeType};base64,${base64Image}`,
        n: 1,
        size: '1024x1024',
        response_format: 'b64_json',
      }),
      signal: controller.signal,
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`GPTimage2 API 错误 (${res.status}): ${errText}`);
    }

    return await parseResponse(res);
  } finally {
    clearTimeout(timeout);
  }
}

async function generateWithFormData(imagePath, imageBuffer, mimeType, prompt, modelConfig) {
  const filename = path.basename(imagePath);

  const form = new FormData();
  form.append('image', new Blob([imageBuffer], { type: mimeType }), filename);
  form.append('prompt', prompt);
  form.append('model', 'gpt-image-2');
  form.append('n', '1');
  form.append('size', '1024x1024');
  form.append('response_format', 'b64_json');

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 60000);

  try {
    const res = await fetch(modelConfig.url, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${modelConfig.key}`,
      },
      body: form,
      signal: controller.signal,
    });

    if (!res.ok) {
      const errText = await res.text();
      throw new Error(`GPTimage2 API 错误 (${res.status}): ${errText}`);
    }

    return await parseResponse(res);
  } finally {
    clearTimeout(timeout);
  }
}

async function parseResponse(res) {
  const data = await res.json();

  // 解析响应：兼容多种返回格式
  let b64;
  if (data.data && data.data[0]) {
    b64 = data.data[0].b64_json || data.data[0].base64;
    if (!b64 && data.data[0].url) {
      const imgRes = await fetch(data.data[0].url);
      const arrayBuf = await imgRes.arrayBuffer();
      return Buffer.from(arrayBuf);
    }
  }

  if (!b64) {
    throw new Error('GPTimage2 返回格式异常，无法解析结果图片');
  }

  return Buffer.from(b64, 'base64');
}

function detectMimeType(filePath) {
  const ext = filePath.toLowerCase().split('.').pop();
  const mimeMap = {
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    webp: 'image/webp',
  };
  return mimeMap[ext] || 'image/png';
}

module.exports = { generate };
