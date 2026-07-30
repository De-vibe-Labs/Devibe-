import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const isVercel = process.env.VERCEL === "1";

export default defineConfig(async () => {
  // Netlify's Vite plugin enables local Functions during `vite`/`netlify` builds.
  // Skip it on Vercel so production SPA builds stay provider-neutral.
  const plugins = [react(), tailwindcss()];
  if (!isVercel) {
    const { default: netlify } = await import("@netlify/vite-plugin");
    plugins.push(netlify());
  }

  return {
    plugins,
    server: {
      port: 5173,
      host: true,
    },
  };
});
