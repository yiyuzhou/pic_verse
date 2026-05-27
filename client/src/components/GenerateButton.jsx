import useAppStore from '../store/useAppStore';

export default function GenerateButton() {
  const uploadedImageId = useAppStore((s) => s.uploadedImageId);
  const selectedStyle = useAppStore((s) => s.selectedStyle);
  const generationStatus = useAppStore((s) => s.generationStatus);
  const handleGenerate = useAppStore((s) => s.handleGenerate);
  const reset = useAppStore((s) => s.reset);

  const isGenerating = generationStatus === 'generating';
  const canGenerate = uploadedImageId && selectedStyle && !isGenerating;

  const getButtonText = () => {
    if (isGenerating) return '生成中...';
    if (!uploadedImageId) return '请先上传图片';
    if (!selectedStyle) return '请选择艺术风格';
    return '开始生成';
  };

  return (
    <>
      <button
        className={`generate-btn ${isGenerating ? 'generating' : ''}`}
        disabled={!canGenerate}
        onClick={handleGenerate}
      >
        {getButtonText()}
      </button>
      <button className="config-trigger" onClick={reset} title="重置所有选项">
        🔄 重置
      </button>
    </>
  );
}
