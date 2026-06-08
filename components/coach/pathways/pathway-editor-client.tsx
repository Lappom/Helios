"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { FeatureGate } from "@/components/billing/feature-gate";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { patchPathwayRequest } from "@/lib/pathways/api-client";
import type { PathwayTree } from "@/lib/pathways/types";
import { EnrollmentsPanel } from "./enrollments-panel";
import { StepsPipeline } from "./steps-pipeline";

type PathwayEditorClientProps = {
  initialPathway: PathwayTree;
};

function UpgradeFallback() {
  return (
    <div className="border-hairline bg-surface-card space-y-4 rounded-lg border p-8 text-center">
      <p className="text-title-md text-on-dark font-semibold">
        Parcours coaching — Pro+
      </p>
      <p className="text-body-sm text-muted">
        Passez au plan Pro+ pour éditer vos parcours.
      </p>
      <Button asChild>
        <Link href="/tarifs">Voir les plans</Link>
      </Button>
    </div>
  );
}

export function PathwayEditorClient({
  initialPathway,
}: PathwayEditorClientProps) {
  const [pathway, setPathway] = useState(initialPathway);
  const [selectedStepId, setSelectedStepId] = useState<string | null>(
    initialPathway.steps[0]?.id ?? null,
  );
  const [saving, setSaving] = useState(false);

  async function handleSave() {
    setSaving(true);
    try {
      const updated = await patchPathwayRequest(pathway.id, {
        name: pathway.name,
        description: pathway.description,
        isActive: pathway.isActive,
        autoEnrollOnClientCreated: pathway.autoEnrollOnClientCreated,
        steps: pathway.steps.map((step, index) => ({
          stepType: step.stepType,
          delayDays: step.delayDays,
          stepConfig: step.stepConfig,
          sortOrder: index,
        })),
      });
      setPathway(updated);
      toast.success("Parcours enregistré.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Enregistrement impossible.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <FeatureGate feature="coaching_journeys" fallback={<UpgradeFallback />}>
      <div className="space-y-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <Button asChild variant="ghost" size="icon">
              <Link href="/coach/pathways" aria-label="Retour">
                <ArrowLeft className="size-4" />
              </Link>
            </Button>
            <div>
              <p className="text-caption-uppercase text-primary tracking-widest uppercase">
                Parcours
              </p>
              <h1 className="text-display-sm text-on-dark font-bold tracking-tight">
                {pathway.name}
              </h1>
            </div>
          </div>
          <Button onClick={handleSave} disabled={saving}>
            {saving ? "Enregistrement…" : "Enregistrer"}
          </Button>
        </div>

        <div className="grid gap-6 lg:grid-cols-[1fr_320px]">
          <div className="space-y-6">
            <div className="border-hairline bg-surface-card space-y-4 rounded-lg border p-6">
              <Input
                value={pathway.name}
                onChange={(e) =>
                  setPathway((prev) => ({ ...prev, name: e.target.value }))
                }
              />
              <Textarea
                placeholder="Description"
                value={pathway.description ?? ""}
                onChange={(e) =>
                  setPathway((prev) => ({
                    ...prev,
                    description: e.target.value,
                  }))
                }
                rows={2}
              />
              <label className="flex cursor-pointer items-center gap-3">
                <input
                  type="checkbox"
                  checked={pathway.autoEnrollOnClientCreated}
                  onChange={(e) =>
                    setPathway((prev) => ({
                      ...prev,
                      autoEnrollOnClientCreated: e.target.checked,
                    }))
                  }
                  className="border-hairline size-4 rounded border"
                />
                <span className="text-body-sm text-on-dark">
                  Inscription auto (nouveau client)
                </span>
              </label>
              {pathway.autoEnrollOnClientCreated && !pathway.isActive ? (
                <p className="text-body-sm text-muted">
                  Activez le parcours pour que l&apos;inscription auto prenne
                  effet.
                </p>
              ) : null}
            </div>

            <div className="border-hairline bg-surface-card rounded-lg border p-6">
              <StepsPipeline
                steps={pathway.steps}
                selectedStepId={selectedStepId}
                onChange={(steps) =>
                  setPathway((prev) => ({ ...prev, steps }))
                }
                onSelectStep={setSelectedStepId}
              />
            </div>
          </div>

          <EnrollmentsPanel pathwayId={pathway.id} />
        </div>
      </div>
    </FeatureGate>
  );
}
