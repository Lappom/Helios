import { withApiHandler, jsonOk } from "@/lib/api/handler";
import { completeCheckoutBooking } from "@/lib/checkout/service";
import { parseJsonBody } from "@/lib/validators/clients";
import { createCheckoutBookingSchema } from "@/lib/validators/checkout";

export const POST = withApiHandler(
  { requireOrg: false, rateLimit: true },
  async ({ request }) => {
    const body = await parseJsonBody(createCheckoutBookingSchema, request);
    const result = await completeCheckoutBooking(body);
    return jsonOk(result, { status: 201 });
  },
);
