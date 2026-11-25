'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { packagesApi, destinationsApi } from '../../../../../lib/api';
import { Destination } from '../../../../../types';
import Input from '../../../../../components/ui/Input';
import Button from '../../../../../components/ui/Button';
import { ArrowLeft } from 'lucide-react';

export default function NewPackagePage() {
  const router = useRouter();
  const [destinations, setDestinations] = useState<Destination[]>([]);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    title: '', destinationId: '', description: '', price: '',
    durationDays: '', availableSeats: '',
    startDate: '', endDate: '', imageUrl: '', status: 'DRAFT',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    destinationsApi.list({ limit: 50 }).then((r) => setDestinations(r.data)).catch(() => {});
  }, []);

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!form.title) errs.title = 'Title required';
    if (!form.destinationId) errs.destinationId = 'Destination required';
    if (!form.description) errs.description = 'Description required';
    if (!form.price || parseFloat(form.price) <= 0) errs.price = 'Valid price required';
    if (!form.durationDays || parseInt(form.durationDays) <= 0) errs.durationDays = 'Duration required';
    if (!form.availableSeats || parseInt(form.availableSeats) <= 0) errs.availableSeats = 'Seats required';
    if (!form.startDate) errs.startDate = 'Start date required';
    if (!form.endDate) errs.endDate = 'End date required';
    if (form.startDate && form.endDate && new Date(form.endDate) < new Date(form.startDate))
      errs.endDate = 'End date must be after start date';
    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    try {
      await packagesApi.create({
        title: form.title, destinationId: form.destinationId, description: form.description,
        price: parseFloat(form.price), durationDays: parseInt(form.durationDays),
        availableSeats: parseInt(form.availableSeats),
        startDate: form.startDate as unknown as string,
        endDate: form.endDate as unknown as string,
        imageUrl: form.imageUrl || undefined,
        status: form.status as 'DRAFT' | 'ACTIVE',
      });
      toast.success('Package created!');
      router.push('/dashboard/agency/packages');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Failed to create');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <button onClick={() => router.back()} className="text-muted hover:text-primary">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <h1 className="text-2xl font-bold text-text-main">Create New Package</h1>
      </div>

      <form onSubmit={handleSubmit} className="card p-6 space-y-4 max-w-2xl">
        <Input label="Package Title" value={form.title} onChange={set('title')} error={errors.title} placeholder="e.g. Cox's Bazar Beach Paradise" />

        <div>
          <label className="text-sm font-medium text-text-main block mb-1">Destination</label>
          <select value={form.destinationId} onChange={set('destinationId')}
            className={`border rounded-sm px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-primary/30 ${errors.destinationId ? 'border-danger' : 'border-border'}`}>
            <option value="">Select a destination</option>
            {destinations.map((d) => <option key={d.id} value={d.id}>{d.name}, {d.country}</option>)}
          </select>
          {errors.destinationId && <p className="text-xs text-danger mt-1">{errors.destinationId}</p>}
        </div>

        <div>
          <label className="text-sm font-medium text-text-main block mb-1">Description</label>
          <textarea value={form.description} onChange={set('description')} rows={4}
            className={`border rounded-sm px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-primary/30 ${errors.description ? 'border-danger' : 'border-border'}`}
            placeholder="Describe the tour package, itinerary, included services..." />
          {errors.description && <p className="text-xs text-danger mt-1">{errors.description}</p>}
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input label="Price (BDT)" type="number" value={form.price} onChange={set('price')} error={errors.price} placeholder="8500" />
          <Input label="Duration (Days)" type="number" value={form.durationDays} onChange={set('durationDays')} error={errors.durationDays} placeholder="3" />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input label="Available Seats" type="number" value={form.availableSeats} onChange={set('availableSeats')} error={errors.availableSeats} placeholder="20" />
          <div>
            <label className="text-sm font-medium text-text-main block mb-1">Status</label>
            <select value={form.status} onChange={set('status')}
              className="border border-border rounded-sm px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-primary/30">
              <option value="DRAFT">Draft</option>
              <option value="ACTIVE">Active (visible to customers)</option>
            </select>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <Input label="Start Date" type="date" value={form.startDate} onChange={set('startDate')} error={errors.startDate} />
          <Input label="End Date" type="date" value={form.endDate} onChange={set('endDate')} error={errors.endDate} />
        </div>

        <Input label="Image URL (optional)" value={form.imageUrl} onChange={set('imageUrl')} placeholder="https://..." />

        <div className="flex gap-3 pt-2">
          <Button type="submit" loading={loading}>Create Package</Button>
          <Button type="button" variant="secondary" onClick={() => router.back()}>Cancel</Button>
        </div>
      </form>
    </div>
  );
}
