import type { NotificationAnalytics } from "@/lib/notifications/types";

type AnalyticsKpiGridProps = {
  analytics: NotificationAnalytics;
};

export function AnalyticsKpiGrid({ analytics }: AnalyticsKpiGridProps) {
  const cards = [
    {
      label: "Envoyées",
      value: String(analytics.sent),
      highlight: true,
    },
    {
      label: "Taux d'ouverture",
      value: `${analytics.openRate}%`,
      highlight: true,
    },
    {
      label: "Taux de clic",
      value: `${analytics.clickRate}%`,
      highlight: true,
    },
    {
      label: "Échecs",
      value: String(analytics.failed),
      highlight: false,
    },
  ];

  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <div
          key={card.label}
          className="border-hairline bg-surface-card rounded-lg border p-6"
        >
          <p className="text-caption-uppercase text-muted">{card.label}</p>
          <p
            className={
              card.highlight
                ? "text-primary text-stat-display mt-2 font-bold tracking-tight"
                : "text-on-dark text-title-lg mt-2 font-bold"
            }
          >
            {card.value}
          </p>
        </div>
      ))}
    </div>
  );
}
