'use client';

import { useState, useEffect } from 'react';
import { destinationsApi } from '../../lib/api';
import { Destination } from '../../types';
import DestinationCard from '../../components/destinations/DestinationCard';
import { PageLoader } from '../../components/ui/Loading';
import EmptyState from '../../components/ui/EmptyState';
import Pagination from '../../components/ui/Pagination';
import { Search } from 'lucide-react';

export default function DestinationsPage() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetch = async (s = search, p = page) => {
    setLoading(true);
    try {
      const res = await destinationsApi.list({ search: s || undefined, page: p, limit: 12 });
      setDestinations(res.data);
      setTotalPages(res.meta.totalPages);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetch(); }, []); // eslint-disable-line

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetch(search, 1);
  };

  const handlePage = (p: number) => { setPage(p); fetch(search, p); };

  return (
    <div className="container-app py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-text-main mb-2">Destinations</h1>
        <p className="text-muted">Discover beautiful places across Bangladesh</p>
      </div>

      <form onSubmit={handleSearch} className="flex gap-3 mb-8">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input className="border border-border rounded-sm pl-9 pr-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-primary/30"
            placeholder="Search destinations..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <button type="submit" className="btn-primary text-sm">Search</button>
      </form>

      {loading ? <PageLoader /> : destinations.length === 0 ? (
        <EmptyState title="No destinations found" description="Try adjusting your search" />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {destinations.map((d) => <DestinationCard key={d.id} dest={d} />)}
          </div>
          <Pagination page={page} totalPages={totalPages} onPageChange={handlePage} />
        </>
      )}
    </div>
  );
}
