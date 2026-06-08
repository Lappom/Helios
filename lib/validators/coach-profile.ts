import { z } from "zod";
import { parsePagination } from "@/lib/api/pagination";
import { isReservedSlug } from "@/lib/utils/slug";

export const COACH_SERVICE_TYPES = ["assessment", "coaching", "call"] as const;
export type CoachServiceType = (typeof COACH_SERVICE_TYPES)[number];
export const coachServiceTypeSchema = z.enum(COACH_SERVICE_TYPES);

export const DIRECTORY_SPECIALTIES = [
  "Musculation",
  "Perte de poids",
  "Running",
  "Yoga",
  "CrossFit",
  "Rééducation",
] as const;

export const coachProfileSlugSchema = z
  .string()
  .trim()
  .min(3)
  .max(60)
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, {
    message:
      "Slug must contain only lowercase letters, numbers, and hyphens.",
  })
  .refine((slug) => !isReservedSlug(slug), {
    message: "This slug is reserved.",
  });

export const socialLinksSchema = z.object({
  instagram: z.string().trim().url().optional().or(z.literal("")),
  website: z.string().trim().url().optional().or(z.literal("")),
  youtube: z.string().trim().url().optional().or(z.literal("")),
});

export const patchCoachProfileSchema = z
  .object({
    slug: coachProfileSlugSchema.optional(),
    displayName: z.string().trim().min(1).max(120).optional(),
    bio: z.string().trim().max(5000).nullable().optional(),
    photoUrl: z.string().trim().url().nullable().optional(),
    certifications: z.array(z.string().trim().min(1).max(200)).max(20).optional(),
    specialties: z.array(z.string().trim().min(1).max(100)).max(20).optional(),
    languages: z.array(z.string().trim().min(1).max(50)).max(10).optional(),
    location: z.string().trim().max(200).nullable().optional(),
    socialLinks: socialLinksSchema.optional(),
    isPublished: z.boolean().optional(),
    isInDirectory: z.boolean().optional(),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one field is required.",
  });

export type PatchCoachProfileInput = z.infer<typeof patchCoachProfileSchema>;

export const createCoachServiceSchema = z.object({
  name: z.string().trim().min(1).max(200),
  description: z.string().trim().max(2000).optional(),
  durationMinutes: z.number().int().min(15).max(480),
  priceCents: z.number().int().min(0).max(1_000_000),
  currency: z.string().trim().length(3).default("EUR"),
  type: coachServiceTypeSchema.default("coaching"),
  isOnline: z.boolean().default(false),
  bookingEnabled: z.boolean().default(false),
  paymentInstructions: z.string().trim().max(1000).optional(),
  sortOrder: z.number().int().min(0).max(999).optional(),
});

export type CreateCoachServiceInput = z.infer<typeof createCoachServiceSchema>;

export const patchCoachServiceSchema = z
  .object({
    name: z.string().trim().min(1).max(200).optional(),
    description: z.string().trim().max(2000).nullable().optional(),
    durationMinutes: z.number().int().min(15).max(480).optional(),
    priceCents: z.number().int().min(0).max(1_000_000).optional(),
    currency: z.string().trim().length(3).optional(),
    type: coachServiceTypeSchema.optional(),
    isOnline: z.boolean().optional(),
    bookingEnabled: z.boolean().optional(),
    paymentInstructions: z.string().trim().max(1000).nullable().optional(),
    sortOrder: z.number().int().min(0).max(999).optional(),
  })
  .refine((value) => Object.keys(value).length > 0, {
    message: "At least one field is required.",
  });

export type PatchCoachServiceInput = z.infer<typeof patchCoachServiceSchema>;

export type ListPublicCoachesQuery = {
  search?: string;
  specialty?: string;
  location?: string;
  language?: string;
  page: number;
  limit: number;
  offset: number;
};

export function parseListPublicCoachesQuery(
  searchParams: URLSearchParams,
): ListPublicCoachesQuery {
  const pagination = parsePagination(searchParams);
  const search = searchParams.get("search")?.trim() || undefined;
  const specialty = searchParams.get("specialty")?.trim() || undefined;
  const location = searchParams.get("location")?.trim() || undefined;
  const language = searchParams.get("language")?.trim() || undefined;

  return {
    search,
    specialty,
    location,
    language,
    page: pagination.page,
    limit: pagination.limit,
    offset: pagination.offset,
  };
}

export function formatPriceCents(priceCents: number, currency = "EUR"): string {
  return new Intl.NumberFormat("fr-FR", {
    style: "currency",
    currency,
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(priceCents / 100);
}
