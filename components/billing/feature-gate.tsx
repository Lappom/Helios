"use client";

import { Show } from "@clerk/nextjs";
import type { ReactNode } from "react";
import type { ClerkFeature } from "@/lib/billing/plans";

type FeatureGateProps = {
  feature: ClerkFeature | string;
  children: ReactNode;
  fallback?: ReactNode;
};

export function FeatureGate({
  feature,
  children,
  fallback = null,
}: FeatureGateProps) {
  return (
    <Show when={{ feature }} fallback={fallback}>
      {children}
    </Show>
  );
}
