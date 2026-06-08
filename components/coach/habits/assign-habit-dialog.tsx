"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { assignHabitApi, fetchClientsForAssign } from "@/lib/habits/api-client";
import type { HabitListItem } from "@/lib/habits/types";

type AssignHabitDialogProps = {
  habit: HabitListItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAssigned: (habitId: string) => void;
};

export function AssignHabitDialog({
  habit,
  open,
  onOpenChange,
  onAssigned,
}: AssignHabitDialogProps) {
  const [clients, setClients] = useState<
    Array<{ id: string; firstName: string; lastName: string }>
  >([]);
  const [clientId, setClientId] = useState("");
  const [startDate, setStartDate] = useState(
    new Date().toISOString().slice(0, 10),
  );
  const [reminderTime, setReminderTime] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }

    fetchClientsForAssign()
      .then((items) => {
        setClients(items);
        if (items[0]) {
          setClientId(items[0].id);
        }
      })
      .catch(() => {
        toast.error("Impossible de charger les clients.");
      });
  }, [open]);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!habit || !clientId) {
      return;
    }

    setLoading(true);
    try {
      await assignHabitApi(habit.id, {
        clientId,
        startDate,
        reminderTime: reminderTime || null,
      });
      onAssigned(habit.id);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erreur");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-surface-card border-hairline">
        <DialogHeader>
          <DialogTitle className="text-on-dark">
            Assigner {habit?.emoji} {habit?.name}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <span className="text-sm font-medium">Client</span>
            <Select value={clientId} onValueChange={setClientId}>
              <SelectTrigger>
                <SelectValue placeholder="Choisir un client" />
              </SelectTrigger>
              <SelectContent>
                {clients.map((client) => (
                  <SelectItem key={client.id} value={client.id}>
                    {client.firstName} {client.lastName}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label htmlFor="habit-start-date" className="text-sm font-medium">
              Date de début
            </label>
            <Input
              id="habit-start-date"
              type="date"
              value={startDate}
              onChange={(event) => setStartDate(event.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <label htmlFor="habit-reminder-time" className="text-sm font-medium">
              Rappel push (optionnel, UTC)
            </label>
            <Input
              id="habit-reminder-time"
              type="time"
              value={reminderTime}
              onChange={(event) => setReminderTime(event.target.value)}
            />
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={loading || !clientId}>
              {loading ? "Assignation…" : "Assigner"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
