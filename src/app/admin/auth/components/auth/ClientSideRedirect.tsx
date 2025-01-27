'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function ClientSideRedirect() {
  const router = useRouter();

  useEffect(() => {
    router.replace('/admin/auth/sign-in');
  }, [router]);

  // Show a loading state while redirecting
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-4">Redirecting to login...</h2>
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto"></div>
      </div>
    </div>
  );
}