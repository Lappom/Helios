import { z } from "zod";
import { problem } from "@/lib/api/response";

export const CLIENT_STATUSES = [
  "PROSPECT",
  "TRIAL",
  "ACTIVE",
  "PAUSED",
  "CHURNED",
] as const;

export type ClientStatus = (typeof CLIENT_STATUSES)[number];

export const clientStatusSchema = z.enum(CLIENT_STATUSES);

export const createClientSchema = z.object({
  email: z.string().trim().email().max(320),
  firstName: z.string().trim().min(1).max(100),
  lastName: z.string().trim().min(1).max(100),
  status: clientStatusSchema.optional().default("PROSPECT"),
});

export const updateClientStatusSchema = z.object({
  status: clientStatusSchema,
});

export const createClientNoteSchema = z.object({
  body: z.string().trim().min(1).max(5000),
});

export const assignClientTagsSchema = z.object({
  tagNames: z.array(z.string().trim().min(1).max(50)).max(20),
});

export const importClientRowSchema = z.object({
  email: z.string().trim().email().max(320),
  firstName: z.string().trim().min(1).max(100),
  lastName: z.string().trim().min(1).max(100),
  status: clientStatusSchema.optional().default("PROSPECT"),
});

export type CreateClientInput = z.infer<typeof createClientSchema>;
export type UpdateClientStatusInput = z.infer<typeof updateClientStatusSchema>;
export type CreateClientNoteInput = z.infer<typeof createClientNoteSchema>;
export type AssignClientTagsInput = z.infer<typeof assignClientTagsSchema>;
export type ImportClientRow = z.infer<typeof importClientRowSchema>;

export function parseCsvClients(content: string): {
  rows: ImportClientRow[];
  errors: string[];
} {
  const lines = content
    .split(/\r?\n/)
    .map((line) => line.trim())
    .filter(Boolean);

  if (lines.length === 0) {
    return { rows: [], errors: ["CSV file is empty."] };
  }

  const errors: string[] = [];
  const rows: ImportClientRow[] = [];

  const firstCells = splitCsvLine(lines[0]!);
  const hasHeader =
    firstCells[0]?.toLowerCase() === "email" ||
    firstCells.includes("firstName") ||
    firstCells.includes("first_name");

  const dataLines = hasHeader ? lines.slice(1) : lines;

  for (let i = 0; i < dataLines.length; i++) {
    const lineNumber = hasHeader ? i + 2 : i + 1;
    const cells = splitCsvLine(dataLines[i]!);

    if (cells.length < 3) {
      errors.push(`Line ${lineNumber}: expected at least email, firstName, lastName.`);
      continue;
    }

    const [email, firstName, lastName, rawStatus] = cells;
    const parsed = importClientRowSchema.safeParse({
      email,
      firstName,
      lastName,
      status: rawStatus?.trim().toUpperCase() || "PROSPECT",
    });

    if (!parsed.success) {
      errors.push(`Line ${lineNumber}: ${parsed.error.issues[0]?.message ?? "invalid row"}.`);
      continue;
    }

    rows.push(parsed.data);
  }

  return { rows, errors };
}

function splitCsvLine(line: string): string[] {
  return line.split(",").map((cell) => cell.trim().replace(/^"|"$/g, ""));
}

export async function parseJsonBody<T>(
  schema: z.ZodType<T>,
  request: Request,
): Promise<T> {
  let body: unknown;

  try {
    body = await request.json();
  } catch {
    throw problem({
      type: "validation-error",
      title: "Invalid JSON body",
      status: 400,
      detail: "Request body must be valid JSON.",
    });
  }

  const result = schema.safeParse(body);

  if (!result.success) {
    throw problem({
      type: "validation-error",
      title: "Validation failed",
      status: 400,
      detail: result.error.issues.map((i) => i.message).join("; "),
    });
  }

  return result.data;
}
