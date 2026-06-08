import { describe, expect, it } from "vitest";
import { executePathwayStep } from "./actions";
import type { PathwayStepDetail } from "./types";

describe("executePathwayStep", () => {
  it("skips wait steps without side effects", async () => {
    const step: PathwayStepDetail = {
      id: "step_1",
      sortOrder: 0,
      stepType: "wait",
      delayDays: 3,
      stepConfig: {},
    };

    const result = await executePathwayStep(step, {
      organizationId: "org_test",
      clientId: "client_1",
      coachClerkUserId: "coach_1",
      pathwayId: "path_1",
      enrollmentId: "enroll_1",
    });

    expect(result).toEqual({ skipped: true });
  });

  it("rejects invalid program config", async () => {
    const step: PathwayStepDetail = {
      id: "step_1",
      sortOrder: 0,
      stepType: "program",
      delayDays: 0,
      stepConfig: {},
    };

    await expect(
      executePathwayStep(step, {
        organizationId: "org_test",
        clientId: "client_1",
        coachClerkUserId: "coach_1",
        pathwayId: "path_1",
        enrollmentId: "enroll_1",
      }),
    ).rejects.toThrow();
  });
});
