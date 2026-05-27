import useAppStore from '../store/useAppStore';
import { STYLES } from '../utils/constants';

export default function StyleSelector() {
  const selectedStyle = useAppStore((s) => s.selectedStyle);
  const setStyle = useAppStore((s) => s.setStyle);

  return (
    <div className="section">
      <div className="section-title">艺术风格</div>
      <div className="style-grid">
        {Object.values(STYLES).map((style) => (
          <div
            key={style.key}
            className={`style-item ${selectedStyle === style.key ? 'active' : ''}`}
            onClick={() => setStyle(style.key)}
          >
            <div className="style-icon">{style.icon}</div>
            <div className="style-name">{style.name}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
