import { z } from "zod";
import { router, publicQuery, publicMutation } from "../trpc";
import { getDb } from "../queries/connection";
import { introductions } from "../../db/schema";
import { eq } from "drizzle-orm";

export const introductionRouter = router({
  list: publicQuery.query(async () => {
    const db = getDb();
    return db.select().from(introductions).orderBy(introductions.sortOrder);
  }),

  create: publicMutation
    .input(
      z.object({
        label: z.string().min(1),
        labelEn: z.string().min(1),
        value: z.string().min(1),
        icon: z.string().default("user"),
        sortOrder: z.number().default(0),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const result = await db.insert(introductions).values(input);
      return { id: Number((result as any).insertId) };
    }),

  update: publicMutation
    .input(
      z.object({
        id: z.number(),
        label: z.string().optional(),
        labelEn: z.string().optional(),
        value: z.string().optional(),
        icon: z.string().optional(),
        sortOrder: z.number().optional(),
      })
    )
    .mutation(async ({ input }) => {
      const db = getDb();
      const { id, ...data } = input;
      await db.update(introductions).set(data).where(eq(introductions.id, id));
      return { success: true };
    }),

  delete: publicMutation
    .input(z.object({ id: z.number() }))
    .mutation(async ({ input }) => {
      const db = getDb();
      await db.delete(introductions).where(eq(introductions.id, input.id));
      return { success: true };
    }),
});
