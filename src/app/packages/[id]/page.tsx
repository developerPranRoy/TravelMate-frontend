'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import toast from 'react-hot-toast';
import { packagesApi, bookingsApi } from '../../../lib/api';
import { TourPackage } from '../../../types';
import { useAuth } from '../../../context/AuthContext';
import { PageLoader } from '../../../components/ui/Loading';
import Badge, { statusToBadge } from '../../../components/ui/Badge';
import Button from '../../../components/ui/Button';
import { Calendar, Users, Clock, MapPin, Building2 } from 'lucide-react';

export default function PackageDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const { user } = useAuth();
  const [pkg, setPkg] = useState<TourPackage | null>(null);
  const [loading, setLoading] = useState(true);
  const [travelerCount, setTravelerCount] = useState(1);
  const [booking, setBooking] = useState(false);

  useEffect(() => {
    packagesApi.getById(id)
      .then((r) => setPkg(r.data))
      .catch(() => toast.error('Package not found'))
      .finally(() => setLoading(false));
  }, [id]);

  const handleBook = async () => {
    if (!user) { router.push('/login'); return; }
    if (user.role !== 'CUSTOMER') { toast.error('Only customers can book packages'); return; }
    setBooking(true);
    try {
      await bookingsApi.create({ packageId: id, travelerCount });
      toast.success('Booking created! Check your bookings.');
      router.push('/dashboard/bookings');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Booking failed');
    } finally {
      setBooking(false);
    }
  };

  if (loading) return <PageLoader />;
  if (!pkg) return <div className="container-app py-16 text-center text-muted">Package not found</div>;

  const price = parseFloat(pkg.price);
  const total = price * travelerCount;
  const start = new Date(pkg.startDate).toLocaleDateString('en-BD', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });
  const end = new Date(pkg.endDate).toLocaleDateString('en-BD', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' });

  return (
    <div className="container-app py-10">
      <div className="grid lg:grid-cols-3 gap-10">
        {/* Left: Details */}
        <div className="lg:col-span-2">
          <div className="relative h-80 rounded-card overflow-hidden bg-gray-100 mb-6">
            {pkg.imageUrl ? (
              <Image src={pkg.imageUrl} alt={pkg.title} fill className="object-cover" />
            ) : (
              <div className="w-full h-full bg-primary/10 flex items-center justify-center">
                <MapPin className="w-16 h-16 text-primary/30" />
              </div>
            )}
            <div className="absolute top-4 right-4">
              <Badge variant={statusToBadge(pkg.status)}>{pkg.status}</Badge>
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm text-muted mb-2">
            <MapPin className="w-4 h-4" />
            <span>{pkg.destination.name}, {pkg.destination.country}</span>
          </div>
          <h1 className="text-3xl font-bold text-text-main mb-4">{pkg.title}</h1>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            {[
              { icon: Clock, label: 'Duration', value: `${pkg.durationDays} days` },
              { icon: Users, label: 'Available Seats', value: pkg.availableSeats },
              { icon: Calendar, label: 'Departure', value: start },
              { icon: Building2, label: 'Agency', value: pkg.agency.agencyName },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="card p-3">
                <div className="flex items-center gap-2 text-muted text-xs mb-1">
                  <Icon className="w-3 h-3" /> {label}
                </div>
                <div className="font-semibold text-sm">{value}</div>
              </div>
            ))}
          </div>

          <h2 className="text-xl font-bold mb-3">About This Package</h2>
          <p className="text-text-main leading-relaxed">{pkg.description}</p>

          <div className="mt-6 p-4 card">
            <h3 className="font-semibold mb-2">Trip Dates</h3>
            <p className="text-sm"><span className="text-muted">From:</span> {start}</p>
            <p className="text-sm"><span className="text-muted">To:</span> {end}</p>
          </div>
        </div>

        {/* Right: Booking Card */}
        <div>
          <div className="card p-6 sticky top-20">
            <div className="text-3xl font-bold text-primary mb-1">৳{price.toLocaleString('en-BD')}</div>
            <div className="text-sm text-muted mb-6">per person</div>

            {pkg.status === 'ACTIVE' && pkg.availableSeats > 0 ? (
              <>
                <div className="mb-4">
                  <label className="text-sm font-medium text-text-main block mb-1">Travelers</label>
                  <input
                    type="number" min={1} max={Math.min(pkg.availableSeats, 20)}
                    value={travelerCount}
                    onChange={(e) => setTravelerCount(Math.max(1, parseInt(e.target.value) || 1))}
                    className="border border-border rounded-sm px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-primary/30"
                  />
                </div>
                <div className="bg-background rounded-sm p-3 mb-6">
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted">৳{price.toLocaleString()} × {travelerCount}</span>
                    <span>৳{total.toLocaleString('en-BD')}</span>
                  </div>
                  <div className="flex justify-between font-bold border-t border-border pt-2 mt-2">
                    <span>Total</span>
                    <span className="text-primary">৳{total.toLocaleString('en-BD')}</span>
                  </div>
                </div>
                <Button className="w-full" onClick={handleBook} loading={booking}>
                  {user ? 'Book Now' : 'Login to Book'}
                </Button>
              </>
            ) : (
              <div className="text-center py-4 text-muted">
                <p className="font-semibold mb-1">Not Available</p>
                <p className="text-sm">{pkg.availableSeats === 0 ? 'No seats remaining' : 'Package is not active'}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
