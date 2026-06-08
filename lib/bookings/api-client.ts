import type {
  AvailabilityRuleDto,
  BlockedDateDto,
  BookingDetail,
  BookingListItem,
  BookingSlotDto,
} from "./types";
import type {
  CancelBookingInput,
  CreateBlockedDateInput,
  CreateBookingInput,
  PutAvailabilityInput,
  PatchBookingStatusInput,
} from "@/lib/validators/bookings";

async function parseApiError(response: Response): Promise<never> {
  let detail = "Request failed.";
  try {
    const payload = (await response.json()) as { detail?: string; title?: string };
    detail = payload.detail ?? payload.title ?? detail;
  } catch {
    // ignore
  }
  throw new Error(detail);
}

export async function fetchAvailability(): Promise<AvailabilityRuleDto[]> {
  const response = await fetch("/api/v1/availability");
  if (!response.ok) await parseApiError(response);
  const data = (await response.json()) as { rules: AvailabilityRuleDto[] };
  return data.rules;
}

export async function putAvailabilityRequest(
  input: PutAvailabilityInput,
): Promise<AvailabilityRuleDto[]> {
  const response = await fetch("/api/v1/availability", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!response.ok) await parseApiError(response);
  const data = (await response.json()) as { rules: AvailabilityRuleDto[] };
  return data.rules;
}

export async function fetchBlockedDates(): Promise<BlockedDateDto[]> {
  const response = await fetch("/api/v1/blocked-dates");
  if (!response.ok) await parseApiError(response);
  const data = (await response.json()) as { items: BlockedDateDto[] };
  return data.items;
}

export async function createBlockedDateRequest(
  input: CreateBlockedDateInput,
): Promise<BlockedDateDto> {
  const response = await fetch("/api/v1/blocked-dates", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!response.ok) await parseApiError(response);
  return (await response.json()) as BlockedDateDto;
}

export async function deleteBlockedDateRequest(id: string): Promise<void> {
  const response = await fetch(`/api/v1/blocked-dates/${id}`, {
    method: "DELETE",
  });
  if (!response.ok) await parseApiError(response);
}

export async function fetchBookings(params?: {
  from?: string;
  to?: string;
  status?: string;
}): Promise<BookingListItem[]> {
  const search = new URLSearchParams();
  if (params?.from) search.set("from", params.from);
  if (params?.to) search.set("to", params.to);
  if (params?.status) search.set("status", params.status);

  const response = await fetch(`/api/v1/bookings?${search.toString()}`);
  if (!response.ok) await parseApiError(response);
  const data = (await response.json()) as { items: BookingListItem[] };
  return data.items;
}

export async function fetchClientBookings(): Promise<BookingListItem[]> {
  const response = await fetch("/api/v1/bookings?mine=true");
  if (!response.ok) await parseApiError(response);
  const data = (await response.json()) as { items: BookingListItem[] };
  return data.items;
}

export async function fetchAvailableSlots(
  serviceId: string,
  from: string,
  to: string,
): Promise<BookingSlotDto[]> {
  const search = new URLSearchParams({ serviceId, from, to });
  const response = await fetch(`/api/v1/bookings/slots?${search.toString()}`);
  if (!response.ok) await parseApiError(response);
  const data = (await response.json()) as { slots: BookingSlotDto[] };
  return data.slots;
}

export async function createBookingRequest(
  input: CreateBookingInput,
): Promise<BookingDetail> {
  const response = await fetch("/api/v1/bookings", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!response.ok) await parseApiError(response);
  return (await response.json()) as BookingDetail;
}

export async function cancelBookingRequest(
  bookingId: string,
  input: CancelBookingInput = {},
): Promise<BookingDetail> {
  const response = await fetch(`/api/v1/bookings/${bookingId}/cancel`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!response.ok) await parseApiError(response);
  return (await response.json()) as BookingDetail;
}

export async function patchBookingStatusRequest(
  bookingId: string,
  input: PatchBookingStatusInput,
): Promise<BookingDetail> {
  const response = await fetch(`/api/v1/bookings/${bookingId}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  if (!response.ok) await parseApiError(response);
  return (await response.json()) as BookingDetail;
}
