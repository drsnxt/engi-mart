import {
  pgTable,
  uuid,
  text,
  integer,
  numeric,
  boolean,
  timestamp,
  jsonb,
  uniqueIndex,
  index,
} from "drizzle-orm/pg-core";
import { relations, sql } from "drizzle-orm";

// 1. component_family
export const componentFamily = pgTable(
  "component_family",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    category: text("category").notNull(), // 'microcontroller', 'sensor', 'actuator', 'power', 'passive', 'tool', 'consumable'
    description: text("description"),
    searchAliases: text("search_aliases").array().notNull().default(sql`'{}'::text[]`),
    specSchema: jsonb("spec_schema").default({}),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("component_family_category_idx").on(table.category),
    index("component_family_name_idx").on(table.name),
  ]
);

// 2. component_variant
export const componentVariant = pgTable(
  "component_variant",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    familyId: uuid("family_id")
      .references(() => componentFamily.id, { onDelete: "cascade" })
      .notNull(),
    canonicalSlug: text("canonical_slug").notNull().unique(),
    displayName: text("display_name").notNull(),
    mpn: text("mpn"),
    manufacturer: text("manufacturer"),
    package: text("package").notNull(),
    specs: jsonb("specs").notNull().default({}),
    datasheetUrl: text("datasheet_url"),
    imageUrl: text("image_url"),
    lifecycle: text("lifecycle").notNull().default("active"),
    packSize: integer("pack_size").notNull().default(1),
    unitLabel: text("unit_label").notNull().default("unit"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("component_variant_family_idx").on(table.familyId),
    uniqueIndex("component_variant_slug_idx").on(table.canonicalSlug),
  ]
);

// 3. shop
export const shop = pgTable(
  "shop",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    name: text("name").notNull(),
    clusterId: text("cluster_id").notNull().default("sp-road"),
    building: text("building"),
    floor: text("floor"),
    stallNo: text("stall_no"),
    phone: text("phone"),
    categoryFocus: text("category_focus").array().default(sql`'{}'::text[]`),
    lat: numeric("lat", { precision: 9, scale: 6 }),
    lng: numeric("lng", { precision: 9, scale: 6 }),
    openingHours: jsonb("opening_hours").default({}),
    lastAuditedAt: timestamp("last_audited_at", { withTimezone: true }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("shop_cluster_idx").on(table.clusterId),
  ]
);

// 4. shop_listing
export const shopListing = pgTable(
  "shop_listing",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    shopId: uuid("shop_id")
      .references(() => shop.id, { onDelete: "cascade" })
      .notNull(),
    variantId: uuid("variant_id")
      .references(() => componentVariant.id, { onDelete: "cascade" })
      .notNull(),
    shopItemName: text("shop_item_name").notNull(),
    pricePaisa: integer("price_paisa").notNull(),
    stockStatus: text("stock_status").notNull().default("unknown"), // 'in_stock', 'low', 'out', 'unknown'
    quantity: integer("quantity"),
    lastVerifiedAt: timestamp("last_verified_at", { withTimezone: true }),
    source: text("source").notNull().default("audit"), // 'audit', 'bill', 'student', 'shop_whatsapp', 'import'
    confidence: numeric("confidence", { precision: 4, scale: 3 }),
    notes: text("notes"),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("shop_listing_shop_variant_idx").on(table.shopId, table.variantId),
    index("shop_listing_variant_idx").on(table.variantId),
  ]
);

// 5. price_observation (append-only)
export const priceObservation = pgTable(
  "price_observation",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    variantId: uuid("variant_id")
      .references(() => componentVariant.id, { onDelete: "cascade" })
      .notNull(),
    shopId: uuid("shop_id")
      .references(() => shop.id, { onDelete: "cascade" })
      .notNull(),
    pricePaisa: integer("price_paisa").notNull(),
    stockStatus: text("stock_status").notNull().default("unknown"),
    quantity: integer("quantity"),
    observedAt: timestamp("observed_at", { withTimezone: true }).defaultNow().notNull(),
    source: text("source").notNull(), // 'audit', 'bill', 'student', 'shop_whatsapp', 'import'
    evidenceUrl: text("evidence_url"),
    reporterId: text("reporter_id"),
    sessionId: uuid("session_id"),
    note: text("note"),
  },
  (table) => [
    index("price_obs_variant_idx").on(table.variantId),
    index("price_obs_shop_idx").on(table.shopId),
    index("price_obs_observed_at_idx").on(table.observedAt),
  ]
);

// 6. substitution_edge
export const substitutionEdge = pgTable(
  "substitution_edge",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    fromVariantId: uuid("from_variant_id")
      .references(() => componentVariant.id, { onDelete: "cascade" })
      .notNull(),
    toVariantId: uuid("to_variant_id")
      .references(() => componentVariant.id, { onDelete: "cascade" })
      .notNull(),
    relationType: text("relation_type").notNull(), // 'equivalent', 'pin_compatible', 'upgrade', 'downgrade', 'adapter_required'
    specDelta: jsonb("spec_delta").default({}),
    note: text("note"),
    confidence: numeric("confidence", { precision: 4, scale: 3 }).default("0.900"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("sub_edge_from_idx").on(table.fromVariantId),
    index("sub_edge_to_idx").on(table.toVariantId),
  ]
);

// 7. bom_session
export const bomSession = pgTable(
  "bom_session",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    publicToken: text("public_token").notNull().unique(), // viewId
    editTokenHash: text("edit_token_hash").notNull(),
    title: text("title").notNull(),
    mode: text("mode").notNull().default("bom"), // 'bom' | 'idea'
    budgetPaisa: integer("budget_paisa"),
    maxStops: integer("max_stops").notNull().default(2),
    walkingTolerance: text("walking_tolerance").notNull().default("normal"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    uniqueIndex("bom_session_token_idx").on(table.publicToken),
  ]
);

