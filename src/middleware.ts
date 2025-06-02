import type { NextRequest } from 'next/server';
import { createI18nMiddleware } from 'next-international/middleware';
import { locales, defaultLocale } from '@/lib/i18n/settings';

const I18nMiddleware = createI18nMiddleware({
  locales,
  defaultLocale,
  // Setting the cookie to `/` will make it available for all pages
  // Otherwise, it will only be available for the current path
  urlMappingStrategy: 'rewrite',
});

export function middleware(request: NextRequest) {
  return I18nMiddleware(request);
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|images).*)'],
};
