import { NextRequest } from "next/server";
import { jsonOk } from "@/lib/api/response";
import { handleResendWebhookEvent } from "@/lib/notifications/service";

export async function POST(request: NextRequest) {
  const webhookSecret = process.env.RESEND_WEBHOOK_SECRET;
  if (webhookSecret) {
    const signature = request.headers.get("resend-signature");
    if (signature !== webhookSecret) {
      return jsonOk({ status: "unauthorized" }, { status: 401 });
    }
  }

  const payload = await request.json();
  await handleResendWebhookEvent(payload);
  return jsonOk({ received: true });
}
