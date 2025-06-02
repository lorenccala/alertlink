
'use client';

import { createI18nClient } from 'next-international/client';
import { localeLoaderConfig } from './settings'; // Import the config object directly

export const { 
  useI18n, 
  useScopedI18n, 
  I18nProviderClient, 
  useChangeLocale,
  useCurrentLocale
} = createI18nClient(localeLoaderConfig); // Pass the object directly
