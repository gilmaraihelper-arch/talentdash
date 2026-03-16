import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

// Import translations
import ptTranslation from './locales/pt.json';
import enTranslation from './locales/en.json';

// Get domain to determine default language
const domain = window.location.hostname;
const isBrazilianDomain = domain.includes('.com.br');

const resources = {
  pt: {
    translation: ptTranslation
  },
  en: {
    translation: enTranslation
  }
};

i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources,
    fallbackLng: isBrazilianDomain ? 'pt' : 'en',
    lng: isBrazilianDomain ? 'pt' : 'en', // Default based on domain
    interpolation: {
      escapeValue: false,
    },
    detection: {
      order: ['localStorage', 'navigator', 'htmlTag'],
      caches: ['localStorage'],
    },
  });

export default i18n;
