'use client';

import { useState, useEffect, useCallback } from 'react';
import { bookingsApi } from '../../../lib/api';
import { Booking } from '../../../types';
import BookingCard from '../../../components/bookings/BookingCard';
import { PageLoader } from '../../../components/ui/Loading';
import EmptyState from '../../../components/ui/EmptyState';
import Pagination from '../../../components/ui/Pagination';
import toast from 'react-hot-toast';
import { useRouter } from 'next/navigation';

const STATUS_OPTIONS = ['', 'PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'];

export default function MyBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [cancelling, setCancelling] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [status, setStatus] = useState('');
  const router = useRouter();

  const fetch = useCallback(async (s = status, p = page) => {
    setLoading(true);
    try {
      const res = await bookingsApi.getMyBookings({ status: s || undefined, page: p, limit: 10 });
      setBookings(res.data);
      setTotalPages(res.meta.totalPages);
    } catch {
      router.push('/login');
    } finally {
      setLoading(false);
    }
  }, []); // eslint-disable-line

  useEffect(() => { fetch(); }, []); // eslint-disable-line

  const handleCancel = async (id: string) => {
    setCancelling(id);
    try {
      await bookingsApi.cancel(id);
      toast.success('Booking cancelled');
      fetch(status, page);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Cancel failed');
    } finally {
      setCancelling(null);
    }
  };

  const handleStatus = (s: string) => { setStatus(s); setPage(1); fetch(s, 1); };
  const handlePage = (p: number) => { setPage(p); fetch(status, p); };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-text-main">My Bookings</h1>
        <select className="border border-border rounded-sm px-3 py-2 text-sm focus:outline-none"
          value={status} onChange={(e) => handleStatus(e.target.value)}>
          {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s || 'All Status'}</option>)}
        </select>
      </div>

      {loading ? <PageLoader /> : bookings.length === 0 ? (
        <EmptyState title="No bookings yet" description="Browse our packages and book your next adventure!"
          actionLabel="Browse Packages" onAction={() => router.push('/packages')} />
      ) : (
        <>
          <div className="space-y-4">
            {bookings.map((b) => (
              <BookingCard key={b.id} booking={b} onCancel={handleCancel} cancelling={cancelling === b.id} />
            ))}
          </div>
          <Pagination page={page} totalPages={totalPages} onPageChange={handlePage} />
        </>
      )}
    </div>
  );
}
