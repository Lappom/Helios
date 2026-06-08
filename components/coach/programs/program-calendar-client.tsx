"use client";

import Link from "next/link";
import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { AssignProgramDialog } from "@/components/coach/programs/assign-program-dialog";
import { ProgramCalendarGrid } from "@/components/coach/programs/program-calendar-grid";
import { ProgramStatusBadge } from "@/components/coach/programs/program-status-badge";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  addDays,
  DAY_DROP_PREFIX,
  formatDayKey,
  getMonthGridDays,
  getWeekDays,
  parseDayKey,
  SESSION_DRAG_PREFIX,
  startOfWeekMonday,
} from "@/lib/programs/calendar-utils";
import {
  fetchAssignmentSchedule,
  patchSessionScheduleRequest,
} from "@/lib/programs/api-client";
import type {
  ProgramAssignmentItem,
  ProgramTree,
  ScheduledSession,
} from "@/lib/programs/types";

type ProgramCalendarClientProps = {
  program: ProgramTree;
  initialAssignments: ProgramAssignmentItem[];
};

export function ProgramCalendarClient({
  program,
  initialAssignments,
}: ProgramCalendarClientProps) {
  const [assignments, setAssignments] =
    useState<ProgramAssignmentItem[]>(initialAssignments);
  const [selectedAssignmentId, setSelectedAssignmentId] = useState(
    initialAssignments[0]?.id ?? "",
  );
  const [view, setView] = useState<"week" | "month">("week");
  const [anchorDate, setAnchorDate] = useState(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  });
  const [sessions, setSessions] = useState<ScheduledSession[]>([]);
  const [loading, setLoading] = useState(
    Boolean(initialAssignments[0]?.id),
  );
  const [assignOpen, setAssignOpen] = useState(false);
  const [activeSession, setActiveSession] = useState<ScheduledSession | null>(
    null,
  );

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  );

  const selectedAssignment = useMemo(
    () => assignments.find((item) => item.id === selectedAssignmentId),
    [assignments, selectedAssignmentId],
  );

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

  async function reloadSchedule() {
    if (!selectedAssignmentId) {
      return;
    }

    setLoading(true);

    try {
      const payload = await fetchAssignmentSchedule(selectedAssignmentId, {
        start: range.start.toISOString(),
        end: range.end.toISOString(),
      });
      setSessions(payload.sessions);
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Calendrier indisponible.",
      );
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    if (!selectedAssignmentId) {
      return;
    }

    let cancelled = false;

    void (async () => {
      try {
        const payload = await fetchAssignmentSchedule(selectedAssignmentId, {
          start: range.start.toISOString(),
          end: range.end.toISOString(),
        });
        if (!cancelled) {
          setSessions(payload.sessions);
        }
      } catch (error) {
        if (!cancelled) {
          toast.error(
            error instanceof Error ? error.message : "Calendrier indisponible.",
          );
        }
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [range.end, range.start, selectedAssignmentId]);

  const calendarSessions = selectedAssignmentId ? sessions : [];

  function shiftAnchor(delta: number) {
    setLoading(true);
    setAnchorDate((current) => {
      if (view === "week") {
        return addDays(current, delta * 7);
      }
      const next = new Date(current);
      next.setMonth(next.getMonth() + delta);
      return next;
    });
  }

  function handleDragStart(event: DragStartEvent) {
    const session = event.active.data.current?.session as
      | ScheduledSession
      | undefined;
    setActiveSession(session ?? null);
  }

  async function handleDragEnd(event: DragEndEvent) {
    setActiveSession(null);

    const sessionId = String(event.active.id).replace(SESSION_DRAG_PREFIX, "");
    const overId = event.over?.id;

    if (!overId || !String(overId).startsWith(DAY_DROP_PREFIX)) {
      return;
    }

    const dayKey = String(overId).replace(DAY_DROP_PREFIX, "");
    const targetDate = parseDayKey(dayKey);
    targetDate.setHours(12, 0, 0, 0);

    if (!selectedAssignmentId) {
      return;
    }

    try {
      const payload = await patchSessionScheduleRequest(
        selectedAssignmentId,
        sessionId,
        targetDate.toISOString(),
      );
      setSessions(payload.sessions);
      toast.success("Séance replanifiée.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Replanification impossible.",
      );
      void reloadSchedule();
    }
  }

  const periodLabel =
    view === "week"
      ? `Semaine du ${startOfWeekMonday(anchorDate).toLocaleDateString("fr-FR", {
          day: "numeric",
          month: "long",
          year: "numeric",
        })}`
      : anchorDate.toLocaleDateString("fr-FR", {
          month: "long",
          year: "numeric",
        });

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      <div className="border-hairline bg-surface-card rounded-lg border p-4">
        <div className="flex flex-wrap items-start justify-between gap-4">
          <div className="min-w-0 space-y-2">
            <Link
              href={`/coach/programs/${program.id}/edit`}
              className="text-muted hover:text-on-dark text-sm transition-colors"
            >
              ← Éditeur
            </Link>
            <div className="flex flex-wrap items-center gap-3">
              <h1 className="text-display-sm text-on-dark font-bold tracking-tight">
                {program.name}
              </h1>
              <ProgramStatusBadge status={program.status} />
            </div>
            <p className="text-body-md text-muted">
              Calendrier des séances assignées — glissez une séance pour la
              replanifier.
            </p>
          </div>
          <Button
            className="bg-primary text-on-primary hover:bg-primary-active font-semibold"
            onClick={() => setAssignOpen(true)}
          >
            Assigner
          </Button>
        </div>
      </div>

      <div className="border-hairline bg-surface-card flex flex-wrap items-center justify-between gap-4 rounded-lg border p-4">
        <div className="flex min-w-0 flex-1 flex-wrap items-center gap-3">
          {assignments.length > 0 ? (
            <Select
              value={selectedAssignmentId}
              onValueChange={(value) => {
                setLoading(true);
                setSelectedAssignmentId(value);
              }}
            >
              <SelectTrigger className="border-hairline bg-surface-elevated w-full max-w-xs">
                <SelectValue placeholder="Choisir un client" />
              </SelectTrigger>
              <SelectContent className="border-hairline bg-surface-card">
                {assignments.map((assignment) => (
                  <SelectItem key={assignment.id} value={assignment.id}>
                    {assignment.clientFirstName} {assignment.clientLastName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ) : (
            <p className="text-muted text-sm">
              Aucune assignation — assignez ce programme à un client.
            </p>
          )}

          {selectedAssignment ? (
            <span className="text-muted text-xs">
              Début{" "}
              {new Date(selectedAssignment.startDate).toLocaleDateString(
                "fr-FR",
              )}
            </span>
          ) : null}
        </div>

        <Tabs
          value={view}
          onValueChange={(value) => {
            setLoading(true);
            setView(value as "week" | "month");
          }}
        >
          <TabsList className="border-hairline bg-surface-elevated">
            <TabsTrigger value="week">Semaine</TabsTrigger>
            <TabsTrigger value="month">Mois</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="flex items-center justify-between gap-3">
        <Button
          variant="outline"
          size="icon"
          className="border-hairline"
          onClick={() => shiftAnchor(-1)}
        >
          <ChevronLeft className="size-4" />
        </Button>
        <p className="text-title-md text-on-dark text-center font-semibold">
          {periodLabel}
        </p>
        <Button
          variant="outline"
          size="icon"
          className="border-hairline"
          onClick={() => shiftAnchor(1)}
        >
          <ChevronRight className="size-4" />
        </Button>
      </div>

      {loading ? (
        <div className="text-muted py-16 text-center text-sm">
          Chargement du calendrier…
        </div>
      ) : assignments.length === 0 ? (
        <div className="border-hairline bg-surface-card text-muted rounded-lg border p-12 text-center">
          Assignez ce programme pour visualiser le calendrier client.
        </div>
      ) : (
        <DndContext
          sensors={sensors}
          onDragStart={handleDragStart}
          onDragEnd={(event) => void handleDragEnd(event)}
        >
          <ProgramCalendarGrid
            view={view}
            anchorDate={anchorDate}
            days={days}
            sessions={calendarSessions}
          />
          <DragOverlay>
            {activeSession ? (
              <div className="border-hairline bg-surface-elevated w-40 rounded-md border px-2 py-1.5 shadow-none">
                <p className="text-on-dark truncate text-xs font-medium">
                  {activeSession.name}
                </p>
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      )}

      <AssignProgramDialog
        programId={program.id}
        programName={program.name}
        open={assignOpen}
        onOpenChange={setAssignOpen}
        onAssigned={() => {
          window.location.reload();
        }}
      />
    </div>
  );
}
