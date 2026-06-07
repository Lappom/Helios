export type ProblemType =
  | "unauthorized"
  | "forbidden"
  | "not-found"
  | "validation-error"
  | "rate-limit-exceeded"
  | "quota-exceeded"
  | "internal-error";

export type ProblemDetails = {
  type: ProblemType;
  title: string;
  status: number;
  detail?: string;
  instance?: string;
};

export class ApiProblemError extends Error {
  readonly problem: ProblemDetails;

  constructor(problem: ProblemDetails) {
    super(problem.detail ?? problem.title);
    this.name = "ApiProblemError";
    this.problem = problem;
  }
}

export function problem(details: ProblemDetails): ApiProblemError {
  return new ApiProblemError(details);
}

export function jsonOk<T>(
  data: T,
  init?: { status?: number; headers?: HeadersInit },
): Response {
  const headers = new Headers(init?.headers);
  if (!headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  return new Response(JSON.stringify(data), {
    status: init?.status ?? 200,
    headers,
  });
}

export function jsonProblem(error: ApiProblemError, instance?: string): Response {
  const body = {
    type: `https://helios.lappom.fr/problems/${error.problem.type}`,
    title: error.problem.title,
    status: error.problem.status,
    detail: error.problem.detail,
    instance,
  };

  return new Response(JSON.stringify(body), {
    status: error.problem.status,
    headers: { "Content-Type": "application/problem+json" },
  });
}

export function toProblemResponse(
  error: unknown,
  instance?: string,
): Response {
  if (error instanceof ApiProblemError) {
    return jsonProblem(error, instance);
  }

  return jsonProblem(
    problem({
      type: "internal-error",
      title: "Internal server error",
      status: 500,
      detail: error instanceof Error ? error.message : "Unknown error",
    }),
    instance,
  );
}
