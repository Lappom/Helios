import { describe, expect, it } from "vitest";
import { generateAvailableSlots, isSlotWithinAvailability } from "./slots";
import type { AvailabilityRuleDto } from "./types";

const parisRules: AvailabilityRuleDto[] = [
  {
    id: "rule-1",
    dayOfWeek: 1,
    startTime: "17:00",
    endTime: "18:30",
    slotDurationMinutes: 30,
    serviceTypes: ["coaching"],
  },
  {
    id: "rule-2",
    dayOfWeek: 2,
    startTime: "17:00",
    endTime: "18:30",
    slotDurationMinutes: 30,
    serviceTypes: ["coaching"],
  },
  {
    id: "rule-3",
    dayOfWeek: 3,
    startTime: "17:00",
    endTime: "18:30",
    slotDurationMinutes: 30,
    serviceTypes: ["coaching"],
  },
  {
    id: "rule-4",
    dayOfWeek: 4,
    startTime: "17:00",
    endTime: "18:30",
    slotDurationMinutes: 30,
    serviceTypes: ["coaching"],
  },
  {
    id: "rule-5",
    dayOfWeek: 5,
    startTime: "17:00",
    endTime: "18:30",
    slotDurationMinutes: 30,
    serviceTypes: ["coaching"],
  },
];

describe("generateAvailableSlots", () => {
  it("returns 17:00-18:00 and 17:30-18:30 slots for a 60-min service on Monday", () => {
    const slots = generateAvailableSlots({
      rules: parisRules,
      blockedDates: [],
      existingBookings: [],
      serviceType: "coaching",
      serviceDurationMinutes: 60,
      from: "2026-06-08",
      to: "2026-06-08",
      timezone: "Europe/Paris",
      now: new Date("2026-06-01T12:00:00Z"),
    });

    expect(slots).toHaveLength(2);
    expect(slots[0]?.startAt).toContain("T17:00:00");
    expect(slots[1]?.startAt).toContain("T17:30:00");
  });

  it("excludes blocked dates", () => {
    const slots = generateAvailableSlots({
      rules: parisRules,
      blockedDates: ["2026-06-08"],
      existingBookings: [],
      serviceType: "coaching",
      serviceDurationMinutes: 60,
      from: "2026-06-08",
      to: "2026-06-08",
      timezone: "Europe/Paris",
      now: new Date("2026-06-01T12:00:00Z"),
    });

    expect(slots).toHaveLength(0);
  });

  it("excludes overlapping existing bookings", () => {
    const slots = generateAvailableSlots({
      rules: parisRules,
      blockedDates: [],
      existingBookings: [
        {
          startAt: new Date("2026-06-08T15:00:00.000Z"),
          endAt: new Date("2026-06-08T15:30:00.000Z"),
        },
      ],
      serviceType: "coaching",
      serviceDurationMinutes: 30,
      from: "2026-06-08",
      to: "2026-06-08",
      timezone: "Europe/Paris",
      now: new Date("2026-06-01T12:00:00Z"),
    });

    expect(slots.some((slot) => slot.startAt.includes("T17:00:00"))).toBe(
      false,
    );
    expect(slots.length).toBeGreaterThan(0);
  });

  it("filters past slots", () => {
    const slots = generateAvailableSlots({
      rules: parisRules,
      blockedDates: [],
      existingBookings: [],
      serviceType: "coaching",
      serviceDurationMinutes: 60,
      from: "2026-06-08",
      to: "2026-06-08",
      timezone: "Europe/Paris",
      now: new Date("2026-06-08T16:00:00Z"),
    });

    expect(slots).toHaveLength(0);
  });
});

describe("isSlotWithinAvailability", () => {
  it("accepts a slot inside the availability window", () => {
    const valid = isSlotWithinAvailability(
      parisRules,
      [],
      "coaching",
      60,
      new Date("2026-06-08T17:00:00.000+02:00"),
      "Europe/Paris",
    );

    expect(valid).toBe(true);
  });

  it("rejects a slot outside the window", () => {
    const valid = isSlotWithinAvailability(
      parisRules,
      [],
      "coaching",
      60,
      new Date("2026-06-08T14:00:00.000+02:00"),
      "Europe/Paris",
    );

    expect(valid).toBe(false);
  });
});
