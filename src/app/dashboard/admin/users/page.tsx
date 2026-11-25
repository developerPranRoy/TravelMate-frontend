'use client';

import { useState, useEffect, useCallback } from 'react';
import { adminApi } from '../../../../lib/api';
import { User } from '../../../../types';
import { PageLoader } from '../../../../components/ui/Loading';
import EmptyState from '../../../../components/ui/EmptyState';
import Pagination from '../../../../components/ui/Pagination';
import Badge, { statusToBadge } from '../../../../components/ui/Badge';
import { Search } from 'lucide-react';

export default function AdminUsersPage() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [role, setRole] = useState('');
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const fetch = useCallback(async (s = search, r = role, p = page) => {
    setLoading(true);
    try {
      const res = await adminApi.getUsers({ search: s || undefined, role: r || undefined, page: p, limit: 15 });
      setUsers(res.data);
      setTotalPages(res.meta?.totalPages || 1);
    } finally {
      setLoading(false);
    }
  }, []); // eslint-disable-line

  useEffect(() => { fetch(); }, []); // eslint-disable-line

  const handleSearch = (e: React.FormEvent) => { e.preventDefault(); setPage(1); fetch(search, role, 1); };

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Users</h1>
      <form onSubmit={handleSearch} className="flex gap-3 mb-6">
        <div className="relative flex-1 max-w-xs">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted" />
          <input className="border border-border rounded-sm pl-9 pr-3 py-2 text-sm w-full focus:outline-none"
            placeholder="Search users..." value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <select className="border border-border rounded-sm px-3 py-2 text-sm focus:outline-none"
          value={role} onChange={(e) => { setRole(e.target.value); setPage(1); fetch(search, e.target.value, 1); }}>
          <option value="">All Roles</option>
          <option value="CUSTOMER">Customer</option>
          <option value="AGENCY">Agency</option>
          <option value="ADMIN">Admin</option>
        </select>
        <button type="submit" className="btn-primary text-sm">Search</button>
      </form>

      {loading ? <PageLoader /> : users.length === 0 ? (
        <EmptyState title="No users found" />
      ) : (
        <>
          <div className="card overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-gray-50 border-b border-border">
                <tr>{['Name', 'Email', 'Role', 'Joined'].map((h) => (
                  <th key={h} className="text-left px-4 py-3 text-xs font-semibold text-muted uppercase tracking-wide">{h}</th>
                ))}</tr>
              </thead>
              <tbody className="divide-y divide-border">
                {users.map((u) => (
                  <tr key={u.id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 font-medium">{u.name}</td>
                    <td className="px-4 py-3 text-muted">{u.email}</td>
                    <td className="px-4 py-3"><Badge variant={statusToBadge(u.role.toLowerCase())}>{u.role}</Badge></td>
                    <td className="px-4 py-3 text-muted">{new Date(u.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <Pagination page={page} totalPages={totalPages} onPageChange={(p) => { setPage(p); fetch(search, role, p); }} />
        </>
      )}
    </div>
  );
}
