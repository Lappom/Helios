import { withApiHandler, jsonOk } from "@/lib/api/handler";
import { getHabitIdFromPath } from "@/lib/api/habit-route";
import { requireCoachWrite } from "@/lib/api/require-coach";
import { problem } from "@/lib/api/response";
import { assignHabit } from "@/lib/habits/service";
import { parseJsonBody } from "@/lib/validators/clients";
import { assignHabitSchema } from "@/lib/validators/habits";

export const POST = withApiHandler(
  { requireOrg: true, requireFeature: "habits" },
  async ({ request }) => {
    const org = await requireCoachWrite();
    const habitId = getHabitIdFromPath(request);

    if (!habitId) {
      throw problem({
        type: "validation-error",
        title: "Invalid habit id",
        status: 400,
        detail: "Habit id is required.",
      });
    }

    const body = await parseJsonBody(assignHabitSchema, request);
    const assignment = await assignHabit(
      org.organizationId,
      habitId,
      org.clerkUserId,
      body,
    );

    return jsonOk(assignment, { status: 201 });
  },
);
