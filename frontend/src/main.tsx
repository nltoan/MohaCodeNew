import { StrictMode, Suspense } from 'react';
import { LoadingFallback } from './components/LoadingFallback';
import { createRoot } from 'react-dom/client';
import App from './App.tsx';
import { HelmetProvider } from 'react-helmet-async';
import { initializeGoogleAnalytics } from './services/analytics';

initializeGoogleAnalytics();

// The static tags describe the homepage before React loads. Once the SPA starts,
// Helmet owns the tags and replaces them with metadata for the current route.
document.querySelectorAll('meta[data-portal-dc]').forEach((element) => element.remove());

// The development database does not include the historic media archive. Keep
// locally uploaded files first, and fall back to the public archive for images.
if (import.meta.env.DEV) {
  document.addEventListener('error', (event) => {
    const image = event.target;
    if (!(image instanceof HTMLImageElement) || !image.src) return;
    const source = new URL(image.src, window.location.href);
    if (source.hostname !== 'localhost' || source.port !== '55104' ||
        !/^\/(?:Upload|Media_Share)\//i.test(source.pathname)) return;
    image.removeAttribute('srcset');
    image.src = new URL(source.pathname, 'https://moha.gov.vn').href;
  }, true);
}

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <HelmetProvider>
      <Suspense fallback={<LoadingFallback />}><App /></Suspense>
    </HelmetProvider>
  </StrictMode>,
);
