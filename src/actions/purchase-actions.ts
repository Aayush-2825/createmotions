"use server";

import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { getCurrentUser } from "@/lib/getUser";


export type PurchaseFormState = {
  status: "idle" | "success" | "error";
  message: string;
};

type PaymentMethod = "COINS" | "MONEY";


const purchaseSchema = z.object({
  resourceId: z.uuid(),
  paymentMethod: z.enum(["COINS", "MONEY"]).optional(),
});


const ERRORS = {
  NOT_AUTHENTICATED: "NOT_AUTHENTICATED",
  RESOURCE_NOT_AVAILABLE: "RESOURCE_NOT_AVAILABLE",
  ALREADY_PURCHASED: "ALREADY_PURCHASED",
  PAYMENT_METHOD_REQUIRED: "PAYMENT_METHOD_REQUIRED",
  INVALID_PAYMENT_METHOD: "INVALID_PAYMENT_METHOD",
  MONEY_NOT_IMPLEMENTED: "MONEY_NOT_IMPLEMENTED",
  INSUFFICIENT_COINS: "INSUFFICIENT_COINS",
  INVALID_PRICE: "INVALID_PRICE",
  PRICE_NOT_DEFINED: "PRICE_NOT_DEFINED",
  CANNOT_BUY_OWN_RESOURCE: "CANNOT_BUY_OWN_RESOURCE",
  USER_NOT_FOUND: "USER_NOT_FOUND",
};


function resolvePaymentMethod(
  resourcePayment: "COINS" | "MONEY" | "BOTH",
  selected?: PaymentMethod,
): PaymentMethod {
  if (resourcePayment === "BOTH") {
    if (!selected) {
      throw new Error(ERRORS.PAYMENT_METHOD_REQUIRED);
    }
    return selected;
  }

  if (selected && selected !== resourcePayment) {
    throw new Error(ERRORS.INVALID_PAYMENT_METHOD);
  }

  return resourcePayment;
}

function validateCoinPrice(price: number | null) {
  if (price == null) throw new Error(ERRORS.PRICE_NOT_DEFINED);
  if (price < 0) throw new Error(ERRORS.INVALID_PRICE);
  return price;
}

function validateMoneyPrice(price: number | null) {
  if (price == null) throw new Error(ERRORS.PRICE_NOT_DEFINED);
  if (price < 0) throw new Error(ERRORS.INVALID_PRICE);
  return price;
}


export async function purchaseResource(
  _prev: PurchaseFormState,
  formData: FormData,
): Promise<PurchaseFormState> {
  const parsed = purchaseSchema.safeParse({
    resourceId: formData.get("resourceId"),
    paymentMethod: formData.get("paymentMethod") ?? undefined,
  });

  if (!parsed.success) {
    return { status: "error", message: "Invalid purchase request." };
  }

  const { resourceId, paymentMethod } = parsed.data;

  const user = await getCurrentUser();

  if (!user) {
    return { status: "error", message: "Please sign in to continue." };
  }

  try {
    await prisma.$transaction(async (tx) => {
      /* ===== Fetch Resource ===== */

      const resource = await tx.resource.findUnique({
        where: { id: resourceId, deletedAt: null },
        select: {
          id: true,
          creatorId: true,
          isActive: true,
          paymentType: true,
          priceCoins: true,
          priceMoney: true,
        },
      });

      if (!resource || !resource.isActive) {
        throw new Error(ERRORS.RESOURCE_NOT_AVAILABLE);
      }

      if (resource.creatorId === user.id) {
        throw new Error(ERRORS.CANNOT_BUY_OWN_RESOURCE);
      }

      /* ===== Resolve Payment ===== */

      const method = resolvePaymentMethod(
        resource.paymentType,
        paymentMethod,
      );

      const coinsToCharge = (() => {
        if (method === "COINS") {
          return validateCoinPrice(resource.priceCoins);
        }

        const moneyPrice = validateMoneyPrice(resource.priceMoney);

        // Paid money flows are not implemented yet. Free money-priced items are allowed.
        if (moneyPrice > 0) {
          throw new Error(ERRORS.MONEY_NOT_IMPLEMENTED);
        }

        return 0;
      })();

      /* ===== Ownership Check ===== */

      const existing = await tx.purchase.findFirst({
        where: {
          userId: user.id,
          resourceId: resource.id,
          archivedAt: null,
        },
      });

      if (existing) {
        throw new Error(ERRORS.ALREADY_PURCHASED);
      }

      /* ===== Deduct Coins Atomically ===== */

      if (coinsToCharge > 0) {
        const updated = await tx.user.updateMany({
          where: { id: user.id, coinBalance: { gte: coinsToCharge } },
          data: { coinBalance: { decrement: coinsToCharge } },
        });

        if (updated.count !== 1) {
          const userExists = await tx.user.findUnique({
            where: { id: user.id },
            select: { id: true },
          });

          if (!userExists) {
            throw new Error(ERRORS.USER_NOT_FOUND);
          }

          throw new Error(ERRORS.INSUFFICIENT_COINS);
        }
      }

      /* ===== Create Purchase ===== */

      await tx.purchase.create({
        data: {
          userId: user.id,
          resourceId: resource.id,
          paymentType: method,
          coinsSpent: method === "COINS" ? coinsToCharge : null,
          moneySpent:
            method === "MONEY" ? validateMoneyPrice(resource.priceMoney) : null,
        },
      });

      /* ===== Future Hooks ===== */
      // await tx.walletLedger.create(...)
      // await tx.analyticsEvent.create(...)
      // await tx.notification.create(...)
    });
  } catch (error) {
    console.error("purchaseResource failed", {
      userId: user.id,
      resourceId,
      error,
    });

    if (error instanceof Error) {
      switch (error.message) {
        case ERRORS.RESOURCE_NOT_AVAILABLE:
          return { status: "error", message: "Resource not available." };
        case ERRORS.ALREADY_PURCHASED:
          return { status: "error", message: "Already purchased." };
        case ERRORS.PAYMENT_METHOD_REQUIRED:
          return { status: "error", message: "Choose a payment method." };
        case ERRORS.INVALID_PAYMENT_METHOD:
          return { status: "error", message: "Invalid payment method." };
        case ERRORS.MONEY_NOT_IMPLEMENTED:
          return { status: "error", message: "Money payments coming soon." };
        case ERRORS.INSUFFICIENT_COINS:
          return { status: "error", message: "Not enough coins." };
        case ERRORS.USER_NOT_FOUND:
          return { status: "error", message: "User account not found." };
        case ERRORS.CANNOT_BUY_OWN_RESOURCE:
          return { status: "error", message: "You own this resource." };
        case ERRORS.INVALID_PRICE:
        case ERRORS.PRICE_NOT_DEFINED:
          return { status: "error", message: "Invalid resource price." };
      }
    }

    return { status: "error", message: "Purchase failed." };
  }

  return {
    status: "success",
    message: "Purchase completed successfully.",
  };
}
