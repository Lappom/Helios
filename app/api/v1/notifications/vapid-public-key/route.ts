import { jsonOk } from "@/lib/api/response";
import { getVapidPublicKey } from "@/lib/notifications/push";

export async function GET() {
  const publicKey = getVapidPublicKey();
  return jsonOk({ publicKey });
}
