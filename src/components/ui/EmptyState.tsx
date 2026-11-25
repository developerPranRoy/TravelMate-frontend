import { PackageSearch } from 'lucide-react';
import Button from './Button';

interface EmptyStateProps {
  title: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export default function EmptyState({ title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mb-4">
        <PackageSearch className="w-8 h-8 text-muted" />
      </div>
      <h3 className="text-lg font-semibold text-text-main mb-1">{title}</h3>
      {description && <p className="text-muted text-sm mb-6 max-w-xs">{description}</p>}
      {actionLabel && onAction && (
        <Button onClick={onAction}>{actionLabel}</Button>
      )}
    </div>
  );
}
