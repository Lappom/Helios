import { withApiHandler, jsonOk } from "@/lib/api/handler";
import { getClientIdFromPath } from "@/lib/api/client-route";
import { requireCoachWrite } from "@/lib/api/require-coach";
import { inviteClientToPortal } from "@/lib/clients/invite";

export const POST = withApiHandler({ requireOrg: true }, async ({ request }) => {
  const org = await requireCoachWrite();
  const id = getClientIdFromPath(request);
  const result = await inviteClientToPortal(
    org.organizationId,
    org.clerkOrgId,
    id,
  );

  return jsonOk(result, { status: 201 });
});
