
"use client"; // Required for not-found.tsx in App Router if it uses hooks or event handlers, though not strictly for this static one.

import Link from 'next/link';
import { useCurrentLocale } from '@/lib/i18n/client';
import type { Locale } from '@/lib/i18n/settings';

export default function NotFound() {
  const currentLocale = useCurrentLocale() as Locale;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground">
      <div className="flex items-center space-x-4">
        <h1 className="text-5xl font-bold text-primary">404</h1>
        <div className="h-12 w-px bg-border"></div>
        <div className="flex flex-col">
          <p className="text-xl text-muted-foreground">
            This page could not be found.
          </p>
          <Link href={`/${currentLocale}/dashboard`} className="mt-2 text-sm text-primary hover:underline">
            Go back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
