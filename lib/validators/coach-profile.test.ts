import { describe, expect, it } from "vitest";
import {
  coachProfileSlugSchema,
  createCoachServiceSchema,
  parseListPublicCoachesQuery,
  patchCoachProfileSchema,
} from "./coach-profile";

describe("coach-profile validators", () => {
  it("accepts valid slug", () => {
    const result = coachProfileSlugSchema.safeParse("marie-dupont");
    expect(result.success).toBe(true);
  });

  it("rejects reserved slug", () => {
    const result = coachProfileSlugSchema.safeParse("admin");
    expect(result.success).toBe(false);
  });

  it("rejects invalid slug characters", () => {
    const result = coachProfileSlugSchema.safeParse("Marie Dupont");
    expect(result.success).toBe(false);
  });

  it("requires at least one field in patch schema", () => {
    const result = patchCoachProfileSchema.safeParse({});
    expect(result.success).toBe(false);
  });

  it("accepts partial profile patch", () => {
    const result = patchCoachProfileSchema.safeParse({
      displayName: "Marie Dupont",
      isPublished: true,
    });
    expect(result.success).toBe(true);
  });

  it("parses public coaches list query", () => {
    const params = new URLSearchParams(
      "page=2&limit=10&search=marie&specialty=Musculation&location=Paris",
    );
    const query = parseListPublicCoachesQuery(params);
    expect(query.page).toBe(2);
    expect(query.limit).toBe(10);
    expect(query.search).toBe("marie");
    expect(query.specialty).toBe("Musculation");
    expect(query.location).toBe("Paris");
    expect(query.offset).toBe(10);
  });

  it("accepts valid service creation", () => {
    const result = createCoachServiceSchema.safeParse({
      name: "Séance découverte",
      durationMinutes: 60,
      priceCents: 5000,
    });
    expect(result.success).toBe(true);
  });
});
