import { withApiHandler, jsonOk } from "@/lib/api/handler";
import { getAvailableSlots } from "@/lib/bookings/service";
import { parseListSlotsQuery } from "@/lib/validators/bookings";

export const GET = withApiHandler(
  { requireOrg: false, rateLimit: true },
  async ({ request }) => {
    const query = parseListSlotsQuery(new URL(request.url).searchParams);
    const slots = await getAvailableSlots(query);
    return jsonOk({ slots });
  },
);
