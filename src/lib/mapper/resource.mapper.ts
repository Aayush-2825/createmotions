import { z } from "zod";

const ResourceFormSchema = z.object({
  title: z.string().min(1, "Title is required"),
  type: z.enum(["PROJECT_FILE", "RESOURCE", "INSPIRATION"]),
  sections: z.array(z.string()).default([]),
  description: z.string().default(""),
  thumbnail: z
    .string()
    .url()
    .optional()
    .or(z.literal(""))
    .transform((val) => (val ? val : undefined)),
  fileUrl: z.string().url("File URL is required"),
  videoUrl: z
    .string()
    .url()
    .optional()
    .or(z.literal(""))
    .transform((val) => (val ? val : undefined)),
  paymentType: z.enum(["COINS", "MONEY", "BOTH"]),
  priceMoney: z.number().nonnegative(),
  priceCoins: z.number().int().nonnegative(),
  isActive: z.boolean().default(true),
});


function parseJsonArray(value: FormDataEntryValue | null): string[] {
  if (!value) return [];
  try {
    const parsed = JSON.parse(value.toString());
    if (Array.isArray(parsed)) return parsed.map(String);
    return [];
  } catch {
    return [];
  }
}

export function mapFormDataToResource(data: FormData) {
  return ResourceFormSchema.parse({
    title: String(data.get("title") ?? ""),
    type: String(data.get("type")), // PROJECT_FILE | RESOURCE | INSPIRATION
    sections: parseJsonArray(data.get("sections")), // new array of section IDs
    description: String(data.get("description") ?? ""),
    thumbnail: data.get("thumbnail")?.toString().trim(),
    fileUrl: String(data.get("fileUrl") ?? ""),
    videoUrl: data.get("videoUrl")?.toString().trim(),
    paymentType: String(data.get("paymentType")), // COINS | MONEY | BOTH
    priceMoney: Number(data.get("priceMoney") ?? 0),
    priceCoins: Number(data.get("priceCoins") ?? 0),
    isActive: data.get("isActive") === "true",
  });
}
