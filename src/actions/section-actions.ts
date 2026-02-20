"use server"
import { prisma } from "@/lib/prisma";

function slugify(input: string) {
  return input
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}


export async function createSection(name: string) {
  if (!name || name.trim() === "") {
    throw new Error("Section name cannot be empty");
  }

  const trimmed = name.trim();

  // create section in DB
  const section = await prisma.sectionTag.create({
    data: {
      name: trimmed,
      slug: slugify(trimmed), // simple slug, e.g., "Web Design" -> "web-design"
    },
  });

  return section; // { id, name, slug }
}
