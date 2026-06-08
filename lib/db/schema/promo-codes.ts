import {
  boolean,
  index,
  integer,
  jsonb,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
} from "drizzle-orm/pg-core";
import { createId } from "../id";
import { promoDiscountTypeEnum } from "./enums";
import { organizations } from "./organization";

export const promoCodes = pgTable(
  "promo_codes",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => createId()),
    organizationId: text("organization_id")
      .notNull()
      .references(() => organizations.id, { onDelete: "cascade" }),
    code: text("code").notNull(),
    label: text("label"),
    discountType: promoDiscountTypeEnum("discount_type").notNull(),
    discountValue: integer("discount_value").notNull(),
    maxRedemptions: integer("max_redemptions"),
    redemptionCount: integer("redemption_count").notNull().default(0),
    expiresAt: timestamp("expires_at", { withTimezone: true }),
    isActive: boolean("is_active").notNull().default(true),
    serviceIds: jsonb("service_ids").$type<string[] | null>(),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .defaultNow(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .notNull()
      .defaultNow()
      .$onUpdate(() => new Date()),
  },
  (t) => [
    uniqueIndex("promo_codes_org_code_idx").on(t.organizationId, t.code),
    index("promo_codes_org_idx").on(t.organizationId),
  ],
);

export type PromoCodeRow = typeof promoCodes.$inferSelect;
