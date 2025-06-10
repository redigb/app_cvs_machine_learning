'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useAuthStore } from '@/service/store/auth';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const isAuth = useAuthStore((state) => state.isAuth);
  const [hasHydrated, setHasHydrated] = useState(false);

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  useEffect(() => {
    if (hasHydrated && !isAuth) {
      router.replace('/login');
    }
  }, [isAuth, hasHydrated]);

  if (!hasHydrated || !isAuth) return null;

  return <>{children}</>;
}