const STYLES_PROMPT = {
  anime: 'Convert to Japanese anime art style with cel-shading, vibrant colors, and detailed line art.',
  comic: 'Convert to comic book style with bold outlines, halftone dots, and dynamic shading.',
  fresh: 'Apply a light, fresh aesthetic with soft pastel tones, gentle lighting, and airy atmosphere.',
  cyberpunk: 'Apply cyberpunk aesthetic with neon glow, dark atmosphere, high-tech elements, and rain-slicked surfaces.',
  sketch: 'Convert to pencil sketch style with graphite texture, cross-hatching, and paper background.',
  oil_painting: 'Convert to oil painting style with visible brushstrokes, rich textures, and classical composition.',
  watercolor: 'Convert to watercolor style with soft washes, color bleeding, and translucent layers.',
  pixel: 'Convert to pixel art style with limited palette, visible pixels, and retro game aesthetics.',
};

const FILTERS_PROMPT = {
  vintage: {
    subtle: 'with subtle vintage color grading and light film grain',
    moderate: 'with moderate vintage color grading and film grain',
    strong: 'with strong vintage color grading and heavy film grain',
  },
  bw: {
    subtle: 'with slight desaturation toward monochrome',
    moderate: 'with mostly monochrome tones and slight color hints',
    strong: 'in pure black and white with high contrast',
  },
  contrast: {
    subtle: 'with slightly enhanced contrast',
    moderate: 'with noticeably enhanced contrast and deeper shadows',
    strong: 'with dramatic high contrast, deep blacks and bright highlights',
  },
  warm: {
    subtle: 'with a subtle warm tone shift',
    moderate: 'with a warm golden tone throughout',
    strong: 'with a strong warm orange-gold color cast',
  },
  cool: {
    subtle: 'with a subtle cool blue tone shift',
    moderate: 'with a cool blue-cyan tone throughout',
    strong: 'with a strong icy blue color cast',
  },
  blur: {
    subtle: 'with a slight soft-focus dreamy effect',
    moderate: 'with a moderate soft-focus bokeh effect',
    strong: 'with a strong dreamy soft-focus blur effect',
  },
  sharpen: {
    subtle: 'with slightly enhanced sharpness and detail clarity',
    moderate: 'with enhanced sharpness and crisp details',
    strong: 'with maximum sharpness and hyper-detailed textures',
  },
  vignette: {
    subtle: 'with a subtle dark vignette around the edges',
    moderate: 'with a moderate dark vignette framing the subject',
    strong: 'with a dramatic dark vignette strongly framing the center',
  },
};

function getIntensityLevel(intensity) {
  if (intensity <= 30) return 'subtle';
  if (intensity <= 60) return 'moderate';
  return 'strong';
}

function buildPrompt(style, filters) {
  const parts = [];

  // 基础指令：保留主体结构
  parts.push('Transform this image while preserving the original composition and core subject structure.');

  // 风格提示词（主要，优先级高）
  const stylePrompt = STYLES_PROMPT[style];
  if (stylePrompt) {
    parts.push(stylePrompt);
  }

  // 滤镜提示词（辅助，优先级低）
  if (filters && filters.length > 0) {
    const filterParts = [];
    for (const f of filters) {
      if (f.intensity > 0 && FILTERS_PROMPT[f.name]) {
        const level = getIntensityLevel(f.intensity);
        filterParts.push(FILTERS_PROMPT[f.name][level]);
      }
    }
    if (filterParts.length > 0) {
      parts.push(filterParts.join(', ') + '.');
    }
  }

  // 主体不变性约束
  parts.push('Keep the main subject, composition, and spatial layout unchanged.');

  // 质量约束：防止 AI 瑕疵
  parts.push('Output must be high quality, sharp, well-rendered, without distortion, blurriness, or artifacts.');

  return parts.join(' ');
}

module.exports = { buildPrompt };
