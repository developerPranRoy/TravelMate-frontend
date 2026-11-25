import Link from 'next/link';
import { MapPin } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-white border-t border-border mt-16">
      <div className="container-app py-8">
        <div className="flex flex-col md:flex-row items-center justify-between gap-4">
          <Link href="/" className="flex items-center gap-2 font-bold text-lg text-primary">
            <MapPin className="w-5 h-5" />
            TravelMate
          </Link>
          <div className="flex items-center gap-6 text-sm text-muted">
            <Link href="/destinations" className="hover:text-primary transition-colors">Destinations</Link>
            <Link href="/packages" className="hover:text-primary transition-colors">Packages</Link>
            <Link href="/register" className="hover:text-primary transition-colors">Sign Up</Link>
          </div>
          <p className="text-sm text-muted">
            © {new Date().getFullYear()} TravelMate. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
