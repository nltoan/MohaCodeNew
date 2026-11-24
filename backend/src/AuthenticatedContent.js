import { Routes, Route, Navigate, useSearchParams } from 'react-router-dom';
import routes from './app-routes';
import LayoutAdmin from './layouts/LayoutAdmin';
import LayoutAdminWithoutAside from './layouts/LayoutAdminWithoutAside';
import DiffPage from './pages/DiffPage';
import FilePicker from './pages/FilePicker';
import SessionWatcher from './components/SessionWatcher';
import { safeReturnUrl } from './utils/token';

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
    <Routes>
      <Route element={<LayoutAdmin />}>
        {routes.map(({ path, element }) => (
          <Route key={path} path={path} element={element}></Route>
        ))}
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
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
    </>
  );
}
