import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return <AccountSkeleton />;
}

export function AccountSkeleton() {
  return (
    <div className="min-h-[calc(100vh-80px)] bg-background px-4 py-16">
      <div className="mx-auto max-w-5xl space-y-12">
        <div className="space-y-3">
          <Skeleton className="h-4 w-24 bg-white/10" />
          <Skeleton className="h-9 w-72 bg-white/10" />
          <Skeleton className="h-4 w-96 bg-white/10" />
        </div>

        <div className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="space-y-4">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
              <div className="flex items-start gap-4">
                <Skeleton className="h-16 w-16 rounded-full bg-white/10" />
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-5 w-48 bg-white/10" />
                  <Skeleton className="h-4 w-64 bg-white/5" />
                  <div className="flex flex-wrap gap-2">
                    <Skeleton className="h-6 w-16 bg-white/5" />
                    <Skeleton className="h-6 w-20 bg-white/5" />
                    <Skeleton className="h-6 w-14 bg-white/5" />
                  </div>
                </div>
              </div>
              <div className="mt-6 grid gap-3 sm:grid-cols-2">
                <Skeleton className="h-10 w-full bg-white/10" />
                <Skeleton className="h-10 w-full bg-white/10" />
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
              <div className="space-y-2">
                <Skeleton className="h-4 w-28 bg-white/10" />
                <Skeleton className="h-4 w-48 bg-white/10" />
                <Skeleton className="h-4 w-40 bg-white/10" />
              </div>
              <div className="mt-4 grid gap-2 sm:grid-cols-2">
                <Skeleton className="h-10 w-full bg-white/10" />
                <Skeleton className="h-10 w-full bg-white/10" />
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
            <Skeleton className="h-5 w-32 bg-white/10" />
            <div className="mt-3 space-y-2">
              <Skeleton className="h-4 w-full bg-white/5" />
              <Skeleton className="h-4 w-5/6 bg-white/5" />
              <Skeleton className="h-4 w-2/3 bg-white/5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
