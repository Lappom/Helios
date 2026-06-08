"use client";

import {
  ClipboardList,
  Clock,
  Dumbbell,
  GripVertical,
  MessageSquare,
  Trash2,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import type { PathwayStepDetail } from "@/lib/pathways/types";
import {
  PATHWAY_STEP_TYPES,
  type PathwayStepType,
} from "@/lib/validators/pathways";
import { cn } from "@/lib/utils";

const STEP_LABELS: Record<PathwayStepType, string> = {
  program: "Programme",
  assessment: "Bilan",
  message: "Message",
  wait: "Attente",
};

const STEP_ICONS: Record<PathwayStepType, LucideIcon> = {
  program: Dumbbell,
  assessment: ClipboardList,
  message: MessageSquare,
  wait: Clock,
};

type PathwayStepCardProps = {
  step: PathwayStepDetail;
  index: number;
  selected?: boolean;
  dragHandleProps?: React.HTMLAttributes<HTMLButtonElement>;
  onChange: (step: PathwayStepDetail) => void;
  onRemove: () => void;
  onSelect?: () => void;
  disabled?: boolean;
};

export function PathwayStepCard({
  step,
  index,
  selected,
  dragHandleProps,
  onChange,
  onRemove,
  onSelect,
  disabled,
}: PathwayStepCardProps) {
  const Icon = STEP_ICONS[step.stepType];

  function updateConfig(key: string, value: unknown) {
    onChange({
      ...step,
      stepConfig: { ...step.stepConfig, [key]: value },
    });
  }

  return (
    <div
      className={cn(
        "border-hairline bg-surface-card relative rounded-lg border p-5 transition-colors",
        selected && "border-primary",
      )}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") onSelect?.();
      }}
      role={onSelect ? "button" : undefined}
      tabIndex={onSelect ? 0 : undefined}
    >
      <div className="mb-4 flex items-start justify-between gap-3">
        <div className="flex items-center gap-2">
          <button
            type="button"
            className="text-muted hover:text-on-dark cursor-grab p-1"
            {...dragHandleProps}
            disabled={disabled}
            onClick={(e) => e.stopPropagation()}
          >
            <GripVertical className="size-4" />
          </button>
          <span className="text-caption text-muted font-mono">{index + 1}</span>
          <Icon className="text-primary size-4" />
          <span className="text-title-sm text-on-dark font-semibold">
            {STEP_LABELS[step.stepType]}
          </span>
          {step.delayDays > 0 ? (
            <span className="text-caption-uppercase text-primary tracking-widest">
              J+{step.delayDays}
            </span>
          ) : null}
        </div>
        <Button
          type="button"
          variant="ghost"
          size="icon"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          disabled={disabled}
          aria-label="Supprimer l'étape"
        >
          <Trash2 className="size-4" />
        </Button>
      </div>

      <div
        className="space-y-4"
        onClick={(e) => e.stopPropagation()}
        onKeyDown={(e) => e.stopPropagation()}
      >
        <div className="grid gap-4 sm:grid-cols-2">
          <Select
            value={step.stepType}
            onValueChange={(value) =>
              onChange({
                ...step,
                stepType: value as PathwayStepType,
                stepConfig: {},
                delayDays: value === "wait" ? Math.max(step.delayDays, 1) : step.delayDays,
              })
            }
            disabled={disabled}
          >
            <SelectTrigger>
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PATHWAY_STEP_TYPES.map((type) => (
                <SelectItem key={type} value={type}>
                  {STEP_LABELS[type]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Input
            type="number"
            min={step.stepType === "wait" ? 1 : 0}
            max={365}
            placeholder="Délai (jours)"
            value={step.delayDays}
            onChange={(e) =>
              onChange({
                ...step,
                delayDays: Math.max(
                  0,
                  Math.min(365, Number.parseInt(e.target.value, 10) || 0),
                ),
              })
            }
            disabled={disabled}
          />
        </div>

        {step.stepType === "program" ? (
          <Input
            placeholder="ID du programme publié"
            value={String(step.stepConfig.programId ?? "")}
            onChange={(e) => updateConfig("programId", e.target.value)}
            disabled={disabled}
          />
        ) : null}

        {step.stepType === "assessment" ? (
          <Input
            placeholder="ID du template de bilan"
            value={String(step.stepConfig.templateId ?? "")}
            onChange={(e) => updateConfig("templateId", e.target.value)}
            disabled={disabled}
          />
        ) : null}

        {step.stepType === "message" ? (
          <Textarea
            placeholder="Message au client"
            value={String(step.stepConfig.content ?? "")}
            onChange={(e) => updateConfig("content", e.target.value)}
            disabled={disabled}
            rows={4}
          />
        ) : null}

        {step.stepType === "wait" ? (
          <p className="text-body-sm text-muted">
            Pause de {step.delayDays} jour{step.delayDays !== 1 ? "s" : ""} avant
            l&apos;étape suivante.
          </p>
        ) : null}
      </div>
    </div>
  );
}
