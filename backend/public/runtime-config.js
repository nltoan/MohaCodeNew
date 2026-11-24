// Cau hinh runtime cua admin, tai dong bo truoc bundle (khong inline de CSP chi can script-src 'self').
// URL ben duoi la cho giu staging; scripts/Prepare-ProductionRelease.ps1 thay bang URL production
// (va kiem tra khong con ten mien staging/dev nao, ke ca trong chu thich).
window.env = {
  "REACT_APP_LANGUAGE": 'vi',

  "REACT_APP_API_URL": 'http://mohaapi.tefli.vn/api',
  "REACT_APP_API_UPLOAD_URL": 'http://mohaapi.tefli.vn',
  "REACT_APP_UPLOAD_URL": 'http://moha.tefli.vn',

  "REACT_APP_FRONTEND_URL": 'http://moha.tefli.vn',
  "REACT_APP_ENG_FRONTEND_URL": 'http://moha.tefli.vn/en',
  "REACT_APP_BACKEND_URL": 'http://mohabackend.tefli.vn',

  "REACT_APP_CHUYEN_MUC_BO_TRUONG_PHAT_BIEU_ID": 11535,
  "REACT_APP_BAI_VIET_BO_TRUONG_TIEP_CONG_DAN_ID": 236702,
  "REACT_APP_DANH_MUC_THONG_TIN": "/danhmucthongtin/1",

  "REACT_APP_BOXNDDN_BANNER_TRANG_CHU_TIENG_VIET": 3226,
  "REACT_APP_BOXVBPL_BANNER_TRANG_CHU_TIENG_VIET": 3225,
  "REACT_APP_BOXHOT_BANNER_TRANG_CHU_TIENG_VIET": 3224,
  "REACT_APP_SLIDE_BANNER_TRANG_CHU_TIENG_VIET": 1212,
  "REACT_APP_BOXLEGAL_BANNER_TRANG_CHU_TIENG_ANH": 3228,
};
// DEV-BEGIN: chi ap dung khi chay tren may dev; script phat hanh xoa doan nay.
if (location.hostname === 'localhost' || location.hostname === '127.0.0.1') {
  Object.assign(window.env, {
    REACT_APP_API_URL: 'http://localhost:55104/api',
    REACT_APP_API_UPLOAD_URL: 'http://localhost:55104',
    REACT_APP_UPLOAD_URL: 'http://localhost:55104',
    REACT_APP_FRONTEND_URL: 'http://localhost:5173',
    REACT_APP_ENG_FRONTEND_URL: 'http://localhost:5173/en',
    REACT_APP_BACKEND_URL: 'http://localhost:5174',
  });
}
// DEV-END
