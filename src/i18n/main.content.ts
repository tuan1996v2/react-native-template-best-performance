import { t, type Dictionary } from 'intlayer';

const mainContent = {
  key: 'main',
  content: {
    common: {
      confirm: t({
        en: 'Confirm',
        vi: 'Xác nhận',
      }),
      cancel: t({
        en: 'Cancel',
        vi: 'Hủy bỏ',
      }),
      confirm_title: t({
        en: 'Are you sure?',
        vi: 'Bạn có chắc không?',
      }),
      confirm_message: t({
        en: 'This action cannot be undone.',
        vi: 'Hành động này không thể hoàn tác.',
      }),
      close: t({
        en: 'Close',
        vi: 'Đóng',
      }),
      see_all: t({
        en: 'See all',
        vi: 'Xem tất cả',
      }),
      success: t({
        en: 'Success',
        vi: 'Thành công',
      }),
      version: t({
        en: (version: string) => `Version ${version} • Developed with Tuan Os`,
        vi: (version: string) => `Phiên bản ${version} • Phát triển bởi Tuấn Os`,
      }),
      screen: t({
        en: 'Screen',
        vi: 'Màn hình',
      }),
      speed_switching: t({
        en: (time: string) => `Switching speed: ${time} ms`,
        vi: (time: string) => `Chuyển màn hình: ${time} ms`,
      }),
    },
    home: {
      welcome: t({
        en: (name: string) => `Welcome, ${name}!`,
        vi: (name: string) => `Chào mừng, ${name}!`,
      }),
      greeting: t({
        en: 'Hello, Tuan! ',
        vi: 'Xin chào, Tuan!',
      }),
      explore_today: t({
        en: "Let's explore today",
        vi: 'Khám phá hôm nay thôi nào',
      }),
      search_placeholder: t({
        en: 'What are you looking for...',
        vi: 'Bạn đang tìm gì...',
      }),
      featured_features: t({
        en: 'Featured Features',
        vi: 'Tính năng nổi bật',
      }),
      system_utilities: t({
        en: 'System Utilities',
        vi: 'Tiện ích hệ thống',
      }),
      banners: {
        explore_world: t({
          en: 'Explore the world',
          vi: 'Khám phá thế giới',
        }),
        explore_world_sub: t({
          en: 'Amazing destinations are waiting for you',
          vi: 'Những điểm đến tuyệt vời đang chờ bạn',
        }),
        hot_deal: t({
          en: 'Hot deals of the week',
          vi: 'Ưu đãi hot nhất tuần',
        }),
        hot_deal_sub: t({
          en: 'Up to 50% off for new members',
          vi: 'Giảm đến 50% cho thành viên mới',
        }),
        new_feature: t({
          en: 'New features',
          vi: 'Tính năng mới',
        }),
        new_feature_sub: t({
          en: 'Experience Social Feed today',
          vi: 'Trải nghiệm Social Feed ngay hôm nay',
        }),
        nature_scenery: t({
          en: 'Nature scenery',
          vi: 'Phong cảnh thiên nhiên',
        }),
        nature_scenery_sub: t({
          en: 'The best photo spots in 2025',
          vi: 'Những góc ảnh đẹp nhất 2025',
        }),
      },
      features: {
        social_media_feed: t({
          en: 'Social Media Feed',
          vi: 'Social Media Feed',
        }),
        experience_modern: t({
          en: 'Experience modern vertical scrolling',
          vi: 'Trải nghiệm cuộn dọc hiện đại',
        }),
        performance_list: t({
          en: 'Performance List',
          vi: 'Danh sách hiệu năng cao',
        }),
        using_flashlist: t({
          en: 'Using FlashList for high efficiency',
          vi: 'Sử dụng FlashList cho hiệu quả cao nhất',
        }),
        try_now: t({
          en: 'Try now',
          vi: 'Thử ngay',
        }),
        discover: t({
          en: 'Discover',
          vi: 'Khám phá',
        }),
        social_feed: {
          title: t({
            en: 'Social Feed',
            vi: 'Social Feed',
          }),
          subtitle: t({
            en: 'Social network demo',
            vi: 'Demo mạng xã hội',
          }),
        },
        modal: {
          title: t({
            en: 'Modal',
            vi: 'Modal',
          }),
          subtitle: t({
            en: 'Floating screen',
            vi: 'Màn hình nổi',
          }),
        },
        language: {
          title: t({
            en: 'Language',
            vi: 'Ngôn ngữ',
          }),
        },
        loading: {
          title: t({
            en: 'Loading',
            vi: 'Loading',
          }),
          subtitle: t({
            en: 'Test loading store',
            vi: 'Kiểm tra loading store',
          }),
        },
        camera: {
          title: t({
            en: 'Camera',
            vi: 'Camera',
          }),
          subtitle: t({
            en: 'Test camera',
            vi: 'Kiểm tra camera',
          }),
        },
        photo: {
          title: t({
            en: 'Photo',
            vi: 'Photo',
          }),
          subtitle: t({
            en: 'Test photo',
            vi: 'Kiểm tra photo',
          }),
        },
        video: {
          title: t({
            en: 'Video',
            vi: 'Video',
          }),
          subtitle: t({
            en: 'Test video',
            vi: 'Kiểm tra video',
          }),
        },
        alert: {
          title: t({
            en: 'Alert',
            vi: 'Alert',
          }),
          subtitle: t({
            en: 'Confirmation dialog',
            vi: 'Hộp thoại xác nhận',
          }),
        },
        notification: {
          title: t({
            en: 'Notification',
            vi: 'Thông báo',
          }),
          subtitle: t({
            en: 'Test toast/notif',
            vi: 'Kiểm tra toast/notif',
          }),
        },
        register: {
          title: t({
            en: 'Register',
            vi: 'Đăng ký',
          }),
          subtitle: t({
            en: 'Registration screen',
            vi: 'Màn hình đăng ký',
          }),
        },
        swipe: {
          title: t({
            en: 'Swipeable',
            vi: 'Swipeable',
          }),
          subtitle: t({
            en: 'Swipe to delete (Native)',
            vi: 'Vuốt để xoá (Native)',
          }),
        },
      },
      actions: {
        saving_data: t({
          en: 'Saving data...',
          vi: 'Đang lưu dữ liệu...',
        }),
        delete_chat_title: t({
          en: 'Delete conversation',
          vi: 'Xóa hội thoại',
        }),
        delete_chat_confirm: t({
          en: 'Are you sure you want to delete all messages?',
          vi: 'Bạn có chắc chắn muốn xóa toàn bộ tin nhắn?',
        }),
        delete_now: t({
          en: 'Delete now',
          vi: 'Xóa ngay',
        }),
        deleted_success: t({
          en: 'Deleted!',
          vi: 'Đã xóa!',
        }),
        switched_to_vi: t({
          en: 'Switched to Vietnamese',
          vi: 'Đã đổi sang Tiếng Việt',
        }),
        switched_to_en: t({
          en: 'Switched to English',
          vi: 'Đã chuyển sang Tiếng Anh',
        }),
        welcome_back: t({
          en: 'Welcome back!',
          vi: 'Chào mừng bạn quay lại!',
        }),
      },
    },
  },
} satisfies Dictionary;

export default mainContent;
