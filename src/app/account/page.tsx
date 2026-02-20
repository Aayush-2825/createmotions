import { Suspense } from "react";
import { headers } from "next/headers";

import ProfileCard from "@/components/auth/ProfileCard";
import { auth } from "@/lib/auth";
import { AccountSkeleton } from "./loading";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Settings, Shield, Lock } from "lucide-react";

export default function Account() {
  return (
    <Suspense fallback={<AccountSkeleton />}>
      <AccountContent />
    </Suspense>
  );
}

async function AccountContent() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return (
      <div className="flex min-h-[calc(100vh-80px)] items-center justify-center bg-background px-4 py-16">
        <div className="rounded-3xl border border-white/10 bg-white/5 p-10 text-center backdrop-blur-sm max-w-md w-full">
          <Lock className="w-12 h-12 text-primary mx-auto mb-6" />
          <p className="text-2xl font-bold text-white mb-2">
            Sign in required
          </p>
          <p className="text-neutral-400 mb-8">
            Access account settings after logging in to your workspace.
          </p>
          <Link href="/sign-in">
             <Button className="w-full h-12 rounded-xl bg-primary text-black font-bold hover:bg-primary/90">
                Sign In
             </Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="relative min-h-[calc(100vh-80px)] overflow-hidden bg-background px-4 py-16">
      {/* Background Elements */}
      <div className="absolute inset-0 grid-surface opacity-20 pointer-events-none" />
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="mx-auto flex max-w-5xl flex-col gap-12 sm:px-2 relative z-10">
        <div className="flex flex-col gap-4">
          <div className="inline-flex w-fit items-center gap-2 rounded-lg border border-primary/20 bg-primary/5 px-3 py-1.5 shado-sm">
             <Settings className="w-4 h-4 text-primary" />
             <span className="text-xs font-bold uppercase tracking-[0.2em] text-primary">
                Profile
             </span>
          </div>
          <h1 className="text-4xl md:text-5xl font-black text-white tracking-tight">
            Account <span className="text-transparent bg-clip-text bg-gradient-to-r from-neutral-200 to-neutral-500">Settings</span>
          </h1>
          <p className="max-w-2xl text-lg text-neutral-400">
            Manage your profile, review connected providers, and keep your
            creator identity in sync across the platform.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
          <div className="space-y-6">
            <ProfileCard user={session.user} />
            
            {session.user.role === "ADMIN" && (
              <div className="rounded-3xl border border-purple-500/20 bg-purple-500/5 p-8 backdrop-blur-sm">
                 <div className="flex items-start gap-4 mb-6">
                    <div className="p-3 rounded-xl bg-purple-500/10 text-purple-400">
                        <Shield className="w-6 h-6" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-white">Admin Access</h3>
                        <p className="text-neutral-400 text-sm mt-1">You have administrative privileges on this platform.</p>
                    </div>
                 </div>
                 <Link href="/admin">
                    <Button className="w-full h-12 rounded-xl bg-purple-600 text-white font-bold hover:bg-purple-700 shadow-lg shadow-purple-500/20 border-0">
                      Enter Admin Dashboard
                    </Button>
                  </Link>
              </div>
            )}
          </div>

          <div className="rounded-3xl border border-white/10 bg-white/5 p-8 h-fit backdrop-blur-sm">
            <p className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                <Shield className="w-5 h-5 text-emerald-400" />
                Security & Privacy
            </p>
            <ul className="space-y-4 text-sm text-neutral-400">
              <li className="flex gap-3">
                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                 Use social sign-in to keep your credentials secure and managed by trusted providers.
              </li>
              <li className="flex gap-3">
                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                 Monitor referral rewards directly from your dashboard's wallet section.
              </li>
              <li className="flex gap-3">
                 <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 shrink-0" />
                 Contact support immediately if you notice any unusual activity on your account.
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
