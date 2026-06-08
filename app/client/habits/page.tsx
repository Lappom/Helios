import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { HabitsDailyClient } from "@/components/client/habits/habits-daily-client";
import { getOrgContext } from "@/lib/auth/org-context";
import { getClientIdForUser } from "@/lib/api/require-client";
import { hasFeature } from "@/lib/billing/access";
import { listClientHabits } from "@/lib/habits/service";

export default async function ClientHabitsPage() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }

  const org = await getOrgContext();
  if (!org || org.role !== "client") {
    redirect("/coach");
  }

  const allowed = await hasFeature("habits");
  if (!allowed) {
    redirect("/client");
  }

  const clientId = await getClientIdForUser(org.organizationId, userId);
  if (!clientId) {
    redirect("/sign-in");
  }

  const habits = await listClientHabits(org.organizationId, clientId);

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <header className="space-y-2">
        <p className="text-caption-uppercase text-primary tracking-widest uppercase">
          Discipline
        </p>
        <h1 className="text-display-sm text-on-dark font-bold tracking-tight">
          Mes habitudes
        </h1>
      </header>

      <HabitsDailyClient initialHabits={habits} />
    </div>
  );
}
