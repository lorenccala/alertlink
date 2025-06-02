
'use client';

import { createI18nClient } from 'next-international/client';
// localeLoaderConfig is no longer imported from './settings'

// Define the loader configuration directly within the client module
const internalLocaleLoaderConfig = {
  en: () => import('@/locales/en'),
  sq: () => import('@/locales/sq'),
} as const;

export const { 
  useI18n, 
  useScopedI18n, 
  I18nProviderClient, 
  useChangeLocale,
  useCurrentLocale
} = createI18nClient(internalLocaleLoaderConfig); // Use the internal configuration
