"use client";

import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type CreateHabitDialogProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (input: {
    name: string;
    emoji: string;
    message: string;
    frequency: "daily" | "weekly";
  }) => Promise<void>;
};

export function CreateHabitDialog({
  open,
  onOpenChange,
  onSubmit,
}: CreateHabitDialogProps) {
  const [name, setName] = useState("");
  const [emoji, setEmoji] = useState("✅");
  const [message, setMessage] = useState("");
  const [frequency, setFrequency] = useState<"daily" | "weekly">("daily");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    if (!name.trim()) {
      toast.error("Le nom est requis.");
      return;
    }

    setLoading(true);
    try {
      await onSubmit({
        name: name.trim(),
        emoji: emoji.trim() || "✅",
        message: message.trim(),
        frequency,
      });
      setName("");
      setEmoji("✅");
      setMessage("");
      setFrequency("daily");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Erreur");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="bg-surface-card border-hairline">
        <DialogHeader>
          <DialogTitle className="text-on-dark">
            Créer une habitude custom
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-[80px_1fr]">
            <div className="space-y-2">
              <label htmlFor="habit-emoji" className="text-sm font-medium">
                Emoji
              </label>
              <Input
                id="habit-emoji"
                value={emoji}
                onChange={(event) => setEmoji(event.target.value)}
                maxLength={8}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="habit-name" className="text-sm font-medium">
                Nom
              </label>
              <Input
                id="habit-name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder="Ex. Stretching matinal"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label htmlFor="habit-message" className="text-sm font-medium">
              Message motivant
            </label>
            <textarea
              id="habit-message"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder="Un rappel court pour le client…"
              rows={3}
              className="border-hairline bg-surface-elevated text-on-dark placeholder:text-muted w-full rounded-md border px-3 py-2 text-sm"
            />
          </div>

          <div className="space-y-2">
            <span className="text-sm font-medium">Fréquence</span>
            <Select
              value={frequency}
              onValueChange={(value: "daily" | "weekly") => setFrequency(value)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily">Quotidien</SelectItem>
                <SelectItem value="weekly">Hebdomadaire</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="ghost"
              onClick={() => onOpenChange(false)}
            >
              Annuler
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Création…" : "Créer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
