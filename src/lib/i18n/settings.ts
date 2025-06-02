
export const locales = ['en', 'sq'] as const;
export const defaultLocale = 'en';

// Directly define and export the loaders configuration
export const localeLoaderConfig = {
  en: () => import('@/locales/en'),
  sq: () => import('@/locales/sq'),
} as const;

// Type for the locale configuration, can be inferred
export type LocaleConfigType = typeof localeLoaderConfig;

// Kept for potential other uses, but createI18nClient will use localeLoaderConfig directly
export function getLocaleConfig(): LocaleConfigType {
  return localeLoaderConfig;
}
