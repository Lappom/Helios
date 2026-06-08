import { withApiHandler, jsonOk } from "@/lib/api/handler";
import { getBlockedDateIdFromPath } from "@/lib/api/booking-route";
import { problem } from "@/lib/api/response";
import { requireCoachWrite } from "@/lib/api/require-coach";
import { removeBlockedDate } from "@/lib/bookings/service";

export const DELETE = withApiHandler(
  { requireOrg: true },
  async ({ request }) => {
    const org = await requireCoachWrite();
    const id = getBlockedDateIdFromPath(request);

    if (!id) {
      throw problem({
        type: "validation-error",
        title: "Invalid id",
        status: 400,
        detail: "Blocked date id is required.",
      });
    }

    await removeBlockedDate(org.organizationId, org.clerkUserId, id);
    return jsonOk({ status: "deleted" });
  },
);
