const sharp = require('sharp');
const path = require('path');

/**
 * 模拟生成服务 - 用本地图片处理模拟 AI 风格转换
 * 用于在无 API Key 时验证完整生成链路
 */

const STYLE_TRANSFORMS = {
  anime: async (img) => img
    .modulate({ saturation: 1.4, brightness: 1.1 })
    .sharpen({ sigma: 1.5 })
    .tint({ r: 255, g: 240, b: 245 }),

  comic: async (img) => img
    .grayscale()
    .normalize()
    .sharpen({ sigma: 2 })
    .tint({ r: 240, g: 240, b: 255 }),

  fresh: async (img) => img
    .modulate({ saturation: 0.8, brightness: 1.2 })
    .tint({ r: 255, g: 250, b: 240 })
    .linear(1.05, -10),

  cyberpunk: async (img) => img
    .modulate({ saturation: 1.6, brightness: 0.9 })
    .tint({ r: 200, g: 180, b: 255 })
    .linear(1.2, -20),

  sketch: async (img) => img
    .grayscale()
    .negate()
    .blur(3)
    .sharpen({ sigma: 3 })
    .normalize(),

  oil_painting: async (img) => img
    .modulate({ saturation: 1.3, brightness: 1.05 })
    .blur(1.5)
    .sharpen({ sigma: 0.8 })
    .tint({ r: 255, g: 248, b: 230 }),

  watercolor: async (img) => img
    .modulate({ saturation: 0.9, brightness: 1.15 })
    .blur(2)
    .tint({ r: 250, g: 245, b: 255 })
    .linear(0.9, 15),

  pixel: async (img) => {
    const { width, height } = await img.metadata();
    const pixelSize = Math.max(4, Math.floor(Math.min(width, height) / 64));
    return img
      .resize(Math.floor(width / pixelSize), Math.floor(height / pixelSize), { kernel: 'nearest' })
      .resize(width, height, { kernel: 'nearest' })
      .modulate({ saturation: 1.3 });
  },
};

const FILTER_TRANSFORMS = {
  vintage: (intensity) => (img) => {
    const factor = intensity / 100;
    return img
      .modulate({ saturation: 1 - factor * 0.4 })
      .tint({ r: Math.round(255), g: Math.round(245 - factor * 20), b: Math.round(230 - factor * 40) });
  },

  bw: (intensity) => (img) => {
    const factor = intensity / 100;
    if (factor > 0.8) return img.grayscale();
    return img.modulate({ saturation: 1 - factor });
  },

  contrast: (intensity) => (img) => {
    const factor = 1 + (intensity / 100) * 0.5;
    return img.linear(factor, -(128 * factor - 128));
  },

  warm: (intensity) => (img) => {
    const factor = intensity / 100;
    return img.tint({ r: 255, g: Math.round(255 - factor * 15), b: Math.round(255 - factor * 40) });
  },

  cool: (intensity) => (img) => {
    const factor = intensity / 100;
    return img.tint({ r: Math.round(255 - factor * 40), g: Math.round(255 - factor * 15), b: 255 });
  },

  blur: (intensity) => (img) => {
    const sigma = (intensity / 100) * 5;
    return img.blur(sigma);
  },

  sharpen: (intensity) => (img) => {
    const sigma = (intensity / 100) * 3;
    return img.sharpen({ sigma });
  },

  vignette: (intensity) => async (img) => {
    const { width, height } = await img.metadata();
    const factor = intensity / 100;
    const r = Math.round(Math.min(width, height) * 0.5);
    const overlay = Buffer.from(
      `<svg><defs><radialGradient id="v" cx="50%" cy="50%" r="50%">
        <stop offset="${Math.round((1 - factor) * 100)}%" stop-color="white" stop-opacity="0"/>
        <stop offset="100%" stop-color="black" stop-opacity="${factor * 0.7}"/>
      </radialGradient></defs>
      <rect width="100%" height="100%" fill="url(#v)"/></svg>`
    );
    return img.composite([{ input: overlay, blend: 'multiply' }]);
  },
};

async function generate(imagePath, prompt, modelConfig, style, filters) {
  let img = sharp(imagePath);

  // 应用风格变换
  const styleTransform = STYLE_TRANSFORMS[style];
  if (styleTransform) {
    img = await styleTransform(img);
  }

  // 应用滤镜变换（按顺序叠加）
  if (filters && filters.length > 0) {
    for (const f of filters) {
      if (f.intensity > 0 && FILTER_TRANSFORMS[f.name]) {
        const transform = FILTER_TRANSFORMS[f.name](f.intensity);
        img = await transform(img);
      }
    }
  }

  // 输出 PNG buffer
  return await img.png().toBuffer();
}

module.exports = { generate };
