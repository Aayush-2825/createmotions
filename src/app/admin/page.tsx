import { Suspense } from "react";
import { redirect } from "next/navigation";

import AdminForm from "@/components/admin/AdminForm";
import { getCurrentUser } from "@/lib/getUser";
import { prisma } from "@/lib/prisma";
import { AdminSkeleton } from "./loading";

export default function AdminPage() {
  return (
    <Suspense fallback={<AdminSkeleton />}>
      <AdminContent />
    </Suspense>
  );
}

async function AdminContent() {
  const user = await getCurrentUser();

  if (!user) redirect("/sign-in");

  if (user.role !== "ADMIN") {
    redirect("/dashboard");
  }

  const sectionsList = await prisma.sectionTag.findMany();

  return <AdminForm sectionsList={sectionsList} />;
}
