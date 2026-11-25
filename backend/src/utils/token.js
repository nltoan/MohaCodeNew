import Cookies from "universal-cookie";

const TOKEN_KEY = "access_token";
const EXPIRY_KEY = "access_token_expires_at";

// Xoa cookie access_token cu (phien ban truoc tung luu token trong cookie).
function removeLegacyCookie() {
  try {
    new Cookies().remove(TOKEN_KEY, { path: "/" });
  } catch {
    /* ignore */
  }
}

// Tra ve token neu con han, nguoc lai null (va don dep).
export function getToken() {
  try {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return null;
    const expiresAt = Number(localStorage.getItem(EXPIRY_KEY));
    if (expiresAt && Date.now() >= expiresAt) {
      localStorage.removeItem(TOKEN_KEY);
      localStorage.removeItem(EXPIRY_KEY);
      return null;
    }
    return token;
  } catch {
    return null;
  }
}

// Thoi diem het han (ms) cua token dang luu, null neu khong biet. Khong xoa token nhu getToken().
export function getTokenExpiry() {
  try {
    const expiresAt = Number(localStorage.getItem(EXPIRY_KEY));
    return expiresAt > 0 ? expiresAt : null;
  } catch {
    return null;
  }
}

// Con token trong localStorage hay khong (khong xet han).
export function hasStoredToken() {
  try {
    return !!localStorage.getItem(TOKEN_KEY);
  } catch {
    return false;
  }
}

export function setToken(token, expiresInSeconds) {
  localStorage.setItem(TOKEN_KEY, token);
  if (expiresInSeconds) {
    localStorage.setItem(EXPIRY_KEY, String(Date.now() + Number(expiresInSeconds) * 1000));
  } else {
    localStorage.removeItem(EXPIRY_KEY);
  }
  removeLegacyCookie();
}

// Duong dan quay lai sau dang nhap: chi nhan duong dan tuong doi cung nguon ("/..." nhung khong "//" hay "/\"),
// khong quay lai trang dang nhap. Tra ve null neu khong hop le.
export function safeReturnUrl(url) {
  if (typeof url !== "string" || !url.startsWith("/")) return null;
  if (url.startsWith("//") || url.startsWith("/\\")) return null;
  for (let i = 0; i < url.length; i++) {
    if (url.charCodeAt(i) < 32) return null;
  }
  if (/^\/login(?:[/?#]|$)/i.test(url)) return null;
  return url;
}

// Trang dang nhap kem duong dan hien tai de quay lai sau khi dang nhap.
export function loginUrlForCurrentPage(reason) {
  const current = window.location.pathname + window.location.search;
  const params = new URLSearchParams();
  const back = safeReturnUrl(current);
  if (back && back !== "/") params.set("url", back);
  if (reason) params.set("reason", reason);
  const qs = params.toString();
  return qs ? `/Login?${qs}` : "/Login";
}

// Tai khoan dang phai doi mat khau mac dinh / bat 2FA truoc khi dung chuc nang khac (API dat setup_required).
export function isSetupRequired() {
  try {
    return localStorage.getItem("setup_required") === "1";
  } catch {
    return false;
  }
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(EXPIRY_KEY);
  removeLegacyCookie();
}
