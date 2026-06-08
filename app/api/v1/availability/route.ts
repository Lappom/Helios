import { withApiHandler, jsonOk } from "@/lib/api/handler";
import { requireCoachRead, requireCoachWrite } from "@/lib/api/require-coach";
import {
  getAvailability,
  replaceAvailability,
} from "@/lib/bookings/service";
import { parseJsonBody } from "@/lib/validators/clients";
import { putAvailabilitySchema } from "@/lib/validators/bookings";

export const GET = withApiHandler({ requireOrg: true }, async () => {
  const org = await requireCoachRead();
  const rules = await getAvailability(org.organizationId, org.clerkUserId);
  return jsonOk({ rules });
});

export const PUT = withApiHandler({ requireOrg: true }, async ({ request }) => {
  const org = await requireCoachWrite();
  const body = await parseJsonBody(putAvailabilitySchema, request);
  const rules = await replaceAvailability(
    org.organizationId,
    org.clerkUserId,
    body,
  );
  return jsonOk({ rules });
});
