import { FILE_LIMITS } from './constants';

/**
 * 校验上传文件的格式和大小
 */
export function validateFile(file) {
  if (!file) return { valid: false, error: '请选择文件' };
  if (!FILE_LIMITS.ALLOWED_TYPES.includes(file.type)) {
    return { valid: false, error: '仅支持 JPG / PNG / WEBP 格式' };
  }
  if (file.size > FILE_LIMITS.MAX_SIZE) {
    return { valid: false, error: '文件大小不能超过 10MB' };
  }
  return { valid: true };
}

/**
 * 创建本地预览 URL
 */
export function createPreviewUrl(file) {
  return URL.createObjectURL(file);
}

/**
 * 释放预览 URL 占用的内存
 */
export function revokePreviewUrl(url) {
  if (url) URL.revokeObjectURL(url);
}

/**
 * 格式化文件大小显示
 */
export function formatFileSize(bytes) {
  if (bytes < 1024) return bytes + ' B';
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
  return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
}
