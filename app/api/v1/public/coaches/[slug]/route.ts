import { withApiHandler, jsonOk } from "@/lib/api/handler";
import { getPublicCoachSlugFromPath } from "@/lib/api/coach-profile-route";
import { problem } from "@/lib/api/response";
import { getPublicCoachBySlug } from "@/lib/coach-profile/service";

export const GET = withApiHandler(
  { requireOrg: false, rateLimit: true },
  async ({ request }) => {
    const slug = getPublicCoachSlugFromPath(request);

    if (!slug) {
      throw problem({
        type: "validation-error",
        title: "Invalid slug",
        status: 400,
        detail: "Coach slug is required.",
      });
    }

    const coach = await getPublicCoachBySlug(slug);
    return jsonOk(coach);
  },
);
