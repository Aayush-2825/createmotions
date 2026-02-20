import { User } from "@/generated/prisma";
import { DashboardUser } from "@/types/dashboard.types";

type DashboardAggregates = {
  purchasesCount: number;
  totalReferrals: number;
  resourcesCreatedCount: number;
};

export function mapUserToDashboardView(
  user: User,
  aggregates: DashboardAggregates
): DashboardUser {
  return {
    id: user.id,
    name: user.name,
    email: user.email,
    image: user.image,

    emailVerified: user.emailVerified,
    role: user.role as "USER" | "ADMIN",

    coinBalance: user.coinBalance,

    referralCode: user.referralCode,

    banned: user.banned,
    banReason: user.banReason,
    banExpires: user.banExpires,

    stats: {
      purchasesCount: aggregates.purchasesCount,
      totalReferrals: aggregates.totalReferrals,
      resourcesCreatedCount: aggregates.resourcesCreatedCount,
    },
  };
}
