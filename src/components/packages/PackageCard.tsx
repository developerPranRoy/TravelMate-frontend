import Image from 'next/image';
import Link from 'next/link';
import { Calendar, Users, Clock, MapPin } from 'lucide-react';
import { TourPackage } from '../../types';

export default function PackageCard({ pkg }: { pkg: TourPackage }) {
  const price = parseFloat(pkg.price).toLocaleString('en-BD');
  const start = new Date(pkg.startDate).toLocaleDateString('en-BD', { day: 'numeric', month: 'short', year: 'numeric' });

  return (
    <Link href={`/packages/${pkg.id}`} className="card overflow-hidden hover:shadow-md transition-shadow group">
      <div className="relative h-48 bg-gray-100">
        {pkg.imageUrl ? (
          <Image src={pkg.imageUrl} alt={pkg.title} fill className="object-cover group-hover:scale-105 transition-transform duration-300" />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-primary/10">
            <MapPin className="w-12 h-12 text-primary/40" />
          </div>
        )}
        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm px-2 py-1 rounded-sm text-sm font-bold text-primary">
          ৳{price}
        </div>
      </div>
      <div className="p-4">
        <div className="flex items-start justify-between gap-2 mb-2">
          <h3 className="font-semibold text-text-main line-clamp-2">{pkg.title}</h3>
        </div>
        <p className="text-xs text-muted mb-3">{pkg.destination.name}, {pkg.destination.country}</p>
        <div className="grid grid-cols-2 gap-2 text-xs text-muted">
          <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{pkg.durationDays} days</span>
          <span className="flex items-center gap-1"><Users className="w-3 h-3" />{pkg.availableSeats} seats left</span>
          <span className="flex items-center gap-1 col-span-2"><Calendar className="w-3 h-3" />{start}</span>
        </div>
        <p className="text-xs text-muted mt-2">By {pkg.agency.agencyName}</p>
      </div>
    </Link>
  );
}
