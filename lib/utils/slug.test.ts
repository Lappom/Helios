import { describe, expect, it } from "vitest";
import { isReservedSlug, slugifyName } from "@/lib/utils/slug";

describe("slug utils", () => {
  it("slugifies display names", () => {
    expect(slugifyName("Marie Dupont")).toBe("marie-dupont");
    expect(slugifyName("Élodie Müller")).toBe("elodie-muller");
  });

  it("detects reserved slugs", () => {
    expect(isReservedSlug("admin")).toBe(true);
    expect(isReservedSlug("marie-dupont")).toBe(false);
  });
});
