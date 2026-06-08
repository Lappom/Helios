"use client";

import { useMemo, useState } from "react";
import { Send } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { sendNotificationRequest } from "@/lib/notifications/api-client";
import type { ClientListItem } from "@/lib/clients/service";
import {
  NOTIFICATION_CHANNELS,
  type NotificationChannel,
} from "@/lib/validators/notifications";
import { renderNotificationContent } from "@/lib/notifications/render";

const CHANNEL_LABELS: Record<NotificationChannel, string> = {
  email: "Email",
  in_app: "In-app",
  push: "Push",
};

type NotificationComposerProps = {
  clients: ClientListItem[];
  onSent?: () => void;
};

export function NotificationComposer({
  clients,
  onSent,
}: NotificationComposerProps) {
  const [channel, setChannel] = useState<NotificationChannel>("email");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState(
    "Bonjour {{clientName}},\n\nVotre coach vous envoie un rappel.",
  );
  const [selectedClientIds, setSelectedClientIds] = useState<string[]>([]);
  const [search, setSearch] = useState("");
  const [sending, setSending] = useState(false);

  const filteredClients = useMemo(() => {
    if (!search.trim()) return clients;
    const query = search.trim().toLowerCase();
    return clients.filter(
      (client) =>
        client.firstName.toLowerCase().includes(query) ||
        client.lastName.toLowerCase().includes(query) ||
        client.email.toLowerCase().includes(query),
    );
  }, [clients, search]);

  const previewClient = clients.find((client) =>
    selectedClientIds.includes(client.id),
  );

  const preview = previewClient
    ? renderNotificationContent(content, {
        clientName: `${previewClient.firstName} ${previewClient.lastName}`.trim(),
        clientEmail: previewClient.email,
      })
    : content;

  function toggleClient(clientId: string) {
    setSelectedClientIds((current) =>
      current.includes(clientId)
        ? current.filter((id) => id !== clientId)
        : [...current, clientId],
    );
  }

  async function handleSend() {
    if (selectedClientIds.length === 0) {
      toast.error("Sélectionnez au moins un client.");
      return;
    }
    if (channel === "email" && !subject.trim()) {
      toast.error("Le sujet est requis pour un email.");
      return;
    }

    setSending(true);
    try {
      const result = await sendNotificationRequest({
        channel,
        subject: subject.trim() || undefined,
        content,
        clientIds: selectedClientIds,
      });
      toast.success(`${result.sent} notification(s) envoyée(s).`);
      onSent?.();
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Envoi impossible.",
      );
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <div className="border-hairline bg-surface-card space-y-5 rounded-lg border p-6">
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="space-y-2">
            <label className="text-body-sm text-on-dark font-medium">Canal</label>
            <Select
              value={channel}
              onValueChange={(value) => setChannel(value as NotificationChannel)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {NOTIFICATION_CHANNELS.map((value) => (
                  <SelectItem key={value} value={value}>
                    {CHANNEL_LABELS[value]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          {channel === "email" ? (
            <div className="space-y-2">
              <label className="text-body-sm text-on-dark font-medium">Sujet</label>
              <Input
                value={subject}
                onChange={(event) => setSubject(event.target.value)}
                placeholder="Rappel de séance"
              />
            </div>
          ) : null}
        </div>

        <div className="space-y-2">
          <label className="text-body-sm text-on-dark font-medium">Message</label>
          <Textarea
            value={content}
            onChange={(event) => setContent(event.target.value)}
            rows={8}
            placeholder="Utilisez {{clientName}} pour personnaliser."
          />
          <p className="text-muted-soft text-caption">
            Variables : {"{{clientName}}"}, {"{{habitName}}"}, {"{{sessionName}}"}
          </p>
        </div>

        <div className="space-y-3">
          <label className="text-body-sm text-on-dark font-medium">Destinataires</label>
          <Input
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Rechercher un client"
          />
          <div className="border-hairline max-h-56 overflow-y-auto rounded-md border">
            {filteredClients.map((client) => {
              const checked = selectedClientIds.includes(client.id);
              return (
                <label
                  key={client.id}
                  className="hover:bg-surface-elevated flex cursor-pointer items-center gap-3 px-4 py-3"
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => toggleClient(client.id)}
                    className="accent-primary"
                  />
                  <span className="min-w-0 flex-1">
                    <span className="text-on-dark text-body-sm block font-medium">
                      {client.firstName} {client.lastName}
                    </span>
                    <span className="text-muted text-caption">{client.email}</span>
                  </span>
                </label>
              );
            })}
          </div>
        </div>

        <Button onClick={() => void handleSend()} disabled={sending}>
          <Send className="size-4" />
          {sending ? "Envoi..." : "Envoyer maintenant"}
        </Button>
      </div>

      <div className="border-hairline bg-surface-card rounded-lg border p-6">
        <p className="text-caption-uppercase text-muted tracking-widest uppercase">
          Aperçu
        </p>
        {channel === "email" && subject ? (
          <p className="text-on-dark text-title-sm mt-4 font-semibold">
            {previewClient
              ? renderNotificationContent(subject, {
                  clientName:
                    `${previewClient.firstName} ${previewClient.lastName}`.trim(),
                })
              : subject}
          </p>
        ) : null}
        <p className="text-body-md text-body mt-4 whitespace-pre-wrap">{preview}</p>
      </div>
    </div>
  );
}
