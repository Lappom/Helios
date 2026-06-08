import type { SendChannelResult } from "./types";

export async function sendInAppNotification(): Promise<SendChannelResult> {
  // In-app delivery is persisted via notification_logs; client UI reads in P4.2.
  return { ok: true };
}
