import i18n from "i18next";
import { initReactI18next } from "react-i18next";

// the translations
// (tip move them in a JSON file and import them)
const resources = {
  en: {
    translation: {
      "Welcome to React": "Welcome to React and react-i18next",
    },
  },
  vi: {
    translation: {
      "Welcome to React": "Benvenuti su React e react-i18next",
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
