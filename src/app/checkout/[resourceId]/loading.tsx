import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return <CheckoutSkeleton />;
}

export function CheckoutSkeleton() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="mx-auto max-w-6xl space-y-12 px-4 py-20 sm:px-6 lg:px-8">
        <Skeleton className="h-4 w-32 bg-white/10" />

        <div className="space-y-5">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.25em] text-neutral-500">
            <Skeleton className="h-4 w-28 bg-white/10" />
          </div>
          <Skeleton className="h-10 w-80 bg-white/10" />
          <Skeleton className="h-4 w-96 bg-white/10" />
        </div>

        <div className="grid gap-12 lg:grid-cols-[1.4fr_1fr]">
          <div className="space-y-8 border-t border-white/10 pt-8">
            <div className="space-y-3">
              <Skeleton className="h-3 w-24 bg-white/10" />
              <Skeleton className="h-4 w-full bg-white/5" />
              <Skeleton className="h-4 w-5/6 bg-white/5" />
              <div className="flex flex-wrap gap-2 pt-2">
                <Skeleton className="h-6 w-20 bg-white/5" />
                <Skeleton className="h-6 w-16 bg-white/5" />
                <Skeleton className="h-6 w-14 bg-white/5" />
              </div>
            </div>

            <div className="space-y-4 border-t border-white/10 pt-6">
              <Skeleton className="h-4 w-32 bg-white/10" />
              <div className="grid gap-3 sm:grid-cols-2">
                <Skeleton className="h-4 w-full bg-white/10" />
                <Skeleton className="h-4 w-full bg-white/10" />
              </div>
            </div>

            <div className="space-y-2 border-t border-white/10 pt-6">
              <Skeleton className="h-4 w-36 bg-white/10" />
              <Skeleton className="h-5 w-24 bg-white/10" />
              <Skeleton className="h-4 w-64 bg-white/5" />
            </div>
          </div>

          <div className="space-y-6 border-t border-white/10 pt-8">
            <Skeleton className="h-3 w-28 bg-white/10" />
            <div className="space-y-3">
              <Skeleton className="h-4 w-40 bg-white/10" />
              <Skeleton className="h-4 w-32 bg-white/10" />
              <Skeleton className="h-4 w-36 bg-white/10" />
            </div>
            <div className="space-y-3 border-t border-white/10 pt-4">
              <Skeleton className="h-10 w-full bg-white/10" />
              <Skeleton className="h-12 w-full bg-white/10" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
