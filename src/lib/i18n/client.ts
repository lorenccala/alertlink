
"use client";

import { createI18nClient } from 'next-international/client';
import type { Locale } from './settings';

export const { 
  useI18n, 
  useScopedI18n, 
  I18nProviderClient, 
  useChangeLocale, 
  useCurrentLocale 
} = createI18nClient<Locale>({
  en: () => import('@/locales/en'),
  sq: () => import('@/locales/sq'),
});
