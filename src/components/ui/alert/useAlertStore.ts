import { create } from 'zustand';
import { toastManager } from '../toast/ToastManager';

interface AlertButton {
  text: string;
  onPress: () => void;
  style?: 'default' | 'cancel';
}

interface AlertConfig {
  visible: boolean;
  title: string;
  content: string;
  buttons: AlertButton[];
  icon?: React.ReactNode;
}

interface ToastConfig {
  visible: boolean;
  message: string;
  type: 'success' | 'error' | 'warning';
  positionDown?: boolean;
}

interface AlertState {
  alert: AlertConfig;
  toast: ToastConfig;
  showAlert: (config: Omit<AlertConfig, 'visible'>) => void;
  hideAlert: () => void;
  showToast: (message: string, type: ToastConfig['type'], positionDown?: boolean) => void;
  hideToast: () => void;
}

export const useAlertStore = create<AlertState>(set => ({
  alert: { visible: false, title: '', content: '', buttons: [] },
  toast: { visible: false, message: '', type: 'success' },

  showAlert: config => set({ alert: { ...config, visible: true } }),
  hideAlert: () => set(state => ({ alert: { ...state.alert, visible: false } })),

  showToast: (message, type, positionDown) => {
    toastManager.show(message, type, positionDown);
  },
  hideToast: () => {
    toastManager.clear();
  },
}));

export const toast = {
  success: (message: string, positionDown?: boolean) => {
    useAlertStore.getState().showToast(message, 'success', positionDown);
  },
  error: (message: string, positionDown?: boolean) => {
    useAlertStore.getState().showToast(message, 'error', positionDown);
  },
  warning: (message: string, positionDown?: boolean) => {
    useAlertStore.getState().showToast(message, 'warning', positionDown);
  },
  hide: () => {
    useAlertStore.getState().hideToast();
  },
};
