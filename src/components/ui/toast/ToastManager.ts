export type ToastType = 'success' | 'error' | 'warning';

export interface ToastItem {
  message: string;
  type: ToastType;
  duration?: number;
  positionDown?: boolean;
}

class ToastManager {
  private queue: ToastItem[] = [];
  private isShowing = false;
  private listeners: Set<(item: ToastItem & { duration: number }) => void> = new Set();

  addListener(listener: (item: ToastItem & { duration: number }) => void) {
    this.listeners.add(listener);
    // Process queue if we have pending items
    if (this.queue.length > 0 && !this.isShowing) {
      this.process();
    }
  }

  removeListener(listener: (item: ToastItem & { duration: number }) => void) {
    this.listeners.delete(listener);
  }

  show(message: string, type: ToastType = 'success', positionDown?: boolean) {
    this.queue.push({ message, type, positionDown });
    this.process();
  }

  private process() {
    if (this.isShowing || this.queue.length === 0) return;
    this.isShowing = true;

    const item = this.queue.shift();
    if (!item) {
      this.isShowing = false;
      return;
    }

    // Dynamic duration based on queue size to handle high frequency (>150 msgs/min)
    const queueLength = this.queue.length;
    let displayDuration = 2000; // Default 2 seconds

    if (queueLength > 20) {
      displayDuration = 100; // Extremely fast for high spam
    } else if (queueLength > 10) {
      displayDuration = 200;
    } else if (queueLength > 5) {
      displayDuration = 400;
    } else if (queueLength > 2) {
      displayDuration = 800;
    } else if (queueLength > 0) {
      displayDuration = 1200;
    }

    const itemWithDuration = {
      ...item,
      duration: displayDuration,
    };

    // Notify listeners
    this.listeners.forEach(listener => listener(itemWithDuration));
  }

  notifyFinished = () => {
    this.isShowing = false;
    this.process();
  };

  clear() {
    this.queue = [];
    this.isShowing = false;
  }
}

export const toastManager = new ToastManager();
