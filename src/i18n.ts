import {createNavigation} from 'next-intl/navigation';
import {getRequestConfig} from 'next-intl/server';

// Define the supported locales
export const locales = ['en', 'tr'] as const;
export type Locale = (typeof locales)[number];

// Helper function to determine the current locale from URL
export function getLocale(pathname: string): Locale {
  const segments = pathname.split('/');
  const localeSegment = segments[1];
  
  if (locales.includes(localeSegment as Locale)) {
    return localeSegment as Locale;
  }
  
  return 'en'; // Default to English
}

// Translations loader
export async function getTranslations(locale: Locale) {
  return (await import(`./messages/${locale}.json`)).default;
}

// Create navigation functions
export const {Link, redirect, usePathname, useRouter} = createNavigation({locales});

// This is the main export for next-intl configuration
export default getRequestConfig(async ({locale}) => ({
  locale: locale as string,
  messages: (await import(`./messages/${locale}.json`)).default
})); 