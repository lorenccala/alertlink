
"use client";

import Link from 'next/link';
import { useCurrentLocale } from '@/lib/i18n/client';
import { type Locale, defaultLocale, locales } from '@/lib/i18n/settings';

export default function NotFound() {
  const localeFromHook = useCurrentLocale();
  let currentValidLocale: Locale;

  // Check if the locale from the hook is valid and supported, otherwise use default
  if (localeFromHook && locales.includes(localeFromHook as Locale)) {
    currentValidLocale = localeFromHook as Locale;
  } else {
    currentValidLocale = defaultLocale;
  }

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground">
      <div className="flex items-center space-x-4">
        <h1 className="text-5xl font-bold text-primary">404</h1>
        <div className="h-12 w-px bg-border"></div>
        <div className="flex flex-col">
          <p className="text-xl text-muted-foreground">
            This page could not be found.
          </p>
          <Link href={`/${currentValidLocale}/dashboard`} className="mt-2 text-sm text-primary hover:underline">
            Go back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
