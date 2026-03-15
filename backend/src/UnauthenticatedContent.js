import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import ForgotPassword from './pages/ForgotPassword';

export default function UnauthenticatedContent() {
  const currentURL = window.location.pathname + window.location.search;
  return (
    <Routes>
      <Route key={"/Login"} path={"/Login"} element={<Login />}></Route>
      <Route
        key={"/ForgotPassword"}
        path={"/ForgotPassword"}
        element={<ForgotPassword />}
      ></Route>
      <Route
        path="*"
        element={
          <Navigate to={`/Login?url=${encodeURIComponent(currentURL)}`} />
        }
      />
    </Routes>
  );
}
