const API_BASE = '/api';

export const apiClient = {
  async upload(file) {
    const form = new FormData();
    form.append('image', file);
    const res = await fetch(`${API_BASE}/upload`, { method: 'POST', body: form });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || '上传失败');
    }
    return res.json();
  },

  async generate({ imageId, model, style, filters }) {
    const res = await fetch(`${API_BASE}/generate`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ imageId, model, style, filters }),
    });
    if (!res.ok) {
      const text = await res.text();
      throw new Error(text || '生成失败');
    }
    return res.json();
  },

  async getConfig() {
    const res = await fetch(`${API_BASE}/config`);
    if (!res.ok) throw new Error('获取配置失败');
    return res.json();
  },

  async updateConfig(config) {
    const res = await fetch(`${API_BASE}/config`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(config),
    });
    if (!res.ok) throw new Error('保存配置失败');
    return res.json();
  },

  async getMeta() {
    const res = await fetch(`${API_BASE}/meta`);
    if (!res.ok) throw new Error('获取元数据失败');
    return res.json();
  },
};
