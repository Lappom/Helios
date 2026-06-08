"use client";

import { Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Input } from "@/components/ui/input";
import {
  createBlockedDateRequest,
  deleteBlockedDateRequest,
} from "@/lib/bookings/api-client";
import type { BlockedDateDto } from "@/lib/bookings/types";
import { formatDayKey } from "@/lib/programs/calendar-utils";

type BlockedDatesPanelProps = {
  initialBlockedDates: BlockedDateDto[];
  onUpdated: (items: BlockedDateDto[]) => void;
};

export function BlockedDatesPanel({
  initialBlockedDates,
  onUpdated,
}: BlockedDatesPanelProps) {
  const [blockedDates, setBlockedDates] = useState(initialBlockedDates);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [reason, setReason] = useState("");
  const [loading, setLoading] = useState(false);

  const blockedSet = new Set(blockedDates.map((b) => b.date));

  async function handleAdd() {
    if (!selectedDate) {
      toast.error("Sélectionnez une date");
      return;
    }

    setLoading(true);
    try {
      const date = formatDayKey(selectedDate);
      const created = await createBlockedDateRequest({
        date,
        reason: reason.trim() || undefined,
      });
      const next = [...blockedDates, created].sort((a, b) =>
        a.date.localeCompare(b.date),
      );
      setBlockedDates(next);
      onUpdated(next);
      setReason("");
      setSelectedDate(undefined);
      toast.success("Date bloquée");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Impossible de bloquer la date",
      );
    } finally {
      setLoading(false);
    }
  }

  async function handleRemove(id: string) {
    setLoading(true);
    try {
      await deleteBlockedDateRequest(id);
      const next = blockedDates.filter((b) => b.id !== id);
      setBlockedDates(next);
      onUpdated(next);
      toast.success("Congé supprimé");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Suppression impossible",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      <div className="border-hairline bg-surface-card rounded-lg border p-6">
        <h3 className="text-title-sm text-on-dark mb-4 font-semibold">
          Ajouter un congé
        </h3>
        <Calendar
          mode="single"
          selected={selectedDate}
          onSelect={setSelectedDate}
          disabled={(date) => blockedSet.has(formatDayKey(date))}
          className="mx-auto"
        />
        <div className="mt-4 space-y-3">
          <Input
            placeholder="Motif (optionnel)"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            className="bg-surface-elevated border-hairline"
          />
          <Button
            className="bg-primary text-on-primary hover:bg-primary-active w-full"
            disabled={loading || !selectedDate}
            onClick={handleAdd}
          >
            Bloquer cette date
          </Button>
        </div>
      </div>

      <div className="border-hairline bg-surface-card rounded-lg border p-6">
        <h3 className="text-title-sm text-on-dark mb-4 font-semibold">
          Dates bloquées
        </h3>
        {blockedDates.length === 0 ? (
          <p className="text-body-md text-muted">Aucun congé planifié.</p>
        ) : (
          <ul className="space-y-2">
            {blockedDates.map((item) => (
              <li
                key={item.id}
                className="bg-surface-elevated flex items-center justify-between rounded-md px-3 py-2"
              >
                <div>
                  <p className="text-body-md text-on-dark font-medium">
                    {new Date(`${item.date}T12:00:00`).toLocaleDateString(
                      "fr-FR",
                      { weekday: "long", day: "numeric", month: "long" },
                    )}
                  </p>
                  {item.reason ? (
                    <p className="text-body-sm text-muted">{item.reason}</p>
                  ) : null}
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  disabled={loading}
                  onClick={() => handleRemove(item.id)}
                  className="text-accent-rose"
                >
                  <Trash2 className="size-4" />
                </Button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
