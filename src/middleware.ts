import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";
import jwt from "jsonwebtoken";

interface DecodedToken {
  realm_access?: {
    roles?: string[];
  };
}

// List of all supported locales
const locales = ['en', 'tr'];

// Get the preferred locale from the request
function getLocale(request: NextRequest) {
  // Check if the pathname starts with a locale
  const pathname = request.nextUrl.pathname;
  const pathnameIsMissingLocale = locales.every(
    (locale) => !pathname.startsWith(`/${locale}/`) && pathname !== `/${locale}`
  );

  // If the pathname is missing a locale, redirect to the default locale
  if (pathnameIsMissingLocale) {
    const locale = request.headers.get('accept-language')?.split(',')?.[0].split('-')[0] || 'en';
    const defaultLocale = locales.includes(locale) ? locale : 'en';

    // Don't redirect for API routes
    if (pathname.startsWith('/api/')) {
      return null;
    }

    // Don't redirect for static files
    if (pathname.match(/\.(ico|png|jpg|jpeg|svg|css|js|woff|woff2|ttf|eot)$/)) {
      return null;
    }

    return defaultLocale;
  }

  return null;
}

// Mobile API routes that should bypass all middleware
const mobileApiRoutes = [
  '/api/mobile/auth/login',
  '/api/mobile/auth/register',
  '/api/mobile/posts',
  '/api/mobile/upload',
  '/api/mobile/verify',
  '/api/mobile/delete',
  '/api/mobile/update',
  '/api/mobile/refresh-token',
  '/api/mobile/me',
  '/api/mobile/logout'
];

// Admin routes that should be protected by NextAuth
const adminRoutes = [
  '/admin',
  '/api/admin'
];

// NextAuth routes that should be allowed
const nextAuthRoutes = [
  '/api/auth/signin',
  '/api/auth/callback',
  '/api/auth/session',
  '/api/auth/csrf',
  '/api/auth/providers',
  '/api/auth/signout',
  '/api/auth/error'
];

export async function middleware(request: NextRequest) {
  const pathname = request.nextUrl.pathname;

  // Skip middleware for static files
  if (pathname.match(/\.(ico|png|jpg|jpeg|svg|css|js|woff|woff2|ttf|eot)$/)) {
    return NextResponse.next();
  }

  // Handle mobile API routes first - completely bypass all middleware
  if (mobileApiRoutes.some(route => pathname.startsWith(route))) {
    // Remove locale prefix if present
    if (pathname.startsWith('/en/') || pathname.startsWith('/tr/')) {
      const newPathname = pathname.replace(/^\/(en|tr)/, '');
      return NextResponse.redirect(new URL(newPathname, request.url));
    }
    // For mobile API routes, just pass through without any middleware
    return NextResponse.next();
  }

  // Handle NextAuth routes
  if (nextAuthRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Handle admin routes with NextAuth
  if (adminRoutes.some(route => pathname.startsWith(route))) {
    // Skip auth for login page
    if (pathname === '/admin/login') {
      return NextResponse.next();
    }

    const token = await getToken({ 
      req: request,
      secret: process.env.NEXTAUTH_SECRET
    });

    if (!token) {
      const url = new URL('/admin/login', request.url);
      url.searchParams.set('callbackUrl', pathname);
      return NextResponse.redirect(url);
    }

    try {
      const decodedToken = jwt.decode(token.accessToken as string) as DecodedToken;
      const hasAdminRole = decodedToken?.realm_access?.roles?.includes('admin');

      if (!hasAdminRole) {
        return NextResponse.redirect(new URL('/admin/login', request.url));
      }

      return NextResponse.next();
    } catch (error) {
      console.error('Token decode error:', error);
      return NextResponse.redirect(new URL('/admin/login', request.url));
    }
  }

  // Handle locale routing
  const locale = getLocale(request);
  if (locale) {
    return NextResponse.redirect(
      new URL(`/${locale}${pathname}`, request.url)
    );
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    // Match all paths except static files
    '/((?!_next/static|_next/image|favicon.ico).*)',
    // Match mobile API routes with and without locale prefix
    '/api/mobile/:path*',
    '/:locale(en|tr)/api/mobile/:path*',
    // Match admin routes
    '/admin/:path*',
    '/api/admin/:path*',
    // Match NextAuth routes
    '/api/auth/:path*'
  ],
}; 