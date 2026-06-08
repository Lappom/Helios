import { relations } from "drizzle-orm";
import {
  clientNotes,
  clients,
  clientStatusEvents,
  clientTagAssignments,
  clientTags,
} from "./clients";
import {
  organizations,
  subscriptions,
  teamMembers,
} from "./organization";

export * from "./enums";
export * from "./organization";
export * from "./clients";

export const organizationsRelations = relations(
  organizations,
  ({ one, many }) => ({
    subscription: one(subscriptions, {
      fields: [organizations.id],
      references: [subscriptions.organizationId],
    }),
    clients: many(clients),
    teamMembers: many(teamMembers),
    clientTags: many(clientTags),
  }),
);

export const subscriptionsRelations = relations(subscriptions, ({ one }) => ({
  organization: one(organizations, {
    fields: [subscriptions.organizationId],
    references: [organizations.id],
  }),
}));

export const clientsRelations = relations(clients, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [clients.organizationId],
    references: [organizations.id],
  }),
  notes: many(clientNotes),
  tagAssignments: many(clientTagAssignments),
  statusEvents: many(clientStatusEvents),
}));

export const clientNotesRelations = relations(clientNotes, ({ one }) => ({
  organization: one(organizations, {
    fields: [clientNotes.organizationId],
    references: [organizations.id],
  }),
  client: one(clients, {
    fields: [clientNotes.clientId],
    references: [clients.id],
  }),
}));

export const clientTagsRelations = relations(clientTags, ({ one, many }) => ({
  organization: one(organizations, {
    fields: [clientTags.organizationId],
    references: [organizations.id],
  }),
  assignments: many(clientTagAssignments),
}));

export const clientTagAssignmentsRelations = relations(
  clientTagAssignments,
  ({ one }) => ({
    organization: one(organizations, {
      fields: [clientTagAssignments.organizationId],
      references: [organizations.id],
    }),
    client: one(clients, {
      fields: [clientTagAssignments.clientId],
      references: [clients.id],
    }),
    tag: one(clientTags, {
      fields: [clientTagAssignments.tagId],
      references: [clientTags.id],
    }),
  }),
);

export const clientStatusEventsRelations = relations(
  clientStatusEvents,
  ({ one }) => ({
    organization: one(organizations, {
      fields: [clientStatusEvents.organizationId],
      references: [organizations.id],
    }),
    client: one(clients, {
      fields: [clientStatusEvents.clientId],
      references: [clients.id],
    }),
  }),
);

export const teamMembersRelations = relations(teamMembers, ({ one }) => ({
  organization: one(organizations, {
    fields: [teamMembers.organizationId],
    references: [organizations.id],
  }),
}));
