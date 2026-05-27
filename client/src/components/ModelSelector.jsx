import useAppStore from '../store/useAppStore';
import { MODELS } from '../utils/constants';

export default function ModelSelector() {
  const selectedModel = useAppStore((s) => s.selectedModel);
  const setModel = useAppStore((s) => s.setModel);

  return (
    <div className="section">
      <div className="section-title">选择模型</div>
      <div className="model-grid">
        {Object.values(MODELS).map((model) => (
          <div
            key={model.key}
            className={`model-card ${selectedModel === model.key ? 'active' : ''}`}
            onClick={() => setModel(model.key)}
          >
            <div className="model-icon">{model.icon}</div>
            <div className="model-name">{model.name}</div>
            <div className="model-desc">{model.description}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
