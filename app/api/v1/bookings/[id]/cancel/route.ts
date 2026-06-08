import { withApiHandler, jsonOk } from "@/lib/api/handler";
import { getBookingIdFromPath } from "@/lib/api/booking-route";
import { problem } from "@/lib/api/response";
import { requireClient } from "@/lib/api/require-client";
import { requireCoachWrite } from "@/lib/api/require-coach";
import { getOrgContext } from "@/lib/auth/org-context";
import { cancelBooking } from "@/lib/bookings/service";
import { parseJsonBody } from "@/lib/validators/clients";
import { cancelBookingSchema } from "@/lib/validators/bookings";

export const PATCH = withApiHandler(
  { requireOrg: true },
  async ({ request }) => {
    const bookingId = getBookingIdFromPath(request);

    if (!bookingId) {
      throw problem({
        type: "validation-error",
        title: "Invalid id",
        status: 400,
        detail: "Booking id is required.",
      });
    }

    const body = await parseJsonBody(cancelBookingSchema, request);
    const org = await getOrgContext();

    if (!org) {
      throw problem({
        type: "unauthorized",
        title: "Authentication required",
        status: 401,
        detail: "You must be signed in to cancel a booking.",
      });
    }

    if (org.role === "client") {
      const client = await requireClient();
      const booking = await cancelBooking(
        client.organizationId,
        bookingId,
        { role: "client", clientId: client.clientId },
        body,
      );
      return jsonOk(booking);
    }

    const coach = await requireCoachWrite();
    const booking = await cancelBooking(
      coach.organizationId,
      bookingId,
      { role: "coach", clerkUserId: coach.clerkUserId },
      body,
    );
    return jsonOk(booking);
  },
);
