"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import type { BlockExerciseAlternativeItem } from "@/lib/programs/types";

type AlternativePickerProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  primaryName: string;
  primaryExerciseId: string;
  alternatives: BlockExerciseAlternativeItem[];
  selectedExerciseId: string;
  onSelect: (exerciseId: string, exerciseName: string) => void;
};

export function AlternativePicker({
  open,
  onOpenChange,
  primaryName,
  primaryExerciseId,
  alternatives,
  selectedExerciseId,
  onSelect,
}: AlternativePickerProps) {
  const options = [
    { exerciseId: primaryExerciseId, exerciseName: primaryName },
    ...alternatives.map((alt) => ({
      exerciseId: alt.exerciseId,
      exerciseName: alt.exerciseName,
    })),
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-surface-card border-hairline">
        <DialogHeader>
          <DialogTitle className="text-on-dark">Choisir un exercice</DialogTitle>
        </DialogHeader>
        <div className="space-y-2">
          {options.map((option) => (
            <Button
              key={option.exerciseId}
              variant={
                selectedExerciseId === option.exerciseId ? "default" : "outline"
              }
              className="h-auto w-full justify-start py-3"
              onClick={() => {
                onSelect(option.exerciseId, option.exerciseName);
                onOpenChange(false);
              }}
            >
              {option.exerciseName}
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
