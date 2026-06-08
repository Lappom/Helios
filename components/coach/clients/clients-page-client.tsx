"use client";

import { useCallback, useState } from "react";
import { AddClientDialog } from "@/components/coach/clients/add-client-dialog";
import { ClientsKanbanBoard } from "@/components/coach/clients/clients-kanban-board";
import { ClientsListView } from "@/components/coach/clients/clients-list-view";
import { ClientsQuotaBar } from "@/components/coach/clients/clients-quota-bar";
import { ImportClientsDialog } from "@/components/coach/clients/import-clients-dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { QuotaCheckResult } from "@/lib/billing/access";
import type { ClientListItem } from "@/lib/clients/service";

type ClientsPageClientProps = {
  initialClients: ClientListItem[];
  initialQuota: QuotaCheckResult;
};

export function ClientsPageClient({
  initialClients,
  initialQuota,
}: ClientsPageClientProps) {
  const [clients, setClients] = useState(initialClients);
  const [quota, setQuota] = useState(initialQuota);

  const refreshQuota = useCallback(async () => {
    const response = await fetch("/api/v1/billing/usage");
    if (response.ok) {
      const payload = await response.json();
      setQuota(payload.quotas.clients);
    }
  }, []);

  const handleClientCreated = useCallback(
    (client: ClientListItem) => {
      setClients((prev) => [client, ...prev]);
      void refreshQuota();
    },
    [refreshQuota],
  );

  const handleClientsImported = useCallback(
    (items: ClientListItem[]) => {
      setClients(items);
      void refreshQuota();
    },
    [refreshQuota],
  );

  const handleClientUpdated = useCallback(
    (client: ClientListItem) => {
      setClients((prev) =>
        prev.map((item) => (item.id === client.id ? client : item)),
      );
      void refreshQuota();
    },
    [refreshQuota],
  );

  return (
    <div className="mx-auto max-w-7xl space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-display-sm text-on-dark font-bold tracking-tight">
            Clients
          </h1>
          <p className="text-body-md text-muted mt-2">
            Pipeline CRM — prospects, essais et clients actifs.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <ImportClientsDialog onImported={handleClientsImported} />
          <AddClientDialog onCreated={handleClientCreated} />
        </div>
      </div>

      <ClientsQuotaBar quota={quota} />

      <Tabs defaultValue="kanban">
        <TabsList className="border-hairline bg-surface-card">
          <TabsTrigger value="kanban">Kanban</TabsTrigger>
          <TabsTrigger value="list">Liste</TabsTrigger>
        </TabsList>
        <TabsContent value="kanban" className="mt-6">
          <ClientsKanbanBoard
            clients={clients}
            onClientUpdated={handleClientUpdated}
          />
        </TabsContent>
        <TabsContent value="list" className="mt-6">
          <ClientsListView clients={clients} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
