import 'slick-carousel/slick/slick.css';
import 'slick-carousel/slick/slick-theme.css';
import './App.scss';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DefaultLayout } from '@/layout';
import { appRoutes, ministerRouters, nghiquyettw4Routers } from '@/routes';
import { MinisterLayout } from './layout/minister-layout/MinisterLayout';
import { NghiQuyetTW4Layout } from './layout/nghiquyettw4-layout/NghiQuyetTW4Layout';
import './i18n';

function createRoutes(routeList: typeof appRoutes) {
  return routeList[0].children?.map((route, index) => {
    if ('children' in route && route.children) {
      return (
        <Route key={index} {...route}>
          {route.children.map((childRoute, childIndex) => (
            <Route key={childIndex} {...childRoute} />
          ))}
        </Route>
      );
    }
    return <Route key={index} {...route} />;
  });
}

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<DefaultLayout />}>{createRoutes(appRoutes)}</Route>
        <Route element={<MinisterLayout />} path="/bo-truong">
          {createRoutes(ministerRouters)}
        </Route>
        <Route element={<NghiQuyetTW4Layout />} path="/nghi-quyet-tw4">
          {createRoutes(nghiquyettw4Routers)}
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
