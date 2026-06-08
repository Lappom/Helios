"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { ProgramAssignmentWithProgram } from "@/lib/programs/types";
import { fetchActiveClientProgram } from "@/lib/programs/api-client";

type ClientActiveProgramCardProps = {
  clientId: string;
};

export function ClientActiveProgramCard({
  clientId,
}: ClientActiveProgramCardProps) {
  const [assignment, setAssignment] =
    useState<ProgramAssignmentWithProgram | null>(null);
  const [loading, setLoading] = useState(true);
  const [missing, setMissing] = useState(false);

  useEffect(() => {
    setLoading(true);
    setMissing(false);

    fetchActiveClientProgram(clientId)
      .then((payload) => {
        setAssignment(payload);
      })
      .catch(() => {
        setAssignment(null);
        setMissing(true);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [clientId]);

  return (
    <section className="border-hairline bg-surface-card space-y-4 rounded-lg border p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-title-lg text-on-dark font-bold">Programme actif</h2>
        {assignment ? (
          <Link
            href={`/coach/programs/${assignment.programId}/calendar`}
            className="text-primary text-sm font-medium hover:underline"
          >
            Voir le calendrier
          </Link>
        ) : null}
      </div>

      {loading ? (
        <p className="text-muted text-sm">Chargement…</p>
      ) : missing || !assignment ? (
        <p className="text-muted text-sm">
          Aucun programme sportif actif pour ce client.
        </p>
      ) : (
        <div className="space-y-2">
          <p className="text-on-dark text-lg font-semibold">
            {assignment.program.name}
          </p>
          <p className="text-muted text-sm">
            Début le{" "}
            {new Date(assignment.startDate).toLocaleDateString("fr-FR", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
          {assignment.program.description ? (
            <p className="text-body-md text-muted line-clamp-2">
              {assignment.program.description}
            </p>
          ) : null}
        </div>
      )}
    </section>
  );
}
