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
    <div className="flex min-h-[calc(100vh-96px)] items-center justify-center px-4 py-16 bg-[radial-gradient(circle_at_80%_20%,rgba(0,0,0,0.04),transparent_45%)]">
      <Empty className="border bg-card/50">
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
          <div className="flex flex-wrap justify-center gap-2">
            <Button asChild>
              <Link href="/dashboard">Go to dashboard</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/">Back home</Link>
            </Button>
          </div>
        </EmptyContent>
      </Empty>
    </div>
  );
}
