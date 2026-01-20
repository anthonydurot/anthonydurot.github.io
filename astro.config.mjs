// astro.config.mjs
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://your-portfolio.com', // Replace with your domain
  integrations: [
    tailwind(),
    sitemap(),
    mdx({
      // Shiki Syntax Highlighting is built-in.
      // We use 'github-dark' for a professional backend look.
      shikiConfig: {
        theme: 'github-dark',
        wrap: true, // Prevents horizontal scrolling overflow
      },
    }),
  ],
  markdown: {
    // This allows you to use standard Markdown files alongside MDX
    gfm: true,
  }
});