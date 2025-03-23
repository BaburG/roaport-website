import { NextRequest, NextResponse } from 'next/server';

const locales = ['en', 'tr'];
const defaultLocale = 'en';

function getLocale(request: NextRequest) {
  const acceptLanguage = request.headers.get('accept-language');
  if (acceptLanguage) {
    const requestedLocales = acceptLanguage.split(',');
    for (const locale of requestedLocales) {
      const [lang] = locale.split(';');
      const normalizedLang = lang.trim().split('-')[0];
      if (locales.includes(normalizedLang)) {
        return normalizedLang;
      }
    }
  }
  return defaultLocale;
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Exclude paths that shouldn't be internationalized
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/images') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }
  
  // Check if pathname already has a locale
  const pathnameHasLocale = locales.some(
    locale => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );
  
  if (pathnameHasLocale) return NextResponse.next();
  
  // Redirect to the correct locale
  const locale = getLocale(request);
  request.nextUrl.pathname = `/${locale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: [
    // Skip all internal paths (_next, api, etc)
    '/((?!api|_next|.*\\..*|favicon.ico).*)',
  ],
}; 