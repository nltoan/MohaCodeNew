import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// the translations
// (tip move them in a JSON file and import them)
const resources = {
  en: {
    translation: {
      "Welcome to React": "Welcome to the CMS administration",
    },
  },
  vi: {
    translation: {
      "Welcome to React": "Chào mừng đến với hệ thống quản trị",
    },
  },
};

i18n.use(initReactI18next).init({
  resources: resources,
  lng: "vi",
  fallbackLng: "vi",
  interpolation: {
    escapeValue: false,
  },
});
export default i18n;
