import { defineConfig } from "astro/config";
import react from "@astrojs/react";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import vercel from "@astrojs/vercel/static";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  site: "https://ark.studio.ch",
  integrations: [
    react(),
    mdx(),
    sitemap({
      i18n: {
        defaultLocale: "en",
        locales: {
          en: "en",
          de: "de",
        },
      },
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
  },
  adapter: vercel({
    imageService: true,
  }),
  output: "static",
  srcDir: "src",
  image: {
    domains: [],
    remotePatterns: [],
  },
});
