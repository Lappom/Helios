import { withApiHandler, jsonOk } from "@/lib/api/handler";
import { getClientIdFromPath } from "@/lib/api/client-route";
import { requireCoachRead } from "@/lib/api/require-coach";
import { getClientDetail } from "@/lib/clients/service";

export const GET = withApiHandler({ requireOrg: true }, async ({ request }) => {
  const org = await requireCoachRead();
  const id = getClientIdFromPath(request);
  const client = await getClientDetail(org.organizationId, id);

  return jsonOk(client);
});
