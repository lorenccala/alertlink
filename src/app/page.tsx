
"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCurrentLocale } from '@/lib/i18n/client'; 
import type { Locale } from '@/lib/i18n/settings';

export default function HomePage() {
  const router = useRouter();
  const currentLocale = useCurrentLocale() as Locale;

  useEffect(() => {
    router.replace(`/${currentLocale}/auth/login`);
  }, [router, currentLocale]); 

  return (
    <div className="flex h-screen items-center justify-center">
      <p>Loading AlertLink...</p>
    </div>
  );
}
