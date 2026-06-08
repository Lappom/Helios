"use client";

import { type ReactNode, useEffect, useMemo, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { fetchClientProgress } from "@/lib/sessions/api-client";
import type { ProgramAnalytics } from "@/lib/sessions/types";

export function ProgressCharts() {
  const [analytics, setAnalytics] = useState<ProgramAnalytics | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    fetchClientProgress()
      .then(setAnalytics)
      .catch(() => setError(true))
      .finally(() => setLoading(false));
  }, []);

  const volumeData = useMemo(() => {
    if (!analytics) {
      return [];
    }

    return analytics.volumeBySession.map((point, index) => ({
      label: `S${index + 1}`,
      volume: point.volume,
      name: point.sessionName,
    }));
  }, [analytics]);

  const loadData = useMemo(() => {
    if (!analytics) {
      return [];
    }

    const byExercise = new Map<
      string,
      { exerciseName: string; points: { label: string; load: number }[] }
    >();

    analytics.loadProgression.forEach((point, index) => {
      if (point.maxLoad === null) {
        return;
      }

      const current = byExercise.get(point.exerciseId) ?? {
        exerciseName: point.exerciseName,
        points: [],
      };

      current.points.push({
        label: `S${index + 1}`,
        load: point.maxLoad,
      });
      byExercise.set(point.exerciseId, current);
    });

    const first = [...byExercise.values()][0];
    return first?.points ?? [];
  }, [analytics]);

  if (loading) {
    return <p className="text-muted text-sm">Chargement des statistiques…</p>;
  }

  if (error || !analytics) {
    return (
      <div className="border-hairline bg-surface-card rounded-lg border p-6">
        <p className="text-body-md text-muted">
          Impossible de charger vos statistiques pour le moment.
        </p>
      </div>
    );
  }

  if (analytics.completedSessionsCount < 2) {
    return (
      <div className="border-hairline bg-surface-card rounded-lg border p-8 text-center">
        <p className="text-primary text-stat-display font-bold">
          {analytics.completedSessionsCount}
        </p>
        <p className="text-title-md text-on-dark mt-2 font-semibold">
          séance complétée
        </p>
        <p className="text-body-md text-muted mt-2">
          Complétez au moins 2 séances pour afficher les graphiques de
          progression.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="border-hairline bg-surface-card rounded-lg border p-5">
        <p className="text-caption-uppercase text-muted tracking-widest uppercase">
          Séances complétées
        </p>
        <p className="text-primary text-stat-display font-bold">
          {analytics.completedSessionsCount}
        </p>
      </div>

      <ChartCard title="Volume par séance">
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={volumeData}>
            <CartesianGrid stroke="var(--hairline)" vertical={false} />
            <XAxis dataKey="label" stroke="var(--muted)" />
            <YAxis stroke="var(--muted)" />
            <Tooltip
              contentStyle={{
                background: "var(--surface-card)",
                border: "1px solid var(--hairline)",
                borderRadius: "8px",
              }}
            />
            <Bar dataKey="volume" fill="var(--chart-1)" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      {loadData.length > 0 ? (
        <ChartCard title="Progression charge">
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={loadData}>
              <CartesianGrid stroke="var(--hairline)" vertical={false} />
              <XAxis dataKey="label" stroke="var(--muted)" />
              <YAxis stroke="var(--muted)" />
              <Tooltip
                contentStyle={{
                  background: "var(--surface-card)",
                  border: "1px solid var(--hairline)",
                  borderRadius: "8px",
                }}
              />
              <Line
                type="monotone"
                dataKey="load"
                stroke="var(--chart-3)"
                strokeWidth={2}
                dot={{ fill: "var(--chart-1)" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
      ) : null}
    </div>
  );
}

function ChartCard({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <section className="border-hairline bg-surface-card rounded-lg border p-5">
      <h2 className="text-title-md text-on-dark mb-4 font-semibold">{title}</h2>
      {children}
    </section>
  );
}
