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

export function setToken(token, expiresInSeconds) {
  localStorage.setItem(TOKEN_KEY, token);
  if (expiresInSeconds) {
    localStorage.setItem(EXPIRY_KEY, String(Date.now() + Number(expiresInSeconds) * 1000));
  } else {
    localStorage.removeItem(EXPIRY_KEY);
  }
  removeLegacyCookie();
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(EXPIRY_KEY);
  removeLegacyCookie();
}
