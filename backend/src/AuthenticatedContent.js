import { Routes, Route, Navigate, useSearchParams } from 'react-router-dom';
import routes from './app-routes';
import LayoutAdmin from './layouts/LayoutAdmin';
import LayoutAdminWithoutAside from './layouts/LayoutAdminWithoutAside';
import DiffPage from './pages/DiffPage';
import FilePicker from './pages/FilePicker';

// A logged-in user must never see the login form inside the admin shell: send them on
// to the page they were heading to (?url=, same-origin paths only) or the dashboard.
function LoginRedirect() {
  const [searchParams] = useSearchParams();
  const url = searchParams.get('url');
  const target =
    url && url.startsWith('/') && !url.startsWith('//') && !url.startsWith('/Login')
      ? url
      : '/';
  return <Navigate to={target} replace />;
}

export default function AuthenticatedContent() {
  return (
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
  );
}
