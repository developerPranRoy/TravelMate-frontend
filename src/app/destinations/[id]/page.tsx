'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Image from 'next/image';
import { destinationsApi } from '../../../lib/api';
import { Destination } from '../../../types';
import PackageCard from '../../../components/packages/PackageCard';
import { PageLoader } from '../../../components/ui/Loading';
import EmptyState from '../../../components/ui/EmptyState';
import { MapPin } from 'lucide-react';

export default function DestinationDetailPage() {
  const { id } = useParams<{ id: string }>();
  const [destination, setDestination] = useState<Destination | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    destinationsApi.getById(id)
      .then((r) => setDestination(r.data))
      .catch(() => setError('Destination not found'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <PageLoader />;
  if (error || !destination) return (
    <div className="container-app py-16 text-center">
      <p className="text-muted">{error || 'Not found'}</p>
    </div>
  );

  return (
    <div>
      <div className="relative h-72 bg-gray-200">
        {destination.imageUrl && (
          <Image src={destination.imageUrl} alt={destination.name} fill className="object-cover" />
        )}
        <div className="absolute inset-0 bg-black/40 flex items-end">
          <div className="container-app pb-8 text-white">
            <div className="flex items-center gap-2 text-sm mb-2 opacity-80">
              <MapPin className="w-4 h-4" /> {destination.country}
            </div>
            <h1 className="text-4xl font-bold">{destination.name}</h1>
          </div>
        </div>
      </div>

      <div className="container-app py-10">
        <p className="text-text-main text-lg mb-10 max-w-2xl">{destination.description}</p>

        <h2 className="text-2xl font-bold mb-6">Available Packages</h2>
        {!destination.packages || destination.packages.length === 0 ? (
          <EmptyState title="No packages available" description="Check back soon for new tours to this destination." />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {destination.packages.map((p) => <PackageCard key={p.id} pkg={p} />)}
          </div>
        )}
      </div>
    </div>
  );
}
