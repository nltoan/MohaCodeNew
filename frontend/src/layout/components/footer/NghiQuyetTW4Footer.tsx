import { type MouseEvent } from 'react';
import './Footer.scss';

export const NghiQuyetTW4Footer = () => {
  const handleGoToTop = (e: MouseEvent) => {
    e.preventDefault();
    window.scrollTo(0, 0);
  };
  return (
      <footer className="mh-footer mh-nqtw4-footer">
        <div className="container">
          <h3 className="title-footer">
            <span>CHUYÊN TRANG THỰC HIỆN NGHỊ QUYẾT <br /> HỘI NGHỊ TRUNG ƯƠNG</span>
          </h3>
          <div className="row">
              <div className="col-md-9 col-12">
                  <div className="display-flex full-width justify-content-between">
                      <div className="footer-info">
                          <div>
                              <p>
                                  Bản quyền: Bộ Nội vụ - Số 8 Tôn Thất Thuyết - Nam Từ Liêm - Hà Nội.
                              </p>
                          </div>
                          <div>
                              <p>
                                  Đơn vị quản lý: Trung tâm Công nghệ thông tin - Bộ Nội vụ.
                              </p>
                          </div>
                      </div>
                      <div className="footer-address">
                          <div className="display-flex-center mg-b-10">
                              <i className="fa fa-phone" aria-hidden="true"></i>
                              <span>Tel (84-024)62821016</span>
                          </div>
                          <div className="display-flex-center mg-b-10">
                              <i className="fa fa-fax" aria-hidden="true"></i>
                              <span>Fax (84-024)62821020</span>
                          </div>
                          <div className="display-flex-center">
                              <i className="fa fa-envelope-open-o" aria-hidden="true"></i>
                              <span>Email: CongTTDT@moha.gov.vn</span>
                          </div>
                      </div>
                  </div>
              </div>
          </div>
          <div className="mh-socials">
              <a href="#" title="Go to top" onClick={handleGoToTop}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M18.07 9.57L12 3.5L5.92999 9.57"
                    stroke="var(--mh-primary-icon-color, #903315)"
                    strokeWidth="1.5"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M12 20.4999V3.66992"
                    stroke="var(--mh-primary-icon-color, #903315)"
                    strokeWidth="1.5"
                    strokeMiterlimit="10"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </a>
            </div>
        </div>
      </footer>
  );
};
