"use client";

import { useState } from "react";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { createNotificationTemplateRequest } from "@/lib/notifications/api-client";
import type { NotificationTemplateItem } from "@/lib/notifications/types";
import {
  NOTIFICATION_CHANNELS,
  NOTIFICATION_EVENT_TYPES,
  NOTIFICATION_TRIGGERS,
  type NotificationChannel,
  type NotificationEventType,
  type NotificationTrigger,
} from "@/lib/validators/notifications";
import { SchedulePicker, SCHEDULE_PRESETS } from "./schedule-picker";

type CreateTemplateDialogProps = {
  onCreated: (template: NotificationTemplateItem) => void;
};

export function CreateTemplateDialog({ onCreated }: CreateTemplateDialogProps) {
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [channel, setChannel] = useState<NotificationChannel>("email");
  const [trigger, setTrigger] = useState<NotificationTrigger>("manual");
  const [subject, setSubject] = useState("");
  const [content, setContent] = useState("");
  const [schedule, setSchedule] = useState<string>(SCHEDULE_PRESETS[0].cron);
  const [eventType, setEventType] = useState<NotificationEventType>("habit_reminder");
  const [saving, setSaving] = useState(false);

  async function handleCreate() {
    setSaving(true);
    try {
      const template = await createNotificationTemplateRequest({
        name,
        channel,
        trigger,
        isActive: true,
        subject: channel === "email" ? subject : undefined,
        content,
        schedule: trigger === "scheduled" ? schedule : undefined,
        eventType: trigger === "event" ? eventType : undefined,
      });
      onCreated(template);
      setOpen(false);
      setName("");
      setContent("");
      setSubject("");
      toast.success("Template créé.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Création impossible.",
      );
    } finally {
      setSaving(false);
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="size-4" />
          Nouveau template
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Créer un template</DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-body-sm text-on-dark font-medium">Nom</label>
            <Input value={name} onChange={(e) => setName(e.target.value)} />
          </div>
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
                      {value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <label className="text-body-sm text-on-dark font-medium">Déclencheur</label>
              <Select
                value={trigger}
                onValueChange={(value) => setTrigger(value as NotificationTrigger)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {NOTIFICATION_TRIGGERS.map((value) => (
                    <SelectItem key={value} value={value}>
                      {value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          {channel === "email" ? (
            <div className="space-y-2">
              <label className="text-body-sm text-on-dark font-medium">Sujet</label>
              <Input value={subject} onChange={(e) => setSubject(e.target.value)} />
            </div>
          ) : null}
          {trigger === "scheduled" ? (
            <div className="space-y-2">
              <label className="text-body-sm text-on-dark font-medium">Récurrence</label>
              <SchedulePicker value={schedule} onChange={setSchedule} />
            </div>
          ) : null}
          {trigger === "event" ? (
            <div className="space-y-2">
              <label className="text-body-sm text-on-dark font-medium">Événement</label>
              <Select
                value={eventType}
                onValueChange={(value) =>
                  setEventType(value as NotificationEventType)
                }
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {NOTIFICATION_EVENT_TYPES.map((value) => (
                    <SelectItem key={value} value={value}>
                      {value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          ) : null}
          <div className="space-y-2">
            <label className="text-body-sm text-on-dark font-medium">Contenu</label>
            <Textarea
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={5}
            />
          </div>
          <Button onClick={() => void handleCreate()} disabled={saving}>
            {saving ? "Création..." : "Créer"}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
