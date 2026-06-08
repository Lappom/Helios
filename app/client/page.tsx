import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { ClientHomeContent } from "@/components/client/home/client-home-content";
import { getOrgContext } from "@/lib/auth/org-context";
import { getClientIdForUser } from "@/lib/api/require-client";
import { addDays, startOfWeekMonday } from "@/lib/programs/schedule";
import { getEnrichedSchedule } from "@/lib/sessions/service";

export default async function ClientPortalPage() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }

  const org = await getOrgContext();
  if (!org || org.role !== "client") {
    redirect("/coach");
  }

  const clientId = await getClientIdForUser(org.organizationId, userId);
  if (!clientId) {
    redirect("/sign-in");
  }

  try {
    const weekStart = startOfWeekMonday(new Date());
    const weekEnd = addDays(weekStart, 6);
    weekEnd.setHours(23, 59, 59, 999);

    const schedule = await getEnrichedSchedule(org.organizationId, clientId, {
      start: weekStart,
      end: weekEnd,
    });

    return <ClientHomeContent schedule={schedule} />;
  } catch {
    return (
      <div className="mx-auto max-w-4xl space-y-4">
        <h1 className="text-display-sm text-on-dark font-bold tracking-tight">
          Accueil
        </h1>
        <p className="text-body-md text-muted">
          Aucun programme actif pour le moment. Votre coach vous assignera un
          plan prochainement.
        </p>
      </div>
    );
  }
}
