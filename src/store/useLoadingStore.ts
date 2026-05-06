import { create } from 'zustand';

interface LoadingStore {
  isLoading: boolean;
  message?: string;
  showLoading: (message?: string) => void;
  hideLoading: () => void;
}

export const useLoadingStore = create<LoadingStore>(set => ({
  isLoading: false,
  message: undefined,
  showLoading: message => set({ isLoading: true, message }),
  hideLoading: () => set({ isLoading: false, message: undefined }),
}));

// Helper để gọi ở bất cứ đâu (thậm chí ngoài component như trong Axios Interceptor)
export const GlobalLoading = {
  show: (msg?: string) => useLoadingStore.getState().showLoading(msg),
  hide: () => useLoadingStore.getState().hideLoading(),
};
