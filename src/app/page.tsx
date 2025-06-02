"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
// import { useCurrentLocale } from '@/lib/i18n/client'; // No longer needed for this specific redirect logic

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Redirect to the base /auth/login path.
    // The i18n middleware will handle prefixing it with the current/default locale.
    router.replace(`/auth/login`);
  }, [router]); // useEffect dependency is just the router

  return (
    <div className="flex h-screen items-center justify-center">
      <p>Loading AlertLink...</p>
    </div>
  );
}
