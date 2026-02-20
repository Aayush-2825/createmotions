import { Suspense } from "react";

import {
  purchaseResource,
  type PurchaseFormState,
} from "@/actions/purchase-actions";
import { getCurrentUser } from "@/lib/getUser";
import { prisma } from "@/lib/prisma";
import { formatDistanceToNow } from "date-fns";
import { Coins, ArrowLeft, Wallet } from "lucide-react";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import { CoinsCheckoutForm } from "./CoinsCheckoutForm";
import { CheckoutSkeleton } from "./loading";

export const dynamic = 'force-dynamic';

type PageProps = {
  params: { resourceId: string };
};

async function payWithCoins(prevState: PurchaseFormState, formData: FormData) {
  "use server";

  formData.set("paymentMethod", "COINS");
  return purchaseResource(prevState, formData);
}

export default function CoinCheckoutPage({ params }: PageProps) {
  return (
    <Suspense fallback={<CheckoutSkeleton />}>
      <CheckoutContent params={params} />
    </Suspense>
  );
}

async function CheckoutContent({ params }: PageProps) {
  const user = await getCurrentUser();
  const param = await params;

  if (!user) {
    redirect(`/sign-in?next=/checkout/${param.resourceId}`);
  }

  const resource = await prisma.resource.findUnique({
    where: { id: param.resourceId, deletedAt: null },
    select: {
      id: true,
      title: true,
      description: true,
      type: true,
      priceMoney: true,
      priceCoins: true,
      sections: { select: { id: true, name: true, slug: true } },
      createdAt: true,
      isActive: true,
    },
  });

  if (!resource || !resource.isActive) {
    notFound();
  }

  const purchase = await prisma.purchase.findFirst({
    where: {
      userId: user.id,
      resourceId: resource.id,
      archivedAt: null,
    },
  });

  const priceCoins = resource.priceCoins ?? 0;
  const priceMoney = resource.priceMoney ?? 0;
  const supportsCoins = priceCoins > 0 || (priceCoins === 0 && priceMoney === 0);
  const coinBalance = user.coinBalance;
  const remainingCoins = coinBalance - priceCoins;

  return (
    <div className="min-h-screen bg-background text-foreground">
      <div className="fixed inset-0 -z-10 bg-background">
        <div className="absolute right-0 top-0 h-80 w-80 rounded-full bg-primary/10 blur-[120px]" />
        <div className="absolute bottom-0 left-0 h-72 w-72 rounded-full bg-primary/5 blur-[120px]" />
        <div className="absolute inset-0 grid-surface opacity-25" />
      </div>

      <div className="mx-auto max-w-6xl space-y-12 px-4 py-20 sm:px-6 lg:px-8">
        {/* Back */}
        <Link
          href="/project-files"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground transition hover:text-foreground"
        >
          <ArrowLeft className="size-4" />
          Back to marketplace
        </Link>

        {/* Header */}
        <div className="max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-primary">
            <Coins className="size-4" />
            Coin checkout
          </div>

          <h1 className="text-3xl font-black leading-tight tracking-tight sm:text-5xl">
            {resource.title}
          </h1>

          <p className="text-base text-muted-foreground">
            Confirm your purchase with coins. Review your wallet balance before
            completing checkout.
          </p>
        </div>

        <div className="grid gap-8 lg:grid-cols-[1.45fr_1fr]">
          {/* LEFT — Resource Info */}
          <div className="space-y-8 rounded-3xl border border-white/10 bg-white/5 p-8 backdrop-blur-md">
            <div className="space-y-4">
              <p className="text-xs uppercase tracking-[0.25em] text-muted-foreground">
                What you get
              </p>

              <p className="text-base leading-relaxed text-foreground/90">
                {resource.description ?? "No description provided."}
              </p>

              <div className="flex flex-wrap gap-2 pt-2">
                {resource.sections.length ? (
                  resource.sections.map((section) => (
                    <span
                      key={section.id}
                      className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-sm text-foreground/90"
                    >
                      {section.name}
                    </span>
                  ))
                ) : (
                  <span className="rounded-full border border-white/15 bg-white/5 px-3 py-1 text-sm text-foreground/90">
                    General
                  </span>
                )}
              </div>
            </div>

            <div className="space-y-4 border-t border-white/10 pt-8">
              <InfoRow
                label="Ownership"
                value={
                  purchase
                    ? "Already in your library"
                    : "Will be added to your library"
                }
              />

              <InfoRow
                label="Created"
                value={formatDistanceToNow(resource.createdAt, {
                  addSuffix: true,
                })}
              />
            </div>

            <div className="space-y-2 border-t border-white/10 pt-8">
              <p className="text-sm uppercase tracking-[0.2em] text-muted-foreground">
                Coins required
              </p>
              <p className="text-3xl font-black text-primary">{priceCoins} coins</p>
              <p className="text-sm text-muted-foreground">
                Coins are deducted instantly after confirmation.
              </p>
            </div>
          </div>

          {/* RIGHT — Wallet */}
          <div className="space-y-8 rounded-3xl border border-white/10 bg-black/30 p-8 backdrop-blur-md">
            <div className="space-y-4">
              <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/5 px-3 py-1 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                <Wallet className="size-3.5" />
                Wallet summary
              </div>

              <MetricRow
                label="Current balance"
                value={`${coinBalance} coins`}
              />
              <MetricRow label="This purchase" value={`${priceCoins} coins`} />
              <MetricRow
                label="Balance after"
                value={`${Math.max(remainingCoins, 0)} coins`}
                highlight={remainingCoins < 0}
              />
            </div>

            <div className="border-t border-white/10 pt-6">
              <CoinsCheckoutForm
                action={payWithCoins}
                resourceId={resource.id}
                coinPrice={priceCoins}
                coinBalance={coinBalance}
                alreadyPurchased={Boolean(purchase)}
                supportsCoins={supportsCoins}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function InfoRow({
  label,
  value,
}: {
  label: string;
  value: string;
}) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-medium text-foreground">{value}</span>
    </div>
  );
}

function MetricRow({
  label,
  value,
  highlight,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div className="flex items-center justify-between text-sm">
      <span className="text-muted-foreground">{label}</span>
      <span
        className={`font-semibold ${
          highlight ? "text-destructive" : "text-foreground"
        }`}
      >
        {value}
      </span>
    </div>
  );
}
