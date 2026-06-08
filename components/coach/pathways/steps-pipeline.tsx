"use client";

import {
  DndContext,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { PathwayStepDetail } from "@/lib/pathways/types";
import type { PathwayStepType } from "@/lib/validators/pathways";
import { PathwayStepCard } from "./pathway-step-card";

type StepsPipelineProps = {
  steps: PathwayStepDetail[];
  selectedStepId?: string | null;
  onChange: (steps: PathwayStepDetail[]) => void;
  onSelectStep?: (stepId: string) => void;
  disabled?: boolean;
};

function SortableStep({
  step,
  index,
  selected,
  onChange,
  onRemove,
  onSelect,
  disabled,
}: {
  step: PathwayStepDetail;
  index: number;
  selected?: boolean;
  onChange: (step: PathwayStepDetail) => void;
  onRemove: () => void;
  onSelect?: () => void;
  disabled?: boolean;
}) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: step.id });

  return (
    <div
      ref={setNodeRef}
      style={{
        transform: CSS.Transform.toString(transform),
        transition,
      }}
    >
      <PathwayStepCard
        step={step}
        index={index}
        selected={selected}
        dragHandleProps={{ ...attributes, ...listeners }}
        onChange={onChange}
        onRemove={onRemove}
        onSelect={onSelect}
        disabled={disabled}
      />
    </div>
  );
}

function createDraftStep(stepType: PathwayStepType): PathwayStepDetail {
  const id = `draft-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
  const configs: Record<PathwayStepType, Record<string, unknown>> = {
    program: { programId: "" },
    assessment: { templateId: "" },
    message: { content: "" },
    wait: {},
  };

  return {
    id,
    sortOrder: 0,
    stepType,
    delayDays: stepType === "wait" ? 1 : 0,
    stepConfig: configs[stepType],
  };
}

export function StepsPipeline({
  steps,
  selectedStepId,
  onChange,
  onSelectStep,
  disabled,
}: StepsPipelineProps) {
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  );

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = steps.findIndex((s) => s.id === active.id);
    const newIndex = steps.findIndex((s) => s.id === over.id);
    const reordered = arrayMove(steps, oldIndex, newIndex).map(
      (step, index) => ({ ...step, sortOrder: index }),
    );
    onChange(reordered);
  }

  function addStep(stepType: PathwayStepType) {
    const draft = createDraftStep(stepType);
    draft.sortOrder = steps.length;
    onChange([...steps, draft]);
    onSelectStep?.(draft.id);
  }

  return (
    <div className="space-y-4">
      <p className="text-caption-uppercase text-muted tracking-widest uppercase">
        Étapes du parcours
      </p>
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={steps.map((s) => s.id)}
          strategy={verticalListSortingStrategy}
        >
          <div className="space-y-3">
            {steps.map((step, index) => (
              <div key={step.id}>
                {index > 0 ? (
                  <div className="bg-hairline mx-auto mb-3 h-6 w-px" />
                ) : null}
                <SortableStep
                  step={step}
                  index={index}
                  selected={selectedStepId === step.id}
                  onChange={(updated) =>
                    onChange(
                      steps.map((item) =>
                        item.id === step.id ? updated : item,
                      ),
                    )
                  }
                  onRemove={() =>
                    onChange(steps.filter((item) => item.id !== step.id))
                  }
                  onSelect={() => onSelectStep?.(step.id)}
                  disabled={disabled}
                />
              </div>
            ))}
          </div>
        </SortableContext>
      </DndContext>

      <div className="flex flex-wrap gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => addStep("program")}
          disabled={disabled}
        >
          <Plus className="mr-1 size-3.5" />
          Programme
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => addStep("assessment")}
          disabled={disabled}
        >
          <Plus className="mr-1 size-3.5" />
          Bilan
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => addStep("message")}
          disabled={disabled}
        >
          <Plus className="mr-1 size-3.5" />
          Message
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={() => addStep("wait")}
          disabled={disabled}
        >
          <Plus className="mr-1 size-3.5" />
          Attente
        </Button>
      </div>
    </div>
  );
}
