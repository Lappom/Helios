import { ProgressCharts } from "@/components/client/progress/progress-charts";

export default function ClientProgressPage() {
  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div>
        <h1 className="text-display-sm text-on-dark font-bold tracking-tight">
          Progrès
        </h1>
        <p className="text-body-md text-muted mt-2">
          Volume, charge et séances complétées sur votre programme actif.
        </p>
      </div>
      <ProgressCharts />
    </div>
  );
}
