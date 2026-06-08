"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";
import { CoachAiChatPanel } from "@/components/coach/ai/coach-ai-chat-panel";
import { Button } from "@/components/ui/button";

export function CoachAiChatTrigger() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        type="button"
        onClick={() => setOpen(true)}
        className="bg-primary text-on-primary hover:bg-primary-active fixed right-6 bottom-6 z-40 size-12 rounded-full p-0 font-semibold shadow-none"
        aria-label="Ouvrir l'assistant IA"
      >
        <Sparkles className="size-5" />
      </Button>
      <CoachAiChatPanel open={open} onOpenChange={setOpen} />
    </>
  );
}
