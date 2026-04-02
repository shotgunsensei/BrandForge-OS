import { pgTable, text, serial, timestamp, integer, boolean } from "drizzle-orm/pg-core";
import { tenantsTable } from "./tenants";

export const templatesTable = pgTable("templates", {
  id: serial("id").primaryKey(),
  tenantId: integer("tenant_id").references(() => tenantsTable.id, { onDelete: "cascade" }),
  name: text("name").notNull(),
  description: text("description"),
  category: text("category").notNull(),
  templateType: text("template_type").notNull(),
  content: text("content").notNull(),
  tags: text("tags").array().notNull().default([]),
  isGlobal: boolean("is_global").notNull().default(false),
  isFeatured: boolean("is_featured").notNull().default(false),
  previewUrl: text("preview_url"),
  createdAt: timestamp("created_at", { withTimezone: true }).notNull().defaultNow(),
});
