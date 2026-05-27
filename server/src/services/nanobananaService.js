const fs = require('fs');
const path = require('path');

async function generate(imagePath, prompt, modelConfig) {
  const imageBuffer = fs.readFileSync(imagePath);
  const mimeType = detectMimeType(imagePath);
  const filename = path.basename(imagePath);

  // 使用内置 FormData（Node.js 18+）
  const form = new FormData();
  form.append('image', new Blob([imageBuffer], { type: mimeType }), filename);
  form.append('prompt', prompt);

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
      throw new Error(`Nanobanana API 错误 (${res.status}): ${errText}`);
    }

    const contentType = res.headers.get('content-type') || '';

    // 情况1：返回图片二进制流
    if (contentType.includes('image/')) {
      const arrayBuf = await res.arrayBuffer();
      return Buffer.from(arrayBuf);
    }

    // 情况2：返回 JSON（可能包含 base64 或 URL）
    const data = await res.json();

    if (data.image || data.result || data.output) {
      const imgData = data.image || data.result || data.output;

      // base64 字符串
      if (typeof imgData === 'string' && imgData.length > 100) {
        const base64 = imgData.replace(/^data:image\/\w+;base64,/, '');
        return Buffer.from(base64, 'base64');
      }

      // URL
      if (typeof imgData === 'string' && imgData.startsWith('http')) {
        const imgRes = await fetch(imgData);
        const arrayBuf = await imgRes.arrayBuffer();
        return Buffer.from(arrayBuf);
      }
    }

    // 情况3：data.data[0].b64_json 格式
    if (data.data && data.data[0]) {
      const item = data.data[0];
      if (item.b64_json || item.base64) {
        return Buffer.from(item.b64_json || item.base64, 'base64');
      }
      if (item.url) {
        const imgRes = await fetch(item.url);
        const arrayBuf = await imgRes.arrayBuffer();
        return Buffer.from(arrayBuf);
      }
    }

    throw new Error('Nanobanana 返回格式异常，无法解析结果图片');
  } finally {
    clearTimeout(timeout);
  }
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
