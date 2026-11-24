import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation } from "react-router-dom";
import { Popup } from "devextreme-react/popup";
import { handleUnauthorized } from "../utils/api";
import { getTokenExpiry, hasStoredToken } from "../utils/token";

// Theo doi han phien dang nhap (khong tu gia han token):
// - con <= 5 phut: hien canh bao khong chan thao tac de nguoi dung kip luu bai dang soan;
// - het han (hoac token bi xoa o tab khac): hien hop thoai giai thich thay vi am tham chuyen trang.
const WARN_BEFORE_MS = 5 * 60 * 1000;
const CHECK_EVERY_MS = 10 * 1000;

function formatTime(ms) {
  const d = new Date(ms);
  const pad = (n) => String(n).padStart(2, "0");
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
}

export default function SessionWatcher() {
  const location = useLocation();
  const [warnAt, setWarnAt] = useState(null); // han het (ms) dang canh bao
  const [ended, setEnded] = useState(false); // phien da ket thuc
  const [dialogOpen, setDialogOpen] = useState(false);
  const dismissedFor = useRef(null); // han het ma nguoi dung da bam "Đã hiểu"
  const endedRef = useRef(false);

  const lastExpiry = useRef(null); // getToken() xoa token het han, nen giu lai gio het han de hien thi
  const check = useCallback(() => {
    const expiresAt = getTokenExpiry();
    const now = Date.now();
    if (expiresAt) lastExpiry.current = expiresAt;
    if (!hasStoredToken() || (expiresAt && now >= expiresAt)) {
      setWarnAt(null);
      if (!endedRef.current) {
        endedRef.current = true;
        setEnded(true);
        setDialogOpen(true);
      }
      return;
    }
    if (endedRef.current) {
      // Da dang nhap lai o tab khac: token moi dung chung localStorage, bo thong bao het phien.
      endedRef.current = false;
      setEnded(false);
      setDialogOpen(false);
    }
    if (expiresAt && expiresAt - now <= WARN_BEFORE_MS && dismissedFor.current !== expiresAt) {
      setWarnAt(expiresAt);
    } else if (!expiresAt || expiresAt - now > WARN_BEFORE_MS) {
      // Da dang nhap lai o tab khac (token moi): bo canh bao cu.
      setWarnAt(null);
    }
  }, []);

  useEffect(() => {
    check();
    const timer = setInterval(check, CHECK_EVERY_MS);
    // Tab ngu / may tinh sleep: kiem tra ngay khi quay lai.
    const onVisible = () => {
      if (document.visibilityState === "visible") check();
    };
    const onStorage = (e) => {
      if (!e.key || e.key.startsWith("access_token")) check();
    };
    document.addEventListener("visibilitychange", onVisible);
    window.addEventListener("focus", check);
    window.addEventListener("storage", onStorage);
    return () => {
      clearInterval(timer);
      document.removeEventListener("visibilitychange", onVisible);
      window.removeEventListener("focus", check);
      window.removeEventListener("storage", onStorage);
    };
  }, [check]);

  // Ve trang dang nhap (kem ?url= trang hien tai). Neu tab khac vua dang nhap lai thi chi can tai lai trang.
  const relogin = () => {
    const exp = getTokenExpiry();
    if (hasStoredToken() && !(exp && Date.now() >= exp)) {
      window.location.reload();
      return;
    }
    handleUnauthorized();
  };

  // Cua so chon tep cua CKEditor (/FilePicker) la cua so phu: khong hien canh bao trung lap o do.
  if (/^\/filepicker/i.test(location.pathname)) return null;

  const expiredAt = lastExpiry.current && lastExpiry.current <= Date.now() ? lastExpiry.current : null;

  return (
    <>
      {warnAt && !ended && (
        <div
          className="alert alert-warning shadow session-watcher-banner mb-0"
          role="status"
          aria-live="polite"
        >
          <i className="fas fa-clock mr-2" aria-hidden="true" />
          Phiên đăng nhập sẽ hết hạn lúc {formatTime(warnAt)}. Hãy lưu bài đang soạn.
          <button
            type="button"
            className="btn btn-sm btn-outline-dark ml-3"
            onClick={() => {
              dismissedFor.current = warnAt;
              setWarnAt(null);
            }}
          >
            Đã hiểu
          </button>
        </div>
      )}
      {ended && !dialogOpen && (
        <div className="alert alert-danger shadow session-watcher-banner mb-0" role="alert">
          <i className="fas fa-exclamation-triangle mr-2" aria-hidden="true" />
          Phiên đăng nhập đã kết thúc. Nội dung chưa lưu sẽ không gửi được lên máy chủ.
          <button
            type="button"
            className="btn btn-sm btn-light ml-3"
            onClick={relogin}
          >
            Đăng nhập lại
          </button>
        </div>
      )}
      <Popup
        visible={dialogOpen}
        onHiding={() => setDialogOpen(false)}
        showTitle={true}
        title="Phiên đăng nhập đã kết thúc"
        width={480}
        maxWidth="95vw"
        height="auto"
        dragEnabled={false}
        hideOnOutsideClick={false}
        showCloseButton={true}
      >
        <div>
          <p>
            {expiredAt
              ? `Phiên đăng nhập của bạn đã hết hạn lúc ${formatTime(expiredAt)}.`
              : "Phiên đăng nhập của bạn không còn hiệu lực (đã đăng xuất hoặc hết hạn)."}{" "}
            Các thao tác lưu, gửi duyệt hoặc tải dữ liệu sẽ không thực hiện được cho đến khi đăng nhập lại.
          </p>
          <p>
            Nếu đang soạn dở, hãy chọn <b>Ở lại trang này</b> để sao chép nội dung ra nơi khác trước,
            sau đó bấm <b>Đăng nhập lại</b>. Sau khi đăng nhập, hệ thống sẽ mở lại đúng trang này.
          </p>
          <div className="d-flex justify-content-end flex-wrap" style={{ gap: 8 }}>
            <button type="button" className="btn btn-default" onClick={() => setDialogOpen(false)}>
              Ở lại trang này
            </button>
            <button type="button" className="btn btn-primary" onClick={relogin}>
              Đăng nhập lại
            </button>
          </div>
        </div>
      </Popup>
    </>
  );
}
