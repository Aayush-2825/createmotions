import { Suspense } from "react";

import { getCurrentUser } from "@/lib/getUser";
import Dashboard from "./Dashboard";
import { prisma } from "@/lib/prisma";
import { mapUserToDashboardView } from "@/lib/mapper/user.mapper";
import { getResourceById, getResourceByIdAdmin } from "@/lib/resource";
import { DashboardSkeleton } from "./loading";



export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardSkeleton />}>
      <DashboardContent />
    </Suspense>
  );
}

async function DashboardContent() {
  const dbUser = await getCurrentUser();

  if (!dbUser)
    return (
      <div className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-white px-4 py-16 grid-surface">
        <div className="rounded-3xl border border-slate-200 bg-white/85 px-6 py-8 text-center shadow-md shadow-slate-900/5">
          <p className="text-lg font-semibold text-slate-900">Please sign in</p>
          <p className="text-sm text-slate-600">Access your dashboard after logging in.</p>
        </div>
      </div>
    );

  const [purchasesCount, referralsCount, resourcesCreatedCount] =
    await Promise.all([
      prisma.purchase.count({ where: { userId: dbUser.id, archivedAt: null } }),
      prisma.referral.count({ where: { referrerId: dbUser.id } }),
      prisma.resource.count({ where: { creatorId: dbUser.id, deletedAt: null } }),
    ]);


  const user = mapUserToDashboardView(dbUser, {
    purchasesCount,
    totalReferrals: referralsCount,
    resourcesCreatedCount,
  });

  let resources;
  if (user.role === 'ADMIN') {
    resources = await getResourceByIdAdmin(user.id);
  } else {
    resources = await getResourceById(user.id, false);
  }


  return <Dashboard user={user} resources={resources} />;
}
