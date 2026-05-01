import { Skeleton } from "@/components/ui/skeleton";

export function SkeletonCard() {
  return (
    <div className="flex flex-col rounded-2xl bg-card overflow-hidden border border-border/50 animate-pulse">
      {/* Cover */}
      <div className="aspect-[2/3] w-full overflow-hidden">
        <Skeleton className="w-full h-full rounded-none" />
      </div>
      {/* Info */}
      <div className="p-3 space-y-2">
        <Skeleton className="h-4 w-4/5 rounded-lg" />
        <Skeleton className="h-3 w-2/5 rounded-lg" />
        <Skeleton className="h-4 w-14 rounded-full" />
        <div className="flex justify-between items-center">
          <Skeleton className="h-3 w-8 rounded" />
          <Skeleton className="h-3 w-14 rounded" />
        </div>
      </div>
    </div>
  );
}

export function SkeletonRow() {
  return (
    <div className="flex gap-3 p-3 rounded-xl bg-card border border-border/50 animate-pulse">
      <Skeleton className="w-14 h-20 rounded-lg shrink-0" />
      <div className="flex-1 space-y-2 pt-1">
        <Skeleton className="h-4 w-4/5 rounded-lg" />
        <Skeleton className="h-3 w-2/5 rounded" />
        <div className="flex gap-2">
          <Skeleton className="h-3 w-10 rounded" />
          <Skeleton className="h-3 w-10 rounded" />
        </div>
        <Skeleton className="h-3 w-3/5 rounded" />
      </div>
    </div>
  );
}

export function SkeletonHero() {
  return (
    <div className="relative h-96 w-full animate-pulse">
      <Skeleton className="w-full h-full rounded-none" />
      <div className="absolute inset-0 flex flex-col justify-end p-8 gap-3">
        <Skeleton className="h-8 w-64 rounded-xl" />
        <Skeleton className="h-4 w-96 rounded" />
        <Skeleton className="h-4 w-72 rounded" />
        <Skeleton className="h-10 w-32 rounded-2xl mt-2" />
      </div>
    </div>
  );
}
