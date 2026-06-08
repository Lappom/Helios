import { withApiHandler, jsonOk } from "@/lib/api/handler";
import {
  getAssignmentIdFromPath,
  getAssignmentSessionIdFromPath,
} from "@/lib/api/assignment-route";
import { requireCoachWrite } from "@/lib/api/require-coach";
import { problem } from "@/lib/api/response";
import { patchSessionSchedule } from "@/lib/programs/assignments";
import { patchAssignmentScheduleSchema } from "@/lib/validators/programs";

export const PATCH = withApiHandler({ requireOrg: true }, async ({ request }) => {
  const org = await requireCoachWrite();
  const assignmentId = getAssignmentIdFromPath(request);
  const sessionId = getAssignmentSessionIdFromPath(request);

  if (!assignmentId || !sessionId) {
    throw problem({
      type: "validation-error",
      title: "Invalid path",
      status: 400,
      detail: "Assignment id and session id are required.",
    });
  }

  const body = patchAssignmentScheduleSchema.parse(await request.json());
  const schedule = await patchSessionSchedule(
    org.organizationId,
    assignmentId,
    sessionId,
    body.scheduledDate,
  );

  return jsonOk(schedule);
});
