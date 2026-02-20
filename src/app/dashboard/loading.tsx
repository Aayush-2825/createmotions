import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return <DashboardSkeleton />;
}

export function DashboardSkeleton() {
  return (
    <div className="bg-background px-4 py-10">
      <div className="mx-auto max-w-6xl space-y-12 sm:space-y-14">
        <div className="space-y-3">
          <Skeleton className="h-4 w-20 bg-white/10" />
          <Skeleton className="h-10 w-72 bg-white/10" />
          <Skeleton className="h-4 w-80 bg-white/10" />
        </div>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex flex-col items-start gap-4 sm:flex-row sm:items-center">
                <Skeleton className="h-16 w-16 rounded-full bg-white/10" />
                <div className="space-y-2">
                  <Skeleton className="h-5 w-40 bg-white/10" />
                  <Skeleton className="h-4 w-60 bg-white/5" />
                  <div className="flex flex-wrap gap-2">
                    <Skeleton className="h-6 w-16 bg-white/5" />
                    <Skeleton className="h-6 w-16 bg-white/5" />
                  </div>
                </div>
              </div>
              <div className="flex w-full flex-wrap gap-2 sm:w-auto sm:flex-nowrap">
                <Skeleton className="h-9 w-full sm:w-32 bg-white/10" />
                <Skeleton className="h-9 w-full sm:w-32 bg-white/10" />
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm space-y-4">
            <Skeleton className="h-4 w-28 bg-white/10" />
            <div className="flex items-center justify-between border-t border-white/10 pt-4">
              <div className="space-y-2">
                <Skeleton className="h-3 w-16 bg-white/10" />
                <Skeleton className="h-6 w-24 bg-white/10" />
              </div>
              <Skeleton className="h-12 w-12 rounded-xl bg-white/10" />
            </div>
            <Skeleton className="h-4 w-44 bg-white/5" />
          </div>
        </section>

        <section className="space-y-6 border-t border-white/10 pt-10">
          <Skeleton className="h-4 w-20 bg-white/10" />
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:gap-0 lg:justify-between">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="flex flex-col gap-2">
                <Skeleton className="h-3 w-20 bg-white/10" />
                <Skeleton className="h-7 w-24 bg-white/10" />
              </div>
            ))}
          </div>
        </section>

        <section className="space-y-4 border-t border-white/10 pt-10">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="space-y-2">
              <Skeleton className="h-3 w-28 bg-white/10" />
              <Skeleton className="h-4 w-52 bg-white/10" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-3 w-24 bg-white/10" />
              <div className="flex gap-2">
                <Skeleton className="h-10 w-48 bg-white/10" />
                <Skeleton className="h-10 w-20 bg-white/10" />
              </div>
            </div>
          </div>
        </section>

        <section className="space-y-6 border-t border-white/10 pt-10">
          <Skeleton className="h-4 w-24 bg-white/10" />
          <div className="grid gap-4 md:grid-cols-2">
            {Array.from({ length: 4 }).map((_, idx) => (
              <div key={idx} className="space-y-3 rounded-2xl border border-white/10 border-dashed p-4 bg-white/5">
                <Skeleton className="h-5 w-32 bg-white/10" />
                <Skeleton className="h-4 w-full bg-white/5" />
                <Skeleton className="h-4 w-5/6 bg-white/5" />
                <Skeleton className="h-10 w-28 bg-white/10" />
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
