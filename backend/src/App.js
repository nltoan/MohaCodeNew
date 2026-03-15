import { BrowserRouter as Router } from 'react-router-dom';
import LoadPanel from 'devextreme-react/load-panel';
import { NavigationProvider } from './contexts/navigation';
import { AuthProvider, useAuth } from './contexts/auth';
import AuthenticatedContent from './AuthenticatedContent';
import UnauthenticatedContent from './UnauthenticatedContent';
import ScrollToTop from './components/ScrollToTop';

function App() {
  const { isLogin, loading } = useAuth();

  if (loading) {
    return <LoadPanel visible={true} />;
  }
  if (isLogin()) {
    return <AuthenticatedContent />;
  }

  return <UnauthenticatedContent />;
}

export default function Root() {
  return (
    <Router>
      <AuthProvider>
        <NavigationProvider>
          <ScrollToTop />
          <App />
        </NavigationProvider>
      </AuthProvider>
    </Router>
  );
}
