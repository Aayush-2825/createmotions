export type DashboardUser = {
  id: string;
  name: string;
  username?: string | null;
  email: string;
  image?: string | null;

  emailVerified: boolean;
  role: "USER" | "ADMIN";

  coinBalance: number;

  referralCode?: string | null;

  banned?: boolean | null;
  banReason?: string | null;
  banExpires?: Date | null;

  stats: {
    purchasesCount: number;
    totalReferrals: number;
    resourcesCreatedCount: number;
  };
};
