import { useEffect, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useAuth } from '../contexts/auth';
import LayoutLogin from '../layouts/LayoutLogin';
import { safeReturnUrl } from '../utils/token';

export default function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [error, setError] = useState(null);
  const [busy, setBusy] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const auth = useAuth();
  const [searchParams] = useSearchParams();
  // Trang can quay lai sau khi dang nhap; chi chap nhan duong dan tuong doi cung nguon (chong open redirect).
  const url = safeReturnUrl(searchParams.get("url"));
  const expired = searchParams.get("reason") === "expired";
  const mounted = useRef(true);

  useEffect(() => {
    document.title = "Đăng nhập - Quản trị nội dung";
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  async function signInProcess(email, password, code, type) {
    if (busy) return;
    setBusy(true);
    setError(null);
    let ret;
    try {
      // signIn tu chuyen trang: /Profile neu phai doi mat khau mac dinh, nguoc lai ve ?url= (hoac trang chu).
      ret = await auth.signIn(email, password, code, type, url);
    } finally {
      if (mounted.current) setBusy(false);
    }
    if (!ret.isOk && mounted.current) {
      setError(ret.message || "Đăng nhập không thành công!");
    }
  }
  return (
    <LayoutLogin title={"Đăng nhập"}>
      <div className="login-box">
        <div className="login-logo">
          <a className="text-white" href="/">
            Hệ thống CMS
          </a>
        </div>
        <div className="card">
          <div className="card-body login-card-body">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                signInProcess(email, password, code, "password");
              }}
            >
            {expired && !error && (
              <p className="text-info" role="status">
                Phiên đăng nhập đã hết hạn hoặc không còn hiệu lực. Vui lòng đăng nhập lại để tiếp tục.
              </p>
            )}
            {error && <p className="text-danger" role="alert">{error}</p>}
            <div className="input-group mb-3">
              <input
                type="text"
                className="form-control"
                placeholder="Tên đăng nhập"
                aria-label="Tên đăng nhập"
                autoComplete="username"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <div className="input-group-append">
                <div className="input-group-text">
                  <span className="fas fa-envelope" />
                </div>
              </div>
            </div>
            <div className="input-group mb-3">
              <input
                type={showPassword ? "text" : "password"}
                className="form-control"
                placeholder="Mật khẩu"
                aria-label="Mật khẩu"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              <div className="input-group-append">
                <button
                  type="button"
                  className="input-group-text"
                  style={{ cursor: "pointer" }}
                  title={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                  aria-label={showPassword ? "Ẩn mật khẩu" : "Hiện mật khẩu"}
                  aria-pressed={showPassword}
                  onClick={() => setShowPassword((v) => !v)}
                >
                  <span className={showPassword ? "fas fa-eye-slash" : "fas fa-eye"} />
                </button>
              </div>
            </div>
            <div className="input-group mb-3">
              <input
                type="text"
                inputMode="numeric"
                autoComplete="one-time-code"
                className="form-control"
                placeholder="Mã xác thực (nếu đã bật Google Authenticator)"
                aria-label="Mã xác thực Google Authenticator"
                value={code}
                onChange={(e) => setCode(e.target.value)}
              />
              <div className="input-group-append">
                <div className="input-group-text">
                  <span className="fas fa-lock" />
                </div>
              </div>
            </div>
            <div className="row">
              <div className="col-12">
                <button
                  type="submit"
                  disabled={busy}
                  className="btn btn-primary btn-block"
                >
                  {busy ? "Đang đăng nhập..." : "Đăng nhập"}
                </button>
              </div>
            </div>
            </form>
            <p className="mb-1">
              Quên mật khẩu? Liên hệ quản trị hệ thống để được cấp lại.
            </p>
          </div>
        </div>
      </div>
    </LayoutLogin>
  );
}
