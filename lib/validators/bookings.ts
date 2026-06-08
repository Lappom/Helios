import { z } from "zod";
import type { PaginationParams } from "@/lib/api/pagination";

export const BOOKING_STATUSES = [
  "pending",
  "confirmed",
  "cancelled",
  "completed",
  "no_show",
] as const;

export const PAYMENT_STATUSES = ["unpaid", "paid", "external"] as const;

export const SERVICE_TYPES = ["assessment", "coaching", "call"] as const;

export const SLOT_DURATIONS = [30, 45, 60] as const;

export const bookingStatusSchema = z.enum(BOOKING_STATUSES);
export const paymentStatusSchema = z.enum(PAYMENT_STATUSES);
export const serviceTypeSchema = z.enum(SERVICE_TYPES);

const timePattern = /^([01]\d|2[0-3]):[0-5]\d$/;

export const availabilityRuleSchema = z.object({
  dayOfWeek: z.number().int().min(0).max(6),
  startTime: z.string().regex(timePattern, "Invalid time format (HH:mm)"),
  endTime: z.string().regex(timePattern, "Invalid time format (HH:mm)"),
  slotDurationMinutes: z.union([
    z.literal(30),
    z.literal(45),
    z.literal(60),
  ]),
  serviceTypes: z.array(serviceTypeSchema).min(1),
});

export const putAvailabilitySchema = z.object({
  rules: z.array(availabilityRuleSchema),
});

export const createBlockedDateSchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Invalid date (YYYY-MM-DD)"),
  reason: z.string().trim().max(500).optional(),
});

export const listBookingsQuerySchema = z.object({
  from: z.string().optional(),
  to: z.string().optional(),
  status: bookingStatusSchema.optional(),
  page: z.number().int().min(1).default(1),
  limit: z.number().int().min(1).max(100).default(50),
  offset: z.number().int().min(0).default(0),
});

export const listSlotsQuerySchema = z.object({
  serviceId: z.string().min(1),
  from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  to: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
});

export const createBookingSchema = z.object({
  serviceId: z.string().min(1),
  startAt: z.string().datetime({ offset: true }),
  prospectEmail: z.string().trim().email().max(320).optional(),
  prospectName: z.string().trim().min(1).max(200).optional(),
  notes: z.string().trim().max(2000).optional(),
});

export const cancelBookingSchema = z.object({
  reason: z.string().trim().max(500).optional(),
});

export const patchBookingStatusSchema = z.object({
  status: z.enum(["completed", "no_show", "confirmed"]),
  paymentStatus: paymentStatusSchema.optional(),
});

export type AvailabilityRuleInput = z.infer<typeof availabilityRuleSchema>;
export type PutAvailabilityInput = z.infer<typeof putAvailabilitySchema>;
export type CreateBlockedDateInput = z.infer<typeof createBlockedDateSchema>;
export type ListBookingsQuery = z.infer<typeof listBookingsQuerySchema>;
export type ListSlotsQuery = z.infer<typeof listSlotsQuerySchema>;
export type CreateBookingInput = z.infer<typeof createBookingSchema>;
export type CancelBookingInput = z.infer<typeof cancelBookingSchema>;
export type PatchBookingStatusInput = z.infer<typeof patchBookingStatusSchema>;

export function parseListBookingsQuery(
  searchParams: URLSearchParams,
  pagination: PaginationParams,
): ListBookingsQuery {
  const statusParam = searchParams.get("status");
  const statusResult = statusParam
    ? bookingStatusSchema.safeParse(statusParam)
    : null;

  return listBookingsQuerySchema.parse({
    from: searchParams.get("from") ?? undefined,
    to: searchParams.get("to") ?? undefined,
    status: statusResult?.success ? statusResult.data : undefined,
    page: pagination.page,
    limit: pagination.limit,
    offset: pagination.offset,
  });
}

export function parseListSlotsQuery(
  searchParams: URLSearchParams,
): ListSlotsQuery {
  const serviceId = searchParams.get("serviceId");
  const from = searchParams.get("from");
  const to = searchParams.get("to");

  return listSlotsQuerySchema.parse({ serviceId, from, to });
}
