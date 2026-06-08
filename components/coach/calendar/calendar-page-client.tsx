"use client";

import { useCallback, useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { fetchBookings } from "@/lib/bookings/api-client";
import type {
  AvailabilityRuleDto,
  BlockedDateDto,
  BookingListItem,
} from "@/lib/bookings/types";
import { formatDayKey, startOfWeekMonday } from "@/lib/programs/calendar-utils";
import { AvailabilityWeekGrid } from "./availability-week-grid";
import { BlockedDatesPanel } from "./blocked-dates-panel";
import { BookingDetailDialog } from "./booking-detail-dialog";
import { BookingsCalendarView } from "./bookings-calendar-view";

type CalendarPageClientProps = {
  initialRules: AvailabilityRuleDto[];
  initialBlockedDates: BlockedDateDto[];
  initialBookings: BookingListItem[];
};

export function CalendarPageClient({
  initialRules,
  initialBlockedDates,
  initialBookings,
}: CalendarPageClientProps) {
  const [rules, setRules] = useState(initialRules);
  const [blockedDates, setBlockedDates] = useState(initialBlockedDates);
  const [bookings, setBookings] = useState(initialBookings);
  const [view, setView] = useState<"week" | "month">("week");
  const [anchorDate, setAnchorDate] = useState(() =>
    startOfWeekMonday(new Date()),
  );
  const [selectedBooking, setSelectedBooking] =
    useState<BookingListItem | null>(null);
  const [detailOpen, setDetailOpen] = useState(false);

  const refreshBookings = useCallback(async () => {
    const days =
      view === "week"
        ? 7
        : 42;
    const start = new Date(anchorDate);
    const end = new Date(anchorDate);
    end.setDate(end.getDate() + days);

    const items = await fetchBookings({
      from: formatDayKey(start),
      to: formatDayKey(end),
    });
    setBookings(items);
  }, [anchorDate, view]);

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div>
        <h1 className="text-display-sm text-on-dark font-bold tracking-tight">
          Agenda
        </h1>
        <p className="text-body-md text-muted mt-2">
          Gérez vos rendez-vous, disponibilités et congés.
        </p>
      </div>

      <Tabs defaultValue="agenda" className="space-y-6">
        <TabsList className="bg-surface-elevated">
          <TabsTrigger value="agenda">Rendez-vous</TabsTrigger>
          <TabsTrigger value="availability">Disponibilités</TabsTrigger>
          <TabsTrigger value="blocked">Congés</TabsTrigger>
        </TabsList>

        <TabsContent value="agenda">
          <BookingsCalendarView
            bookings={bookings}
            view={view}
            anchorDate={anchorDate}
            onViewChange={(next) => {
              setView(next);
              void refreshBookings();
            }}
            onAnchorChange={(date) => {
              setAnchorDate(date);
              void refreshBookings();
            }}
            onBookingClick={(booking) => {
              setSelectedBooking(booking);
              setDetailOpen(true);
            }}
          />
        </TabsContent>

        <TabsContent value="availability">
          <AvailabilityWeekGrid
            initialRules={rules}
            onSaved={setRules}
          />
        </TabsContent>

        <TabsContent value="blocked">
          <BlockedDatesPanel
            initialBlockedDates={blockedDates}
            onUpdated={setBlockedDates}
          />
        </TabsContent>
      </Tabs>

      <BookingDetailDialog
        booking={selectedBooking}
        open={detailOpen}
        onOpenChange={setDetailOpen}
        onUpdated={refreshBookings}
      />
    </div>
  );
}
