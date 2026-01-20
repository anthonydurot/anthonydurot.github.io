import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  // 1. REPLACE with your GitHub username
  site: 'https://anthonydurot.github.io',

  integrations: [
    tailwind(),
    sitemap(),
    mdx({
      shikiConfig: {
        theme: 'github-dark',
        wrap: true,
      },
    }),
  ],
  markdown: {
    gfm: true,
  }
});