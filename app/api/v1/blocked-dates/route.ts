import { withApiHandler, jsonOk } from "@/lib/api/handler";
import { requireCoachRead, requireCoachWrite } from "@/lib/api/require-coach";
import { addBlockedDate, listBlockedDates } from "@/lib/bookings/service";
import { parseJsonBody } from "@/lib/validators/clients";
import { createBlockedDateSchema } from "@/lib/validators/bookings";

export const GET = withApiHandler({ requireOrg: true }, async () => {
  const org = await requireCoachRead();
  const items = await listBlockedDates(org.organizationId, org.clerkUserId);
  return jsonOk({ items });
});

export const POST = withApiHandler({ requireOrg: true }, async ({ request }) => {
  const org = await requireCoachWrite();
  const body = await parseJsonBody(createBlockedDateSchema, request);
  const item = await addBlockedDate(
    org.organizationId,
    org.clerkUserId,
    body,
  );
  return jsonOk(item, { status: 201 });
});
