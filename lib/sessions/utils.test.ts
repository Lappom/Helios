import { describe, expect, it } from "vitest";
import {
  computeSetVolume,
  parseLoadValue,
  parseRepsValue,
} from "./utils";

describe("parseLoadValue", () => {
  it("parses numeric load with unit", () => {
    expect(parseLoadValue("80kg")).toBe(80);
    expect(parseLoadValue("72.5 kg")).toBe(72.5);
  });

  it("returns null for non-numeric load", () => {
    expect(parseLoadValue("bodyweight")).toBeNull();
  });
});

describe("parseRepsValue", () => {
  it("parses reps from string", () => {
    expect(parseRepsValue("10-12")).toBe(10);
    expect(parseRepsValue("8")).toBe(8);
  });
});

describe("computeSetVolume", () => {
  it("multiplies load and reps when both parseable", () => {
    expect(computeSetVolume("80kg", "10")).toBe(800);
  });

  it("falls back to reps only", () => {
    expect(computeSetVolume("bodyweight", "15")).toBe(15);
  });
});
