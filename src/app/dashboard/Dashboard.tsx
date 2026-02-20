"use client";

import { Gift, Shield, User, Wallet, Activity, Box, Users } from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { CopyButton } from "@/components/animate-ui/components/buttons/copy";
import { InviteDialog } from "@/components/InviteDialog";
import { ResourceManage } from "@/components/admin/ResourceManage";
import { ResourceSection } from "@/components/ResourceSection";
import { DashboardShell } from "@/components/layout/DashboardShell";
import { Input } from "@/components/ui/input";

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
    totalReferrals: number;
    purchasesCount: number;
    resourcesCreatedCount: number;
  };
};

type DashboardProps = {
  user: DashboardUser;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  resources: any[];
};

const Dashboard = ({ user, resources }: DashboardProps) => {
  const referralCode = user.referralCode ?? "N/A";

  return (
    <DashboardShell>
      <div className="mx-auto max-w-7xl space-y-12 px-4 pb-20 pt-10 sm:px-6">
        {/* Header */}
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3">
             <div className="p-2 rounded-lg bg-primary/10 border border-primary/20">
                <User className="w-5 h-5 text-primary" />
             </div>
             <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
                Dashboard
             </span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
            Welcome back, <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-neutral-400">{user.name}</span>
          </h1>
          <p className="max-w-2xl text-lg text-neutral-400">
            Track your balance, manage resources, and grow your network.
          </p>
        </div>

        {/* Profile & Wallet Section */}
        <section className="grid gap-8 lg:grid-cols-[1.5fr_1fr]">
          {/* Profile Card */}
          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-xl relative overflow-hidden group">
            <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] rounded-full pointer-events-none group-hover:bg-primary/10 transition-colors duration-500" />
            
            <div className="relative z-10 flex flex-col gap-8 h-full justify-between">
              <div className="flex flex-col sm:flex-row gap-6 items-start">
                <Avatar className="h-20 w-20 ring-2 ring-white/10 shadow-xl">
                  <AvatarImage src={user.image ?? ""} />
                  <AvatarFallback className="bg-neutral-800 text-white font-bold text-xl">
                    {user.name?.charAt(0) || "U"}
                  </AvatarFallback>
                </Avatar>

                <div className="space-y-2">
                  <h2 className="text-2xl font-bold text-white">{user.name}</h2>
                  <p className="text-neutral-400 font-medium">
                    {user.username ? `@${user.username} • ` : ""}
                    {user.email}
                  </p>
                  <div className="flex flex-wrap gap-2 pt-1">
                    {user.emailVerified && (
                      <Badge variant="outline" className="border-emerald-500/30 bg-emerald-500/10 text-emerald-400">Verified</Badge>
                    )}
                    {user.role === "ADMIN" && (
                      <Badge variant="outline" className="border-purple-500/30 bg-purple-500/10 text-purple-400 gap-1">
                        <Shield className="h-3 w-3" /> Admin
                      </Badge>
                    )}
                    {user.banned && (
                      <Badge variant="destructive">Restricted</Badge>
                    )}
                  </div>
                </div>
              </div>

               <div className="pt-6 border-t border-white/5 space-y-4">
                  <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-neutral-500">
                    <Activity className="w-4 h-4" />
                    Focus
                  </div>
                  <p className="text-neutral-300">
                    Invite collaborators, monitor your balance, and keep your
                    projects in motion.
                  </p>
                  <div className="flex flex-wrap gap-3">
                    <Button
                        variant="outline"
                        size="sm"
                        disabled
                        className="bg-white/5 border-white/10 text-neutral-400 hover:text-white"
                      >
                        <Gift className="mr-2 h-4 w-4" />
                        Earn Coins
                      </Button>
                      <InviteDialog referralCode={referralCode} />
                  </div>
               </div>
            </div>
          </div>

          {/* Wallet Card */}
          <div className="rounded-3xl border border-white/10 bg-gradient-to-br from-black to-neutral-900 p-8 flex flex-col justify-between relative overflow-hidden">
             <div className="absolute inset-0 grid-surface opacity-20 pointer-events-none" />
             <div className="absolute bottom-0 right-0 w-48 h-48 bg-amber-500/10 blur-[80px] rounded-full pointer-events-none" />

             <div className="relative z-10 space-y-6">
                <div className="flex items-center justify-between">
                   <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/20 text-amber-500">
                      <Wallet className="w-6 h-6" />
                   </div>
                   <span className="text-xs font-bold uppercase tracking-wider text-neutral-500 border border-white/5 px-2 py-1 rounded-md">
                      Wallet
                   </span>
                </div>
                
                <div>
                   <p className="text-4xl font-black text-white tracking-tight mb-1">
                      {user.coinBalance}
                   </p>
                   <p className="text-sm font-medium text-neutral-400 uppercase tracking-widest">
                      Total Coins
                   </p>
                </div>
             </div>

             <div className="relative z-10 pt-6 border-t border-white/5 mt-6">
                 <p className="text-sm text-neutral-500">
                    Use coins to unlock premium project files and assets.
                 </p>
             </div>
          </div>
        </section>

        {/* Stats Grid */}
        <section className="grid gap-6 md:grid-cols-3">
             <MetricCard 
                title="Referrals" 
                value={user.stats.totalReferrals} 
                icon={Users} 
                color="text-blue-400" 
                bg="bg-blue-400/10" 
             />
             <MetricCard 
                title="Resources" 
                value={user.stats.purchasesCount} 
                icon={Box} 
                color="text-emerald-400" 
                bg="bg-emerald-400/10" 
             />
             <MetricCard 
                title={user.role === "ADMIN" ? "Created" : "Purchased"} 
                value={user.role === "ADMIN" ? user.stats.resourcesCreatedCount : resources.length} 
                icon={Activity} 
                color="text-pink-400" 
                bg="bg-pink-400/10" 
             />
        </section>

        {/* Referral Section */}
        <section className="rounded-3xl border border-white/10 bg-white/5 p-8 md:p-10 backdrop-blur-sm">
            <div className="flex flex-col md:flex-row gap-8 items-start md:items-center justify-between">
                <div className="space-y-2 max-w-lg">
                    <h3 className="text-xl font-bold text-white">Referral Program</h3>
                    <p className="text-neutral-400">
                        Invite friends and earn coins when they join. Build your network and get rewarded.
                    </p>
                </div>
                 <div className="w-full md:w-auto space-y-2">
                    <p className="text-xs font-bold uppercase tracking-widest text-neutral-500">
                        Your Code
                    </p>
                    <div className="flex gap-2">
                        <Input 
                            value={referralCode} 
                            readOnly 
                            className="bg-black/50 border-white/10 text-white font-mono min-w-[200px]" 
                        />
                        <CopyButton content={referralCode} variant="outline" />
                    </div>
                 </div>
            </div>
        </section>

        {/* Resources Section */}
        <section className="space-y-6">
           <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                  <Box className="w-6 h-6 text-primary" />
                  Your Resources
              </h2>
           </div>

           <div className="rounded-3xl border border-white/10 bg-black/20 p-6 min-h-[200px]">
             {user.role === "ADMIN" ? (
               <ResourceManage resource={resources} />
             ) : (
               <ResourceSection resource={resources} />
             )}
           </div>
        </section>
      </div>
    </DashboardShell>
  );
};

const MetricCard = ({ title, value, icon: Icon, color, bg }: { 
    title: string; 
    value: number; 
    icon: any; 
    color: string; 
    bg: string;
}) => (
  <div className="rounded-2xl border border-white/10 bg-white/5 p-6 flex flex-col justify-between h-full hover:border-white/20 transition-colors">
     <div className="flex justify-between items-start mb-4">
        <div className={`p-2.5 rounded-xl ${bg} ${color}`}>
            <Icon className="w-5 h-5" />
        </div>
     </div>
     <div>
        <p className="text-3xl font-black text-white tracking-tight">{value}</p>
        <p className="text-xs font-bold uppercase tracking-widest text-neutral-500 mt-1">{title}</p>
     </div>
  </div>
);

export default Dashboard;
