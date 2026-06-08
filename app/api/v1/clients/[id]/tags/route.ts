import { withApiHandler, jsonOk } from "@/lib/api/handler";
import { getClientIdFromPath } from "@/lib/api/client-route";
import { requireCoachWrite } from "@/lib/api/require-coach";
import { setClientTags } from "@/lib/clients/service";
import { assignClientTagsSchema, parseJsonBody } from "@/lib/validators/clients";

export const PUT = withApiHandler({ requireOrg: true }, async ({ request }) => {
  const org = await requireCoachWrite();
  const id = getClientIdFromPath(request);
  const body = await parseJsonBody(assignClientTagsSchema, request);
  const tags = await setClientTags(org.organizationId, id, body);

  return jsonOk({ tags });
});
