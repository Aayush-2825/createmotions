"use client";

import Link from "next/link";
import { useState } from "react";
import { FcGoogle } from "react-icons/fc";
import { FaDiscord } from "react-icons/fa";

import { signIn } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Sparkles } from "lucide-react";

export default function SignInPage() {
  const [error, setError] = useState<string | null>(null);
  const [socialLoading, setSocialLoading] = useState<
    null | "google" | "discord"
  >(null);

  const handleSocial = async (provider: "google" | "discord") => {
    setError(null);
    try {
      await signIn.social({
        provider,
        callbackURL: "/dashboard",
        fetchOptions: {
          onRequest: () => setSocialLoading(provider),
          onResponse: () => setSocialLoading(null),
        },
      });
    } catch (err: unknown) {
      setSocialLoading(null);
      const message =
        err instanceof Error
          ? err.message
          : "Unable to continue with social login.";
      setError(message);
    }
  };

  return (
    <div className="relative min-h-[calc(100vh-80px)] flex items-center justify-center overflow-hidden bg-background px-4 py-16">
      {/* Background Elements */}
      <div className="absolute inset-0 grid-surface opacity-30 pointer-events-none" />
      <div className="absolute -top-1/4 -right-1/4 w-full h-full bg-primary/5 blur-[120px] rounded-full pointer-events-none" />
      <div className="absolute -bottom-1/4 -left-1/4 w-full h-full bg-purple-500/5 blur-[120px] rounded-full pointer-events-none" />

      <div className="container mx-auto grid max-w-6xl items-center gap-16 sm:px-2 lg:grid-cols-[1.1fr_0.9fr]">
        <div className="space-y-8">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/5 px-4 py-1 text-xs font-bold uppercase tracking-[0.2em] text-primary shadow-[0_0_15px_rgba(0,229,255,0.2)]">
            <Sparkles className="w-3 h-3" />
            Seamless access
          </div>
          <h1 className="text-5xl font-black leading-[1.05] text-white sm:text-6xl tracking-tight">
            Jump back into your <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-purple-500">motion workspace</span>
          </h1>
          <p className="max-w-2xl text-xl text-neutral-400 font-light">
            Sign in quickly, stay synced across dashboard, resources, and referrals.
          </p>

          <div className="grid gap-4 sm:grid-cols-2">
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm hover:bg-white/10 transition-colors">
              <p className="text-sm font-bold text-white mb-1">Secure by design</p>
              <p className="text-sm text-neutral-400">OAuth-first sign-in with trusted providers.</p>
            </div>
            <div className="rounded-2xl border border-white/10 bg-white/5 p-6 backdrop-blur-sm hover:bg-white/10 transition-colors">
              <p className="text-sm font-bold text-white mb-1">Fast handoff</p>
              <p className="text-sm text-neutral-400">Auto-redirect to your dashboard after login.</p>
            </div>
          </div>
        </div>

        <Card className="w-full border-white/10 bg-black/40 shadow-2xl backdrop-blur-xl relative overflow-hidden group">
          <div className="absolute inset-x-0 -top-px h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          
          <CardHeader className="space-y-2 text-center pb-8 pt-8">
            <CardTitle className="text-3xl font-black text-white">Welcome back</CardTitle>
            <CardDescription className="text-neutral-400">Choose a provider to continue.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-8 pb-8">
            <div className="grid gap-4">
              <Button
                variant="outline"
                className="h-14 justify-center rounded-xl border-white/10 bg-white/5 text-base font-semibold text-white shadow-none transition-all hover:bg-white/10 hover:border-white/20 hover:scale-[1.02]"
                disabled={socialLoading !== null}
                onClick={() => handleSocial("google")}
              >
                <FcGoogle className="mr-3 h-5 w-5" />
                {socialLoading === "google" ? "Connecting..." : "Continue with Google"}
              </Button>
              <Button
                variant="outline"
                className="h-14 justify-center rounded-xl border-white/10 bg-white/5 text-base font-semibold text-white shadow-none transition-all hover:bg-[#5865F2]/20 hover:border-[#5865F2]/50 hover:scale-[1.02]"
                disabled={socialLoading !== null}
                onClick={() => handleSocial("discord")}
              >
                <FaDiscord className="mr-3 h-5 w-5 text-[#5865F2]" />
                {socialLoading === "discord" ? "Connecting..." : "Continue with Discord"}
              </Button>
            </div>

            {error ? (
                <div className="p-3 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm text-center font-medium">
                    {error}
                </div>
            ) : null}

            <p className="text-center text-sm text-neutral-500">
              Don&apos;t have an account?{" "}
              <Link
                href="/register"
                className="font-bold text-primary underline-offset-4 hover:underline decoration-primary/50"
              >
                Register
              </Link>
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
