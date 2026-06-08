"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { Milestone, Pencil, Plus } from "lucide-react";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { createPathwayRequest } from "@/lib/pathways/api-client";
import type { PathwayListItem } from "@/lib/pathways/types";
import { cn } from "@/lib/utils";

type PathwaysListClientProps = {
  initialPathways: PathwayListItem[];
};

export function PathwaysListClient({
  initialPathways,
}: PathwaysListClientProps) {
  const router = useRouter();
  const [pathways, setPathways] = useState(initialPathways);
  const [search, setSearch] = useState("");
  const [creating, setCreating] = useState(false);

  const filtered = useMemo(() => {
    if (!search.trim()) return pathways;
    const query = search.trim().toLowerCase();
    return pathways.filter((item) =>
      item.name.toLowerCase().includes(query),
    );
  }, [pathways, search]);

  async function handleCreate() {
    setCreating(true);
    try {
      const created = await createPathwayRequest({
        name: "Nouveau parcours",
        isActive: false,
        autoEnrollOnClientCreated: false,
        steps: [
          {
            stepType: "program",
            delayDays: 0,
            stepConfig: { programId: "" },
            sortOrder: 0,
          },
        ],
      });
      setPathways((prev) => [
        {
          id: created.id,
          name: created.name,
          description: created.description,
          isActive: created.isActive,
          autoEnrollOnClientCreated: created.autoEnrollOnClientCreated,
          stepCount: created.steps.length,
          lastEnrollmentAt: created.lastEnrollmentAt,
          lastEnrollmentStatus: created.lastEnrollmentStatus,
          createdAt: created.createdAt,
          updatedAt: created.updatedAt,
        },
        ...prev,
      ]);
      router.push(`/coach/pathways/${created.id}/edit`);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erreur");
    } finally {
      setCreating(false);
    }
  }

  async function handleToggleActive(item: PathwayListItem) {
    try {
      const response = await fetch(`/api/v1/pathways/${item.id}/toggle`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ isActive: !item.isActive }),
      });
      if (!response.ok) {
        const body = (await response.json().catch(() => null)) as {
          detail?: string;
        } | null;
        throw new Error(body?.detail ?? "Échec de la mise à jour");
      }
      const updated = (await response.json()) as PathwayListItem;
      setPathways((prev) =>
        prev.map((pathway) =>
          pathway.id === item.id
            ? {
                ...pathway,
                isActive: updated.isActive,
                autoEnrollOnClientCreated: updated.autoEnrollOnClientCreated,
              }
            : pathway.autoEnrollOnClientCreated && updated.autoEnrollOnClientCreated
              ? { ...pathway, autoEnrollOnClientCreated: false }
              : pathway,
        ),
      );
      toast.success(
        updated.isActive ? "Parcours activé." : "Parcours désactivé.",
      );
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erreur");
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-caption-uppercase text-primary tracking-widest uppercase">
            Coaching
          </p>
          <h1 className="text-display-sm text-on-dark font-bold tracking-tight">
            Parcours
          </h1>
          <p className="text-body-sm text-muted mt-1 max-w-xl">
            Séquences multi-étapes avec délais — inscrites automatiquement aux
            nouveaux clients.
          </p>
        </div>
        <Button onClick={handleCreate} disabled={creating}>
          <Plus className="mr-2 size-4" />
          {creating ? "Création…" : "Nouveau parcours"}
        </Button>
      </div>

      <Input
        placeholder="Rechercher un parcours…"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
        className="max-w-sm"
      />

      {filtered.length === 0 ? (
        <div className="border-hairline bg-surface-card rounded-lg border p-12 text-center">
          <Milestone className="text-muted mx-auto mb-4 size-10" />
          <p className="text-body-sm text-muted">
            Aucun parcours. Créez votre premier parcours d&apos;onboarding.
          </p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((item) => (
            <div
              key={item.id}
              className="border-hairline bg-surface-card flex flex-col rounded-lg border p-5"
            >
              <div className="mb-3 flex items-start justify-between gap-2">
                <div>
                  <h2 className="text-title-sm text-on-dark font-semibold">
                    {item.name}
                  </h2>
                  <p className="text-caption text-muted mt-1">
                    {item.stepCount} étape{item.stepCount !== 1 ? "s" : ""}
                  </p>
                </div>
                <span
                  className={cn(
                    "text-caption font-mono uppercase",
                    item.isActive ? "text-accent-emerald" : "text-muted",
                  )}
                >
                  {item.isActive ? "actif" : "inactif"}
                </span>
              </div>

              {item.autoEnrollOnClientCreated ? (
                <span className="text-caption-uppercase text-primary mb-3 inline-block tracking-widest">
                  Auto — nouveau client
                </span>
              ) : null}

              {item.description ? (
                <p className="text-body-sm text-muted mb-4 line-clamp-2">
                  {item.description}
                </p>
              ) : (
                <div className="mb-4" />
              )}

              <div className="mt-auto flex flex-wrap gap-2">
                <Button asChild variant="secondary" size="sm">
                  <Link href={`/coach/pathways/${item.id}/edit`}>
                    <Pencil className="mr-1 size-3.5" />
                    Éditer
                  </Link>
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => void handleToggleActive(item)}
                >
                  {item.isActive ? "Désactiver" : "Activer"}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
