import { NextRequest } from "next/server";
import { jsonOk } from "@/lib/api/response";
import { processAssessmentReminders } from "@/lib/assessments/reminders";
import { processSessionReminders } from "@/lib/sessions/reminders";

function isAuthorizedCron(request: NextRequest): boolean {
  const cronSecret = process.env.CRON_SECRET;
  if (!cronSecret) {
    return process.env.NODE_ENV !== "production";
  }

  return request.headers.get("authorization") === `Bearer ${cronSecret}`;
}

export async function GET(request: NextRequest) {
  if (!isAuthorizedCron(request)) {
    return jsonOk({ status: "unauthorized" }, { status: 401 });
  }

  const [sessions, assessments] = await Promise.all([
    processSessionReminders(new Date(), "d0"),
    processAssessmentReminders(new Date()),
  ]);

  return jsonOk({
    status: "ok",
    sessions,
    assessments,
  });
}
