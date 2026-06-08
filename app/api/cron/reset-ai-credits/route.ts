import { NextRequest } from "next/server";
import { jsonOk } from "@/lib/api/response";
import { resetAllAiCredits } from "@/lib/billing/ai-credits";

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

  const resetCount = await resetAllAiCredits();

  return jsonOk({
    status: "ok",
    resetCount,
  });
}
