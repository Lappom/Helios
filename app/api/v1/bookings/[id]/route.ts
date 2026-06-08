import { withApiHandler, jsonOk } from "@/lib/api/handler";
import { getBookingIdFromPath } from "@/lib/api/booking-route";
import { problem } from "@/lib/api/response";
import { requireCoachWrite } from "@/lib/api/require-coach";
import { getBookingById, patchBookingStatus } from "@/lib/bookings/service";
import { parseJsonBody } from "@/lib/validators/clients";
import { patchBookingStatusSchema } from "@/lib/validators/bookings";

export const GET = withApiHandler({ requireOrg: true }, async ({ request }) => {
  const org = await requireCoachWrite();
  const bookingId = getBookingIdFromPath(request);

  if (!bookingId) {
    throw problem({
      type: "validation-error",
      title: "Invalid id",
      status: 400,
      detail: "Booking id is required.",
    });
  }

  const booking = await getBookingById(org.organizationId, bookingId);
  return jsonOk(booking);
});

export const PATCH = withApiHandler(
  { requireOrg: true },
  async ({ request }) => {
    const org = await requireCoachWrite();
    const bookingId = getBookingIdFromPath(request);

    if (!bookingId) {
      throw problem({
        type: "validation-error",
        title: "Invalid id",
        status: 400,
        detail: "Booking id is required.",
      });
    }

    const body = await parseJsonBody(patchBookingStatusSchema, request);
    const booking = await patchBookingStatus(
      org.organizationId,
      org.clerkUserId,
      bookingId,
      body,
    );
    return jsonOk(booking);
  },
);
