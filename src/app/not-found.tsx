
"use client";

import Link from 'next/link';
// We remove useCurrentLocale and locales as they are causing issues in this context.
// We will rely only on defaultLocale for a stable link.
import { defaultLocale } from '@/lib/i18n/settings';
import type { Locale } from '@/lib/i18n/settings'; // Keep Locale type if needed elsewhere, but not strictly for this link

export default function NotFound() {
  // Use defaultLocale directly to ensure the link is always valid.
  const dashboardLinkHref = `/${defaultLocale}/dashboard`;

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-background text-foreground">
      <div className="flex items-center space-x-4">
        <h1 className="text-5xl font-bold text-primary">404</h1>
        <div className="h-12 w-px bg-border"></div>
        <div className="flex flex-col">
          <p className="text-xl text-muted-foreground">
            This page could not be found.
          </p>
          <Link href={dashboardLinkHref} className="mt-2 text-sm text-primary hover:underline">
            Go back to Dashboard
          </Link>
        </div>
      </div>
    </div>
  );
}
