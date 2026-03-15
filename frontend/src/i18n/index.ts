import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';
import HttpBackend from 'i18next-http-backend';
import { initReactI18next } from 'react-i18next';

i18n
  // Load translations via HTTP (from public/locales/ folder)
  .use(HttpBackend)

  // Detect user language from browser or localStorage
  .use(LanguageDetector)

  // Bind i18n to React
  .use(initReactI18next)

  // Initialize configuration
  .init({
    // Default language if none is detected
    fallbackLng: 'vi',

    // List of supported languages (only these will be accepted)
    supportedLngs: ['vi', 'en'],

    // Don't escape values (React already handles XSS)
    interpolation: {
      escapeValue: false,
    },

    // Configure how language should be detected
    detection: {
      order: ['localStorage', 'navigator'], // Try localStorage first, then browser
      caches: ['localStorage'], // Save detected language in localStorage
    },

    // Define where to load translation files from
    backend: {
      loadPath: `${(window as any).env.VITE_API_URL.trim('/')}/lang?lang={{lng}}`, // Example: /locales/en/translation.json
    },

    // Disable Suspense fallback (prevents rendering issues in non-Suspense apps)
    react: {
      useSuspense: true,
    },

    // Enable debug mode if needed (shows missing keys and language loading info in console)
    debug: false,
  });

export default i18n;
