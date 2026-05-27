import useAppStore from '../store/useAppStore';
import { FILTERS } from '../utils/constants';

export default function FilterPanel() {
  const activeFilters = useAppStore((s) => s.activeFilters);
  const toggleFilter = useAppStore((s) => s.toggleFilter);
  const setFilterIntensity = useAppStore((s) => s.setFilterIntensity);

  return (
    <div className="section">
      <div className="section-title">滤镜特效</div>
      <div className="filter-list">
        {Object.values(FILTERS).map((filter) => {
          const state = activeFilters[filter.key];
          const enabled = state?.enabled ?? false;
          const intensity = state?.intensity ?? 50;

          return (
            <div key={filter.key} className={`filter-item ${enabled ? 'enabled' : ''}`}>
              <div className="filter-header" onClick={() => toggleFilter(filter.key)}>
                <span className="filter-icon">{filter.icon}</span>
                <span className="filter-name">{filter.name}</span>
                <div className={`filter-toggle ${enabled ? 'on' : ''}`} />
              </div>
              {enabled && (
                <div className="filter-slider">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={intensity}
                    onChange={(e) => setFilterIntensity(filter.key, parseInt(e.target.value))}
                  />
                  <span className="filter-value">{intensity}</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
