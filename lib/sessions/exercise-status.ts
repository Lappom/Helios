import type { BlockExerciseItem } from "@/lib/programs/types";
import type { SetLogItem } from "./types";

export type ExerciseExecutionStatus = "todo" | "in_progress" | "done";

export function getExerciseStatus(
  exercise: BlockExerciseItem,
  setLogs: SetLogItem[],
): ExerciseExecutionStatus {
  const logged = setLogs.filter((row) => row.blockExerciseId === exercise.id);
  const prescriptionCount = exercise.prescriptions.length;

  if (prescriptionCount === 0) {
    if (
      logged.some(
        (row) => row.skipped || row.reps || row.load || row.durationSeconds,
      )
    ) {
      return "done";
    }
    return logged.length > 0 ? "in_progress" : "todo";
  }

  const completedSets = logged.filter(
    (row) =>
      row.skipped || row.reps || row.load || row.durationSeconds || row.rpe,
  ).length;

  if (completedSets >= prescriptionCount) {
    return "done";
  }

  if (completedSets > 0) {
    return "in_progress";
  }

  return "todo";
}
