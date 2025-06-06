import { getTranslations } from '../i18n';

export default async function HomePage({
  params: { locale }
}: {
  params: { locale: string }
}) {
  const { t } = await getTranslations(locale, ['common']);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-24">
      <h1 className="text-4xl font-bold mb-4">{t('welcome')}</h1>
      <p className="text-xl">{t('greeting')}</p>
    </main>
  );
}
