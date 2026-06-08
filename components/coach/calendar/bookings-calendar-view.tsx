"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import { useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  addDays,
  formatDayKey,
  getMonthGridDays,
  getWeekDays,
  isSameDay,
  isSameMonth,
  startOfWeekMonday,
  WEEKDAY_LABELS,
} from "@/lib/programs/calendar-utils";
import type { BookingListItem } from "@/lib/bookings/types";
import { cn } from "@/lib/utils";

type BookingsCalendarViewProps = {
  bookings: BookingListItem[];
  view: "week" | "month";
  anchorDate: Date;
  onViewChange: (view: "week" | "month") => void;
  onAnchorChange: (date: Date) => void;
  onBookingClick: (booking: BookingListItem) => void;
};

const STATUS_COLORS: Record<string, string> = {
  confirmed: "bg-accent-emerald/20 text-accent-emerald border-accent-emerald/30",
  pending: "bg-primary/15 text-primary border-primary/30",
  cancelled: "bg-accent-rose/15 text-accent-rose border-accent-rose/30 line-through",
  completed: "bg-muted/20 text-muted border-hairline",
  no_show: "bg-accent-rose/15 text-accent-rose border-accent-rose/30",
};

function formatTime(iso: string): string {
  return new Date(iso).toLocaleTimeString("fr-FR", {
    hour: "2-digit",
    minute: "2-digit",
    timeZone: "Europe/Paris",
  });
}

export function BookingsCalendarView({
  bookings,
  view,
  anchorDate,
  onViewChange,
  onAnchorChange,
  onBookingClick,
}: BookingsCalendarViewProps) {
  const days = useMemo(
    () =>
      view === "week" ? getWeekDays(anchorDate) : getMonthGridDays(anchorDate),
    [anchorDate, view],
  );

  const bookingsByDay = useMemo(() => {
    const map = new Map<string, BookingListItem[]>();
    for (const booking of bookings) {
      const key = formatDayKey(new Date(booking.startAt));
      const bucket = map.get(key) ?? [];
      bucket.push(booking);
      map.set(key, bucket);
    }
    return map;
  }, [bookings]);

  function shiftPeriod(direction: -1 | 1) {
    const next = new Date(anchorDate);
    next.setDate(next.getDate() + (view === "week" ? direction * 7 : direction * 30));
    onAnchorChange(startOfWeekMonday(next));
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="border-hairline"
            onClick={() => shiftPeriod(-1)}
          >
            <ChevronLeft className="size-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="border-hairline"
            onClick={() => shiftPeriod(1)}
          >
            <ChevronRight className="size-4" />
          </Button>
          <span className="text-title-sm text-on-dark font-semibold capitalize">
            {anchorDate.toLocaleDateString("fr-FR", {
              month: "long",
              year: "numeric",
            })}
          </span>
        </div>
        <Tabs
          value={view}
          onValueChange={(v) => onViewChange(v as "week" | "month")}
        >
          <TabsList className="bg-surface-elevated">
            <TabsTrigger value="week">Semaine</TabsTrigger>
            <TabsTrigger value="month">Mois</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {WEEKDAY_LABELS.map((label) => (
          <div
            key={label}
            className="text-caption-uppercase text-muted px-1 py-2 text-center tracking-widest uppercase"
          >
            {label}
          </div>
        ))}

        {days.map((day) => {
          const key = formatDayKey(day);
          const dayBookings = bookingsByDay.get(key) ?? [];
          const isToday = isSameDay(day, new Date());
          const inMonth = view === "week" || isSameMonth(day, anchorDate);

          return (
            <div
              key={key}
              className={cn(
                "border-hairline bg-surface-card min-h-28 rounded-lg border p-2",
                !inMonth && view === "month" && "opacity-40",
                isToday && "ring-primary/30 ring-2",
              )}
            >
              <div className="text-caption text-muted mb-2 font-medium">
                {day.getDate()}
              </div>
              <div className="space-y-1">
                {dayBookings.map((booking) => (
                  <button
                    key={booking.id}
                    type="button"
                    onClick={() => onBookingClick(booking)}
                    className={cn(
                      "w-full rounded-md border px-2 py-1 text-left text-xs transition-colors hover:opacity-90",
                      STATUS_COLORS[booking.status] ??
                        "border-hairline bg-surface-elevated",
                    )}
                  >
                    <span className="font-semibold">
                      {formatTime(booking.startAt)}
                    </span>
                    <span className="text-muted block truncate">
                      {booking.clientName ?? booking.prospectEmail ?? "—"}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
