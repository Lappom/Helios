import type { AutomationTriggerPayload } from "./types";
import type { AutomationTriggerType } from "@/lib/validators/automations";

export function resolveTriggerEventId(
  triggerType: AutomationTriggerType,
  payload: AutomationTriggerPayload,
): string {
  if (payload.triggerEventId) return payload.triggerEventId;

  switch (triggerType) {
    case "payment_received":
      return String(payload.metadata?.paymentId ?? payload.clientId ?? "unknown");
    case "client_created":
      return String(payload.metadata?.clientId ?? payload.clientId ?? "unknown");
    case "assessment_submitted":
      return String(payload.metadata?.assessmentId ?? "unknown");
    case "session_completed":
      return String(payload.metadata?.sessionLogId ?? "unknown");
    case "form_completed":
      return String(
        payload.metadata?.feedbackId ?? payload.metadata?.sessionLogId ?? "unknown",
      );
    case "schedule_cron":
      return String(payload.metadata?.cronKey ?? "cron");
    case "subscription_renewal_due":
      return String(payload.metadata?.renewalKey ?? "renewal");
    default:
      return `event:${Date.now()}`;
  }
}
