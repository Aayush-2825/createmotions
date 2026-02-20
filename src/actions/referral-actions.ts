"use server";

import { z } from "zod";

import { getCurrentUser } from "@/lib/getUser";
import { prisma } from "@/lib/prisma";

export type ReferralFormState = {
  status: "idle" | "success" | "error";
  message: string;
};

const referralSchema = z.object({
  code: z
    .string()
    .trim()
    .min(6, { message: "Code is too short" })
    .max(32, { message: "Code is too long" })
    .regex(/^[A-Z0-9-]+$/i, { message: "Use letters and numbers only" })
    .transform((value) => value.toUpperCase()),
});

export async function submitReferralCode(
  _prevState: ReferralFormState,
  formData: FormData
): Promise<ReferralFormState> {
  const parsed = referralSchema.safeParse({ code: formData.get("code") });

  if (!parsed.success) {
    return { status: "error", message: "Enter a valid referral code." };
  }

  const code = parsed.data.code;

  const user = await getCurrentUser();
  if (!user) {
    return { status: "error", message: "Please sign in first." };
  }

  if (user.referredById) {
    return {
      status: "error",
      message: "You have already applied a referral code.",
    };
  }

  try {
    await prisma.$transaction(async (tx) => {
      const referrer = await tx.user.findUnique({
        where: { referralCode: code },
      });

      if (!referrer) throw new Error("INVALID_CODE");
      if (referrer.id === user.id) throw new Error("SELF_REFERRAL");

      const existingReferral = await tx.referral.findUnique({
        where: { referredUserId: user.id },
      });

      if (existingReferral) throw new Error("ALREADY_REFERRED");

      // create referral link
      await tx.referral.create({
        data: {
          referrerId: referrer.id,
          referredUserId: user.id,
        },
      });

      // update referred user
      await tx.user.update({
        where: { id: user.id },
        data: {
          referredById: referrer.id,
          coinBalance: { increment: 50 },
        },
      });

      // reward referrer
      await tx.user.update({
        where: { id: referrer.id },
        data: {
          coinBalance: { increment: 100 },
        },
      });

      // ledger logs
      await tx.coinTransaction.createMany({
        data: [
          {
            userId: referrer.id,
            amount: 100,
            type: "CREDIT",
            source: "REFERRAL_REWARD",
            referenceId: user.id,
          },
          {
            userId: user.id,
            amount: 50,
            type: "CREDIT",
            source: "REFERRAL_BONUS",
            referenceId: referrer.id,
          },
        ],
      });
    });

    return {
      status: "success",
      message: "Referral applied. Coins added successfully 🎉",
    };
    //eslint-disable-next-line @typescript-eslint/no-explicit-any
  } catch (error: any) {
    if (error.message === "INVALID_CODE") {
      return { status: "error", message: "That referral code was not found." };
    }

    if (error.message === "SELF_REFERRAL") {
      return {
        status: "error",
        message: "You cannot use your own referral code.",
      };
    }

    if (error.message === "ALREADY_REFERRED") {
      return {
        status: "error",
        message: "A referral was already recorded for this account.",
      };
    }

    console.error("Failed to apply referral", error);

    return {
      status: "error",
      message: "Could not apply referral code. Please try again.",
    };
  }
}
