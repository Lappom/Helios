"use client";

import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { SessionStatusBadge } from "@/components/client/session-status-badge";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  formatDayKey,
  getMonthGridDays,
  getWeekDays,
  isSameDay,
  isSameMonth,
  startOfWeekMonday,
  WEEKDAY_LABELS,
} from "@/lib/programs/calendar-utils";
import { fetchClientSchedule } from "@/lib/sessions/api-client";
import type { EnrichedScheduledSession } from "@/lib/sessions/types";
import { cn } from "@/lib/utils";

export function ClientProgramCalendar() {
  const [view, setView] = useState<"week" | "month">("week");
  const [anchorDate, setAnchorDate] = useState(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  });
  const [sessions, setSessions] = useState<EnrichedScheduledSession[]>([]);
  const [programName, setProgramName] = useState("");
  const [loading, setLoading] = useState(true);

  const days = useMemo(() => {
    return view === "week"
      ? getWeekDays(anchorDate)
      : getMonthGridDays(anchorDate);
  }, [anchorDate, view]);

  const range = useMemo(() => {
    const start = days[0]!;
    const end = days[days.length - 1]!;
    end.setHours(23, 59, 59, 999);
    return { start, end };
  }, [days]);

  const loadSchedule = useCallback(async () => {
    setLoading(true);
    try {
      const payload = await fetchClientSchedule({
        start: formatDayKey(range.start),
        end: formatDayKey(range.end),
      });
      setSessions(payload.sessions);
      setProgramName(payload.assignment.program.name);
    } catch {
      setSessions([]);
      setProgramName("");
    } finally {
      setLoading(false);
    }
  }, [range.end, range.start]);

  useEffect(() => {
    void loadSchedule();
  }, [loadSchedule]);

  const sessionsByDay = useMemo(() => {
    const map = new Map<string, EnrichedScheduledSession[]>();
    for (const session of sessions) {
      const key = session.scheduledDateKey;
      const bucket = map.get(key) ?? [];
      bucket.push(session);
      map.set(key, bucket);
    }
    return map;
  }, [sessions]);

  function shiftAnchor(delta: number) {
    setAnchorDate((current) => {
      const next = new Date(current);
      if (view === "week") {
        next.setDate(next.getDate() + delta * 7);
      } else {
        next.setMonth(next.getMonth() + delta);
      }
      next.setHours(0, 0, 0, 0);
      return next;
    });
  }

  const title =
    view === "week"
      ? `Semaine du ${startOfWeekMonday(anchorDate).toLocaleDateString("fr-FR", {
          day: "numeric",
          month: "long",
        })}`
      : anchorDate.toLocaleDateString("fr-FR", {
          month: "long",
          year: "numeric",
        });

  return (
    <div className="mx-auto max-w-5xl space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-display-sm text-on-dark font-bold tracking-tight">
            Programme
          </h1>
          {programName ? (
            <p className="text-body-md text-muted mt-1">{programName}</p>
          ) : null}
        </div>
        <Tabs
          value={view}
          onValueChange={(value) => setView(value as "week" | "month")}
        >
          <TabsList>
            <TabsTrigger value="week">Semaine</TabsTrigger>
            <TabsTrigger value="month">Mois</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="flex items-center justify-between gap-3">
        <Button variant="outline" size="icon" onClick={() => shiftAnchor(-1)}>
          <ChevronLeft className="size-4" />
        </Button>
        <p className="text-title-sm text-on-dark font-semibold">{title}</p>
        <Button variant="outline" size="icon" onClick={() => shiftAnchor(1)}>
          <ChevronRight className="size-4" />
        </Button>
      </div>

      {loading ? (
        <p className="text-muted text-sm">Chargement du calendrier…</p>
      ) : (
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
            const daySessions = sessionsByDay.get(key) ?? [];
            const isToday = isSameDay(day, new Date());
            const inMonth = view === "week" || isSameMonth(day, anchorDate);

            return (
              <div
                key={key}
                className={cn(
                  "border-hairline bg-surface-card min-h-28 rounded-lg border p-2",
                  !inMonth && "opacity-40",
                  isToday && "ring-primary/40 ring-1",
                )}
              >
                <p
                  className={cn(
                    "text-caption mb-2 font-semibold",
                    isToday ? "text-primary" : "text-muted",
                  )}
                >
                  {day.getDate()}
                </p>
                <div className="space-y-1">
                  {daySessions.map((session) => (
                    <Link
                      key={`${session.programSessionId}-${session.scheduledDateKey}`}
                      href={`/client/session/${session.programSessionId}?scheduledDate=${session.scheduledDateKey}`}
                      className="border-hairline bg-surface-elevated hover:border-primary/40 block rounded-md border px-2 py-1.5 transition-colors"
                    >
                      <p className="text-caption text-on-dark line-clamp-2 font-medium">
                        {session.name}
                      </p>
                      <SessionStatusBadge
                        status={session.status}
                        className="mt-1 scale-90"
                      />
                    </Link>
                  ))}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
