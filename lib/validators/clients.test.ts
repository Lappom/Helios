import { describe, expect, it } from "vitest";
import {
  createClientSchema,
  importClientRowSchema,
  parseCsvClients,
} from "@/lib/validators/clients";

describe("client validators", () => {
  it("validates create client payload", () => {
    const result = createClientSchema.parse({
      email: "marie@example.com",
      firstName: "Marie",
      lastName: "Dupont",
    });

    expect(result.status).toBe("PROSPECT");
  });

  it("parses CSV rows with optional header", () => {
    const csv = `email,firstName,lastName,status
marie@example.com,Marie,Dupont,ACTIVE
paul@example.com,Paul,Martin,PROSPECT`;

    const { rows, errors } = parseCsvClients(csv);

    expect(errors).toHaveLength(0);
    expect(rows).toHaveLength(2);
    expect(rows[0]).toMatchObject({
      email: "marie@example.com",
      status: "ACTIVE",
    });
  });

  it("rejects invalid import row status via schema", () => {
    const result = importClientRowSchema.safeParse({
      email: "bad@example.com",
      firstName: "Bad",
      lastName: "Row",
      status: "INVALID",
    });

    expect(result.success).toBe(false);
  });
});
