type BadgeVariant = 'active' | 'pending' | 'confirmed' | 'cancelled' | 'completed' |
  'draft' | 'inactive' | 'approved' | 'suspended' | 'unpaid' | 'paid' | 'default';

const styles: Record<BadgeVariant, string> = {
  active: 'bg-green-100 text-green-800',
  approved: 'bg-green-100 text-green-800',
  confirmed: 'bg-blue-100 text-blue-800',
  paid: 'bg-blue-100 text-blue-800',
  pending: 'bg-yellow-100 text-yellow-800',
  unpaid: 'bg-yellow-100 text-yellow-800',
  completed: 'bg-purple-100 text-purple-800',
  cancelled: 'bg-red-100 text-red-800',
  suspended: 'bg-red-100 text-red-800',
  draft: 'bg-gray-100 text-gray-700',
  inactive: 'bg-gray-100 text-gray-700',
  default: 'bg-gray-100 text-gray-700',
};

interface BadgeProps { variant?: BadgeVariant; children: React.ReactNode; className?: string; }

export default function Badge({ variant = 'default', children, className = '' }: BadgeProps) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${styles[variant]} ${className}`}>
      {children}
    </span>
  );
}

export function statusToBadge(status: string): BadgeVariant {
  return (status.toLowerCase() as BadgeVariant) in styles
    ? (status.toLowerCase() as BadgeVariant)
    : 'default';
}
