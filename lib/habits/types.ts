import type { habitAssignmentStatusEnum, habitFrequencyEnum } from "@/lib/db/schema/enums";

export type HabitFrequency = (typeof habitFrequencyEnum.enumValues)[number];
export type HabitAssignmentStatus =
  (typeof habitAssignmentStatusEnum.enumValues)[number];

export type HabitListItem = {
  id: string;
  name: string;
  emoji: string;
  message: string;
  frequency: HabitFrequency;
  isPredefined: boolean;
  activeAssignmentCount: number;
  createdAt: string;
  updatedAt: string;
};

export type ClientHabitAssignment = {
  assignmentId: string;
  habitId: string;
  name: string;
  emoji: string;
  message: string;
  frequency: HabitFrequency;
  startDate: string;
  reminderTime: string | null;
  todayCompleted: boolean;
  currentStreak: number;
  logDate: string;
};

export type HabitLogResult = {
  id: string;
  assignmentId: string;
  logDate: string;
  completed: boolean;
  completedAt: string | null;
};

export type HabitAssignmentStats = {
  assignmentId: string;
  habitId: string;
  habitName: string;
  emoji: string;
  frequency: HabitFrequency;
  currentStreak: number;
  longestStreak: number;
  completionRate: number;
};

export type HabitWeeklyDay = {
  date: string;
  completionRate: number;
  completedCount: number;
  expectedCount: number;
};

export type ClientHabitStatsReport = {
  clientId: string;
  start: string;
  end: string;
  averageCompletionRate: number;
  assignments: HabitAssignmentStats[];
  weeklyBreakdown: HabitWeeklyDay[];
};

export type OrgWeeklyHabitSummary = {
  averageCompletionRate: number;
  weeklyBreakdown: HabitWeeklyDay[];
  activeAssignments: number;
};

export type ClientHabitsSummary = {
  totalToday: number;
  completedToday: number;
  remainingToday: number;
};
