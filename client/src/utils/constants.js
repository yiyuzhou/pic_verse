// 模型定义
export const MODELS = {
  gptimage2: {
    key: 'gptimage2',
    name: 'GPTimage2',
    icon: '🎨',
    description: 'OpenAI 图像生成模型，细节丰富、色彩精准',
  },
  nanobanana: {
    key: 'nanobanana',
    name: 'Nanobanana',
    icon: '🍌',
    description: '高性价比图像生成，风格多变、速度快',
  },
};

// 风格定义
export const STYLES = {
  anime: {
    key: 'anime',
    name: '动漫',
    icon: '🎌',
    prompt: 'Convert to Japanese anime art style with cel-shading, vibrant colors, and detailed line art.',
  },
  comic: {
    key: 'comic',
    name: '漫画',
    icon: '💬',
    prompt: 'Convert to comic book style with bold outlines, halftone dots, and dynamic shading.',
  },
  fresh: {
    key: 'fresh',
    name: '小清新',
    icon: '🌿',
    prompt: 'Apply a light, fresh aesthetic with soft pastel tones, gentle lighting, and airy atmosphere.',
  },
  cyberpunk: {
    key: 'cyberpunk',
    name: '赛博朋克',
    icon: '🌃',
    prompt: 'Apply cyberpunk aesthetic with neon glow, dark atmosphere, high-tech elements, and rain-slicked surfaces.',
  },
  sketch: {
    key: 'sketch',
    name: '素描',
    icon: '✏️',
    prompt: 'Convert to pencil sketch style with graphite texture, cross-hatching, and paper background.',
  },
  oil_painting: {
    key: 'oil_painting',
    name: '油画',
    icon: '🖼️',
    prompt: 'Convert to oil painting style with visible brushstrokes, rich textures, and classical composition.',
  },
  watercolor: {
    key: 'watercolor',
    name: '水彩',
    icon: '🎨',
    prompt: 'Convert to watercolor style with soft washes, color bleeding, and translucent layers.',
  },
  pixel: {
    key: 'pixel',
    name: '像素风',
    icon: '👾',
    prompt: 'Convert to pixel art style with limited palette, visible pixels, and retro game aesthetics.',
  },
};

// 滤镜定义
export const FILTERS = {
  vintage: {
    key: 'vintage',
    name: '复古',
    icon: '📷',
    prompt: {
      subtle: 'with subtle vintage color grading and light film grain',
      moderate: 'with moderate vintage color grading and film grain',
      strong: 'with strong vintage color grading and heavy film grain',
    },
  },
  bw: {
    key: 'bw',
    name: '黑白',
    icon: '⬛',
    prompt: {
      subtle: 'with slight desaturation toward monochrome',
      moderate: 'with mostly monochrome tones and slight color hints',
      strong: 'in pure black and white with high contrast',
    },
  },
  contrast: {
    key: 'contrast',
    name: '高对比',
    icon: '◐',
    prompt: {
      subtle: 'with slightly enhanced contrast',
      moderate: 'with noticeably enhanced contrast and deeper shadows',
      strong: 'with dramatic high contrast, deep blacks and bright highlights',
    },
  },
  warm: {
    key: 'warm',
    name: '暖色调',
    icon: '🌅',
    prompt: {
      subtle: 'with a subtle warm tone shift',
      moderate: 'with a warm golden tone throughout',
      strong: 'with a strong warm orange-gold color cast',
    },
  },
  cool: {
    key: 'cool',
    name: '冷色调',
    icon: '❄️',
    prompt: {
      subtle: 'with a subtle cool blue tone shift',
      moderate: 'with a cool blue-cyan tone throughout',
      strong: 'with a strong icy blue color cast',
    },
  },
  blur: {
    key: 'blur',
    name: '模糊',
    icon: '🌫️',
    prompt: {
      subtle: 'with a slight soft-focus dreamy effect',
      moderate: 'with a moderate soft-focus bokeh effect',
      strong: 'with a strong dreamy soft-focus blur effect',
    },
  },
  sharpen: {
    key: 'sharpen',
    name: '锐化',
    icon: '🔍',
    prompt: {
      subtle: 'with slightly enhanced sharpness and detail clarity',
      moderate: 'with enhanced sharpness and crisp details',
      strong: 'with maximum sharpness and hyper-detailed textures',
    },
  },
  vignette: {
    key: 'vignette',
    name: '晕影',
    icon: '🔘',
    prompt: {
      subtle: 'with a subtle dark vignette around the edges',
      moderate: 'with a moderate dark vignette framing the subject',
      strong: 'with a dramatic dark vignette strongly framing the center',
    },
  },
};

// 文件限制
export const FILE_LIMITS = {
  MAX_SIZE: 10 * 1024 * 1024, // 10MB
  ALLOWED_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  ALLOWED_EXTENSIONS: ['.jpg', '.jpeg', '.png', '.webp'],
};
