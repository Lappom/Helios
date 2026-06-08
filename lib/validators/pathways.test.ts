import { describe, expect, it } from "vitest";
import {
  createPathwaySchema,
  validateStepConfig,
  validatePathwaySteps,
} from "./pathways";

describe("createPathwaySchema", () => {
  it("accepts a valid pathway payload", () => {
    const result = createPathwaySchema.safeParse({
      name: "Onboarding",
      steps: [
        {
          stepType: "program",
          delayDays: 0,
          stepConfig: { programId: "prog_1" },
        },
        {
          stepType: "wait",
          delayDays: 7,
          stepConfig: {},
        },
      ],
    });
    expect(result.success).toBe(true);
  });

  it("rejects wait steps without delay", () => {
    const result = createPathwaySchema.safeParse({
      name: "Bad wait",
      steps: [
        {
          stepType: "wait",
          delayDays: 0,
          stepConfig: {},
        },
      ],
    });
    expect(result.success).toBe(false);
  });

  it("rejects pathways without steps", () => {
    const result = createPathwaySchema.safeParse({
      name: "Empty",
      steps: [],
    });
    expect(result.success).toBe(false);
  });
});

describe("validateStepConfig", () => {
  it("validates program config", () => {
    expect(() =>
      validateStepConfig("program", { programId: "prog_1" }),
    ).not.toThrow();
  });

  it("validates message config", () => {
    expect(() =>
      validateStepConfig("message", { content: "Hello" }),
    ).not.toThrow();
  });

  it("validates pathway steps batch", () => {
    expect(() =>
      validatePathwaySteps([
        {
          stepType: "assessment",
          delayDays: 0,
          stepConfig: { templateId: "tpl_1" },
        },
      ]),
    ).not.toThrow();
  });
});
