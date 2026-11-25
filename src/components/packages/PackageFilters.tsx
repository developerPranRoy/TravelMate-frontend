'use client';

import { useState, useEffect } from 'react';
import { destinationsApi } from '../../lib/api';
import { Destination } from '../../types';
import { Search } from 'lucide-react';

interface FiltersProps {
  onFilter: (filters: {
    search?: string; destinationId?: string; minPrice?: number;
    maxPrice?: number; startDate?: string; sort?: string;
  }) => void;
}

export default function PackageFilters({ onFilter }: FiltersProps) {
  const [search, setSearch] = useState('');
  const [destinationId, setDestinationId] = useState('');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [startDate, setStartDate] = useState('');
  const [sort, setSort] = useState('');
  const [destinations, setDestinations] = useState<Destination[]>([]);

  useEffect(() => {
    destinationsApi.list({ limit: 50 }).then((r) => setDestinations(r.data)).catch(() => {});
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onFilter({
      search: search || undefined,
      destinationId: destinationId || undefined,
      minPrice: minPrice ? parseInt(minPrice) : undefined,
      maxPrice: maxPrice ? parseInt(maxPrice) : undefined,
      startDate: startDate || undefined,
      sort: sort || undefined,
    });
  };

  const handleReset = () => {
    setSearch(''); setDestinationId(''); setMinPrice(''); setMaxPrice(''); setStartDate(''); setSort('');
    onFilter({});
  };

  return (
    <form onSubmit={handleSubmit} className="card p-4 mb-6">
      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-3">
        <div className="lg:col-span-2 relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input className="border border-border rounded-sm pl-9 pr-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-primary/30"
            placeholder="Search packages..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select className="border border-border rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          value={destinationId} onChange={(e) => setDestinationId(e.target.value)}>
          <option value="">All Destinations</option>
          {destinations.map((d) => <option key={d.id} value={d.id}>{d.name}</option>)}
        </select>
        <input type="number" placeholder="Min Price (৳)" className="border border-border rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          value={minPrice} onChange={(e) => setMinPrice(e.target.value)} />
        <input type="number" placeholder="Max Price (৳)" className="border border-border rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} />
        <select className="border border-border rounded-sm px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
          value={sort} onChange={(e) => setSort(e.target.value)}>
          <option value="">Sort By</option>
          <option value="price_asc">Price: Low to High</option>
          <option value="price_desc">Price: High to Low</option>
          <option value="date_asc">Departure: Earliest</option>
          <option value="date_desc">Departure: Latest</option>
        </select>
      </div>
      <div className="flex gap-2 mt-3">
        <button type="submit" className="btn-primary text-sm">Search</button>
        <button type="button" onClick={handleReset} className="btn-secondary text-sm">Reset</button>
      </div>
    </form>
  );
}
