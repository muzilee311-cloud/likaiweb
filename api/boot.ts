import { Hono } from "hono";
import { bodyLimit } from "hono/body-limit";
import type { HttpBindings } from "@hono/node-server";
import { fetchRequestHandler } from "@trpc/server/adapters/fetch";
import { appRouter } from "./router";
import { createContext } from "./context";
import { env } from "./lib/env";
import { readFileSync, writeFileSync, existsSync } from "fs";
import { join } from "path";
import { getDb } from "./queries/connection";
import { uploads } from "../db/schema";
import { eq } from "drizzle-orm";
import fs from "fs";
import path from "path";

const app = new Hono<{ Bindings: HttpBindings }>();

// Version management — persist to a file so it survives server restarts
const VERSION_FILE = join(process.cwd(), ".publish-version");

function getPublishVersion(): number {
  try {
    if (existsSync(VERSION_FILE)) {
      const content = readFileSync(VERSION_FILE, "utf-8").trim();
      const v = parseInt(content, 10);
      if (!isNaN(v)) return v;
    }
  } catch { /* ignore */ }
  const v = Date.now();
  try { writeFileSync(VERSION_FILE, String(v)); } catch { /* ignore */ }
  return v;
}

function setPublishVersion(v: number): void {
  try { writeFileSync(VERSION_FILE, String(v)); } catch { /* ignore */ }
}

let publishVersion = getPublishVersion();

app.post("/api/publish", async (c) => {
  publishVersion = Date.now();
  setPublishVersion(publishVersion);
  return c.json({ success: true, version: publishVersion });
});

app.get("/api/version", async (c) => {
  return c.json({ version: publishVersion });
});

// Upload endpoint — stores image in database for persistence across deploys
app.post("/api/upload", async (c) => {
  try {
    const body = await c.req.parseBody({ all: false });
    const file = body.file as File;
    if (!file || file.size === 0) {
      return c.json({ error: "No file uploaded" }, 400);
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/webp", "image/gif", "image/svg+xml"];
    if (!allowedTypes.includes(file.type)) {
      return c.json({ error: "Only image files are allowed" }, 400);
    }

    // Validate file size (10MB)
    const maxSize = 10 * 1024 * 1024;
    if (file.size > maxSize) {
      return c.json({ error: "File too large (max 10MB)" }, 413);
    }

    // Generate unique filename
    const ext = file.name.split(".").pop() || "png";
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2, 8);
    // Sanitize extension — force lowercase for consistency
    const safeExt = ext.toLowerCase().replace(/[^a-z0-9]/g, "");
    const filename = `${timestamp}-${random}.${safeExt || "png"}`;

    // Read file and convert to Base64
    const buffer = Buffer.from(await file.arrayBuffer());
    const base64Data = buffer.toString("base64");

    // Store in database for persistence
    const db = getDb();
    await db.insert(uploads).values({
      filename,
      mimeType: file.type,
      data: base64Data,
    });

    // Return public URL — served by /uploads/:filename route
    const url = `/uploads/${filename}`;
    return c.json({ success: true, url, filename });
  } catch (err) {
    console.error("Upload error:", err);
    return c.json({ error: "Upload failed" }, 500);
  }
});

// Serve uploaded images from database — registered directly on app so it works
// in both dev (via vite-dev-server) and production environments.
app.get("/uploads/:filename{.+}", async (c) => {
  const filename = c.req.param("filename");
  try {
    const db = getDb();
    const result = await db
      .select({ mimeType: uploads.mimeType, data: uploads.data })
      .from(uploads)
      .where(eq(uploads.filename, filename));

    if (!result.length) {
      // Fallback: try local filesystem (backward compat)
      const fsPath = path.join(process.cwd(), "public/uploads", filename);
      if (fs.existsSync(fsPath) && fs.statSync(fsPath).isFile()) {
        const ext = path.extname(fsPath).toLowerCase();
        const mimeTypes: Record<string, string> = {
          ".png": "image/png", ".jpg": "image/jpeg", ".jpeg": "image/jpeg",
          ".webp": "image/webp", ".gif": "image/gif", ".svg": "image/svg+xml",
        };
        c.header("Content-Type", mimeTypes[ext] || "application/octet-stream");
        c.header("Cache-Control", "public, max-age=31536000");
        return c.body(fs.readFileSync(fsPath));
      }
      return c.json({ error: "Not found" }, 404);
    }

    const row = result[0];
    const buffer = Buffer.from(row.data, "base64");
    c.header("Content-Type", row.mimeType);
    c.header("Content-Length", String(buffer.length));
    c.header("Cache-Control", "public, max-age=31536000");
    return c.body(buffer);
  } catch {
    return c.json({ error: "Not found" }, 404);
  }
});

app.use(bodyLimit({ maxSize: 50 * 1024 * 1024 }));
app.use("/api/trpc/*", async (c) => {
  return fetchRequestHandler({
    endpoint: "/api/trpc",
    req: c.req.raw,
    router: appRouter,
    createContext,
  });
});
app.all("/api/*", (c) => c.json({ error: "Not Found" }, 404));

export default app;

if (env.isProduction) {
  const { serve } = await import("@hono/node-server");
  const { serveStaticFiles } = await import("./lib/vite");
  serveStaticFiles(app);

  const port = parseInt(process.env.PORT || "3000");
  serve({ fetch: app.fetch, port }, () => {
    console.log(`Server running on http://localhost:${port}/`);
  });
}
