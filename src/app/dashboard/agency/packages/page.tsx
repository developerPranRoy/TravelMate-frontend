'use client';

import { useState, useEffect, useCallback } from 'react';
import { packagesApi } from '../../../../lib/api';
import { TourPackage } from '../../../../types';
import { PageLoader } from '../../../../components/ui/Loading';
import EmptyState from '../../../../components/ui/EmptyState';
import Pagination from '../../../../components/ui/Pagination';
import Badge, { statusToBadge } from '../../../../components/ui/Badge';
import Button from '../../../../components/ui/Button';
import toast from 'react-hot-toast';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Plus, Calendar, Users } from 'lucide-react';

export default function AgencyPackagesPage() {
  const [packages, setPackages] = useState<TourPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [deactivating, setDeactivating] = useState<string | null>(null);
  const [activating, setActivating] = useState<string | null>(null);
  const router = useRouter();

  const fetch = useCallback(async (p = page) => {
    setLoading(true);
    try {
      const res = await packagesApi.getMyPackages({ page: p, limit: 10 });
      setPackages(res.data);
      setTotalPages(res.meta.totalPages);
    } catch {
      router.push('/login');
    } finally {
      setLoading(false);
    }
  }, []); // eslint-disable-line

  useEffect(() => { fetch(); }, []); // eslint-disable-line

  const handleDeactivate = async (id: string) => {
    if (!confirm('Deactivate this package?')) return;
    setDeactivating(id);
    try {
      await packagesApi.delete(id);
      toast.success('Package deactivated');
      fetch(page);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed');
    } finally {
      setDeactivating(null);
    }
  };

  const handleActivate = async (id: string) => {
    setActivating(id);
    try {
      await packagesApi.update(id, { status: 'ACTIVE' });
      toast.success('Package activated');
      fetch(page);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed');
    } finally {
      setActivating(null);
    }
  };

  const handlePage = (p: number) => { setPage(p); fetch(p); };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-text-main">My Packages</h1>
        <Link href="/dashboard/agency/packages/new" className="btn-primary text-sm flex items-center gap-2">
          <Plus className="w-4 h-4" /> New Package
        </Link>
      </div>

      {loading ? <PageLoader /> : packages.length === 0 ? (
        <EmptyState title="No packages yet" description="Create your first tour package to get started."
          actionLabel="Create Package" onAction={() => router.push('/dashboard/agency/packages/new')} />
      ) : (
        <>
          <div className="space-y-3">
            {packages.map((pkg) => (
              <div key={pkg.id} className="card p-4 flex flex-col sm:flex-row sm:items-center gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold text-text-main">{pkg.title}</h3>
                    <Badge variant={statusToBadge(pkg.status)}>{pkg.status}</Badge>
                  </div>
                  <p className="text-sm text-muted mb-2">{pkg.destination.name}</p>
                  <div className="flex gap-4 text-xs text-muted">
                    <span className="flex items-center gap-1"><Users className="w-3 h-3" />{pkg.availableSeats} seats</span>
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(pkg.startDate).toLocaleDateString()}</span>
                    <span className="font-medium text-primary">৳{parseFloat(pkg.price).toLocaleString('en-BD')}</span>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button variant="secondary" size="sm" onClick={() => router.push(`/packages/${pkg.id}`)}>View</Button>
                  {pkg.status === 'ACTIVE' ? (
                    <Button variant="danger" size="sm" loading={deactivating === pkg.id}
                      onClick={() => handleDeactivate(pkg.id)}>Deactivate</Button>
                  ) : (
                    <Button variant="secondary" size="sm" loading={activating === pkg.id}
                      onClick={() => handleActivate(pkg.id)}>Activate</Button>
                  )}
                </div>
              </div>
            ))}
          </div>
          <Pagination page={page} totalPages={totalPages} onPageChange={handlePage} />
        </>
      )}
    </div>
  );
}
