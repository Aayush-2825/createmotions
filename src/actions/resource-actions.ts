"use server";

import { getCurrentUser } from "@/lib/getUser";
import { mapFormDataToResource } from "@/lib/mapper/resource.mapper";
import { prisma } from "@/lib/prisma";
import { ZodError } from "zod";

export async function createResource(prevState: unknown, formData: FormData) {
  const user = await getCurrentUser();

  if (!user || user.role !== "ADMIN") {
    return { error: "Unauthorized" };
  }

  try {
    const data = mapFormDataToResource(formData);

    const baseSlug = slugify(data.title);
    const slug = await ensureUniqueSlug(baseSlug || "resource");

    const { sections, ...restData } = data;

    await prisma.resource.create({
      data: {
        ...restData,
        slug,
        creator: { connect: { id: user.id } },
        sections: {
          connect: sections.map((sectionId: string) => ({ id: sectionId })),
        },
      },
    });

    return { success: true, message: "Resource created" };
  } catch (error) {
    if (error instanceof ZodError) {
      return { error: error.message ?? "Invalid input" };
    }
    console.log("Error creating resource:", error);
    return { error: "Failed to create resource" };
  }
}

export async function updateResource(resourceId: string, formData: FormData) {
  const user = await getCurrentUser();

  if (!user || user.role !== "ADMIN") {
    return { error: "Unauthorized" } as const;
  }

  try {
    const data = mapFormDataToResource(formData);
    const { sections, ...restData } = data;

    const existing = await prisma.resource.findUnique({
      where: { id: resourceId },
      select: { id: true, creatorId: true, deletedAt: true },
    });

    if (!existing || existing.creatorId !== user.id || existing.deletedAt) {
      return { error: "Resource not found" } as const;
    }

    // Only update sections if provided and non-empty, else leave unchanged
    let updateData: any = { ...restData };
    if (Array.isArray(sections) && sections.length > 0) {
      updateData.sections = {
        set: [],
        connect: sections.map((sectionId: string) => ({ id: sectionId })),
      };
    }

    const updated = await prisma.resource.update({
      where: { id: resourceId },
      data: updateData,
      include: {
        sections: {
          select: { id: true, name: true, slug: true },
        },
      },
    });

    return { success: true, message: "Resource updated", resource: updated } as const;
  } catch (error) {
    if (error instanceof ZodError) {
      return { error: error.message ?? "Invalid input" } as const;
    }
    console.log("Error updating resource:", error);
    return { error: "Failed to update resource" } as const;
  }
}

export async function deleteResource(resourceId: string) {
  const user = await getCurrentUser();

  if (!user || user.role !== "ADMIN") {
    return { error: "Unauthorized" } as const;
  }

  try {
    const resource = await prisma.resource.findUnique({
      where: { id: resourceId },
      select: { id: true, creatorId: true, deletedAt: true },
    });

    if (!resource || resource.creatorId !== user.id || resource.deletedAt) {
      return { error: "Resource not found" } as const;
    }

    await prisma.$transaction([
      prisma.purchase.updateMany({
        where: { resourceId, archivedAt: null },
        data: { archivedAt: new Date() },
      }),
      prisma.resource.update({
        where: { id: resourceId },
        data: { deletedAt: new Date(), isActive: false },
      }),
    ]);

    return { success: true, message: "Resource deleted" } as const;
  } catch (error) {
    console.log("Error deleting resource:", error);
    return { error: "Failed to delete resource" } as const;
  }
}

function slugify(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function ensureUniqueSlug(base: string) {
  let candidate = base;
  let suffix = 1;

  // Loop until we find a free slug; small scale so acceptable
  while (true) {
    const existing = await prisma.resource.findUnique({
      where: { slug: candidate },
    });
    if (!existing) return candidate;

    candidate = `${base}-${suffix++}`;
  }
}

// Video uploads handled client-side to avoid request size limits
