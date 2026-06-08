type CoachPlaceholderPageProps = {
  title: string;
};

export function CoachPlaceholderPage({ title }: CoachPlaceholderPageProps) {
  return (
    <div className="mx-auto max-w-4xl space-y-4">
      <h1 className="text-display-sm text-on-dark font-bold tracking-tight">
        {title}
      </h1>
      <p className="text-body-md text-muted">
        Module à venir en P1 — placeholder P0.7.
      </p>
    </div>
  );
}
