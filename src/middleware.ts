
import { createI18nMiddleware } from 'next-international/middleware';
import type { NextRequest } from 'next/server';
import { locales, defaultLocale } from './lib/i18n/settings';

const I18nMiddleware = createI18nMiddleware({
  locales,
  defaultLocale,
  urlMappingStrategy: 'rewriteDefault', // or 'redirect' based on preference
});

export function middleware(request: NextRequest) {
  return I18nMiddleware(request);
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|assets|favicon.ico|sw.js).*)']
};
