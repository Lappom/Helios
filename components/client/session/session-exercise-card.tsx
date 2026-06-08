"use client";

import { useMemo, useState } from "react";
import { ArrowLeftRight } from "lucide-react";
import { toast } from "sonner";
import { AlternativePicker } from "@/components/client/session/alternative-picker";
import { RestTimer } from "@/components/client/session/rest-timer";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { BlockExerciseItem, ExerciseBlockItem } from "@/lib/programs/types";
import { getExerciseStatus } from "@/lib/sessions/exercise-status";
import { logSetRequest } from "@/lib/sessions/api-client";
import type { SessionExecutionDetail, SetLogItem } from "@/lib/sessions/types";
import { cn } from "@/lib/utils";

type SessionExerciseCardProps = {
  block: ExerciseBlockItem;
  exercise: BlockExerciseItem;
  detail: SessionExecutionDetail;
  setLogs: SetLogItem[];
  onUpdated: (detail: SessionExecutionDetail) => void;
};

const STATUS_LABEL = {
  todo: "À faire",
  in_progress: "En cours",
  done: "Fait",
} as const;

export function SessionExerciseCard({
  block,
  exercise,
  detail,
  setLogs,
  onUpdated,
}: SessionExerciseCardProps) {
  const status = getExerciseStatus(exercise, setLogs);
  const [pickerOpen, setPickerOpen] = useState(false);
  const [restSeconds, setRestSeconds] = useState<number | null>(null);
  const [savingSet, setSavingSet] = useState<number | null>(null);

  const loggedExerciseId = setLogs.find(
    (row) => row.blockExerciseId === exercise.id,
  )?.exerciseId;

  const [selectedExerciseId, setSelectedExerciseId] = useState(
    loggedExerciseId ?? exercise.exerciseId,
  );

  const selectedExerciseName = useMemo(() => {
    if (selectedExerciseId === exercise.exerciseId) {
      return exercise.exerciseName;
    }
    return (
      exercise.alternatives.find((alt) => alt.exerciseId === selectedExerciseId)
        ?.exerciseName ?? exercise.exerciseName
    );
  }, [exercise, selectedExerciseId]);

  const prescriptions = useMemo(() => {
    if (exercise.prescriptions.length > 0) {
      return exercise.prescriptions;
    }

    return [
      {
        id: `${exercise.id}-set-1`,
        setNumber: 1,
        load: null,
        reps: null,
        restSeconds: block.sharedRestSeconds,
        tempo: null,
        rpe: null,
        durationSeconds: block.durationSeconds,
      },
    ];
  }, [block.durationSeconds, block.sharedRestSeconds, exercise]);

  async function handleLogSet(
    setNumber: number,
    prescriptionId: string | undefined,
    payload: {
      load?: string;
      reps?: string;
      skipped?: boolean;
    },
  ) {
    if (!detail.sessionLog) {
      toast.error("Démarrez la séance avant de logger des sets.");
      return;
    }

    setSavingSet(setNumber);

    try {
      const updated = await logSetRequest(detail.programSessionId, {
        sessionLogId: detail.sessionLog.id,
        blockExerciseId: exercise.id,
        setPrescriptionId: prescriptionId,
        setNumber,
        exerciseId: selectedExerciseId,
        ...payload,
      });
      onUpdated(updated);

      const prescription = prescriptions.find((row) => row.setNumber === setNumber);
      const rest =
        prescription?.restSeconds ??
        block.sharedRestSeconds ??
        null;

      if (!payload.skipped && rest && rest > 0) {
        setRestSeconds(rest);
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Impossible d'enregistrer le set.",
      );
    } finally {
      setSavingSet(null);
    }
  }

  return (
    <article
      className={cn(
        "border-hairline bg-surface-card animate-in fade-in slide-in-from-bottom-2 rounded-lg border p-5",
        status === "done" && "border-accent-emerald/30",
      )}
    >
      <div className="mb-4 flex flex-wrap items-start justify-between gap-3">
        <div className="space-y-1">
          <p className="text-caption-uppercase text-muted tracking-widest uppercase">
            {block.type}
          </p>
          <h3 className="text-title-md text-on-dark font-semibold">
            {selectedExerciseName}
          </h3>
          {exercise.notes ? (
            <p className="text-body-sm text-muted italic">{exercise.notes}</p>
          ) : null}
        </div>
        <div className="flex items-center gap-2">
          <span
            className={cn(
              "text-caption rounded-md px-2 py-1 font-medium",
              status === "done" && "bg-accent-emerald/20 text-accent-emerald",
              status === "in_progress" && "bg-primary/20 text-primary",
              status === "todo" && "bg-surface-elevated text-muted",
            )}
          >
            {STATUS_LABEL[status]}
          </span>
          {(exercise.alternatives.length > 0 || exercise.exerciseId) && (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPickerOpen(true)}
              disabled={
                !detail.sessionLog ||
                detail.sessionLog.status !== "in_progress"
              }
            >
              <ArrowLeftRight className="size-4" />
            </Button>
          )}
        </div>
      </div>

      {restSeconds ? (
        <div className="mb-4">
          <RestTimer
            seconds={restSeconds}
            onDismiss={() => setRestSeconds(null)}
          />
        </div>
      ) : null}

      <div className="space-y-3">
        {prescriptions.map((prescription) => {
          const existing = setLogs.find(
            (row) =>
              row.blockExerciseId === exercise.id &&
              row.setNumber === prescription.setNumber,
          );

          return (
            <SetRow
              key={`${exercise.id}-${prescription.setNumber}`}
              setNumber={prescription.setNumber}
              targetLoad={prescription.load}
              targetReps={prescription.reps}
              existing={existing}
              saving={savingSet === prescription.setNumber}
              disabled={
                !detail.sessionLog ||
                detail.sessionLog.status !== "in_progress"
              }
              onSave={(payload) =>
                handleLogSet(
                  prescription.setNumber,
                  exercise.prescriptions.length > 0
                    ? prescription.id
                    : undefined,
                  payload,
                )
              }
            />
          );
        })}
      </div>

      <AlternativePicker
        open={pickerOpen}
        onOpenChange={setPickerOpen}
        primaryName={exercise.exerciseName}
        primaryExerciseId={exercise.exerciseId}
        alternatives={exercise.alternatives}
        selectedExerciseId={selectedExerciseId}
        onSelect={(exerciseId) => setSelectedExerciseId(exerciseId)}
      />
    </article>
  );
}

