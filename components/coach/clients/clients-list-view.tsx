"use client";

import Link from "next/link";
import { ClientStatusBadge } from "@/components/coach/clients/client-status-badge";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import type { ClientListItem } from "@/lib/clients/service";

export function ClientsListView({ clients }: { clients: ClientListItem[] }) {
  if (clients.length === 0) {
    return (
      <div className="border-hairline bg-surface-card text-muted rounded-lg border p-10 text-center">
        Aucun client pour le moment. Ajoutez votre premier prospect.
      </div>
    );
  }

  return (
    <div className="border-hairline bg-surface-card overflow-hidden rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow className="border-hairline hover:bg-transparent">
            <TableHead>Client</TableHead>
            <TableHead>Email</TableHead>
            <TableHead>Statut</TableHead>
            <TableHead>Tags</TableHead>
            <TableHead className="text-right">Portail</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {clients.map((client) => (
            <TableRow key={client.id} className="border-hairline">
              <TableCell>
                <Link
                  href={`/coach/clients/${client.id}`}
                  className="text-on-dark hover:text-primary font-medium transition-colors"
                >
                  {client.firstName} {client.lastName}
                </Link>
              </TableCell>
              <TableCell className="text-muted">{client.email}</TableCell>
              <TableCell>
                <ClientStatusBadge status={client.status} />
              </TableCell>
              <TableCell>
                <div className="flex flex-wrap gap-1">
                  {client.tags.length === 0 ? (
                    <span className="text-muted text-xs">—</span>
                  ) : (
                    client.tags.map((tag) => (
                      <Badge key={tag.id} variant="secondary" className="rounded-md">
                        {tag.name}
                      </Badge>
                    ))
                  )}
                </div>
              </TableCell>
              <TableCell className="text-right">
                {client.clerkUserId ? (
                  <Badge variant="outline" className="rounded-md">
                    Actif
                  </Badge>
                ) : (
                  <span className="text-muted text-xs">Non invité</span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
