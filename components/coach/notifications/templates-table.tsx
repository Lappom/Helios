"use client";

import { Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import type { NotificationTemplateItem } from "@/lib/notifications/types";

const CHANNEL_LABELS = {
  email: "Email",
  in_app: "In-app",
  push: "Push",
} as const;

const TRIGGER_LABELS = {
  manual: "Manuel",
  scheduled: "Programmé",
  event: "Événement",
} as const;

type TemplatesTableProps = {
  templates: NotificationTemplateItem[];
  onToggleActive: (template: NotificationTemplateItem, active: boolean) => void;
  onDelete: (templateId: string) => void;
};

export function TemplatesTable({
  templates,
  onToggleActive,
  onDelete,
}: TemplatesTableProps) {
  if (templates.length === 0) {
    return (
      <div className="border-hairline bg-surface-card rounded-lg border p-8 text-center">
        <p className="text-muted text-body-md">Aucun template pour le moment.</p>
      </div>
    );
  }

  return (
    <div className="border-hairline bg-surface-card overflow-hidden rounded-lg border">
      <div className="divide-hairline divide-y">
        {templates.map((template) => (
          <div
            key={template.id}
            className="flex flex-wrap items-center justify-between gap-4 px-5 py-4"
          >
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <p className="text-on-dark text-title-sm font-semibold">
                  {template.name}
                </p>
                <Badge variant="outline">{CHANNEL_LABELS[template.channel]}</Badge>
                <Badge variant="secondary">
                  {TRIGGER_LABELS[template.trigger]}
                </Badge>
                {template.isSystem ? (
                  <Badge className="bg-primary/15 text-primary border-0">
                    Système
                  </Badge>
                ) : null}
              </div>
              <p className="text-muted text-body-sm mt-1 line-clamp-2">
                {template.content}
              </p>
              {template.schedule ? (
                <p className="text-muted-soft text-caption mt-2">
                  Cron : {template.schedule}
                </p>
              ) : null}
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-2">
                <Checkbox
                  checked={template.isActive}
                  onCheckedChange={(checked) =>
                    onToggleActive(template, checked === true)
                  }
                />
                <span className="text-body-sm text-muted">Actif</span>
              </div>
              {!template.isSystem ? (
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(template.id)}
                  aria-label="Supprimer le template"
                >
                  <Trash2 className="size-4" />
                </Button>
              ) : (
                <Button variant="ghost" size="icon" disabled>
                  <Pencil className="size-4 opacity-40" />
                </Button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
