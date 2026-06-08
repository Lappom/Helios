import { CoachProfileEditor } from "@/components/coach/settings/coach-profile-editor";
import { requireRole } from "@/lib/auth/org-context";
import {
  getProfileForCoach,
  listServicesForCoach,
} from "@/lib/coach-profile/service";

export default async function CoachProfileSettingsPage() {
  const org = await requireRole("org_owner", "org_admin", "coach");
  const [profile, services] = await Promise.all([
    getProfileForCoach(org.organizationId, org.clerkUserId),
    listServicesForCoach(org.organizationId, org.clerkUserId),
  ]);

  return (
    <CoachProfileEditor
      initialProfile={profile}
      initialServices={services}
    />
  );
}
