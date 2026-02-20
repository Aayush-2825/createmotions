"use client";

import Link from "next/link";
import { useEffect } from "react";
import { AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div className="flex min-h-[calc(100vh-96px)] items-center justify-center px-4 py-16 bg-[radial-gradient(circle_at_50%_10%,rgba(0,0,0,0.05),transparent_50%)]">
      <Empty className="border bg-card/50">
        <EmptyMedia variant="icon">
          <AlertTriangle className="size-6 text-destructive" />
        </EmptyMedia>
        <EmptyHeader>
          <EmptyTitle>Something went wrong</EmptyTitle>
          <EmptyDescription>
            {error?.message
              ? error.message
              : "An unexpected error occurred. Please try again or return to a safe page."}
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <div className="flex flex-wrap justify-center gap-2">
            <Button onClick={reset}>Try again</Button>
            <Button variant="outline" asChild>
              <Link href="/">Return home</Link>
            </Button>
          </div>
          {error?.digest ? (
            <p className="text-xs text-muted-foreground">Error ID: {error.digest}</p>
          ) : null}
        </EmptyContent>
      </Empty>
    </div>
  );
}
