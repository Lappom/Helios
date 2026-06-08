"use client";

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";

export const SCHEDULE_PRESETS = [
  { id: "weekly-mon-9", label: "Chaque lundi à 9h (UTC)", cron: "0 9 * * 1" },
  { id: "weekly-fri-18", label: "Chaque vendredi à 18h (UTC)", cron: "0 18 * * 5" },
  { id: "daily-8", label: "Chaque jour à 8h (UTC)", cron: "0 8 * * *" },
  { id: "custom", label: "Expression cron personnalisée", cron: "" },
] as const;

type SchedulePickerProps = {
  value: string;
  onChange: (cron: string) => void;
};

export function SchedulePicker({ value, onChange }: SchedulePickerProps) {
  const preset =
    SCHEDULE_PRESETS.find((item) => item.cron === value && item.id !== "custom")
      ?.id ?? (value ? "custom" : "weekly-mon-9");

  return (
    <div className="space-y-3">
      <Select
        value={preset}
        onValueChange={(next) => {
          const selected = SCHEDULE_PRESETS.find((item) => item.id === next);
          if (selected && selected.id !== "custom") {
            onChange(selected.cron);
          }
        }}
      >
        <SelectTrigger>
          <SelectValue placeholder="Choisir une récurrence" />
        </SelectTrigger>
        <SelectContent>
          {SCHEDULE_PRESETS.map((item) => (
            <SelectItem key={item.id} value={item.id}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
      {preset === "custom" ? (
        <Input
          value={value}
          onChange={(event) => onChange(event.target.value)}
          placeholder="0 9 * * 1"
        />
      ) : null}
    </div>
  );
}
