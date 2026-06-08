import { describe, expect, it } from "vitest";
import { programDraftSchema } from "./program-draft";

describe("programDraftSchema", () => {
  it("accepts a minimal valid draft", () => {
    const result = programDraftSchema.safeParse({
      name: "PPL Force",
      description: "Programme 3 jours",
      weeks: [
        {
          label: "Semaine 1",
          sessions: [
            {
              name: "Push",
              dayOfWeek: 1,
              blocks: [
                {
                  type: "single",
                  exercises: [
                    {
                      exerciseQuery: "Développé couché",
                      prescriptions: [
                        { setNumber: 1, reps: "8", restSeconds: 120 },
                      ],
                    },
                  ],
                },
              ],
            },
          ],
        },
      ],
    });

    expect(result.success).toBe(true);
  });

  it("rejects drafts without weeks", () => {
    const result = programDraftSchema.safeParse({
      name: "Vide",
      weeks: [],
    });

    expect(result.success).toBe(false);
  });
});
