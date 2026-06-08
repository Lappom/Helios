import { ClientBookingsPage } from "@/components/client/bookings/client-bookings-page";
import { requireRole } from "@/lib/auth/org-context";
import { getClientIdForUser } from "@/lib/api/require-client";
import { listClientBookings } from "@/lib/bookings/service";

export default async function ClientBookingsRoute() {
  const org = await requireRole("client");
  const clientId = await getClientIdForUser(
    org.organizationId,
    org.clerkUserId,
  );

  const bookings = clientId
    ? await listClientBookings(org.organizationId, clientId)
    : [];

  return <ClientBookingsPage initialBookings={bookings} />;
}
