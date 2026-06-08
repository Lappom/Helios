import { withApiHandler, jsonOk } from "@/lib/api/handler";
import { withTotalCountHeaders } from "@/lib/api/pagination";
import { listPublicCoaches } from "@/lib/coach-profile/service";
import { parseListPublicCoachesQuery } from "@/lib/validators/coach-profile";

export const GET = withApiHandler(
  { requireOrg: false, rateLimit: true },
  async ({ request }) => {
    const searchParams = new URL(request.url).searchParams;
    const query = parseListPublicCoachesQuery(searchParams);
    const { items, total } = await listPublicCoaches(query);

    return jsonOk(
      { items, page: query.page, limit: query.limit },
      { headers: withTotalCountHeaders(undefined, total) },
    );
  },
);
