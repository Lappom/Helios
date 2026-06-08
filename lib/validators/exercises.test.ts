import { describe, expect, it } from "vitest";
import { buildExerciseSearchVector } from "@/lib/exercises/types";
import {
  createExerciseSchema,
  createCategorySchema,
  parseListExercisesQuery,
} from "@/lib/validators/exercises";

describe("exercise validators", () => {
  it("validates create exercise payload", () => {
    const result = createExerciseSchema.parse({
      name: "Goblet Squat",
      muscleGroups: ["quadriceps", "glutes"],
      equipment: ["kettlebell"],
      type: "strength",
    });

    expect(result.type).toBe("strength");
  });

  it("parses list query filters", () => {
    const params = new URLSearchParams({
      search: "squat",
      muscle: "quadriceps",
      equipment: "barbell",
      type: "strength",
      source: "system",
      favorite: "true",
      page: "2",
      limit: "24",
    });

    const query = parseListExercisesQuery(params, {
      page: 2,
      limit: 24,
      offset: 24,
    });

    expect(query.search).toBe("squat");
    expect(query.muscle).toBe("quadriceps");
    expect(query.favorite).toBe(true);
  });

  it("validates category creation", () => {
    const result = createCategorySchema.parse({ name: "Jambes" });
    expect(result.name).toBe("Jambes");
  });
});

describe("exercise search vector", () => {
  it("builds lowercase searchable text", () => {
    const vector = buildExerciseSearchVector(
      "Back Squat",
      ["quadriceps", "glutes"],
      ["barbell"],
    );

    expect(vector).toContain("back squat");
    expect(vector).toContain("barbell");
  });
});

describe("exercise business rules", () => {
  it("blocks deleting system exercises", async () => {
    const { assertNotSystemDelete } = await import("@/lib/exercises/rules");
    expect(() => assertNotSystemDelete("system")).toThrow();
    expect(() => assertNotSystemDelete("custom")).not.toThrow();
  });
});
