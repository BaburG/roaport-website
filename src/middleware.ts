import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import jwt from "jsonwebtoken";

interface DecodedToken {
  realm_access?: {
    roles?: string[];
  };
}

const locales = ['en', 'tr'];
const defaultLocale = 'en';

function getLocale(request: NextRequest) {
  const acceptLanguage = request.headers.get('accept-language');
  if (acceptLanguage) {
    const preferredLocale = acceptLanguage
      .split(',')
      .map(lang => lang.split(';')[0].trim())
      .find(lang => locales.includes(lang));
    if (preferredLocale) return preferredLocale;
  }
  return defaultLocale;
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  if (
    pathname.startsWith('/api') ||
    pathname.startsWith('/_next') ||
    pathname.includes('.')
  ) {
    return NextResponse.next();
  }

  if (pathname.startsWith('/admin')) {
    const token = await getToken({ 
      req: request,
      secret: process.env.NEXTAUTH_SECRET
    });

    if (pathname === '/admin/login') {
      if (token) {
        return NextResponse.redirect(new URL('/admin/statistics', request.url));
      }
      return NextResponse.next();
    }

    if (!token) {
      const url = new URL('/admin/login', request.url);
      url.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(url);
    }

    const decodedToken = jwt.decode(token.accessToken as string) as DecodedToken;
    const hasAdminRole = decodedToken?.realm_access?.roles?.includes('admin');

    if (!hasAdminRole) {
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }

    return NextResponse.next();
  }

  const pathnameHasLocale = locales.some(
    locale => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) return NextResponse.next();

  const locale = getLocale(request);
  request.nextUrl.pathname = `/${locale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: [
    '/((?!api|_next|.*\\..*|favicon.ico).*)',
    '/admin/:path*',
  ],
}; 