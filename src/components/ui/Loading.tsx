export function Spinner({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const sz = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' }[size];
  return (
    <div className={`${sz} border-4 border-primary/20 border-t-primary rounded-full animate-spin`} />
  );
}

export function PageLoader() {
  return (
    <div className="flex items-center justify-center min-h-[400px]">
      <Spinner size="lg" />
    </div>
  );
}

export function SkeletonCard() {
  return (
    <div className="card p-4 animate-pulse">
      <div className="bg-gray-200 rounded-sm h-48 mb-4" />
      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
      <div className="h-3 bg-gray-200 rounded w-1/2 mb-4" />
      <div className="h-3 bg-gray-200 rounded w-2/3" />
    </div>
  );
}
