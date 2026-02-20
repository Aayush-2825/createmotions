import Link from "next/link";
import { ShieldOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

export default function UnauthorizedPage() {
  return (
    <div className="flex min-h-[calc(100vh-96px)] items-center justify-center px-4 py-16 bg-white grid-surface">
      <Empty className="border border-slate-200 bg-white/85 shadow-md shadow-slate-900/5">
        <EmptyMedia variant="icon">
          <ShieldOff className="size-6" />
        </EmptyMedia>
        <EmptyHeader>
          <EmptyTitle>Access denied</EmptyTitle>
          <EmptyDescription>
            You do not have permission to view this page. Try signing in with a different account or request access.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <div className="flex flex-wrap justify-center gap-3">
            <Button asChild className="rounded-xl px-5">
              <Link href="/dashboard">Go to dashboard</Link>
            </Button>
            <Button variant="outline" asChild className="rounded-xl px-5 border-slate-200">
              <Link href="/">Back home</Link>
            </Button>
          </div>
        </EmptyContent>
      </Empty>
    </div>
  );
}
