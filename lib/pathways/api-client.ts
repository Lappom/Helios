import type {
  PathwayEnrollmentItem,
  PathwayListItem,
  PathwayTree,
} from "./types";

async function parseResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const body = (await response.json().catch(() => null)) as {
      detail?: string;
      title?: string;
    } | null;
    throw new Error(body?.detail ?? body?.title ?? "Request failed");
  }
  return response.json() as Promise<T>;
}

export async function fetchPathwaysRequest(): Promise<{
  items: PathwayListItem[];
}> {
  const response = await fetch("/api/v1/pathways?limit=100");
  return parseResponse(response);
}

export async function createPathwayRequest(input: {
  name: string;
  description?: string;
  isActive?: boolean;
  autoEnrollOnClientCreated?: boolean;
  steps: {
    stepType: string;
    delayDays?: number;
    stepConfig?: Record<string, unknown>;
    sortOrder?: number;
  }[];
}): Promise<PathwayTree> {
  const response = await fetch("/api/v1/pathways", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  return parseResponse(response);
}

export async function patchPathwayRequest(
  pathwayId: string,
  input: Record<string, unknown>,
): Promise<PathwayTree> {
  const response = await fetch(`/api/v1/pathways/${pathwayId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  return parseResponse(response);
}

export async function togglePathwayRequest(
  pathwayId: string,
  isActive: boolean,
): Promise<PathwayTree> {
  const response = await fetch(`/api/v1/pathways/${pathwayId}/toggle`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ isActive }),
  });
  return parseResponse(response);
}

export async function fetchPathwayEnrollmentsRequest(
  pathwayId: string,
): Promise<{ items: PathwayEnrollmentItem[] }> {
  const response = await fetch(
    `/api/v1/pathways/${pathwayId}/enrollments?limit=50`,
  );
  return parseResponse(response);
}
