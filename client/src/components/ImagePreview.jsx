import useAppStore from '../store/useAppStore';

export default function ImagePreview() {
  const uploadedPreviewUrl = useAppStore((s) => s.uploadedPreviewUrl);
  const resultImageUrl = useAppStore((s) => s.resultImageUrl);
  const generationStatus = useAppStore((s) => s.generationStatus);
  const generationError = useAppStore((s) => s.generationError);

  // 未上传图片 - 显示空状态
  if (!uploadedPreviewUrl) {
    return (
      <div className="preview-container">
        <div className="preview-empty">
          <div className="preview-empty-icon">🖼️</div>
          <div className="preview-empty-text">上传图片开始创作</div>
          <div className="preview-empty-hint">
            在左侧面板上传图片，选择风格后点击生成
          </div>
        </div>
      </div>
    );
  }

  // 生成中 - 显示加载状态
  if (generationStatus === 'generating') {
    return (
      <div className="preview-container">
        <div className="preview-loading">
          <div className="preview-spinner" />
          <div className="preview-loading-text">AI 正在创作中，请稍候...</div>
        </div>
      </div>
    );
  }

  // 生成失败 - 显示错误
  if (generationStatus === 'error') {
    return (
      <div className="preview-container">
        <div className="preview-compare">
          <div className="preview-panel">
            <div className="preview-label">原图</div>
            <img className="preview-image" src={uploadedPreviewUrl} alt="原图" />
          </div>
          <div className="preview-divider" />
          <div className="preview-panel">
            <div className="preview-error">
              <div className="preview-error-icon">⚠️</div>
              <div className="preview-error-text">{generationError || '生成失败，请重试'}</div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 生成成功 - 显示对比
  if (resultImageUrl) {
    return (
      <div className="preview-container">
        <div className="preview-compare">
          <div className="preview-panel">
            <div className="preview-label">原图</div>
            <img className="preview-image" src={uploadedPreviewUrl} alt="原图" />
          </div>
          <div className="preview-divider" />
          <div className="preview-panel">
            <div className="preview-label">生成结果</div>
            <img className="preview-image" src={resultImageUrl} alt="生成结果" />
            <div className="preview-actions">
              <a
                className="preview-btn primary"
                href={resultImageUrl}
                download="picverse-result.png"
              >
                下载图片
              </a>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // 已上传但未生成 - 只显示原图
  return (
    <div className="preview-container">
      <div className="preview-panel">
        <div className="preview-label">原图预览</div>
        <img className="preview-image" src={uploadedPreviewUrl} alt="原图" />
        <div className="preview-empty-hint" style={{ marginTop: 16 }}>
          选择风格后点击「开始生成」
        </div>
      </div>
    </div>
  );
}
