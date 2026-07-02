import { createRouter, publicQuery } from "./middleware";
import { projectRouter, projectGalleryRouter } from "./routers/project";
import { experienceRouter, skillRouter } from "./routers/about";
import { introductionRouter } from "./routers/introduction";
import { uploadRouter } from "./routers/upload";

export const appRouter = createRouter({
  ping: publicQuery.query(() => ({ ok: true, ts: Date.now() })),

  project: projectRouter,
  projectGallery: projectGalleryRouter,
  experience: experienceRouter,
  skill: skillRouter,
  introduction: introductionRouter,
  upload: uploadRouter,
});

export type AppRouter = typeof appRouter;
