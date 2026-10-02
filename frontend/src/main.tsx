import { StrictMode, Suspense } from 'react';
import { LoadingFallback } from './components/LoadingFallback';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { HelmetProvider } from 'react-helmet-async';
import { initializeGoogleAnalytics } from './services/analytics';

initializeGoogleAnalytics();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <Suspense fallback={<LoadingFallback />}><App /></Suspense>
    </HelmetProvider>
  </StrictMode>,
);
