import { Suspense } from "react";

import ResourcesClient from "@/components/resources-clients";
import { prisma } from "@/lib/prisma";
import { getResources } from "@/lib/resource";
import { ProjectFilesSkeleton } from "./loading";



export default function ResourcesPage() {
  return (
    <Suspense fallback={<ProjectFilesSkeleton />}>
      <ResourcesContent />
    </Suspense>
  );
}

async function ResourcesContent() {
  const resources = await getResources();
  const sections = await prisma.sectionTag.findMany();

  return <ResourcesClient resources={resources} sections={sections} />;
}
