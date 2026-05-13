import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonCard() {
  return (
    <div className="rounded-lg overflow-hidden bg-card border border-border shadow-card">
      <Skeleton className="w-full aspect-[3/4] bg-muted" />
      <div className="p-3 flex flex-col gap-2">
        <Skeleton className="h-4 w-3/4 bg-muted" />
        <Skeleton className="h-3 w-1/2 bg-muted" />
        <Skeleton className="h-3 w-full bg-muted" />
      </div>
    </div>
  );
}

export function SkeletonCardRow({ count = 4 }: { count?: number }) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
      {Array.from({ length: count }).map((_, i) => (
        <SkeletonCard key={`skeleton-${String(i)}`} />
      ))}
    </div>
  );
}
