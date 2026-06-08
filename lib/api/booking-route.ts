export function getBookingIdFromPath(request: Request): string {
  const pathname = new URL(request.url).pathname;
  const segments = pathname.split("/").filter(Boolean);
  const bookingsIndex = segments.indexOf("bookings");
  return bookingsIndex >= 0 ? (segments[bookingsIndex + 1] ?? "") : "";
}

export function getBlockedDateIdFromPath(request: Request): string {
  const pathname = new URL(request.url).pathname;
  const segments = pathname.split("/").filter(Boolean);
  const blockedIndex = segments.indexOf("blocked-dates");
  return blockedIndex >= 0 ? (segments[blockedIndex + 1] ?? "") : "";
}
