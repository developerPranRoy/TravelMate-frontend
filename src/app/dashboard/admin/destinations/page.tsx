'use client';

import { useState, useEffect, useCallback } from 'react';
import { destinationsApi } from '../../../../lib/api';
import { Destination } from '../../../../types';
import { PageLoader } from '../../../../components/ui/Loading';
import EmptyState from '../../../../components/ui/EmptyState';
import Badge from '../../../../components/ui/Badge';
import Button from '../../../../components/ui/Button';
import Input from '../../../../components/ui/Input';
import toast from 'react-hot-toast';
import { Plus, X } from 'lucide-react';

export default function AdminDestinationsPage() {
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [creating, setCreating] = useState(false);
  const [form, setForm] = useState({ name: '', country: '', description: '', imageUrl: '' });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const fetch = useCallback(async () => {
    setLoading(true);
    try {
      const res = await destinationsApi.list({ limit: 50 });
      setDestinations(res.data);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetch(); }, [fetch]);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!form.name) errs.name = 'Required';
    if (!form.country) errs.country = 'Required';
    if (!form.description) errs.description = 'Required';
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setCreating(true);
    try {
      await destinationsApi.create({ ...form, isActive: true });
      toast.success('Destination created');
      setShowForm(false);
      setForm({ name: '', country: '', description: '', imageUrl: '' });
      fetch();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed');
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Remove this destination?')) return;
    setDeleting(id);
    try {
      await destinationsApi.delete(id);
      toast.success('Destination removed');
      fetch();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed');
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Destinations</h1>
        <Button onClick={() => setShowForm(!showForm)} size="sm">
          {showForm ? <><X className="w-4 h-4" /> Cancel</> : <><Plus className="w-4 h-4" /> Add</>}
        </Button>
      </div>

      {showForm && (
        <form onSubmit={handleCreate} className="card p-5 mb-6 space-y-3">
          <h2 className="font-semibold">New Destination</h2>
          <div className="grid grid-cols-2 gap-3">
            <Input label="Name" value={form.name} onChange={set('name')} error={errors.name} placeholder="Cox's Bazar" />
            <Input label="Country" value={form.country} onChange={set('country')} error={errors.country} placeholder="Bangladesh" />
          </div>
          <div>
            <label className="text-sm font-medium block mb-1">Description</label>
            <textarea value={form.description} onChange={set('description')} rows={3}
              className={`border rounded-sm px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-primary/30 ${errors.description ? 'border-danger' : 'border-border'}`} />
            {errors.description && <p className="text-xs text-danger mt-1">{errors.description}</p>}
          </div>
          <Input label="Image URL (optional)" value={form.imageUrl} onChange={set('imageUrl')} placeholder="https://..." />
          <Button type="submit" loading={creating}>Create Destination</Button>
        </form>
      )}

      {loading ? <PageLoader /> : destinations.length === 0 ? (
        <EmptyState title="No destinations" />
      ) : (
        <div className="space-y-3">
          {destinations.map((d) => (
            <div key={d.id} className="card p-4 flex items-center justify-between">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <h3 className="font-semibold">{d.name}</h3>
                  <Badge variant={d.isActive ? 'active' : 'inactive'}>{d.isActive ? 'Active' : 'Inactive'}</Badge>
                </div>
                <p className="text-sm text-muted">{d.country}</p>
              </div>
              <Button variant="danger" size="sm" loading={deleting === d.id} onClick={() => handleDelete(d.id)}>
                Remove
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