// 8. bom_item
export const bomItem = pgTable(
  "bom_item",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    sessionId: uuid("session_id")
      .references(() => bomSession.id, { onDelete: "cascade" })
      .notNull(),
    rawText: text("raw_text").notNull(),
    qty: integer("qty").notNull().default(1),
    matchedVariantId: uuid("matched_variant_id").references(() => componentVariant.id, {
      onDelete: "set null",
    }),
    matchConfidence: numeric("match_confidence", { precision: 4, scale: 3 }),
    matchMethod: text("match_method"), // 'exact', 'trigram', 'llm', 'manual'
    userConfirmed: boolean("user_confirmed").default(false),
    note: text("note"),
    sortOrder: integer("sort_order").default(0),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("bom_item_session_idx").on(table.sessionId),
  ]
);

// 9. optimization_run
export const optimizationRun = pgTable(
  "optimization_run",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    sessionId: uuid("session_id")
      .references(() => bomSession.id, { onDelete: "cascade" })
      .notNull(),
    constraintsJsonb: jsonb("constraints_jsonb").notNull().default({}),
    plansJsonb: jsonb("plans_jsonb").notNull().default({}),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("optimization_run_session_idx").on(table.sessionId),
  ]
);

// 10. feedback
export const feedback = pgTable(
  "feedback",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    sessionId: uuid("session_id")
      .references(() => bomSession.id, { onDelete: "cascade" })
      .notNull(),
    bomItemId: uuid("bom_item_id").references(() => bomItem.id, { onDelete: "set null" }),
    found: boolean("found").notNull(),
    pricePaidPaisa: integer("price_paid_paisa"),
    priceSentiment: text("price_sentiment"), // 'fair', 'high', 'cheap'
    note: text("note"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("feedback_session_idx").on(table.sessionId),
  ]
);

// 11. unmatched_query
export const unmatchedQuery = pgTable(
  "unmatched_query",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    query: text("query").notNull(),
    source: text("source").notNull().default("bom"),
    sessionId: uuid("session_id").references(() => bomSession.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("unmatched_query_query_idx").on(table.query),
  ]
);

// 12. match_override
export const matchOverride = pgTable(
  "match_override",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    sessionId: uuid("session_id").references(() => bomSession.id, { onDelete: "set null" }),
    rawText: text("raw_text").notNull(),
    fromVariantId: uuid("from_variant_id").references(() => componentVariant.id, { onDelete: "set null" }),
    toVariantId: uuid("to_variant_id").references(() => componentVariant.id, { onDelete: "cascade" }).notNull(),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("match_override_session_idx").on(table.sessionId),
  ]
);

// 13. substitution_override
export const substitutionOverride = pgTable(
  "substitution_override",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    sessionId: uuid("session_id").references(() => bomSession.id, { onDelete: "set null" }),
    recommendedVariantId: uuid("recommended_variant_id")
      .references(() => componentVariant.id, { onDelete: "cascade" })
      .notNull(),
    chosenVariantId: uuid("chosen_variant_id")
      .references(() => componentVariant.id, { onDelete: "cascade" })
      .notNull(),
    reason: text("reason"),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("sub_override_session_idx").on(table.sessionId),
  ]
);

// 14. plan_selection
export const planSelection = pgTable(
  "plan_selection",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    sessionId: uuid("session_id")
      .references(() => bomSession.id, { onDelete: "cascade" })
      .notNull(),
    planType: text("plan_type").notNull(), // 'fastest' | 'cheapest' | 'custom'
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("plan_selection_session_idx").on(table.sessionId),
  ]
);

// 15. search_impression
export const searchImpression = pgTable(
  "search_impression",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    query: text("query").notNull(),
    shownVariantIds: jsonb("shown_variant_ids").notNull().default([]),
    clickedVariantId: uuid("clicked_variant_id").references(() => componentVariant.id, { onDelete: "set null" }),
    createdAt: timestamp("created_at", { withTimezone: true }).defaultNow().notNull(),
  },
  (table) => [
    index("search_impression_query_idx").on(table.query),
  ]
);

// Relations
export const componentFamilyRelations = relations(componentFamily, ({ many }) => ({
  variants: many(componentVariant),
}));

export const componentVariantRelations = relations(componentVariant, ({ one, many }) => ({
  family: one(componentFamily, {
    fields: [componentVariant.familyId],
    references: [componentFamily.id],
  }),
  listings: many(shopListing),
  priceObservations: many(priceObservation),
  substitutesFrom: many(substitutionEdge, { relationName: "substitutesFrom" }),
  substitutesTo: many(substitutionEdge, { relationName: "substitutesTo" }),
}));

export const shopRelations = relations(shop, ({ many }) => ({
  listings: many(shopListing),
  priceObservations: many(priceObservation),
}));

export const shopListingRelations = relations(shopListing, ({ one }) => ({
  shop: one(shop, {
    fields: [shopListing.shopId],
    references: [shop.id],
  }),
  variant: one(componentVariant, {
    fields: [shopListing.variantId],
    references: [componentVariant.id],
  }),
}));

export const bomSessionRelations = relations(bomSession, ({ many }) => ({
  items: many(bomItem),
  optimizationRuns: many(optimizationRun),
  feedbacks: many(feedback),
}));

export const bomItemRelations = relations(bomItem, ({ one, many }) => ({
  session: one(bomSession, {
    fields: [bomItem.sessionId],
    references: [bomSession.id],
  }),
  matchedVariant: one(componentVariant, {
    fields: [bomItem.matchedVariantId],
    references: [componentVariant.id],
  }),
  feedbacks: many(feedback),
}));
