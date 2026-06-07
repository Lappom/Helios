"use client";

import { Show } from "@clerk/nextjs";
import type { ReactNode } from "react";

type PlanGateProps = {
  plan: string;
  children: ReactNode;
  fallback?: ReactNode;
};

export function PlanGate({ plan, children, fallback = null }: PlanGateProps) {
  return (
    <Show when={{ plan }} fallback={fallback}>
      {children}
    </Show>
  );
}
