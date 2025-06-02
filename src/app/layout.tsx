
import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/components/providers';
import { I18nProviderClient } from '@/lib/i18n/client';
import { defaultLocale, locales } from '@/lib/i18n/settings';
import type { Locale } from 'next-international/middleware';

export const metadata: Metadata = {
  title: 'AlertLink',
  description: 'Secure messaging for civil emergencies',
};

export default function RootLayout({
  children,
  params,
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string }; // Expect locale as a string from Next.js router
}>) {
  // Validate the locale from params, falling back to defaultLocale if invalid or missing.
  // The middleware should ensure params.locale is a valid Locale.
  const currentLocale: Locale = locales.includes(params.locale as Locale)
    ? (params.locale as Locale)
    : defaultLocale;

  return (
    <html lang={currentLocale} className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <I18nProviderClient
          locale={currentLocale}
          // Fallback removed temporarily for debugging
        >
          <Providers>{children}</Providers>
        </I18nProviderClient>
      </body>
    </html>
  );
}
