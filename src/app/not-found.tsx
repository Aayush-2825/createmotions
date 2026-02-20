import Link from "next/link";
// import { CompassOff } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "@/components/ui/empty";
import { IconCompassOff } from "@tabler/icons-react";

export default function NotFound() {
  return (
    <div className="flex min-h-[calc(100vh-96px)] items-center justify-center px-4 py-16 bg-[radial-gradient(circle_at_80%_20%,rgba(0,0,0,0.04),transparent_45%)]">
      <Empty className="border bg-card/50">
        <EmptyMedia variant="icon">
          <IconCompassOff className="size-6" />
        </EmptyMedia>
        <EmptyHeader>
          <EmptyTitle>Page not found</EmptyTitle>
          <EmptyDescription>
            The page you are looking for does not exist or may have been moved.
            Double-check the URL or head back to a safe spot.
          </EmptyDescription>
        </EmptyHeader>
        <EmptyContent>
          <div className="flex flex-wrap justify-center gap-2">
            <Button asChild>
              <Link href="/">Return home</Link>
            </Button>
            <Button variant="outline" asChild>
              <Link href="/project-files">Open projects</Link>
            </Button>
          </div>
        </EmptyContent>
      </Empty>
    </div>
  );
}
