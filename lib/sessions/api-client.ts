import type {
  ClientSchedulePayload,
  ProgramAnalytics,
  SessionExecutionDetail,
  SessionRecap,
} from "./types";

async function parseResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(
      (payload as { detail?: string }).detail ??
        `Request failed with status ${response.status}`,
    );
  }

  return response.json() as Promise<T>;
}

export async function fetchClientSchedule(params?: {
  start?: string;
  end?: string;
}): Promise<ClientSchedulePayload> {
  const query = new URLSearchParams();
  if (params?.start) {
    query.set("start", params.start);
  }
  if (params?.end) {
    query.set("end", params.end);
  }

  const suffix = query.size > 0 ? `?${query.toString()}` : "";
  const response = await fetch(`/api/v1/me/schedule${suffix}`);
  return parseResponse<ClientSchedulePayload>(response);
}

export async function fetchSessionDetail(
  programSessionId: string,
  scheduledDate: string,
): Promise<SessionExecutionDetail> {
  const response = await fetch(
    `/api/v1/sessions/${programSessionId}?scheduledDate=${scheduledDate}`,
  );
  return parseResponse<SessionExecutionDetail>(response);
}

export async function startSessionRequest(
  programSessionId: string,
  scheduledDate: string,
): Promise<SessionExecutionDetail> {
  const response = await fetch(`/api/v1/sessions/${programSessionId}/start`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ scheduledDate }),
  });
  return parseResponse<SessionExecutionDetail>(response);
}

export async function logSetRequest(
  programSessionId: string,
  payload: {
    sessionLogId: string;
    blockExerciseId: string;
    setPrescriptionId?: string;
    setNumber: number;
    exerciseId: string;
    load?: string;
    reps?: string;
    rpe?: number;
    durationSeconds?: number;
    skipped?: boolean;
  },
): Promise<SessionExecutionDetail> {
  const response = await fetch(`/api/v1/sessions/${programSessionId}/sets`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  return parseResponse<SessionExecutionDetail>(response);
}

export async function completeSessionRequest(
  programSessionId: string,
  sessionLogId: string,
): Promise<{ recap: SessionRecap; detail: SessionExecutionDetail }> {
  const response = await fetch(
    `/api/v1/sessions/${programSessionId}/complete`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ sessionLogId }),
    },
  );
  return parseResponse<{ recap: SessionRecap; detail: SessionExecutionDetail }>(
    response,
  );
}

export async function fetchClientProgress(): Promise<ProgramAnalytics> {
  const response = await fetch("/api/v1/me/progress");
  return parseResponse<ProgramAnalytics>(response);
}
