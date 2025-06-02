import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/components/providers';
import { I18nProviderClient } from '@/lib/i18n/client';
import { getLocaleConfig, defaultLocale } from '@/lib/i18n/settings';
import type { Locale } from 'next-international/middleware';

export const metadata: Metadata = {
  title: 'AlertLink',
  description: 'Secure messaging for civil emergencies',
};

export default function RootLayout({
  children,
  params: { locale = defaultLocale }
}: Readonly<{
  children: React.ReactNode;
  params: { locale: Locale }
}>) {
  return (
    <html lang={locale} className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <I18nProviderClient locale={locale} fallback={<p>Loading translations...</p>} loader={getLocaleConfig()[locale]}>
          <Providers>{children}</Providers>
        </I18nProviderClient>
      </body>
    </html>
  );
}
