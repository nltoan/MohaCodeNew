import { Routes, Route, Navigate } from 'react-router-dom';
import routes from './app-routes';
import LayoutAdmin from './layouts/LayoutAdmin';
import LayoutAdminWithoutAside from './layouts/LayoutAdminWithoutAside';
import DiffPage from './pages/DiffPage';
import FilePicker from './pages/FilePicker';

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
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}
