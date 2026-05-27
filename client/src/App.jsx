import { useEffect } from 'react';
import useAppStore from './store/useAppStore';
import { apiClient } from './api/client';
import ImageUploader from './components/ImageUploader';
import ModelSelector from './components/ModelSelector';
import StyleSelector from './components/StyleSelector';
import FilterPanel from './components/FilterPanel';
import GenerateButton from './components/GenerateButton';
import ImagePreview from './components/ImagePreview';
import ConfigModal from './components/ConfigModal';

export default function App() {
  const configModalOpen = useAppStore((s) => s.configModalOpen);
  const setConfig = useAppStore((s) => s.setConfig);
  const setConfigModalOpen = useAppStore((s) => s.setConfigModalOpen);

  useEffect(() => {
    apiClient.getConfig().then(setConfig).catch(() => {});
  }, []);

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="sidebar-header">
          <h1 className="logo">
            <span className="logo-icon">🎨</span> PicVerse
          </h1>
          <p className="subtitle">AI 图片风格转换</p>
        </div>

        <div className="sidebar-scroll">
          <ImageUploader />
          <ModelSelector />
          <StyleSelector />
          <FilterPanel />
        </div>

        <div className="sidebar-footer">
          <GenerateButton />
          <button
            className="config-trigger"
            onClick={() => setConfigModalOpen(true)}
            title="API 配置"
          >
            ⚙️ API 配置
          </button>
        </div>
      </aside>

      <main className="canvas">
        <ImagePreview />
      </main>

      {configModalOpen && <ConfigModal />}
    </div>
  );
}