function SetRow({
  setNumber,
  targetLoad,
  targetReps,
  existing,
  saving,
  disabled,
  onSave,
}: {
  setNumber: number;
  targetLoad: string | null;
  targetReps: string | null;
  existing?: SetLogItem;
  saving: boolean;
  disabled: boolean;
  onSave: (payload: { load?: string; reps?: string; skipped?: boolean }) => void;
}) {
  const [load, setLoad] = useState(existing?.load ?? targetLoad ?? "");
  const [reps, setReps] = useState(existing?.reps ?? "");

  return (
    <div className="bg-surface-elevated grid grid-cols-[auto_1fr_1fr_auto] items-center gap-2 rounded-md p-3">
      <span className="text-caption text-muted w-8 font-semibold">
        S{setNumber}
      </span>
      <Input
        value={load}
        onChange={(event) => setLoad(event.target.value)}
        placeholder={targetLoad ?? "Charge"}
        disabled={disabled}
        className="bg-surface-card"
      />
      <Input
        value={reps}
        onChange={(event) => setReps(event.target.value)}
        placeholder={targetReps ?? "Reps"}
        disabled={disabled}
        className="bg-surface-card"
      />
      <div className="flex gap-1">
        <Button
          size="sm"
          disabled={disabled || saving}
          onClick={() => onSave({ load, reps })}
        >
          {existing ? "MAJ" : "OK"}
        </Button>
        <Button
          size="sm"
          variant="ghost"
          disabled={disabled || saving}
          onClick={() => onSave({ skipped: true })}
        >
          —
        </Button>
      </div>
    </div>
  );
}
