
export const locales = ['en', 'sq'] as const;
export const defaultLocale = 'en';
export type Locale = (typeof locales)[number];
