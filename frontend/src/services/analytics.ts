type AnalyticsWindow = Window & {
  env?: { VITE_GA_MEASUREMENT_ID?: string };
  dataLayer?: unknown[];
  gtag?: (...args: unknown[]) => void;
};

// Production portal only. Local/staging/admin traffic must not enter this property.
export function initializeGoogleAnalytics() {
  const analyticsWindow = window as AnalyticsWindow;
  const measurementId = analyticsWindow.env?.VITE_GA_MEASUREMENT_ID?.trim();
  if (!import.meta.env.PROD || !['moha.gov.vn', 'www.moha.gov.vn'].includes(window.location.hostname)) return;
  if (!measurementId || !/^G-[A-Z0-9]+$/.test(measurementId)) return;
  if (document.getElementById('moha-google-analytics')) return;

  analyticsWindow.dataLayer = analyticsWindow.dataLayer || [];
  analyticsWindow.gtag = function () { analyticsWindow.dataLayer!.push(arguments); };
  analyticsWindow.gtag('js', new Date());
  analyticsWindow.gtag('config', measurementId);
  const script = document.createElement('script');
  script.id = 'moha-google-analytics';
  script.async = true;
  script.src = 'https://www.googletagmanager.com/gtag/js?id=' + measurementId;
  document.head.appendChild(script);
}
