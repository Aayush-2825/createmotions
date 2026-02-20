import { Skeleton } from "@/components/ui/skeleton";

export default function Loading() {
  return <ProjectFilesSkeleton />;
}

export function ProjectFilesSkeleton() {
  return (
    <div className="min-h-[calc(100vh-80px)] bg-background px-4 py-16">
      <div className="mx-auto max-w-6xl space-y-14">
        <div className="space-y-3">
          <Skeleton className="h-3 w-24 bg-white/10" />
          <Skeleton className="h-10 w-60 bg-white/10" />
          <Skeleton className="h-4 w-80 bg-white/10" />
        </div>

        <div className="space-y-6 border-t border-white/10 pt-8">
          <Skeleton className="h-3 w-20 bg-white/10" />
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <Skeleton className="h-11 w-full max-w-sm bg-white/10" />
            <Skeleton className="h-11 w-48 bg-white/10" />
          </div>
        </div>

        <div className="space-y-10">
          {Array.from({ length: 3 }).map((_, sectionIdx) => (
            <div key={sectionIdx} className="space-y-4">
              <div className="flex items-center gap-2 text-base font-semibold">
                <Skeleton className="h-4 w-8 bg-white/10" />
                <Skeleton className="h-4 w-32 bg-white/10" />
              </div>

              <div className="grid gap-6 md:grid-cols-2">
                {Array.from({ length: 2 }).map((_, cardIdx) => (
                  <div
                    key={`${sectionIdx}-${cardIdx}`}
                    className="space-y-3 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm"
                  >
                    <Skeleton className="h-48 w-full rounded-xl bg-white/10" />
                    <div className="space-y-2">
                      <Skeleton className="h-5 w-48 bg-white/10" />
                      <Skeleton className="h-4 w-full bg-white/5" />
                    </div>
                    <div className="flex flex-wrap gap-2">
                      <Skeleton className="h-5 w-20 bg-white/5" />
                      <Skeleton className="h-5 w-16 bg-white/5" />
                      <Skeleton className="h-5 w-24 bg-white/5" />
                    </div>
                    <div className="flex items-center justify-between">
                      <Skeleton className="h-5 w-24 bg-white/5" />
                      <Skeleton className="h-10 w-32 bg-white/10" />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
