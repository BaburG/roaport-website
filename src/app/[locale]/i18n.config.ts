import { getRequestConfig } from 'next-intl/server';

export const locales = ['en', 'tr'] as const;
export type Locale = (typeof locales)[number];

export async function getMessages({ locale }: { locale: string }) {
  if (!locale || !locales.includes(locale as Locale)) {
    throw new Error('Invalid locale');
  }
  
  return (await import(`@/messages/${locale}.json`)).default;
}

export default getRequestConfig(async ({ locale }) => {
  if (!locale || !locales.includes(locale as Locale)) {
    throw new Error('Invalid locale');
  }
  
  return {
    locale,
    messages: await getMessages({ locale })
  };
}); 