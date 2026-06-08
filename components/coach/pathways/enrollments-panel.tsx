"use client";

import { useEffect, useState } from "react";
import { fetchPathwayEnrollmentsRequest } from "@/lib/pathways/api-client";
import type { PathwayEnrollmentItem } from "@/lib/pathways/types";
import { cn } from "@/lib/utils";

type EnrollmentsPanelProps = {
  pathwayId: string;
};

const STATUS_STYLES: Record<string, string> = {
  completed: "text-accent-emerald",
  failed: "text-accent-rose",
  running: "text-primary",
  pending: "text-muted",
  cancelled: "text-muted",
};

export function EnrollmentsPanel({ pathwayId }: EnrollmentsPanelProps) {
  const [enrollments, setEnrollments] = useState<PathwayEnrollmentItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    void fetchPathwayEnrollmentsRequest(pathwayId)
      .then((result) => {
        if (!cancelled) setEnrollments(result.items);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [pathwayId]);

  return (
    <div className="border-hairline bg-surface-card h-full rounded-lg border p-5">
      <p className="text-caption-uppercase text-muted mb-4 tracking-widest uppercase">
        Inscriptions
      </p>
      {loading ? (
        <p className="text-body-sm text-muted">Chargement…</p>
      ) : enrollments.length === 0 ? (
        <p className="text-body-sm text-muted">
          Aucune inscription. Les nouveaux clients seront inscrits
          automatiquement si le parcours est actif avec auto-enroll.
        </p>
      ) : (
        <ul className="space-y-4">
          {enrollments.map((enrollment) => (
            <li
              key={enrollment.id}
              className="border-hairline border-b pb-3 last:border-0"
            >
              <div className="flex items-center justify-between gap-2">
                <span
                  className={cn(
                    "text-caption font-mono font-medium uppercase",
                    STATUS_STYLES[enrollment.status],
                  )}
                >
                  {enrollment.status}
                </span>
                <span className="text-caption text-muted">
                  {new Date(enrollment.createdAt).toLocaleString("fr-FR")}
                </span>
              </div>
              <p className="text-body-sm text-on-dark mt-1">
                {enrollment.clientName ?? "Client"}
              </p>
              <p className="text-caption text-muted mt-1">
                Étape {enrollment.currentStepIndex + 1}
              </p>
              {enrollment.error ? (
                <p className="text-body-sm text-accent-rose mt-1">
                  {enrollment.error}
                </p>
              ) : null}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
