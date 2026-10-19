import React from 'react';

export type PermissionType = 'camera' | 'photo' | 'notification' | 'location';

export interface PermissionRationaleConfig {
  type: PermissionType;
  title: string;
  description: string;
  confirmText?: string;
  cancelText?: string;
  icon?: React.ReactNode;
}

export interface PermissionModalRef {
  show: (config: PermissionRationaleConfig, onConfirm: () => void, onCancel?: () => void) => void;
  hide: () => void;
}
