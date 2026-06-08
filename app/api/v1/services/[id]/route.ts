import { withApiHandler, jsonOk } from "@/lib/api/handler";
import { getServiceIdFromPath } from "@/lib/api/coach-profile-route";
import { requireCoachWrite } from "@/lib/api/require-coach";
import { problem } from "@/lib/api/response";
import { deleteService, patchService } from "@/lib/coach-profile/service";
import { parseJsonBody } from "@/lib/validators/clients";
import { patchCoachServiceSchema } from "@/lib/validators/coach-profile";

export const PATCH = withApiHandler({ requireOrg: true }, async ({ request }) => {
  const org = await requireCoachWrite();
  const id = getServiceIdFromPath(request);

  if (!id) {
    throw problem({
      type: "validation-error",
      title: "Invalid service id",
      status: 400,
      detail: "Service id is required.",
    });
  }

  const body = await parseJsonBody(patchCoachServiceSchema, request);
  const service = await patchService(
    org.organizationId,
    org.clerkUserId,
    id,
    body,
  );
  return jsonOk(service);
});

export const DELETE = withApiHandler({ requireOrg: true }, async ({ request }) => {
  const org = await requireCoachWrite();
  const id = getServiceIdFromPath(request);

  if (!id) {
    throw problem({
      type: "validation-error",
      title: "Invalid service id",
      status: 400,
      detail: "Service id is required.",
    });
  }

  await deleteService(org.organizationId, org.clerkUserId, id);
  return jsonOk({ ok: true });
});
