import { z } from "zod";
import { router, publicQuery, publicMutation } from "../trpc";
import { getDb } from "../queries/connection";
import { projects, projectGallery } from "../../db/schema";
import { eq, asc } from "drizzle-orm";

export const projectRouter = router({
  // List all projects
  list: publicQuery.query(async () => {
    const db = getDb();
    return db.select().from(projects).orderBy(asc(projects.sortOrder));
  }),

  // Get single project by slug
  getBySlug: publicQuery
    .input(z.object({ slug: z.string() }))
    .query(async ({ input }) => {
      const db = getDb();
      const result = await db.select().from(projects).where(eq(projects.slug, input.slug));
      return result[0] || null;
    }),

  // Get project gallery
  getGallery: publicQuery
    .input(z.object({ projectId: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      return db.select().from(projectGallery)
        .where(eq(projectGallery.projectId, input.projectId))
        .orderBy(asc(projectGallery.sortOrder));
    }),

  // Create project
  create: publicMutation
    .input(z.object({
      slug: z.string(),
      title: z.string(),
      subtitle: z.string().optional(),
      category: z.string().optional(),
      year: z.string().optional(),
      image: z.string().optional(),
      thumb: z.string().optional(),
      description: z.string().optional(),
      client: z.string().optional(),
      services: z.string().optional(),
      team: z.string().optional(),
      noteEn: z.string().optional(),
      noteCn: z.string().optional(),
      sortOrder: z.number().default(0),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const result = await db.insert(projects).values(input);
      return { id: Number((result as any).insertId) };
    }),

  // Update project
  update: publicMutation
    .input(z.object({
      id: z.number(),
      slug: z.string().optional(),
      title: z.string().optional(),
      subtitle: z.string().optional(),
      category: z.string().optional(),
      year: z.string().optional(),
      image: z.string().optional(),
      thumb: z.string().optional(),
      description: z.string().optional(),
      client: z.string().optional(),
      services: z.string().optional(),
      team: z.string().optional(),
      noteEn: z.string().optional(),
      noteCn: z.string().optional(),
      sortOrder: z.number().optional(),
    }))
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      const db = getDb();
      await db.update(projects).set(data).where(eq(projects.id, id));
      return { success: true };
    }),

  // Delete project
  delete: publicMutation
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(projectGallery).where(eq(projectGallery.projectId, input.id));
      await db.delete(projects).where(eq(projects.id, input.id));
      return { success: true };
    }),
});

export const projectGalleryRouter = router({
  list: publicQuery
    .input(z.object({ projectId: z.number() }))
    .query(async ({ input }) => {
      const db = getDb();
      return db.select().from(projectGallery)
        .where(eq(projectGallery.projectId, input.projectId))
        .orderBy(asc(projectGallery.sortOrder));
    }),

  create: publicMutation
    .input(z.object({
      projectId: z.number(),
      imageUrl: z.string(),
      caption: z.string().optional(),
      sortOrder: z.number().default(0),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const result = await db.insert(projectGallery).values(input);
      return { id: Number((result as any).insertId) };
    }),

  delete: publicMutation
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(projectGallery).where(eq(projectGallery.id, input.id));
      return { success: true };
    }),
});
