import type {
  NotificationAnalytics,
  NotificationTemplateItem,
} from "./types";
import type {
  CreateNotificationTemplateInput,
  SendNotificationInput,
  UpdateNotificationTemplateInput,
} from "@/lib/validators/notifications";
import type { QuotaCheckResult } from "@/lib/billing/access";

async function parseResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const problem = await response.json().catch(() => null);
    throw new Error(
      problem?.detail ?? problem?.title ?? "Notification request failed.",
    );
  }
  return response.json() as Promise<T>;
}

export async function fetchNotificationTemplates(params?: {
  page?: number;
  limit?: number;
  search?: string;
}): Promise<{ items: NotificationTemplateItem[]; total: number }> {
  const searchParams = new URLSearchParams();
  if (params?.page) searchParams.set("page", String(params.page));
  if (params?.limit) searchParams.set("limit", String(params.limit));
  if (params?.search) searchParams.set("search", params.search);

  const response = await fetch(
    `/api/v1/notifications/templates?${searchParams.toString()}`,
  );
  const data = await parseResponse<{
    items: NotificationTemplateItem[];
    page: number;
    limit: number;
  }>(response);
  const total = Number(response.headers.get("X-Total-Count") ?? data.items.length);
  return { items: data.items, total };
}

export async function createNotificationTemplateRequest(
  input: CreateNotificationTemplateInput,
): Promise<NotificationTemplateItem> {
  const response = await fetch("/api/v1/notifications/templates", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  return parseResponse(response);
}

export async function updateNotificationTemplateRequest(
  templateId: string,
  input: UpdateNotificationTemplateInput,
): Promise<NotificationTemplateItem> {
  const response = await fetch(`/api/v1/notifications/templates/${templateId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  return parseResponse(response);
}

export async function deleteNotificationTemplateRequest(
  templateId: string,
): Promise<void> {
  const response = await fetch(`/api/v1/notifications/templates/${templateId}`, {
    method: "DELETE",
  });
  await parseResponse(response);
}

export async function sendNotificationRequest(
  input: SendNotificationInput,
): Promise<{ sent: number; failed: number; logIds: string[] }> {
  const response = await fetch("/api/v1/notifications/send", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  return parseResponse(response);
}

export async function fetchNotificationAnalytics(params?: {
  from?: string;
  to?: string;
  channel?: string;
  eventType?: string;
}): Promise<NotificationAnalytics> {
  const searchParams = new URLSearchParams();
  if (params?.from) searchParams.set("from", params.from);
  if (params?.to) searchParams.set("to", params.to);
  if (params?.channel) searchParams.set("channel", params.channel);
  if (params?.eventType) searchParams.set("eventType", params.eventType);

  const response = await fetch(
    `/api/v1/notifications/analytics?${searchParams.toString()}`,
  );
  return parseResponse(response);
}

export async function fetchNotificationQuota(): Promise<QuotaCheckResult> {
  const response = await fetch("/api/v1/notifications/quota");
  return parseResponse(response);
}
