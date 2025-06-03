
import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/components/providers';
import { I18nProviderClient } from '@/lib/i18n/client';
import { locales } from '@/lib/i18n/settings'; // Import locales
import type { Locale } from '@/lib/i18n/settings'; // Import Locale type

export async function generateStaticParams() {
  return locales.map((locale) => ({ locale }));
}

export const metadata: Metadata = {
  title: 'AlertLink',
  description: 'Secure messaging for civil emergencies',
};

export default function RootLayout({
  children,
  params: { locale } // Locale is passed as a param by Next.js
}: Readonly<{
  children: React.ReactNode;
  params: { locale: Locale };
}>) {
  return (
    <html lang={locale} className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <I18nProviderClient locale={locale}>
          <Providers>{children}</Providers>
        </I18nProviderClient>
      </body>
    </html>
  );
}
