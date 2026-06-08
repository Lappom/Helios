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
  DialogTrigger,
} from "@/components/ui/dialog";
import type { ClientListItem } from "@/lib/clients/service";

type ImportClientsDialogProps = {
  onImported: (clients: ClientListItem[]) => void;
};

export function ImportClientsDialog({ onImported }: ImportClientsDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [report, setReport] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();

    if (!file) {
      toast.error("Sélectionnez un fichier CSV.");
      return;
    }

    setLoading(true);
    setReport(null);

    try {
      const formData = new FormData();
      formData.append("file", file);

      const response = await fetch("/api/v1/clients/import", {
        method: "POST",
        body: formData,
      });

      const payload = await response.json();

      if (!response.ok) {
        toast.error(payload.detail ?? payload.title ?? "Import impossible.");
        return;
      }

      setReport(
        `${payload.imported} importé(s), ${payload.skipped} ignoré(s).` +
          (payload.errors?.length
            ? `\n${payload.errors.slice(0, 5).join("\n")}`
            : ""),
      );

      if (payload.imported > 0) {
        const listResponse = await fetch("/api/v1/clients?limit=100");
        const listPayload = await listResponse.json();
        if (listResponse.ok) {
          onImported(listPayload.items ?? []);
        }
        toast.success("Import terminé.");
      }
    } catch {
      toast.error("Erreur réseau.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline">Importer CSV</Button>
      </DialogTrigger>
      <DialogContent className="border-hairline bg-surface-card text-on-dark">
        <DialogHeader>
          <DialogTitle>Import CSV</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <p className="text-body-sm text-muted">
            Colonnes : email, firstName, lastName, status (optionnel).
          </p>
          <input
            type="file"
            accept=".csv,text/csv"
            onChange={(event) => setFile(event.target.files?.[0] ?? null)}
            className="text-body-sm text-body block w-full"
          />
          {report ? (
            <pre className="border-hairline bg-surface-elevated text-body-sm text-body max-h-40 overflow-auto rounded-lg border p-3 whitespace-pre-wrap">
              {report}
            </pre>
          ) : null}
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? "Import…" : "Importer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
