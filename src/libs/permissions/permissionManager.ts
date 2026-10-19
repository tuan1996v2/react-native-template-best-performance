import { PermissionModalRef, PermissionRationaleConfig, PermissionType } from './types';

let modalRef: PermissionModalRef | null = null;

export const setPermissionModalRef = (ref: PermissionModalRef | null): void => {
  modalRef = ref;
};

export const showPermissionRationale = (
  config: PermissionRationaleConfig,
  onConfirm: () => void,
  onCancel?: () => void,
): void => {
  if (modalRef) {
    modalRef.show(config, onConfirm, onCancel);
  } else {
    onConfirm();
  }
};

export const DEFAULT_RATIONALE_CONFIGS: Record<PermissionType, PermissionRationaleConfig> = {
  camera: {
    type: 'camera',
    title: 'Cho phép truy cập Máy ảnh',
    description:
      'Ứng dụng cần quyền sử dụng máy ảnh để quét mã QR, chụp ảnh và quay video trực tiếp.',
    confirmText: 'Cho phép',
    cancelText: 'Để sau',
  },
  photo: {
    type: 'photo',
    title: 'Cho phép truy cập Thư viện ảnh',
    description: 'Ứng dụng cần quyền truy cập bộ sưu tập để bạn có thể chọn và tải ảnh/video lên.',
    confirmText: 'Cho phép',
    cancelText: 'Để sau',
  },
  notification: {
    type: 'notification',
    title: 'Bật Thông báo ứng dụng',
    description: 'Nhận ngay thông báo quan trọng về đơn hàng, tin nhắn và ưu đãi mới nhất.',
    confirmText: 'Bật thông báo',
    cancelText: 'Để sau',
  },
  location: {
    type: 'location',
    title: 'Cho phép truy cập Vị trí',
    description:
      'Ứng dụng cần định vị để gợi ý địa điểm và tối ưu hóa dịch vụ giao hàng gần bạn nhất.',
    confirmText: 'Cho phép',
    cancelText: 'Để sau',
  },
};
