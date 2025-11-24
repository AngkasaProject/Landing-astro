// astro.config.mjs
// @ts-check
import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
// 1. Import adapter Cloudflare
import cloudflare from "@astrojs/cloudflare";

// https://astro.build/config
export default defineConfig({
  // 2. Tentukan output sebagai server
  output: "server",

  // 3. Tambahkan adapter Cloudflare
  adapter: cloudflare(),

  vite: {
    plugins: [tailwindcss()],
  },
});
