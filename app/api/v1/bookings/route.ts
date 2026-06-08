import { withApiHandler, jsonOk } from "@/lib/api/handler";
import { parsePagination, withTotalCountHeaders } from "@/lib/api/pagination";
import { getClientIdForUser, requireClient } from "@/lib/api/require-client";
import { requireCoachRead } from "@/lib/api/require-coach";
import { getOrgContext } from "@/lib/auth/org-context";
import {
  createBooking,
  listBookings,
  listClientBookings,
} from "@/lib/bookings/service";
import { parseJsonBody } from "@/lib/validators/clients";
import {
  createBookingSchema,
  parseListBookingsQuery,
} from "@/lib/validators/bookings";

export const GET = withApiHandler({ requireOrg: true }, async ({ request }) => {
  const searchParams = new URL(request.url).searchParams;
  const mine = searchParams.get("mine") === "true";

  if (mine) {
    const client = await requireClient();
    const items = await listClientBookings(
      client.organizationId,
      client.clientId,
    );
    return jsonOk({ items });
  }

  const org = await requireCoachRead();
  const pagination = parsePagination(searchParams);
  const query = parseListBookingsQuery(searchParams, pagination);
  const { items, total } = await listBookings(
    org.organizationId,
    org.clerkUserId,
    query,
  );

  return jsonOk(
    { items, page: pagination.page, limit: pagination.limit },
    { headers: withTotalCountHeaders(undefined, total) },
  );
});

export const POST = withApiHandler(
  { requireOrg: false, rateLimit: true },
  async ({ request }) => {
    const body = await parseJsonBody(createBookingSchema, request);
    const org = await getOrgContext();

    let clientId: string | undefined;
    let organizationId: string | undefined;

    if (org?.role === "client") {
      const resolvedClientId = await getClientIdForUser(
        org.organizationId,
        org.clerkUserId,
      );
      if (resolvedClientId) {
        clientId = resolvedClientId;
        organizationId = org.organizationId;
      }
    }

    const booking = await createBooking(body, { clientId, organizationId });
    return jsonOk(booking, { status: 201 });
  },
);
