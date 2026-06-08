"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { toast } from "sonner";
import { ClientsQuotaBar } from "@/components/coach/clients/clients-quota-bar";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { QuotaCheckResult } from "@/lib/billing/access";
import type { ClientListItem } from "@/lib/clients/service";
import { assignProgramRequest } from "@/lib/programs/api-client";
import { cn } from "@/lib/utils";

type AssignProgramDialogProps = {
  programId: string;
  programName: string;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAssigned?: () => void;
};

export function AssignProgramDialog({
  programId,
  programName,
  open,
  onOpenChange,
  onAssigned,
}: AssignProgramDialogProps) {
  const [clients, setClients] = useState<ClientListItem[]>([]);
  const [quota, setQuota] = useState<QuotaCheckResult | null>(null);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [startDate, setStartDate] = useState<Date>(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return today;
  });
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(false);
  const [loadingData, setLoadingData] = useState(false);

  useEffect(() => {
    if (!open) {
      return;
    }

    setLoadingData(true);
    setSelectedIds([]);

    Promise.all([
      fetch("/api/v1/clients?limit=100")
        .then((response) => response.json())
        .then((payload: { items: ClientListItem[] }) => payload.items ?? []),
      fetch("/api/v1/billing/usage")
        .then((response) => response.json())
        .then(
          (payload: { quotas: { clients: QuotaCheckResult } }) =>
            payload.quotas.clients,
        ),
    ])
      .then(([clientItems, quotaResult]) => {
        setClients(clientItems);
        setQuota(quotaResult);
      })
      .catch(() => {
        toast.error("Impossible de charger les clients.");
      })
      .finally(() => {
        setLoadingData(false);
      });
  }, [open]);

  const assignableClients = useMemo(
    () =>
      clients.filter(
        (client) => client.status === "ACTIVE" || client.status === "TRIAL",
      ),
    [clients],
  );

  const filteredClients = useMemo(() => {
    if (!search.trim()) {
      return assignableClients;
    }

    const query = search.trim().toLowerCase();
    return assignableClients.filter((client) => {
      const fullName = `${client.firstName} ${client.lastName}`.toLowerCase();
      return (
        fullName.includes(query) || client.email.toLowerCase().includes(query)
      );
    });
  }, [assignableClients, search]);

  function toggleClient(clientId: string) {
    setSelectedIds((prev) =>
      prev.includes(clientId)
        ? prev.filter((id) => id !== clientId)
        : [...prev, clientId],
    );
  }

  async function handleAssign() {
    if (selectedIds.length === 0) {
      toast.error("Sélectionnez au moins un client.");
      return;
    }

    setLoading(true);

    try {
      const result = await assignProgramRequest(programId, {
        clientIds: selectedIds,
        startDate: startDate.toISOString(),
      });

      const createdCount = result.created.length;
      const skippedCount = result.skipped.length;

      if (createdCount > 0) {
        toast.success(
          <span>
            {createdCount} client{createdCount > 1 ? "s" : ""} assigné
            {createdCount > 1 ? "s" : ""}.{" "}
            <Link
              href={`/coach/programs/${programId}/calendar`}
              className="text-primary underline"
            >
              Voir le calendrier
            </Link>
          </span>,
        );
        onAssigned?.();
        onOpenChange(false);
      }

      if (skippedCount > 0 && createdCount === 0) {
        toast.error(result.skipped[0]?.reason ?? "Assignation impossible.");
      } else if (skippedCount > 0) {
        toast.message(
          `${skippedCount} client${skippedCount > 1 ? "s" : ""} ignoré${skippedCount > 1 ? "s" : ""}.`,
        );
      }
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Assignation impossible.",
      );
    } finally {
      setLoading(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="border-hairline bg-surface-card max-h-[90vh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-on-dark">
            Assigner « {programName} »
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {quota ? <ClientsQuotaBar quota={quota} /> : null}

          <div className="space-y-2">
            <p className="text-title-sm text-on-dark">Date de début</p>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="border-hairline w-full justify-start font-normal"
                >
                  {startDate.toLocaleDateString("fr-FR", {
                    weekday: "long",
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </Button>
              </PopoverTrigger>
              <PopoverContent
                className="border-hairline bg-surface-card w-auto p-0"
                align="start"
              >
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={(date) => {
                    if (date) {
                      setStartDate(date);
                    }
                  }}
                />
              </PopoverContent>
            </Popover>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3">
              <p className="text-title-sm text-on-dark">Clients actifs</p>
              <span className="text-muted text-xs">
                {selectedIds.length} sélectionné
                {selectedIds.length > 1 ? "s" : ""}
              </span>
            </div>
            <Input
              value={search}
              onChange={(event) => setSearch(event.target.value)}
              placeholder="Rechercher…"
              className="border-hairline bg-surface-elevated"
            />
            <div className="border-hairline max-h-56 space-y-1 overflow-y-auto rounded-lg border p-2">
              {loadingData ? (
                <p className="text-muted p-4 text-center text-sm">
                  Chargement…
                </p>
              ) : filteredClients.length === 0 ? (
                <p className="text-muted p-4 text-center text-sm">
                  Aucun client ACTIVE ou TRIAL disponible.
                </p>
              ) : (
                filteredClients.map((client) => {
                  const checked = selectedIds.includes(client.id);
                  return (
                    <label
                      key={client.id}
                      className={cn(
                        "hover:bg-surface-elevated flex cursor-pointer items-center gap-3 rounded-md px-3 py-2 transition-colors",
                        checked && "bg-surface-elevated",
                      )}
                    >
                      <Checkbox
                        checked={checked}
                        onCheckedChange={() => toggleClient(client.id)}
                      />
                      <span className="min-w-0 flex-1">
                        <span className="text-on-dark block text-sm font-medium">
                          {client.firstName} {client.lastName}
                        </span>
                        <span className="text-muted block truncate text-xs">
                          {client.email}
                        </span>
                      </span>
                    </label>
                  );
                })
              )}
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            className="border-hairline"
            onClick={() => onOpenChange(false)}
          >
            Annuler
          </Button>
          <Button
            className="bg-primary text-on-primary hover:bg-primary-active font-semibold"
            disabled={loading || selectedIds.length === 0}
            onClick={() => void handleAssign()}
          >
            {loading ? "Assignation…" : "Assigner"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
