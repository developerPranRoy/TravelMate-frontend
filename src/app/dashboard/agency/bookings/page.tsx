'use client';

import { useState, useEffect, useCallback } from 'react';
import { bookingsApi } from '../../../../lib/api';
import { Booking } from '../../../../types';
import { PageLoader } from '../../../../components/ui/Loading';
import EmptyState from '../../../../components/ui/EmptyState';
import Pagination from '../../../../components/ui/Pagination';
import Badge, { statusToBadge } from '../../../../components/ui/Badge';
import Button from '../../../../components/ui/Button';
import toast from 'react-hot-toast';
import { Users, Calendar, Hash } from 'lucide-react';

const STATUS_OPTIONS = ['', 'PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'];

export default function AgencyBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [status, setStatus] = useState('');
  const [updating, setUpdating] = useState<string | null>(null);

  const fetch = useCallback(async (s = status, p = page) => {
    setLoading(true);
    try {
      const res = await bookingsApi.getAgencyBookings({ status: s || undefined, page: p, limit: 10 });
      setBookings(res.data);
      setTotalPages(res.meta.totalPages);
    } finally {
      setLoading(false);
    }
  }, []); // eslint-disable-line

  useEffect(() => { fetch(); }, []); // eslint-disable-line

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    setUpdating(id);
    try {
      await bookingsApi.updateStatus(id, newStatus);
      toast.success(`Booking ${newStatus.toLowerCase()}`);
      fetch(status, page);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed');
    } finally {
      setUpdating(null);
    }
  };

  const handleStatus = (s: string) => { setStatus(s); setPage(1); fetch(s, 1); };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Customer Bookings</h1>
        <select className="border border-border rounded-sm px-3 py-2 text-sm focus:outline-none"
          value={status} onChange={(e) => handleStatus(e.target.value)}>
          {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s || 'All Status'}</option>)}
        </select>
      </div>

      {loading ? <PageLoader /> : bookings.length === 0 ? (
        <EmptyState title="No bookings yet" description="Bookings for your packages will appear here." />
      ) : (
        <>
          <div className="space-y-3">
            {bookings.map((booking) => {
              const pkg = booking.tourPackage;
              const start = new Date(pkg.startDate).toLocaleDateString();
              return (
                <div key={booking.id} className="card p-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold">{pkg.title}</h3>
                        <Badge variant={statusToBadge(booking.status)}>{booking.status}</Badge>
                      </div>
                      <div className="flex gap-4 text-xs text-muted">
                        <span className="flex items-center gap-1"><Hash className="w-3 h-3" />{booking.bookingReference}</span>
                        <span className="flex items-center gap-1"><Users className="w-3 h-3" />{booking.travelerCount} traveler(s)</span>
                        <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{start}</span>
                      </div>
                      <p className="text-sm font-bold text-primary mt-1">৳{parseFloat(booking.totalPrice).toLocaleString('en-BD')}</p>
                    </div>
                    {booking.status === 'PENDING' && (
                      <div className="flex gap-2">
                        <Button size="sm" loading={updating === booking.id}
                          onClick={() => handleUpdateStatus(booking.id, 'CONFIRMED')}>Confirm</Button>
                      </div>
                    )}
                    {booking.status === 'CONFIRMED' && (
                      <Button size="sm" variant="secondary" loading={updating === booking.id}
                        onClick={() => handleUpdateStatus(booking.id, 'COMPLETED')}>Mark Complete</Button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
          <Pagination page={page} totalPages={totalPages} onPageChange={(p) => { setPage(p); fetch(status, p); }} />
        </>
      )}
    </div>
  );
}
