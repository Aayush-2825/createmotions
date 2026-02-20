import { prisma } from "@/lib/prisma";

type PaymentTypeView = "COINS" | "MONEY" | "BOTH";

function derivePaymentType(
  priceCoins: number | null,
  priceMoney: number | null,
): PaymentTypeView {
  const hasCoins = (priceCoins ?? 0) > 0;
  const hasMoney = (priceMoney ?? 0) > 0;

  if (hasCoins && hasMoney) return "BOTH";
  if (hasMoney) return "MONEY";
  return "COINS";
}

function sanitizeVideoUrl(videoUrl: string | null): string | null {
  if (!videoUrl) return null;

  let url = videoUrl.trim();

  // Fix accidental extension bug
  if (url.endsWith(".mp4dv")) {
    url = url.replace(".mp4dv", ".mp4");
  }

  // Convert HLS preview to mp4 if needed
  if (url.endsWith(".m3u8")) {
    url = url.replace(".m3u8", ".mp4");
  }

  return url;
}

export async function getResources() {
  try {
    const resources = await prisma.resource.findMany({
      where: { deletedAt: null },
      orderBy: {
        createdAt: "desc",
      },
      select: {
        id: true,
        title: true,
        description: true,
        sections: {
          select: {
            id: true,
            name: true,
            slug: true,
          },
        },
        type: true,
        priceMoney: true,
        priceCoins: true,
        thumbnail: true,
        // fileUrl: true,
        videoUrl: true,
        isActive: true,
        createdAt: true,
      },
    });

    return resources.map((resource) => ({
      ...resource,
      videoUrl: sanitizeVideoUrl(resource.videoUrl),
      paymentType: derivePaymentType(resource.priceCoins, resource.priceMoney),
    }));
  } catch (error) {
    console.error("Error fetching resources:", error);
    return [];
  }
}

export async function getResourceById(userId: string, isAdmin: boolean) {
  if (!isAdmin) {
    try {
      const resourcePurchased = await prisma.purchase.findMany({
        where: { userId, archivedAt: null, resource: { deletedAt: null } },
        select: {
          resource: {
            select: {
              id: true,
              title: true,
              description: true,
              type: true,
              priceMoney: true,
              priceCoins: true,
              thumbnail: true,
              videoUrl: true,
              isActive: true,
              sections: {
                select: { id: true, name: true, slug: true },
              },
            },
          },
        },
      });
      return resourcePurchased.map((p) => ({
        ...p.resource,
        fileUrl: "",
        videoUrl: sanitizeVideoUrl(p.resource.videoUrl),
        paymentType: derivePaymentType(
          p.resource.priceCoins,
          p.resource.priceMoney,
        ),
      }));
    } catch (error) {
      console.error("Error fetching resource by ID:", error);
      return [];
    }
  } else {
    try {
      const resources = await prisma.resource.findMany({
        where: { creatorId: userId, deletedAt: null },
        select: {
          id: true,
          title: true,
          description: true,
          type: true,
          priceMoney: true,
          priceCoins: true,
          thumbnail: true,
          videoUrl: true,
          isActive: true,
          sections: {
            select: { id: true, name: true, slug: true },
          },
        },
      });
      return resources.map((resource) => ({
        ...resource,
        fileUrl: "",
        videoUrl: sanitizeVideoUrl(resource.videoUrl),
        paymentType: derivePaymentType(resource.priceCoins, resource.priceMoney),
      }));
    } catch (error) {
      console.error("Error fetching resource by ID:", error);
      return [];
    }
  }
}
