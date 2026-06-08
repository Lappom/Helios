"use client";

import { Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { putAvailabilityRequest } from "@/lib/bookings/api-client";
import type { AvailabilityRuleDto } from "@/lib/bookings/types";
import { SERVICE_TYPES, SLOT_DURATIONS } from "@/lib/validators/bookings";

const DAY_LABELS = [
  "Dimanche",
  "Lundi",
  "Mardi",
  "Mercredi",
  "Jeudi",
  "Vendredi",
  "Samedi",
];

type EditableRule = {
  key: string;
  dayOfWeek: number;
  startTime: string;
  endTime: string;
  slotDurationMinutes: 30 | 45 | 60;
  serviceTypes: Array<"assessment" | "coaching" | "call">;
};

type AvailabilityWeekGridProps = {
  initialRules: AvailabilityRuleDto[];
  onSaved: (rules: AvailabilityRuleDto[]) => void;
};

function toEditable(rule: AvailabilityRuleDto, index: number): EditableRule {
  return {
    key: rule.id ?? `rule-${index}`,
    dayOfWeek: rule.dayOfWeek,
    startTime: rule.startTime,
    endTime: rule.endTime,
    slotDurationMinutes: rule.slotDurationMinutes as 30 | 45 | 60,
    serviceTypes: rule.serviceTypes,
  };
}

function defaultRule(dayOfWeek: number): EditableRule {
  return {
    key: `new-${dayOfWeek}-${Date.now()}`,
    dayOfWeek,
    startTime: "09:00",
    endTime: "17:00",
    slotDurationMinutes: 30,
    serviceTypes: ["coaching"],
  };
}

export function AvailabilityWeekGrid({
  initialRules,
  onSaved,
}: AvailabilityWeekGridProps) {
  const [rules, setRules] = useState<EditableRule[]>(() =>
    initialRules.map(toEditable),
  );
  const [saving, setSaving] = useState(false);

  function updateRule(key: string, patch: Partial<EditableRule>) {
    setRules((prev) =>
      prev.map((rule) => (rule.key === key ? { ...rule, ...patch } : rule)),
    );
  }

  function removeRule(key: string) {
    setRules((prev) => prev.filter((rule) => rule.key !== key));
  }

  function addRule(dayOfWeek: number) {
    setRules((prev) => [...prev, defaultRule(dayOfWeek)]);
  }

  async function handleSave() {
    setSaving(true);
    try {
      const payload = rules.map(({ dayOfWeek, startTime, endTime, slotDurationMinutes, serviceTypes }) => ({
        dayOfWeek,
        startTime,
        endTime,
        slotDurationMinutes,
        serviceTypes,
      }));
      const saved = await putAvailabilityRequest({ rules: payload });
      onSaved(saved);
      setRules(saved.map(toEditable));
      toast.success("Disponibilités enregistrées");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Enregistrement impossible",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-6">
      <p className="text-body-md text-muted">
        Définissez vos plages horaires par jour. Les créneaux sont générés en
        fuseau Europe/Paris.
      </p>

      <div className="space-y-4">
        {DAY_LABELS.map((label, dayOfWeek) => {
          const dayRules = rules.filter((r) => r.dayOfWeek === dayOfWeek);
          return (
            <div
              key={dayOfWeek}
              className="border-hairline bg-surface-card rounded-lg border p-4"
            >
              <div className="mb-3 flex items-center justify-between">
                <h3 className="text-title-sm text-on-dark font-semibold">
                  {label}
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => addRule(dayOfWeek)}
                >
                  <Plus className="mr-1 size-4" />
                  Ajouter
                </Button>
              </div>

              {dayRules.length === 0 ? (
                <p className="text-body-sm text-muted">Indisponible</p>
              ) : (
                <div className="space-y-3">
                  {dayRules.map((rule) => (
                    <div
                      key={rule.key}
                      className="bg-surface-elevated flex flex-wrap items-end gap-3 rounded-md p-3"
                    >
                      <div className="space-y-1">
                        <label className="text-caption text-muted">Début</label>
                        <Input
                          type="time"
                          value={rule.startTime}
                          onChange={(e) =>
                            updateRule(rule.key, { startTime: e.target.value })
                          }
                          className="bg-surface-card border-hairline w-32"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-caption text-muted">Fin</label>
                        <Input
                          type="time"
                          value={rule.endTime}
                          onChange={(e) =>
                            updateRule(rule.key, { endTime: e.target.value })
                          }
                          className="bg-surface-card border-hairline w-32"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-caption text-muted">
                          Créneaux
                        </label>
                        <Select
                          value={String(rule.slotDurationMinutes)}
                          onValueChange={(v) =>
                            updateRule(rule.key, {
                              slotDurationMinutes: Number(v) as 30 | 45 | 60,
                            })
                          }
                        >
                          <SelectTrigger className="bg-surface-card border-hairline w-28">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {SLOT_DURATIONS.map((d) => (
                              <SelectItem key={d} value={String(d)}>
                                {d} min
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="space-y-1">
                        <label className="text-caption text-muted">
                          Prestations
                        </label>
                        <div className="flex flex-wrap gap-2">
                          {SERVICE_TYPES.map((type) => {
                            const active = rule.serviceTypes.includes(type);
                            return (
                              <button
                                key={type}
                                type="button"
                                onClick={() => {
                                  const next = active
                                    ? rule.serviceTypes.filter((t) => t !== type)
                                    : [...rule.serviceTypes, type];
                                  if (next.length > 0) {
                                    updateRule(rule.key, { serviceTypes: next });
                                  }
                                }}
                                className={
                                  active
                                    ? "bg-primary text-on-primary rounded-md px-2 py-1 text-xs font-semibold"
                                    : "border-hairline text-muted rounded-md border px-2 py-1 text-xs"
                                }
                              >
                                {type}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeRule(rule.key)}
                        className="text-accent-rose"
                      >
                        <Trash2 className="size-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </div>

      <Button
        className="bg-primary text-on-primary hover:bg-primary-active"
        disabled={saving}
        onClick={handleSave}
      >
        {saving ? "Enregistrement…" : "Enregistrer les disponibilités"}
      </Button>
    </div>
  );
}
