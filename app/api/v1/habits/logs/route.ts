import { withApiHandler, jsonOk } from "@/lib/api/handler";
import { requireClient } from "@/lib/api/require-client";
import { logHabitCompletion } from "@/lib/habits/service";
import { parseJsonBody } from "@/lib/validators/clients";
import { logHabitSchema } from "@/lib/validators/habits";

export const POST = withApiHandler(
  { requireOrg: true, requireFeature: "habits" },
  async ({ request }) => {
    const client = await requireClient();
    const body = await parseJsonBody(logHabitSchema, request);
    const log = await logHabitCompletion(
      client.organizationId,
      client.clientId,
      body,
    );

    return jsonOk(log);
  },
);
