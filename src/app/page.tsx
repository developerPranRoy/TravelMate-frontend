import Link from 'next/link';
import { destinationsApi, packagesApi } from '../lib/api';
import DestinationCard from '../components/destinations/DestinationCard';
import PackageCard from '../components/packages/PackageCard';
import { Destination, TourPackage } from '../types';
import { MapPin, ArrowRight, Star, Shield, Clock } from 'lucide-react';

async function getData() {
  try {
    const [dests, pkgs] = await Promise.all([
      destinationsApi.list({ limit: 6 }),
      packagesApi.list({ limit: 6 }),
    ]);
    return { destinations: dests.data, packages: pkgs.data };
  } catch {
    return { destinations: [], packages: [] };
  }
}

export default async function HomePage() {
  const { destinations, packages } = await getData();

  return (
    <div>
      {/* Hero */}
      <section className="relative bg-gradient-to-br from-primary to-primary-hover text-white py-24">
        <div className="container-app text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full text-sm mb-6">
            <MapPin className="w-4 h-4" /> Discover Beautiful Bangladesh
          </div>
          <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight">
            Your Dream Trip,<br />
            <span className="text-accent">Made Easy</span>
          </h1>
          <p className="text-xl text-white/80 mb-10 max-w-2xl mx-auto">
            Explore hand-picked tour packages across Bangladesh's most stunning destinations.
            Book with trusted agencies, track your trips, all in one place.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/packages" className="btn-primary bg-accent hover:bg-accent-hover text-white px-8 py-3 text-base">
              Browse Packages
            </Link>
            <Link href="/destinations" className="btn-outline border-white text-white hover:bg-white/10 px-8 py-3 text-base">
              View Destinations
            </Link>
          </div>
        </div>
        <div className="absolute bottom-0 left-0 right-0 h-16 bg-background" style={{ clipPath: 'polygon(0 100%, 100% 100%, 100% 0)' }} />
      </section>

      {/* Stats */}
      <section className="bg-white border-b border-border py-8">
        <div className="container-app grid grid-cols-3 gap-8 text-center">
          {[
            { label: 'Destinations', value: destinations.length + '+' },
            { label: 'Tour Packages', value: packages.length + '+' },
            { label: 'Happy Travelers', value: '1000+' },
          ].map((s) => (
            <div key={s.label}>
              <div className="text-2xl font-bold text-primary">{s.value}</div>
              <div className="text-sm text-muted">{s.label}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Destinations */}
      {destinations.length > 0 && (
        <section className="py-16">
          <div className="container-app">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-text-main">Popular Destinations</h2>
                <p className="text-muted mt-1">Explore Bangladesh's most breathtaking locations</p>
              </div>
              <Link href="/destinations" className="flex items-center gap-1 text-primary font-medium hover:gap-2 transition-all">
                View all <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {destinations.map((d: Destination) => <DestinationCard key={d.id} dest={d} />)}
            </div>
          </div>
        </section>
      )}

      {/* Packages */}
      {packages.length > 0 && (
        <section className="py-16 bg-white">
          <div className="container-app">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-3xl font-bold text-text-main">Featured Packages</h2>
                <p className="text-muted mt-1">Curated tours for every type of traveler</p>
              </div>
              <Link href="/packages" className="flex items-center gap-1 text-primary font-medium hover:gap-2 transition-all">
                View all <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {packages.map((p: TourPackage) => <PackageCard key={p.id} pkg={p} />)}
            </div>
          </div>
        </section>
      )}

      {/* Why TravelMate */}
      <section className="py-16">
        <div className="container-app">
          <h2 className="text-3xl font-bold text-center text-text-main mb-12">Why Choose TravelMate?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              { icon: Shield, title: 'Trusted Agencies', desc: 'All agencies are verified and approved by our team before listing.' },
              { icon: Star, title: 'Best Packages', desc: 'Hand-picked tour packages with detailed itineraries and fair pricing.' },
              { icon: Clock, title: 'Easy Booking', desc: 'Book in minutes, track your status, and cancel easily if plans change.' },
            ].map(({ icon: Icon, title, desc }) => (
              <div key={title} className="text-center">
                <div className="w-14 h-14 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Icon className="w-7 h-7 text-primary" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{title}</h3>
                <p className="text-muted text-sm">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-primary text-white">
        <div className="container-app text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to explore Bangladesh?</h2>
          <p className="text-white/80 mb-8">Join thousands of travelers discovering amazing destinations.</p>
          <Link href="/register" className="btn-primary bg-accent hover:bg-accent-hover text-white px-8 py-3 text-base">
            Get Started Free
          </Link>
        </div>
      </section>
    </div>
  );
}
