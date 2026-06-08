"use client";

import { useState } from "react";
import { toast } from "sonner";
import { ExerciseVideoUpload } from "@/components/coach/exercises/exercise-video-upload";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import type { PlanTier } from "@/lib/auth/types";
import type { ExerciseCategoryItem, ExerciseListItem } from "@/lib/exercises/types";
import {
  EQUIPMENT_TYPES,
  EXERCISE_TYPES,
  MUSCLE_GROUPS,
  type ExerciseType,
} from "@/lib/validators/exercises";
import {
  labelEquipment,
  labelExerciseType,
  labelMuscle,
} from "@/lib/exercises/constants";

type ExerciseFormDialogProps = {
  planTier: PlanTier;
  categories: ExerciseCategoryItem[];
  exercise?: ExerciseListItem;
  triggerLabel?: string;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
  onCreated?: (exercise: ExerciseListItem) => void;
  onUpdated?: (exercise: ExerciseListItem) => void;
  onCategoriesChange?: () => void;
};

export function ExerciseFormDialog({
  planTier,
  categories,
  exercise,
  triggerLabel = "Créer un exercice",
  open: controlledOpen,
  onOpenChange,
  onCreated,
  onUpdated,
  onCategoriesChange,
}: ExerciseFormDialogProps) {
  const [internalOpen, setInternalOpen] = useState(false);
  const open = controlledOpen ?? internalOpen;
  const setOpen = onOpenChange ?? setInternalOpen;
  const [loading, setLoading] = useState(false);
  const [videoUrl, setVideoUrl] = useState(exercise?.media.videoUrl ?? "");
  const [form, setForm] = useState({
    name: exercise?.name ?? "",
    description: exercise?.description ?? "",
    instructions: exercise?.instructions ?? "",
    type: (exercise?.type ?? "strength") as ExerciseType,
    muscleGroups: exercise?.muscleGroups ?? ["full_body"],
    equipment: exercise?.equipment ?? ["bodyweight"],
    categoryId: exercise?.categoryId ?? "",
  });

  function toggleArrayValue(key: "muscleGroups" | "equipment", value: string) {
    setForm((prev) => {
      const current = prev[key];
      const exists = current.includes(value);
      const next = exists
        ? current.filter((item) => item !== value)
        : [...current, value];
      return { ...prev, [key]: next.length > 0 ? next : [value] };
    });
  }

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);

    try {
      const payloadBody = {
        name: form.name,
        description: form.description || undefined,
        instructions: form.instructions || undefined,
        type: form.type,
        muscleGroups: form.muscleGroups,
        equipment: form.equipment,
        categoryId: form.categoryId || undefined,
        media: videoUrl
          ? { videoUrl, videoType: "blob" as const }
          : {},
      };

      const response = await fetch(
        exercise ? `/api/v1/exercises/${exercise.id}` : "/api/v1/exercises",
        {
          method: exercise ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payloadBody),
        },
      );
      const payload = await response.json();

      if (!response.ok) {
        toast.error(payload.detail ?? payload.title ?? "Enregistrement impossible.");
        return;
      }

      if (exercise) {
        onUpdated?.(payload);
        toast.success("Exercice mis à jour.");
      } else {
        onCreated?.(payload);
        toast.success("Exercice créé.");
      }
      setOpen(false);
    } catch {
      toast.error("Erreur réseau.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      {!exercise ? (
        <DialogTrigger asChild>
          <Button>{triggerLabel}</Button>
        </DialogTrigger>
      ) : null}
      <DialogContent className="border-hairline bg-surface-card text-on-dark max-h-[90vh] overflow-y-auto sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>
            {exercise ? "Modifier l'exercice" : "Nouvel exercice custom"}
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-5">
          <Field label="Nom">
            <Input
              required
              value={form.name}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, name: event.target.value }))
              }
              className="border-hairline bg-surface-elevated text-on-dark"
            />
          </Field>

          <Field label="Description">
            <textarea
              value={form.description}
              onChange={(event) =>
                setForm((prev) => ({ ...prev, description: event.target.value }))
              }
              rows={2}
              className="border-hairline bg-surface-elevated text-on-dark w-full rounded-lg border px-3 py-2 text-sm"
            />
          </Field>

          <Field label="Consignes">
            <textarea
              value={form.instructions}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  instructions: event.target.value,
                }))
              }
              rows={4}
              className="border-hairline bg-surface-elevated text-on-dark w-full rounded-lg border px-3 py-2 text-sm"
            />
          </Field>

          <Field label="Type">
            <div className="flex flex-wrap gap-2">
              {EXERCISE_TYPES.map((type) => (
                <button
                  key={type}
                  type="button"
                  onClick={() => setForm((prev) => ({ ...prev, type }))}
                  className={
                    form.type === type
                      ? "bg-primary text-on-primary rounded-md px-3 py-1.5 text-xs font-semibold"
                      : "border-hairline bg-surface-elevated rounded-md border px-3 py-1.5 text-xs"
                  }
                >
                  {labelExerciseType(type)}
                </button>
              ))}
            </div>
          </Field>

          <Field label="Muscles">
            <div className="flex flex-wrap gap-2">
              {MUSCLE_GROUPS.slice(0, 12).map((muscle) => (
                <button
                  key={muscle}
                  type="button"
                  onClick={() => toggleArrayValue("muscleGroups", muscle)}
                  className={
                    form.muscleGroups.includes(muscle)
                      ? "bg-primary text-on-primary rounded-md px-2.5 py-1 text-xs font-semibold"
                      : "border-hairline bg-surface-elevated rounded-md border px-2.5 py-1 text-xs"
                  }
                >
                  {labelMuscle(muscle)}
                </button>
              ))}
            </div>
          </Field>

          <Field label="Équipement">
            <div className="flex flex-wrap gap-2">
              {EQUIPMENT_TYPES.slice(0, 10).map((equipment) => (
                <button
                  key={equipment}
                  type="button"
                  onClick={() => toggleArrayValue("equipment", equipment)}
                  className={
                    form.equipment.includes(equipment)
                      ? "bg-primary text-on-primary rounded-md px-2.5 py-1 text-xs font-semibold"
                      : "border-hairline bg-surface-elevated rounded-md border px-2.5 py-1 text-xs"
                  }
                >
                  {labelEquipment(equipment)}
                </button>
              ))}
            </div>
          </Field>

          {categories.length > 0 ? (
            <Field label="Catégorie">
              <select
                value={form.categoryId}
                onChange={(event) =>
                  setForm((prev) => ({ ...prev, categoryId: event.target.value }))
                }
                className="border-hairline bg-surface-elevated text-on-dark w-full rounded-lg border px-3 py-2 text-sm"
              >
                <option value="">Aucune</option>
                {categories.map((category) => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </Field>
          ) : null}

          <ExerciseVideoUpload
            planTier={planTier}
            value={videoUrl}
            onUploaded={setVideoUrl}
          />

          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? "Enregistrement…" : exercise ? "Mettre à jour" : "Créer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function Field({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <label className="block space-y-2">
      <span className="text-body-sm text-body-strong font-medium">{label}</span>
      {children}
    </label>
  );
}
