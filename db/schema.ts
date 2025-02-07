import { pgTable, text, serial, integer, boolean, timestamp, jsonb } from "drizzle-orm/pg-core";
import { createInsertSchema, createSelectSchema } from "drizzle-zod";

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").unique().notNull(),
  password: text("password").notNull(),
});

export const blogPosts = pgTable("blog_posts", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  content: text("content").notNull(),
  summary: text("summary").notNull(),
  coverImage: text("cover_image"),
  authorId: integer("author_id").references(() => users.id).notNull(),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
  published: boolean("published").default(false).notNull(),
  category: text("category").notNull(), // 'tech-trends', 'tutorial', 'coding-challenge', 'experience'
  tags: text("tags").array(), // Array of tech-related tags
  readingTime: integer("reading_time").notNull(), // Estimated reading time in minutes
  difficulty: text("difficulty"), // For tutorials and coding challenges: 'beginner', 'intermediate', 'advanced'
  seoTitle: text("seo_title"), // SEO-optimized title
  seoDescription: text("seo_description"), // Meta description for SEO
  codeSnippets: jsonb("code_snippets").array(), // Array of code snippets with syntax highlighting
});

export const insertUserSchema = createInsertSchema(users);
export const selectUserSchema = createSelectSchema(users);
export type InsertUser = typeof users.$inferInsert;
export type SelectUser = typeof users.$inferSelect;

export const insertBlogPostSchema = createInsertSchema(blogPosts);
export const selectBlogPostSchema = createSelectSchema(blogPosts);
export type InsertBlogPost = typeof blogPosts.$inferInsert;
export type SelectBlogPost = typeof blogPosts.$inferSelect;