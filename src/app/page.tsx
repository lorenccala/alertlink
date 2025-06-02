"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useCurrentLocale } from '@/lib/i18n/client'; // Import useCurrentLocale

export default function HomePage() {
  const router = useRouter();
  const currentLocale = useCurrentLocale(); // Get current locale

  useEffect(() => {
    // Prepend the current locale to the path
    router.replace(`/${currentLocale}/auth/login`);
  }, [router, currentLocale]); // Add currentLocale to dependencies

  return (
    <div className="flex h-screen items-center justify-center">
      <p>Loading AlertLink...</p>
    </div>
  );
}
