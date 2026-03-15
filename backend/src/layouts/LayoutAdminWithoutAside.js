import { Outlet } from "react-router-dom";

export default function LayoutAdminWithoutAside({ title, children }) {
  return (
    <>
      <Outlet />
    </>
  );
}
