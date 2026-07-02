import {
  mysqlTable,
  serial,
  varchar,
  text,
  mediumtext,
  timestamp,
  int,
} from "drizzle-orm/mysql-core";

// ===== PROJECTS =====
export const projects = mysqlTable("projects", {
  id: serial("id").primaryKey(),
  slug: varchar("slug", { length: 100 }).notNull().unique(),
  title: varchar("title", { length: 255 }).notNull(),
  subtitle: varchar("subtitle", { length: 255 }),
  category: varchar("category", { length: 255 }),
  year: varchar("year", { length: 20 }),
  image: varchar("image", { length: 500 }),
  thumb: varchar("thumb", { length: 500 }),
  description: text("description"),
  client: varchar("client", { length: 255 }),
  services: varchar("services", { length: 255 }),
  team: varchar("team", { length: 255 }),
  noteEn: text("note_en"),
  noteCn: text("note_cn"),
  sortOrder: int("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
});

// ===== EXPERIENCES (Work Experience) =====
export const experiences = mysqlTable("experiences", {
  id: serial("id").primaryKey(),
  year: varchar("year", { length: 100 }).notNull(),
  company: varchar("company", { length: 255 }).notNull(),
  role: varchar("role", { length: 255 }).notNull(),
  description: text("description"),
  sortOrder: int("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
});

// ===== SKILLS =====
export const skills = mysqlTable("skills", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull(),
  sortOrder: int("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
});

// ===== INTRODUCTION (Basic Info Cards) =====
export const introductions = mysqlTable("introductions", {
  id: serial("id").primaryKey(),
  label: varchar("label", { length: 100 }).notNull(),
  labelEn: varchar("label_en", { length: 100 }).notNull(),
  value: varchar("value", { length: 255 }).notNull(),
  icon: varchar("icon", { length: 50 }).notNull().default("user"),
  sortOrder: int("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow().onUpdateNow(),
});

// ===== UPLOADS (Image files stored in DB for persistence) =====
export const uploads = mysqlTable("uploads", {
  id: serial("id").primaryKey(),
  filename: varchar("filename", { length: 255 }).notNull(),
  mimeType: varchar("mime_type", { length: 100 }).notNull(),
  data: mediumtext("data").notNull(), // Base64-encoded image data
  createdAt: timestamp("created_at").notNull().defaultNow(),
});

// ===== PROJECT GALLERY IMAGES =====
export const projectGallery = mysqlTable("project_gallery", {
  id: serial("id").primaryKey(),
  projectId: int("project_id").notNull(),
  imageUrl: varchar("image_url", { length: 500 }).notNull(),
  caption: varchar("caption", { length: 255 }),
  sortOrder: int("sort_order").notNull().default(0),
  createdAt: timestamp("created_at").notNull().defaultNow(),
});
