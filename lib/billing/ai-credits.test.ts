import { describe, expect, it } from "vitest";
import { AI_CREDIT_COSTS } from "./ai-credits";

describe("ai-credits", () => {
  it("defines expected credit costs", () => {
    expect(AI_CREDIT_COSTS.chat).toBe(1);
    expect(AI_CREDIT_COSTS.generateProgram).toBe(5);
  });
});
