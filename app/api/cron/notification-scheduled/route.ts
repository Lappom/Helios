import { NextRequest } from "next/server";
import { jsonOk } from "@/lib/api/response";
import { processScheduledNotificationTemplates } from "@/lib/notifications/scheduled";
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

  const [scheduled, sessionH1] = await Promise.all([
    processScheduledNotificationTemplates(new Date()),
    processSessionReminders(new Date(), "h1"),
  ]);

  return jsonOk({
    status: "ok",
    scheduled,
    sessionH1,
  });
}
