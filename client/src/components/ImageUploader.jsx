import { useRef, useState, useCallback } from 'react';
import useAppStore from '../store/useAppStore';
import { validateFile, formatFileSize } from '../utils/imageHelpers';

export default function ImageUploader() {
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);

  const uploadedFile = useAppStore((s) => s.uploadedFile);
  const uploadedPreviewUrl = useAppStore((s) => s.uploadedPreviewUrl);
  const uploadStatus = useAppStore((s) => s.uploadStatus);
  const uploadError = useAppStore((s) => s.uploadError);
  const handleUpload = useAppStore((s) => s.handleUpload);

  const processFile = useCallback((file) => {
    const validation = validateFile(file);
    if (!validation.valid) {
      useAppStore.getState().setUploadStatus('error', validation.error);
      return;
    }
    handleUpload(file);
  }, [handleUpload]);

  const handleClick = () => inputRef.current?.click();

  const handleFileChange = (e) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
    e.target.value = '';
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setDragOver(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) processFile(file);
  };

  const hasImage = uploadedFile && uploadedPreviewUrl;

  return (
    <div className="section">
      <div className="section-title">上传图片</div>
      <div
        className={`uploader ${dragOver ? 'drag-over' : ''} ${hasImage ? 'has-image' : ''}`}
        onClick={hasImage ? undefined : handleClick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <input
          ref={inputRef}
          type="file"
          accept="image/jpeg,image/png,image/webp"
          style={{ display: 'none' }}
          onChange={handleFileChange}
        />

        {hasImage ? (
          <div className="uploader-preview">
            <img src={uploadedPreviewUrl} alt="预览" />
            <div className="uploader-preview-info">
              <div className="uploader-preview-name">{uploadedFile.name}</div>
              <div className="uploader-preview-size">{formatFileSize(uploadedFile.size)}</div>
              <button
                className="uploader-reupload"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClick();
                }}
              >
                重新上传
              </button>
            </div>
          </div>
        ) : (
          <>
            <div className="uploader-icon">📁</div>
            <div className="uploader-text">
              {uploadStatus === 'uploading' ? '上传中...' : '点击或拖拽图片到此处'}
            </div>
            <div className="uploader-hint">支持 JPG / PNG / WEBP，最大 10MB</div>
          </>
        )}

        {uploadError && <div className="uploader-error">{uploadError}</div>}
      </div>
    </div>
  );
}
