import { z } from "zod";
import { router, publicQuery, publicMutation } from "../trpc";
import { getDb } from "../queries/connection";
import { experiences, skills } from "../../db/schema";
import { eq, asc } from "drizzle-orm";

export const experienceRouter = router({
  list: publicQuery.query(async () => {
    const db = getDb();
    return db.select().from(experiences).orderBy(asc(experiences.sortOrder));
  }),

  create: publicMutation
    .input(z.object({
      year: z.string(),
      company: z.string(),
      role: z.string(),
      description: z.string().optional(),
      sortOrder: z.number().default(0),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const result = await db.insert(experiences).values(input);
      return { id: Number((result as any).insertId) };
    }),

  update: publicMutation
    .input(z.object({
      id: z.number(),
      year: z.string().optional(),
      company: z.string().optional(),
      role: z.string().optional(),
      description: z.string().optional(),
      sortOrder: z.number().optional(),
    }))
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      const db = getDb();
      await db.update(experiences).set(data).where(eq(experiences.id, id));
      return { success: true };
    }),

  delete: publicMutation
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(experiences).where(eq(experiences.id, input.id));
      return { success: true };
    }),
});

export const skillRouter = router({
  list: publicQuery.query(async () => {
    const db = getDb();
    return db.select().from(skills).orderBy(asc(skills.sortOrder));
  }),

  create: publicMutation
    .input(z.object({
      name: z.string(),
      sortOrder: z.number().default(0),
    }))
    .mutation(async ({ input }) => {
      const db = getDb();
      const result = await db.insert(skills).values(input);
      return { id: Number((result as any).insertId) };
    }),

  update: publicMutation
    .input(z.object({
      id: z.number(),
      name: z.string().optional(),
      sortOrder: z.number().optional(),
    }))
    .mutation(async ({ input }) => {
      const { id, ...data } = input;
      const db = getDb();
      await db.update(skills).set(data).where(eq(skills.id, id));
      return { success: true };
    }),

  delete: publicMutation
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(skills).where(eq(skills.id, input.id));
      return { success: true };
    }),
});
