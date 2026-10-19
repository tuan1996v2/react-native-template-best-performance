import { create } from 'zustand';

import { FilterType, NetworkLog, RequestDetails, ResponseDetails } from './types';

const MAX_LOGS = 50;

interface NetworkState {
  logs: NetworkLog[];
  isEnabled: boolean;
  isPaused: boolean;
  isModalVisible: boolean;
  selectedLogId: string | null;
  filter: FilterType;
  searchQuery: string;

  // Actions
  addRequest: (
    req: Omit<RequestDetails, 'id' | 'sentTime'> & { id?: string; sentTime?: number },
  ) => string;
  updateResponse: (id: string, res: ResponseDetails) => void;
  clearLogs: () => void;
  setModalVisible: (visible: boolean) => void;
  setSelectedLogId: (id: string | null) => void;
  setFilter: (filter: FilterType) => void;
  setSearchQuery: (query: string) => void;
  setEnabled: (enabled: boolean) => void;
  togglePause: () => void;
}

export const useNetworkStore = create<NetworkState>((set, get) => ({
  logs: [],
  isEnabled: true,
  isPaused: false,
  isModalVisible: false,
  selectedLogId: null,
  filter: 'ALL',
  searchQuery: '',

  addRequest: req => {
    if (!get().isEnabled || get().isPaused) {
      return '';
    }

    const id = req.id || `req_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;
    const sentTime = req.sentTime ?? Date.now();

    const newLog: NetworkLog = {
      ...req,
      id,
      sentTime,
      status: 'pending',
    };

    set(state => {
      const updatedLogs = [newLog, ...state.logs];
      return {
        logs: updatedLogs.length > MAX_LOGS ? updatedLogs.slice(0, MAX_LOGS) : updatedLogs,
      };
    });

    return id;
  },

  updateResponse: (id, res) => {
    if (!id || !get().isEnabled) {
      return;
    }

    set(state => ({
      logs: state.logs.map(log => {
        if (log.id !== id) {
          return log;
        }

        const isError = Boolean(res.error) || res.statusCode >= 400 || res.statusCode === 0;

        return {
          ...log,
          response: res,
          status: isError ? 'error' : 'success',
        };
      }),
    }));
  },

  clearLogs: () => set({ logs: [], selectedLogId: null }),
  setModalVisible: visible => set({ isModalVisible: visible }),
  setSelectedLogId: id => set({ selectedLogId: id }),
  setFilter: filter => set({ filter }),
  setSearchQuery: query => set({ searchQuery: query }),
  setEnabled: enabled => set({ isEnabled: enabled }),
  togglePause: () => set(state => ({ isPaused: !state.isPaused })),
}));
