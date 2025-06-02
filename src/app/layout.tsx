
import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/components/providers';
import { I18nProviderClient } from '@/lib/i18n/client';
import { defaultLocale, localeLoaderConfig, locales } from '@/lib/i18n/settings';
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
  // Ensure locale is a valid key of localeLoaderConfig, params.locale should already be validated by middleware
  const currentLocaleKey = (locales.includes(locale as any) ? locale : defaultLocale) as keyof typeof localeLoaderConfig;

  return (
    <html lang={currentLocaleKey} className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <I18nProviderClient
          locale={currentLocaleKey}
          fallback={<p>Loading translations...</p>}
          // The loader prop is removed as I18nProviderClient can infer it
          // from the configuration passed to createI18nClient.
        >
          <Providers>{children}</Providers>
        </I18nProviderClient>
      </body>
    </html>
  );
}
