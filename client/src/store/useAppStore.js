import { create } from 'zustand';
import { apiClient } from '../api/client';
import { createPreviewUrl, revokePreviewUrl } from '../utils/imageHelpers';

const useAppStore = create((set, get) => ({
  // ── 上传状态 ──
  uploadedFile: null,
  uploadedImageId: null,
  uploadedPreviewUrl: null,
  uploadStatus: 'idle', // idle | uploading | done | error
  uploadError: null,

  // ── 模型选择 ──
  selectedModel: 'gptimage2',

  // ── 风格选择 ──
  selectedStyle: null,

  // ── 滤镜状态 ──
  activeFilters: {},

  // ── 生成状态 ──
  generationStatus: 'idle', // idle | generating | done | error
  generationError: null,
  resultImageUrl: null,

  // ── 配置状态 ──
  config: {
    gptimage2: { url: '', keyMasked: '' },
    nanobanana: { url: '', keyMasked: '' },
  },
  configModalOpen: false,

  // ── Actions ──
  setUploadedImage: (file, imageId, previewUrl) => {
    const oldUrl = get().uploadedPreviewUrl;
    revokePreviewUrl(oldUrl);
    set({
      uploadedFile: file,
      uploadedImageId: imageId,
      uploadedPreviewUrl: previewUrl,
      uploadStatus: 'done',
      uploadError: null,
      resultImageUrl: null,
      generationStatus: 'idle',
      generationError: null,
    });
  },

  setUploadStatus: (status, error) => set({
    uploadStatus: status,
    uploadError: error || null,
  }),

  setModel: (model) => set({ selectedModel: model }),

  setStyle: (style) => set({ selectedStyle: style }),

  toggleFilter: (filterName) => set((state) => {
    const current = state.activeFilters[filterName];
    return {
      activeFilters: {
        ...state.activeFilters,
        [filterName]: {
          enabled: current ? !current.enabled : true,
          intensity: current?.intensity ?? 50,
        },
      },
    };
  }),

  setFilterIntensity: (filterName, intensity) => set((state) => ({
    activeFilters: {
      ...state.activeFilters,
      [filterName]: {
        ...state.activeFilters[filterName],
        intensity,
      },
    },
  })),

  setGenerationStatus: (status, error) => set({
    generationStatus: status,
    generationError: error || null,
  }),

  setResultImageUrl: (url) => set({
    resultImageUrl: url,
    generationStatus: 'done',
    generationError: null,
  }),

  setConfig: (config) => set({ config }),
  setConfigModalOpen: (open) => set({ configModalOpen: open }),

  // ── 异步 Actions ──
  handleUpload: async (file) => {
    set({ uploadStatus: 'uploading', uploadError: null });
    try {
      const previewUrl = createPreviewUrl(file);
      const result = await apiClient.upload(file);
      get().setUploadedImage(file, result.id, previewUrl);
    } catch (e) {
      set({ uploadStatus: 'error', uploadError: e.message });
    }
  },

  handleGenerate: async () => {
    const { uploadedImageId, selectedModel, selectedStyle, activeFilters, generationStatus } = get();
    if (!uploadedImageId || !selectedStyle) return;
    if (generationStatus === 'generating') return; // 防重复提交

    set({ generationStatus: 'generating', generationError: null, resultImageUrl: null });
    try {
      const filters = Object.entries(activeFilters)
        .filter(([, v]) => v.enabled)
        .map(([name, v]) => ({ name, intensity: v.intensity }));

      const result = await apiClient.generate({
        imageId: uploadedImageId,
        model: selectedModel,
        style: selectedStyle,
        filters,
      });
      set({ resultImageUrl: result.resultUrl, generationStatus: 'done' });
    } catch (e) {
      set({ generationStatus: 'error', generationError: e.message });
    }
  },

  reset: () => {
    const oldUrl = get().uploadedPreviewUrl;
    revokePreviewUrl(oldUrl);
    set({
      uploadedFile: null,
      uploadedImageId: null,
      uploadedPreviewUrl: null,
      uploadStatus: 'idle',
      uploadError: null,
      selectedStyle: null,
      activeFilters: {},
      generationStatus: 'idle',
      generationError: null,
      resultImageUrl: null,
    });
  },
}));

export default useAppStore;
