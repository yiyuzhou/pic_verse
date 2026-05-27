import { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import useAppStore from '../store/useAppStore';
import { apiClient } from '../api/client';

export default function ConfigModal() {
  const config = useAppStore((s) => s.config);
  const setConfig = useAppStore((s) => s.setConfig);
  const setConfigModalOpen = useAppStore((s) => s.setConfigModalOpen);

  const [gptUrl, setGptUrl] = useState(config.gptimage2?.url || '');
  const [gptKey, setGptKey] = useState('');
  const [nanoUrl, setNanoUrl] = useState(config.nanobanana?.url || '');
  const [nanoKey, setNanoKey] = useState('');
  const [status, setStatus] = useState(null); // { type: 'success'|'error', message }

  useEffect(() => {
    apiClient.getConfig().then((data) => {
      setGptUrl(data.gptimage2?.url || '');
      setNanoUrl(data.nanobanana?.url || '');
      // keyMasked 仅用于展示，不回填真实 key
    }).catch(() => {});
  }, []);

  const handleSave = async () => {
    try {
      await apiClient.updateConfig({
        gptimage2: { url: gptUrl, key: gptKey },
        nanobanana: { url: nanoUrl, key: nanoKey },
      });
      setConfig({
        gptimage2: { url: gptUrl, keyMasked: maskKey(gptKey) },
        nanobanana: { url: nanoUrl, keyMasked: maskKey(nanoKey) },
      });
      setStatus({ type: 'success', message: '配置已保存' });
      setTimeout(() => setStatus(null), 2000);
    } catch (e) {
      setStatus({ type: 'error', message: e.message || '保存失败' });
    }
  };

  return createPortal(
    <div className="modal-overlay" onClick={() => setConfigModalOpen(false)}>
      <div className="modal" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">⚙️ API 配置</div>
          <button className="modal-close" onClick={() => setConfigModalOpen(false)}>
            &times;
          </button>
        </div>

        <div className="modal-body">
          <div className="model-config">
            <div className="model-config-title">🎨 GPTimage2</div>
            <div className="form-group">
              <label className="form-label">API URL</label>
              <input
                className="form-input"
                type="text"
                placeholder="https://api.openai.com/v1/images/generations"
                value={gptUrl}
                onChange={(e) => setGptUrl(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">API Key</label>
              <input
                className="form-input"
                type="password"
                placeholder="sk-..."
                value={gptKey}
                onChange={(e) => setGptKey(e.target.value)}
              />
            </div>
          </div>

          <div className="model-config">
            <div className="model-config-title">🍌 Nanobanana</div>
            <div className="form-group">
              <label className="form-label">API URL</label>
              <input
                className="form-input"
                type="text"
                placeholder="https://api.nanobanana.com/..."
                value={nanoUrl}
                onChange={(e) => setNanoUrl(e.target.value)}
              />
            </div>
            <div className="form-group">
              <label className="form-label">API Key</label>
              <input
                className="form-input"
                type="password"
                placeholder="输入 API Key"
                value={nanoKey}
                onChange={(e) => setNanoKey(e.target.value)}
              />
            </div>
          </div>

          {status && (
            <div className={`config-status ${status.type}`}>{status.message}</div>
          )}
        </div>

        <div className="modal-footer">
          <button className="modal-btn cancel" onClick={() => setConfigModalOpen(false)}>
            取消
          </button>
          <button className="modal-btn save" onClick={handleSave}>
            保存配置
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}

function maskKey(key) {
  if (!key) return '';
  if (key.length <= 4) return '****';
  return key.slice(0, 4) + '****';
}
