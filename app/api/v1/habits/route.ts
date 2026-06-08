import { withApiHandler, jsonOk } from "@/lib/api/handler";
import { parsePagination, withTotalCountHeaders } from "@/lib/api/pagination";
import { requireClient } from "@/lib/api/require-client";
import { requireCoachRead, requireCoachWrite } from "@/lib/api/require-coach";
import {
  createHabit,
  listClientHabits,
  listHabits,
} from "@/lib/habits/service";
import { parseJsonBody } from "@/lib/validators/clients";
import {
  createHabitSchema,
  parseListHabitsQuery,
} from "@/lib/validators/habits";

export const GET = withApiHandler(
  { requireOrg: true, requireFeature: "habits" },
  async ({ request }) => {
    const searchParams = new URL(request.url).searchParams;
    const mine = searchParams.get("mine") === "true";

    if (mine) {
      const client = await requireClient();
      const items = await listClientHabits(
        client.organizationId,
        client.clientId,
      );
      return jsonOk({ items });
    }

    const org = await requireCoachRead();
    const pagination = parsePagination(searchParams);
    const query = parseListHabitsQuery(searchParams);
    const { items, total } = await listHabits(org.organizationId, {
      ...pagination,
      ...query,
    });

    return jsonOk(
      { items, page: pagination.page, limit: pagination.limit },
      { headers: withTotalCountHeaders(undefined, total) },
    );
  },
);

export const POST = withApiHandler(
  { requireOrg: true, requireFeature: "habits" },
  async ({ request }) => {
    const org = await requireCoachWrite();
    const body = await parseJsonBody(createHabitSchema, request);
    const habit = await createHabit(org.organizationId, org.clerkUserId, body);

    return jsonOk(habit, { status: 201 });
  },
);
