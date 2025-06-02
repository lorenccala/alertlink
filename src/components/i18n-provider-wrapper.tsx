
'use client';

import type { ReactNode } from 'react';
import { I18nProviderClient as ActualI18nProviderClient } from '@/lib/i18n/client';
import type { Locale } from 'next-international/middleware';

interface I18nProviderWrapperProps {
  locale: Locale;
  children: ReactNode;
}

export function I18nProviderWrapper({ locale, children }: I18nProviderWrapperProps) {
  // If you still had a fallback, you'd pass it here, e.g.:
  // fallback={<p>Loading translations for wrapper...</p>}
  // For now, keeping it simple as per last layout.tsx state.
  return (
    <ActualI18nProviderClient locale={locale}>
      {children}
    </ActualI18nProviderClient>
  );
}
