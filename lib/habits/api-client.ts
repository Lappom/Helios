import type {
  ClientHabitAssignment,
  ClientHabitStatsReport,
  HabitListItem,
  HabitLogResult,
  OrgWeeklyHabitSummary,
} from "./types";
import type {
  AssignHabitInput,
  CreateHabitInput,
  LogHabitInput,
} from "@/lib/validators/habits";

async function parseJson<T>(response: Response): Promise<T> {
  const payload = await response.json();
  if (!response.ok) {
    throw new Error(payload.detail ?? payload.title ?? "Request failed.");
  }
  return payload as T;
}

export async function fetchHabits(params?: {
  search?: string;
  page?: number;
  limit?: number;
}): Promise<{ items: HabitListItem[]; total?: number }> {
  const searchParams = new URLSearchParams();
  if (params?.search) {
    searchParams.set("search", params.search);
  }
  if (params?.page) {
    searchParams.set("page", String(params.page));
  }
  if (params?.limit) {
    searchParams.set("limit", String(params.limit));
  }

  const response = await fetch(`/api/v1/habits?${searchParams.toString()}`);
  return parseJson(response);
}

export async function fetchMyHabits(): Promise<{ items: ClientHabitAssignment[] }> {
  const response = await fetch("/api/v1/habits?mine=true");
  return parseJson(response);
}

export async function createHabitApi(
  input: CreateHabitInput,
): Promise<HabitListItem> {
  const response = await fetch("/api/v1/habits", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  return parseJson(response);
}

export async function assignHabitApi(
  habitId: string,
  input: AssignHabitInput,
): Promise<unknown> {
  const response = await fetch(`/api/v1/habits/${habitId}/assign`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  return parseJson(response);
}

export async function logHabitApi(input: LogHabitInput): Promise<HabitLogResult> {
  const response = await fetch("/api/v1/habits/logs", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  return parseJson(response);
}

export async function fetchClientHabitStats(
  clientId: string,
  params?: { start?: string; end?: string },
): Promise<ClientHabitStatsReport> {
  const searchParams = new URLSearchParams();
  if (params?.start) {
    searchParams.set("start", params.start);
  }
  if (params?.end) {
    searchParams.set("end", params.end);
  }

  const response = await fetch(
    `/api/v1/clients/${clientId}/habits/stats?${searchParams.toString()}`,
  );
  return parseJson(response);
}

export async function fetchOrgWeeklySummary(): Promise<OrgWeeklyHabitSummary> {
  const response = await fetch("/api/v1/habits/weekly-summary");
  return parseJson(response);
}

export async function fetchClientsForAssign(): Promise<
  Array<{ id: string; firstName: string; lastName: string }>
> {
  const response = await fetch("/api/v1/clients?limit=100&status=ACTIVE");
  const payload = await parseJson<{ items: Array<{ id: string; firstName: string; lastName: string }> }>(
    response,
  );
  return payload.items;
}
