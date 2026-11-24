import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import Login from './pages/Login';
import { safeReturnUrl } from './utils/token';

// Chua dang nhap: moi duong dan deu ve trang dang nhap, kem ?url= de dang nhap xong quay lai dung trang.
function ToLogin() {
  const location = useLocation();
  const back = safeReturnUrl(location.pathname + location.search);
  const params = new URLSearchParams();
  if (back && back !== '/') params.set('url', back);
  // Con thong tin nguoi dung nhung token da het han (chua dang xuat): bao cho nguoi dung biet phien da het.
  let stale = false;
  try {
    stale = !!localStorage.getItem('user');
  } catch {
    stale = false;
  }
  if (stale) params.set('reason', 'expired');
  const qs = params.toString();
  const target = qs ? `/Login?${qs}` : '/Login';
  return <Navigate to={target} replace />;
}

export default function UnauthenticatedContent() {
  return (
    <Routes>
      <Route key={"/Login"} path={"/Login"} element={<Login />}></Route>
      <Route path="*" element={<ToLogin />} />
    </Routes>
  );
}
