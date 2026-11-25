'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import toast from 'react-hot-toast';
import { useAuth } from '../../context/AuthContext';
import Input from '../../components/ui/Input';
import Button from '../../components/ui/Button';
import { MapPin } from 'lucide-react';

export default function LoginPage() {
  const { login } = useAuth();
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs: Record<string, string> = {};
    if (!email) errs.email = 'Email is required';
    if (!password) errs.password = 'Password is required';
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setLoading(true);
    try {
      await login(email, password);
      toast.success('Welcome back!');
      router.push('/');
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : 'Login failed');
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
          <h1 className="text-2xl font-bold text-text-main">Welcome back</h1>
          <p className="text-muted mt-1">Sign in to your account</p>
        </div>

        <form onSubmit={handleSubmit} className="card p-8 space-y-4">
          <Input label="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)}
            error={errors.email} placeholder="you@example.com" />
          <Input label="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)}
            error={errors.password} placeholder="••••••••" />
          <Button type="submit" className="w-full" loading={loading}>Sign In</Button>

          <p className="text-center text-sm text-muted pt-2">
            Don&apos;t have an account?{' '}
            <Link href="/register" className="text-primary font-medium hover:underline">Sign up</Link>
          </p>
        </form>

        <div className="card p-4 mt-4 text-xs text-muted">
          <p className="font-medium mb-2">Demo accounts:</p>
          <p>Admin: admin@travelmate.com / admin123</p>
          <p>Agency: agency@travelmate.com / agency123</p>
          <p>Customer: customer@travelmate.com / customer123</p>
        </div>
      </div>
    </div>
  );
}
