import { defineConfig } from "astro/config";
import tailwind from "@astrojs/tailwind";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import icon from "astro-icon";
import { visit } from "unist-util-visit"; // Import essentiel

export default defineConfig({
  site: "https://anthonydurot.github.io",

  integrations: [
    tailwind(),
    sitemap(),
    mdx({
      shikiConfig: { theme: "github-dark", wrap: true },
    }),
    icon(),
  ],
  markdown: {
    remarkPlugins: [
      () => (tree) => {
        visit(tree, "code", (node) => {
          if (node.lang === "mermaid") {
            node.type = "html";
            node.value = `<div class="mermaid">${node.value}</div>`;
          }
        });
      },
    ],
  },
});
