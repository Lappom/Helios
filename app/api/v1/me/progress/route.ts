import { withApiHandler, jsonOk } from "@/lib/api/handler";
import { requireClient } from "@/lib/api/require-client";
import { getClientProgressAnalytics } from "@/lib/sessions/service";

export const GET = withApiHandler({ requireOrg: true }, async () => {
  const client = await requireClient();
  const analytics = await getClientProgressAnalytics(
    client.organizationId,
    client.clientId,
  );

  return jsonOk(analytics);
});
