'use client';

import { useState, useEffect, useCallback } from 'react';
import { adminApi } from '../../../../lib/api';
import { PageLoader } from '../../../../components/ui/Loading';
import EmptyState from '../../../../components/ui/EmptyState';
import Pagination from '../../../../components/ui/Pagination';
import Badge, { statusToBadge } from '../../../../components/ui/Badge';
import Button from '../../../../components/ui/Button';
import toast from 'react-hot-toast';

interface AgencyRow {
  id: string; agencyName: string; status: string; createdAt: string;
  user: { name: string; email: string };
}

export default function AdminAgenciesPage() {
  const [agencies, setAgencies] = useState<AgencyRow[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [updating, setUpdating] = useState<string | null>(null);

  const fetch = useCallback(async (p = page) => {
    setLoading(true);
    try {
      const res = await adminApi.getUsers({ role: 'AGENCY', page: p, limit: 15 });
      // filter from users who have agencies
      const usersWithAgency = (res.data as { agency?: AgencyRow | null; name: string; email: string }[]).filter((u) => u.agency);
      setAgencies(usersWithAgency.map((u) => ({ ...u.agency!, user: { name: u.name, email: u.email } })));
      setTotalPages(res.meta?.totalPages || 1);
    } finally {
      setLoading(false);
    }
  }, []); // eslint-disable-line

  useEffect(() => { fetch(); }, []); // eslint-disable-line

  const handleUpdate = async (id: string, status: string) => {
    setUpdating(id);
    try {
      await adminApi.updateAgencyStatus(id, status);
      toast.success(`Agency ${status.toLowerCase()}`);
      fetch(page);
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed');
    } finally {
      setUpdating(null);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Agencies</h1>
      {loading ? <PageLoader /> : agencies.length === 0 ? (
        <EmptyState title="No agencies found" />
      ) : (
        <>
          <div className="space-y-3">
            {agencies.map((agency) => (
              <div key={agency.id} className="card p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2 mb-1">
                    <h3 className="font-semibold">{agency.agencyName}</h3>
                    <Badge variant={statusToBadge(agency.status)}>{agency.status}</Badge>
                  </div>
                  <p className="text-sm text-muted">{agency.user.name} · {agency.user.email}</p>
                  <p className="text-xs text-muted">Joined {new Date(agency.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex gap-2">
                  {agency.status === 'PENDING' && (
                    <Button size="sm" loading={updating === agency.id}
                      onClick={() => handleUpdate(agency.id, 'APPROVED')}>Approve</Button>
                  )}
                  {agency.status === 'APPROVED' && (
                    <Button size="sm" variant="danger" loading={updating === agency.id}
                      onClick={() => handleUpdate(agency.id, 'SUSPENDED')}>Suspend</Button>
                  )}
                  {agency.status === 'SUSPENDED' && (
                    <Button size="sm" variant="secondary" loading={updating === agency.id}
                      onClick={() => handleUpdate(agency.id, 'APPROVED')}>Reinstate</Button>
                  )}
                </div>
              </div>
            ))}
          </div>
          <Pagination page={page} totalPages={totalPages} onPageChange={(p) => { setPage(p); fetch(p); }} />
        </>
      )}
    </div>
  );
}
