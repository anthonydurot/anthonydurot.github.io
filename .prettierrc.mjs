/** @type {import("prettier").Config} */
export default {
  // L'ordre est CRUCIAL : Astro d'abord, Tailwind ensuite
  plugins: ["prettier-plugin-astro", "prettier-plugin-tailwindcss"],

  overrides: [
    {
      files: "*.astro",
      options: {
        parser: "astro",
      },
    },
  ],

  // Options de base (tu peux changer selon tes goûts)
  semi: true,
  singleQuote: true,
  tabWidth: 2,
};
