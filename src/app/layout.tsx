import type { Metadata } from 'next';
import './globals.css';
import { Providers } from '@/components/providers';
import { getTranslations } from './i18n';

export const metadata: Metadata = {
  title: 'AlertLink',
  description: 'Secure messaging for civil emergencies',
};

const i18nNamespaces = ['common'];

export default async function RootLayout({
  children,
  params: { locale },
}: Readonly<{
  children: React.ReactNode;
  params: { locale: string };
}>) {
  const { resources } = await getTranslations(locale, i18nNamespaces);

  return (
    <html lang={locale} className="dark">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter&display=swap" rel="stylesheet" />
      </head>
      <body className="font-body antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
