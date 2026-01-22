import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';
import icon from 'astro-icon';

export default defineConfig({
  site: 'https://anthonydurot.github.io',

  integrations: [
    tailwind(),
    sitemap(),
    mdx({
      shikiConfig: { theme: 'github-dark', wrap: true },
    }),
    icon(),
  ],
  markdown: { gfm: true }
});