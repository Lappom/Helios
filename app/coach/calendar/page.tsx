import { CalendarPageClient } from "@/components/coach/calendar/calendar-page-client";
import { requireRole } from "@/lib/auth/org-context";
import {
  getAvailability,
  listBlockedDates,
  listBookings,
} from "@/lib/bookings/service";
import { formatDayKey, startOfWeekMonday } from "@/lib/programs/calendar-utils";

export default async function CoachCalendarPage() {
  const org = await requireRole("org_owner", "org_admin", "coach", "assistant");

  const anchor = startOfWeekMonday(new Date());
  const rangeEnd = new Date(anchor);
  rangeEnd.setDate(rangeEnd.getDate() + 41);

  const [rules, blockedDates, { items: bookings }] = await Promise.all([
    getAvailability(org.organizationId, org.clerkUserId),
    listBlockedDates(org.organizationId, org.clerkUserId),
    listBookings(org.organizationId, org.clerkUserId, {
      from: formatDayKey(anchor),
      to: formatDayKey(rangeEnd),
      page: 1,
      limit: 200,
      offset: 0,
    }),
  ]);

  return (
    <CalendarPageClient
      initialRules={rules}
      initialBlockedDates={blockedDates}
      initialBookings={bookings}
    />
  );
}
