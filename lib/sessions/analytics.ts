import { and, asc, eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { sessionLogs } from "@/lib/db/schema";
import type { ProgramAnalytics } from "./types";
import { computeSetVolume, parseLoadValue } from "./utils";

export async function getProgramAnalytics(
  organizationId: string,
  programId: string,
  clientId: string,
): Promise<ProgramAnalytics> {
  const completedLogs = await db.query.sessionLogs.findMany({
    where: and(
      eq(sessionLogs.organizationId, organizationId),
      eq(sessionLogs.clientId, clientId),
      eq(sessionLogs.status, "completed"),
    ),
    orderBy: [asc(sessionLogs.completedAt)],
    with: {
      assignment: true,
      programSession: true,
      setLogs: {
        with: {
          exercise: true,
        },
      },
    },
  });

  const programLogs = completedLogs.filter(
    (log) => log.assignment.programId === programId,
  );

  const volumeBySession = programLogs.map((log) => {
    const volume = log.setLogs.reduce((sum, row) => {
      if (row.skipped) {
        return sum;
      }
      return sum + computeSetVolume(row.load, row.reps);
    }, 0);

    return {
      sessionLogId: log.id,
      sessionName: log.programSession.name,
      completedAt: log.completedAt?.toISOString() ?? log.startedAt.toISOString(),
      volume: Math.round(volume),
    };
  });

  const loadProgression = programLogs.flatMap((log) => {
    const byExercise = new Map<
      string,
      { exerciseName: string; maxLoad: number | null }
    >();

    for (const row of log.setLogs) {
      if (row.skipped) {
        continue;
      }

      const load = parseLoadValue(row.load);
      const current = byExercise.get(row.exerciseId) ?? {
        exerciseName: row.exercise.name,
        maxLoad: null,
      };

      if (load !== null) {
        current.maxLoad =
          current.maxLoad === null ? load : Math.max(current.maxLoad, load);
      }

      byExercise.set(row.exerciseId, current);
    }

    return [...byExercise.entries()].map(([exerciseId, value]) => ({
      sessionLogId: log.id,
      completedAt: log.completedAt?.toISOString() ?? log.startedAt.toISOString(),
      exerciseId,
      exerciseName: value.exerciseName,
      maxLoad: value.maxLoad,
    }));
  });

  return {
    programId,
    clientId,
    completedSessionsCount: programLogs.length,
    volumeBySession,
    loadProgression,
  };
}
