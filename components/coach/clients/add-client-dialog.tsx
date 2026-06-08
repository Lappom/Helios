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
import { Input } from "@/components/ui/input";
import type { ClientListItem } from "@/lib/clients/service";
import { CLIENT_STATUS_LABELS, CLIENT_STATUS_ORDER } from "@/lib/clients/constants";
import type { ClientStatus } from "@/lib/validators/clients";

type AddClientDialogProps = {
  onCreated: (client: ClientListItem) => void;
};

export function AddClientDialog({ onCreated }: AddClientDialogProps) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    email: "",
    firstName: "",
    lastName: "",
    status: "PROSPECT" as ClientStatus,
  });

  async function handleSubmit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);

    try {
      const response = await fetch("/api/v1/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });

      const payload = await response.json();

      if (!response.ok) {
        toast.error(payload.detail ?? payload.title ?? "Impossible de créer le client.");
        return;
      }

      onCreated(payload);
      toast.success("Client ajouté.");
      setOpen(false);
      setForm({
        email: "",
        firstName: "",
        lastName: "",
        status: "PROSPECT",
      });
    } catch {
      toast.error("Erreur réseau.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>Ajouter un client</Button>
      </DialogTrigger>
      <DialogContent className="border-hairline bg-surface-card text-on-dark">
        <DialogHeader>
          <DialogTitle>Nouveau client</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Prénom"
              value={form.firstName}
              onChange={(value) => setForm((prev) => ({ ...prev, firstName: value }))}
              required
            />
            <Field
              label="Nom"
              value={form.lastName}
              onChange={(value) => setForm((prev) => ({ ...prev, lastName: value }))}
              required
            />
          </div>
          <Field
            label="Email"
            type="email"
            value={form.email}
            onChange={(value) => setForm((prev) => ({ ...prev, email: value }))}
            required
          />
          <div className="space-y-2">
            <label className="text-body-sm text-body-strong block font-medium">
              Statut
            </label>
            <select
              className="border-hairline bg-surface-elevated text-on-dark h-10 w-full rounded-lg border px-3 text-sm"
              value={form.status}
              onChange={(event) =>
                setForm((prev) => ({
                  ...prev,
                  status: event.target.value as ClientStatus,
                }))
              }
            >
              {CLIENT_STATUS_ORDER.map((status) => (
                <option key={status} value={status}>
                  {CLIENT_STATUS_LABELS[status]}
                </option>
              ))}
            </select>
          </div>
          <DialogFooter>
            <Button type="submit" disabled={loading}>
              {loading ? "Création…" : "Créer"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <div className="space-y-2">
      <label className="text-body-sm text-body-strong block font-medium">
        {label}
      </label>
      <Input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        required={required}
        className="border-hairline bg-surface-elevated"
      />
    </div>
  );
}
