
import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/components/providers';
import { I18nProviderClient } from '@/lib/i18n/client';
import { type Locale, defaultLocale } from '@/lib/i18n/settings'; // Import defaultLocale

// generateStaticParams is removed as it's not appropriate for the root layout
// if it's not part of a [locale] dynamic segment itself.
// The middleware and actual [locale] pages/layouts handle locale-specific routing.

export const metadata: Metadata = {
  title: 'AlertLink',
  description: 'Secure messaging for civil emergencies',
};

export default function RootLayout({
  children,
  params, // Receive params, but locale might be undefined for some paths
}: Readonly<{
  children: React.ReactNode;
  params: { locale?: Locale }; // locale is now optional in params
}>) {
  // Fallback to defaultLocale if params.locale is undefined.
  // This can happen for root paths or error pages before middleware fully processes the locale segment.
  const currentLocale = params?.locale || defaultLocale;

  return (
    <html lang={currentLocale} className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <I18nProviderClient locale={currentLocale}>
          <Providers>{children}</Providers>
        </I18nProviderClient>
      </body>
    </html>
  );
}
