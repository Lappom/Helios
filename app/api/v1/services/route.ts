import { withApiHandler, jsonOk } from "@/lib/api/handler";
import { requireCoachRead, requireCoachWrite } from "@/lib/api/require-coach";
import {
  createService,
  listServicesForCoach,
} from "@/lib/coach-profile/service";
import { parseJsonBody } from "@/lib/validators/clients";
import { createCoachServiceSchema } from "@/lib/validators/coach-profile";

export const GET = withApiHandler({ requireOrg: true }, async () => {
  const org = await requireCoachRead();
  const services = await listServicesForCoach(
    org.organizationId,
    org.clerkUserId,
  );
  return jsonOk({ items: services });
});

export const POST = withApiHandler(
  { requireOrg: true, requireFeature: "shop" },
  async ({ request }) => {
  const org = await requireCoachWrite();
  const body = await parseJsonBody(createCoachServiceSchema, request);
  const service = await createService(
    org.organizationId,
    org.clerkUserId,
    body,
  );
  return jsonOk(service, { status: 201 });
  },
);
