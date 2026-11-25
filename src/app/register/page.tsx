'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { MapPin } from 'lucide-react';

export default function RegisterPage() {
  const { register } = useAuth();
  const router = useRouter();
  const [form, setForm] = useState({ name: '', email: '', password: '', role: 'CUSTOMER', agencyName: '' });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const set = (k: string) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) =>
    setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!form.name) errs.name = 'Name is required';
    if (!form.email) errs.email = 'Email is required';
    if (form.password.length < 6) errs.password = 'Password must be at least 6 characters';
    if (form.role === 'AGENCY' && !form.agencyName) errs.agencyName = 'Agency name is required';
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    try {
      await register({ ...form, agencyName: form.role === 'AGENCY' ? form.agencyName : undefined });
      toast.success('Account created!');
      router.push('/');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/" className="inline-flex items-center gap-2 font-bold text-2xl text-primary mb-4">
            <MapPin className="w-6 h-6" /> TravelMate
          </Link>
          <h1 className="text-2xl font-bold text-text-main">Create an account</h1>
          <p className="text-muted mt-1">Start your travel journey today</p>
        </div>

        <form onSubmit={handleSubmit} className="card p-8 space-y-4">
          <Input label="Full Name" value={form.name} onChange={set('name')} error={errors.name} placeholder="John Doe" />
          <Input label="Email" type="email" value={form.email} onChange={set('email')} error={errors.email} placeholder="you@example.com" />
          <Input label="Password" type="password" value={form.password} onChange={set('password')} error={errors.password} placeholder="Min 6 characters" />

          <div>
            <label className="text-sm font-medium text-text-main block mb-1">Account Type</label>
            <select value={form.role} onChange={set('role')}
              className="border border-border rounded-sm px-3 py-2 text-sm w-full focus:outline-none focus:ring-2 focus:ring-primary/30">
              <option value="CUSTOMER">Customer — I want to book tours</option>
              <option value="AGENCY">Agency — I want to list tours</option>
            </select>
          </div>

          {form.role === 'AGENCY' && (
            <div>
              <Input label="Agency Name" value={form.agencyName} onChange={set('agencyName')}
                error={errors.agencyName} placeholder="Your travel agency name"
                helperText="Your agency will be pending admin approval" />
            </div>
          )}

          <Button type="submit" className="w-full" loading={loading}>Create Account</Button>

          <p className="text-center text-sm text-muted pt-2">
            Already have an account?{' '}
            <Link href="/login" className="text-primary font-medium hover:underline">Sign in</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
