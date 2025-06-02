
export const locales = ['en', 'sq'] as const;
export const defaultLocale = 'en';

export function getLocaleConfig() {
  return {
    en: () => import('@/locales/en'),
    sq: () => import('@/locales/sq'),
  };
}
