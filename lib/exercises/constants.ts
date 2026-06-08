import type { ExerciseType } from "@/lib/validators/exercises";

export const EXERCISE_TYPE_LABELS: Record<ExerciseType, string> = {
  strength: "Force",
  cardio: "Cardio",
  mobility: "Mobilité",
  plyometric: "Pliométrie",
};

export const MUSCLE_GROUP_LABELS: Record<string, string> = {
  chest: "Pectoraux",
  back: "Dos",
  shoulders: "Épaules",
  biceps: "Biceps",
  triceps: "Triceps",
  forearms: "Avant-bras",
  quadriceps: "Quadriceps",
  hamstrings: "Ischio-jambiers",
  glutes: "Fessiers",
  calves: "Mollets",
  core: "Core",
  abs: "Abdominaux",
  obliques: "Obliques",
  traps: "Trapèzes",
  lats: "Grands dorsaux",
  hip_flexors: "Fléchisseurs de hanche",
  adductors: "Adducteurs",
  abductors: "Abducteurs",
  full_body: "Corps entier",
};

export const EQUIPMENT_LABELS: Record<string, string> = {
  barbell: "Barre",
  dumbbell: "Haltères",
  kettlebell: "Kettlebell",
  machine: "Machine",
  cable: "Poulie",
  bodyweight: "Poids du corps",
  resistance_band: "Élastique",
  medicine_ball: "Med ball",
  smith_machine: "Smith",
  trap_bar: "Trap bar",
  pull_up_bar: "Barre de traction",
  bench: "Banc",
  ez_bar: "Barre EZ",
  suspension_trainer: "TRX",
  other: "Autre",
};

export function labelMuscle(value: string): string {
  return MUSCLE_GROUP_LABELS[value] ?? value.replace(/_/g, " ");
}

export function labelEquipment(value: string): string {
  return EQUIPMENT_LABELS[value] ?? value.replace(/_/g, " ");
}

export function labelExerciseType(value: ExerciseType): string {
  return EXERCISE_TYPE_LABELS[value];
}
