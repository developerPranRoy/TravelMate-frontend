'use client';

import { useState, useEffect, useCallback } from 'react';
import { packagesApi } from '../../lib/api';
import { TourPackage } from '../../types';
import PackageCard from '../../components/packages/PackageCard';
import PackageFilters from '../../components/packages/PackageFilters';
import { PageLoader } from '../../components/ui/Loading';
import EmptyState from '../../components/ui/EmptyState';
import Pagination from '../../components/ui/Pagination';

export default function PackagesPage() {
  const [packages, setPackages] = useState<TourPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState<Record<string, unknown>>({});

  const fetchPackages = useCallback(async (f = filters, p = page) => {
    setLoading(true);
    try {
      const res = await packagesApi.list({ ...f, page: p, limit: 12 } as Parameters<typeof packagesApi.list>[0]);
      setPackages(res.data);
      setTotalPages(res.meta.totalPages);
      setTotal(res.meta.total);
    } finally {
      setLoading(false);
    }
  }, []); // eslint-disable-line

  useEffect(() => { fetchPackages(); }, []); // eslint-disable-line

  const handleFilter = (f: Record<string, unknown>) => {
    setFilters(f);
    setPage(1);
    fetchPackages(f, 1);
  };

  const handlePage = (p: number) => { setPage(p); fetchPackages(filters, p); };

  return (
    <div className="container-app py-10">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-text-main mb-1">Tour Packages</h1>
        <p className="text-muted">{total} packages available across Bangladesh</p>
      </div>

      <PackageFilters onFilter={handleFilter} />

      {loading ? <PageLoader /> : packages.length === 0 ? (
        <EmptyState title="No packages found" description="Try adjusting your filters" />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {packages.map((p) => <PackageCard key={p.id} pkg={p} />)}
          </div>
          <Pagination page={page} totalPages={totalPages} onPageChange={handlePage} />
        </>
      )}
    </div>
  );
}
