import { db } from "@/lib/db";
import {
  blockExercises,
  exerciseBlocks,
  programSessions,
  programs,
  programWeeks,
  setPrescriptions,
} from "@/lib/db/schema";
import { problem } from "@/lib/api/response";
import type { ResolvedProgramDraft } from "@/lib/ai/schemas/program-draft";
import { getProgramTree } from "./service";
import type { ProgramTree } from "./types";

export async function buildProgramFromAiDraft(
  organizationId: string,
  coachClerkUserId: string,
  draft: ResolvedProgramDraft,
): Promise<ProgramTree> {
  if (draft.weeks.length === 0) {
    throw problem({
      type: "validation-error",
      title: "Empty program draft",
      status: 422,
      detail:
        "The AI draft did not produce any sessions with resolvable exercises.",
    });
  }

  const programId = await db.transaction(async (tx) => {
    const [program] = await tx
      .insert(programs)
      .values({
        organizationId,
        coachClerkUserId,
        name: draft.name,
        description: draft.description,
        status: "draft",
      })
      .returning({ id: programs.id });

    for (let weekIndex = 0; weekIndex < draft.weeks.length; weekIndex++) {
      const week = draft.weeks[weekIndex]!;

      const [newWeek] = await tx
        .insert(programWeeks)
        .values({
          organizationId,
          programId: program!.id,
          sortOrder: weekIndex,
          label: week.label,
        })
        .returning({ id: programWeeks.id });

      for (
        let sessionIndex = 0;
        sessionIndex < week.sessions.length;
        sessionIndex++
      ) {
        const session = week.sessions[sessionIndex]!;

        const [newSession] = await tx
          .insert(programSessions)
          .values({
            organizationId,
            programWeekId: newWeek!.id,
            sortOrder: sessionIndex,
            name: session.name,
            dayOfWeek: session.dayOfWeek,
          })
          .returning({ id: programSessions.id });

        for (
          let blockIndex = 0;
          blockIndex < session.blocks.length;
          blockIndex++
        ) {
          const block = session.blocks[blockIndex]!;

          const [newBlock] = await tx
            .insert(exerciseBlocks)
            .values({
              organizationId,
              programSessionId: newSession!.id,
              sortOrder: blockIndex,
              type: block.type,
              sharedRestSeconds: block.sharedRestSeconds,
              rounds:
                block.rounds ??
                (block.type === "circuit" ? 3 : null),
              restBetweenRoundsSeconds: block.restBetweenRoundsSeconds,
              durationSeconds:
                block.durationSeconds ??
                (block.type === "amrap" ? 600 : null),
              targetRpe: block.targetRpe,
            })
            .returning({ id: exerciseBlocks.id });

          for (
            let exerciseIndex = 0;
            exerciseIndex < block.exercises.length;
            exerciseIndex++
          ) {
            const exercise = block.exercises[exerciseIndex]!;

            const [newBlockExercise] = await tx
              .insert(blockExercises)
              .values({
                organizationId,
                exerciseBlockId: newBlock!.id,
                exerciseId: exercise.exerciseId,
                sortOrder: exerciseIndex,
                notes: exercise.notes,
              })
              .returning({ id: blockExercises.id });

            if (exercise.prescriptions.length > 0) {
              await tx.insert(setPrescriptions).values(
                exercise.prescriptions.map((prescription) => ({
                  organizationId,
                  blockExerciseId: newBlockExercise!.id,
                  setNumber: prescription.setNumber,
                  load: prescription.load ?? null,
                  reps: prescription.reps ?? null,
                  restSeconds: prescription.restSeconds ?? null,
                  tempo: prescription.tempo ?? null,
                  rpe: prescription.rpe ?? null,
                  durationSeconds: prescription.durationSeconds ?? null,
                })),
              );
            }
          }
        }
      }
    }

    return program!.id;
  });

  return getProgramTree(organizationId, programId);
}
