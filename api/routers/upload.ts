import { z } from "zod";
import { router, publicQuery } from "../trpc";
import { getDb } from "../queries/connection";
import { uploads } from "../../db/schema";
import { eq } from "drizzle-orm";

export const uploadRouter = router({
  // Get upload by filename — returns metadata (not the binary data)
  getByFilename: publicQuery
    .input(z.object({ filename: z.string() }))
    .query(async ({ input }) => {
      const db = getDb();
      const result = await db
        .select({
          id: uploads.id,
          filename: uploads.filename,
          mimeType: uploads.mimeType,
          createdAt: uploads.createdAt,
        })
        .from(uploads)
        .where(eq(uploads.filename, input.filename));
      return result[0] || null;
    }),

  // Get upload binary data by filename
  getData: publicQuery
    .input(z.object({ filename: z.string() }))
    .query(async ({ input }) => {
      const db = getDb();
      const result = await db
        .select({
          mimeType: uploads.mimeType,
          data: uploads.data,
        })
        .from(uploads)
        .where(eq(uploads.filename, input.filename));
      return result[0] || null;
    }),
});
