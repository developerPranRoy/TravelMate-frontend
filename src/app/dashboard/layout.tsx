'use client';

import { useAuth } from '../../context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import Link from 'next/link';
import { PageLoader } from '../../components/ui/Loading';
import { BookOpen, Package, Settings, Users, MapPin, BarChart3 } from 'lucide-react';

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!loading && !user) router.replace('/login');
  }, [user, loading, router]);

  if (loading) return <PageLoader />;
  if (!user) return null;

  const customerLinks = [
    { href: '/dashboard/bookings', icon: BookOpen, label: 'My Bookings' },
  ];
  const agencyLinks = [
    { href: '/dashboard/agency/packages', icon: Package, label: 'My Packages' },
    { href: '/dashboard/agency/bookings', icon: BookOpen, label: 'Bookings' },
  ];
  const adminLinks = [
    { href: '/dashboard/admin', icon: BarChart3, label: 'Dashboard' },
    { href: '/dashboard/admin/users', icon: Users, label: 'Users' },
    { href: '/dashboard/admin/agencies', icon: Settings, label: 'Agencies' },
    { href: '/dashboard/admin/destinations', icon: MapPin, label: 'Destinations' },
    { href: '/dashboard/admin/bookings', icon: BookOpen, label: 'Bookings' },
  ];

  const links = user.role === 'ADMIN' ? adminLinks : user.role === 'AGENCY' ? agencyLinks : customerLinks;

  return (
    <div className="container-app py-8">
      <div className="flex flex-col md:flex-row gap-8">
        {/* Sidebar */}
        <aside className="w-full md:w-56 flex-shrink-0">
          <div className="card p-4">
            <div className="flex items-center gap-3 mb-6 pb-4 border-b border-border">
              <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                <span className="text-primary font-bold">{user.name[0]}</span>
              </div>
              <div>
                <p className="font-semibold text-sm">{user.name}</p>
                <p className="text-xs text-muted capitalize">{user.role.toLowerCase()}</p>
              </div>
            </div>
            <nav className="space-y-1">
              {links.map(({ href, icon: Icon, label }) => (
                <Link key={href} href={href}
                  className="flex items-center gap-3 px-3 py-2 rounded-sm text-sm text-muted hover:bg-primary/5 hover:text-primary transition-colors">
                  <Icon className="w-4 h-4" />
                  {label}
                </Link>
              ))}
            </nav>
          </div>
        </aside>
        {/* Content */}
        <div className="flex-1 min-w-0">{children}</div>
      </div>
    </div>
  );
}
