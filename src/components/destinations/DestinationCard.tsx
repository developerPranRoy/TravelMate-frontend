import Image from 'next/image';
import Link from 'next/link';
import { MapPin } from 'lucide-react';
import { Destination } from '../../types';

export default function DestinationCard({ dest }: { dest: Destination }) {
  return (
    <Link href={`/destinations/${dest.id}`} className="card overflow-hidden hover:shadow-md transition-shadow group">
      <div className="relative h-48 bg-gray-100">
        {dest.imageUrl ? (
          <Image src={dest.imageUrl} alt={dest.name} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-primary/10">
            <MapPin className="w-12 h-12 text-primary/40" />
          </div>
        )}
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-lg text-text-main">{dest.name}</h3>
        <p className="text-sm text-muted mb-2">{dest.country}</p>
        <p className="text-sm text-text-main line-clamp-2">{dest.description}</p>
        {dest._count && (
          <p className="text-xs text-primary mt-2 font-medium">{dest._count.packages} active packages</p>
        )}
      </div>
    </Link>
  );
}
