import { Routes, Route, Navigate, useLocation, useSearchParams } from 'react-router-dom';
import routes from './app-routes';
import LayoutAdmin from './layouts/LayoutAdmin';
import LayoutAdminWithoutAside from './layouts/LayoutAdminWithoutAside';
import DiffPage from './pages/DiffPage';
import FilePicker from './pages/FilePicker';
import NotFound from './pages/NotFound';
import SessionWatcher from './components/SessionWatcher';
import { isSetupRequired, safeReturnUrl } from './utils/token';

// Tai khoan dang dung mat khau mac dinh (API tra 403 cho moi chuc nang khac): chi cho vao trang Ho so de doi mat khau.
function SetupGuard({ children }) {
  const location = useLocation();
  if (isSetupRequired() && location.pathname.toLowerCase() !== '/profile') {
    return <Navigate to="/Profile" replace />;
  }
  return children;
}

// A logged-in user must never see the login form inside the admin shell: send them on
// to the page they were heading to (?url=, same-origin paths only) or the dashboard.
function LoginRedirect() {
  const [searchParams] = useSearchParams();
  const target = safeReturnUrl(searchParams.get('url')) || '/';
  return <Navigate to={target} replace />;
}

export default function AuthenticatedContent() {
  return (
    <>
    {/* Canh bao sap het phien / bao phien da ket thuc (mount 1 lan cho moi trang da dang nhap). */}
    <SessionWatcher />
    <SetupGuard>
    <Routes>
      <Route element={<LayoutAdmin />}>
        {routes.map(({ path, element }) => (
          <Route key={path} path={path} element={element}></Route>
        ))}
      </Route>
      <Route element={<LayoutAdmin title="Không tìm thấy trang" />}>
        <Route path="*" element={<NotFound />} />
      </Route>
      <Route element={<LayoutAdminWithoutAside />}>
        <Route
          key={"/DiffPage"}
          path={"/DiffPage"}
          element={<DiffPage />}
        ></Route>
        <Route
          key={"/FilePicker"}
          path={"/FilePicker"}
          element={<FilePicker />}
        ></Route>
      </Route>
      <Route path="/Login" element={<LoginRedirect />} />
    </Routes>
    </SetupGuard>
    </>
  );
}
