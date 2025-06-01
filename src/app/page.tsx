"use client";

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const router = useRouter();

  useEffect(() => {
    // Basic redirect, in a real app, check auth status
    router.replace('/auth/login');
  }, [router]);

  return (
    <div className="flex h-screen items-center justify-center">
      <p>Loading AlertLink...</p>
    </div>
  );
}
