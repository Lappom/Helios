import { notFound, redirect } from "next/navigation";
import { ProgramCalendarClient } from "@/components/coach/programs/program-calendar-client";
import { requireRole } from "@/lib/auth/org-context";
import { listProgramAssignments } from "@/lib/programs/assignments";
import { getProgramTree } from "@/lib/programs/service";
import { ApiProblemError } from "@/lib/api/response";

type PageProps = {
  params: Promise<{ id: string }>;
};

export default async function CoachProgramCalendarPage({ params }: PageProps) {
  const org = await requireRole(
    "org_owner",
    "org_admin",
    "coach",
    "assistant",
  );
  const { id } = await params;

  let program;

  try {
    program = await getProgramTree(org.organizationId, id);
  } catch (error) {
    if (error instanceof ApiProblemError && error.problem.status === 404) {
      notFound();
    }
    throw error;
  }

  if (program.status !== "published") {
    redirect(`/coach/programs/${id}/edit`);
  }

  const assignments = await listProgramAssignments(org.organizationId, id);

  return (
    <ProgramCalendarClient
      program={program}
      initialAssignments={assignments}
    />
  );
}
