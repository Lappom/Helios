export type HeliosEventName = "client.created" | "assessment.submitted";

export type ClientCreatedPayload = {
  organizationId: string;
  clientId: string;
  source: "checkout" | "manual" | "import";
  bookingId?: string;
};

export type HeliosEventPayload = {
  "client.created": ClientCreatedPayload;
  "assessment.submitted": {
    organizationId: string;
    assessmentId: string;
    clientId: string;
  };
};

export function emitHeliosEvent<T extends HeliosEventName>(
  name: T,
  payload: HeliosEventPayload[T],
): void {
  if (process.env.NODE_ENV === "development") {
    console.info(`[helios:event] ${name}`, payload);
  }
}
