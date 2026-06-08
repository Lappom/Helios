import { describe, expect, it } from "vitest";
import { resolvePathwayTriggerEventId } from "./dispatcher";

describe("resolvePathwayTriggerEventId", () => {
  it("builds a stable id from client.created", () => {
    expect(resolvePathwayTriggerEventId("client_abc")).toBe(
      "client.created:client_abc",
    );
  });
});
