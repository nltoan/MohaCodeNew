/* eslint-disable @typescript-eslint/no-explicit-any */
import type { HeaderMenu, HeaderTopProps } from '@/layout';
import type { ImageProps } from 'react-bootstrap';
import imageBanner from '../assets/images/banner.svg';
import imageCertificate from '../assets/images/chung-nhan.png';
import imageRight from '../assets/images/huan-chuong.svg';
import imageLeft from '../assets/images/quoc-huy.svg';
import imageRightNQTW from '../assets/images/anhbac.png';
import imageLeftNQTW from '../assets/images/codang.png';

interface AppConfig {
  theme?: string;
  recaptcha: any;
  header: {
    top: HeaderTopProps;
    menus: HeaderMenu[];
    banner?: ImageProps;
  };
  footer: any;
}
export const APP_CONFIG: AppConfig = {
  // theme: "theme-blue",
  theme: '',
  recaptcha: {
    token: '6LdpuUcsAAAAAEKfya2GvQP_3JdxzMbvWw9Rnr8J',
    key: 'recaptchalocal',
  },
  header: {
    top: {
      image: { src: imageLeft, alt: 'Quốc huy Cộng hòa Xã hội chủ nghĩa Việt Nam' },
      imageRight: { src: imageRight, alt: 'Huân chương nhà nước' },
      title: '',
    },
    menus: [],
    banner: { src: imageBanner },
  },
  footer: {
    certificate: { src: imageCertificate, alt: 'Chứng nhận đạt tiêu chuẩn' },
    zalo: 'https://zalo.me/4501846619328692373',
    facebook: 'https://www.facebook.com/',
    youtube: 'https://www.youtube.com/',
  },
};

export const APP_DATA_CONFIG = {
  DOCUMENT_DEFAULT_CATEGORY: {
    CDDH: '104', // Van ban chi dao dieu hanh
    QPPL: '101', // Van ban quy pham phap luat
  },
  HEADER_BANNER: {
    VI: '3287', // Trang chủ - Header Banner Trang Chủ
    EN: '3288', // Homepage - Header Banner Homepage
  },
  HOME_BANNER: {
    VI: '3242', // Trang chủ - Banner Chuyên Mục
    EN: '3276', // Homepage - Category Banner
  },
  BOX_8NEWS: {
    VI: '3241', // Trang chủ - Box 8 News
    EN: '3250', // Homepage - Box 8 News
  },
  NOTI_BANNER: {
    VI: '3243',
    EN: '3277', // Home - Announcement Banner
  },
  QUICK_LINK: {
    VI: '3245', // Trang Chủ - Quick Links
    EN: '3278', // Home - Quick links
  },
  QUICK_LINK_DOWN: {
    VI: '3244', // Trang chủ - Quick Link 2
    EN: '3279', // Home - Quick Link 2
  },
  BANNER_GIOI_THIEU_BOTTOM: {
    VI: '3286', // Trang chủ - Quick Link 2
    EN: '3286', // Home - Quick Link 2
  },
  OTHER_COMPONENT: {
    VI: '3229', // Trang thành phần
    EN: '3281', // Component page
  },
  WIDGET: {
    VI: '3261', // Tiện ích
    EN: '3282', // Tiện ích
  },
  TEAM: {
    VI: '3285',
    EN: '3285',
  },
  CHART_AREA: {
    VI: '3265', // CHART_AREA
    EN: '3268', // CHART_AREA
  },
  QUICK_ACTION: {
    VI: '3283', // Phản ánh kiến nghị
    EN: '3284', // Homepage - Raise Concern
  },
  MENU_ROOT: {
    VI: '1744',
    EN: '2745',
  },
  LEFT_MENU_DETAIL: {
    VI: '2794',
    EN: '2805',
  },
  DEFAULT_NEWS_CATEGORY: {
    VI: '12',
    EN: '12',
  },
  MULTIMEDIA_MENU: {
    VI: '2789',
    EN: '2789',
  },
};

export const MINISTER_DATA_CONFIG = {
  MENU: {
    VI: '2812',
    EN: '',
  },
  HOME_TOPNEWS: {
    VI: '1',
    EN: '',
  },
  HOME_SPEECH: {
    VI: '364',
    EN: '',
  },
  HOME_ACTIVITIES: {
    VI: '362',
    EN: '',
  },
  HOME_DIRECTION: {
    VI: '363',
    EN: '',
  },
  HOME_OTHERS: {
    VI: '365',
    EN: '',
  },
  VIDEO_CATEGORY: {
    VI: '1',
    EN: '1',
  },
  PHOTO_CATEGORY: {
    VI: '1',
    EN: '1',
  },
  AUDIO_CATEGORY: {
    VI: '1',
    EN: '1',
  },
};

export const NghiQuyetTW4_DATA_CONFIG = {
  header: {
    top: {
      image: { src: imageLeftNQTW, alt: 'Quốc huy Cộng hòa Xã hội chủ nghĩa Việt Nam' },
      imageRight: { src: imageRightNQTW, alt: 'Huân chương nhà nước' },
    },
  },
  MENU: {
    VI: '2819',
    EN: '',
  },
  HOME_TOPNEWS: {
    VI: '386',
    EN: '',
  },
  HOME_REPORT: {
    VI: '392',
    EN: '',
  },
  HOME_CAPTURE: {
    VI: '394',
    EN: '',
  },
  HOME_DIRECTION: {
    VI: '390',
    EN: '',
  },
  HOME_INTRODUCTION: {
    VI: '387',
    EN: '',
  },
  HOME_NEWS: {
    VI: '388',
    EN: '',
  },
  HOME_CONTEST: {
    VI: '389',
    EN: '',
  },
  HOME_PROTECTION: {
    VI: '393',
    EN: '',
  },
  VIDEO_CATEGORY: {
    VI: '1',
    EN: '1',
  },
  PHOTO_CATEGORY: {
    VI: '1',
    EN: '1',
  },
  AUDIO_CATEGORY: {
    VI: '1',
    EN: '1',
  },
};
