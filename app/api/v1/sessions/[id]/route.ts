import { withApiHandler, jsonOk } from "@/lib/api/handler";
import { requireClient } from "@/lib/api/require-client";
import { getProgramSessionIdFromPath } from "@/lib/api/session-route";
import { problem } from "@/lib/api/response";
import { getSessionExecutionDetail } from "@/lib/sessions/service";

export const GET = withApiHandler({ requireOrg: true }, async ({ request }) => {
  const client = await requireClient();
  const programSessionId = getProgramSessionIdFromPath(request);
  const scheduledDate = new URL(request.url).searchParams.get("scheduledDate");

  if (!programSessionId) {
    throw problem({
      type: "validation-error",
      title: "Invalid session id",
      status: 400,
      detail: "Program session id is required.",
    });
  }

  if (!scheduledDate) {
    throw problem({
      type: "validation-error",
      title: "Missing scheduledDate",
      status: 400,
      detail: "Query parameter scheduledDate (YYYY-MM-DD) is required.",
    });
  }

  const detail = await getSessionExecutionDetail(
    client.organizationId,
    client.clientId,
    programSessionId,
    scheduledDate,
  );

  return jsonOk(detail);
});
