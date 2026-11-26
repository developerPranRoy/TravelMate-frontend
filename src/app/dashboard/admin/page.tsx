'use client';

import { useState, useEffect } from 'react';
import { adminApi } from '../../../lib/api';
import { PageLoader } from '../../../components/ui/Loading';
import { Users, Building2, Package, BookOpen, Clock } from 'lucide-react';

interface DashboardStats {
  totalUsers: number;
  totalAgencies: number;
  totalPackages: number;
  totalBookings: number;
  pendingAgencies: number;
  activePackages: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    adminApi.getDashboard()
      .then((r) => setStats(r.data))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <PageLoader />;
  if (!stats) return <p className="text-muted">Failed to load</p>;

  const cards = [
    { icon: Users, label: 'Total Users', value: stats.totalUsers, color: 'text-blue-600 bg-blue-50' },
    { icon: Building2, label: 'Total Agencies', value: stats.totalAgencies, color: 'text-primary bg-primary/10' },
    { icon: Package, label: 'Active Packages', value: stats.activePackages, color: 'text-green-600 bg-green-50' },
    { icon: BookOpen, label: 'Total Bookings', value: stats.totalBookings, color: 'text-purple-600 bg-purple-50' },
    { icon: Clock, label: 'Pending Agencies', value: stats.pendingAgencies, color: 'text-yellow-600 bg-yellow-50' },
  ];

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Admin Dashboard</h1>
      <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
        {cards.map(({ icon: Icon, label, value, color }) => (
          <div key={label} className="card p-5">
            <div className={`w-10 h-10 rounded-full flex items-center justify-center mb-3 ${color}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div className="text-2xl font-bold text-text-main">{value}</div>
            <div className="text-sm text-muted mt-1">{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}
