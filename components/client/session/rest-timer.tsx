"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type RestTimerProps = {
  seconds: number;
  onDismiss: () => void;
};

export function RestTimer({ seconds, onDismiss }: RestTimerProps) {
  const [remaining, setRemaining] = useState(seconds);

  useEffect(() => {
    setRemaining(seconds);
  }, [seconds]);

  useEffect(() => {
    if (remaining <= 0) {
      onDismiss();
      return;
    }

    const timer = window.setInterval(() => {
      setRemaining((value) => value - 1);
    }, 1000);

    return () => window.clearInterval(timer);
  }, [remaining, onDismiss]);

  const minutes = Math.floor(remaining / 60);
  const secs = remaining % 60;

  return (
    <div className="bg-surface-elevated border-hairline animate-in fade-in slide-in-from-top-2 rounded-lg border px-4 py-4">
      <div className="flex items-center justify-between gap-4">
        <div>
          <p className="text-caption-uppercase text-muted tracking-widest uppercase">
            Repos
          </p>
          <p
            className={cn(
              "font-mono text-4xl font-bold tracking-tight",
              remaining <= 5 ? "text-primary" : "text-on-dark",
            )}
          >
            {minutes}:{String(secs).padStart(2, "0")}
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={onDismiss}>
          Passer
        </Button>
      </div>
    </div>
  );
}
