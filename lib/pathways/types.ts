import type {
  PathwayEnrollmentStatus,
  PathwayStepType,
} from "@/lib/validators/pathways";

export type PathwayStepDetail = {
  id: string;
  sortOrder: number;
  stepType: PathwayStepType;
  delayDays: number;
  stepConfig: Record<string, unknown>;
};

export type PathwayListItem = {
  id: string;
  name: string;
  description: string | null;
  isActive: boolean;
  autoEnrollOnClientCreated: boolean;
  stepCount: number;
  lastEnrollmentAt: string | null;
  lastEnrollmentStatus: PathwayEnrollmentStatus | null;
  createdAt: string;
  updatedAt: string;
};

export type PathwayTree = PathwayListItem & {
  steps: PathwayStepDetail[];
};

export type PathwayEnrollmentItem = {
  id: string;
  pathwayId: string;
  clientId: string;
  clientName: string | null;
  triggerEventId: string;
  status: PathwayEnrollmentStatus;
  currentStepIndex: number;
  error: string | null;
  startedAt: string | null;
  completedAt: string | null;
  createdAt: string;
  stepLogs: {
    id: string;
    stepId: string;
    stepType: PathwayStepType;
    status: string;
    error: string | null;
    durationMs: number | null;
  }[];
};

export type RunPathwayInput = {
  enrollmentId: string;
  organizationId: string;
  pathwayId: string;
  clientId: string;
  coachClerkUserId: string;
  planTier: import("@/lib/auth/types").PlanTier;
  steps: PathwayStepDetail[];
};
