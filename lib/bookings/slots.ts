import { TZDate } from "@date-fns/tz";
import { addDays, addMinutes, differenceInMinutes, parseISO } from "date-fns";
import type { AvailabilityRuleDto, BookingSlotDto } from "./types";

export type SlotGenerationInput = {
  rules: AvailabilityRuleDto[];
  blockedDates: string[];
  existingBookings: Array<{ startAt: Date; endAt: Date }>;
  serviceType: "assessment" | "coaching" | "call";
  serviceDurationMinutes: number;
  from: string;
  to: string;
  timezone: string;
  now?: Date;
};

function parseTimeToMinutes(time: string): number {
  const [hours, minutes] = time.split(":").map(Number);
  return hours! * 60 + minutes!;
}

function formatDateKey(date: TZDate): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, "0");
  const d = String(date.getDate()).padStart(2, "0");
  return `${y}-${m}-${d}`;
}

function zonedDateTime(
  dateKey: string,
  minutesFromMidnight: number,
  timezone: string,
): TZDate {
  const hours = Math.floor(minutesFromMidnight / 60);
  const minutes = minutesFromMidnight % 60;
  const [year, month, day] = dateKey.split("-").map(Number);
  return new TZDate(year!, month! - 1, day!, hours, minutes, 0, timezone);
}

function rangesOverlap(
  aStart: Date,
  aEnd: Date,
  bStart: Date,
  bEnd: Date,
): boolean {
  return aStart < bEnd && bStart < aEnd;
}

export function generateAvailableSlots(
  input: SlotGenerationInput,
): BookingSlotDto[] {
  const {
    rules,
    blockedDates,
    existingBookings,
    serviceType,
    serviceDurationMinutes,
    from,
    to,
    timezone,
    now = new Date(),
  } = input;

  const blockedSet = new Set(blockedDates);
  const slots: BookingSlotDto[] = [];

  const rangeStart = new TZDate(`${from}T00:00:00`, timezone);
  const rangeEnd = new TZDate(`${to}T23:59:59`, timezone);

  let cursor = rangeStart;
  while (cursor <= rangeEnd) {
    const dateKey = formatDateKey(cursor);
    const dayOfWeek = cursor.getDay();

    if (!blockedSet.has(dateKey)) {
      const dayRules = rules.filter(
        (rule) =>
          rule.dayOfWeek === dayOfWeek &&
          rule.serviceTypes.includes(serviceType),
      );

      for (const rule of dayRules) {
        const windowStart = parseTimeToMinutes(rule.startTime);
        const windowEnd = parseTimeToMinutes(rule.endTime);
        const step = rule.slotDurationMinutes;

        for (
          let slotStart = windowStart;
          slotStart + serviceDurationMinutes <= windowEnd;
          slotStart += step
        ) {
          const start = zonedDateTime(dateKey, slotStart, timezone);
          const end = addMinutes(start, serviceDurationMinutes);

          if (start <= now) {
            continue;
          }

          const overlaps = existingBookings.some((booking) =>
            rangesOverlap(start, end, booking.startAt, booking.endAt),
          );

          if (!overlaps) {
            slots.push({
              startAt: start.toISOString(),
              endAt: end.toISOString(),
              available: true,
            });
          }
        }
      }
    }

    cursor = addDays(cursor, 1);
  }

  return slots.sort(
    (a, b) => parseISO(a.startAt).getTime() - parseISO(b.startAt).getTime(),
  );
}

export function isSlotWithinAvailability(
  rules: AvailabilityRuleDto[],
  blockedDates: string[],
  serviceType: "assessment" | "coaching" | "call",
  serviceDurationMinutes: number,
  startAt: Date,
  timezone: string,
): boolean {
  const startTz = new TZDate(startAt, timezone);
  const dateKey = formatDateKey(startTz);

  if (blockedDates.includes(dateKey)) {
    return false;
  }

  const dayOfWeek = startTz.getDay();
  const startMinutes =
    startTz.getHours() * 60 + startTz.getMinutes();
  const endMinutes = startMinutes + serviceDurationMinutes;

  const matchingRules = rules.filter(
    (rule) =>
      rule.dayOfWeek === dayOfWeek && rule.serviceTypes.includes(serviceType),
  );

  return matchingRules.some((rule) => {
    const windowStart = parseTimeToMinutes(rule.startTime);
    const windowEnd = parseTimeToMinutes(rule.endTime);
    return startMinutes >= windowStart && endMinutes <= windowEnd;
  });
}

export function minutesBetween(start: Date, end: Date): number {
  return differenceInMinutes(end, start);
}
