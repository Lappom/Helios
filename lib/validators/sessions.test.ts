import { describe, expect, it } from "vitest";
import {
  completeSessionSchema,
  logSetSchema,
  startSessionSchema,
} from "./sessions";

describe("startSessionSchema", () => {
  it("accepts valid date key", () => {
    const result = startSessionSchema.safeParse({
      scheduledDate: "2026-06-08",
    });
    expect(result.success).toBe(true);
  });

  it("rejects invalid date key", () => {
    const result = startSessionSchema.safeParse({
      scheduledDate: "08-06-2026",
    });
    expect(result.success).toBe(false);
  });
});

describe("logSetSchema", () => {
  it("accepts minimal set payload", () => {
    const result = logSetSchema.safeParse({
      sessionLogId: "log_1",
      blockExerciseId: "be_1",
      setNumber: 1,
      exerciseId: "ex_1",
      reps: "10",
      load: "80kg",
    });
    expect(result.success).toBe(true);
  });

  it("rejects missing exerciseId", () => {
    const result = logSetSchema.safeParse({
      sessionLogId: "log_1",
      blockExerciseId: "be_1",
      setNumber: 1,
    });
    expect(result.success).toBe(false);
  });
});

describe("completeSessionSchema", () => {
  it("requires sessionLogId", () => {
    const result = completeSessionSchema.safeParse({
      sessionLogId: "log_1",
    });
    expect(result.success).toBe(true);
  });
});
