"use client";

import {
  DndContext,
  DragOverlay,
  PointerSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from "@dnd-kit/core";
import Link from "next/link";
import { useMemo, useState } from "react";
import { toast } from "sonner";
import { ClientStatusBadge } from "@/components/coach/clients/client-status-badge";
import { Badge } from "@/components/ui/badge";
import {
  CLIENT_STATUS_LABELS,
  CLIENT_STATUS_ORDER,
} from "@/lib/clients/constants";
import type { ClientListItem } from "@/lib/clients/service";
import type { ClientStatus } from "@/lib/validators/clients";
import { cn } from "@/lib/utils";

type ClientsKanbanBoardProps = {
  clients: ClientListItem[];
  onClientUpdated: (client: ClientListItem) => void;
};

export function ClientsKanbanBoard({
  clients,
  onClientUpdated,
}: ClientsKanbanBoardProps) {
  const [activeId, setActiveId] = useState<string | null>(null);
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
  );

  const grouped = useMemo(() => {
    const map = Object.fromEntries(
      CLIENT_STATUS_ORDER.map((status) => [status, [] as ClientListItem[]]),
    ) as Record<ClientStatus, ClientListItem[]>;

    for (const client of clients) {
      map[client.status].push(client);
    }

    return map;
  }, [clients]);

  const activeClient = activeId
    ? clients.find((client) => client.id === activeId)
    : null;

  async function handleDragEnd(event: DragEndEvent) {
    setActiveId(null);

    const clientId = String(event.active.id);
    const overId = event.over?.id;

    if (!overId || !CLIENT_STATUS_ORDER.includes(overId as ClientStatus)) {
      return;
    }

    const nextStatus = overId as ClientStatus;
    const client = clients.find((item) => item.id === clientId);

    if (!client || client.status === nextStatus) {
      return;
    }

    try {
      const response = await fetch(`/api/v1/clients/${clientId}/status`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: nextStatus }),
      });

      const payload = await response.json();

      if (!response.ok) {
        toast.error(payload.detail ?? payload.title ?? "Changement de statut impossible.");
        return;
      }

      onClientUpdated(payload);
    } catch {
      toast.error("Erreur réseau.");
    }
  }

  function handleDragStart(event: DragStartEvent) {
    setActiveId(String(event.active.id));
  }

  return (
    <DndContext
      sensors={sensors}
      onDragStart={handleDragStart}
      onDragEnd={handleDragEnd}
    >
      <div className="grid gap-4 xl:grid-cols-5 lg:grid-cols-3 md:grid-cols-2">
        {CLIENT_STATUS_ORDER.map((status) => (
          <KanbanColumn
            key={status}
            status={status}
            clients={grouped[status]}
          />
        ))}
      </div>
      <DragOverlay>
        {activeClient ? <KanbanCard client={activeClient} isOverlay /> : null}
      </DragOverlay>
    </DndContext>
  );
}

function KanbanColumn({
  status,
  clients,
}: {
  status: ClientStatus;
  clients: ClientListItem[];
}) {
  const { setNodeRef, isOver } = useDroppable({ id: status });

  return (
    <div
      ref={setNodeRef}
      className={cn(
        "border-hairline bg-surface-soft min-h-80 rounded-lg border p-3 transition-colors",
        isOver && "ring-primary/40 ring-2",
      )}
    >
      <div className="mb-3 flex items-center justify-between gap-2">
        <h3 className="text-title-sm text-on-dark font-semibold">
          {CLIENT_STATUS_LABELS[status]}
        </h3>
        <span className="text-caption text-muted">{clients.length}</span>
      </div>
      <div className="space-y-3">
        {clients.map((client) => (
          <DraggableKanbanCard key={client.id} client={client} />
        ))}
      </div>
    </div>
  );
}

function DraggableKanbanCard({ client }: { client: ClientListItem }) {
  const { attributes, listeners, setNodeRef, transform, isDragging } =
    useDraggable({ id: client.id });

  const style = transform
    ? { transform: `translate3d(${transform.x}px, ${transform.y}px, 0)` }
    : undefined;

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <KanbanCard client={client} isDragging={isDragging} />
    </div>
  );
}

function KanbanCard({
  client,
  isDragging,
  isOverlay,
}: {
  client: ClientListItem;
  isDragging?: boolean;
  isOverlay?: boolean;
}) {
  return (
    <div
      className={cn(
        "border-hairline bg-surface-card rounded-lg border p-3",
        (isDragging || isOverlay) && "opacity-80 shadow-none ring-2 ring-primary/30",
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div>
          <Link
            href={`/coach/clients/${client.id}`}
            className="text-on-dark hover:text-primary text-sm font-semibold transition-colors"
            onClick={(event) => event.stopPropagation()}
          >
            {client.firstName} {client.lastName}
          </Link>
          <p className="text-caption text-muted mt-1 truncate">{client.email}</p>
        </div>
        <ClientStatusBadge status={client.status} />
      </div>
      {client.tags.length > 0 ? (
        <div className="mt-3 flex flex-wrap gap-1">
          {client.tags.map((tag) => (
            <Badge key={tag.id} variant="secondary" className="rounded-md">
              {tag.name}
            </Badge>
          ))}
        </div>
      ) : null}
    </div>
  );
}
