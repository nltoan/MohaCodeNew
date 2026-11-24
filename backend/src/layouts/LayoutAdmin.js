import { useMemo } from 'react';
import { Outlet, matchRoutes, useLocation } from "react-router-dom";
import { Header } from '../components';
import Aside from '../components/Aside';
import Content from '../components/Content';
import routes, { resolveRouteMeta } from '../app-routes';

export default function LayoutAdmin({ title, children }) {
  const location = useLocation();
  // Tieu de + nhom cua trang hien tai (khai bao trong app-routes.js).
  const meta = useMemo(() => {
    const matches = matchRoutes(routes, location);
    const match = matches && matches[matches.length - 1];
    return match ? resolveRouteMeta(match.route, match.params) : { title: "", group: "" };
  }, [location]);

  return (
    <>
      <Header />
      <Aside />
      <Content title={title || meta.title} group={meta.group}>
        <Outlet />
      </Content>
    </>
  );
}
