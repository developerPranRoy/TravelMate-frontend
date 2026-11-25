'use client';

import { useState, useEffect, useCallback } from 'react';
import { adminApi } from '../../../../lib/api';
import { Booking } from '../../../../types';
import { PageLoader } from '../../../../components/ui/Loading';
import EmptyState from '../../../../components/ui/EmptyState';
import Pagination from '../../../../components/ui/Pagination';
import Badge, { statusToBadge } from '../../../../components/ui/Badge';

const STATUS_OPTIONS = ['', 'PENDING', 'CONFIRMED', 'CANCELLED', 'COMPLETED'];

export default function AdminBookingsPage() {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [status, setStatus] = useState('');

  const fetch = useCallback(async (s = status, p = page) => {
    setLoading(true);
    try {
      const res = await adminApi.getBookings({ status: s || undefined, page: p, limit: 15 });
      setBookings(res.data);
      setTotalPages(res.meta?.totalPages || 1);
    } finally {
      setLoading(false);
    }
  }, []); // eslint-disable-line

  useEffect(() => { fetch(); }, []); // eslint-disable-line

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">All Bookings</h1>
        <select className="border border-border rounded-sm px-3 py-2 text-sm focus:outline-none"
          value={status} onChange={(e) => { setStatus(e.target.value); setPage(1); fetch(e.target.value, 1); }}>
          {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s || 'All Status'}</option>)}
        </select>
      </div>

      {loading ? <PageLoader /> : bookings.length === 0 ? (
        <EmptyState title="No bookings found" />
      ) : (
        <>
          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-border">
                <tr>{['Reference', 'Package', 'Travelers', 'Total', 'Status', 'Date'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wide">{h}</th>
                ))}</tr>
              </thead>
              <tbody className="divide-y divide-border">
                {bookings.map((b) => (
                  <tr key={b.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-mono text-xs">{b.bookingReference}</td>
                    <td className="px-4 py-3 font-medium max-w-[200px] truncate">{b.tourPackage.title}</td>
                    <td className="px-4 py-3">{b.travelerCount}</td>
                    <td className="px-4 py-3 text-primary font-semibold">৳{parseFloat(b.totalPrice).toLocaleString()}</td>
                    <td className="px-4 py-3"><Badge variant={statusToBadge(b.status)}>{b.status}</Badge></td>
                    <td className="px-4 py-3 text-muted">{new Date(b.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination page={page} totalPages={totalPages} onPageChange={(p) => { setPage(p); fetch(status, p); }} />
        </>
      )}
    </div>
  );
}
