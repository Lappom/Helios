import "server-only";

import {
  executePathwayStepStep,
  markEnrollmentCompletedStep,
  markEnrollmentFailedStep,
  markEnrollmentRunningStep,
  sleepDelayStep,
} from "../steps";
import type { RunPathwayInput } from "../types";

export async function runPathwayWorkflow(input: RunPathwayInput) {
  "use workflow";

  await markEnrollmentRunningStep(input.enrollmentId);

  try {
    for (let index = 0; index < input.steps.length; index += 1) {
      const step = input.steps[index]!;

      if (step.delayDays > 0) {
        await sleepDelayStep(step.delayDays);
      }

      if (step.stepType === "wait") {
        await executePathwayStepStep(input, step, index);
        continue;
      }

      await executePathwayStepStep(input, step, index);
    }

    await markEnrollmentCompletedStep(input.enrollmentId);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Workflow failed";
    await markEnrollmentFailedStep(input.enrollmentId, message);
    throw error;
  }
}
