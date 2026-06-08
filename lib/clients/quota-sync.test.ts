import { describe, expect, it } from "vitest";
import {
  countsTowardQuota,
  quotaDelta,
  QUOTA_STATUSES,
} from "./quota-rules";

describe("quota-rules", () => {
  it("counts ACTIVE and TRIAL toward quota", () => {
    expect(QUOTA_STATUSES).toEqual(["ACTIVE", "TRIAL"]);
    expect(countsTowardQuota("ACTIVE")).toBe(true);
    expect(countsTowardQuota("TRIAL")).toBe(true);
    expect(countsTowardQuota("PROSPECT")).toBe(false);
    expect(countsTowardQuota("PAUSED")).toBe(false);
    expect(countsTowardQuota("CHURNED")).toBe(false);
  });

  it("computes quota delta for status transitions", () => {
    expect(quotaDelta("PROSPECT", "ACTIVE")).toBe(1);
    expect(quotaDelta("ACTIVE", "PAUSED")).toBe(-1);
    expect(quotaDelta("TRIAL", "ACTIVE")).toBe(0);
    expect(quotaDelta("PROSPECT", "CHURNED")).toBe(0);
    expect(quotaDelta("ACTIVE", "CHURNED")).toBe(-1);
  });
});
