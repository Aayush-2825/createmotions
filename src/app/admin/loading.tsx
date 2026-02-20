import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return <AdminSkeleton />;
}

export function AdminSkeleton() {
  return (
    <div className="min-h-screen bg-background px-4 py-14">
      <div className="mx-auto max-w-7xl space-y-10">
        <div className="space-y-3">
          <Skeleton className="h-4 w-24 bg-white/10" />
          <Skeleton className="h-9 w-80 bg-white/10" />
          <Skeleton className="h-4 w-96 bg-white/10" />
        </div>

        <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
          <div className="space-y-6">
            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
              <div className="space-y-4">
                <Skeleton className="h-5 w-36 bg-white/10" />
                <Skeleton className="h-4 w-56 bg-white/10" />
                <Skeleton className="h-10 w-full bg-white/10" />
                <Skeleton className="h-10 w-48 bg-white/10" />
                <Skeleton className="h-24 w-full bg-white/10" />
                <Skeleton className="h-10 w-full bg-white/10" />
                <Skeleton className="h-10 w-full bg-white/10" />
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm">
              <div className="grid gap-4 sm:grid-cols-2">
                <Skeleton className="h-10 w-full bg-white/10" />
                <Skeleton className="h-10 w-full bg-white/10" />
                <Skeleton className="h-10 w-full bg-white/10" />
                <Skeleton className="h-10 w-full bg-white/10" />
              </div>
              <div className="mt-5 grid gap-3 sm:grid-cols-2">
                <Skeleton className="h-12 w-full bg-white/10" />
                <Skeleton className="h-12 w-full bg-white/10" />
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm space-y-4">
            <Skeleton className="h-5 w-32 bg-white/10" />
            <Skeleton className="h-4 w-48 bg-white/10" />
            <Skeleton className="h-48 w-full rounded-xl bg-white/10" />
            <div className="space-y-2">
              <Skeleton className="h-4 w-full bg-white/5" />
              <Skeleton className="h-4 w-2/3 bg-white/5" />
              <Skeleton className="h-4 w-1/2 bg-white/5" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
