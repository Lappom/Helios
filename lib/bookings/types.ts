import type { BookingRemindersSent } from "@/lib/db/schema/bookings";

export type AvailabilityRuleDto = {
  id: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  slotDurationMinutes: number;
  serviceTypes: Array<"assessment" | "coaching" | "call">;
};

export type BlockedDateDto = {
  id: string;
  date: string;
  reason: string | null;
};

export type BookingSlotDto = {
  startAt: string;
  endAt: string;
  available: boolean;
};

export type BookingListItem = {
  id: string;
  coachClerkUserId: string;
  serviceId: string;
  serviceName: string;
  clientId: string | null;
  clientName: string | null;
  prospectEmail: string | null;
  prospectName: string | null;
  startAt: string;
  endAt: string;
  timezone: string;
  status: string;
  paymentStatus: string;
  notes: string | null;
  remindersSent: BookingRemindersSent;
};

export type BookingDetail = BookingListItem & {
  cancellationReason: string | null;
  serviceDurationMinutes: number;
  servicePriceCents: number;
  serviceCurrency: string;
};
