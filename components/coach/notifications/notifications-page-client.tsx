"use client";

import { useCallback, useState } from "react";
import { toast } from "sonner";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { QuotaCheckResult } from "@/lib/billing/access";
import type { ClientListItem } from "@/lib/clients/service";
import {
  deleteNotificationTemplateRequest,
  fetchNotificationAnalytics,
  fetchNotificationQuota,
  fetchNotificationTemplates,
  updateNotificationTemplateRequest,
} from "@/lib/notifications/api-client";
import type {
  NotificationAnalytics,
  NotificationTemplateItem,
} from "@/lib/notifications/types";
import { AnalyticsKpiGrid } from "./analytics-kpi-grid";
import { CreateTemplateDialog } from "./create-template-dialog";
import { NotificationComposer } from "./notification-composer";
import { QuotaMeter } from "./quota-meter";
import { TemplatesTable } from "./templates-table";

type NotificationsPageClientProps = {
  initialTemplates: NotificationTemplateItem[];
  initialAnalytics: NotificationAnalytics;
  initialQuota: QuotaCheckResult;
  clients: ClientListItem[];
};

export function NotificationsPageClient({
  initialTemplates,
  initialAnalytics,
  initialQuota,
  clients,
}: NotificationsPageClientProps) {
  const [templates, setTemplates] = useState(initialTemplates);
  const [analytics, setAnalytics] = useState(initialAnalytics);
  const [quota, setQuota] = useState(initialQuota);

  const refresh = useCallback(async () => {
    const [nextTemplates, nextAnalytics, nextQuota] = await Promise.all([
      fetchNotificationTemplates({ page: 1, limit: 100 }),
      fetchNotificationAnalytics(),
      fetchNotificationQuota(),
    ]);
    setTemplates(nextTemplates.items);
    setAnalytics(nextAnalytics);
    setQuota(nextQuota);
  }, []);

  async function handleToggleActive(
    template: NotificationTemplateItem,
    active: boolean,
  ) {
    try {
      const updated = await updateNotificationTemplateRequest(template.id, {
        isActive: active,
      });
      setTemplates((current) =>
        current.map((item) => (item.id === updated.id ? updated : item)),
      );
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Mise à jour impossible.",
      );
    }
  }

  async function handleDelete(templateId: string) {
    try {
      await deleteNotificationTemplateRequest(templateId);
      setTemplates((current) => current.filter((item) => item.id !== templateId));
      toast.success("Template supprimé.");
    } catch (error) {
      toast.error(
        error instanceof Error ? error.message : "Suppression impossible.",
      );
    }
  }

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-caption-uppercase text-primary tracking-widest uppercase">
            Communication
          </p>
          <h1 className="text-display-sm text-on-dark font-bold tracking-tight">
            Notifications
          </h1>
          <p className="text-body-md text-muted mt-2 max-w-2xl">
            Envoyez des rappels email, in-app ou push. Suivez l&apos;engagement et
            programmez des notifications récurrentes.
          </p>
        </div>
      </div>

      <QuotaMeter quota={quota} />

      <Tabs defaultValue="composer" className="space-y-6">
        <TabsList>
          <TabsTrigger value="composer">Composer</TabsTrigger>
          <TabsTrigger value="templates">Templates</TabsTrigger>
          <TabsTrigger value="analytics">Analytics</TabsTrigger>
        </TabsList>

        <TabsContent value="composer" className="space-y-6">
          <NotificationComposer clients={clients} onSent={() => void refresh()} />
        </TabsContent>

        <TabsContent value="templates" className="space-y-4">
          <div className="flex justify-end">
            <CreateTemplateDialog
              onCreated={(template) => {
                setTemplates((current) => [template, ...current]);
              }}
            />
          </div>
          <TemplatesTable
            templates={templates}
            onToggleActive={(template, active) =>
              void handleToggleActive(template, active)
            }
            onDelete={(templateId) => void handleDelete(templateId)}
          />
        </TabsContent>

        <TabsContent value="analytics" className="space-y-6">
          <AnalyticsKpiGrid analytics={analytics} />
          <div className="border-hairline bg-surface-card rounded-lg border p-6">
            <h2 className="text-title-md text-on-dark font-semibold">
              Répartition par canal
            </h2>
            <div className="mt-4 space-y-3">
              {analytics.byChannel.length === 0 ? (
                <p className="text-muted text-body-sm">Aucune donnée disponible.</p>
              ) : (
                analytics.byChannel.map((row) => (
                  <div
                    key={row.channel}
                    className="flex items-center justify-between gap-4"
                  >
                    <span className="text-body-sm text-on-dark capitalize">
                      {row.channel}
                    </span>
                    <span className="text-muted text-body-sm">
                      {row.sent} envoyées · {row.opened} ouvertes · {row.clicked}{" "}
                      clics
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
