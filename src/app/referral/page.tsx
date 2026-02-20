"use client";

import { Suspense, useActionState, useMemo } from "react";
import { useSearchParams } from "next/navigation";

import { submitReferralCode, type ReferralFormState } from "@/actions/referral-actions";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { AlertTriangle, CheckCircle2 } from "lucide-react";

const initialState: ReferralFormState = { status: "idle", message: "" };

export default function ReferralPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[calc(100vh-96px)] items-center justify-center px-4 py-16">
          <Card className="w-full max-w-lg border bg-card/70 backdrop-blur">
            <CardHeader className="space-y-2 text-center">
              <CardTitle className="text-2xl">Apply a referral code</CardTitle>
              <CardDescription>Loading referral form…</CardDescription>
            </CardHeader>
          </Card>
        </div>
      }
    >
      <ReferralPageContent />
    </Suspense>
  );
}

function ReferralPageContent() {
  const searchParams = useSearchParams();
  const defaultCode = useMemo(() => searchParams.get("ref") ?? "", [searchParams]);

  const [state, formAction, pending] = useActionState(submitReferralCode, initialState);

  return (
    <div className="relative min-h-[calc(100vh-80px)] overflow-hidden bg-white px-4 py-16 grid-surface">
      <div className="container mx-auto grid max-w-6xl gap-12 sm:px-2 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-5">
          <span className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white/80 px-4 py-1 text-xs font-semibold uppercase tracking-[0.26em] text-slate-600 shadow-sm">
            Referral rewards
          </span>
          <h1 className="text-4xl font-semibold leading-[1.05] text-slate-900 sm:text-5xl" style={{ fontFamily: "var(--font-display)" }}>
            Apply your code and unlock creator perks
          </h1>
          <p className="max-w-3xl text-lg text-slate-700 sm:text-xl">
            Link your referral to track coins, access drops, and grow with your community.
          </p>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-slate-200 bg-white/85 p-4 shadow-sm">
              <p className="text-sm font-semibold text-slate-900">Instant linking</p>
              <p className="text-sm text-slate-600">Codes apply immediately and are single-use per account.</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-white/85 p-4 shadow-sm">
              <p className="text-sm font-semibold text-slate-900">Rewards ready</p>
              <p className="text-sm text-slate-600">See coin bonuses reflected in your dashboard.</p>
            </div>
          </div>
        </div>

        <Card className="w-full max-w-xl border border-slate-200 bg-white/85 shadow-lg shadow-slate-900/5">
          <CardHeader className="space-y-2 text-center">
            <CardTitle className="text-2xl">Apply a referral code</CardTitle>
            <CardDescription>
              Paste the code you received to link your account and unlock rewards.
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            <form action={formAction} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="code">Referral code</Label>
                <Input
                  id="code"
                  name="code"
                  defaultValue={defaultCode}
                  placeholder="E.g. 8-character code"
                  autoComplete="off"
                  className="font-mono uppercase"
                  disabled={pending}
                  required
                />
              </div>

              <Separator />

              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-slate-600">
                  Codes are single-use per account. Already linked? You are all set.
                </p>
                <Button type="submit" disabled={pending} className="w-full rounded-xl sm:w-auto">
                  {pending ? "Submitting..." : "Apply code"}
                </Button>
              </div>
            </form>

            {state.status === "error" ? (
              <div className="flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2 text-sm text-destructive">
                <AlertTriangle className="mt-0.5 h-4 w-4" />
                <p>{state.message}</p>
              </div>
            ) : null}

            {state.status === "success" ? (
              <div className="flex items-start gap-2 rounded-md border border-emerald-300/60 bg-emerald-50 px-3 py-2 text-sm text-emerald-800">
                <CheckCircle2 className="mt-0.5 h-4 w-4" />
                <p>{state.message}</p>
              </div>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
