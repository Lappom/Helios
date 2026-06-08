"use client";

import { useMemo, useState } from "react";
import { Plus, Search } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { AssignHabitDialog } from "./assign-habit-dialog";
import { CreateHabitDialog } from "./create-habit-dialog";
import { HabitsLibraryGrid } from "./habits-library-grid";
import { HabitsWeeklyDashboard } from "./habits-weekly-dashboard";
import { createHabitApi } from "@/lib/habits/api-client";
import type { HabitListItem, OrgWeeklyHabitSummary } from "@/lib/habits/types";

type HabitsPageClientProps = {
  initialHabits: HabitListItem[];
  weeklySummary: OrgWeeklyHabitSummary;
};

export function HabitsPageClient({
  initialHabits,
  weeklySummary,
}: HabitsPageClientProps) {
  const [habits, setHabits] = useState(initialHabits);
  const [search, setSearch] = useState("");
  const [createOpen, setCreateOpen] = useState(false);
  const [assignHabit, setAssignHabit] = useState<HabitListItem | null>(null);

  const filtered = useMemo(() => {
    if (!search.trim()) {
      return habits;
    }
    const query = search.trim().toLowerCase();
    return habits.filter(
      (habit) =>
        habit.name.toLowerCase().includes(query) ||
        habit.message.toLowerCase().includes(query),
    );
  }, [habits, search]);

  async function handleCreated(habit: HabitListItem) {
    setHabits((prev) => [habit, ...prev]);
    setCreateOpen(false);
    toast.success("Habitude créée.");
  }

  async function handleCreateSubmit(input: {
    name: string;
    emoji: string;
    message: string;
    frequency: "daily" | "weekly";
  }) {
    const habit = await createHabitApi(input);
    await handleCreated(habit);
  }

  function handleAssigned(habitId: string) {
    setHabits((prev) =>
      prev.map((habit) =>
        habit.id === habitId
          ? {
              ...habit,
              activeAssignmentCount: habit.activeAssignmentCount + 1,
            }
          : habit,
      ),
    );
    setAssignHabit(null);
    toast.success("Habitude assignée.");
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-caption-uppercase text-primary tracking-widest uppercase">
            Engagement client
          </p>
          <h1 className="text-display-sm text-on-dark font-bold tracking-tight">
            Habitudes
          </h1>
        </div>
        <Button onClick={() => setCreateOpen(true)}>
          <Plus className="mr-2 size-4" />
          Nouvelle habitude
        </Button>
      </div>

      <div className="grid gap-8 xl:grid-cols-[2fr_1fr]">
        <div className="space-y-6">
          <div className="relative max-w-md">
            <Search className="text-muted absolute top-1/2 left-3 size-4 -translate-y-1/2" />
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Rechercher une habitude…"
              className="pl-10"
            />
          </div>

          <HabitsLibraryGrid
            habits={filtered}
            onAssign={(habit) => setAssignHabit(habit)}
          />
        </div>

        <HabitsWeeklyDashboard summary={weeklySummary} />
      </div>

      <CreateHabitDialog
        open={createOpen}
        onOpenChange={setCreateOpen}
        onSubmit={handleCreateSubmit}
      />

      <AssignHabitDialog
        habit={assignHabit}
        open={assignHabit !== null}
        onOpenChange={(open) => {
          if (!open) {
            setAssignHabit(null);
          }
        }}
        onAssigned={handleAssigned}
      />
    </div>
  );
}
