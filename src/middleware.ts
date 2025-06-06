import { NextRequest, NextResponse } from 'next/server';
import Negotiator from 'negotiator';
import { i18n } from '../next-i18next.config';

const { locales, defaultLocale } = i18n;

// Get the preferred locale, either from the request header or a default.
function getLocale(request: NextRequest) {
    // Always return Albanian as the default locale
    return defaultLocale;
}

export function middleware(request: NextRequest) {
    const pathname = request.nextUrl.pathname;

    // Check if the pathname already has a locale
    const pathnameHasLocale = locales.some(
        (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
    );

    // If the pathname has a locale and it's just the locale (e.g., /en), redirect to login
    if (pathnameHasLocale && locales.some(locale => pathname === `/${locale}`)) {
        const locale = pathname.split('/')[1];
        request.nextUrl.pathname = `/${locale}/auth/login`;
        return NextResponse.redirect(request.nextUrl);
    }

    // If no locale, add it and redirect
    if (!pathnameHasLocale) {
        const locale = getLocale(request);
        request.nextUrl.pathname = `/${locale}${pathname === '/' ? '/auth/login' : pathname}`;
        return NextResponse.redirect(request.nextUrl);
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        // Skip all internal paths (_next)
        // Skip api routes
        // Skip static files
        '/((?!api|_next/static|_next/image|favicon.ico).*)',
    ],
};
