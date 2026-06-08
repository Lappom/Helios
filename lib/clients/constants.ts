import type { ClientStatus } from "@/lib/validators/clients";

export const CLIENT_STATUS_ORDER: ClientStatus[] = [
  "PROSPECT",
  "TRIAL",
  "ACTIVE",
  "PAUSED",
  "CHURNED",
];

export const CLIENT_STATUS_LABELS: Record<ClientStatus, string> = {
  PROSPECT: "Prospect",
  TRIAL: "Essai",
  ACTIVE: "Actif",
  PAUSED: "En pause",
  CHURNED: "Parti",
};
