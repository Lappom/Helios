import { withApiHandler, jsonOk } from "@/lib/api/handler";
import { requireClient } from "@/lib/api/require-client";
import { getProgramSessionIdFromPath } from "@/lib/api/session-route";
import { problem } from "@/lib/api/response";
import { logSet } from "@/lib/sessions/service";
import { parseJsonBody } from "@/lib/validators/clients";
import { logSetSchema } from "@/lib/validators/sessions";

export const POST = withApiHandler({ requireOrg: true }, async ({ request }) => {
  const client = await requireClient();
  const programSessionId = getProgramSessionIdFromPath(request);

  if (!programSessionId) {
    throw problem({
      type: "validation-error",
      title: "Invalid session id",
      status: 400,
      detail: "Program session id is required.",
    });
  }

  const body = await parseJsonBody(logSetSchema, request);
  const detail = await logSet(
    client.organizationId,
    client.clientId,
    programSessionId,
    body,
  );

  return jsonOk(detail);
});
