import type {
  NOTIFICATION_CHANNELS,
  NOTIFICATION_EVENT_TYPES,
  NOTIFICATION_TRIGGERS,
} from "@/lib/validators/notifications";

export type NotificationChannel = (typeof NOTIFICATION_CHANNELS)[number];
export type NotificationTrigger = (typeof NOTIFICATION_TRIGGERS)[number];
export type NotificationEventType = (typeof NOTIFICATION_EVENT_TYPES)[number];

export type NotificationTemplateItem = {
  id: string;
  name: string;
  channel: NotificationChannel;
  subject: string | null;
  content: string;
  trigger: NotificationTrigger;
  schedule: string | null;
  eventType: NotificationEventType | null;
  isActive: boolean;
  isSystem: boolean;
  createdAt: string;
  updatedAt: string;
};

export type NotificationAnalytics = {
  sent: number;
  opened: number;
  clicked: number;
  failed: number;
  openRate: number;
  clickRate: number;
  byChannel: {
    channel: NotificationChannel;
    sent: number;
    opened: number;
    clicked: number;
  }[];
  byEventType: {
    eventType: NotificationEventType | null;
    sent: number;
    opened: number;
    clicked: number;
  }[];
};

export type DispatchRecipient = {
  clientId?: string;
  email?: string;
  clerkUserId?: string;
};

export type DispatchNotificationInput = {
  organizationId: string;
  planTier: import("@/lib/auth/types").PlanTier;
  channel: NotificationChannel;
  subject?: string;
  content: string;
  templateId?: string;
  eventType?: NotificationEventType;
  recipients: DispatchRecipient[];
  metadata?: Record<string, unknown>;
  idempotencyKey?: string;
};

export type RenderVariables = Record<string, string | number | undefined>;

export type SendChannelResult = {
  ok: boolean;
  error?: string;
  externalId?: string;
  delivered?: number;
};
