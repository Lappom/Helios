import { withApiHandler, jsonOk } from "@/lib/api/handler";
import {
  getAssignmentIdFromPath,
} from "@/lib/api/assignment-route";
import { requireCoachRead } from "@/lib/api/require-coach";
import { problem } from "@/lib/api/response";
import { getAssignmentSchedule } from "@/lib/programs/assignments";

export const GET = withApiHandler({ requireOrg: true }, async ({ request }) => {
  const org = await requireCoachRead();
  const assignmentId = getAssignmentIdFromPath(request);

  if (!assignmentId) {
    throw problem({
      type: "validation-error",
      title: "Invalid assignment id",
      status: 400,
      detail: "Assignment id is required.",
    });
  }

  const url = new URL(request.url);
  const startRaw = url.searchParams.get("start");
  const endRaw = url.searchParams.get("end");

  let range: { start: Date; end: Date } | undefined;

  if (startRaw && endRaw) {
    range = {
      start: new Date(startRaw),
      end: new Date(endRaw),
    };
  }

  const schedule = await getAssignmentSchedule(
    org.organizationId,
    assignmentId,
    range,
  );

  return jsonOk(schedule);
});
