import { describe, expect, it } from "vitest";
import {
  buildAssignmentSchedule,
  computeSessionDate,
  filterScheduleByRange,
  startOfWeekMonday,
} from "./schedule";

describe("startOfWeekMonday", () => {
  it("returns Monday for a Wednesday", () => {
    const wed = new Date("2026-06-10T12:00:00");
    const monday = startOfWeekMonday(wed);
    expect(monday.getDay()).toBe(1);
    expect(monday.getDate()).toBe(8);
  });
});

describe("computeSessionDate", () => {
  it("places session on correct dayOfWeek in week 0", () => {
    const startDate = new Date("2026-06-10T00:00:00");
    const date = computeSessionDate(startDate, 0, 0, 2);
    expect(date.getDay()).toBe(3);
    expect(date.getDate()).toBe(10);
  });

  it("offsets by week sort order", () => {
    const startDate = new Date("2026-06-10T00:00:00");
    const date = computeSessionDate(startDate, 1, 0, 0);
    expect(date.getDate()).toBe(15);
  });

  it("falls back to session sort order when dayOfWeek is null", () => {
    const startDate = new Date("2026-06-10T00:00:00");
    const date = computeSessionDate(startDate, 0, 2, null);
    expect(date.getDate()).toBe(10);
  });
});

describe("buildAssignmentSchedule", () => {
  const startDate = new Date("2026-06-10T00:00:00");

  it("applies overrides over computed dates", () => {
    const overrideDate = new Date("2026-06-20T00:00:00");
    const schedule = buildAssignmentSchedule(
      startDate,
      [
        {
          programSessionId: "s1",
          name: "Push",
          weekLabel: "Semaine 1",
          weekSortOrder: 0,
          sessionSortOrder: 0,
          dayOfWeek: 0,
        },
      ],
      [{ programSessionId: "s1", scheduledDate: overrideDate }],
    );

    expect(schedule[0]?.scheduledDate.getTime()).toBe(overrideDate.getTime());
    expect(schedule[0]?.hasOverride).toBe(true);
  });

  it("sorts sessions chronologically", () => {
    const schedule = buildAssignmentSchedule(startDate, [
      {
        programSessionId: "s2",
        name: "Legs",
        weekLabel: "Semaine 1",
        weekSortOrder: 0,
        sessionSortOrder: 1,
        dayOfWeek: 4,
      },
      {
        programSessionId: "s1",
        name: "Push",
        weekLabel: "Semaine 1",
        weekSortOrder: 0,
        sessionSortOrder: 0,
        dayOfWeek: 0,
      },
    ]);

    expect(schedule[0]?.programSessionId).toBe("s1");
    expect(schedule[1]?.programSessionId).toBe("s2");
  });
});

describe("filterScheduleByRange", () => {
  it("keeps only sessions inside the range", () => {
    const schedule = buildAssignmentSchedule(new Date("2026-06-10T00:00:00"), [
      {
        programSessionId: "s1",
        name: "Push",
        weekLabel: "Semaine 1",
        weekSortOrder: 0,
        sessionSortOrder: 0,
        dayOfWeek: 0,
      },
      {
        programSessionId: "s2",
        name: "Legs",
        weekLabel: "Semaine 1",
        weekSortOrder: 0,
        sessionSortOrder: 1,
        dayOfWeek: 4,
      },
    ]);

    const filtered = filterScheduleByRange(
      schedule,
      new Date("2026-06-08T00:00:00"),
      new Date("2026-06-09T23:59:59"),
    );

    expect(filtered).toHaveLength(1);
    expect(filtered[0]?.programSessionId).toBe("s1");
  });
});
