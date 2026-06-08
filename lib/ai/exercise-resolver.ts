import { listExercises } from "@/lib/exercises/service";
import type {
  ProgramDraft,
  ResolvedProgramDraft,
} from "@/lib/ai/schemas/program-draft";

async function resolveExerciseQuery(
  organizationId: string,
  coachClerkUserId: string,
  exerciseQuery: string,
): Promise<{ exerciseId: string; exerciseName: string } | null> {
  const { items } = await listExercises(organizationId, coachClerkUserId, {
    search: exerciseQuery,
    page: 1,
    limit: 5,
    offset: 0,
  });

  const match = items[0];
  if (!match) {
    return null;
  }

  return { exerciseId: match.id, exerciseName: match.name };
}

export async function resolveProgramDraft(
  organizationId: string,
  coachClerkUserId: string,
  draft: ProgramDraft,
): Promise<ResolvedProgramDraft> {
  const unresolvedExercises: string[] = [];
  const cache = new Map<string, { exerciseId: string; exerciseName: string }>();

  async function getResolved(query: string) {
    const key = query.trim().toLowerCase();
    if (cache.has(key)) {
      return cache.get(key)!;
    }

    const resolved = await resolveExerciseQuery(
      organizationId,
      coachClerkUserId,
      query,
    );

    if (resolved) {
      cache.set(key, resolved);
    }

    return resolved;
  }

  const weeks = [];

  for (const week of draft.weeks) {
    const sessions = [];

    for (const session of week.sessions) {
      const blocks = [];

      for (const block of session.blocks) {
        const exercises = [];

        for (const exercise of block.exercises) {
          const resolved = await getResolved(exercise.exerciseQuery);

          if (!resolved) {
            unresolvedExercises.push(exercise.exerciseQuery);
            continue;
          }

          exercises.push({
            exerciseId: resolved.exerciseId,
            exerciseName: resolved.exerciseName,
            notes: exercise.notes ?? null,
            prescriptions: exercise.prescriptions,
          });
        }

        if (exercises.length === 0) {
          continue;
        }

        blocks.push({
          type: block.type,
          sharedRestSeconds: block.sharedRestSeconds ?? null,
          rounds: block.rounds ?? null,
          restBetweenRoundsSeconds: block.restBetweenRoundsSeconds ?? null,
          durationSeconds: block.durationSeconds ?? null,
          targetRpe: block.targetRpe ?? null,
          exercises,
        });
      }

      if (blocks.length === 0) {
        continue;
      }

      sessions.push({
        name: session.name,
        dayOfWeek: session.dayOfWeek ?? null,
        blocks,
      });
    }

    if (sessions.length === 0) {
      continue;
    }

    weeks.push({
      label: week.label,
      sessions,
    });
  }

  return {
    name: draft.name,
    description: draft.description ?? null,
    weeks,
    unresolvedExercises: [...new Set(unresolvedExercises)],
  };
}
