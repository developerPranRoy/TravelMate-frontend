'use client';

import Link from 'next/link';
import { useState } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { Menu, X, MapPin, Package, LogOut, User, ChevronDown } from 'lucide-react';

export default function Navbar() {
  const { user, logout, loading } = useAuth();
  const router = useRouter();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [dropOpen, setDropOpen] = useState(false);

  const handleLogout = async () => {
    await logout();
    toast.success('Logged out');
    router.push('/');
    setDropOpen(false);
  };

  const getDashboardLink = () => {
    if (!user) return '/login';
    if (user.role === 'ADMIN') return '/dashboard/admin';
    if (user.role === 'AGENCY') return '/dashboard/agency/packages';
    return '/dashboard/bookings';
  };

  return (
    <nav className="bg-white border-b border-border sticky top-0 z-50">
      <div className="container-app">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 font-bold text-xl text-primary">
            <MapPin className="w-5 h-5" />
            TravelMate
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6">
            <Link href="/destinations" className="text-muted hover:text-primary transition-colors font-medium">
              Destinations
            </Link>
            <Link href="/packages" className="text-muted hover:text-primary transition-colors font-medium">
              Packages
            </Link>
          </div>

          {/* Desktop auth */}
          <div className="hidden md:flex items-center gap-3">
            {loading ? (
              <div className="w-24 h-8 bg-gray-100 animate-pulse rounded-sm" />
            ) : user ? (
              <div className="relative">
                <button
                  onClick={() => setDropOpen(!dropOpen)}
                  className="flex items-center gap-2 text-sm font-medium text-text-main hover:text-primary transition-colors"
                >
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-primary" />
                  </div>
                  <span>{user.name}</span>
                  <ChevronDown className="w-4 h-4" />
                </button>
                {dropOpen && (
                  <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-border rounded-card shadow-lg py-1 z-50">
                    <Link href={getDashboardLink()} className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50"
                      onClick={() => setDropOpen(false)}>
                      <Package className="w-4 h-4" /> Dashboard
                    </Link>
                    {user.role === 'CUSTOMER' && (
                      <Link href="/dashboard/bookings" className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-gray-50"
                        onClick={() => setDropOpen(false)}>
                        My Bookings
                      </Link>
                    )}
                    <hr className="my-1 border-border" />
                    <button onClick={handleLogout} className="flex items-center gap-2 px-4 py-2 text-sm text-danger hover:bg-red-50 w-full text-left">
                      <LogOut className="w-4 h-4" /> Logout
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <>
                <Link href="/login" className="text-sm font-medium text-muted hover:text-primary transition-colors">
                  Login
                </Link>
                <Link href="/register" className="btn-primary text-sm py-2">
                  Sign Up
                </Link>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button className="md:hidden" onClick={() => setMobileOpen(!mobileOpen)}>
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-border py-4 space-y-3">
            <Link href="/destinations" className="block py-2 text-muted hover:text-primary font-medium"
              onClick={() => setMobileOpen(false)}>Destinations</Link>
            <Link href="/packages" className="block py-2 text-muted hover:text-primary font-medium"
              onClick={() => setMobileOpen(false)}>Packages</Link>
            {user ? (
              <>
                <Link href={getDashboardLink()} className="block py-2 text-muted hover:text-primary font-medium"
                  onClick={() => setMobileOpen(false)}>Dashboard</Link>
                <button onClick={handleLogout} className="block py-2 text-danger font-medium w-full text-left">
                  Logout
                </button>
              </>
            ) : (
              <div className="flex gap-3 pt-2">
                <Link href="/login" className="btn-outline text-sm flex-1 text-center"
                  onClick={() => setMobileOpen(false)}>Login</Link>
                <Link href="/register" className="btn-primary text-sm flex-1 text-center"
                  onClick={() => setMobileOpen(false)}>Sign Up</Link>
              </div>
            )}
          </div>
        )}
      </div>
    </nav>
  );
}
