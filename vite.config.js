import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

// Use a dynamic base so the build works both on GitHub Pages (needs
// /personality-quiz/) and on Vercel (root '/'). Vercel exposes the
// VERCEL environment variable during builds.
const basePath = process.env.VERCEL ? "/" : "/personality-quiz/";

export default defineConfig({
  plugins: [react()],
  base: basePath,
});
