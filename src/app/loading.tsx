import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return (
    <main className="relative min-h-screen bg-background grid-surface">
      <div className="container mx-auto space-y-16 px-4 py-16 sm:px-6 lg:px-8">
        <section className="grid items-center gap-10 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <Skeleton className="h-4 w-28 bg-white/10" />
            <div className="space-y-4">
              <Skeleton className="h-16 w-full max-w-3xl bg-white/10" />
              <Skeleton className="h-14 w-full max-w-2xl bg-white/10" />
              <Skeleton className="h-4 w-2/3 bg-white/10" />
            </div>
            <div className="flex flex-wrap gap-3">
              <Skeleton className="h-11 w-40 bg-white/10" />
              <Skeleton className="h-11 w-40 bg-white/10" />
            </div>
            <div className="flex flex-wrap items-center gap-3 text-sm uppercase tracking-[0.2em]">
              <Skeleton className="h-3 w-28 bg-white/10" />
              <Skeleton className="h-3 w-24 bg-white/10" />
              <Skeleton className="h-3 w-24 bg-white/10" />
            </div>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            <Skeleton className="h-40 w-full bg-white/5 border border-white/10 rounded-2xl" />
            <Skeleton className="h-40 w-full bg-white/5 border border-white/10 rounded-2xl" />
            <Skeleton className="h-40 w-full bg-white/5 border border-white/10 rounded-2xl" />
            <Skeleton className="h-40 w-full bg-white/5 border border-white/10 rounded-2xl" />
          </div>
        </section>

        <section className="space-y-10 border-t border-white/10 pt-12">
          <div className="space-y-3 text-center">
            <Skeleton className="mx-auto h-4 w-24 bg-white/10" />
            <Skeleton className="mx-auto h-10 w-72 bg-white/10" />
            <Skeleton className="mx-auto h-4 w-64 bg-white/10" />
          </div>

          <div className="grid gap-10 lg:grid-cols-2">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="flex gap-4 border-b border-white/10 pb-8 last:border-0 lg:pb-10">
                <Skeleton className="h-12 w-12 rounded-xl bg-white/10" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-40 bg-white/10" />
                  <Skeleton className="h-4 w-full bg-white/5" />
                  <Skeleton className="h-4 w-5/6 bg-white/5" />
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
