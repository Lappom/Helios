import { withApiHandler, jsonOk } from "@/lib/api/handler";
import { getClientIdFromPath } from "@/lib/api/client-route";
import { requireCoachWrite } from "@/lib/api/require-coach";
import { updateClientStatus } from "@/lib/clients/service";
import { parseJsonBody, updateClientStatusSchema } from "@/lib/validators/clients";

export const PATCH = withApiHandler(
  { requireOrg: true },
  async ({ request }) => {
    const org = await requireCoachWrite();
    const id = getClientIdFromPath(request);
    const body = await parseJsonBody(updateClientStatusSchema, request);
    const client = await updateClientStatus(
      org.organizationId,
      org.planTier,
      id,
      body.status,
      org.clerkUserId,
    );

    return jsonOk(client);
  },
);
