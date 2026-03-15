import { Header, Footer } from '../components';
import Aside from '../components/Aside';
import Content from '../components/Content';
import { Outlet } from "react-router-dom";

export default function LayoutAdmin({ title, children }) {
  return (
    <>
      <Header title={title} />
      <Aside />
      <Content title={title}>
        <Outlet />
      </Content>
    </>
  );
}
