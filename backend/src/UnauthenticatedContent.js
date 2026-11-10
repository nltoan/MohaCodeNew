import { Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';

export default function UnauthenticatedContent() {
  const currentURL = window.location.pathname + window.location.search;
  return (
    <Routes>
      <Route key={"/Login"} path={"/Login"} element={<Login />}></Route>
      <Route
        path="*"
        element={
          <Navigate to={`/Login?url=${encodeURIComponent(currentURL)}`} />
        }
      />
    </Routes>
  );
}
