'use client';

import { useAuth } from '../../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { PageLoader } from '../../../components/ui/Loading';

export default function DashboardPage() {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;
    if (!user) { router.replace('/login'); return; }
    if (user.role === 'ADMIN') router.replace('/dashboard/admin');
    else if (user.role === 'AGENCY') router.replace('/dashboard/agency/packages');
    else router.replace('/dashboard/bookings');
  }, [user, loading, router]);

  return <PageLoader />;
}
