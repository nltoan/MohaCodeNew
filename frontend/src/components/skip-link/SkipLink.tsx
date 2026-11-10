import './SkipLink.scss';

// WCAG 2.4.1 Bypass Blocks: cho phép người dùng bàn phím/trình đọc màn hình nhảy thẳng tới nội dung chính.
export const SkipLink = () => (
  <a className="mh-skip-link" href="#main-content">
    Bỏ qua điều hướng, đến nội dung chính
  </a>
);
