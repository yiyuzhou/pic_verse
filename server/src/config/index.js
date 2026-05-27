const fs = require('fs');
const path = require('path');

const ENV_PATH = path.join(__dirname, '../../.env');

let runtimeConfig = {
  gptimage2: {
    url: process.env.GPTIMAGE2_API_URL || '',
    key: process.env.GPTIMAGE2_API_KEY || '',
  },
  nanobanana: {
    url: process.env.NANOBANANA_API_URL || '',
    key: process.env.NANOBANANA_API_KEY || '',
  },
  server: {
    port: parseInt(process.env.PORT) || 3001,
  },
};

module.exports = {
  get() {
    return runtimeConfig;
  },

  getModelConfig(modelKey) {
    return runtimeConfig[modelKey] || null;
  },

  update(newConfig) {
    if (newConfig.gptimage2) {
      if (newConfig.gptimage2.url !== undefined) runtimeConfig.gptimage2.url = newConfig.gptimage2.url;
      if (newConfig.gptimage2.key !== undefined) runtimeConfig.gptimage2.key = newConfig.gptimage2.key;
    }
    if (newConfig.nanobanana) {
      if (newConfig.nanobanana.url !== undefined) runtimeConfig.nanobanana.url = newConfig.nanobanana.url;
      if (newConfig.nanobanana.key !== undefined) runtimeConfig.nanobanana.key = newConfig.nanobanana.key;
    }
    persistEnv();
  },

  getMasked() {
    return {
      gptimage2: {
        url: runtimeConfig.gptimage2.url,
        keyMasked: maskKey(runtimeConfig.gptimage2.key),
      },
      nanobanana: {
        url: runtimeConfig.nanobanana.url,
        keyMasked: maskKey(runtimeConfig.nanobanana.key),
      },
    };
  },
};

function maskKey(key) {
  if (!key) return '';
  if (key.length <= 4) return '****';
  return key.slice(0, 4) + '****';
}

function persistEnv() {
  const lines = [
    '# Server',
    `PORT=${runtimeConfig.server.port}`,
    '',
    '# GPTimage2 Configuration',
    `GPTIMAGE2_API_URL=${runtimeConfig.gptimage2.url}`,
    `GPTIMAGE2_API_KEY=${runtimeConfig.gptimage2.key}`,
    '',
    '# nanobanana Configuration',
    `NANOBANANA_API_URL=${runtimeConfig.nanobanana.url}`,
    `NANOBANANA_API_KEY=${runtimeConfig.nanobanana.key}`,
    '',
  ];
  try {
    fs.writeFileSync(ENV_PATH, lines.join('\n'), 'utf-8');
  } catch (e) {
    console.error('Failed to persist .env:', e.message);
  }
}
