import type { Hono } from "hono";
import type { HttpBindings } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import fs from "fs";
import path from "path";
import { getDb } from "../queries/connection";
import { uploads } from "../../db/schema";
import { eq } from "drizzle-orm";

type App = Hono<{ Bindings: HttpBindings }>;

/**
 * Serve uploaded images from database.
 * This ensures images persist across server restarts and redeploys.
 */
export function serveUploadsRoute(app: App) {
  app.get("/uploads/:filename{.+}", async (c) => {
    const filename = c.req.param("filename");

    try {
      const db = getDb();
      const result = await db
        .select({
          mimeType: uploads.mimeType,
          data: uploads.data,
        })
        .from(uploads)
        .where(eq(uploads.filename, filename));

      if (!result.length) {
        // Fallback: try local filesystem (for backward compat with old uploads)
        const uploadsPath = path.resolve(
          import.meta.dirname,
          "../../public/uploads"
        );
        const filePath = path.join(uploadsPath, filename);
        if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
          const ext = path.extname(filePath).toLowerCase();
          const mimeTypes: Record<string, string> = {
            ".png": "image/png",
            ".jpg": "image/jpeg",
            ".jpeg": "image/jpeg",
            ".webp": "image/webp",
            ".gif": "image/gif",
            ".svg": "image/svg+xml",
          };
          const contentType = mimeTypes[ext] || "application/octet-stream";
          const data = fs.readFileSync(filePath);
          c.header("Content-Type", contentType);
          c.header("Cache-Control", "public, max-age=31536000");
          return c.body(data);
        }
        return c.json({ error: "Not found" }, 404);
      }

      const row = result[0];
      const buffer = Buffer.from(row.data, "base64");

      c.header("Content-Type", row.mimeType);
      c.header("Content-Length", String(buffer.length));
      c.header("Cache-Control", "public, max-age=31536000"); // 1 year cache
      return c.body(buffer);
    } catch {
      return c.json({ error: "Not found" }, 404);
    }
  });
}

export function serveStaticFiles(app: App) {
  const distPath = path.resolve(import.meta.dirname, "../dist/public");

  // Serve uploaded images from database (BEFORE the catch-all static route)
  serveUploadsRoute(app);

  // Serve frontend static files from dist/public/
  const staticPath = path.resolve(
    import.meta.dirname,
    "../../dist/public"
  );
  app.use("*", serveStatic({ root: staticPath }));

  app.notFound((c) => {
    const accept = c.req.header("accept") ?? "";
    if (!accept.includes("text/html")) {
      return c.json({ error: "Not Found" }, 404);
    }
    const indexPath = path.resolve(distPath, "index.html");
    const content = fs.readFileSync(indexPath, "utf-8");
    return c.html(content);
  });
}
