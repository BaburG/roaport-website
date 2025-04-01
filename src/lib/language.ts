import { locales, type Locale } from '@/i18n';

export function getBrowserLanguage(): Locale {
  if (typeof window === 'undefined') return 'en';

  const browserLang = window.navigator.language.split('-')[0];
  
  // Check if the browser language is in our supported locales
  if (locales.includes(browserLang as Locale)) {
    return browserLang as Locale;
  }
  
  return 'en'; // Default to English
}

export function formatDate(date: Date | string, locale: string): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;
  
  return dateObj.toLocaleDateString(locale === 'tr' ? 'tr-TR' : 'en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
} 