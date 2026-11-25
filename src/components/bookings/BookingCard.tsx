import Image from 'next/image';
import Badge, { statusToBadge } from '../ui/Badge';
import Button from '../ui/Button';
import { Booking } from '../../types';
import { Calendar, Users, Hash } from 'lucide-react';

interface BookingCardProps {
  booking: Booking;
  onCancel?: (id: string) => void;
  cancelling?: boolean;
}

export default function BookingCard({ booking, onCancel, cancelling }: BookingCardProps) {
  const pkg = booking.tourPackage;
  const start = new Date(pkg.startDate).toLocaleDateString('en-BD', { day: 'numeric', month: 'short', year: 'numeric' });
  const end = new Date(pkg.endDate).toLocaleDateString('en-BD', { day: 'numeric', month: 'short', year: 'numeric' });
  const total = parseFloat(booking.totalPrice).toLocaleString('en-BD');

  return (
    <div className="card p-4 flex flex-col sm:flex-row gap-4">
      <div className="relative w-full sm:w-28 h-28 bg-gray-100 rounded-sm overflow-hidden flex-shrink-0">
        {pkg.imageUrl ? (
          <Image src={pkg.imageUrl} alt={pkg.title} fill className="object-cover" />
        ) : (
          <div className="w-full h-full bg-primary/10" />
        )}
      </div>
      <div className="flex-1">
        <div className="flex items-start justify-between gap-2 mb-1">
          <h3 className="font-semibold text-text-main">{pkg.title}</h3>
          <Badge variant={statusToBadge(booking.status)}>{booking.status}</Badge>
        </div>
        <p className="text-sm text-muted mb-2">By {pkg.agency.agencyName}</p>
        <div className="grid grid-cols-2 gap-1 text-xs text-muted mb-3">
          <span className="flex items-center gap-1"><Hash className="w-3 h-3" />{booking.bookingReference}</span>
          <span className="flex items-center gap-1"><Users className="w-3 h-3" />{booking.travelerCount} traveler(s)</span>
          <span className="flex items-center gap-1 col-span-2"><Calendar className="w-3 h-3" />{start} → {end}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="font-bold text-primary">৳{total}</span>
          {booking.status === 'PENDING' && onCancel && (
            <Button variant="danger" size="sm" onClick={() => onCancel(booking.id)} loading={cancelling}>
              Cancel
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
